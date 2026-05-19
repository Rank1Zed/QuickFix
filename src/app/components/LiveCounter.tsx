import { useEffect, useRef, useState } from 'react';
import CountUp from 'react-countup';

interface LiveCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

export function LiveCounter({ end, duration = 2.5, suffix = '', prefix = '', decimals = 0 }: LiveCounterProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {isVisible ? (
        <CountUp
          end={end}
          duration={duration}
          suffix={suffix}
          prefix={prefix}
          decimals={decimals}
          separator="."
          decimal=","
        />
      ) : (
        <span>{prefix}0{suffix}</span>
      )}
    </div>
  );
}
