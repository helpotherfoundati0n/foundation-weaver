import React from "react";
import { Menu, X, Heart } from "lucide-react";
import logo from './path/to/logo.png'; // Adjust the path to your logo file

interface NavbarProps {
  activeSection?: string;
}

const Navbar = ({ activeSection = 'home' }: NavbarProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "#home" },
    { name: "About", path: "#about-what-we-do" },
    { name: "Events", path: "#events" },
    { name: "Gallery", path: "#gallery" },
    { name: "Contact", path: "#contact" },
    { name: "Whatsapp", path: "#whatsapp", isLogo: true },
  ];

  const handleNavClick = (path: string, sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 90; // Account for navbar height
      const targetPosition = element.offsetTop - navbarHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Trigger animation for section title
      const titleElement = element.querySelector('.typewriter-title');
      if (titleElement) {
        titleElement.classList.remove('animate-fade-in');
        setTimeout(() => titleElement.classList.add('animate-fade-in'), 10);
      }
    }
    setIsOpen(false);
  };

  return (
    <nav className={`fixed w-full bg-black/90 backdrop-blur-md z-50 px-4 transition-all duration-300 ${
      isScrolled ? 'py-2' : 'pb-2'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="#home" onClick={(e) => { e.preventDefault(); handleNavClick('#home', 'home'); }} className="flex items-center text-2xl font-bold text-accent">
          <img src={logo} alt="Logo" className={`mr-4 mt-4 transition-all duration-300 ${
            isScrolled ? 'h-16' : 'h-20'
          }`} />
          Help Other Foundation
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.path}
              onClick={(e) => {
                e.preventDefault();
                const sectionId = item.path.substring(1); // Remove # from path
                handleNavClick(item.path, sectionId);
              }}
              className={`text-sm font-medium transition-colors hover:text-accent cursor-pointer relative
                ${!item.isLogo && activeSection === item.path.substring(1) ? "text-accent after:scale-x-100" : !item.isLogo ? "text-surface after:scale-x-0" : "text-surface"}
                ${!item.isLogo ? "after:content-[''] after:absolute after:w-full after:h-0.5 after:bottom-0 after:left-0 after:bg-accent after:origin-bottom-left after:transition-transform after:duration-300" : ""}`}
            >
              {item.isLogo ? (
                <span className="[&>svg]:h-7 [&>svg]:w-7 [&>svg]:fill-[#128c7e]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 448 512">
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                  </svg>
                </span>
              ) : (
                item.name
              )}
            </a>
          ))}
          <a href="#donate" onClick={(e) => { e.preventDefault(); handleNavClick('#donate', 'donate'); }}>
            <button className="bg-accent text-primary px-6 py-2 rounded-full font-medium hover:bg-accent/90 transition-colors inline-flex items-center gap-2">
              <Heart size={16} />
              Donate
            </button>
          </a>
        </div>

        {/* Mobile Navigation */}
        <button
          className="md:hidden text-surface hover:text-accent"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 w-full bg-black/90 backdrop-blur-md py-4 md:hidden animate-fade-in">
            <div className="flex flex-col space-y-4 px-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    const sectionId = item.path.substring(1); // Remove # from path
                    handleNavClick(item.path, sectionId);
                  }}
                  className={`text-sm font-medium transition-colors hover:text-accent cursor-pointer relative
                    ${!item.isLogo && activeSection === item.path.substring(1) ? "text-accent after:scale-x-100" : !item.isLogo ? "text-surface after:scale-x-0" : "text-surface"}
                    ${!item.isLogo ? "after:content-[''] after:absolute after:w-full after:h-0.5 after:bottom-0 after:left-0 after:bg-accent after:origin-bottom-left after:transition-transform after:duration-300" : ""}`}
                >
                  {item.isLogo ? (
                    <span className="[&>svg]:h-7 [&>svg]:w-7 [&>svg]:fill-[#128c7e]">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 448 512">
                        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                      </svg>
                    </span>
                  ) : (
                    item.name
                  )}
                </a>
              ))}
              <a href="#donate" onClick={(e) => { e.preventDefault(); handleNavClick('#donate', 'donate'); }}>
                <button className="bg-accent text-primary px-6 py-2 rounded-full font-medium hover:bg-accent/90 transition-colors inline-flex items-center gap-2">
                  <Heart size={16} />
                  Donate
                </button>
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;