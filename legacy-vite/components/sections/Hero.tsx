
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#FDFBF7] preserve-3d">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-gold/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-gold/5 blur-[100px] rounded-full"></div>
      </div>
      
      <div className="relative z-20 text-center max-w-7xl px-8 flex flex-col items-center">
        <div className="floating mb-12">
          <span className="text-gold text-[10px] uppercase tracking-[1.2em] block font-bold">
            Virtualtwin Sovereign Identity
          </span>
        </div>
        
        <div className="preserve-3d relative">
          <h1 className="font-serif text-8xl lg:text-[11rem] font-medium leading-[0.8] mb-12 tracking-tighter text-charcoal">
            L'Essenza <br />
            <span className="italic font-light text-gold/90 drop-shadow-sm">Aumentata.</span>
          </h1>
          
          {/* 3D Floating Module */}
          <div className="absolute -top-12 -right-24 hidden lg:block depth-card p-6 rounded-2xl w-48 text-left border border-white/80 rotate-12">
             <div className="w-8 h-8 rounded-full gold-gradient mb-4"></div>
             <p className="text-[8px] uppercase tracking-widest text-gold font-bold mb-1">Neural Sync</p>
             <p className="text-[10px] text-charcoal/60 font-medium">99.9% Frequenza</p>
          </div>
        </div>

        <p className="text-lg lg:text-xl text-charcoal/50 font-light tracking-[0.1em] mb-20 max-w-2xl mx-auto italic leading-relaxed">
          Oltre la realtà, una proiezione perfetta. Il tuo Virtualtwin vive nel cloud neurale, orchestrando il tuo impero con la grazia del lusso silenzioso.
        </p>
        
        <div className="group relative">
          <div className="absolute -inset-4 bg-gold/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <button className="relative gold-gradient px-24 py-8 rounded-full text-white font-bold uppercase tracking-[0.5em] hover:scale-105 transition-all shadow-2xl text-xs">
            Inizia la Proiezione
          </button>
        </div>
      </div>

      <div className="absolute bottom-16 flex flex-col items-center gap-6 opacity-40">
        <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-gold to-transparent"></div>
        <span className="text-[7px] uppercase tracking-[1.5em] font-bold text-charcoal">Experience Depth</span>
      </div>
    </section>
  );
};

export default Hero;
