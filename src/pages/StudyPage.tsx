import { useState, type ChangeEvent, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';
import { 
  Document, Packer, Paragraph, HeadingLevel, 
  AlignmentType, ImageRun, PageBreak 
} from 'docx';
import { toPng } from 'html-to-image';

// Твои компоненты
import { AnimatedBackground } from '../components/AnimatedBackground';
import { Button } from '../components/Button';
import { PkChart } from '../components/PkChart';

// Твои данные
import { studiesData, StudyKey, SectionStatus } from '../data/studies';
import { studyDataMap } from '../data'; 

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
  const currentStudyId = (id || 'paracetamol') as StudyKey;
  
  const initialStudy = useMemo(() => studiesData[currentStudyId], [currentStudyId]);
  
  const [tabs, setTabs] = useState(initialStudy?.tabs || []);
  const [activeTabId, setActiveTabId] = useState('');
  const [chartData, setChartData] = useState<any>(null);
  const [calculationData, setCalculationData] = useState<any>(null);
  const [isExporting, setIsExporting] = useState(false);

  // --- ЛОГИКА ЗАГРУЗКИ КОНТЕНТА И ДАННЫХ ---
  useEffect(() => {
    if (!initialStudy) return;

    // 1. Наполнение текстами из твоего документа (Synopsis_paracetamol)
    const enrichedTabs = initialStudy.tabs.map(tab => {
      switch(tab.id) {
        case '1.Header': return { ...tab, status: 'done' as SectionStatus, content: `ПРОТОКОЛ №: 218241 (CTR-PARA-2024)\nНАЗВАНИЕ: Открытое рандомизированное двухпериодное перекрестное исследование в двух последовательностях для оценки биоэквивалентности новой детской пероральной суспензии парацетамола (24 мг/мл) по сравнению с представленной на рынке рецептурой.\n\nСПОНСОР: Haleon CH SARL.\nЦЕНТР: Quinta-Analytica s.r.o., Чехия.` };
        case '2.Objectives': return { ...tab, status: 'done' as SectionStatus, content: `ЦЕЛЬ: Продемонстрировать биоэквивалентность новой рецептуры (Тест) по сравнению с текущей (Референс) натощак в дозе 1000 мг.\n\nБЕЗОПАСНОСТЬ: Оценка переносимости и регистрация нежелательных явлений (НЯ) у здоровых добровольцев.` };
        case '3.Rationale': return { ...tab, status: 'done' as SectionStatus, content: `ОБОСНОВАНИЕ: Парацетамол — препарат первой линии. Новая рецептура использует АФИ с микронизированным размером частиц для улучшения стабильности суспензии и потенциального ускорения растворения.` };
        case '5.Design': return { ...tab, status: 'done' as SectionStatus, content: `ДИЗАЙН: Одноцентровое, открытое, рандомизированное, двухпериодное, перекрестное исследование.\nПЕРИОД ОТМЫВКИ: Минимум 3 дня (72 часа) между приемами препарата.` };
        case '7.Bioanalysis': return { ...tab, status: 'done' as SectionStatus, content: `МЕТОД: ВЭЖХ-МС/МС (HPLC-MS/MS).\nНИЖНИЙ ПРЕДЕЛ (LLOQ): 50.0 нг/мл.\nОБЪЕМ ОБРАЗЦА: 100 мкл плазмы крови.` };
        case '9.Results': return { ...tab, status: 'done' as SectionStatus, content: `ФК ПАРАМЕТРЫ (Grim J., 2024):\nCmax: GMR 102.7% (94.1–112.1%)\nAUC0-t: GMR 101.3% (97.8–104.9%)\n\nВЫВОД: Препараты биоэквивалентны по критериям ЕЭК (80-125%).` };
        default: return tab;
      }
    });

    setTabs(enrichedTabs);
    setActiveTabId(enrichedTabs[0]?.id || '');

    // 2. Авто-загрузка данных для визуализации (JSON файлы)
    const autoData = studyDataMap[currentStudyId];
    if (autoData) {
      if (autoData.curve_t) setChartData(autoData);
      if (autoData.results) {
        setCalculationData(autoData);
        // Вставляем расчет в 8 раздел
        const statsContent = `ОБОСНОВАНИЕ РАЗМЕРА ВЫБОРКИ:\nСогласно расчету для дизайна ${autoData.input.design}, при ожидаемом CV ${(autoData.input.CV * 100).toFixed(1)}% необходимый размер выборки составляет ${autoData.results.base_sample_size} человек.\n\nС учетом коэффициента выбывания ${(autoData.results.dropout_rate_used * 100).toFixed(0)}%, рекомендуется включить ${autoData.results.recommended_sample_size_with_dropout} добровольцев.`;
        setTabs(prev => prev.map(t => t.id === '8.Statistics' ? { ...t, content: statsContent, status: 'done' } : t));
      }
    }
  }, [currentStudyId, initialStudy]);

  const activeTab = tabs.find(t => t.id === activeTabId);

  // Обработка изменений текста
  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setTabs(prev => prev.map(tab => tab.id === activeTabId ? { ...tab, content: newText, status: 'draft' } : tab));
  };

  const markAsDone = () => {
    setTabs(prev => prev.map(tab => tab.id === activeTabId ? { ...tab, status: 'done' } : tab));
  };

  const isEverythingDone = tabs.every(t => t.status === 'done');

  // Функция экспорта в Word
  const exportToDocx = async () => {
    setIsExporting(true);
    let chartImg;
    const chartEl = document.getElementById('pk-chart-capture');
    if (chartEl) {
      try {
        const dataUrl = await toPng(chartEl, { backgroundColor: '#ffffff', quality: 1 });
        const resp = await fetch(dataUrl);
        chartImg = await resp.arrayBuffer();
      } catch (e) { console.error("Ошибка захвата графика", e); }
    }

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ text: "СИНОПСИС ИССЛЕДОВАНИЯ", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }),
          ...tabs.filter(t => t.id !== 'chart_section').flatMap(tab => [
            new Paragraph({ text: tab.label.toUpperCase(), heading: HeadingLevel.HEADING_2, spacing: { before: 200 } }),
            new Paragraph({ text: tab.content, alignment: AlignmentType.JUSTIFY })
          ]),
          ...(chartImg ? [
            new Paragraph({ children: [new PageBreak()] }),
            new Paragraph({ text: "ВИЗУАЛИЗАЦИЯ ДАННЫХ", heading: HeadingLevel.HEADING_2, alignment: AlignmentType.CENTER }),
            new Paragraph({ children: [new ImageRun({ data: chartImg, transformation: { width: 600, height: 350 } })], alignment: AlignmentType.CENTER })
          ] : [])
        ]
      }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Synopsis_${currentStudyId}.docx`);
    setIsExporting(false);
  };

  return (
    <main className="relative min-h-screen bg-base text-text flex flex-col font-sans overflow-hidden">
      <AnimatedBackground />

      {/* HEADER */}
      <header className="relative z-10 w-full bg-surface1/80 backdrop-blur-md border-b border-border px-8 py-5 flex items-center justify-between">
        <div>
          <button onClick={() => navigate('/dashboard')} className="text-xs text-primary font-bold uppercase mb-1 block hover:underline">← НАЗАД</button>
          <h1 className="text-2xl font-black text-white italic">BioEQ<span className="text-primary not-italic">protocol</span></h1>
        </div>
        <Button size="sm" onClick={exportToDocx} disabled={isExporting || !isEverythingDone}>
          {isExporting ? "ГЕНЕРАЦИЯ..." : "СКАЧАТЬ DOCX"}
        </Button>
      </header>

      <div className="relative z-10 flex flex-1 overflow-hidden mx-auto w-full max-w-[1600px] p-6 gap-8">
        
        {/* SIDEBAR */}
        <aside className="w-80 flex-shrink-0 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`w-full text-left px-5 py-4 rounded-2xl border transition-all duration-300 ${getStatusStyles(tab.status, activeTabId === tab.id)}`}
            >
              <div className="font-bold text-sm mb-1">{tab.label}</div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase opacity-50">
                 <div className={`w-2 h-2 rounded-full ${tab.status === 'done' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500'}`} />
                 {tab.status}
              </div>
            </button>
          ))}
        </aside>

        {/* CONTENT AREA */}
        <section className="flex-1 flex flex-col bg-surface1/40 backdrop-blur-xl border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-8 py-5">
            <h2 className="font-bold text-xl text-white tracking-tight">{activeTab?.label}</h2>
            <Button size="sm" onClick={markAsDone} className="bg-green-600 hover:bg-green-500 transition-colors">Завершить раздел</Button>
          </div>

          <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
            <textarea
              value={activeTab?.content}
              onChange={handleTextChange}
              className="w-full h-64 bg-transparent border-none text-text2 focus:ring-0 resize-none outline-none leading-relaxed text-xl mb-10"
              placeholder="Текст будет подгружен автоматически..."
            />

            {/* БЛОК СТАТИСТИКИ (N) - КАК НА ФОТО */}
            {activeTabId === '8.Statistics' && calculationData && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                {/* График выборки */}
                <div className="bg-white/5 p-8 rounded-[32px] border border-white/10 flex flex-col justify-between min-h-[340px] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary"><path d="M18 20V10M12 20V4M6 20v-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div>
                    <div className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mb-1">Расчет объема выборки</div>
                    <div className="text-white/40 text-xs">Коэффициент выбывания: {(calculationData.results.dropout_rate_used * 100).toFixed(0)}%</div>
                  </div>
                  
                  <div className="flex items-end justify-center gap-10 h-40">
                    <div className="flex flex-col items-center gap-3 w-20">
                      <div className="text-xs font-bold text-white/30 tracking-tighter">Base N</div>
                      <div className="w-full bg-white/10 rounded-t-2xl border-x border-t border-white/5" style={{ height: '60%' }}></div>
                      <div className="text-2xl font-bold text-white/50">{calculationData.results.base_sample_size}</div>
                    </div>
                    <div className="flex flex-col items-center gap-3 w-24 relative">
                      <div className="absolute -top-8 bg-primary/20 text-primary text-[9px] font-bold px-2 py-0.5 rounded-full animate-bounce">Final Target</div>
                      <div className="w-full bg-gradient-to-t from-primary/20 to-primary/60 border-t-4 border-primary rounded-t-2xl shadow-[0_0_40px_rgba(79,124,255,0.25)] animate-grow-height" style={{ height: '100%' }}></div>
                      <div className="text-5xl font-black text-white">{calculationData.results.recommended_sample_size_with_dropout}</div>
                    </div>
                  </div>
                </div>

                {/* Круговой индикатор мощности */}
                <div className="bg-white/5 p-8 rounded-[32px] border border-white/10 flex flex-col justify-between items-center">
                  <div className="w-full text-left">
                    <div className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mb-1">Статистическая мощность</div>
                    <div className="text-white/40 text-xs">Дизайн: {calculationData.input.design}</div>
                  </div>

                  <div className="relative flex items-center justify-center my-4">
                    <svg className="w-44 h-44 transform -rotate-90">
                      <circle cx="88" cy="88" r="78" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-white/5" />
                      <circle 
                        cx="88" cy="88" r="78" stroke="currentColor" strokeWidth="10" fill="transparent" 
                        strokeDasharray={490}
                        strokeDashoffset={490 - (490 * calculationData.results.achieved_power)}
                        className="text-primary transition-all duration-[1.5s] ease-out"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <div className="text-5xl font-black text-white italic">{(calculationData.results.achieved_power * 100).toFixed(1)}%</div>
                      <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">Achieved Power</div>
                    </div>
                  </div>

                  <div className="w-full grid grid-cols-2 gap-4 border-t border-white/5 pt-6 mt-2">
                    <div className="text-center">
                       <div className="text-[9px] text-white/30 uppercase font-bold mb-1">Intra-subject CV</div>
                       <div className="text-lg font-bold text-white">{(calculationData.input.CV * 100).toFixed(1)}%</div>
                    </div>
                    <div className="text-center border-l border-white/5">
                       <div className="text-[9px] text-white/30 uppercase font-bold mb-1">Target Power</div>
                       <div className="text-lg font-bold text-white">{(calculationData.input.targetpower * 100).toFixed(0)}%</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* БЛОК ГРАФИКА */}
            {activeTabId === 'chart_section' && (
              <div id="pk-chart-capture" className="p-8 bg-[#0f1b34] rounded-[40px] border border-white/10 min-h-[480px] shadow-inner relative group">
                {chartData ? (
                   <>
                    <div className="absolute top-6 right-10 flex gap-4 z-20">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(79,124,255,0.8)]"></div>
                        <span className="text-[10px] font-bold text-white/60">Test</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-white/20 border border-white/40"></div>
                        <span className="text-[10px] font-bold text-white/60">Reference</span>
                      </div>
                    </div>
                    <PkChart data={chartData} />
                   </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-white/20 py-32 italic">
                     <div className="text-4xl mb-4 opacity-5">📉</div>
                     Данные графика не обнаружены в plot_data.json
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};