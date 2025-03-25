
import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const CustomHeader: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 
        ${scrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Heart className="h-6 w-6 text-support-500" />
          <span className="font-medium text-lg tracking-tight font-playfair">EmotionalSupport</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#chat" className="text-foreground/80 hover:text-support-600 transition-colors">
            Talk to AI 💬
          </a>
          <a href="#stories" className="text-foreground/80 hover:text-support-600 transition-colors">
            Community Stories 📚
          </a>
          <a href="#about" className="text-foreground/80 hover:text-support-600 transition-colors">
            About ℹ️
          </a>
          <ThemeToggle />
        </nav>
        
        <div className="md:hidden">
          <button aria-label="Menu" className="text-foreground p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default CustomHeader;
