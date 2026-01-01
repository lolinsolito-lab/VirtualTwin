
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed w-full z-[100] px-8 lg:px-16 py-8 flex justify-between items-center bg-white/40 backdrop-blur-xl border-b border-black/5">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 gold-gradient rounded-full flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg">V</div>
        <div className="flex flex-col">
          <span className="font-serif text-2xl tracking-[0.2em] uppercase font-medium text-charcoal leading-none">Virtualtwin</span>
          <span className="text-[7px] uppercase tracking-[0.5em] text-gold/80 mt-1 font-bold">The Sovereign Essence</span>
        </div>
      </div>
      <div className="hidden lg:flex gap-16 text-[10px] uppercase tracking-[0.4em] font-semibold text-charcoal/60">
        <a href="#logic" className="hover:text-gold transition-colors duration-500">Filosofia</a>
        <a href="#performance" className="hover:text-gold transition-colors duration-500">Asset</a>
        <a href="#stack" className="hover:text-gold transition-colors duration-500">Genesi</a>
      </div>
      <button className="px-10 py-3 rounded-full bg-charcoal text-white text-[10px] uppercase tracking-[0.4em] hover:bg-gold transition-all duration-700 shadow-xl shadow-black/5">
        Contatto Privato
      </button>
    </nav>
  );
};

export default Navbar;
