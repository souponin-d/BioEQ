# BioEQ

React + TypeScript + Vite приложение для подготовки параметров исследования биоэквивалентности.

## Стек

- React 18 + TypeScript + Vite
- Tailwind CSS
- Framer Motion
- React Router DOM
- React Hook Form + Zod
- Axios

## Запуск

```bash
npm install
npm run dev
```

Сборка production:

```bash
npm run build
```

## Роуты

- `/` — стартовый экран (LandingPage)
- `/form` — форма для отправки параметров исследования (FormPage)

## Структура проекта

```text
src/
  components/
    AnimatedBackground.tsx
    BioEQForm.tsx
  pages/
    LandingPage.tsx
    FormPage.tsx
  services/
    api.ts
  types/
    formSchema.ts
    types.ts
  App.tsx
  main.tsx
```

## API

Форма отправляет `POST` на `http://localhost:8000/api/generate`.
