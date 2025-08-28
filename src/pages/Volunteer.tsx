
import React from "react";
import Navbar from "../components/Navbar";
import { Users, Send } from "lucide-react";

const Volunteer = () => {
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
              Become a <span className="text-accent">Volunteer</span>
            </h1>
            <p className="text-lg md:text-xl text-surface/80 max-w-3xl mx-auto">
              Join our team of dedicated volunteers and help us make a difference in
              the lives of those in need.
            </p>
          </div>
        </div>
      </section>

      {/* Volunteer Form */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-secondary p-8 rounded-lg">
            <div className="flex items-center gap-4 mb-8">
              <Users className="text-accent" size={32} />
              <h2 className="text-2xl font-bold">Volunteer Registration</h2>
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
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-2 rounded-lg bg-primary text-surface border border-surface/10 focus:border-accent focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    className="w-full px-4 py-2 rounded-lg bg-primary text-surface border border-surface/10 focus:border-accent focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Why do you want to volunteer?
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-primary text-surface border border-surface/10 focus:border-accent focus:outline-none"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-accent text-primary px-8 py-3 rounded-full font-medium hover:bg-accent/90 transition-colors inline-flex items-center gap-2"
              >
                Submit Application <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Volunteer;
