import React, { useEffect, useState } from "react";
import { ArrowRight, Users, Heart, Award, HeartPulse, BookOpen, Wrench, Calendar, MapPin, Clock, Mail, Phone, Send, QrCode, X, ExternalLink } from "lucide-react";
import Navbar from "../components/Navbar";
import { TypewriterEffectSmooth } from "../components/TypewriterEffect";
import { AnimatePresence, motion } from "framer-motion";
import { useUpcomingEvents, usePastEvents } from "@/hooks/useEvents";
import { useAlbums, useAlbumWithPhotos } from "@/hooks/useAlbums";
import { useContactInfo } from "@/hooks/useContactInfo";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useActiveActivities } from "@/hooks/useActivities";
import { useTheme } from "@/contexts/ThemeContext";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useInView } from "react-intersection-observer";
import AlbumCard from "@/components/AlbumCard";
import AlbumModal from "@/components/AlbumModal";
import SkeletonCard from "@/components/SkeletonCard";
import EventDetailsModal from "@/components/EventDetailsModal";
import VolunteerPopup from "@/components/VolunteerPopup";
import LazyImage from "@/components/LazyImage";
import HeroSlider from "@/components/HeroSlider";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const iconMap: Record<string, React.ElementType> = {
  HeartPulse,
  BookOpen,
  Wrench,
  Users,
  Heart,
  Award,
};

// Animation variants for scroll reveal
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

