import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedBackground } from '../components/AnimatedBackground';

const chips = ['Быстро', 'Стандартизировано', 'Для биоэквивалентности'];

export const LandingPage = () => {
  const navigate = useNavigate();
  const [isLeaving, setIsLeaving] = useState(false);

  const handleStart = () => {
    setIsLeaving(true);
    setTimeout(() => navigate('/form'), 280);
  };

  return (
    <motion.main
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-base px-4"
      animate={{ opacity: isLeaving ? 0 : 1, scale: isLeaving ? 0.99 : 1 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
    >
      <AnimatedBackground />
      <motion.section
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12 } }
        }}
        className="relative z-10 mx-auto w-full max-w-3xl rounded-3xl border border-white/70 bg-white/70 p-8 text-center shadow-card backdrop-blur md:p-12"
      >
        <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/70">
          BioEQ
        </motion.p>
        <motion.h1 variants={fadeUp} className="mt-4 text-3xl font-semibold text-primary md:text-5xl">
          AI-инструмент для проектирования исследований биоэквивалентности
        </motion.h1>
        <motion.p variants={fadeUp} className="mx-auto mt-5 max-w-2xl text-base text-primary/80 md:text-lg">
          Ускоряйте подготовку протоколов и формируйте стандартизированные запросы для клинических команд.
          Сервис помогает быстро собрать ключевые параметры исследования и снизить риск ошибок на старте.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-8 flex flex-wrap justify-center gap-2">
          {chips.map((chip) => (
            <span key={chip} className="rounded-full border border-primary/10 bg-white px-4 py-1 text-sm text-primary/80">
              {chip}
            </span>
          ))}
        </motion.div>

        <motion.button
          variants={fadeUp}
          onClick={handleStart}
          className="mt-10 inline-flex w-full items-center justify-center rounded-2xl bg-primary px-6 py-4 text-lg font-semibold text-white transition hover:bg-primary/95 focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/30 md:w-auto"
          whileTap={{ scale: 0.98, boxShadow: '0 0 0 10px rgba(0,188,212,0.18)' }}
        >
          Старт
        </motion.button>
      </motion.section>
    </motion.main>
  );
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};
