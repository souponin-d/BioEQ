import { useMemo } from 'react';
import { 
  ComposedChart, 
  Line, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface PkChartProps {
  data: any;
}

export const PkChart = ({ data }: PkChartProps) => {
  // 1. Плавная линия модели (Тест)
  const lineData = useMemo(() => {
    if (!data?.curve_t || !data?.curve_Cp) return [];
    return data.curve_t.map((t: number, i: number) => ({
      time: Number(t.toFixed(3)),
      cp: Number(data.curve_Cp[i]?.toFixed(3))
    }));
  }, [data]);

  // 2. Данные референса (Зеленые точки)
  const scatterData = useMemo(() => {
    if (!data?.curve_ref_X || !data?.curve_ref_Y) return [];
    return data.curve_ref_X.map((x: number, i: number) => ({
      time: Number(x.toFixed(3)),
      refY: Number(data.curve_ref_Y[i]?.toFixed(3))
    }));
  }, [data]);

  // 3. ТОЧКИ ЗАБОРА КРОВИ (Schedule) — под твои новые обозначения
  const scheduleData = useMemo(() => {
    // Проверяем наличие новых ключей в корне объекта data
    if (!data?.timepoints_h || !data?.expected_Cp) return [];
    return data.timepoints_h.map((t: number, i: number) => ({
      time: Number(t.toFixed(3)),
      scheduledCp: Number(data.expected_Cp[i]?.toFixed(3))
    }));
  }, [data]);

  if (!data || (lineData.length === 0 && scatterData.length === 0 && scheduleData.length === 0)) {
    return <div className="h-[450px] flex items-center justify-center text-white/20 italic border border-white/5 rounded-2xl">Ожидание корректных данных...</div>;
  }

  return (
    <div className="h-[450px] w-full bg-[#0f1b34]/50 rounded-2xl p-6 border border-white/5 shadow-2xl">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          
          <XAxis 
            dataKey="time" 
            type="number" 
            domain={[0, 'auto']} 
            stroke="rgba(255,255,255,0.3)" 
            fontSize={12}
            tickCount={12}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.3)" 
            fontSize={12}
          />
          
          <Tooltip 
            contentStyle={{ backgroundColor: '#1a2642', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
            itemStyle={{ fontSize: '12px' }}
          />
          <Legend verticalAlign="top" height={40} />
          
          {/* РЕФЕРЕНС: Пунктир и Точки (Зеленый) */}
          <Line 
            data={scatterData}
            type="linear" 
            dataKey="refY" 
            stroke="#2af3c0" 
            strokeWidth={1}
            strokeDasharray="5 5" 
            dot={false}
            name="Референс (Линия)"
            legendType="none"
          />
          <Scatter 
            data={scatterData}
            dataKey="refY" 
            fill="#2af3c0" 
            name="Референс (Точки)" 
          />

          {/* ТЕСТ: Плавная кривая (Синий) */}
          <Line 
            data={lineData}
            type="monotone" 
            dataKey="cp" 
            stroke="#4f7cff" 
            strokeWidth={3}
            dot={false}
            name="Тестовый (Модель)" 
          />

          {/* SCHEDULE: Точки забора крови (Желтый) */}
          <Scatter 
            data={scheduleData}
            dataKey="scheduledCp" 
            fill="#fbbf24" 
            stroke="#000"
            strokeWidth={1}
            name="Точки отбора (Schedule)" 
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};