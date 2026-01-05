import { UserProfile } from './types';

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string; // Icon name from lucide or a custom SVG path/URL
    category: 'academy' | 'engagement' | 'growth';
    color: string;
}

export const ALL_BADGES: Record<string, Badge> = {
    'pioniere_fondatore': {
        id: 'pioniere_fondatore',
        name: 'Pioniere Fondatore',
        description: 'Uno dei primi 1000 datori di lavoro digitali dell\'impero.',
        icon: 'Crown',
        category: 'growth',
        color: 'from-amber-400 to-amber-600'
    },
    'apprendista_sovrano': {
        id: 'apprendista_sovrano',
        name: 'Apprendista Sovrano',
        description: 'Ha superato il primo quiz dell\'Academy con il 100% dei voti.',
        icon: 'GraduationCap',
        category: 'academy',
        color: 'from-blue-400 to-blue-600'
    },
    'architetto_ai': {
        id: 'architetto_ai',
        name: 'Architetto AI',
        description: 'Ha addestrato con successo il suo primo clone AI.',
        icon: 'Cpu',
        category: 'growth',
        color: 'from-purple-400 to-purple-600'
    },
    'sovereign_streak': {
        id: 'sovereign_streak',
        name: 'Sovereign Streak',
        description: 'Attività costante per 3 giorni consecutivi.',
        icon: 'Flame',
        category: 'engagement',
        color: 'from-orange-400 to-orange-600'
    },
    'maestro_outreach': {
        id: 'maestro_outreach',
        name: 'Maestro Outreach',
        description: 'Ha sbloccato tutti i template di vendita d\'élite.',
        icon: 'Send',
        category: 'academy',
        color: 'from-emerald-400 to-emerald-600'
    }
};

/**
 * Calculates which badges a user SHOULD have based on their profile data
 */
export function calculateEligibleBadges(user: UserProfile): string[] {
    const earned: string[] = [];

    // 1. Founder Badge
    if (user.is_founder) {
        earned.push('pioniere_fondatore');
    }

    // 2. Apprentice Badge (First quiz passed)
    if (user.quizzes_passed && Object.keys(user.quizzes_passed).length > 0) {
        earned.push('apprendista_sovrano');
    }

    // 3. AI Architect (Sample logic: depends on having FAQs - we'd need to check the clones table or a flag)
    // For now, let's assume onboarding_completed is a signal
    if (user.onboarding_completed) {
        earned.push('architetto_ai');
    }

    // 4. Streak logic (if streak_days >= 3)
    if (user.streak_days >= 3) {
        earned.push('sovereign_streak');
    }

    return earned;
}

/**
 * Checks if a new badge was earned
 */
export function detectNewBadges(oldBadges: string[] = [], newBadges: string[] = []): string[] {
    return newBadges.filter(b => !oldBadges.includes(b));
}
