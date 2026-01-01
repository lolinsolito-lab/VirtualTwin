
import React from 'react';

const Performance: React.FC = () => {
  return (
    <section id="performance" className="py-60 bg-[#F9F6F0] relative overflow-hidden preserve-3d">
      <div className="max-w-7xl mx-auto px-10">
        <div className="text-center mb-40">
          <span className="text-gold text-[11px] uppercase tracking-[1em] mb-6 block font-black">Architettura Finanziaria</span>
          <h3 className="font-serif text-7xl lg:text-[10rem] font-medium text-charcoal italic leading-none">Valore Liquido.</h3>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-32 items-stretch">
          <div className="depth-card p-16 rounded-[4rem] flex flex-col justify-center border border-white/60">
            <h4 className="text-3xl font-serif mb-12 italic border-b border-black/5 pb-6">Proiezione Sovrana</h4>
            <div className="space-y-10">
              <div className="flex justify-between items-end border-b border-black/5 pb-8 group transition-all">
                <span className="text-charcoal/40 text-[10px] uppercase tracking-[0.4em] font-bold">Punto di Svolta (M5)</span>
                <span className="text-4xl font-serif text-gold group-hover:scale-110 transition-transform">20 Elite</span>
              </div>
              <div className="flex justify-between items-end border-b border-black/5 pb-8 group transition-all">
                <span className="text-charcoal/40 text-[10px] uppercase tracking-[0.4em] font-bold">Target M12</span>
                <span className="text-4xl font-serif text-charcoal group-hover:scale-110 transition-transform">€14.550</span>
              </div>
              <div className="flex justify-between items-end pt-6">
                <span className="text-gold text-[12px] uppercase tracking-[0.3em] font-black">Profitto Netto Anno 1</span>
                <span className="text-7xl font-serif text-charcoal drop-shadow-xl">€22.293</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-10">
            {[
              { label: "Elite Access", val: "150", sub: "Licenze Annuali" },
              { label: "Maintenance", val: "€56", sub: "Cloud Fee" },
              { label: "Scalabilità", val: "∞", sub: "Senza Attrito" },
              { label: "Rendimento", val: "94%", sub: "Efficiency" }
            ].map((stat, i) => (
              <div key={i} className="depth-card p-10 rounded-[3rem] group">
                <p className="text-[10px] uppercase tracking-[0.5em] text-gold mb-8 font-black">{stat.label}</p>
                <p className="text-6xl font-serif text-charcoal mb-4 group-hover:text-gold transition-colors">{stat.val}</p>
                <p className="text-[10px] text-charcoal/40 uppercase tracking-[0.2em] font-semibold">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Performance;
