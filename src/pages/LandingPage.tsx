import { motion } from 'framer-motion';
import { useRef } from 'react';
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
    name: 'Супонин Дмитрий',
    role: 'FullStack, ML-инженер',
    contact: 'tg: @hello_world_enjoyer'
  },
  {
    image: image2,
    name: 'Федорцова Елизавета',
    role: 'Специалист по регуляторике, Биостатистик'
  },
  {
    image: image3,
    name: 'Савочкин Андрей',
    role: 'Специалист по фармакокинетике, Биостатистик'
  },
  {
    image: image4,
    name: 'Глытов Иван',
    role: 'Медицинский консультант, Аналитик'
  }
];

const exampleCards = Array.from({ length: 4 }, (_, index) => ({
  id: index + 1,
  title: 'Препарат',
  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
}));

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

export const LandingPage = () => {
  const navigate = useNavigate();
  const carouselRef = useRef<HTMLDivElement>(null);
  const goToForm = () => navigate('/forms');
  const landingButtonClass =
    'rounded-none border border-primary bg-transparent text-primary hover:border-accent hover:bg-transparent hover:text-accent';

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) {
      return;
    }

    const amount = Math.round(carouselRef.current.clientWidth * 0.92);
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth'
    });
  };

  return (
    <main className="bg-white text-primary">
      <div className="relative min-h-screen isolate overflow-hidden">
        <AnimatedBackground />
        <header className="sticky top-0 z-20 border-b border-primary/10 bg-white/85 backdrop-blur-sm">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <span className="text-lg font-semibold tracking-tight">BioEQ</span>
            <nav className="hidden items-center gap-6 text-sm sm:flex">
              <a href="#examples" className="text-primary/80 transition hover:text-primary">
                Примеры
              </a>
              <a href="#team" className="text-primary/80 transition hover:text-primary">
                Команда
              </a>
              <a href="#architecture" className="text-primary/80 transition hover:text-primary">
                Архитектура
              </a>
              <a href="#implementation" className="text-primary/80 transition hover:text-primary">
                Внедрение
              </a>
            </nav>
            <Button onClick={goToForm} className={`w-full sm:w-auto ${landingButtonClass}`}>
              Старт
            </Button>
          </div>
        </header>

        <section className="relative z-10">
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
              AI-инструмент для автоматизированного проектирования исследований биоэквивалентности
            </motion.p>
            <motion.p variants={itemVariants} className="mx-auto mt-5 max-w-2xl text-base text-primary/70 lg:mx-0 lg:text-lg">
              Вы заполняете параметры препарата, а наши ИИ-агенты делают всё остальное
            </motion.p>
            <motion.div variants={itemVariants} className="mt-10">
              <Button onClick={goToForm} className={`w-full sm:w-auto sm:px-8 sm:py-4 sm:text-base ${landingButtonClass}`}>
                Старт
              </Button>
            </motion.div>
          </motion.div>
        </div>
        </section>
      </div>

      <section id="examples" className="mx-auto w-full max-w-6xl scroll-mt-24 bg-primary px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-24">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Примеры</h2>
          <div className="hidden items-center gap-3 md:flex">
            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollCarousel('left')}
              className="rounded-full border border-white/35 px-4 py-2 text-sm font-medium text-white transition hover:border-accent hover:bg-accent/80"
            >
              ←
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollCarousel('right')}
              className="rounded-full border border-white/35 px-4 py-2 text-sm font-medium text-white transition hover:border-accent hover:bg-accent/80"
            >
              →
            </motion.button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {exampleCards.map((card, index) => (
            <motion.article
              key={card.id}
              initial={{ opacity: 0, x: 36 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: index * 0.08, ease: 'easeOut' }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ y: -8, scale: 1.01 }}
              className="min-w-[82%] snap-start rounded-2xl border border-white/15 bg-white/10 p-6 shadow-card backdrop-blur-sm sm:min-w-[56%] lg:min-w-[38%]"
            >
              <h3 className="text-xl font-semibold">{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/80">{card.text}</p>
              <Button className="mt-6 border-white/45 bg-white/15 text-white hover:border-accent hover:bg-accent hover:text-white">Скачать</Button>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="team" className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Команда</h2>
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          {teamMembers.map((member) => (
            <article key={member.name} className="flex items-center gap-5 border border-primary/10 bg-white p-5">
              <img src={member.image} alt={member.name} className="h-24 w-24 flex-none rounded-full object-cover md:h-28 md:w-28" />
              <div>
                <p className="font-semibold">{member.name}</p>
                <p className="mt-1 text-sm text-primary/60">{member.role}</p>
                {member.contact ? <p className="mt-1 text-sm text-primary/60">{member.contact}</p> : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="architecture" className="mx-auto w-full max-w-6xl scroll-mt-24 bg-primary px-4 pb-16 text-white sm:px-6 lg:px-8 lg:pb-24">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Архитектура</h2>
        <div className="mt-10 space-y-8 border-t border-white/20 pt-8">
          {storySteps.map((step) => (
            <article key={step.number} className="grid gap-3 border-b border-white/20 pb-7 last:border-0 last:pb-0 md:grid-cols-[72px_1fr]">
              <p className="text-sm font-medium tracking-[0.2em] text-white/60">{step.number}</p>
              <h3 className="text-xl font-semibold">{step.title}</h3>
            </article>
          ))}
        </div>
      </section>

      <section id="implementation" className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Внедрение</h2>
        <div className="mt-8 overflow-hidden border border-primary/15">
          <table className="w-full border-collapse text-left text-sm sm:text-base">
            <thead>
              <tr className="bg-primary/5">
                <th className="border-b border-primary/10 px-4 py-4">Критерий</th>
                <th className="border-b border-primary/10 px-4 py-4">Стандартная разработка</th>
                <th className="border-b border-primary/10 px-4 py-4">BioEQ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b border-primary/10 px-4 py-4 font-medium">Время</td>
                <td className="border-b border-primary/10 px-4 py-4">10–14 недель</td>
                <td className="border-b border-primary/10 px-4 py-4">2–4 недели</td>
              </tr>
              <tr>
                <td className="border-b border-primary/10 px-4 py-4 font-medium">Стоимость</td>
                <td className="border-b border-primary/10 px-4 py-4">Высокая, много ручных итераций</td>
                <td className="border-b border-primary/10 px-4 py-4">Ниже на ~35% за счёт автоматизации</td>
              </tr>
              <tr>
                <td className="px-4 py-4 font-medium">Что-то ещё</td>
                <td className="px-4 py-4">Фрагментированные отчёты и зависимость от экспертов</td>
                <td className="px-4 py-4">Единый pipeline, прозрачные расчёты и шаблоны</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="border border-primary/10 bg-neutral-50 px-6 py-10 text-center sm:px-8">
          <h2 className="text-2xl font-semibold sm:text-3xl">Готовы начать?</h2>
          <Button onClick={goToForm} className={`mt-7 w-full sm:w-auto ${landingButtonClass}`}>
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
