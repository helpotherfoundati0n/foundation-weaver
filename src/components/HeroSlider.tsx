import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useActiveHeroImages } from '@/hooks/useHeroImages';

// Fallback images if no hero images are configured
const fallbackImages = [
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1920&q=80',
  'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1920&q=80',
  'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1920&q=80',
];

interface HeroSliderProps {
  children: React.ReactNode;
}

const HeroSlider = ({ children }: HeroSliderProps) => {
  const { data: heroImages } = useActiveHeroImages();
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = heroImages && heroImages.length > 0 
    ? heroImages.map(img => img.image_url) 
    : fallbackImages;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [images.length, nextSlide]);

  return (
    <section id="home" className="relative w-full h-screen overflow-hidden">
      {/* Background Slider - z-0 */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <img
              src={images[currentIndex]}
              alt="Hero background"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dark Overlay - z-10 */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />

      {/* Content - z-20 */}
      <div className="relative z-20 w-full h-full flex items-center px-4">
        {children}
      </div>

      {/* Slide Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-accent w-8' 
                  : 'bg-surface/50 hover:bg-surface/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroSlider;
