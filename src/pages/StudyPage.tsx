import React, { useState, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  AlignmentType, 
  ImageRun, 
  PageBreak, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType, 
  BorderStyle 
} from 'docx';
import { toPng } from 'html-to-image';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { Button } from '../components/Button';
import { studiesData, StudyKey, SectionStatus } from '../data/studies';
import { PkChart } from '../components/PkChart';

const getStatusStyles = (status: SectionStatus, isActive: boolean) => {
  if (isActive) return 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(79,124,255,0.2)] text-white';
  switch (status) {
    case 'empty': return 'bg-red-500/5 text-red-400/60 border-red-500/20 hover:bg-red-500/10';
    case 'draft': return 'bg-orange-500/5 text-orange-400/60 border-orange-500/20 hover:bg-orange-500/10';
    case 'done': return 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20';
    default: return 'border-border text-text2';
  }
};

export const StudyPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const initialStudy = studiesData[(id || 'paracetamol') as StudyKey];
  
  const [tabs, setTabs] = useState(initialStudy?.tabs || []);
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id || '');
  const [chartData, setChartData] = useState<any>(null);
  const [calculationData, setCalculationData] = useState<any>(null); // Добавлено состояние для расчетов
  const [isExporting, setIsExporting] = useState(false);

  if (!initialStudy) return <div className="p-10 text-white">Исследование не найдено</div>;

  const isEverythingDone = tabs.every(tab => tab.status === 'done');
  const activeTab = tabs.find(t => t.id === activeTabId);

  // Функция для автоматического формирования текста в разделе Статистика
  const updateStatisticsSection = (data: any) => {
    const statsText = `ОБОСНОВАНИЕ РАЗМЕРА ВЫБОРКИ:\n` +
      `Согласно предоставленным данным, расчет мощности проводился для дизайна ${data.input.design}. ` +
      `При ожидаемом CV ${(data.input.CV * 100).toFixed(1)}% и целевой мощности ${(data.input.targetpower * 100).toFixed(0)}%, ` +
      `необходимое количество субъектов составляет ${data.results.base_sample_size}. ` +
      `С учетом риска выбывания (${(data.results.dropout_rate_used * 100).toFixed(0)}%), в исследование будет включено ${data.results.recommended_sample_size_with_dropout} добровольцев.`;

    setTabs(prev => prev.map(tab => 
      tab.id.toLowerCase().includes('stat') ? { ...tab, content: statsText, status: 'done' } : tab
    ));
  };

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setTabs(prev => prev.map(tab => {
      if (tab.id === activeTabId) {
        let newStatus: SectionStatus = newText.trim() === '' ? 'empty' : (tab.status === 'done' ? 'done' : 'draft');
        return { ...tab, content: newText, status: newStatus };
      }
      return tab;
    }));
  };

  const markAsDone = () => {
    setTabs(prev => prev.map(tab => tab.id === activeTabId ? { ...tab, status: 'done' } : tab));
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        // Проверяем, какой именно JSON загружен
        if (json.results && json.input) {
          setCalculationData(json);
          updateStatisticsSection(json);
          alert("Данные расчета выборки импортированы!");
        } else if (json.curve_t) {
          setChartData(json);
          alert("Данные графика загружены!");
        }
      } catch (err) {
        alert("Ошибка в JSON");
      }
    };
    reader.readAsText(file);
  };

  const exportToDocx = async () => {
    setIsExporting(true);
    let chartImage;
    const chartElement = document.getElementById('pk-chart-capture');
    if (chartElement) {
      try {
        const dataUrl = await toPng(chartElement, { backgroundColor: '#ffffff', quality: 1 });
        const resp = await fetch(dataUrl);
        chartImage = await resp.arrayBuffer();
      } catch (e) {
        console.error("Ошибка захвата графика", e);
      }
    }

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            text: "СИНОПСИС ИССЛЕДОВАНИЯ БИОЭКВИВАЛЕНТНОСТИ",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, children: [new Paragraph({ text: "Название исследования:", bold: true })] }),
                  new TableCell({ children: [new Paragraph(initialStudy.title)] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Действующее вещество:", bold: true })] }),
                  new TableCell({ children: [new Paragraph(initialStudy.drug)] }),
                ],
              }),
            ],
          }),
          ...tabs.flatMap(tab => {
            if (tab.id === '6.Charts') return [];
            return [
              new Paragraph({
                children: [new TextRun({ text: tab.label.toUpperCase(), bold: true, size: 24, color: "1A365D" })],
                spacing: { before: 300, after: 150 },
                border: { bottom: { color: "CBD5E0", style: BorderStyle.SINGLE, size: 6 } }
              }),
              new Paragraph({
                children: [new TextRun({ text: tab.content, size: 20 })],
                alignment: AlignmentType.JUSTIFY,
                spacing: { after: 200 },
              }),
            ];
          }),
          ...(chartImage ? [
            new Paragraph({ children: [new PageBreak()] }),
            new Paragraph({ text: "ПРИЛОЖЕНИЕ: ГРАФИКИ", heading: HeadingLevel.HEADING_2, alignment: AlignmentType.CENTER }),
            new Paragraph({
              children: [new ImageRun({ data: chartImage, transformation: { width: 600, height: 320 } })],
              alignment: AlignmentType.CENTER
            }),
          ] : []),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Synopsis_${id}.docx`);
    setIsExporting(false);
  };

  return (
    <main className="relative min-h-screen bg-base text-text overflow-hidden flex flex-col font-sans">
      <AnimatedBackground />

      <header className="relative z-10 w-full bg-surface1/80 backdrop-blur-md border-b border-border px-8 py-5 flex items-center justify-between">
        <div>
          <button onClick={() => navigate('/dashboard')} className="text-xs text-primary font-bold uppercase mb-1 block">
            ← К СПИСКУ ПРОЕКТОВ
          </button>
          <h1 className="text-2xl font-black text-white italic tracking-tight">
            BioEQ<span className="text-primary font-normal not-italic">protocol</span>
          </h1>
        </div>
        
        <div className="flex gap-3">
          {isEverythingDone ? (
            <Button size="sm" onClick={exportToDocx} disabled={isExporting} className="bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              {isExporting ? "ГЕНЕРАЦИЯ..." : "СКАЧАТЬ DOCX"}
            </Button>
          ) : (
            <div className="text-[10px] text-orange-400 border border-orange-500/20 px-4 py-2 rounded-xl bg-orange-500/5 uppercase font-bold tracking-widest">
              ЗАВЕРШИТЕ ВСЕ РАЗДЕЛЫ ДЛЯ ЭКСПОРТА
            </div>
          )}
        </div>
      </header>

      <div className="relative z-10 flex flex-1 overflow-hidden mx-auto w-full max-w-[1600px] p-6 gap-8">
        <aside className="w-80 flex-shrink-0 flex flex-col gap-3 overflow-hidden">
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <p className="text-[10px] font-black uppercase text-text2/40 tracking-[0.3em] ml-2 mb-2">Структура синопсиса</p>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`w-full text-left px-5 py-4 rounded-2xl border mb-2 transition-all duration-300 ${getStatusStyles(tab.status, activeTabId === tab.id)}`}
              >
                <div className="font-bold text-sm mb-1">{tab.label}</div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${tab.status === 'done' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : tab.status === 'draft' ? 'bg-orange-500' : 'bg-red-500'}`} />
                  <span className="text-[10px] font-bold uppercase opacity-50 tracking-tighter">
                    {tab.status === 'empty' ? 'Пусто' : tab.status === 'draft' ? 'В работе' : 'Готово'}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* ЛЕГЕНДА СТАТУСОВ ВНИЗУ САЙДБАРА */}
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
              <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">ГОТОВО</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]"></div>
              <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">В РАЗРАБОТКЕ</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"></div>
              <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">ПУСТОЕ</span>
            </div>
          </div>
        </aside>

        <section className="flex-1 flex flex-col bg-surface1/40 backdrop-blur-xl border border-white/5 rounded-[32px] shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-8 py-5">
            <h2 className="font-bold text-xl text-white">{activeTab?.label}</h2>
            <div className="flex gap-2">
              {activeTabId.toLowerCase().includes('stat') && (
                <label className="cursor-pointer bg-primary/20 border border-primary/30 text-primary px-4 py-2 rounded-xl text-[10px] font-black hover:bg-primary/30 transition-all uppercase tracking-widest">
                  Импорт JSON
                  <input type="file" accept=".json" className="hidden" onChange={handleFileUpload} />
                </label>
              )}
              <Button size="sm" onClick={markAsDone} className="bg-green-600 hover:bg-green-500 text-xs px-6 uppercase font-black">Завершить</Button>
            </div>
          </div>

          <div className="p-8 flex-1 flex flex-col gap-8 overflow-y-auto custom-scrollbar">
            <textarea
              value={activeTab?.content}
              onChange={handleTextChange}
              className="w-full flex-1 bg-transparent border-none text-text2 focus:ring-0 resize-none outline-none leading-relaxed text-xl"
              placeholder="Введите текст раздела..."
            />

            {/* БЛОЧНЫЙ ДАШБОРД СТАТИСТИКИ */}
            {activeTabId.toLowerCase().includes('stat') && calculationData && (
              <div className="grid grid-cols-12 gap-4 animate-in zoom-in-95 duration-500">
                <div className="col-span-7 bg-white/5 rounded-[28px] p-6 border border-white/10 shadow-inner">
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-8">Распределение выборки (N)</p>
                  <div className="flex items-end gap-12 h-32 px-6">
                    <div className="flex-1 flex flex-col items-center gap-4">
                        <span className="text-lg font-black text-white/40">{calculationData.results.base_sample_size}</span>
                        <div className="w-full bg-white/10 rounded-t-xl transition-all duration-1000" style={{ height: `${(calculationData.results.base_sample_size / calculationData.results.recommended_sample_size_with_dropout) * 100}%` }}>
                           <div className="w-full h-full bg-primary/20 border-t border-primary/40"></div>
                        </div>
                        <span className="text-[9px] font-bold opacity-30 uppercase">Расчетное</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-4">
                        <span className="text-2xl font-black text-green-400">{calculationData.results.recommended_sample_size_with_dropout}</span>
                        <div className="w-full bg-green-500/20 rounded-t-xl border-t-4 border-green-500 shadow-[0_0_25px_rgba(34,197,94,0.2)]" style={{ height: '100%' }}></div>
                        <span className="text-[9px] font-bold text-green-500 uppercase">С учетом Dropout</span>
                    </div>
                  </div>
                </div>

                <div className="col-span-5 flex flex-col gap-4">
                   <div className="flex-1 bg-white/5 rounded-[28px] p-6 border border-white/10 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-black opacity-30 uppercase">Стат. Мощность</span>
                      </div>
                      <div className="text-4xl font-black text-primary italic tracking-tighter">
                        {(calculationData.results.achieved_power * 100).toFixed(1)}%
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                         <div className="h-full bg-primary shadow-[0_0_10px_#4f7cff]" style={{ width: `${calculationData.results.achieved_power * 100}%` }}></div>
                      </div>
                   </div>
                   <div className="flex-1 bg-white/5 rounded-[28px] p-6 border border-white/10 flex flex-col justify-between">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black opacity-30 uppercase">Дизайн</span>
                        <div className="px-2 py-1 bg-orange-500/20 rounded text-[9px] text-orange-400 font-bold border border-orange-500/30">CV {(calculationData.input.CV * 100).toFixed(1)}%</div>
                      </div>
                      <div className="text-xl font-black text-white uppercase tracking-tight">
                        {calculationData.input.design}
                      </div>
                   </div>
                </div>
              </div>
            )}

            {activeTabId === '6.Charts' && (
              <div id="pk-chart-capture" className="mt-auto p-6 bg-[#0f1b34] rounded-3xl border border-white/10 shadow-inner">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white/90 font-bold text-xs uppercase tracking-widest">Визуализация ФК кривых</h3>
                  <label className="cursor-pointer bg-primary/10 border border-primary/30 text-primary px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary/20 transition-all">
                    Загрузить plot_data.json
                    <input type="file" accept=".json" className="hidden" onChange={handleFileUpload} />
                  </label>
                </div>
                <PkChart data={chartData} />
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};
