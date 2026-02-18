import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  aspectRatio?: string; // e.g. "aspect-square", "aspect-[4/3]"
  containerClassName?: string;
}

/**
 * LazyImage — renders with a shimmer skeleton placeholder until the image
 * has fully loaded, then cross-fades in. Uses native `loading="lazy"`.
 */
const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className,
  containerClassName,
  aspectRatio,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn('relative overflow-hidden', aspectRatio, containerClassName)}>
      {/* Shimmer placeholder */}
      {!loaded && (
        <div className="absolute inset-0 bg-surface/10 animate-shimmer bg-[length:400%_100%] bg-gradient-to-r from-surface/5 via-surface/20 to-surface/5" />
      )}

      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={cn(
          'transition-opacity duration-500',
          loaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        {...props}
      />
    </div>
  );
};

export default LazyImage;
