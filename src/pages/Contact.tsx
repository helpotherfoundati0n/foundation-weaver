
import React from "react";
import Navbar from "../components/Navbar";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { TypewriterEffectSmooth } from "../components/TypewriterEffect";

const Contact = () => {
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
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
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
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
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
      </section>
    </div>
  );
};

export default Contact;
