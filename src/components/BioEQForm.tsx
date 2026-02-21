import { ReactNode, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, BioEQFormSchema } from '../types/formSchema';
import { sendBioEQRequest } from '../services/api';
import { BioEQFormData } from '../types/types';

const administrationOptions = ['Натощак', 'После еды', 'Оба варианта'] as const;

const normalizePayload = (data: BioEQFormSchema): BioEQFormData => ({
  inn: data.inn,
  dosage_form: data.dosage_form,
  dosage_form_other: data.dosage_form === 'Другое' ? data.dosage_form_other?.trim() : undefined,
  dosage: data.dosage,
  cvintra: data.cvintra,
  rsabe: data.rsabe,
  preferred_design: data.preferred_design,
  administration_mode: data.administration_mode,
  study_type: data.study_type,
  additional_requirements: {
    gender: data.additional_requirements.gender || undefined,
    age_range: data.additional_requirements.age_range?.trim() || undefined,
    other_constraints: data.additional_requirements.other_constraints?.trim() || undefined
  }
});

const baseInput =
  'mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-primary outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20';

export const BioEQForm = () => {
  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<BioEQFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inn: '',
      dosage_form: 'Таблетки',
      dosage_form_other: '',
      dosage: '',
      cvintra: 'Определить автоматически',
      rsabe: 'Определить автоматически',
      preferred_design: 'Определить автоматически',
      administration_mode: [],
      study_type: 'Определить автоматически',
      additional_requirements: {
        gender: '',
        age_range: '',
        other_constraints: ''
      }
    }
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const dosageForm = watch('dosage_form');

  const onSubmit = async (values: BioEQFormSchema) => {
    try {
      await sendBioEQRequest(normalizePayload(values));
      setSuccessMessage('Запрос успешно отправлен.');
      setErrorMessage('');
    } catch {
      setErrorMessage('Ошибка отправки данных. Пожалуйста, попробуйте ещё раз.');
      setSuccessMessage('');
    }
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
      <Section title="1. Основная информация о препарате">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="INN (МНН)" error={errors.inn?.message}>
            <input className={baseInput} placeholder="Например, Метформин" {...register('inn')} />
          </Field>
          <Field label="Лекарственная форма" error={errors.dosage_form?.message}>
            <select className={baseInput} {...register('dosage_form')}>
              {['Таблетки', 'Капсулы', 'Раствор', 'Суспензия', 'Инъекционная форма', 'Другое'].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>
          {dosageForm === 'Другое' && (
            <div className="md:col-span-2">
              <Field label="Уточните лекарственную форму" error={errors.dosage_form_other?.message}>
                <input className={baseInput} placeholder="Введите вручную" {...register('dosage_form_other')} />
              </Field>
            </div>
          )}
          <Field label="Дозировка" error={errors.dosage?.message}>
            <input className={baseInput} placeholder='Например, "500 мг", "10 мг/мл"' {...register('dosage')} />
          </Field>
        </div>
      </Section>

      <Section title="2. Параметры вариабельности">
        <div className="grid gap-4 md:grid-cols-2">
          <RadioGroupField
            title="CVintra"
            name="cvintra"
            options={['Низкая', 'Высокая', 'Определить автоматически']}
            control={control}
            error={errors.cvintra?.message}
          />
          <RadioGroupField
            title="RSABE"
            name="rsabe"
            options={['Да', 'Нет', 'Определить автоматически']}
            control={control}
            error={errors.rsabe?.message}
          />
        </div>
      </Section>

      <Section title="3. Дизайн исследования">
        <div className="space-y-5">
          <RadioGroupField
            title="Предпочтительный дизайн"
            name="preferred_design"
            options={['Определить автоматически', '2×2 crossover', 'Replicate', 'Параллельный']}
            control={control}
            error={errors.preferred_design?.message}
          />

          <div>
            <p className="text-sm font-medium text-primary">Режим приёма</p>
            <div className="mt-2 flex flex-wrap gap-4">
              {administrationOptions.map((option) => (
                <label key={option} className="flex items-center gap-2 text-sm text-primary">
                  <input
                    type="checkbox"
                    value={option}
                    {...register('administration_mode')}
                    className="h-4 w-4 rounded border-neutral-300 text-accent focus:ring-accent"
                  />
                  {option}
                </label>
              ))}
            </div>
            {errors.administration_mode && <p className="mt-1 text-sm text-red-600">{errors.administration_mode.message}</p>}
          </div>

          <RadioGroupField
            title="Тип исследования"
            name="study_type"
            options={['Однократное введение', 'Многократное введение', 'Определить автоматически']}
            control={control}
            error={errors.study_type?.message}
          />
        </div>
      </Section>

      <Section title="4. Дополнительные требования заказчика (опционально)">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Гендерный состав">
            <select className={baseInput} {...register('additional_requirements.gender')}>
              <option value="">Не указано</option>
              {['Мужчины', 'Женщины', 'Оба пола'].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Возрастной диапазон">
            <input className={baseInput} placeholder="18–45 лет" {...register('additional_requirements.age_range')} />
          </Field>
          <div className="md:col-span-2">
            <Field label="Иные ограничения">
              <textarea
                rows={4}
                className={baseInput}
                placeholder="Укажите дополнительные критерии"
                {...register('additional_requirements.other_constraints')}
              />
            </Field>
          </div>
        </div>
      </Section>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-primary px-5 py-3 text-base font-semibold text-white transition hover:bg-primary/95 disabled:cursor-not-allowed disabled:bg-primary/60 md:w-auto"
      >
        {isSubmitting ? 'Отправка...' : 'Сформировать запрос'}
      </button>

      {successMessage && <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{successMessage}</p>}
      {errorMessage && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>}
    </form>
  );
};

type FieldProps = {
  label: string;
  children: ReactNode;
  error?: string;
};

const Field = ({ label, children, error }: FieldProps) => (
  <label className="block text-sm font-medium text-primary">
    {label}
    {children}
    {error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
  </label>
);

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="space-y-4 border-b border-neutral-200 pb-6 last:border-0 last:pb-0">
    <h2 className="text-lg font-semibold text-primary">{title}</h2>
    {children}
  </section>
);

type RadioGroupFieldProps = {
  title: string;
  name: 'cvintra' | 'rsabe' | 'preferred_design' | 'study_type';
  options: string[];
  control: ReturnType<typeof useForm<BioEQFormSchema>>['control'];
  error?: string;
};

const RadioGroupField = ({ title, name, options, control, error }: RadioGroupFieldProps) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <div>
        <p className="text-sm font-medium text-primary">{title}</p>
        <div className="mt-2 flex flex-wrap gap-4">
          {options.map((option) => (
            <label key={option} className="flex items-center gap-2 text-sm text-primary">
              <input
                type="radio"
                value={option}
                checked={field.value === option}
                onChange={field.onChange}
                className="h-4 w-4 border-neutral-300 text-accent focus:ring-accent"
              />
              {option}
            </label>
          ))}
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    )}
  />
);
