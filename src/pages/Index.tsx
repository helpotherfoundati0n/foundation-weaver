import React from "react";
import { ArrowRight, Heart, Users, Award, HeartPulse, BookOpen, Wrench, Calendar, MapPin, Clock, Mail, Phone, Send } from "lucide-react";
import Navbar from "../components/Navbar";
import { TypewriterEffectSmooth } from "../components/TypewriterEffect";

const Index = () => {
  const teamMembers = [
    { name: "Team Member 1", role: "Founder", image: "https://placehold.co/400x400" },
    { name: "Team Member 2", role: "Co-Founder", image: "https://placehold.co/400x400" },
    { name: "Team Member 3", role: "Volunteer Coordinator", image: "https://placehold.co/400x400" },
  ];

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
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-primary text-surface">
      <Navbar />
      
      {/* Hero Section */}
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
                <Heart size={20} />
                Donate Now <ArrowRight size={20} />
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* About Us & What We Do Section */}
      <section id="about" className="py-16 px-4 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">About Us & <span className="text-accent">What We Do</span></h2>
            <p className="text-lg text-surface/80 max-w-3xl mx-auto mb-12">
              Founded in 2016, we started as a group of college friends raising funds 
              for a friend's medical treatment. Today, we've grown into a dedicated 
              foundation committed to helping those in need.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="animate-fade-in">
              <h3 className="text-2xl font-bold mb-6">Our Mission</h3>
              <p className="text-surface/80">
                To centralize efforts in aiding the needy and expanding our reach to help
                more individuals through medical assistance, education support, and
                self-reliance initiatives.
              </p>
            </div>
            <div className="animate-fade-in delay-100">
              <h3 className="text-2xl font-bold mb-6">Our Vision</h3>
              <p className="text-surface/80">
                To create a society where every individual has access to basic healthcare,
                quality education, and opportunities for self-reliance, regardless of their
                economic status.
              </p>
            </div>
          </div>

          {/* Our Services */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold mb-12 text-center">Our <span className="text-accent">Services</span></h3>
            
            {/* Medical Help */}
            <div className="mb-16 grid md:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in">
                <HeartPulse size={48} className="text-accent mb-6" />
                <h4 className="text-2xl font-bold mb-6">Medical Help</h4>
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
              <div className="bg-primary p-8 rounded-lg animate-fade-in delay-100">
                <img src="https://placehold.co/600x400" alt="Medical Help" className="rounded-lg w-full" />
              </div>
            </div>

            {/* Education Help */}
            <div className="mb-16 grid md:grid-cols-2 gap-12 items-center">
              <div className="bg-primary p-8 rounded-lg animate-fade-in md:order-1">
                <img src="https://placehold.co/600x400" alt="Education Help" className="rounded-lg w-full" />
              </div>
              <div className="animate-fade-in md:order-2">
                <BookOpen size={48} className="text-accent mb-6" />
                <h4 className="text-2xl font-bold mb-6">Education Help</h4>
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
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in">
                <Wrench size={48} className="text-accent mb-6" />
                <h4 className="text-2xl font-bold mb-6">Aatma Nirbhar Help</h4>
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
              <div className="bg-primary p-8 rounded-lg animate-fade-in delay-100">
                <img src="https://placehold.co/600x400" alt="Aatma Nirbhar Help" className="rounded-lg w-full" />
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold mb-12 text-center">Our <span className="text-accent">Values</span></h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 animate-fade-in">
                <Users size={48} className="text-accent mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-4">Community First</h4>
                <p className="text-surface/80">We prioritize the needs of our community in everything we do.</p>
              </div>
              <div className="text-center p-6 animate-fade-in delay-100">
                <Heart size={48} className="text-accent mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-4">Compassion</h4>
                <p className="text-surface/80">We approach every situation with empathy and understanding.</p>
              </div>
              <div className="text-center p-6 animate-fade-in delay-200">
                <Award size={48} className="text-accent mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-4">Excellence</h4>
                <p className="text-surface/80">We strive for excellence in our service to those in need.</p>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div>
            <h3 className="text-3xl font-bold mb-12 text-center">Our <span className="text-accent">Team</span></h3>
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
                  <h4 className="text-xl font-semibold mb-2">{member.name}</h4>
                  <p className="text-surface/80">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Our <span className="text-accent">Events</span></h2>
          <div className="grid md:grid-cols-2 gap-8">
            {upcomingEvents.map((event, index) => (
              <div
                key={event.title}
                className="bg-secondary p-6 rounded-lg animate-scale-in"
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
                <button className="bg-accent text-primary px-6 py-2 rounded-full font-medium hover:bg-accent/90 transition-colors">
                  Register Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-16 px-4 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Our <span className="text-accent">Gallery</span></h2>
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
      <section id="contact" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Contact <span className="text-accent">Us</span></h2>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="animate-fade-in">
              <h3 className="text-2xl font-bold mb-8">Send us a message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 rounded-lg bg-secondary text-surface border border-surface/10 focus:border-accent focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 rounded-lg bg-secondary text-surface border border-surface/10 focus:border-accent focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-4 py-2 rounded-lg bg-secondary text-surface border border-surface/10 focus:border-accent focus:outline-none"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-accent text-primary px-8 py-3 rounded-full font-medium hover:bg-accent/90 transition-colors inline-flex items-center gap-2"
                >
                  <Heart size={16} />
                  Send Message <Send size={16} />
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="animate-fade-in delay-100">
              <h3 className="text-2xl font-bold mb-8">Get in touch</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="text-accent" size={24} />
                  <div>
                    <h4 className="font-semibold mb-2">Email</h4>
                    <p className="text-surface/80">info@helpotherfoundation.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="text-accent" size={24} />
                  <div>
                    <h4 className="font-semibold mb-2">Phone</h4>
                    <p className="text-surface/80">+91 1234567890</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="text-accent" size={24} />
                  <div>
                    <h4 className="font-semibold mb-2">Address</h4>
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
    </div>
  );
};

export default Index;