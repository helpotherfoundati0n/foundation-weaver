
import React from "react";
import Navbar from "../components/Navbar";
import { Users, Heart, Award } from "lucide-react";
import { TypewriterEffectSmooth } from "../components/TypewriterEffect";

const About = () => {
  const teamMembers = [
    {
      name: "Team Member 1",
      role: "Founder",
      image: "https://placehold.co/400x400",
    },
    {
      name: "Team Member 2",
      role: "Co-Founder",
      image: "https://placehold.co/400x400",
    },
    {
      name: "Team Member 3",
      role: "Volunteer Coordinator",
      image: "https://placehold.co/400x400",
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
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 bg-secondary">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
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
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Our <span className="text-accent">Team</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={member.name}
                className="bg-secondary p-6 rounded-lg text-center animate-scale-in"
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
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-secondary">
        <div className="max-w-7xl mx-auto">
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
      </section>
    </div>
  );
};

export default About;
