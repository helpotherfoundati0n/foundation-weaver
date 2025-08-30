import React from "react";
import { ArrowRight } from "lucide-react";
import StatCounter from "../components/StatCounter";
import Navbar from "../components/Navbar";
import { TypewriterEffectSmooth } from "../components/TypewriterEffect";
import { NavLink } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-primary text-surface">
      <Navbar />
      
      <section className="pt-24 pb-16 px-4">
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
            <NavLink to="/donate">
              <button className="bg-accent text-primary px-8 py-3 rounded-full font-medium hover:bg-accent/90 transition-colors inline-flex items-center gap-2">
                Get Involved <ArrowRight size={20} />
              </button>
            </NavLink>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCounter number={5000} label="Lives Impacted" />
            <StatCounter number={200} label="Active Volunteers" />
            <StatCounter number={100} label="Events Organized" />
            <StatCounter number={50} label="Partner Organizations" />
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Recent <span className="text-accent">Updates</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-secondary p-6 rounded-lg transform transition-transform duration-300 hover:scale-105"
              >
                <h3 className="text-xl font-semibold mb-4">
                  Cycle Rally for Medical Help
                </h3>
                <p className="text-surface/80 mb-4">
                  Join us in our upcoming charity cycle rally to raise funds for
                  medical assistance programs.
                </p>
                <button className="text-accent hover:text-accent/80 transition-colors inline-flex items-center gap-2">
                  Learn More <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;