import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
    console.warn('RESEND_API_KEY is not defined in environment variables.');
}

export const resend = new Resend(resendApiKey);

export const SYSTEM_EMAIL = 'onboarding@resend.dev'; // Default for testing, update with your domain once verified
export const FOUNDER_EMAIL = 'lordinsolito@gmail.com'; // Your personal address for notifications
