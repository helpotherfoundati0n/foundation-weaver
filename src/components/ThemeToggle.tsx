import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-full hover:bg-muted/50 transition-colors"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <motion.div
        initial={false}
        animate={{ 
          rotate: theme === 'dark' ? 0 : 180,
          scale: [1, 0.8, 1]
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {theme === 'dark' ? (
          <Sun size={20} className="text-surface hover:text-accent transition-colors" />
        ) : (
          <Moon size={20} className="text-foreground hover:text-accent transition-colors" />
        )}
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
