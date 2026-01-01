"use client";

// Signup page now redirects to the new Register page for consistency
import { redirect } from 'next/navigation';

export default function SignupPage() {
    redirect('/auth/register');
}