// Animated Event Card component
const EventCard = ({ event, index, isPast, onViewDetails }: { 
  event: any; 
  index: number; 
  isPast?: boolean;
  onViewDetails: (event: any) => void;
}) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  
  const isRegistrationOpen = event.registration_deadline 
    ? new Date(event.registration_deadline) >= new Date() 
    : new Date(event.event_date) >= new Date();

  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return format(date, 'h:mm a');
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="group bg-primary rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 transform hover:-translate-y-2"
    >
      {event.image_url && (
        <div className="relative h-48 overflow-hidden">
          <LazyImage
            src={event.image_url}
            alt={event.title}
            containerClassName="absolute inset-0"
            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {isPast && (
            <div className="absolute top-3 right-3 bg-surface/90 text-primary px-3 py-1 rounded-full text-xs font-medium">
              Completed
            </div>
          )}
        </div>
      )}
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold text-surface group-hover:text-accent transition-colors">
          {event.title}
        </h3>
        
        <div className="space-y-2 text-surface/70">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-accent" />
            <span>{format(new Date(event.event_date), 'EEEE, MMMM d, yyyy')}</span>
          </div>
          
          {event.event_time && (
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-accent" />
              <span>{formatTime(event.event_time)}</span>
            </div>
          )}
          
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-accent" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
        </div>
        
        {event.description && (
          <p className="text-surface/60 text-sm line-clamp-2">{event.description}</p>
        )}
        
        {/* Action Buttons */}
        <div className="pt-2">
          {isPast ? (
            <button
              onClick={() => onViewDetails(event)}
              className="w-full bg-surface/10 text-surface px-6 py-3 rounded-full font-medium hover:bg-surface/20 transition-colors inline-flex items-center justify-center gap-2"
            >
              View Details
            </button>
          ) : event.google_form_url && isRegistrationOpen ? (
            <a
              href={event.google_form_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-accent text-primary px-6 py-3 rounded-full font-medium hover:bg-accent/90 transition-colors inline-flex items-center justify-center gap-2"
            >
              Register Now <ExternalLink size={16} />
            </a>
          ) : (
            <button
              onClick={() => onViewDetails(event)}
              className="w-full bg-surface/10 text-surface px-6 py-3 rounded-full font-medium hover:bg-surface/20 transition-colors inline-flex items-center justify-center gap-2"
            >
              View Details
            </button>
          )}
        </div>

        {/* Registration deadline badge */}
        {!isPast && event.registration_deadline && (
          <div className="text-xs text-surface/50 text-center">
            {isRegistrationOpen 
              ? `Registration closes: ${format(new Date(event.registration_deadline), 'MMM d, yyyy')}`
              : 'Registration closed'
            }
          </div>
        )}
      </div>
    </motion.div>
  );
};

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [albumModalOpen, setAlbumModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const { theme } = useTheme();

  // Form states
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [volunteerForm, setVolunteerForm] = useState({ 
    name: '', email: '', phone: '', city: '', message: '' 
  });

  // Fetch dynamic data
  const { data: upcomingEvents, isLoading: upcomingLoading } = useUpcomingEvents();
  const { data: pastEvents, isLoading: pastLoading } = usePastEvents();
  const { data: albums, isLoading: albumsLoading } = useAlbums();
  const { data: selectedAlbum, isLoading: albumLoading } = useAlbumWithPhotos(selectedAlbumId);
  const { data: contactInfo, isLoading: contactLoading } = useContactInfo();
  const { data: siteContent, isLoading: contentLoading } = useSiteContent();
  const { data: activities, isLoading: activitiesLoading } = useActiveActivities();

  // Theme-aware classes
  const isLight = theme === 'light';
  const bgPrimary = isLight ? 'bg-white' : 'bg-primary';
  const bgSecondary = isLight ? 'bg-gray-50' : 'bg-secondary';
  const textPrimary = isLight ? 'text-black' : 'text-surface';
  const textSecondary = isLight ? 'text-gray-600' : 'text-surface/80';
  const cardBg = isLight ? 'bg-white shadow-lg' : 'bg-primary';
  const inputBg = isLight ? 'bg-white border-2 border-accent' : 'bg-secondary border border-surface/20';
  const inputText = isLight ? 'text-gray-900 placeholder:text-gray-400' : 'text-surface placeholder:text-surface/40';
  const headingText = isLight ? 'text-black' : 'text-surface';

  // Helper to get content by key
  const getContent = (key: string) => {
    return siteContent?.find(c => c.section_key === key);
  };

  // Get WhatsApp number from contact info (clean it for URL)
  const getWhatsAppNumber = () => {
    const phone = contactInfo?.phone || '+91 XXX XXX XXXX';
    return phone.replace(/[\s\-\(\)]/g, '');
  };

  // WhatsApp redirect for contact form
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const message = `*New Contact Message*
    
*Name:* ${contactForm.name}
*Email:* ${contactForm.email}

*Message:*
${contactForm.message}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${getWhatsAppNumber()}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    toast.success('Redirecting to WhatsApp...');
    setContactForm({ name: '', email: '', message: '' });
  };

  // WhatsApp redirect for volunteer form
  const handleVolunteerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const name = (data.get('name') as string || volunteerForm.name).trim();
    const email = (data.get('email') as string || volunteerForm.email).trim();
    const phone = (data.get('phone') as string || volunteerForm.phone).trim();
    const city = (data.get('city') as string || volunteerForm.city).trim();
    const message = (data.get('message') as string || volunteerForm.message).trim();

    if (!name || !email || !phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    const waMessage = `*New Volunteer Application*
    
*Name:* ${name}
*Email:* ${email}
*Phone:* ${phone}
*City:* ${city}

*Why they want to volunteer:*
${message}`;

    const encodedMessage = encodeURIComponent(waMessage);
    const whatsappUrl = `https://wa.me/${getWhatsAppNumber()}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    toast.success('Redirecting to WhatsApp...');
    setVolunteerForm({ name: '', email: '', phone: '', city: '', message: '' });
    setIsVolunteerModalOpen(false);
  };

  // Album click handler
  const handleAlbumClick = (albumId: string) => {
    setSelectedAlbumId(albumId);
    setAlbumModalOpen(true);
  };

  // Event details handler
  const handleViewEventDetails = (event: any) => {
    setSelectedEvent(event);
    setEventModalOpen(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about-what-we-do', 'events', 'gallery', 'contact', 'donate'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isLoading = upcomingLoading || pastLoading || contactLoading || contentLoading || activitiesLoading;

  if (isLoading) {
    return (
      <div className={`min-h-screen ${bgPrimary} flex items-center justify-center`}>
        <Loader2 className="h-12 w-12 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgPrimary} ${textPrimary}`}>
      <Navbar activeSection={activeSection} />
      
      {/* Home Section with Hero Slider */}
      <HeroSlider>
        <div className="max-w-7xl mx-auto">
          <div className="text-center animate-fade-in">
            <div className="flex flex-col items-center leading-tight">
              <TypewriterEffectSmooth className="my-0"
                words={[
                  { text: "If" }, { text: "you" }, { text: "help" }, { text: "other,", className: "text-accent"},
                ]}
              />
              <TypewriterEffectSmooth className="my-0"
                words={[
                  { text: "Allah", className: "text-accent" },
                  { text: "will" }, { text: "help" }, { text: "you" }, { text: "in" },
                  { text: "Return!", className: "text-accent" },
                ]}
             />
            </div>

            <p className={`text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8`}>
              {getContent('hero_subtitle')?.content || 'Join us in our mission to assist the underprivileged through education and healthcare initiatives.'}
            </p>
            <a href="#contact">
              <button className="bg-accent text-primary px-8 py-3 rounded-full font-medium hover:bg-accent/90 transition-colors inline-flex items-center gap-2">
                {getContent('hero_button')?.content || 'Get Involved'} <ArrowRight size={20} />
              </button>
            </a>
          </div>
        </div>
      </HeroSlider>

      {/* About Us & What We Do Section */}
      <section id="about-what-we-do" className={`py-8 px-4 ${bgSecondary}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className={`flex justify-center typewriter-title ${headingText}`}>
              <TypewriterEffectSmooth
                words={[
                  {text:"About"},{text:"Us"},{text:"&"},{text:"What"},{text:"We"},{text:"Do", className:"text-accent"}
                ]}
              />
            </div>
            <p className={`text-lg md:text-xl ${textSecondary} max-w-3xl mx-auto`}>
              {getContent('about_content')?.content || 'Founded in 2025, our foundation grew out of a deep-rooted bond of friendship and a shared mission to serve.'}
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold mb-6">
                {getContent('mission_title')?.content || 'Our Mission'}
              </h2>
              <p className={textSecondary}>
                {getContent('mission_content')?.content || 'To centralize efforts in aiding the needy and expanding our reach to help more individuals through medical assistance, education support, and self-reliance initiatives.'}
              </p>
            </div>
            <div className="animate-fade-in delay-100">
              <h2 className="text-3xl font-bold mb-6">
                {getContent('vision_title')?.content || 'Our Vision'}
              </h2>
              <p className={textSecondary}>
                {getContent('vision_content')?.content || 'To create a society where every individual has access to basic healthcare, quality education, and opportunities for self-reliance, regardless of their economic status.'}
              </p>
            </div>
          </div>

          {/* What We Do - Key Activities */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-12 text-center">
              Our Key <span className="text-accent">Activities</span>
            </h2>
            
            {activities && activities.length > 0 ? (
              activities.map((activity, index) => {
                const IconComponent = iconMap[activity.icon] || HeartPulse;
                const isEven = index % 2 === 0;
                
                return (
                  <div key={activity.id} className="mb-12 grid md:grid-cols-2 gap-12 items-center">
                    <div className={`animate-fade-in ${!isEven ? 'order-1 md:order-2' : ''}`}>
                      <IconComponent size={48} className="text-accent mb-6" />
                      <h3 className="text-2xl font-bold mb-6">{activity.title}</h3>
                      <p className={`${textSecondary} mb-4`}>{activity.description}</p>
                      {activity.list_items && activity.list_items.length > 0 && (
                        <ul className={`list-disc list-inside ${textSecondary} space-y-2`}>
                          {activity.list_items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className={`${cardBg} p-8 rounded-lg animate-fade-in delay-100 ${!isEven ? 'order-2 md:order-1' : ''}`}>
                      {activity.image_url ? (
                        <img 
                          src={activity.image_url}
                          alt={activity.title}
                          className="rounded-lg w-full"
                          style={{ 
                            maxWidth: activity.image_width || 400, 
                            maxHeight: activity.image_height || 300,
                          }}
                        />
                      ) : (
                        <div className="w-full h-48 bg-surface/10 rounded-lg flex items-center justify-center">
                          <p className="text-surface/40">No image available</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={`text-center py-12 ${cardBg} rounded-lg`}>
                <p className={textSecondary}>No activities configured yet.</p>
              </div>
            )}
          </div>


          {/* Values Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-12 text-center">
              Our <span className="text-accent">Values</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 animate-fade-in">
                <Users size={48} className="text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">
                  {getContent('value_1_title')?.content || 'Community First'}
                </h3>
                <p className={textSecondary}>
                  {getContent('value_1_content')?.content || 'We prioritize the needs of our community in everything we do.'}
                </p>
              </div>
              <div className="text-center p-6 animate-fade-in delay-100">
                <Heart size={48} className="text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">
                  {getContent('value_2_title')?.content || 'Compassion'}
                </h3>
                <p className={textSecondary}>
                  {getContent('value_2_content')?.content || 'We approach every situation with empathy and understanding.'}
                </p>
              </div>
              <div className="text-center p-6 animate-fade-in delay-200">
                <Award size={48} className="text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">
                  {getContent('value_3_title')?.content || 'Excellence'}
                </h3>
                <p className={textSecondary}>
                  {getContent('value_3_content')?.content || 'We strive for excellence in our service to those in need.'}
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className={`text-center ${cardBg} p-8 rounded-lg`}>
            <h2 className="text-3xl font-bold mb-6">
              Ready to Make a <span className="text-accent">Difference?</span>
            </h2>
            <p className={`${textSecondary} mb-8 max-w-2xl mx-auto`}>
              Join us in our mission to create positive change. Whether through
              donations, volunteering, or spreading awareness, every contribution
              matters.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#donate" onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('donate');
                if (element) {
                  const navbarHeight = 90;
                  const targetPosition = element.offsetTop - navbarHeight;
                  window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                  });
                }
              }}>
                <button className="bg-accent text-primary px-8 py-3 rounded-full font-medium hover:bg-accent/90 transition-colors inline-flex items-center gap-2">
                  <Heart size={16} />
                  Donate Now
                </button>
              </a>
              <button 
                onClick={() => setIsVolunteerModalOpen(true)}
                className="border border-accent text-accent px-8 py-3 rounded-full font-medium hover:bg-accent/10 transition-colors"
              >
                Become a Volunteer
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className={`py-8 px-4 ${bgSecondary}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className={`flex justify-center typewriter-title ${headingText}`}>
              <TypewriterEffectSmooth
                words={[
                  {text:"Our"},{text:"Events", className:"text-accent"}
                ]}
              />
            </div>
            <p className={`text-lg md:text-xl ${textSecondary} max-w-3xl mx-auto`}>
              Join us in making a difference. Check out our upcoming events and see
              the impact of our past initiatives.
            </p>
          </div>

          {/* Upcoming Events */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="bg-accent h-8 w-1 rounded-full"></span>
              Upcoming Events
            </h2>
            {upcomingEvents && upcomingEvents.length > 0 ? (
              <motion.div 
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {upcomingEvents.map((event, index) => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    index={index}
                    onViewDetails={handleViewEventDetails}
                  />
                ))}
              </motion.div>
            ) : (
              <div className={`text-center py-12 ${cardBg} rounded-2xl`}>
                <Calendar className={`h-12 w-12 ${textSecondary} mx-auto mb-4`} />
                <p className={textSecondary}>No upcoming events at the moment. Check back soon!</p>
              </div>
            )}
          </div>

          {/* Past Events */}
          {pastEvents && pastEvents.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <span className="bg-surface/40 h-8 w-1 rounded-full"></span>
                Past Events
              </h2>
              <motion.div 
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {pastEvents.map((event, index) => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    index={index} 
                    isPast
                    onViewDetails={handleViewEventDetails}
                  />
                ))}
              </motion.div>
            </div>
          )}
        </div>
      </section>

      {/* Gallery Section - Event Albums */}
      <section id="gallery" className={`py-8 px-4 ${bgPrimary}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center typewriter-title">
              <TypewriterEffectSmooth
                words={[
                  {text:"Our"},{text:"Gallery", className:"text-accent"}
                ]}
              />
            </div>
            <p className={`text-lg md:text-xl ${textSecondary} max-w-3xl mx-auto`}>
              A visual journey through our initiatives and the lives we've touched
              along the way.
            </p>
          </div>

          {albumsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} type="album" />
              ))}
            </div>
          ) : albums && albums.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {albums.map((album, index) => (
                <AlbumCard
                  key={album.id}
                  album={album}
                  index={index}
                  onClick={() => handleAlbumClick(album.id)}
                />
              ))}
            </div>
          ) : (
            <div className={`text-center py-12 ${bgSecondary} rounded-2xl`}>
              <p className={textSecondary}>Gallery albums coming soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={`py-8 px-4 ${bgSecondary}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className={`flex justify-center typewriter-title ${headingText}`}>
              <TypewriterEffectSmooth
                words={[
                  {text:"Contact"},{text:"Us", className:"text-accent"}
                ]}
              />
            </div>
            <p className={`text-lg md:text-xl ${textSecondary} max-w-3xl mx-auto`}>
              We're here to help. Reach out to us with any questions or concerns.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold mb-8">Send us a message</h2>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg ${inputBg} ${inputText} focus:border-accent focus:outline-none`}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg ${inputBg} ${inputText} focus:border-accent focus:outline-none`}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg ${inputBg} ${inputText} focus:border-accent focus:outline-none`}
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-accent text-primary px-8 py-3 rounded-full font-medium hover:bg-accent/90 transition-colors inline-flex items-center gap-2"
                >
                  Send via WhatsApp <Send size={16} />
                </button>
              </form>
            </div>

            {/* Contact Information - Dynamic */}
            <div className="animate-fade-in delay-100">
              <h2 className="text-3xl font-bold mb-8">Get in touch</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="text-accent" size={24} />
                  <div>
                    <h3 className="font-semibold mb-2">Email</h3>
                    <p className={textSecondary}>{contactInfo?.email || 'help@jaipas.lu'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="text-accent" size={24} />
                  <div>
                    <h3 className="font-semibold mb-2">Phone</h3>
                    <p className={textSecondary}>{contactInfo?.phone || '+352 123 456 789'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="text-accent" size={24} />
                  <div>
                    <h3 className="font-semibold mb-2">Address</h3>
                    <p className={`${textSecondary} whitespace-pre-line`}>
                      {contactInfo?.address || 'Luxembourg City, Luxembourg'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Donate Section */}
      <section id="donate" className={`py-8 px-4 ${bgSecondary}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className={`flex justify-center typewriter-title ${headingText}`}>
              <TypewriterEffectSmooth
                words={[
                  {text:"Make"},{text:"a"},{text:"Difference", className:"text-accent"}
                ]}
              />
            </div>
            <p className={`text-lg md:text-xl ${textSecondary} max-w-3xl mx-auto`}>
              Your contribution can help us continue our mission of supporting those
              in need through various initiatives.
            </p>
          </div>

          <h2 className="text-3xl font-bold mb-12 text-center">
            Ways to <span className="text-accent">Donate</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {/* Sadka & Zakat */}
            <div className={`${cardBg} p-6 rounded-lg animate-scale-in delay-100 flex flex-col items-center text-center`}>
              <QrCode className="text-accent mb-6" size={60} />
              <h3 className="text-xl font-semibold mb-4">Sadka & Zakat</h3>
              <div className={`space-y-8 ${textSecondary}`}>
                <p>Scan QR code for Sadka & Zakat donations:</p>
                <div className="bg-white p-4 rounded-lg inline-block">
                  {contactInfo?.qr_code_url ? (
                    <img 
                      src={contactInfo.qr_code_url} 
                      alt="QR Code" 
                      className="w-48 h-48 md:w-64 md:h-64 object-contain"
                    />
                  ) : (
                    <QrCode size={200} className="text-primary" />
                  )}
                </div>
                <p>UPI ID: sadkazakat@helpother</p>
              </div>
            </div>

            {/* Lillah */}
            <div className={`${cardBg} p-6 rounded-lg animate-scale-in delay-200 flex flex-col items-center text-center`}>
              <QrCode className="text-accent mb-6" size={60} />
              <h3 className="text-xl font-semibold mb-4">Lillah</h3>
              <div className={`space-y-8 ${textSecondary}`}>
                <p>Scan QR code for Lillah donations:</p>
                <div className="bg-white p-4 rounded-lg inline-block">
                  {contactInfo?.qr_code_url_2 ? (
                    <img 
                      src={contactInfo.qr_code_url_2} 
                      alt="QR Code" 
                      className="w-48 h-48 md:w-64 md:h-64 object-contain"
                    />
                  ) : (
                    <QrCode size={200} className="text-primary" />
                  )}
                </div>
                <p>UPI ID: lillah@helpother</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Modal — rendered via portal */}
      <VolunteerPopup
        isOpen={isVolunteerModalOpen}
        onClose={() => setIsVolunteerModalOpen(false)}
        onSubmit={handleVolunteerSubmit}
      />

      {/* Album Modal */}
      <AlbumModal
        album={selectedAlbum || null}
        isOpen={albumModalOpen}
        onClose={() => {
          setAlbumModalOpen(false);
          setSelectedAlbumId(null);
        }}
        isLoading={albumLoading}
      />

      {/* Event Details Modal */}
      <EventDetailsModal
        event={selectedEvent}
        isOpen={eventModalOpen}
        onClose={() => setEventModalOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>

  );
};

export default Index;