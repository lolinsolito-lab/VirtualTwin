
import React from 'react';
import { LandingPageConfig, Tone, StylePreference } from '../types';

interface FormProps {
  config: LandingPageConfig;
  onChange: (config: LandingPageConfig) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const Form: React.FC<FormProps> = ({ config, onChange, onSubmit, isLoading }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({ ...config, [name]: value });
  };

  return (
    <div className="bg-[#111] p-10 rounded-[2.5rem] shadow-2xl border border-white/5 h-full overflow-y-auto">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gold border border-white/10">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
        </div>
        <h2 className="text-xl font-luxury font-bold tracking-widest text-white uppercase">Blueprint</h2>
      </div>

      <div className="space-y-8">
        <div className="group">
          <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-[0.3em] group-focus-within:text-gold transition-colors">House Name</label>
          <input 
            type="text" 
            name="businessName"
            value={config.businessName}
            onChange={handleChange}
            className="w-full bg-white/[0.03] px-6 py-4 rounded-xl border border-white/5 focus:border-gold/50 focus:ring-0 outline-none transition-all text-white font-light placeholder:text-slate-700"
            placeholder="e.g. Virtualtwin"
          />
        </div>

        <div className="group">
          <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-[0.3em] group-focus-within:text-gold transition-colors">Sphere of Influence</label>
          <input 
            type="text" 
            name="industry"
            value={config.industry}
            onChange={handleChange}
            className="w-full bg-white/[0.03] px-6 py-4 rounded-xl border border-white/5 focus:border-gold/50 focus:ring-0 outline-none transition-all text-white font-light"
            placeholder="e.g. Elite Digital Twins"
          />
        </div>

        <div className="group">
          <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-[0.3em] group-focus-within:text-gold transition-colors">The Audience</label>
          <input 
            type="text" 
            name="targetAudience"
            value={config.targetAudience}
            onChange={handleChange}
            className="w-full bg-white/[0.03] px-6 py-4 rounded-xl border border-white/5 focus:border-gold/50 focus:ring-0 outline-none transition-all text-white font-light"
            placeholder="e.g. Global Visionaries"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="group">
            <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-[0.3em]">Ambience</label>
            <select 
              name="tone"
              value={config.tone}
              onChange={handleChange}
              className="w-full bg-white/[0.03] px-4 py-4 rounded-xl border border-white/5 focus:border-gold/50 text-white outline-none appearance-none"
            >
              {Object.values(Tone).map(t => <option key={t} value={t} className="bg-[#111]">{t}</option>)}
            </select>
          </div>
          <div className="group">
            <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-[0.3em]">Architectural Style</label>
            <select 
              name="style"
              value={config.style}
              onChange={handleChange}
              className="w-full bg-white/[0.03] px-4 py-4 rounded-xl border border-white/5 focus:border-gold/50 text-white outline-none appearance-none"
            >
              {Object.values(StylePreference).map(s => <option key={s} value={s} className="bg-[#111]">{s}</option>)}
            </select>
          </div>
        </div>

        <div className="group">
          <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-[0.3em]">Brand Signature (Color)</label>
          <div className="flex gap-4 items-center">
            <input 
              type="color" 
              name="brandColor"
              value={config.brandColor}
              onChange={handleChange}
              className="w-14 h-14 rounded-full cursor-pointer bg-transparent border-none"
            />
            <input 
              type="text" 
              name="brandColor"
              value={config.brandColor}
              onChange={handleChange}
              className="flex-1 bg-white/[0.03] px-6 py-4 rounded-xl border border-white/5 text-white font-mono uppercase focus:border-gold/50 outline-none"
            />
          </div>
        </div>

        <button 
          onClick={onSubmit}
          disabled={isLoading}
          className={`w-full py-5 rounded-full font-bold text-black shadow-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] mt-10 uppercase tracking-[0.3em] ${isLoading ? 'bg-slate-400 cursor-not-allowed opacity-50' : 'bg-gold hover:brightness-110 shadow-gold/20'}`}
          style={{ backgroundColor: !isLoading ? config.brandColor : undefined }}
        >
          {isLoading ? 'Architecting...' : 'Reveal Masterpiece'}
        </button>
      </div>
    </div>
  );
};

export default Form;
