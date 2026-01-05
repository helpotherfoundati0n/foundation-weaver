import React, { useEffect, useState } from "react";
import { ArrowRight, Users, Heart, Award, HeartPulse, BookOpen, Wrench, Calendar, MapPin, Clock, Mail, Phone, Send, QrCode, X } from "lucide-react";
import Navbar from "../components/Navbar";
import { TypewriterEffectSmooth } from "../components/TypewriterEffect";
import { AnimatePresence, motion } from "framer-motion";
import { useActiveEvents } from "@/hooks/useEvents";
import { useGallery } from "@/hooks/useGallery";
import { useContactInfo } from "@/hooks/useContactInfo";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useActiveActivities } from "@/hooks/useActivities";
import { Loader2 } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  HeartPulse,
  BookOpen,
  Wrench,
  Users,
  Heart,
  Award,
};

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);

  // Fetch dynamic data
  const { data: events, isLoading: eventsLoading } = useActiveEvents();
  const { data: gallery, isLoading: galleryLoading } = useGallery();
  const { data: contactInfo, isLoading: contactLoading } = useContactInfo();
  const { data: siteContent, isLoading: contentLoading } = useSiteContent();
  const { data: activities, isLoading: activitiesLoading } = useActiveActivities();

  // Helper to get content by key
  const getContent = (key: string) => {
    return siteContent?.find(c => c.section_key === key);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleVolunteerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVolunteerModalOpen(false);
  };

  const isLoading = eventsLoading || galleryLoading || contactLoading || contentLoading || activitiesLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary text-surface">
      <Navbar activeSection={activeSection} />
      
      {/* Home Section */}
      <section id="home" className="w-full h-screen flex items-center px-4 bg-home bg-cover bg-center">
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

            <p className="text-lg md:text-xl text-surface/80 max-w-2xl mx-auto mb-8">
              {getContent('hero_subtitle')?.content || 'Join us in our mission to assist the underprivileged through education and healthcare initiatives.'}
            </p>
            <a href="#contact">
              <button className="bg-accent text-primary px-8 py-3 rounded-full font-medium hover:bg-accent/90 transition-colors inline-flex items-center gap-2">
                {getContent('hero_button')?.content || 'Get Involved'} <ArrowRight size={20} />
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* About Us & What We Do Section */}
      <section id="about-what-we-do" className="py-8 px-4 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center typewriter-title">
              <TypewriterEffectSmooth
                words={[
                  {text:"About"},{text:"Us"},{text:"&"},{text:"What"},{text:"We"},{text:"Do", className:"text-accent"}
                ]}
              />
            </div>
            <p className="text-lg md:text-xl text-surface/80 max-w-3xl mx-auto">
              {getContent('about_content')?.content || 'Founded in 2025, our foundation grew out of a deep-rooted bond of friendship and a shared mission to serve.'}
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold mb-6">
                {getContent('mission_title')?.content || 'Our Mission'}
              </h2>
              <p className="text-surface/80">
                {getContent('mission_content')?.content || 'To centralize efforts in aiding the needy and expanding our reach to help more individuals through medical assistance, education support, and self-reliance initiatives.'}
              </p>
            </div>
            <div className="animate-fade-in delay-100">
              <h2 className="text-3xl font-bold mb-6">
                {getContent('vision_title')?.content || 'Our Vision'}
              </h2>
              <p className="text-surface/80">
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
                      <p className="text-surface/80 mb-4">{activity.description}</p>
                      {activity.list_items && activity.list_items.length > 0 && (
                        <ul className="list-disc list-inside text-surface/80 space-y-2">
                          {activity.list_items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className={`bg-primary p-8 rounded-lg animate-fade-in delay-100 ${!isEven ? 'order-2 md:order-1' : ''}`}>
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
              <div className="text-center py-12 bg-primary rounded-lg">
                <p className="text-surface/60">No activities configured yet.</p>
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
                <p className="text-surface/80">
                  {getContent('value_1_content')?.content || 'We prioritize the needs of our community in everything we do.'}
                </p>
              </div>
              <div className="text-center p-6 animate-fade-in delay-100">
                <Heart size={48} className="text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">
                  {getContent('value_2_title')?.content || 'Compassion'}
                </h3>
                <p className="text-surface/80">
                  {getContent('value_2_content')?.content || 'We approach every situation with empathy and understanding.'}
                </p>
              </div>
              <div className="text-center p-6 animate-fade-in delay-200">
                <Award size={48} className="text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">
                  {getContent('value_3_title')?.content || 'Excellence'}
                </h3>
                <p className="text-surface/80">
                  {getContent('value_3_content')?.content || 'We strive for excellence in our service to those in need.'}
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-primary p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Make a <span className="text-accent">Difference?</span>
            </h2>
            <p className="text-surface/80 mb-8 max-w-2xl mx-auto">
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
      <section id="events" className="py-8 px-4 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center typewriter-title">
              <TypewriterEffectSmooth
                words={[
                  {text:"Our"},{text:"Events", className:"text-accent"}
                ]}
              />
            </div>
            <p className="text-lg md:text-xl text-surface/80 max-w-3xl mx-auto">
              Join us in making a difference. Check out our upcoming events and see
              the impact of our past initiatives.
            </p>
          </div>

          {/* Dynamic Events */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-12">Events</h2>
            {events && events.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-8">
                {events.map((event, index) => (
                  <div
                    key={event.id}
                    className="bg-primary p-6 rounded-lg animate-scale-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {event.image_url && (
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-48 object-cover rounded-lg mb-6"
                      />
                    )}
                    <h3 className="text-xl font-semibold mb-4">{event.title}</h3>
                    <div className="space-y-2 text-surface/80 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{new Date(event.event_date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                    </div>
                    {event.description && (
                      <p className="text-surface/80 mb-6">{event.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-primary rounded-lg">
                <Calendar className="h-12 w-12 text-surface/40 mx-auto mb-4" />
                <p className="text-surface/60">No upcoming events at the moment. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center typewriter-title">
              <TypewriterEffectSmooth
                words={[
                  {text:"Our"},{text:"Gallery", className:"text-accent"}
                ]}
              />
            </div>
            <p className="text-lg md:text-xl text-surface/80 max-w-3xl mx-auto">
              A visual journey through our initiatives and the lives we've touched
              along the way.
            </p>
          </div>

          {gallery && gallery.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gallery.map((item, index) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-lg animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <img
                    src={item.image_url}
                    alt={item.caption || 'Gallery image'}
                    className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-110"
                  />
                  {item.caption && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <p className="text-surface/80">{item.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-secondary rounded-lg">
              <p className="text-surface/60">Gallery images coming soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-8 px-4 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center typewriter-title">
              <TypewriterEffectSmooth
                words={[
                  {text:"Contact"},{text:"Us", className:"text-accent"}
                ]}
              />
            </div>
            <p className="text-lg md:text-xl text-surface/80 max-w-3xl mx-auto">
              We're here to help. Reach out to us with any questions or concerns.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold mb-8">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 rounded-lg bg-primary text-surface border border-surface/10 focus:border-accent focus:outline-none"
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
                    className="w-full px-4 py-2 rounded-lg bg-primary text-surface border border-surface/10 focus:border-accent focus:outline-none"
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
                    className="w-full px-4 py-2 rounded-lg bg-primary text-surface border border-surface/10 focus:border-accent focus:outline-none"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-accent text-primary px-8 py-3 rounded-full font-medium hover:bg-accent/90 transition-colors inline-flex items-center gap-2"
                >
                  Send Message <Send size={16} />
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
                    <p className="text-surface/80">{contactInfo?.email || 'help@jaipas.lu'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="text-accent" size={24} />
                  <div>
                    <h3 className="font-semibold mb-2">Phone</h3>
                    <p className="text-surface/80">{contactInfo?.phone || '+352 123 456 789'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="text-accent" size={24} />
                  <div>
                    <h3 className="font-semibold mb-2">Address</h3>
                    <p className="text-surface/80 whitespace-pre-line">
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
      <section id="donate" className="py-8 px-4 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center typewriter-title">
              <TypewriterEffectSmooth
                words={[
                  {text:"Make"},{text:"a"},{text:"Difference", className:"text-accent"}
                ]}
              />
            </div>
            <p className="text-lg md:text-xl text-surface/80 max-w-3xl mx-auto">
              Your contribution can help us continue our mission of supporting those
              in need through various initiatives.
            </p>
          </div>

          <h2 className="text-3xl font-bold mb-12 text-center">
            Ways to <span className="text-accent">Donate</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {/* Sadka & Zakat */}
            <div className="bg-primary p-6 rounded-lg animate-scale-in delay-100 flex flex-col items-center text-center">
              <QrCode className="text-accent mb-6" size={60} />
              <h3 className="text-xl font-semibold mb-4">Sadka & Zakat</h3>
              <div className="space-y-8 text-surface/80">
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
            <div className="bg-primary p-6 rounded-lg animate-scale-in delay-200 flex flex-col items-center text-center">
              <QrCode className="text-accent mb-6" size={60} />
              <h3 className="text-xl font-semibold mb-4">Lillah</h3>
              <div className="space-y-8 text-surface/80">
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

      {/* Volunteer Modal */}
      <AnimatePresence>
        {isVolunteerModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVolunteerModalOpen(false)}
          >
            <motion.div
              className="bg-primary rounded-2xl max-w-2xl w-full shadow-xl overflow-hidden"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-surface/10">
                <h2 className="text-xl font-bold">
                  Become a <span className="text-accent">Volunteer</span>
                </h2>
                <button
                  onClick={() => setIsVolunteerModalOpen(false)}
                  className="text-surface hover:text-accent transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                <p className="text-surface/70 text-center max-w-md mx-auto">
                  Join our team of dedicated volunteers and help us make a difference
                  in the lives of those in need.
                </p>

                <form
                  onSubmit={handleVolunteerSubmit}
                  className="space-y-6 animate-fade-in"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 rounded-lg bg-secondary text-surface border border-surface/20 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        className="w-full px-4 py-2 rounded-lg bg-secondary text-surface border border-surface/20 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="w-full px-4 py-2 rounded-lg bg-secondary text-surface border border-surface/20 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">City</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 rounded-lg bg-secondary text-surface border border-surface/20 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Why do you want to volunteer?
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg bg-secondary text-surface border border-surface/20 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                      required
                    ></textarea>
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-accent text-primary px-8 py-3 rounded-full font-medium flex items-center justify-center gap-2"
                  >
                    Submit Application <Send size={16} />
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

  );
};

export default Index;
