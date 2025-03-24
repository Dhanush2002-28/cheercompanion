
import React, { useEffect, useRef } from 'react';
import { Heart, MessageCircle, Shield } from 'lucide-react';

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const elements = containerRef.current?.querySelectorAll('.reveal');
    elements?.forEach((el) => observer.observe(el));
    
    return () => {
      elements?.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-16" ref={containerRef}>
      <div className="absolute top-0 left-0 right-0 h-screen bg-gradient-to-b from-support-50/40 to-background -z-10"></div>
      
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-support-100 text-support-600 mb-8 reveal">
          <Shield className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Anonymous & Private</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-6 reveal">
          Find <span className="text-support-600 font-normal">emotional support</span> when you need it most
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto reveal">
          A safe space to share your feelings, connect with others who understand, and receive compassionate AI support without judgment.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 reveal">
          <a 
            href="#chat" 
            className="px-6 py-3 rounded-lg bg-support-600 text-white hover:bg-support-500 transition-colors shadow-sm flex items-center"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            <span>Talk to AI Companion</span>
          </a>
          
          <a 
            href="#stories" 
            className="px-6 py-3 rounded-lg border border-support-200 hover:bg-support-50 transition-colors flex items-center"
          >
            <Heart className="h-5 w-5 mr-2" />
            <span>Read Community Stories</span>
          </a>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full">
        {[
          {
            icon: <MessageCircle className="h-10 w-10 text-support-500 mb-4" />,
            title: "AI Emotional Support",
            description: "Our AI companion provides compassionate responses tailored to your emotional needs."
          },
          {
            icon: <Heart className="h-10 w-10 text-support-500 mb-4" />,
            title: "Shared Experiences",
            description: "Connect with anonymous stories from others who've faced similar challenges."
          },
          {
            icon: <Shield className="h-10 w-10 text-support-500 mb-4" />,
            title: "Complete Privacy",
            description: "Share freely without revealing your identity. All conversations are private."
          }
        ].map((feature, index) => (
          <div 
            key={index} 
            className="bg-white rounded-xl p-6 shadow-sm border border-border reveal card-hover"
          >
            {feature.icon}
            <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hero;
