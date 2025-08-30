import React, { useEffect, useState } from "react";
import { ArrowRight, Users, Heart, Award, HeartPulse, BookOpen, Wrench, Calendar, MapPin, Clock, Mail, Phone, Send, MessageCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import { TypewriterEffectSmooth } from "../components/TypewriterEffect";

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'what-we-do', 'events', 'gallery', 'contact', 'whatsapp'];
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

  // Team members data
  const teamMembers = [
    { name: "Team Member 1", role: "Founder", image: "https://placehold.co/400x400" },
    { name: "Team Member 2", role: "Co-Founder", image: "https://placehold.co/400x400" },
    { name: "Team Member 3", role: "Volunteer Coordinator", image: "https://placehold.co/400x400" },
  ];

  // Events data
  const upcomingEvents = [
    {
      title: "Charity Cricket Match",
      date: "March 15, 2024", 
      time: "9:00 AM - 5:00 PM",
      location: "City Sports Complex",
      description: "Join us for a day of cricket and charity to raise funds for medical assistance programs.",
      image: "https://placehold.co/600x400",
    },
    {
      title: "Education Fair",
      date: "March 20, 2024",
      time: "10:00 AM - 4:00 PM", 
      location: "Community Center",
      description: "Annual education fair providing resources and support for underprivileged students.",
      image: "https://placehold.co/600x400",
    },
  ];

  const pastEvents = [
    {
      title: "Medical Camp",
      date: "February 28, 2024",
      location: "Rural Health Center", 
      description: "Free medical checkups and consultations for over 200 patients.",
      image: "https://placehold.co/600x400",
    },
    {
      title: "Skill Development Workshop", 
      date: "February 15, 2024",
      location: "Training Center",
      description: "Vocational training program for youth empowerment.",
      image: "https://placehold.co/600x400",
    },
  ];

  // Gallery data
  const galleryItems = [
    { title: "Medical Camp 2024", category: "Medical Help", image: "https://placehold.co/600x400" },
    { title: "Education Fair", category: "Education", image: "https://placehold.co/600x400" },
    { title: "Skill Development Workshop", category: "Aatma Nirbhar", image: "https://placehold.co/600x400" },
    { title: "Community Outreach", category: "Community", image: "https://placehold.co/600x400" },
    { title: "Charity Cricket Match", category: "Events", image: "https://placehold.co/600x400" },
    { title: "Distribution Drive", category: "Community", image: "https://placehold.co/600x400" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-primary text-surface">
      <Navbar activeSection={activeSection} />
      
      {/* Home Section */}
      <section id="home" className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center animate-fade-in">
            <div className="flex justify-center">
              <TypewriterEffectSmooth
                words={[
                  { text: "Every" }, { text: "good" }, { text: "act" }, { text: "is" },
                  { text: "charity!", className: "text-accent" },
                ]}
              />
            </div>
            <p className="text-lg md:text-xl text-surface/80 max-w-2xl mx-auto mb-8">
              Join us in our mission to assist the underprivileged through education
              and healthcare initiatives.
            </p>
            <a href="#contact">
              <button className="bg-accent text-primary px-8 py-3 rounded-full font-medium hover:bg-accent/90 transition-colors inline-flex items-center gap-2">
                Get Involved <ArrowRight size={20} />
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center">
              <TypewriterEffectSmooth
                words={[
                  {text:"About"},{text:"Us", className:"text-accent"}
                ]}
              />
            </div>
            <p className="text-lg md:text-xl text-surface/80 max-w-3xl mx-auto">
              Founded in 2016, we started as a group of college friends raising funds 
              for a friend's medical treatment. Today, we've grown into a dedicated 
              foundation committed to helping those in need.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-surface/80">
                To centralize efforts in aiding the needy and expanding our reach to help
                more individuals through medical assistance, education support, and
                self-reliance initiatives.
              </p>
            </div>
            <div className="animate-fade-in delay-100">
              <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
              <p className="text-surface/80">
                To create a society where every individual has access to basic healthcare,
                quality education, and opportunities for self-reliance, regardless of their
                economic status.
              </p>
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-12 text-center">
              Our <span className="text-accent">Team</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div 
                  key={member.name}
                  className="bg-primary p-6 rounded-lg text-center animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-surface/80">{member.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Values Section */}
          <div>
            <h2 className="text-3xl font-bold mb-12 text-center">
              Our <span className="text-accent">Values</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 animate-fade-in">
                <Users size={48} className="text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">Community First</h3>
                <p className="text-surface/80">
                  We prioritize the needs of our community in everything we do.
                </p>
              </div>
              <div className="text-center p-6 animate-fade-in delay-100">
                <Heart size={48} className="text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">Compassion</h3>
                <p className="text-surface/80">
                  We approach every situation with empathy and understanding.
                </p>
              </div>
              <div className="text-center p-6 animate-fade-in delay-200">
                <Award size={48} className="text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">Excellence</h3>
                <p className="text-surface/80">
                  We strive for excellence in our service to those in need.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section id="what-we-do" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center">
              <TypewriterEffectSmooth
                words={[
                  {text:"What"},{text:"We"},{text:"Do", className:"text-accent"}
                ]}
              />
            </div>
            <p className="text-lg md:text-xl text-surface/80 max-w-3xl mx-auto">
              We focus on three main areas of assistance to help create lasting positive
              change in our community.
            </p>
          </div>

          {/* Medical Help */}
          <div className="mb-16 grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <HeartPulse size={48} className="text-accent mb-6" />
              <h2 className="text-3xl font-bold mb-6">Medical Help</h2>
              <p className="text-surface/80 mb-4">
                We provide crucial support for emergency medical cases and assist with
                medical expenses for those who cannot afford treatment.
              </p>
              <ul className="list-disc list-inside text-surface/80 space-y-2">
                <li>Emergency medical assistance</li>
                <li>Support for ongoing treatment costs</li>
                <li>Guidance for MAA/Ayushman Card enrollment</li>
                <li>Medical camps and health awareness programs</li>
              </ul>
            </div>
            <div className="bg-secondary p-8 rounded-lg animate-fade-in delay-100">
              <img 
                src="https://placehold.co/600x400" 
                alt="Medical Help"
                className="rounded-lg w-full"
              />
            </div>
          </div>

          {/* Education Help */}
          <div className="mb-16 grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-secondary p-8 rounded-lg animate-fade-in order-2 md:order-1">
              <img 
                src="https://placehold.co/600x400" 
                alt="Education Help"
                className="rounded-lg w-full"
              />
            </div>
            <div className="animate-fade-in order-1 md:order-2">
              <BookOpen size={48} className="text-accent mb-6" />
              <h2 className="text-3xl font-bold mb-6">Education Help</h2>
              <p className="text-surface/80 mb-4">
                We believe education is key to breaking the cycle of poverty and
                creating sustainable change in communities.
              </p>
              <ul className="list-disc list-inside text-surface/80 space-y-2">
                <li>School fee assistance</li>
                <li>Educational materials and supplies</li>
                <li>Tutoring and mentoring programs</li>
                <li>Scholarship opportunities</li>
              </ul>
            </div>
          </div>

          {/* Aatma Nirbhar Help */}
          <div className="mb-16 grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <Wrench size={48} className="text-accent mb-6" />
              <h2 className="text-3xl font-bold mb-6">Aatma Nirbhar Help</h2>
              <p className="text-surface/80 mb-4">
                We empower individuals to become self-reliant through various
                initiatives and support programs.
              </p>
              <ul className="list-disc list-inside text-surface/80 space-y-2">
                <li>Vocational training programs</li>
                <li>Small business setup support</li>
                <li>Tools and equipment provision</li>
                <li>Skills development workshops</li>
              </ul>
            </div>
            <div className="bg-secondary p-8 rounded-lg animate-fade-in delay-100">
              <img 
                src="https://placehold.co/600x400" 
                alt="Aatma Nirbhar Help"
                className="rounded-lg w-full"
              />
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-secondary p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Make a <span className="text-accent">Difference?</span>
            </h2>
            <p className="text-surface/80 mb-8 max-w-2xl mx-auto">
              Join us in our mission to create positive change. Whether through
              donations, volunteering, or spreading awareness, every contribution
              matters.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/donate">
                <button className="bg-accent text-primary px-8 py-3 rounded-full font-medium hover:bg-accent/90 transition-colors">
                  Donate Now
                </button>
              </a>
              <a href="/volunteer">
                <button className="border border-accent text-accent px-8 py-3 rounded-full font-medium hover:bg-accent/10 transition-colors">
                  Become a Volunteer
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-16 px-4 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center">
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

          {/* Upcoming Events */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-12">Upcoming Events</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {upcomingEvents.map((event, index) => (
                <div
                  key={event.title}
                  className="bg-primary p-6 rounded-lg animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover rounded-lg mb-6"
                  />
                  <h3 className="text-xl font-semibold mb-4">{event.title}</h3>
                  <div className="space-y-2 text-surface/80 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <p className="text-surface/80 mb-6">{event.description}</p>
                  <a href="/auction">
                    <button className="bg-accent text-primary px-6 py-2 rounded-full font-medium hover:bg-accent/90 transition-colors">
                      Register Now
                    </button>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Past Events */}
          <div>
            <h2 className="text-3xl font-bold mb-12">Past Events</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {pastEvents.map((event, index) => (
                <div
                  key={event.title}
                  className="bg-primary p-6 rounded-lg animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover rounded-lg mb-6"
                  />
                  <h3 className="text-xl font-semibold mb-4">{event.title}</h3>
                  <div className="space-y-2 text-surface/80 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <p className="text-surface/80 mb-6">{event.description}</p>
                  <a href="/blog">
                    <button className="text-accent hover:text-accent/80 transition-colors inline-flex items-center gap-2">
                      View Details <ArrowRight size={16} />
                    </button>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryItems.map((item, index) => (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-lg animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-surface/80">{item.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center">
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

            {/* Contact Information */}
            <div className="animate-fade-in delay-100">
              <h2 className="text-3xl font-bold mb-8">Get in touch</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="text-accent" size={24} />
                  <div>
                    <h3 className="font-semibold mb-2">Email</h3>
                    <p className="text-surface/80">info@helpotherfoundation.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="text-accent" size={24} />
                  <div>
                    <h3 className="font-semibold mb-2">Phone</h3>
                    <p className="text-surface/80">+91 1234567890</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="text-accent" size={24} />
                  <div>
                    <h3 className="font-semibold mb-2">Address</h3>
                    <p className="text-surface/80">
                      123 NGO Street, Charity Lane<br />
                      Mumbai, Maharashtra 400001<br />
                      India
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Section */}
      <section id="whatsapp" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center">
              <TypewriterEffectSmooth
                words={[
                  {text:"Join"},{text:"Our"},{text:"WhatsApp", className:"text-accent"},{text:"Community"}
                ]}
              />
            </div>
            <p className="text-lg md:text-xl text-surface/80 max-w-3xl mx-auto">
              Stay connected with our community and receive real-time updates about our
              initiatives and opportunities to help.
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-secondary p-8 rounded-lg">
            <div className="text-center space-y-6">
              <MessageCircle size={48} className="text-accent mx-auto" />
              <h2 className="text-2xl font-bold">Connect With Us on WhatsApp</h2>
              <p className="text-surface/80">
                Join our WhatsApp group to:
              </p>
              <ul className="text-left space-y-3 max-w-md mx-auto text-surface/80">
                <li className="flex items-center gap-2">
                  • Receive instant updates about our activities
                </li>
                <li className="flex items-center gap-2">
                  • Learn about emergency cases requiring immediate help
                </li>
                <li className="flex items-center gap-2">
                  • Connect with fellow volunteers and supporters
                </li>
                <li className="flex items-center gap-2">
                  • Share your ideas and suggestions
                </li>
              </ul>
              <button
                className="bg-[#25D366] text-white px-8 py-3 rounded-full font-medium hover:bg-[#25D366]/90 transition-colors inline-flex items-center gap-2"
                onClick={() => window.open("https://chat.whatsapp.com/I6qeCbrJ7is6QJJdOay4kD", "_blank")}
              >
                Join WhatsApp Group <MessageCircle size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;