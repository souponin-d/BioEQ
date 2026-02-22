export const AnimatedBackground = () => (
  <div className="blur-animation-wrapper" aria-hidden="true">
    <div className="blur-shapes-wrapper">
      <div className="blur-large">
        <div className="blur-anim-move">
          <div className="blur-shape is-primary" />
        </div>
      </div>

      <div className="blur-medium is-top-right">
        <div className="blur-anim-scale">
          <div className="blur-shape is-accent" />
        </div>
      </div>

      <div className="blur-medium is-bottom-center">
        <div className="blur-shape is-dark" />
      </div>
    </div>

    <div className="blur-blending-shapes-wrapper">
      <div className="blur-large is-bottom-right">
        <div className="blur-shape is-accent-soft" />
      </div>
      <div className="blur-medium is-top-center">
        <div className="blur-shape is-highlight" />
      </div>
    </div>

    <div className="blur-noise" />
  </div>
);
