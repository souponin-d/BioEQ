import { z } from 'zod';

export const formSchema = z
  .object({
    inn: z.string().min(1, 'Поле «INN (МНН)» обязательно для заполнения'),
    dosage_form: z.enum(['Таблетки', 'Капсулы', 'Раствор', 'Суспензия', 'Инъекционная форма', 'Другое'], {
      required_error: 'Выберите лекарственную форму'
    }),
    dosage_form_other: z.string().optional(),
    dosage: z.string().min(1, 'Поле «Дозировка» обязательно для заполнения'),
    cvintra: z.enum(['Низкая', 'Высокая', 'Определить автоматически'], {
      required_error: 'Выберите параметр CVintra'
    }),
    rsabe: z.enum(['Да', 'Нет', 'Определить автоматически'], {
      required_error: 'Выберите необходимость применения RSABE'
    }),
    preferred_design: z.enum(['Определить автоматически', '2×2 crossover', 'Replicate', 'Параллельный'], {
      required_error: 'Выберите предпочтительный дизайн'
    }),
    administration_mode: z.array(z.enum(['Натощак', 'После еды', 'Оба варианта'])).min(1, 'Выберите минимум один режим приёма'),
    study_type: z.enum(['Однократное введение', 'Многократное введение', 'Определить автоматически'], {
      required_error: 'Выберите тип исследования'
    }),
    additional_requirements: z.object({
      gender: z.enum(['Мужчины', 'Женщины', 'Оба пола', '']).optional(),
      age_range: z.string().optional(),
      other_constraints: z.string().optional()
    })
  })
  .superRefine((data, ctx) => {
    if (data.dosage_form === 'Другое' && !data.dosage_form_other?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['dosage_form_other'],
        message: 'Укажите лекарственную форму вручную'
      });
    }
  });

export type BioEQFormSchema = z.infer<typeof formSchema>;
