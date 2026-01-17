import { Keyboard, Zap, Target, Users, Trophy, Heart, Github } from "lucide-react";
import { motion, Variants } from "framer-motion";

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
        <div>
            <motion.main
                className="container mx-auto px-4 pb-16 max-w-4xl"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Hero Section */}
                <motion.div variants={itemVariants} className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-4 mb-6 hover:scale-110 transition-transform duration-300">
                        <img
                            src="/logo.png"
                            alt="TypeFlow Logo"
                            className="h-40 w-40 object-contain drop-shadow-xl"
                        />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4">
                        <span className="text-gradient">About TypeFlow</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        The modern typing speed test designed to help you improve your typing skills with style.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <motion.div variants={containerVariants} className="grid md:grid-cols-2 gap-6 mb-16">
                    <FeatureCard
                        icon={<Zap className="h-6 w-6" />}
                        title="Real-time Metrics"
                        description="Track your WPM, accuracy, and consistency as you type with beautiful visualizations."
                    />
                    <FeatureCard
                        icon={<Target className="h-6 w-6" />}
                        title="Multiple Modes"
                        description="Choose from timed tests, word counts, quotes, or zen mode for endless practice."
                    />
                    <FeatureCard
                        icon={<Users className="h-6 w-6" />}
                        title="Multiplayer Races"
                        description="Challenge friends to real-time typing races and see who's the fastest."
                    />
                    <FeatureCard
                        icon={<Trophy className="h-6 w-6" />}
                        title="Achievements & Stats"
                        description="Earn achievements, track your progress, and climb the global leaderboard."
                    />
                </motion.div>

                {/* Mission Section */}
                <motion.div variants={itemVariants} className="glass-premium rounded-2xl p-8 md:p-12 text-center mb-16">
                    <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        TypeFlow was created with one goal in mind: to make typing practice enjoyable and effective.
                        We believe that with the right tools and motivation, anyone can become a faster, more accurate typist.
                        Our platform combines beautiful design with powerful features to create the ultimate typing experience.
                    </p>
                </motion.div>

                {/* Open Source Section */}
                <motion.div variants={itemVariants} className="glass-premium rounded-2xl p-8 md:p-12 text-center mb-16 border border-primary/20 bg-primary/5">
                    <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-3">
                        <Github className="h-6 w-6" />
                        <span>Proudly Open Source</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-6">
                        TypeFlow is open source and community-driven. We believe in transparency and collaboration.
                        You can view our source code, contribute features, or report issues on GitHub.
                    </p>
                    <a
                        href="https://github.com/abhi9vaidya/TypeFlow"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/25"
                    >
                        <Github className="h-5 w-5" />
                        <span>Star on GitHub</span>
                    </a>
                </motion.div>

                {/* Creator Section */}
                <motion.div variants={itemVariants} className="text-center">
                    <p className="flex items-center justify-center gap-2 text-muted-foreground">
                        Made with <Heart className="h-4 w-4 text-red-500" /> by
                        <span className="font-semibold text-foreground">Abhinav Vaidya</span>
                    </p>
                </motion.div>
            </motion.main>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <motion.div variants={itemVariants} className="glass-premium rounded-2xl p-6 card-hover-lift">
            <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 text-primary">
                    {icon}
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-2">{title}</h3>
                    <p className="text-muted-foreground text-sm">{description}</p>
                </div>
            </div>
        </motion.div>
    );
}
