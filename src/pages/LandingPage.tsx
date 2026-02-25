import { motion, useReducedMotion } from 'framer-motion';
import { type PointerEventHandler, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import image1 from '../assets/images/1.png';
import image2 from '../assets/images/2.png';
import image3 from '../assets/images/3.png';
import image4 from '../assets/images/4.png';
import iconBrain from '../assets/images/icon_brain.png';
import iconPk from '../assets/images/icon_PK.png';
import iconSecure from '../assets/images/icon_secure.png';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { BrandLogo } from '../components/BrandLogo';
import { Button } from '../components/Button';

const storySteps = [
  { number: '01', title: 'Ввод параметров' },
  { number: '02', title: 'Отправка запроса' },
  { number: '03', title: 'Получение результата' }
];

const teamMembers = [
  { image: image1, name: 'Супонин Дмитрий', role: 'FullStack, ML-инженер', contact: 'tg: @hello_world_enjoyer' },
  { image: image2, name: 'Федорцова Елизавета', role: 'Специалист по регуляторике, Биостатистик' },
  { image: image3, name: 'Савочкин Андрей', role: 'Специалист по фармакокинетике, Биостатистик' },
  { image: image4, name: 'Глытов Иван', role: 'Медицинский консультант, Аналитик' }
];

const sectionLinks = [
  { id: 'advantages', label: 'Преимущества' },
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

const advantages = [
  {
    icon: iconPk,
    iconAlt: 'Иконка фармакокинетики',
    title: 'Фармакокинетика',
    description:
      'Наш продукт сочетает ИИ-анализ с детерминированной PK-верификацией: ключевые выводы и параметры автоматически проверяются стандартными методами фармакокинетического моделирования, принятыми в индустрии. Это повышает точность и интерпретируемость результатов и снижает риск ошибок и “галлюцинаций”.'
  },
  {
    icon: iconSecure,
    iconAlt: 'Иконка безопасности',
    title: 'Безопасность',
    description:
      'Решение развёртывается полностью в контуре заказчика: на собственных или выделенных мощностях, без внешних API и передачи данных третьим сторонам. Это обеспечивает независимость от внешних ограничений (санкции, блокировки) и упрощает выполнение требований информационной безопасности: контроль доступа, журналирование и управляемость окружения.'
  },
  {
    icon: iconBrain,
    iconAlt: 'Иконка полной истории размышления',
    title: 'Полная история размышления',
    description:
      'Каждый результат формируется и сохраняется как аудитируемый артефакт: URL/ID записи в базе или реестре, точная цитата (с указанием места в документе), извлечённые структурированные поля и вычислительный лог/шаги расчёта. Это обеспечивает воспроизводимую трассируемость “запрос → поиск → источник → цитата → данные → вывод”, упрощает QA/RA-проверку и ускоряет согласования с партнёрами и регуляторами.'
  }
];

const CAROUSEL_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';
const SWIPE_THRESHOLD = 50;

const AdvantageCard = ({ title, description, icon, iconAlt, revealDelay }: (typeof advantages)[number] & { revealDelay: number }) => (
  <article
    data-reveal-delay={revealDelay}
    className="advantage-card reveal-item group relative flex h-full flex-col overflow-hidden rounded-[18px] border border-border bg-surface1 p-5 text-white shadow-card transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-6"
  >
    <span className="pointer-events-none absolute inset-x-4 top-0 h-px bg-[image:var(--accent-line)] opacity-95" aria-hidden="true" />
    <div className="advantage-icon-wrap mb-4 flex h-24 w-24 items-center justify-center sm:mb-5 sm:h-28 sm:w-28 lg:h-32 lg:w-32">
      <img src={icon} alt={iconAlt} className="advantage-icon h-20 w-20 object-contain sm:h-24 sm:w-24 lg:h-28 lg:w-28" loading="lazy" />
    </div>
    <h3 className="text-lg font-semibold leading-tight tracking-tight text-white sm:text-xl">{title}</h3>
    <p className="mt-3 text-sm leading-relaxed sm:text-base">{description}</p>
  </article>
);

export const LandingPage = () => {
  const navigate = useNavigate();
  const carouselTrackRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [activeSection, setActiveSection] = useState(sectionLinks[0].id);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(!prefersReducedMotion);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [queuedDirection, setQueuedDirection] = useState<'left' | 'right' | null>(null);

  const displayCards = useMemo(() => {
    if (exampleCards.length <= 1) return exampleCards;
    return [exampleCards[exampleCards.length - 1], ...exampleCards, exampleCards[0]];
  }, []);

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

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const scrollToId = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    const headerOffset = (headerRef.current?.offsetHeight ?? 72) + 14;
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.history.replaceState(null, '', `#${id}`);
    window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    closeMobileMenu();
  };

  const scrollToHero = () => {
    scrollToId('hero');
  };

  const moveSlide = (direction: 'left' | 'right') => {
    if (displayCards.length <= 1 || prefersReducedMotion) {
      setCurrentSlide((prev) => prev + (direction === 'right' ? 1 : -1));
      return;
    }

    if (isAnimating) {
      setQueuedDirection(direction);
      return;
    }

    setIsAnimating(true);
    setCurrentSlide((prev) => prev + (direction === 'right' ? 1 : -1));
  };

  useEffect(() => {
    setIsTransitionEnabled(!prefersReducedMotion);
  }, [prefersReducedMotion]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!isMobileMenuOpen || !navRef.current) return;
      if (!navRef.current.contains(event.target as Node)) setIsMobileMenuOpen(false);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const sections = sectionLinks.map((item) => document.getElementById(item.id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-38% 0px -50% 0px', threshold: 0.18 }
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

  const onPointerDown: PointerEventHandler<HTMLDivElement> = (event) => {
    setTouchStartX(event.clientX);
  };

  const onPointerUp: PointerEventHandler<HTMLDivElement> = (event) => {
    if (touchStartX === null) return;
    const deltaX = event.clientX - touchStartX;
    if (Math.abs(deltaX) >= SWIPE_THRESHOLD) {
      moveSlide(deltaX < 0 ? 'right' : 'left');
    }
    setTouchStartX(null);
  };

  const onCarouselTransitionEnd = () => {
    if (displayCards.length <= 1) return;

    if (currentSlide === displayCards.length - 1) {
      setIsTransitionEnabled(false);
      setCurrentSlide(1);
      setIsAnimating(false);
      return;
    }

    if (currentSlide === 0) {
      setIsTransitionEnabled(false);
      setCurrentSlide(exampleCards.length);
      setIsAnimating(false);
      return;
    }

    setIsAnimating(false);
  };

  useEffect(() => {
    if (isTransitionEnabled) return;

    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!prefersReducedMotion) {
          setIsTransitionEnabled(true);
        }
      });
    });

    return () => cancelAnimationFrame(id);
  }, [isTransitionEnabled, prefersReducedMotion]);

  useEffect(() => {
    if (!queuedDirection || isAnimating) return;
    const timeoutId = window.setTimeout(() => {
      const direction = queuedDirection;
      setQueuedDirection(null);
      if (direction) moveSlide(direction);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [isAnimating, queuedDirection]);

  return (
    <main className="bg-base text-text">
      <header
        ref={headerRef}
        className={`fixed inset-x-0 top-0 z-[100] transition-all duration-300 ${
          isScrolled ? 'bg-base/80 shadow-[0_20px_45px_-35px_rgba(0,0,0,0.8)] backdrop-blur-xl' : 'bg-transparent'
        }`}
      >
        <div ref={navRef} className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <BrandLogo onClick={scrollToHero} />
          <nav className="hidden items-center gap-6 text-sm md:flex">
            {sectionLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollToId(link.id)}
                className={`relative py-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-base ${
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

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-border bg-surface1 px-3 py-2 text-sm text-white transition hover:bg-surface2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-base md:hidden"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav"
            aria-label={isMobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        <div
          id="mobile-nav"
          className={`border-t border-border bg-base/95 px-4 py-4 backdrop-blur-lg transition md:hidden ${
            isMobileMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-3">
            {sectionLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollToId(link.id)}
                className="w-full rounded-md border border-border px-3 py-2 text-left text-sm text-white/85 transition hover:bg-surface2 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="relative min-h-screen isolate overflow-hidden bg-base">
        <AnimatedBackground />

        <section id="hero" className="relative z-10 scroll-mt-24 text-white">
          <div className="relative z-10 mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-6xl items-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
            <motion.div className="max-w-3xl text-center lg:text-left" variants={heroVariants} initial="hidden" animate="visible">
              <motion.h1 variants={heroItem} className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
                BioEQ
              </motion.h1>
              <motion.p variants={heroItem} className="mt-5 text-base text-white/85 sm:text-xl">
                AI-инструмент для автоматизированного проектирования исследований биоэквивалентности
              </motion.p>
              <motion.p variants={heroItem} className="mx-auto mt-5 max-w-2xl text-base text-white/70 lg:mx-0 lg:text-lg">
                Вы заполняете параметры препарата, а наши ИИ-агенты делают всё остальное
              </motion.p>
              <motion.div variants={heroItem} className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Button onClick={goToForm} className="w-full sm:w-auto sm:px-8 sm:py-4 sm:text-base">
                  Старт
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>

      <section id="advantages" className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 pt-14 sm:px-6 lg:px-8 lg:pt-20">
        <div className="reveal-item">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Преимущества</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
            {advantages.map((advantage, index) => (
              <AdvantageCard key={advantage.title} {...advantage} revealDelay={index * 100} />
            ))}
          </div>
        </div>
      </section>

      <section id="examples" className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="reveal-item flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Примеры</h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Предыдущий слайд"
              onClick={() => moveSlide('left')}
              disabled={isAnimating}
              className="rounded-full border border-border px-4 py-2 text-sm text-text2 transition hover:bg-surface2 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Следующий слайд"
              onClick={() => moveSlide('right')}
              disabled={isAnimating}
              className="rounded-full border border-border px-4 py-2 text-sm text-text2 transition hover:bg-surface2 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
            >
              →
            </button>
          </div>
        </div>

        <div className="mt-8 overflow-hidden" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
          <div
            ref={carouselTrackRef}
            onTransitionEnd={onCarouselTransitionEnd}
            className="flex"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
              transition: isTransitionEnabled ? `transform ${prefersReducedMotion ? 0 : 420}ms ${CAROUSEL_EASING}` : 'none'
            }}
          >
            {displayCards.map((card, index) => (
              <article
                key={`${card.id}-${index}`}
                data-reveal-delay={(index % 4) * 70}
                className="reveal-item w-full shrink-0 rounded-2xl border border-border bg-surface1 p-6 shadow-card"
              >
                <h3 className="text-xl font-semibold">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text2">{card.text}</p>
                <Button variant="outline" className="mt-6">
                  Перейти
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="team" className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <h2 className="reveal-item text-2xl font-semibold tracking-tight sm:text-3xl">Команда</h2>
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          {teamMembers.map((member, index) => (
            <article
              key={member.name}
              data-reveal-delay={index * 80}
              className="reveal-item flex items-center gap-4 border border-border bg-surface1 p-4 sm:gap-5 sm:p-5"
            >
              <img src={member.image} alt={member.name} className="h-20 w-20 flex-none rounded-full object-cover sm:h-24 sm:w-24 md:h-28 md:w-28" />
              <div>
                <p className="font-semibold">{member.name}</p>
                <p className="mt-1 text-sm text-text2">{member.role}</p>
                {member.contact ? <p className="mt-1 text-sm text-text2">{member.contact}</p> : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="architecture" className="mx-auto w-full max-w-6xl scroll-mt-24 bg-surface1 px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
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

      <section id="implementation" className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <h2 className="reveal-item text-2xl font-semibold tracking-tight sm:text-3xl">Внедрение</h2>
        <div className="reveal-item mt-8 overflow-x-auto rounded-xl border border-border bg-surface1">
          <table className="min-w-[640px] w-full border-collapse text-left text-sm sm:text-base">
            <thead>
              <tr className="bg-surface2">
                <th className="border-b border-border px-4 py-4 text-text">Критерий</th>
                <th className="border-b border-border px-4 py-4 text-text">Стандартная разработка</th>
                <th className="border-b border-border px-4 py-4 text-text">BioEQ</th>
              </tr>
            </thead>
            <tbody>
              <tr className="odd:bg-white/[0.03]">
                <td className="border-b border-border px-4 py-4 font-medium text-text">Время</td>
                <td className="border-b border-border px-4 py-4 text-text2">10–14 недель</td>
                <td className="border-b border-border px-4 py-4 text-text2">2–4 недели</td>
              </tr>
              <tr className="odd:bg-white/[0.03]">
                <td className="border-b border-border px-4 py-4 font-medium text-text">Стоимость</td>
                <td className="border-b border-border px-4 py-4 text-text2">Высокая, много ручных итераций</td>
                <td className="border-b border-border px-4 py-4 text-text2">Ниже на ~35% за счёт автоматизации</td>
              </tr>
              <tr className="odd:bg-white/[0.03]">
                <td className="px-4 py-4 font-medium text-text">Что-то ещё</td>
                <td className="px-4 py-4 text-text2">Фрагментированные отчёты и зависимость от экспертов</td>
                <td className="px-4 py-4 text-text2">Единый pipeline, прозрачные расчёты и шаблоны</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6 lg:px-8 lg:pb-20">
        <div className="reveal-item border border-border bg-surface2 px-6 py-10 text-center sm:px-8">
          <h2 className="text-2xl font-semibold sm:text-3xl">Готовы начать?</h2>
          <Button onClick={goToForm} className="mt-7 w-full sm:w-auto">
            Перейти к форме
          </Button>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl justify-center px-4 py-6 text-center text-sm text-text2 sm:px-6 lg:px-8">
          <p>BioEQ © 2026</p>
        </div>
      </footer>
    </main>
  );
};
