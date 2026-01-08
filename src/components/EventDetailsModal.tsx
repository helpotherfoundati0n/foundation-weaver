import React, { forwardRef } from 'react';
import { X, Calendar, Clock, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string | null;
  location: string | null;
  image_url: string | null;
  google_form_url: string | null;
  registration_deadline: string | null;
}

interface EventDetailsModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

const EventDetailsModal = forwardRef<HTMLDivElement, EventDetailsModalProps>(
  ({ event, isOpen, onClose }, ref) => {
    if (!isOpen || !event) return null;

    const formatTime = (time: string) => {
      const [hours, minutes] = time.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return format(date, 'h:mm a');
    };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-secondary rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Header */}
            {event.image_url && (
              <div className="relative h-48 md:h-64 overflow-hidden rounded-t-2xl">
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent" />
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-2 rounded-full bg-black/30 hover:bg-black/50"
            >
              <X size={24} />
            </button>

            {/* Content */}
            <div className="p-6 space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-surface">
                {event.title}
              </h2>

              {/* Event Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-surface/80">
                  <Calendar className="h-5 w-5 text-accent flex-shrink-0" />
                  <span>
                    {format(new Date(event.event_date), 'EEEE, MMMM d, yyyy')}
                  </span>
                </div>

                {event.event_time && (
                  <div className="flex items-center gap-3 text-surface/80">
                    <Clock className="h-5 w-5 text-accent flex-shrink-0" />
                    <span>{formatTime(event.event_time)}</span>
                  </div>
                )}

                {event.location && (
                  <div className="flex items-center gap-3 text-surface/80">
                    <MapPin className="h-5 w-5 text-accent flex-shrink-0" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {event.description && (
                <div className="prose prose-invert max-w-none">
                  <p className="text-surface/80 whitespace-pre-line leading-relaxed">
                    {event.description}
                  </p>
                </div>
              )}

              {/* Registration Info */}
              {event.registration_deadline && (
                <div className="bg-primary/50 rounded-lg p-4">
                  <p className="text-surface/60 text-sm">
                    Registration was open until{' '}
                    <span className="text-surface font-medium">
                      {format(new Date(event.registration_deadline), 'MMMM d, yyyy')}
                    </span>
                  </p>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-full bg-accent text-primary px-6 py-3 rounded-full font-medium hover:bg-accent/90 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
  }
);

EventDetailsModal.displayName = 'EventDetailsModal';

export default EventDetailsModal;
