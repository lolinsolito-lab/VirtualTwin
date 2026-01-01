import { Resend } from 'resend';
import { isBuildTime } from './env';

// Get API key from server environment
const resendApiKey = process.env.RESEND_API_KEY || (isBuildTime() ? 're_placeholder_for_build' : '');

if (!resendApiKey && !isBuildTime()) {
    console.warn('⚠️ RESEND_API_KEY is not defined in environment variables. Email services will fail.');
}

// Initialize Resend with build-time safety
// If we're building, we use a placeholder to prevent constructor errors
export const resend = new Resend(resendApiKey || 're_placeholder');

export const SYSTEM_EMAIL = 'onboarding@resend.dev'; // Default for testing, update with your domain once verified
export const FOUNDER_EMAIL = 'lordinsolito@gmail.com'; // Your personal address for notifications
