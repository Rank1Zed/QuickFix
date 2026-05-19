import { motion } from 'motion/react';

interface InfiniteSliderProps {
  items: { name: string; logo: React.ReactNode }[];
}

export function InfiniteSlider({ items }: InfiniteSliderProps) {
  // Duplicar items para criar o efeito infinito
  const duplicatedItems = [...items, ...items];

  return (
    <div className="relative overflow-hidden py-8">
      <motion.div
        className="flex gap-16"
        animate={{
          x: [0, -(items.length * 192)],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          },
        }}
      >
        {duplicatedItems.map((item, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-32 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-50 hover:opacity-100"
          >
            {item.logo}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
