import { motion } from 'motion/react';
import { Progress } from './ui/progress';

interface AnimatedProgressProps {
  value: number;
  label: string;
  color?: string;
}

export function AnimatedProgress({ value, label, color = 'bg-blue-500' }: AnimatedProgressProps) {
  const percentage = (value / 5) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-muted-foreground">{value.toFixed(1)}/5.0</span>
      </div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative"
      >
        <div className={`h-3 ${color} rounded-full shadow-lg`} style={{ width: '100%' }}>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 bg-white/30 rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
}
