import React from "react";
import Navbar from "../components/Navbar";
import { TypewriterEffectSmooth } from "../components/TypewriterEffect";

const Gallery = () => {
  const galleryItems = [
    {
      title: "Medical Camp 2024",
      category: "Medical Help",
      image: "https://placehold.co/600x400",
    },
    {
      title: "Education Fair",
      category: "Education",
      image: "https://placehold.co/600x400",
    },
    {
      title: "Skill Development Workshop",
      category: "Aatma Nirbhar",
      image: "https://placehold.co/600x400",
    },
    {
      title: "Community Outreach",
      category: "Community",
      image: "https://placehold.co/600x400",
    },
    {
      title: "Charity Cricket Match",
      category: "Events",
      image: "https://placehold.co/600x400",
    },
    {
      title: "Distribution Drive",
      category: "Community",
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
                    {text:"Our"},{text:"Gallery", className:"text-accent"}
                  ]}
              />
            </div>
            <p className="text-lg md:text-xl text-surface/80 max-w-3xl mx-auto">
              A visual journey through our initiatives and the lives we've touched
              along the way.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
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
    </div>
  );
};

export default Gallery;
