
import React from "react";
import Navbar from "../components/Navbar";
import { HeartPulse, BookOpen, Wrench } from "lucide-react";
import { TypewriterEffectSmooth } from "../components/TypewriterEffect";
import { NavLink } from "react-router-dom";
import { Footer } from "react-day-picker";

const WhatWeDo = () => {
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
                    {text:"What"},{text:"We"},{text:"Do", className:"text-accent"}
                  ]}
              />
            </div>
            <p className="text-lg md:text-xl text-surface/80 max-w-3xl mx-auto">
              We focus on three main areas of assistance to help create lasting positive
              change in our community.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
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
          <div className="mb-16 grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
            <div className="animate-fade-in">
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
            <div className="bg-secondary p-8 rounded-lg animate-fade-in delay-100">
              <img 
                src="https://placehold.co/600x400" 
                alt="Education Help"
                className="rounded-lg w-full"
              />
            </div>
          </div>

          {/* Aatma Nirbhar Help */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
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
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-secondary">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Make a <span className="text-accent">Difference?</span>
          </h2>
          <p className="text-surface/80 mb-8 max-w-2xl mx-auto">
            Join us in our mission to create positive change. Whether through
            donations, volunteering, or spreading awareness, every contribution
            matters.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <NavLink to="/donate">
              <button className="bg-accent text-primary px-8 py-3 rounded-full font-medium hover:bg-accent/90 transition-colors">
               Donate Now
              </button>
            </NavLink>
            <NavLink to="/volunteer">
              <button className="border border-accent text-accent px-8 py-3 rounded-full font-medium hover:bg-accent/10 transition-colors">
                Become a Volunteer
              </button>
            </NavLink>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhatWeDo;
