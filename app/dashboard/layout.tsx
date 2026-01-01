import { Sidebar } from "@/components/dashboard/Sidebar";
import TrialBanner from "@/components/dashboard/TrialBanner";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-champagne flex overflow-hidden">
            <Sidebar />
            {/* Main content - responsive margin for sidebar */}
            <main className="flex-1 lg:ml-72 xl:ml-80 relative overflow-y-auto">
                {/* Trial Banner for Curioso users */}
                <TrialBanner />
                {/* Premium Backdrop Effects */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Top-right gold glow */}
                    <div className="absolute top-0 right-0 w-[300px] lg:w-[500px] h-[300px] lg:h-[500px] bg-gold/5 rounded-full blur-[100px] lg:blur-[150px] -translate-y-1/2 translate-x-1/2" />
                    {/* Bottom-left subtle glow */}
                    <div className="absolute bottom-0 left-0 w-[200px] lg:w-[400px] h-[200px] lg:h-[400px] bg-gold/3 rounded-full blur-[80px] lg:blur-[120px] translate-y-1/2 -translate-x-1/2" />
                    {/* Neural grid pattern - hidden on mobile for performance */}
                    <div className="hidden lg:block absolute inset-0 opacity-[0.015]" style={{
                        backgroundImage: `
                            linear-gradient(rgba(212, 175, 55, 0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(212, 175, 55, 0.3) 1px, transparent 1px)
                        `,
                        backgroundSize: '60px 60px'
                    }} />
                </div>
                <div className="relative z-10 min-h-full pt-16 lg:pt-0">
                    {children}
                </div>
            </main>
        </div>
    );
}
