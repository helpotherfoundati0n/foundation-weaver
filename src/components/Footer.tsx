import React from "react";
import { motion } from "framer-motion";
import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, ArrowUp } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useContactInfo } from "@/hooks/useContactInfo";

const Footer = () => {
  const { theme } = useTheme();
  const { data: contactInfo } = useContactInfo();
  const isLight = theme === 'light';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { label: "About Us", href: "#about" },
    { label: "Our Activities", href: "#activities" },
    { label: "Events", href: "#events" },
    { label: "Gallery", href: "#gallery" },
    { label: "Contact", href: "#contact" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  const bgClass = isLight ? 'bg-gray-900' : 'bg-secondary';
  const textClass = 'text-gray-300';
  const headingClass = 'text-white';

  return (
    <footer className={`${bgClass} relative overflow-hidden`}>
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />

      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/3 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" fill="currentColor" />
              </div>
              <span className={`text-2xl font-bold ${headingClass}`}>
                Helping<span className="text-accent">Hands</span>
              </span>
            </div>
            <p className={`${textClass} leading-relaxed`}>
              Dedicated to making a positive impact in our community through compassion, 
              service, and sustainable development initiatives.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-primary transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <h3 className={`text-lg font-semibold ${headingClass} flex items-center gap-2`}>
              <span className="w-8 h-0.5 bg-accent"></span>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={`${textClass} hover:text-accent transition-colors duration-300 flex items-center gap-2 group`}
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-accent transition-all duration-300"></span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className={`text-lg font-semibold ${headingClass} flex items-center gap-2`}>
              <span className="w-8 h-0.5 bg-accent"></span>
              Contact Us
            </h3>
            <ul className="space-y-4">
              {contactInfo?.address && (
                <li className="flex gap-3">
                  <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                  <span className={textClass}>{contactInfo.address}</span>
                </li>
              )}
              {contactInfo?.phone && (
                <li className="flex gap-3">
                  <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                  <a href={`tel:${contactInfo.phone}`} className={`${textClass} hover:text-accent transition-colors`}>
                    {contactInfo.phone}
                  </a>
                </li>
              )}
              {contactInfo?.email && (
                <li className="flex gap-3">
                  <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                  <a href={`mailto:${contactInfo.email}`} className={`${textClass} hover:text-accent transition-colors`}>
                    {contactInfo.email}
                  </a>
                </li>
              )}
            </ul>
          </motion.div>

          {/* Newsletter / CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            <h3 className={`text-lg font-semibold ${headingClass} flex items-center gap-2`}>
              <span className="w-8 h-0.5 bg-accent"></span>
              Stay Connected
            </h3>
            <p className={textClass}>
              Subscribe to our newsletter for updates on our initiatives and events.
            </p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-accent text-primary font-semibold py-3 rounded-lg hover:bg-accent/90 transition-colors"
              >
                Subscribe
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className={`${textClass} text-sm text-center md:text-left`}>
              © {new Date().getFullYear()} HelpingHands. All rights reserved. Made with{" "}
              <Heart className="inline w-4 h-4 text-red-500 mx-1" fill="currentColor" /> 
              for the community.
            </p>
            
            {/* Back to top button */}
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-accent transition-colors group"
            >
              Back to top
              <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-accent group-hover:text-primary transition-all">
                <ArrowUp size={16} />
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
