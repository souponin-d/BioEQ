import { motion } from 'framer-motion';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <motion.main
      className="relative min-h-screen bg-base text-text overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Тот самый фон с лендинга */}
      <AnimatedBackground />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <header className="mb-12 flex items-center justify-between border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
              Личный кабинет
            </h1>
            <p className="mt-2 text-text2">Добро пожаловать в систему BioEQ</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/')}>
            Выйти
          </Button>
        </header>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <article className="group cursor-pointer rounded-2xl border border-border bg-surface1 p-6 shadow-card hover:border-primary/50 transition-all"
                   onClick={() => navigate('/study/paracetamol')}>
            <div className="mb-4 inline-block rounded-lg bg-surface2 px-3 py-1 text-xs text-primary">
              Новый
            </div>
            <h3 className="text-xl font-semibold text-white group-hover:text-primary transition-colors">
              Парацетамол (суспензия)
            </h3>
            <p className="mt-2 text-sm text-text2">Haleon • Фаза I</p>
            <div className="mt-6 flex items-center text-sm font-medium text-white">
              Открыть eProtocol <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </article>
        </section>
      </div>
    </motion.main>
  );
};
