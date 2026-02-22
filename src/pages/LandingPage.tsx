import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
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
  { image: image1, name: 'Супонин Дмитрий Александрович', role: 'FullStack, ML-инженер', contact: 'tg: @hello_world_enjoyer' },
  { image: image2, name: 'Федорцова Елизавета Владимировна', role: 'Специалист по регуляторике, Биостатистик' },
  { image: image3, name: 'Савочкин Андрей Владимирович', role: 'Специалист по фармакокинетике, Биостатистик' },
  { image: image4, name: 'Глытов Иван Владимирович', role: 'Медицинский консультант, Аналитик' }
];

const sectionLinks = [
  { id: 'examples', label: 'Примеры' },
  { id: 'team', label: 'Команда' },
  { id: 'architecture', label: 'Архитектура' },
  { id: 'implementation', label: 'Внедрение' }
];

const exampleCards = Array.from({ length: 4 }, (_, index) => ({
  id: index + 1,
  title: `Пример ${index + 1}`,
  text: 'Короткий пример входных данных и ожидаемого результата проектирования исследования.'
}));

const loopedExampleCards = [...exampleCards, ...exampleCards];

export const LandingPage = () => {
  const navigate = useNavigate();
  const carouselRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [activeSection, setActiveSection] = useState('examples');
  const [isScrolled, setIsScrolled] = useState(false);

  const goToForm = () => navigate('/forms');

  const heroVariants = useMemo(
    () => ({
      hidden: {},
      visible: { transition: { staggerChildren: prefersReducedMotion ? 0 : 0.1 } }
    }),
    [prefersReducedMotion]
  );

  const heroItem = useMemo(
    () => ({
      hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 12 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: prefersReducedMotion ? 0.05 : 0.55, ease: [0.22, 1, 0.36, 1] }
      }
    }),
    [prefersReducedMotion]
  );

  const scrollToId = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    const headerOffset = (headerRef.current?.offsetHeight ?? 72) + 14;
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.history.pushState(null, '', `#${id}`);
    window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const amount = Math.round(carouselRef.current.clientWidth * 0.92);
    carouselRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const halfWidth = carousel.scrollWidth / 2;
    carousel.scrollLeft = halfWidth;
    const handleScroll = () => {
      const threshold = 2;
      if (carousel.scrollLeft <= threshold) carousel.scrollLeft = halfWidth - threshold;
      else if (carousel.scrollLeft >= halfWidth * 2 - carousel.clientWidth - threshold) carousel.scrollLeft = halfWidth;
    };
    carousel.addEventListener('scroll', handleScroll, { passive: true });
    return () => carousel.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = sectionLinks.map((item) => document.getElementById(item.id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -45% 0px', threshold: 0.2 }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>('.reveal-item'));
    if (prefersReducedMotion) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const delay = Number((entry.target as HTMLElement).dataset.revealDelay ?? 0);
          window.setTimeout(() => entry.target.classList.add('is-visible'), delay);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -6% 0px' }
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  return (
    <main className="bg-base text-text">
      <div className="relative min-h-screen isolate overflow-hidden bg-base">
        <AnimatedBackground />

        <header
          ref={headerRef}
          className={`sticky top-0 z-30 border-b border-white/10 backdrop-blur-md transition-all duration-300 ${
            isScrolled ? 'bg-[rgba(11,18,36,0.85)]' : 'bg-[rgba(255,255,255,0.06)]'
          }`}
        >
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <span className="text-lg font-semibold tracking-tight text-white">BioEQ</span>
            <nav className="hidden items-center gap-6 text-sm sm:flex">
              {sectionLinks.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => scrollToId(link.id)}
                  className={`relative py-1 transition ${
                    activeSection === link.id ? 'text-white' : 'text-white/75 hover:text-white'
                  }`}
                >
                  {link.label}
                  {activeSection === link.id ? (
                    <span className="absolute bottom-[-6px] left-0 h-[2px] w-full bg-[image:var(--accent-line)]" />
                  ) : null}
                </button>
              ))}
            </nav>

            <Button onClick={goToForm} variant="outline" className="w-full sm:w-auto">
              Старт
            </Button>
          </div>
        </header>

        <section className="relative z-10 text-white">
          <div className="relative z-10 mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-6xl items-center px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <motion.div className="max-w-3xl text-center lg:text-left" variants={heroVariants} initial="hidden" animate="visible">
              <motion.h1 variants={heroItem} className="text-5xl font-semibold leading-none tracking-tight text-white sm:text-6xl lg:text-7xl">
                BioEQ
              </motion.h1>
              <motion.p variants={heroItem} className="mt-5 text-lg text-white/85 sm:text-xl">
                AI-инструмент для автоматизированного проектирования исследований биоэквивалентности
              </motion.p>
              <motion.p variants={heroItem} className="mx-auto mt-5 max-w-2xl text-base text-white/70 lg:mx-0 lg:text-lg">
                Вы заполняете параметры препарата, а наши ИИ-агенты делают всё остальное
              </motion.p>
              <motion.div variants={heroItem} className="mt-10">
                <Button onClick={goToForm} className="w-full sm:w-auto sm:px-8 sm:py-4 sm:text-base">
                  Старт
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>

      <section id="examples" className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="reveal-item flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Примеры</h2>
          <div className="hidden items-center gap-3 md:flex">
            <button type="button" onClick={() => scrollCarousel('left')} className="rounded-full border border-border px-4 py-2 text-sm text-text2 transition hover:bg-surface2 hover:text-text">←</button>
            <button type="button" onClick={() => scrollCarousel('right')} className="rounded-full border border-border px-4 py-2 text-sm text-text2 transition hover:bg-surface2 hover:text-text">→</button>
          </div>
        </div>

        <div ref={carouselRef} className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {loopedExampleCards.map((card, index) => (
            <article
              key={`${card.id}-${index}`}
              data-reveal-delay={(index % 4) * 70}
              className="reveal-item min-w-[82%] snap-start rounded-2xl border border-border bg-surface1 p-6 shadow-card sm:min-w-[56%] lg:min-w-[38%]"
            >
              <h3 className="text-xl font-semibold">{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text2">{card.text}</p>
              <Button variant="outline" className="mt-6">Скачать</Button>
            </article>
          ))}
        </div>
      </section>

      <section id="team" className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <h2 className="reveal-item text-2xl font-semibold tracking-tight sm:text-3xl">Команда</h2>
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          {teamMembers.map((member, index) => (
            <article
              key={member.name}
              data-reveal-delay={index * 80}
              className="reveal-item flex items-center gap-5 border border-border bg-surface1 p-5"
            >
              <img src={member.image} alt={member.name} className="h-24 w-24 flex-none rounded-full object-cover md:h-28 md:w-28" />
              <div>
                <p className="font-semibold">{member.name}</p>
                <p className="mt-1 text-sm text-text2">{member.role}</p>
                {member.contact ? <p className="mt-1 text-sm text-text2">{member.contact}</p> : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="architecture" className="mx-auto w-full max-w-6xl scroll-mt-24 bg-surface1 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <h2 className="reveal-item text-2xl font-semibold tracking-tight sm:text-3xl">Архитектура</h2>
        <div className="mt-10 space-y-8 border-t border-border pt-8">
          {storySteps.map((step, index) => (
            <article
              key={step.number}
              data-reveal-delay={index * 80}
              className="reveal-item grid gap-3 border-b border-border pb-7 last:border-0 last:pb-0 md:grid-cols-[72px_1fr]"
            >
              <p className="text-sm font-medium tracking-[0.2em] text-text2">{step.number}</p>
              <h3 className="text-xl font-semibold">{step.title}</h3>
            </article>
          ))}
        </div>
      </section>

      <section id="implementation" className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <h2 className="reveal-item text-2xl font-semibold tracking-tight sm:text-3xl">Внедрение</h2>
        <div className="reveal-item mt-8 overflow-hidden rounded-xl border border-border bg-surface1">
          <table className="w-full border-collapse text-left text-sm sm:text-base">
            <thead>
              <tr className="bg-surface2">
                <th className="border-b border-border px-4 py-4">Критерий</th>
                <th className="border-b border-border px-4 py-4">Стандартная разработка</th>
                <th className="border-b border-border px-4 py-4">BioEQ</th>
              </tr>
            </thead>
            <tbody>
              <tr className="odd:bg-white/[0.03]">
                <td className="border-b border-border px-4 py-4 font-medium">Время</td>
                <td className="border-b border-border px-4 py-4 text-text2">10–14 недель</td>
                <td className="border-b border-border px-4 py-4 text-text2">2–4 недели</td>
              </tr>
              <tr className="odd:bg-white/[0.03]">
                <td className="border-b border-border px-4 py-4 font-medium">Стоимость</td>
                <td className="border-b border-border px-4 py-4 text-text2">Высокая, много ручных итераций</td>
                <td className="border-b border-border px-4 py-4 text-text2">Ниже на ~35% за счёт автоматизации</td>
              </tr>
              <tr className="odd:bg-white/[0.03]">
                <td className="px-4 py-4 font-medium">Что-то ещё</td>
                <td className="px-4 py-4 text-text2">Фрагментированные отчёты и зависимость от экспертов</td>
                <td className="px-4 py-4 text-text2">Единый pipeline, прозрачные расчёты и шаблоны</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="reveal-item border border-border bg-surface2 px-6 py-10 text-center sm:px-8">
          <h2 className="text-2xl font-semibold sm:text-3xl">Готовы начать?</h2>
          <Button onClick={goToForm} className="mt-7 w-full sm:w-auto">Перейти к форме</Button>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 text-sm text-text2 sm:px-6 lg:px-8">
          <p>BioEQ © 2026</p>
        </div>
      </footer>
    </main>
  );
};
