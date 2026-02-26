// src/components/PkChart.tsx
import { useMemo } from 'react';
import { ComposedChart, Line, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PkChartProps {
  data: any;
}

export const PkChart = ({ data }: PkChartProps) => {
  // Преобразуем JSON из Python в формат, понятный Recharts
  const chartData = useMemo(() => {
    if (!data || !data.curve_t) return [];
    
    const combinedData: any[] = [];
    const maxLen = Math.max(data.curve_t.length, data.curve_ref_X?.length || 0);

    for (let i = 0; i < maxLen; i++) {
      combinedData.push({
        time: data.curve_t[i] !== undefined ? Number(data.curve_t[i].toFixed(2)) : null,
        cp: data.curve_Cp[i] !== undefined ? Number(data.curve_Cp[i].toFixed(2)) : null,
        refX: data.curve_ref_X?.[i] !== undefined ? Number(data.curve_ref_X[i].toFixed(2)) : null,
        refY: data.curve_ref_Y?.[i] !== undefined ? Number(data.curve_ref_Y[i].toFixed(2)) : null,
      });
    }
    return combinedData;
  }, [data]);

  if (chartData.length === 0) return null;

  return (
    <div className="h-[400px] w-full bg-surface2 rounded-xl p-4 border border-border">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="time" 
            type="number" 
            domain={['auto', 'auto']} 
            stroke="rgba(255,255,255,0.5)" 
            label={{ value: 'Время (ч)', position: 'insideBottomRight', offset: -5, fill: '#fff' }} 
          />
          <YAxis 
            stroke="rgba(255,255,255,0.5)" 
            label={{ value: 'Концентрация', angle: -90, position: 'insideLeft', fill: '#fff' }} 
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f1b34', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
          />
          <Legend />
          
          {/* Линия предсказания (curve_Cp). animationDuration отвечает за плавное построение */}
          <Line 
            type="monotone" 
            data={chartData.filter(d => d.time !== null)} 
            dataKey="cp" 
            stroke="#4f7cff" 
            strokeWidth={3}
            dot={false}
            name="Модель (Тест)" 
            animationDuration={2500} // Плавное появление за 2.5 секунды
          />
          
          {/* Точки референса (curve_ref_Y) */}
          <Scatter 
            data={chartData.filter(d => d.refX !== null)} 
            xAxisId={0}
            dataKey="refY" 
            fill="#2af3c0" 
            name="Данные (Реф)" 
            animationDuration={1500}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};