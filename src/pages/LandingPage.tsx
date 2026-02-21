import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedBackground } from '../components/AnimatedBackground';

const storySteps = [
  {
    number: '01',
    title: 'Ввод параметров',
    description: 'Пользователь заполняет ключевые параметры препарата и дизайна исследования.'
  },
  {
    number: '02',
    title: 'Отправка на backend',
    description: 'Фронтенд формирует типизированный JSON и отправляет запрос в сервис.'
  },
  {
    number: '03',
    title: 'Результат',
    description: 'Backend рассчитывает рекомендации по дизайну и формирует итоговый вывод.'
  }
];

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

export const LandingPage = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const [isLeaving, setIsLeaving] = useState(false);

  const handleNavigate = () => {
    if (shouldReduceMotion) {
      navigate('/form');
      return;
    }

    setIsLeaving(true);
    window.setTimeout(() => navigate('/form'), 260);
  };

  return (
    <motion.main
      className="bg-base text-primary"
      animate={shouldReduceMotion ? undefined : { opacity: isLeaving ? 0 : 1 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
    >
      <header className="sticky top-0 z-20 border-b border-primary/10 bg-white/85 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <span className="text-lg font-semibold tracking-tight">BioEQ</span>
          <button
            type="button"
            onClick={handleNavigate}
            className="rounded-xl bg-primary px-5 py-2 text-sm font-medium text-white transition hover:bg-primary/95 focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/25"
          >
            Старт
          </button>
        </div>
      </header>

      <section className="relative isolate overflow-hidden">
        <AnimatedBackground />
        <div className="relative mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-6xl items-center px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <motion.div
            className="max-w-3xl text-center lg:text-left"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 variants={itemVariants} className="text-5xl font-semibold leading-none tracking-tight sm:text-6xl lg:text-7xl">
              BioEQ
            </motion.h1>
            <motion.p variants={itemVariants} className="mt-5 text-lg text-primary/85 sm:text-xl">
              AI-инструмент для проектирования исследований биоэквивалентности
            </motion.p>
            <motion.p variants={itemVariants} className="mx-auto mt-5 max-w-2xl text-base text-primary/70 lg:mx-0 lg:text-lg">
              Вы заполняете параметры препарата и дизайна исследования, а система формирует структурированный
              запрос для проектирования исследования.
            </motion.p>
            <motion.div variants={itemVariants} className="mt-10">
              <button
                type="button"
                onClick={handleNavigate}
                className="w-full rounded-2xl bg-primary px-8 py-4 text-lg font-semibold text-white shadow-[0_18px_36px_-24px_rgba(6,57,79,0.85)] transition hover:shadow-[0_0_0_7px_rgba(0,188,212,0.2)] focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/35 sm:w-auto"
              >
                Старт
              </button>
            </motion.div>
            <motion.p variants={itemVariants} className="mt-5 text-sm text-primary/55">
              MVP: сбор входных параметров → отправка на backend
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Как это работает</h2>
        <div className="mt-10 space-y-8 border-t border-primary/10 pt-8">
          {storySteps.map((step) => (
            <article key={step.number} className="grid gap-3 border-b border-primary/10 pb-7 last:border-0 last:pb-0 md:grid-cols-[72px_1fr]">
              <p className="text-sm font-medium tracking-[0.2em] text-primary/40">{step.number}</p>
              <div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 max-w-3xl text-primary/70">{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="rounded-3xl border border-primary/10 bg-neutral-50 px-6 py-10 text-center sm:px-8">
          <h2 className="text-2xl font-semibold sm:text-3xl">Готовы начать?</h2>
          <button
            type="button"
            onClick={handleNavigate}
            className="mt-7 w-full rounded-2xl bg-primary px-7 py-3 text-base font-semibold text-white transition hover:bg-primary/95 focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/35 sm:w-auto"
          >
            Перейти к форме
          </button>
        </div>
      </section>

      <footer className="border-t border-primary/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-6 text-sm text-primary/65 sm:px-6 lg:px-8">
          <p>BioEQ © 2026</p>
          <p>Учебный MVP</p>
        </div>
      </footer>
    </motion.main>
  );
};
