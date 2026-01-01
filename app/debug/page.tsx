'use client';

import { useEffect, useState } from 'react';

/**
 * Debug Page - TEMPORARY
 * Delete this file after verifying environment variables
 * URL: /debug
 */
export default function DebugPage() {
    const [envStatus, setEnvStatus] = useState<Record<string, string>>({});
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setEnvStatus({
            SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ SET' : '❌ MISSING',
            SUPABASE_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ SET' : '❌ MISSING',
            GEMINI_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY ? '✅ SET' : '❌ MISSING',
            NODE_ENV: process.env.NODE_ENV || 'unknown',
            VERCEL: process.env.VERCEL ? 'Yes' : 'No',
            VERCEL_ENV: process.env.VERCEL_ENV || 'local',
        });
    }, []);

    if (!mounted) {
        return <div className="p-8 font-mono">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8 font-mono">
            <h1 className="text-3xl font-bold mb-6 text-gold-400">
                🔧 VirtualTwin Environment Debug
            </h1>

            <div className="bg-gray-800 rounded-lg p-6 mb-6">
                <h2 className="text-xl mb-4 text-yellow-400">Environment Variables</h2>
                <pre className="text-sm">
                    {JSON.stringify(envStatus, null, 2)}
                </pre>
            </div>

            <div className="bg-red-900/50 border border-red-500 rounded-lg p-4">
                <p className="text-red-300">
                    ⚠️ <strong>DELETE THIS PAGE</strong> after verifying!
                </p>
                <p className="text-sm text-red-400 mt-2">
                    File: <code>app/debug/page.tsx</code>
                </p>
            </div>

            <div className="mt-6">
                <a
                    href="/"
                    className="text-gold-400 hover:underline"
                >
                    ← Back to Home
                </a>
            </div>
        </div>
    );
}
