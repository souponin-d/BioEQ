export const AnimatedBackground = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-200/70 blur-3xl animate-aurora" />
    <div className="absolute right-0 top-20 h-80 w-80 rounded-full bg-sky-200/60 blur-3xl [animation-delay:-5s] animate-aurora" />
    <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-primary/10 blur-3xl [animation-delay:-8s] animate-aurora" />
  </div>
);
