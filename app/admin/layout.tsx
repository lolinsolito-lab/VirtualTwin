"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarAdmin } from "@/components/admin/SidebarAdmin";
import { supabase } from "@/lib/supabase";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // 1. Get current session from client
                const { data: { session } } = await supabase.auth.getSession();

                // 2. If no session, go to login
                if (!session) {
                    router.push("/auth/login");
                    return;
                }

                // 3. Cryptographic check for Admin status
                const { data, error } = await supabase
                    .from('profiles')
                    .select('is_super_admin, role')
                    .eq('id', session.user.id)
                    .single();

                const isAdmin = data?.is_super_admin || data?.role === 'admin';

                if (error || !isAdmin) {
                    console.warn("🔐 Access Denied: User is not an Admin", session.user.email);
                    // Redirect non-admins to the standard dashboard
                    router.push("/dashboard");
                    return;
                }

                setIsAuthorized(true);
            } catch (err) {
                console.error("❌ Auth Error:", err);
                router.push("/auth/login");
            }
        };

        checkAuth();
    }, [router]);

    // Show high-performance loader while verifying
    if (isAuthorized === null) {
        return (
            <div className="min-h-screen bg-[#020202] flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-gold/20 border-t-gold rounded-full animate-spin shadow-[0_0_15px_rgba(212,175,55,0.3)]" />
                    <p className="text-gold text-[10px] uppercase tracking-[0.5em] font-black animate-pulse">Verifying Sovereign DNA...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020202] text-white flex overflow-hidden">
            <SidebarAdmin />

            <main className="flex-1 lg:ml-72 xl:ml-80 relative overflow-y-auto">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[180px] -translate-y-1/2 translate-x-1/4" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/3 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4" />
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: `
                            linear-gradient(rgba(212, 175, 55, 0.4) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(212, 175, 55, 0.4) 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px'
                    }} />
                </div>

                <div className="relative z-10 min-h-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
