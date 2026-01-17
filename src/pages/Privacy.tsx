import { Shield, Eye, Database, Lock, Mail } from "lucide-react";

export default function Privacy() {
    return (
        <div>
            <main className="container mx-auto px-4 pb-16 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12 animate-spring-in">
                    <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 mb-6">
                        <Shield className="h-10 w-10 text-primary" />
                    </div>
                    <h1 className="text-4xl font-black mb-4">Privacy Policy</h1>
                    <p className="text-muted-foreground">
                        Last updated: January 2026
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-8">
                    <PolicySection
                        icon={<Eye className="h-5 w-5" />}
                        title="Information We Collect"
                    >
                        <p>We collect minimal information to provide you with the best typing experience:</p>
                        <ul className="list-disc list-inside space-y-2 mt-3">
                            <li>Account information (email, username) when you sign up</li>
                            <li>Typing test results and statistics</li>
                            <li>Settings and preferences</li>
                        </ul>
                    </PolicySection>

                    <PolicySection
                        icon={<Database className="h-5 w-5" />}
                        title="How We Use Your Data"
                    >
                        <ul className="list-disc list-inside space-y-2">
                            <li>To save and display your typing statistics</li>
                            <li>To show your position on leaderboards</li>
                            <li>To enable multiplayer features</li>
                            <li>To improve our service</li>
                        </ul>
                    </PolicySection>

                    <PolicySection
                        icon={<Lock className="h-5 w-5" />}
                        title="Data Security"
                    >
                        <p>
                            We use industry-standard security measures to protect your data.
                            Your information is stored securely and we never sell your data to third parties.
                        </p>
                    </PolicySection>

                    <PolicySection
                        icon={<Mail className="h-5 w-5" />}
                        title="Contact Us"
                    >
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at{" "}
                            <a href="mailto:privacy@typeflow.app" className="text-primary hover:underline">
                                privacy@typeflow.app
                            </a>
                        </p>
                    </PolicySection>
                </div>
            </main>
        </div>
    );
}

function PolicySection({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) {
    return (
        <div className="glass-premium rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {icon}
                </div>
                <h2 className="text-xl font-bold">{title}</h2>
            </div>
            <div className="text-muted-foreground leading-relaxed">
                {children}
            </div>
        </div>
    );
}
