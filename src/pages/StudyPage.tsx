// src/pages/StudyPage.tsx
import { useState, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { Button } from '../components/Button';
import { studiesData, StudyKey, SectionStatus } from '../data/studies';
import { PkChart } from '../components/PkChart';
import plotData from '../data/plot_data.json';

// Вспомогательная функция для определения цвета статуса
const getStatusColor = (status: SectionStatus) => {
  switch (status) {
    case 'empty': return 'bg-red-500/20 text-red-400 border-red-500/50';
    case 'draft': return 'bg-warning/20 text-warning border-warning/50';
    case 'done': return 'bg-success/20 text-success border-success/50';
    default: return 'bg-surface2 text-text2 border-border';
  }
};

export const StudyPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Инициализация данных
  const initialStudy = studiesData[(id || 'paracetamol') as StudyKey];
  const [tabs, setTabs] = useState(initialStudy?.tabs || []);
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id || '');
  const [chartData, setChartData] = useState<any>(null);

  if (!initialStudy) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base text-white">
        <h2>Исследование не найдено</h2>
        <Button onClick={() => navigate('/dashboard')} className="ml-4">Назад</Button>
      </div>
    );
  }

  const activeTab = tabs.find(t => t.id === activeTabId);

  // Обработчик изменения текста
  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    
    // Автоматически меняем статус в зависимости от текста
    let newStatus: SectionStatus = 'draft';
    if (newText.trim().length === 0) newStatus = 'empty';
    if (newText.trim().length > 150 && activeTab?.status !== 'done') newStatus = 'draft'; // Пример: если текста много, но еще не "done"

    setTabs(prev => prev.map(tab => 
      tab.id === activeTabId ? { ...tab, content: newText, status: tab.status === 'done' && newText.length > 0 ? 'done' : newStatus } : tab
    ));
  };

  // Ручная смена статуса на "Готово"
  const markAsDone = () => {
    setTabs(prev => prev.map(tab => 
      tab.id === activeTabId ? { ...tab, status: 'done' } : tab
    ));
  };

  // Обработчик загрузки JSON из Python
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        setChartData(json);
      } catch (err) {
        alert("Ошибка чтения JSON файла");
      }
    };
    reader.readAsText(file);
  };

  return (
    <main className="relative min-h-screen bg-base text-text overflow-hidden flex flex-col">
      <AnimatedBackground />

      {/* Верхняя панель (Header) */}
      <header className="relative z-10 w-full bg-surface1 border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <button onClick={() => navigate('/dashboard')} className="text-sm text-primary hover:underline mb-1">
            ← Вернуться в проекты
          </button>
          <h1 className="text-xl font-bold text-white">{initialStudy.title}</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Сохранить шаблон</Button>
          <Button>Сгенерировать отчет</Button>
        </div>
      </header>

      {/* Основной контент (Сайдбар + Редактор) */}
      <div className="relative z-10 flex flex-1 overflow-hidden mx-auto w-full max-w-[1400px] p-4 gap-6">
        
        {/* ЛЕВОЕ МЕНЮ (Оглавление) */}
        <aside className="w-72 flex-shrink-0 flex flex-col gap-2 overflow-y-auto">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-text2 mb-2 px-2">Оглавление</h3>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`text-left px-4 py-3 rounded-lg border transition-all duration-200 ${
                activeTabId === tab.id 
                  ? 'bg-surface2 border-primary shadow-[0_0_15px_rgba(79,124,255,0.2)]' 
                  : `${getStatusColor(tab.status)} hover:brightness-110`
              }`}
            >
              <div className="font-medium text-sm">{tab.label}</div>
              {/* Маленький индикатор статуса */}
              <div className="text-[10px] uppercase mt-1 opacity-70">
                {tab.status === 'empty' ? 'Пусто' : tab.status === 'draft' ? 'В работе' : 'Готово'}
              </div>
            </button>
          ))}
        </aside>

        {/* ПРАВАЯ ЧАСТЬ (Редактор) */}
        <section className="flex-1 flex flex-col bg-surface1 border border-border rounded-xl shadow-xl overflow-hidden">
          {/* Тулбар редактора */}
          <div className="flex items-center justify-between border-b border-border bg-surface2 px-4 py-3">
            <h2 className="font-semibold text-lg text-white">{activeTab?.label}</h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={markAsDone} className={activeTab?.status === 'done' ? 'opacity-50 pointer-events-none' : ''}>
                Утвердить раздел
              </Button>
            </div>
          </div>

          {/* Текстовая область */}
          <div className="p-4 flex-1 flex flex-col gap-4 overflow-y-auto">
            <textarea
              value={activeTab?.content}
              onChange={handleTextChange}
              placeholder="Начните писать здесь или сгенерируйте с помощью ИИ..."
              className="w-full flex-1 bg-transparent border-none text-text2 focus:ring-0 resize-none outline-none leading-relaxed"
            />

            {/* Блок графиков (показываем только во вкладке ФК Графики) */}
            {activeTab?.id === '6.Charts' && (
              <div className="mt-4 p-4 rounded-xl border border-dashed border-primary/50 bg-primary/5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-medium">Фармакокинетическое моделирование</h3>
                  <label className="cursor-pointer bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md text-sm transition">
                    Загрузить JSON из Python
                    <input type="file" accept=".json" className="hidden" onChange={handleFileUpload} />
                  </label>
                </div>
                
                {chartData ? (
                  <PkChart data={chartData} />
                ) : (
                  <div className="h-40 flex items-center justify-center text-text2 text-sm">
                    Загрузите файл plot_data.json для построения графика
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