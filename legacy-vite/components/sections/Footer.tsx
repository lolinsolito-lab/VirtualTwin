
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-24 px-10 bg-white border-t border-black/5 flex flex-col lg:flex-row justify-between items-center text-charcoal/30 text-[10px] uppercase tracking-[1em] font-medium">
      <div className="mb-10 lg:mb-0">
        &copy; 2024 VIRTUALTWIN SOVEREIGN | THE GOLD STANDARD
      </div>
      <div className="flex gap-16">
        <a href="#" className="hover:text-gold transition-colors">Milan</a>
        <a href="#" className="hover:text-gold transition-colors">London</a>
        <a href="#" className="hover:text-gold transition-colors">Geneva</a>
        <a href="#" className="hover:text-gold transition-colors">Dubai</a>
      </div>
    </footer>
  );
};

export default Footer;
