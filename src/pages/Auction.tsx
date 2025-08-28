
import React from "react";
import Navbar from "../components/Navbar";
import { Gavel, Calendar, MapPin, Send } from "lucide-react";

const Auction = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-primary text-surface">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Charity <span className="text-accent">Auction</span>
            </h1>
            <p className="text-lg md:text-xl text-surface/80 max-w-3xl mx-auto">
              Join our upcoming charity auction and bid on unique items while
              supporting our cause.
            </p>
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-16 px-4 bg-secondary">
        <div className="max-w-3xl mx-auto">
          <div className="bg-primary p-8 rounded-lg">
            <div className="flex items-center gap-4 mb-8">
              <Gavel className="text-accent" size={32} />
              <h2 className="text-2xl font-bold">Upcoming Auction Event</h2>
            </div>
            <div className="space-y-6 mb-8">
              <div className="flex items-center gap-3">
                <Calendar className="text-accent" size={24} />
                <div>
                  <h3 className="font-semibold">Date & Time</h3>
                  <p className="text-surface/80">March 30, 2024 at 2:00 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="text-accent" size={24} />
                <div>
                  <h3 className="font-semibold">Location</h3>
                  <p className="text-surface/80">Grand Hotel, Mumbai</p>
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 rounded-lg bg-secondary text-surface border border-surface/10 focus:border-accent focus:outline-none"
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
                    className="w-full px-4 py-2 rounded-lg bg-secondary text-surface border border-surface/10 focus:border-accent focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-2 rounded-lg bg-secondary text-surface border border-surface/10 focus:border-accent focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="guests" className="block text-sm font-medium mb-2">
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    id="guests"
                    min="1"
                    className="w-full px-4 py-2 rounded-lg bg-secondary text-surface border border-surface/10 focus:border-accent focus:outline-none"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-accent text-primary px-8 py-3 rounded-full font-medium hover:bg-accent/90 transition-colors inline-flex items-center gap-2"
              >
                Register for Auction <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Auction;
