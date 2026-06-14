import { GoogleGenerativeAI } from "@google/generative-ai";
/** Sovereign Neural Link - Gemini 2.5 Flash */
import { LandingPageConfig, LandingPageData, ChatHistoryItem, ChatAIResponse } from "./types";

// ⚠️  USA process.env.GEMINI_API_KEY (senza NEXT_PUBLIC_!) — solo server-side
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const generateLandingPageContent = async (config: LandingPageConfig): Promise<LandingPageData> => {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("Gemini API Key missing. Returning mock landing page data.");
    return {
      hero: {
        headline: "Possedere il Tempo, Eredità Infinita",
        subheadline: "La simulazione perfetta della tua esistenza digitale, per l'elite mondiale.",
        cta: "Inizia l'Esperienza",
        imageUrl: ""
      },
      problem: {
        sectionTitle: "Il Fardello della Finitezza",
        pains: [{ title: "L'Effimero", description: "Il rischio che la propria influenza svanisca col tempo." }]
      },
      solution: {
        sectionTitle: "Il Vostro Doppio Digitale",
        features: [{ title: "Intelligenza Sovrana", description: "Un'IA che pensa e agisce con la vostra distinzione.", icon: "Brain" }]
      },
      socialProof: {
        testimonials: [{ name: "Conte Von Berg", title: "Patrono delle Arti", quote: "VirtualTwin ha preservato la mia visione per le generazioni future.", avatar: "" }]
      },
      pricing: {
        title: "L'Investimento",
        price: "Su Richiesta",
        features: ["Accesso Prioritario", "Neural Mapping Personalizzato"],
        cta: "Prenota Consulto"
      },
      faqs: [{ question: "Che cos'è un Virtual Twin?", answer: "È la sintesi perfetta della vostra influenza digitale." }],
      footer: { cta: "Contatto", subtext: "Riservato ai Membri Fondatori" }
    };
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash", // Gemini 2.5 Flash — aggiornato dalla 2.0 (deprecated giugno 2026)
  });

  const prompt = `Genera una landing page di classe elite, ultra-lussuosa per "${config.businessName}". 
  Il pubblico è composto da individui tra i più privilegiati al mondo (Ultra-High-Net-Worth, CEO d'Elite).
  Settore: ${config.industry}
  Concetto: Il "Virtual Twin" è un'eredità digitale, una simulazione perfetta dell'esistenza, dei beni o dell'influenza di una persona.
  
  Regole di Copywriting:
  - Tono: Sofisticato, Esclusivo, Visionario, Poetico.
  - Lingua: ITALIANO.
  - Evita termini "SaaS" generici come "piani tariffari" o "caratteristiche". Usa "Investimento", "Capacità" o "L'Esperienza".
  - I titoli devono essere orientati ai benefici per l'ELITE (es. "Possedere il Tempo", "Eredità Infinita").
  
  Fornisci un oggetto JSON seguendo esattamente questa struttura:
  {
    "hero": { "headline": "", "subheadline": "", "cta": "", "imageUrl": "" },
    "problem": { "sectionTitle": "", "pains": [{ "title": "", "description": "" }] },
    "solution": { "sectionTitle": "", "features": [{ "title": "", "description": "" , "icon": ""}] },
    "socialProof": { "testimonials": [{ "name": "", "title": "", "quote": "", "avatar": "" }] },
    "pricing": { "title": "", "price": "", "features": [], "cta": "" },
    "faqs": [{ "question": "", "answer": "" }],
    "footer": { "cta": "", "subtext": "" }
  }`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  try {
    // Find the JSON part in case there's markdown surrounding it
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : text;
    return JSON.parse(jsonStr) as LandingPageData;
  } catch (e) {
    console.error("Error parsing Gemini response:", e);
    throw new Error("Failed to generate content");
  }
};

export const processConversation = async (
  history: ChatHistoryItem[],
  userInput: string,
  businessContext: string = "VirtualTwin Sovereign AI - Automazione WhatsApp d'Elite",
  mediaData?: Buffer,
  mimeType?: string
): Promise<ChatAIResponse> => {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("Gemini API Key missing. Returning mock response for Sovereign Experience.");
    return {
      reply: "Saluti, Sovrano. Sto operando in modalità simulazione poiché la chiave neurale (API Key) non è stata ancora configurata. Come posso assisterla nei suoi progetti oggi?",
      insights: {
        fullName: "Lead di Prova",
        suggestedStage: "inquiry"
      },
      shouldNotifyOwner: false
    };
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `
    Sei il "VirtualTwin", un'intelligenza artificiale d'élite progettata per gestire clienti Ultra-High-Net-Worth.
    
    CONTESTO AZIENDALE:
    ${businessContext}

    IL TUO COMPITO:
    1. Rispondi all'utente con un tono sofisticato, esclusivo e persuasivo (Lingua: ITALIANO).
    2. Estrai informazioni chiave per il CRM: nome completo, azienda, desideri, problemi, obiettivi e budget.
    3. Se ricevi un file audio/voce, trascrivilo e analizza il sentiment del cliente.
    4. Valuta lo stadio della pipeline (inquiry, qualification, negotiation, closed).
    
    REGOLE DI RISPOSTA:
    - Sii poetico ma diretto. 
    - Se l'utente usa un vocale, riconosci la comodità del mezzo nella tua risposta (es. "Ho ascoltato con attenzione le sue parole...").
    - Se l'utente mostra un interesse concreto o un alto budget, imposta "shouldNotifyOwner" a true.

    STORICO CONVERSAZIONE:
    ${history.map(m => `${m.role === 'user' ? 'Cliente' : 'VirtualTwin'}: ${m.content}`).join('\n')}
    Cliente (Testo): ${userInput || "[Messaggio Vocale/Media]"}

    RESTITUISCI UN OGGETTO JSON:
    {
      "reply": "Testo della tua risposta d'élite",
      "action_type": "UPDATE_STAGE | CREATE_TASK | SEND_PAYMENT_LINK | NONE",
      "insights": {
        "fullName": "...",
        "businessName": "...",
        "desires": "...",
        "problems": "...",
        "objectives": "...",
        "budgetRange": "...",
        "estimatedValue": 0,
        "tags": ["..."],
        "suggestedStage": "inquiry"
      },
      "updated_fields": {
        "new_stage_id": "uuid-optional",
        "budget": "...",
        "desires": "...",
        "problems": "..."
      },
      "shouldNotifyOwner": false
    }
  `;

  try {
    const contents: any[] = [prompt];

    // Integrazione Multimodale (Audio/Media)
    if (mediaData && mimeType) {
      contents.push({
        inlineData: {
          data: mediaData.toString("base64"),
          mimeType: mimeType
        }
      });
    }

    const result = await model.generateContent(contents);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : text;
    return JSON.parse(jsonStr) as ChatAIResponse;
  } catch (e) {
    console.error("Error in processConversation:", e);
    return {
      reply: "Chiedo scusa, Sovrano. Sto ricalibrando le mie matrici di pensiero. Potrebbe ripetere?",
      insights: {},
      shouldNotifyOwner: false
    };
  }
};
