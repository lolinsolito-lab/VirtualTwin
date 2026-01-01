
export enum Tone {
  Professional = 'Professional',
  Friendly = 'Friendly',
  Bold = 'Bold'
}

export enum StylePreference {
  Minimal = 'Minimal',
  Modern = 'Modern',
  Bold = 'Bold',
  Corporate = 'Corporate'
}

export interface LandingPageConfig {
  businessName: string;
  industry: string;
  targetAudience: string;
  goal: string;
  tone: Tone;
  style: StylePreference;
  brandColor: string;
}

export interface LandingPageData {
  hero: {
    headline: string;
    subheadline: string;
    cta: string;
    imageUrl: string;
  };
  problem: {
    sectionTitle: string;
    pains: { title: string; description: string }[];
  };
  solution: {
    sectionTitle: string;
    pains?: { title: string; description: string }[]; // Added optional for legacy compatibility
    features: { title: string; description: string; icon: string }[];
  };
  socialProof: {
    testimonials: { name: string; title: string; quote: string; avatar: string }[];
  };
  pricing: {
    title: string;
    price: string;
    features: string[];
    cta: string;
  };
  faqs: { question: string; answer: string }[];
  footer: {
    cta: string;
    subtext: string;
  };
}

// --- NEW ELITE CHAT TYPES ---

export interface LeadInsight {
  fullName: string;
  businessName: string;
  desires: string;
  problems: string;
  objectives: string;
  budgetRange: string;
  estimatedValue: number;
  tags: string[];
  suggestedStage: 'inquiry' | 'qualification' | 'negotiation' | 'closed';
}

export interface ChatAIResponse {
  reply: string; // La risposta da inviare all'utente (Linguaggio d'Elite)
  insights: Partial<LeadInsight>; // Dati estratti dalla conversazione
  shouldNotifyOwner: boolean; // Se l'IA rileva un lead caldissimo
}

export interface ChatHistoryItem {
  role: 'user' | 'assistant';
  content: string;
}
