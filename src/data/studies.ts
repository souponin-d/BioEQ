// src/data/studies.ts

export type SectionStatus = 'empty' | 'draft' | 'done';

export interface StudyTab {
  id: string;
  label: string;
  content: string;
  status: SectionStatus;
}

export const studiesData = {
  paracetamol: {
    id: 'paracetamol',
    title: 'Bioequivalence of a New Pediatric Paracetamol',
    drug: 'Парацетамол (суспензия 24 мг/мл)',
    sponsor: 'Haleon',
    phase: 'Фаза I, Биоэквивалентность',
    tabs: [
      {
        id: '1.1.Synopsis',
        label: '1.1. Синопсис',
        status: 'done' as SectionStatus,
        content: `Название: Биоэквивалентность новой педиатрической пероральной суспензии парацетамола по сравнению с коммерческим препаратом у здоровых взрослых.\n\nОбоснование: Разработана новая пероральная форма парацетамола с тем же количеством парацетамола (24 мг/мл), что и коммерческий препарат, но с меньшим количеством мальтитола и сорбитола.`
      },
      {
        id: '3.Objectives',
        label: '3. Цели и конечные точки',
        status: 'draft' as SectionStatus,
        content: `Основная цель — установить биоэквивалентность новой педиатрической формы (тестируемый препарат) по сравнению с коммерческим препаратом (референтный препарат).\n\nПервичными конечными точками были AUC0-tlast, Cmax и tmax.`
      },
      {
        id: '4.Design',
        label: '4. Дизайн исследования',
        status: 'done' as SectionStatus,
        content: `Это открытое исследование фазы I, в котором здоровые взрослые добровольцы получали однократную дозу 42 мл (1 г парацетамола) тестируемого или референтного препарата.\n\nУчастники получали оба препарата в рандомизированном порядке с периодом отмывки 72 часа.`
      },
      {
        id: '5.Stats',
        label: '5. Статистика и выборка',
        status: 'empty' as SectionStatus,
        content: `` 
      },
      {
        id: '6.Charts',
        label: '6. ФК Графики',
        status: 'draft' as SectionStatus,
        content: `Было рандомизировано 35 участников. Биоэквивалентность определялась, если 90% ДИ для отношения средних первичных ФК параметров находились в пределах от 80.00% до 125.00%.`
      }
    ]
  }
};

export type StudyKey = keyof typeof studiesData;