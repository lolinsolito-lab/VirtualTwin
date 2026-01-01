import { SidebarAdmin } from "@/components/admin/SidebarAdmin";
import { isSuperAdmin } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // 1. Get current session
    const { data: { session } } = await supabaseAdmin.auth.getSession();

    // 2. If no session, go to login
    if (!session) {
        redirect("/auth/login");
    }

    // 3. Cryptographic check for SuperAdmin status
    const isAdmin = await isSuperAdmin(session.user.id);
    if (!isAdmin) {
        // Redirect non-admins to the standard dashboard
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen bg-[#020202] text-white flex overflow-hidden">
            <SidebarAdmin />

            <main className="flex-1 lg:ml-72 xl:ml-80 relative overflow-y-auto">
                {/* God-Mode Backdrop Effects */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Dark gold glow - top right */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[180px] -translate-y-1/2 translate-x-1/4" />
                    {/* Deep shadow - bottom left */}
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/3 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4" />

                    {/* Command Center Grid */}
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
