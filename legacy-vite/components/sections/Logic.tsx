
import React from 'react';

const Logic: React.FC = () => {
  return (
    <section id="logic" className="py-60 px-10 lg:px-32 bg-white relative overflow-hidden preserve-3d">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-40 items-center">
        <div className="space-y-16">
          <div className="relative">
            <span className="text-gold text-[10px] uppercase tracking-[0.8em] mb-8 block font-black">Genesi Conversazionale</span>
            <h2 className="font-serif text-7xl lg:text-9xl leading-[0.85] font-medium text-charcoal">
              Pensiero <br /> <span className="italic text-gold drop-shadow-sm">Virtuale.</span>
            </h2>
          </div>
          <p className="text-charcoal/60 text-xl leading-relaxed font-light max-w-xl">
            Non è un bot. È un'estensione del tuo intelletto. Il nucleo <span className="text-charcoal font-semibold">Gemini 2.5</span> assimila la tua dialettica per creare dialoghi che sono, tecnicamente, indistinguibili dalla tua presenza fisica.
          </p>
          <div className="flex gap-12 pt-12">
            <div className="depth-card px-10 py-8 rounded-3xl border border-gold/10">
              <span className="text-[8px] uppercase tracking-widest text-gold font-bold">Latenza</span>
              <p className="text-2xl font-serif text-charcoal italic">Sotto i 2s</p>
            </div>
            <div className="depth-card px-10 py-8 rounded-3xl border border-gold/10">
              <span className="text-[8px] uppercase tracking-widest text-gold font-bold">Precisione</span>
              <p className="text-2xl font-serif text-charcoal italic">Identità 1:1</p>
            </div>
          </div>
        </div>
        
        {/* 3D Glass Chat Module */}
        <div className="relative preserve-3d h-[600px] flex items-center justify-center">
          <div className="absolute w-[120%] h-[120%] bg-gold/5 rounded-full blur-[150px] -z-10"></div>
          
          <div className="depth-card w-full max-w-md rounded-[3rem] p-12 relative border border-white/40 shadow-2xl">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gold/5 blur-3xl"></div>
            
            <div className="flex items-center gap-6 mb-16 border-b border-black/5 pb-10">
              <div className="relative">
                <div className="w-16 h-16 gold-gradient rounded-full shadow-lg flex items-center justify-center text-white text-xl font-serif">VT</div>
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-4 border-white rounded-full"></div>
              </div>
              <div>
                <p className="text-lg font-serif italic text-charcoal">Virtual Identity</p>
                <p className="text-[9px] uppercase tracking-widest text-gold font-bold">Neural Engine Active</p>
              </div>
            </div>

            <div className="space-y-12">
              <div className="depth-card p-6 rounded-3xl rounded-tl-none bg-champagne/40 border border-black/5 transform -rotate-1">
                <p className="text-sm italic text-charcoal/80">"È possibile integrare il mio patrimonio digitale?"</p>
              </div>
              <div className="depth-card p-6 rounded-3xl rounded-tr-none bg-white border border-gold/20 ml-8 transform rotate-1">
                <p className="text-xs text-gold font-black uppercase tracking-widest mb-3">Twin Response</p>
                <p className="text-sm leading-relaxed text-charcoal">"Assolutamente. La nostra architettura multi-tenant garantisce che ogni asset sia isolato e protetto, proprio come nel suo caveau fisico."</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Logic;
