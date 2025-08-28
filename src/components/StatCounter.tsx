
import React from "react";
import { useInView } from "react-intersection-observer";

interface StatProps {
  number: number;
  label: string;
}

const StatCounter: React.FC<StatProps> = ({ number, label }) => {
  const [count, setCount] = React.useState(0);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  React.useEffect(() => {
    if (inView) {
      let start = 0;
      const increment = number / 50;
      const timer = setInterval(() => {
        start += increment;
        if (start > number) {
          setCount(number);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 33);

      return () => clearInterval(timer);
    }
  }, [inView, number]);

  return (
    <div ref={ref} className="text-center animate-fade-in">
      <h3 className="text-4xl font-bold text-accent mb-2">{count}+</h3>
      <p className="text-surface/80">{label}</p>
    </div>
  );
};

export default StatCounter;
