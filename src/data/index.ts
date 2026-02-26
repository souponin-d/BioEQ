import paracetamolPlot from './plot_data.json';
import paracetamolReport from './be_sample_size_report.json';

export const studyDataMap: Record<string, any> = {
  "paracetamol": {
    ...paracetamolPlot,
    ...paracetamolReport
  }
};
// Выведи в лог для проверки при загрузке
console.log('Данные в StudyDataMap:', studyDataMap);