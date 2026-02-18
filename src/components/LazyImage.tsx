import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  /** Optional low-quality/tiny thumbnail URL for blur-up progressive loading */
  thumbSrc?: string;
  aspectRatio?: string;
  containerClassName?: string;
}

/**
 * LazyImage — progressive "blur-up" loader.
 *
 * 1. IntersectionObserver watches the wrapper; the full-res src is only set
 *    once the element enters the viewport (true lazy loading).
 * 2. While the full image is fetching, a tiny blurred thumbnail (thumbSrc)
 *    is shown — or a shimmer skeleton if no thumbnail is provided.
 * 3. When the full image finishes loading it cross-fades in over the blur.
 */
const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  thumbSrc,
  className,
  containerClassName,
  aspectRatio,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [fullLoaded, setFullLoaded] = useState(false);
  const [thumbLoaded, setThumbLoaded] = useState(false);

  // IntersectionObserver — trigger load when element scrolls into view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // If IO not supported, just load immediately
    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // start loading 200px before it's visible
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', aspectRatio, containerClassName)}
    >
      {/* ── Layer 1: Shimmer skeleton (shown until thumb or full image loads) ── */}
      {!fullLoaded && (
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-r from-surface/5 via-surface/20 to-surface/5',
            'bg-[length:400%_100%] animate-shimmer'
          )}
        />
      )}

      {/* ── Layer 2: Blurred thumbnail (shown while full res is loading) ── */}
      {thumbSrc && inView && !fullLoaded && (
        <img
          src={thumbSrc}
          alt=""
          aria-hidden
          decoding="async"
          onLoad={() => setThumbLoaded(true)}
          className={cn(
            'absolute inset-0 w-full h-full object-cover scale-110',
            'blur-xl transition-opacity duration-300',
            thumbLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}

      {/* ── Layer 3: Full-resolution image (cross-fades in on load) ── */}
      {inView && (
        <img
          src={src}
          alt={alt}
          decoding="async"
          onLoad={() => setFullLoaded(true)}
          className={cn(
            'transition-opacity duration-700',
            fullLoaded ? 'opacity-100' : 'opacity-0',
            className
          )}
          {...props}
        />
      )}
    </div>
  );
};

export default LazyImage;
