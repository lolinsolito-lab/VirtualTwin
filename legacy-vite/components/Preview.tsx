
import React, { useState } from 'react';
import { LandingPageData, LandingPageConfig } from '../types';
import { Icon } from './Icon';

interface PreviewProps {
  data: LandingPageData;
  config: LandingPageConfig;
}

const Preview: React.FC<PreviewProps> = ({ data, config }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const gold = config.brandColor || '#C5A059';

  return (
    <div className="bg-[#050505] text-white shadow-2xl overflow-hidden border border-white/10 w-full max-w-5xl mx-auto selection:bg-gold selection:text-black">
      {/* Navigation */}
      <nav className="px-10 py-8 flex justify-between items-center border-b border-white/5 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <span className="text-2xl font-luxury font-bold tracking-widest uppercase italic" style={{ color: gold }}>{config.businessName}</span>
        <button 
          className="px-8 py-2 rounded-full font-medium text-black transition-all hover:scale-105 active:scale-95 text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(197,160,89,0.3)]"
          style={{ backgroundColor: gold }}
        >
          {data.hero.cta}
        </button>
      </nav>

      {/* Hero Section */}
      <section className="px-10 py-32 lg:py-48 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent"></div>
        <div className="relative z-10 max-w-4xl mx-auto animate-luxury">
          <h1 className="text-5xl lg:text-8xl font-luxury font-bold leading-tight mb-8 tracking-tight">
            {data.hero.headline}
          </h1>
          <p className="text-xl lg:text-2xl text-slate-400 mb-12 leading-relaxed max-w-2xl mx-auto font-light tracking-wide italic">
            {data.hero.subheadline}
          </p>
          <div className="flex justify-center">
            <button 
              className="group relative px-12 py-5 overflow-hidden rounded-full font-bold text-black text-lg transition-all shadow-2xl"
              style={{ backgroundColor: gold }}
            >
              <span className="relative z-10 uppercase tracking-[0.2em]">{data.hero.cta}</span>
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </button>
          </div>
        </div>
        
        <div className="mt-24 px-6 max-w-6xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-gold to-transparent opacity-20 blur-2xl group-hover:opacity-40 transition-opacity"></div>
          <img 
            src={data.hero.imageUrl || `https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=1600`}
            alt="Virtual Twin Visual"
            className="rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full h-[500px] object-cover border border-white/10 relative"
          />
        </div>
      </section>

      {/* Problem Section (Challenges of Legacy) */}
      <section className="py-32 px-10 border-y border-white/5 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
             <h2 className="text-sm uppercase tracking-[0.4em] text-slate-500 mb-4">The Complexity of Influence</h2>
             <h3 className="text-4xl lg:text-5xl font-luxury font-bold text-white">{data.problem.sectionTitle}</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {data.problem.pains.map((pain, i) => (
              <div key={i} className="group p-10 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                <div className="text-3xl font-luxury mb-6 opacity-20 group-hover:opacity-100 transition-opacity" style={{ color: gold }}>0{i+1}</div>
                <h4 className="font-bold text-xl mb-4 tracking-tight">{pain.title}</h4>
                <p className="text-slate-500 leading-relaxed font-light">{pain.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section (The Architecture) */}
      <section className="py-32 px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-sm uppercase tracking-[0.4em] mb-4" style={{ color: gold }}>Unrivaled Capabilities</h2>
              <h3 className="text-4xl lg:text-6xl font-luxury font-bold leading-tight">{data.solution.sectionTitle}</h3>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {data.solution.features.map((feature, i) => (
              <div key={i} className="group relative">
                <div className="mb-8 overflow-hidden inline-block">
                  <Icon name={feature.icon} className="w-12 h-12 transition-transform duration-700 group-hover:scale-110" />
                </div>
                <h3 className="text-2xl font-luxury font-bold mb-4 tracking-tight border-b border-white/10 pb-4">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed font-light text-lg">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof (The Guild) */}
      <section className="py-32 bg-white text-black">
        <div className="max-w-7xl mx-auto px-10">
          <h2 className="text-sm uppercase tracking-[0.4em] text-center mb-20 text-slate-400">Exclusive Endorsements</h2>
          <div className="grid lg:grid-cols-3 gap-16">
            {data.socialProof.testimonials.map((t, i) => (
              <div key={i} className="flex flex-col">
                <div className="text-6xl font-luxury text-slate-100 mb-[-1.5rem] relative z-0">“</div>
                <p className="text-xl italic font-light leading-relaxed mb-10 relative z-10">
                  {t.quote}
                </p>
                <div className="mt-auto flex items-center gap-5">
                  <div className="w-14 h-14 rounded-full bg-slate-100 overflow-hidden grayscale hover:grayscale-0 transition-all">
                    <img src={t.avatar || `https://i.pravatar.cc/150?u=${t.name}`} alt={t.name} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-widest">{t.name}</h4>
                    <p className="text-xs text-slate-500 uppercase tracking-tighter">{t.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Section */}
      <section className="py-32 px-10 bg-[#080808]">
        <div className="max-w-2xl mx-auto text-center">
          <div className="p-16 rounded-[3rem] border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent"></div>
            <h3 className="text-sm uppercase tracking-[0.5em] text-slate-500 mb-8">{data.pricing.title}</h3>
            <p className="text-6xl font-luxury font-bold mb-4 tracking-tighter" style={{ color: gold }}>{data.pricing.price}</p>
            <p className="text-slate-500 mb-12 uppercase text-xs tracking-widest">Inaugural Membership Investment</p>
            <ul className="space-y-6 mb-12 text-left max-w-sm mx-auto">
              {data.pricing.features.map((f, i) => (
                <li key={i} className="flex items-center gap-4 text-slate-300 font-light border-b border-white/5 pb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold" style={{ backgroundColor: gold }}></div>
                  {f}
                </li>
              ))}
            </ul>
            <button 
              className="w-full py-5 rounded-full font-bold text-black uppercase tracking-[0.2em] transition-all hover:scale-[1.02] shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
              style={{ backgroundColor: gold }}
            >
              {data.pricing.cta}
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 px-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-luxury font-bold text-center mb-16">Inquiries</h2>
          <div className="space-y-4">
            {data.faqs.map((faq, i) => (
              <div key={i} className="border-b border-white/10 overflow-hidden">
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full py-8 flex justify-between items-center text-left hover:text-gold transition-colors"
                >
                  <span className="text-xl font-light tracking-tight">{faq.question}</span>
                  <span className="text-2xl font-light">{activeFaq === i ? '−' : '+'}</span>
                </button>
                <div className={`transition-all duration-500 ease-in-out ${activeFaq === i ? 'max-h-96 pb-8' : 'max-h-0'}`}>
                  <p className="text-slate-500 leading-relaxed font-light">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Final */}
      <section className="py-40 px-10 text-center relative overflow-hidden border-t border-white/5">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-5xl lg:text-7xl font-luxury font-bold mb-10 leading-tight">{data.footer.cta}</h2>
          <p className="text-xl text-slate-400 mb-16 font-light italic">{data.footer.subtext}</p>
          <button 
            className="px-16 py-6 rounded-full font-bold text-black uppercase tracking-[0.3em] transition-all hover:scale-110 shadow-2xl"
            style={{ backgroundColor: gold }}
          >
            Request Access
          </button>
        </div>
      </section>

      <footer className="py-20 border-t border-white/5 text-center text-slate-600 text-[10px] uppercase tracking-[0.6em]">
        <p className="mb-4">&copy; {new Date().getFullYear()} {config.businessName} International</p>
        <p>Curated by LandingGenius Elite Architect</p>
      </footer>
    </div>
  );
};

export default Preview;
