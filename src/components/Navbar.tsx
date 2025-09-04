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
                ${activeSection === item.path.substring(1) ? "text-accent after:scale-x-100" : "text-surface after:scale-x-0"}
                after:content-[''] after:absolute after:w-full after:h-0.5 after:bottom-0 after:left-0 after:bg-accent after:origin-bottom-left after:transition-transform after:duration-300`}
            >
              {item.name}
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
                    ${activeSection === item.path.substring(1) ? "text-accent after:scale-x-100" : "text-surface after:scale-x-0"}
                    after:content-[''] after:absolute after:w-full after:h-0.5 after:bottom-0 after:left-0 after:bg-accent after:origin-bottom-left after:transition-transform after:duration-300`}
                >
                  {item.name}
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