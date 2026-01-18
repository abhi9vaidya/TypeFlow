import { FileText, CheckCircle, XCircle, AlertTriangle, ChevronLeft, Scale, Gavel, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function Terms() {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5, staggerChildren: 0.1 }
        }
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
                                Legal Framework v1.4
                            </Badge>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent italic tracking-tighter uppercase pb-2 pr-4">
                            TERMS OF<br/>ENGAGEMENT
                        </h1>
                        <p className="text-muted-foreground font-medium italic">
                            Operational status: Active since January 2026
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    <TermsSection title="01. SYSTEM ACCESS" icon={<Scale className="w-6 h-6 text-primary" />}>
                        <p className="italic font-medium leading-relaxed">
                            By initializing the TypeFlow interface, you acknowledge and accept the binding 
                            constraints of this agreement. Discontinuation of use is required if you 
                            reject any sector of these protocols.
                        </p>
                    </TermsSection>

                    <TermsSection title="02. AUTHORIZED USAGE" icon={<CheckCircle className="w-6 h-6 text-emerald-500" />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            {[
                                "Performance optimization and metric tracking",
                                "Fair play in multiplayer combat scenarios",
                                "Result distribution via authorized channels",
                                "Interface evolution participation"
                            ].map((item, i) => (
                                <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                                    <div className="h-4 w-4 rounded-full border-2 border-emerald-500/20 flex items-center justify-center mt-0.5">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-tight opacity-70 italic">{item}</span>
                                </div>
                            ))}
                        </div>
                    </TermsSection>

                    <TermsSection title="03. SYSTEM VIOLATIONS" icon={<XCircle className="w-6 h-6 text-rose-500" />}>
                        <div className="space-y-3 mt-4">
                            {[
                                "Deployment of automation scripts or 'bots'",
                                "Manipulation of telemetry data or scores",
                                "Hostile conduct in multiplayer zones",
                                "Unauthorized access to peer data banks"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 group">
                                    <XCircle className="h-4 w-4 text-rose-500 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm font-black italic uppercase tracking-tighter opacity-80">{item}</span>
                                </div>
                            ))}
                        </div>
                    </TermsSection>

                    <TermsSection title="04. REPOSITORY SECURITY" icon={<Gavel className="w-6 h-6 text-blue-500" />}>
                        <p className="italic font-medium leading-relaxed opacity-70">
                            Users maintain absolute responsibility for the integrity of their access credentials. 
                            TypeFlow Global is not liable for data breaches occurring from local security neglect.
                        </p>
                    </TermsSection>

                    <TermsSection title="05. DISCLAIMER OF GUARANTEE" icon={<AlertTriangle className="w-6 h-6 text-amber-500" />}>
                        <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10 space-y-3">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="h-5 w-5 text-amber-500" />
                                <span className="text-sm font-black italic uppercase tracking-widest">LIABILITY NULLIFICATION</span>
                            </div>
                            <p className="text-sm italic font-medium leading-relaxed opacity-70">
                                TypeFlow is provided "AS IS". We offer no warranties regarding system uptime, 
                                result accuracy, or data permanence during critical system overhauls.
                            </p>
                        </div>
                    </TermsSection>

                    <TermsSection title="06. PROTOCOL EVOLUTION" icon={<FileCheck className="w-6 h-6 text-purple-500" />}>
                        <p className="italic font-medium leading-relaxed opacity-70">
                            We reserve the authority to modify these parameters at our discretion. 
                            Continued interface interaction following protocol updates constitutes 
                            automatic acceptance of the revised framework.
                        </p>
                    </TermsSection>
                </div>

                <footer className="pt-20 text-center opacity-30">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] italic">
                        Governing the speed / Upholding the flow
                    </p>
                </footer>
            </motion.main>
        </div>
    );
}

function TermsSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="bg-panel/10 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-white/5 relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                {icon}
            </div>
            <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                        {icon}
                    </div>
                    <h2 className="text-xl font-black italic uppercase tracking-tight">{title}</h2>
                </div>
                <div className="text-muted-foreground">
                    {children}
                </div>
            </div>
        </div>
    );
}
