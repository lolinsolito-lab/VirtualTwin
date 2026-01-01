
import React from 'react';

const Inquiry: React.FC = () => {
  return (
    <section className="py-60 bg-white relative overflow-hidden preserve-3d">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(212,175,55,0.08)_0%,_transparent_70%)]"></div>
      <div className="max-w-5xl mx-auto px-8 text-center relative z-10">
        <h2 className="font-serif text-7xl lg:text-[11rem] mb-24 italic text-charcoal leading-[0.8] tracking-tighter">Esclusività <br /> Codificata.</h2>
        
        <div className="depth-card p-20 lg:p-32 rounded-[5rem] border border-white/80 shadow-[0_100px_150px_-50px_rgba(0,0,0,0.1)] relative">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 gold-gradient rounded-full flex items-center justify-center shadow-2xl floating">
             <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
             </svg>
          </div>
          
          <p className="text-charcoal/30 mb-24 uppercase text-[12px] tracking-[1.2em] font-black">Accesso Riservato</p>
          
          <form className="space-y-20 max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
            <div className="relative group">
              <input 
                type="text" 
                placeholder="IDENTITÀ O ISTITUZIONE" 
                className="w-full bg-transparent border-b border-black/5 py-8 outline-none focus:border-gold transition-colors text-center font-serif text-3xl italic text-charcoal placeholder:text-charcoal/10"
              />
              <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold group-focus-within:w-full transition-all duration-700"></div>
            </div>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="EMAIL DIREZIONALE" 
                className="w-full bg-transparent border-b border-black/5 py-8 outline-none focus:border-gold transition-colors text-center font-serif text-3xl italic text-charcoal placeholder:text-charcoal/10"
              />
              <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold group-focus-within:w-full transition-all duration-700"></div>
            </div>
            
            <div className="pt-12">
              <button className="w-full py-10 gold-gradient text-white font-bold uppercase tracking-[0.8em] rounded-full hover:scale-105 transition-all shadow-2xl text-[10px] font-black">
                Sottoponi al Consiglio
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Inquiry;
