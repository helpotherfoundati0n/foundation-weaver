import React from 'react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import { Album } from '@/hooks/useAlbums';

interface AlbumCardProps {
  album: Album;
  onClick: () => void;
  index: number;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ album, onClick, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onClick={onClick}
      className="group relative rounded-2xl overflow-hidden shadow-lg cursor-pointer aspect-[4/3]"
    >
      {/* Cover Image */}
      <div className="absolute inset-0">
        {album.cover_image_url ? (
          <img
            src={album.cover_image_url}
            alt={album.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out md:group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
            <Camera size={48} className="text-surface/30" />
          </div>
        )}
      </div>

      {/* Photo Count Badge - Glassmorphism */}
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
          <Camera size={14} className="text-white" />
          <span className="text-white text-sm font-medium">
            {album.photo_count || 0} Photos
          </span>
        </div>
      </div>

      {/* Bottom Gradient Overlay - Always visible */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

      {/* Text Content - Always visible */}
      <div className="absolute inset-x-0 bottom-0 p-5 z-10">
        <h3 className="text-white text-xl font-bold mb-1 line-clamp-1">
          {album.title}
        </h3>
        {album.description && (
          <p className="text-white/70 text-sm line-clamp-2">
            {album.description}
          </p>
        )}
      </div>

      {/* Hover overlay for desktop */}
      <div className="absolute inset-0 bg-black/0 md:group-hover:bg-black/20 transition-colors duration-300" />
    </motion.div>
  );
};

export default AlbumCard;
