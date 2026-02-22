import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import image1 from '../assets/images/1.png';
import image2 from '../assets/images/2.png';
import image3 from '../assets/images/3.png';
import image4 from '../assets/images/4.png';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { Button } from '../components/Button';

const storySteps = [
  { number: '01', title: 'Ввод параметров' },
  { number: '02', title: 'Отправка запроса' },
  { number: '03', title: 'Получение результата' }
];

const teamMembers = [
  {
    image: image1,
    name: 'Супонин Дмитрий Александрович',
    role: 'FullStack, ML-инженер'
  },
  {
    image: image2,
    name: 'Федорцова Елизавета Владимировна',
    role: 'Специалист по регуляторике, Биостатистик'
  },
  {
    image: image3,
    name: 'Савочкин Андрей Владимирович',
    role: 'Специалист по фармакокинетике, Биостатистик'
  },
  {
    image: image4,
    name: 'Глытов Иван Владимирович',
    role: 'Медицинский консультант, Аналитик'
  }
];

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

export const LandingPage = () => {
  const navigate = useNavigate();
  const goToForm = () => navigate('/forms');

  return (
    <main className="bg-white text-primary">
      <header className="sticky top-0 z-20 border-b border-primary/10 bg-white/85 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <span className="text-lg font-semibold tracking-tight">BioEQ</span>
          <nav className="hidden items-center gap-6 text-sm sm:flex">
            <a href="#how" className="text-primary/80 transition hover:text-primary">
              Как это работает
            </a>
            <a href="#team" className="text-primary/80 transition hover:text-primary">
              Команда
            </a>
          </nav>
          <Button onClick={goToForm} className="w-full sm:w-auto">
            Старт
          </Button>
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
              Вы заполняете параметры препарата, а наши ИИ-агенты делают всё остальное
            </motion.p>
            <motion.div variants={itemVariants} className="mt-10">
              <Button onClick={goToForm} className="w-full sm:w-auto sm:px-8 sm:py-4 sm:text-base">
                Старт
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section id="how" className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Как это работает</h2>
        <div className="mt-10 space-y-8 border-t border-primary/10 pt-8">
          {storySteps.map((step) => (
            <article key={step.number} className="grid gap-3 border-b border-primary/10 pb-7 last:border-0 last:pb-0 md:grid-cols-[72px_1fr]">
              <p className="text-sm font-medium tracking-[0.2em] text-primary/40">{step.number}</p>
              <h3 className="text-xl font-semibold">{step.title}</h3>
            </article>
          ))}
        </div>
      </section>

      <section id="team" className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Команда</h2>
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          {teamMembers.map((member) => (
            <article key={member.name} className="flex items-center gap-5 border border-primary/10 bg-white p-5">
              <img src={member.image} alt={member.name} className="h-24 w-24 flex-none rounded-full object-cover md:h-28 md:w-28" />
              <div>
                <p className="font-semibold">{member.name}</p>
                <p className="mt-1 text-sm text-primary/60">{member.role}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="border border-primary/10 bg-neutral-50 px-6 py-10 text-center sm:px-8">
          <h2 className="text-2xl font-semibold sm:text-3xl">Готовы начать?</h2>
          <Button onClick={goToForm} className="mt-7 w-full sm:w-auto">
            Перейти к форме
          </Button>
        </div>
      </section>

      <footer className="border-t border-primary/10">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 text-sm text-primary/65 sm:px-6 lg:px-8">
          <p>BioEQ © 2026</p>
        </div>
      </footer>
    </main>
  );
};
