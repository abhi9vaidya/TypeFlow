import { Shield, Eye, Database, Lock, Mail, ChevronLeft, ShieldCheck, Fingerprint, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function Privacy() {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5, staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.98 },
        visible: { opacity: 1, scale: 1 }
    };

    return (
        <div className="min-h-screen pt-12 pb-20 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

            <motion.main 
                className="container mx-auto px-4 max-w-4xl space-y-16"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => navigate("/")}
                                className="rounded-full h-8 w-8 p-0 border border-white/5 bg-white/5 hover:bg-white/10 transition-all"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 py-1 px-3 text-[10px] font-black uppercase italic tracking-widest">
                                Protocol DP-2026
                            </Badge>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent italic tracking-tighter uppercase pb-2 pr-4">
                            PRIVACY<br/>ARCHITECTURE
                        </h1>
                        <p className="text-muted-foreground font-medium italic">
                            Last system synchronization: January 2026
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    <PolicySection
                        icon={<Fingerprint className="h-6 w-6 text-primary" />}
                        title="NEURAL DATA HARVESTING"
                        index="01"
                    >
                        <p className="italic font-medium leading-relaxed">
                            We collect minimal identity parameters required to maintain your tactical performance records:
                        </p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            <li className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                                <span className="text-xs font-black uppercase tracking-widest opacity-70">Identity Tags (Email/Username)</span>
                            </li>
                            <li className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                                <span className="text-xs font-black uppercase tracking-widest opacity-70">Metric Telemetry (WPM/ACC)</span>
                            </li>
                            <li className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                                <span className="text-xs font-black uppercase tracking-widest opacity-70">System Preferences</span>
                            </li>
                            <li className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                                <span className="text-xs font-black uppercase tracking-widest opacity-70">Heatmap Topography</span>
                            </li>
                        </ul>
                    </PolicySection>

                    <PolicySection
                        icon={<Globe className="h-6 w-6 text-blue-500" />}
                        title="UTILIZATION PROTOCOLS"
                        index="02"
                    >
                        <p className="italic font-medium leading-relaxed">
                            Data is processed exclusively to enhance the TypeFlow ecosystem:
                        </p>
                        <ul className="space-y-3 mt-4">
                            {[
                                "Persistence of typing evolution stats",
                                "Hall of Speed (Leaderboard) placement",
                                "Synchronous multiplayer synchronization",
                                "Core engine optimization"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 px-4 py-2 opacity-70 italic font-bold text-sm uppercase tracking-tighter">
                                    <span className="text-primary font-mono text-[10px]">[{i+1}]</span> {item}
                                </li>
                            ))}
                        </ul>
                    </PolicySection>

                    <PolicySection
                        icon={<ShieldCheck className="h-6 w-6 text-emerald-500" />}
                        title="SECURITY FIREWALLS"
                        index="03"
                    >
                        <p className="italic font-medium leading-relaxed">
                            We deploy high-grade encryption layers to safeguard your repository. 
                            Your data remains your own. We operate on a ZERO-LEAD policy: 
                            we never sell, lease, or distribute your metrics to third-party entities.
                        </p>
                    </PolicySection>

                    <PolicySection
                        icon={<Mail className="h-6 w-6 text-rose-500" />}
                        title="COMMS UPLINK"
                        index="04"
                    >
                        <p className="italic font-medium leading-relaxed">
                            Direct inquiries to the encryption oversight committee:
                        </p>
                        <div className="mt-6">
                            <a 
                                href="mailto:privacy@typeflow.app" 
                                className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all group"
                            >
                                <Mail className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                                <span className="font-black italic uppercase tracking-widest text-sm">privacy@typeflow.app</span>
                            </a>
                        </div>
                    </PolicySection>
                </div>

                <footer className="pt-20 text-center opacity-30">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] italic">
                        Securing the flow / Encrypting the speed
                    </p>
                </footer>
            </motion.main>
        </div>
    );
}

function PolicySection({ icon, title, children, index }: { icon: React.ReactNode; title: string; children: React.ReactNode; index: string }) {
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div variants={itemVariants} className="relative group">
            <div className="absolute -left-4 top-0 bottom-0 w-[2px] bg-primary/20 group-hover:bg-primary transition-colors" />
            <div className="bg-panel/10 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 border border-white/5 group-hover:border-primary/20 transition-all">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-primary">
                            {icon}
                        </div>
                        <h2 className="text-xl font-black italic uppercase tracking-tight">{title}</h2>
                    </div>
                    <span className="font-mono text-3xl font-black italic opacity-5">{index}</span>
                </div>
                <div className="text-muted-foreground">
                    {children}
                </div>
            </div>
        </motion.div>
    );
}
