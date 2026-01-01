
import { GoogleGenAI, Type } from "@google/genai";
import { LandingPageConfig, LandingPageData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateLandingPageContent = async (config: LandingPageConfig): Promise<LandingPageData> => {
  const prompt = `Generate an ultra-luxurious, elite-class landing page for "${config.businessName}". 
  The audience is the world's most privileged individuals (Ultra-High-Net-Worth, Elite CEOs).
  Industry: ${config.industry}
  Concept: The "Virtual Twin" is a digital legacy, a perfect simulation of one's existence, assets, or influence.
  
  Copywriting Rules:
  - Tone: Sophisticated, Exclusive, Visionary, Poetic.
  - Avoid generic "SaaS" terms like "pricing plans" or "features." Use "Investment," "Capabilities," or "The Experience."
  - Headlines must be benefit-driven for the ELITE (e.g., "Owning Time," "Infinite Legacy").
  
  Please provide a JSON object following the schema structure.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          hero: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING },
              subheadline: { type: Type.STRING },
              cta: { type: Type.STRING },
              imageUrl: { type: Type.STRING }
            },
            required: ["headline", "subheadline", "cta", "imageUrl"]
          },
          problem: {
            type: Type.OBJECT,
            properties: {
              sectionTitle: { type: Type.STRING },
              pains: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING }
                  }
                }
              }
            }
          },
          solution: {
            type: Type.OBJECT,
            properties: {
              sectionTitle: { type: Type.STRING },
              features: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    icon: { type: Type.STRING }
                  }
                }
              }
            }
          },
          socialProof: {
            type: Type.OBJECT,
            properties: {
              testimonials: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    title: { type: Type.STRING },
                    quote: { type: Type.STRING },
                    avatar: { type: Type.STRING }
                  }
                }
              }
            }
          },
          pricing: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              price: { type: Type.STRING },
              features: { type: Type.ARRAY, items: { type: Type.STRING } },
              cta: { type: Type.STRING }
            }
          },
          faqs: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                answer: { type: Type.STRING }
              }
            }
          },
          footer: {
            type: Type.OBJECT,
            properties: {
              cta: { type: Type.STRING },
              subtext: { type: Type.STRING }
            }
          }
        },
        required: ["hero", "problem", "solution", "socialProof", "pricing", "faqs", "footer"]
      }
    }
  });

  return JSON.parse(response.text || '{}') as LandingPageData;
};
