# BioEQ

Современное React-приложение для сбора входных параметров проектирования исследования биоэквивалентности.

## Стек

- React 18 + TypeScript + Vite
- React Hook Form + Zod
- Axios
- MUI v5

## Запуск

```bash
npm install
npm run dev
```

## Структура проекта

```text
src/
  components/
    BioEQForm.tsx
  pages/
    HomePage.tsx
  services/
    api.ts
  types/
    formSchema.ts
    types.ts
  App.tsx
  main.tsx
```

## Пример отправляемого JSON

```json
{
  "inn": "Metformin",
  "dosage_form": "Таблетки",
  "dosage": "500 мг",
  "cvintra": "auto",
  "rsabe": "auto",
  "preferred_design": "auto",
  "administration_mode": ["Натощак", "После еды"],
  "study_type": "Однократное введение",
  "additional_requirements": {
    "gender": "Оба пола",
    "age_range": "18–45 лет",
    "other_constraints": "BMI 18–30"
  }
}
```
