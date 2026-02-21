import { motion } from 'framer-motion';
import { BioEQForm } from '../components/BioEQForm';

export const FormPage = () => (
  <main className="min-h-screen bg-neutral-100 px-4 py-8 md:py-12">
    <div className="mx-auto w-full max-w-[900px]">
      <header className="mb-6 md:mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/70">BioEQ</p>
        <h1 className="mt-2 text-2xl font-semibold text-primary md:text-3xl">Параметры исследования биоэквивалентности</h1>
      </header>
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm md:p-8"
      >
        <BioEQForm />
      </motion.section>
    </div>
  </main>
);
