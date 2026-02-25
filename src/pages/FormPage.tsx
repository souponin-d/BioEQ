import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BrandLogo } from '../components/BrandLogo';
import { BioEQForm } from '../components/BioEQForm';

export const FormPage = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-base px-4 py-8 md:py-12">
      <div className="mx-auto w-full max-w-[960px]">
        <header className="mb-6 md:mb-8">
          <BrandLogo onClick={() => navigate('/')} />
          <h1 className="mt-3 text-2xl font-semibold text-text md:text-3xl">Параметры исследования биоэквивалентности</h1>
        </header>
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="rounded-2xl border border-border bg-surface1 p-5 shadow-card md:p-8"
        >
          <BioEQForm />
        </motion.section>
      </div>
    </main>
  );
};
