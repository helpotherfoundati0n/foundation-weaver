
import React from "react";
import Navbar from "../components/Navbar";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { TypewriterEffectSmooth } from "../components/TypewriterEffect";
import { NavLink } from "react-router-dom";

const Events = () => {
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

  return (
    <div className="min-h-screen bg-primary text-surface">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center animate-fade-in">
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
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 px-4 bg-secondary">
        <div className="max-w-7xl mx-auto">
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
                <NavLink to="/auction">
                  <button className="bg-accent text-primary px-6 py-2 rounded-full font-medium hover:bg-accent/90 transition-colors">
                    Register Now
                  </button>
                </NavLink>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Past Events</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {pastEvents.map((event, index) => (
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
                    <MapPin size={16} />
                    <span>{event.location}</span>
                  </div>
                </div>
                <p className="text-surface/80 mb-6">{event.description}</p>
                <NavLink to="/blog">
                  <button className="text-accent hover:text-accent/80 transition-colors inline-flex items-center gap-2">
                    View Details <ArrowRight size={16} />
                  </button>
                </NavLink>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;
