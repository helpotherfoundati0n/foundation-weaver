import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ModalPortal from './ModalPortal';

interface GalleryImage {
  id: string;
  image_url: string;
  caption: string | null;
}

interface GalleryLightboxProps {
  images: GalleryImage[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

const GalleryLightbox: React.FC<GalleryLightboxProps> = ({
  images,
  initialIndex,
  isOpen,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        if (isFullscreen) exitFullscreen();
        else onClose();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFullscreen, goToNext, goToPrevious, onClose]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const enterFullscreen = async () => {
    try {
      const element = document.getElementById('lightbox-image-container');
      if (element?.requestFullscreen) {
        await element.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch (error) {
      console.error('Fullscreen not supported', error);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Error exiting fullscreen', error);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <ModalPortal>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 text-white/80 hover:text-white transition-colors p-2 rounded-full bg-black/30 hover:bg-black/50"
            >
              <X size={28} />
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                isFullscreen ? exitFullscreen() : enterFullscreen();
              }}
              className="absolute top-4 right-16 z-50 text-white/80 hover:text-white transition-colors p-2 rounded-full bg-black/30 hover:bg-black/50"
            >
              <Maximize2 size={24} />
            </button>

            {/* Previous Button */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white/80 hover:text-white transition-colors p-3 rounded-full bg-black/30 hover:bg-black/50"
              >
                <ChevronLeft size={32} />
              </button>
            )}

            {/* Next Button */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white/80 hover:text-white transition-colors p-3 rounded-full bg-black/30 hover:bg-black/50"
              >
                <ChevronRight size={32} />
              </button>
            )}

            {/* Image Container */}
            <motion.div
              id="lightbox-image-container"
              className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <img
                src={currentImage.image_url}
                alt={currentImage.caption || 'Gallery image'}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
                loading="lazy"
                decoding="async"
              />

              {/* Caption */}
              {currentImage.caption && (
                <motion.p
                  className="text-white/80 text-center mt-4 text-lg max-w-2xl"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {currentImage.caption}
                </motion.p>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 text-white/60 text-sm">
                {currentIndex + 1} / {images.length}
              </div>
            </motion.div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto p-2 bg-black/30 rounded-lg">
                {images.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(index);
                    }}
                    className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all ${
                      index === currentIndex
                        ? 'border-accent opacity-100'
                        : 'border-transparent opacity-50 hover:opacity-80'
                    }`}
                  >
                    <img
                      src={img.image_url}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </ModalPortal>
  );
};

export default GalleryLightbox;
