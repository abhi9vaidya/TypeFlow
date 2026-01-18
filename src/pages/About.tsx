import { Keyboard, Zap, Target, Users, Trophy, Heart, Github, Flame, ShieldCheck, Sword, MessageSquare, Cpu, Rocket } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 100 }
    }
};

export default function About() {
    return (
        <div className="min-h-screen pt-12 pb-20 relative overflow-hidden">
             {/* Background Decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

            <motion.main
                className="container mx-auto px-4 max-w-5xl space-y-20"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Hero Section */}
                <motion.div variants={itemVariants} className="text-center space-y-8">
                    <div className="relative inline-block group">
                        <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <img
                            src="/logo.png"
                            alt="TypeFlow Logo"
                            className="h-48 w-48 object-contain drop-shadow-2xl relative z-10 transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                    
                    <div className="space-y-4">
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 py-1 px-4 text-xs font-black uppercase tracking-[0.2em] italic">
                            System Manifest v1.0
                        </Badge>
                        <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text text-transparent italic tracking-tighter uppercase leading-none pb-4 pr-6">
                            TYPEFLOW<br/>NEXUS
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium italic">
                            The ultimate mechanical interface for the modern typist. 
                            Engineered for precision, designed for dominance.
                        </p>
                    </div>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FeatureCard
                        icon={<Zap className="h-6 w-6 text-yellow-500" />}
                        title="KINETIC FEEDBACK"
                        description="Experience real-time telemetry with 0ms latency. Every keystroke is calculated for peak accuracy."
                        badge="Real-time"
                    />
                    <FeatureCard
                        icon={<Rocket className="h-6 w-6 text-blue-500" />}
                        title="HYPER MODES"
                        description="From zen-like focus to high-intensity word counts. We provide the arena; you provide the speed."
                        badge="Versatile"
                    />
                    <FeatureCard
                        icon={<Sword className="h-6 w-6 text-red-500" />}
                        title="GLADIATOR ARENA"
                        description="Enter synchronous multiplayer combat. Challenge the world's fastest in the Hall of Speed."
                        badge="Multiplayer"
                    />
                    <FeatureCard
                        icon={<Cpu className="h-6 w-6 text-emerald-500" />}
                        title="NEURAL ANALYTICS"
                        description="Deep dive into your metrics. Identify weak links and master your typing consistency."
                        badge="Advanced"
                    />
                    <FeatureCard
                        icon={<Flame className="h-6 w-6 text-purple-500" />}
                        title="AURA CUSTOMS"
                        description="Full interface customization. Ambient glows, motion blurred text, and custom typography."
                        badge="Premium"
                    />
                    <FeatureCard
                        icon={<ShieldCheck className="h-6 w-6 text-orange-500" />}
                        title="ENCRYPTED HISTORY"
                        description="Every session is logged and searchable. Watch your evolution from novice to legend."
                        badge="Secure"
                    />
                </div>

                {/* Mission Section */}
                <motion.div variants={itemVariants} className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/5 to-primary/20 rounded-[3rem] blur opacity-25 group-hover:opacity-40 transition-opacity" />
                    <div className="relative bg-panel/20 backdrop-blur-3xl rounded-[3rem] p-12 md:p-16 border border-white/5 overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-5 italic font-black text-9xl pointer-events-none select-none">MISSION</div>
                        <div className="max-w-3xl space-y-6 relative z-10">
                            <h2 className="text-4xl font-black italic uppercase tracking-tighter">OUR OVERRIDING MISSION</h2>
                            <p className="text-xl text-muted-foreground leading-relaxed italic font-medium">
                                TypeFlow was forged in the fires of frustration with static, boring typing tests. 
                                We set out to create an ecosystem that doesn't just measure speed, but celebrates it. 
                                We believe that typing is an art form—a direct bridge between thought and digital reality. 
                                Our mission is to make that bridge as frictionless and beautiful as possible.
                            </p>
                            <div className="flex items-center gap-4 pt-4">
                                <div className="h-1 w-20 bg-primary" />
                                <span className="text-xs font-black uppercase tracking-widest text-primary italic">Est. 2024 / TypeFlow Global</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Open Source Section */}
                <motion.div variants={itemVariants} className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-12 text-center space-y-8 shadow-2xl">
                    <div className="flex justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                            <Github className="h-8 w-8" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-3xl font-black italic uppercase tracking-tighter">DECENTRALIZED ARCHITECTURE</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed italic font-medium">
                            TypeFlow is, and will always be, fully open source. We believe the tools for personal 
                            growth should be available to everyone. Forge your own path, contribute to the core, 
                            or audit our logic on GitHub.
                        </p>
                    </div>
                    <div className="pt-4 flex flex-col md:flex-row items-center justify-center gap-6">
                        <a
                            href="https://github.com/abhi9vaidya/TypeFlow"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-foreground text-background font-black italic uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/5 border border-white/10"
                        >
                            <Github className="h-5 w-5" />
                            <span>SOURCE CODE</span>
                        </a>
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-40">
                            MIT LICENSE / REPO: ABHI9VAIDYA/TYPEFLOW
                        </div>
                    </div>
                </motion.div>

                <footer className="pt-20 text-center opacity-30 flex flex-col items-center gap-4">
                    <Heart className="h-5 w-5 fill-primary text-primary animate-pulse" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">
                        Handcrafted for speed / Built with passion
                    </p>
                </footer>
            </motion.main>
        </div>
    );
}

function FeatureCard({ icon, title, description, badge }: { icon: React.ReactNode; title: string; description: string; badge: string }) {
    return (
        <motion.div variants={itemVariants} className="group">
            <Card className="h-full bg-panel/10 backdrop-blur-xl border-white/5 rounded-[2rem] overflow-hidden group-hover:border-primary/20 transition-all duration-500 shadow-2xl flex flex-col">
                <CardHeader className="p-8 pb-4">
                    <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:bg-primary/5 transition-transform">
                            {icon}
                        </div>
                        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest bg-background/50 border-white/5 opacity-40 group-hover:opacity-100 group-hover:border-primary/20 transition-all">
                            {badge}
                        </Badge>
                    </div>
                    <CardTitle className="text-xl font-black italic uppercase tracking-tight group-hover:text-primary transition-colors">
                        {title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0 flex-1">
                    <p className="text-sm text-muted-foreground leading-relaxed italic font-medium opacity-70 group-hover:opacity-100 transition-opacity">
                        {description}
                    </p>
                </CardContent>
            </Card>
        </motion.div>
    );
}
