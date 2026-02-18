import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera } from 'lucide-react';
import { AlbumWithPhotos } from '@/hooks/useAlbums';
import GalleryLightbox from './GalleryLightbox';
import ModalPortal from './ModalPortal';
import LazyImage from './LazyImage';

interface AlbumModalProps {
  album: AlbumWithPhotos | null;
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
}

const AlbumModal: React.FC<AlbumModalProps> = ({ album, isOpen, onClose, isLoading }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handlePhotoClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (!isOpen) return null;

  return (
    <ModalPortal>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="bg-secondary rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-surface/10">
                <div>
                  <h2 className="text-2xl font-bold text-surface">
                    {album?.title || 'Loading...'}
                  </h2>
                  {album?.description && (
                    <p className="text-surface/60 mt-1">{album.description}</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-surface/10 transition-colors text-surface/70 hover:text-surface"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Masonry Grid */}
              <div className="flex-1 overflow-y-auto p-6">
                {isLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-xl bg-surface/10 animate-shimmer bg-[length:400%_100%] bg-gradient-to-r from-surface/5 via-surface/20 to-surface/5"
                      />
                    ))}
                  </div>
                ) : album?.photos && album.photos.length > 0 ? (
                  <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                    {album.photos.map((photo, index) => (
                      <motion.div
                        key={photo.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(index * 0.05, 0.5) }}
                        className="break-inside-avoid group cursor-pointer mb-4"
                        onClick={() => handlePhotoClick(index)}
                      >
                        <div className="relative rounded-xl overflow-hidden">
                          <LazyImage
                            src={photo.image_url}
                            alt={photo.caption || 'Photo'}
                            className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                          {photo.caption && (
                            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <p className="text-white text-sm line-clamp-2">
                                {photo.caption}
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-surface/50">
                    <Camera size={48} className="mb-4" />
                    <p>No photos in this album yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox for full-screen view — also inside the portal */}
      {album?.photos && (
        <GalleryLightbox
          images={album.photos.map((p) => ({
            id: p.id,
            image_url: p.image_url,
            caption: p.caption,
          }))}
          initialIndex={lightboxIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </ModalPortal>
  );
};

export default AlbumModal;
