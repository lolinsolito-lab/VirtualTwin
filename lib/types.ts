
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
    pains?: { title: string; description: string }[];
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
  reply: string;
  insights: Partial<LeadInsight>;
  shouldNotifyOwner: boolean;
  action_type?: 'UPDATE_STAGE' | 'CREATE_TASK' | 'SEND_PAYMENT_LINK' | 'NONE';
  updated_fields?: Record<string, any>;
}

export interface ChatHistoryItem {
  role: 'user' | 'assistant';
  content: string;
}

// --- SOVEREIGN PROFILES ---

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  company_name?: string;
  avatar_url?: string;
  plan_tier: 'curioso' | 'solopreneur' | 'entrepreneur' | 'conquistatore' | 'imperatore' | 'sovereignty';
  subscription_status: 'trialing' | 'active' | 'canceled' | 'past_due';
  messages_used_this_month: number;
  messages_limit: number;
  is_founder: boolean;
  onboarding_completed: boolean;
  xp: number;
  level: number;
  completed_video_ids: string[];
  badges: any[];
  role: 'user' | 'admin' | 'moderator';
  wave_id?: 'genesis' | 'pioneer' | 'elite';
  business_iban?: string;
  business_vat?: string;
  legal_address?: string;
  streak_days: number;
  last_activity_at: string;
  quizzes_passed: any;
  created_at: string;
}
