export const AnimatedBackground = () => (
  <div className="blur-animation-wrapper" aria-hidden="true">
    <div className="blur-shape blur-shape--primary" />
    <div className="blur-shape blur-shape--secondary" />
    <div className="blur-shape blur-shape--tertiary" />
    <div className="blur-overlay" />
    <div className="blur-grain" />
  </div>
);
