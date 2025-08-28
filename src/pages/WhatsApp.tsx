
import React from "react";
import Navbar from "../components/Navbar";
import { TypewriterEffectSmooth } from "../components/TypewriterEffect";
import { MessageCircle } from "lucide-react";

const WhatsApp = () => {
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
                    {text:"Join"},{text:"Our"},{text:"WhatsApp", className:"text-accent"},{text:"Community"}
                  ]}
              />
            </div>
            <p className="text-lg md:text-xl text-surface/80 max-w-3xl mx-auto">
              Stay connected with our community and receive real-time updates about our
              initiatives and opportunities to help.
            </p>
          </div>
        </div>
      </section>

      {/* WhatsApp Section */}
      <section className="pb-6 px-4">
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
      </section>
    </div>
  );
};

export default WhatsApp;
