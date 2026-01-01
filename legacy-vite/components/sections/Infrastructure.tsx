
import React from 'react';

const Infrastructure: React.FC = () => {
  return (
    <section id="stack" className="py-60 px-10 bg-white border-y border-black/5 preserve-3d">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-40">
          <span className="text-gold text-[10px] uppercase tracking-[1em] mb-6 block font-black">Il Motore dell'Immortalità</span>
          <h3 className="font-serif text-7xl lg:text-9xl text-charcoal italic leading-none">Genesi Digitale.</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {[
            { 
              cat: "Framework", 
              tech: "Next.js 14", 
              desc: "Reattività istantanea, architettura SSR di grado militare." 
            },
            { 
              cat: "Infrastruttura", 
              tech: "Supabase", 
              desc: "Il caveau digitale più sicuro al mondo per i tuoi dati." 
            },
            { 
              cat: "Nucleo Neurale", 
              tech: "Gemini 3 Pro", 
              desc: "L'apice dell'intelligenza artificiale conversazionale." 
            },
            { 
              cat: "Protocollo", 
              tech: "Official WABA", 
              desc: "Comunicazione sovrana attraverso il canale WhatsApp ufficiale." 
            }
          ].map((item, i) => (
            <div key={i} className="group preserve-3d">
              <div className="depth-card aspect-square rounded-[3rem] mb-12 flex items-center justify-center border border-white group-hover:gold-gradient group-hover:rotate-6 transition-all duration-700">
                <span className="font-serif text-5xl text-gold group-hover:text-white transition-colors">0{i+1}</span>
              </div>
              <div className="px-4">
                <span className="text-[10px] uppercase tracking-[0.5em] text-gold mb-4 block font-black">{item.cat}</span>
                <h4 className="text-3xl font-serif mb-6 text-charcoal italic">{item.tech}</h4>
                <p className="text-charcoal/40 text-sm leading-relaxed font-light italic">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Infrastructure;
