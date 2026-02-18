import React, { useRef, useState } from "react";
import { X, Users, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ModalPortal from "./ModalPortal";

interface VolunteerPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (e: React.FormEvent) => void;
}

const VolunteerPopup = ({ isOpen, onClose, onSubmit }: VolunteerPopupProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    } else {
      onClose();
    }
  };

  return (
    <ModalPortal>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Popup content */}
            <motion.div
              className="relative bg-secondary rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Users className="text-accent" size={28} />
                  <h2 className="text-2xl font-bold text-surface">Become a Volunteer</h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-surface/60 hover:text-accent transition-colors p-1 rounded-full hover:bg-surface/10"
                >
                  <X size={24} />
                </button>
              </div>

              <p className="text-surface/80 mb-6">
                Join our team of dedicated volunteers and help us make a difference in the lives of those in need.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="popup-name" className="block text-sm font-medium text-surface mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="popup-name"
                      name="name"
                      className="w-full px-3 py-2 rounded-lg bg-primary text-surface border-2 border-accent focus:border-accent focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="popup-email" className="block text-sm font-medium text-surface mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="popup-email"
                      name="email"
                      className="w-full px-3 py-2 rounded-lg bg-primary text-surface border-2 border-accent focus:border-accent focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="popup-phone" className="block text-sm font-medium text-surface mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="popup-phone"
                      name="phone"
                      className="w-full px-3 py-2 rounded-lg bg-primary text-surface border-2 border-accent focus:border-accent focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="popup-city" className="block text-sm font-medium text-surface mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      id="popup-city"
                      name="city"
                      className="w-full px-3 py-2 rounded-lg bg-primary text-surface border-2 border-accent focus:border-accent focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="popup-message" className="block text-sm font-medium text-surface mb-1">
                    Why do you want to volunteer?
                  </label>
                  <textarea
                    id="popup-message"
                    name="message"
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-primary text-surface border-2 border-accent focus:border-accent focus:outline-none transition-colors"
                    placeholder="Tell us about your motivation to volunteer..."
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-3 rounded-full border border-surface/20 text-surface font-medium hover:bg-surface/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-accent text-primary px-6 py-3 rounded-full font-medium hover:bg-accent/90 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    Submit Application <Send size={16} />
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ModalPortal>
  );
};

export default VolunteerPopup;
