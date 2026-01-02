// Site configuration - Edit these values to customize your landing page
// This file is the single source of truth for all configurable content

export const siteConfig = {
    // Brand
    name: "VirtualTwin",
    tagline: "Il Tuo Clone AI che Vende 24/7",

    // Demo Video - CHANGE THIS URL to your YouTube or Vimeo video
    // YouTube: Use format "https://www.youtube.com/embed/VIDEO_ID"
    // Vimeo: Use format "https://player.vimeo.com/video/VIDEO_ID"
    demoVideoUrl: "https://player.vimeo.com/video/524933864", // VirtualTwin Demo Video
    demoVideoType: "vimeo" as "youtube" | "vimeo", // "youtube" or "vimeo"

    // Contact
    email: "support@virtualtwin.ai",
    enterpriseEmail: "enterprise@virtualtwin.ai",
    phone: "+39 02 1234 5678",

    // Social Links
    social: {
        instagram: "https://instagram.com/virtualtwin",
        linkedin: "https://linkedin.com/company/virtualtwin",
        twitter: "https://twitter.com/virtualtwin",
    },

    // Trial Duration (in days) - Founder Bonus
    trialDays: 14,

    // Pricing (in EUR)
    pricing: {
        starter: 97,
        pro: 197,
        agency: 397,
    },

    // Trust Stats
    stats: {
        users: "500+",
        messages: "2M+",
        satisfaction: "98.5%",
        conversionGrowth: "340%",
    }
};
