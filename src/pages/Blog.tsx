
import React from "react";
import Navbar from "../components/Navbar";
import { Calendar, ArrowRight } from "lucide-react";
import { Footer } from "react-day-picker";

const Blog = () => {
  const blogPosts = [
    {
      title: "Making a Difference Through Education",
      date: "March 1, 2024",
      excerpt: "How our educational initiatives are transforming lives in rural communities.",
      image: "https://placehold.co/600x400",
    },
    {
      title: "Healthcare Access for All",
      date: "February 25, 2024",
      excerpt: "Our medical camps are bringing essential healthcare services to underserved areas.",
      image: "https://placehold.co/600x400",
    },
    {
      title: "Success Stories: Aatma Nirbhar Program",
      date: "February 20, 2024",
      excerpt: "Meet the individuals who have achieved self-reliance through our support.",
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
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Our <span className="text-accent">Blog</span>
            </h1>
            <p className="text-lg md:text-xl text-surface/80 max-w-3xl mx-auto">
              Stories of impact, updates on our initiatives, and insights into our
              mission to create positive change.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <article
                key={post.title}
                className="bg-secondary rounded-lg overflow-hidden animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center gap-2 text-surface/60 text-sm mb-4">
                    <Calendar size={16} />
                    <span>{post.date}</span>
                  </div>
                  <h2 className="text-xl font-semibold mb-4">{post.title}</h2>
                  <p className="text-surface/80 mb-6">{post.excerpt}</p>
                  <button className="text-accent hover:text-accent/80 transition-colors inline-flex items-center gap-2">
                    Read More <ArrowRight size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Blog;
