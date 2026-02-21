import { motion, useReducedMotion } from 'framer-motion';

const blobs = [
  {
    className:
      '-left-20 top-[-120px] h-[340px] w-[340px] bg-[radial-gradient(circle_at_center,rgba(0,188,212,0.42),rgba(6,57,79,0.2)_55%,rgba(255,255,255,0)_72%)]',
    animate: {
      x: [0, 42, -18, 0],
      y: [0, -24, 30, 0],
      scale: [1, 1.08, 0.95, 1]
    }
  },
  {
    className:
      'right-[-90px] top-[18%] h-[320px] w-[320px] bg-[radial-gradient(circle_at_center,rgba(6,57,79,0.35),rgba(0,188,212,0.2)_52%,rgba(255,255,255,0)_72%)]',
    animate: {
      x: [0, -36, 12, 0],
      y: [0, 18, -22, 0],
      scale: [1, 0.94, 1.06, 1]
    }
  },
  {
    className:
      'bottom-[-120px] left-[25%] h-[360px] w-[360px] bg-[radial-gradient(circle_at_center,rgba(0,188,212,0.33),rgba(255,255,255,0)_72%)]',
    animate: {
      x: [0, 24, -14, 0],
      y: [0, -30, 20, 0],
      scale: [1, 1.06, 0.96, 1]
    }
  },
  {
    className:
      'bottom-[-90px] right-[18%] h-[280px] w-[280px] bg-[radial-gradient(circle_at_center,rgba(6,57,79,0.26),rgba(255,255,255,0)_70%)]',
    animate: {
      x: [0, -16, 28, 0],
      y: [0, 22, -18, 0],
      scale: [1, 0.93, 1.04, 1]
    }
  }
];

export const AnimatedBackground = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {blobs.map((blob, index) => (
        <motion.div
          key={blob.className}
          className={`absolute rounded-full opacity-70 blur-[100px] ${blob.className}`}
          animate={shouldReduceMotion ? undefined : blob.animate}
          transition={
            shouldReduceMotion
              ? undefined
              : {
                  duration: 28 + index * 4,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }
          }
        />
      ))}
    </div>
  );
};
