import { Header } from "@/components/Header";
import { Keyboard, Zap, Target, Users, Trophy, Heart } from "lucide-react";

export default function About() {
    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 pt-24 pb-16 max-w-4xl">
                {/* Hero Section */}
                <div className="text-center mb-16 animate-spring-in">
                    <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 mb-6">
                        <Keyboard className="h-12 w-12 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4">
                        <span className="text-gradient">About TypeFlow</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        The modern typing speed test designed to help you improve your typing skills with style.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-16">
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
                </div>

                {/* Mission Section */}
                <div className="glass-premium rounded-2xl p-8 md:p-12 text-center mb-16">
                    <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        TypeFlow was created with one goal in mind: to make typing practice enjoyable and effective.
                        We believe that with the right tools and motivation, anyone can become a faster, more accurate typist.
                        Our platform combines beautiful design with powerful features to create the ultimate typing experience.
                    </p>
                </div>

                {/* Creator Section */}
                <div className="text-center">
                    <p className="flex items-center justify-center gap-2 text-muted-foreground">
                        Made with <Heart className="h-4 w-4 text-red-500" /> by
                        <span className="font-semibold text-foreground">Abhinav Vaidya</span>
                    </p>
                </div>
            </main>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="glass-premium rounded-2xl p-6 card-hover-lift">
            <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 text-primary">
                    {icon}
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-2">{title}</h3>
                    <p className="text-muted-foreground text-sm">{description}</p>
                </div>
            </div>
        </div>
    );
}
