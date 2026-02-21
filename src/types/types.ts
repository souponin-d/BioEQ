export type DosageForm =
  | 'Таблетки'
  | 'Капсулы'
  | 'Раствор'
  | 'Суспензия'
  | 'Инъекционная форма'
  | 'Другое';

export type CvintraOption = 'Низкая' | 'Высокая' | 'Определить автоматически';
export type RsabeOption = 'Да' | 'Нет' | 'Определить автоматически';
export type PreferredDesign = 'Определить автоматически' | '2×2 crossover' | 'Replicate' | 'Параллельный';
export type StudyType = 'Однократное введение' | 'Многократное введение' | 'Определить автоматически';
export type AdministrationMode = 'Натощак' | 'После еды' | 'Оба варианта';

export interface AdditionalRequirements {
  gender?: 'Мужчины' | 'Женщины' | 'Оба пола' | '';
  age_range?: string;
  other_constraints?: string;
}

export interface BioEQFormData {
  inn: string;
  dosage_form: DosageForm;
  dosage_form_other?: string;
  dosage: string;
  cvintra: CvintraOption;
  rsabe: RsabeOption;
  preferred_design: PreferredDesign;
  administration_mode: AdministrationMode[];
  study_type: StudyType;
  additional_requirements: AdditionalRequirements;
}
