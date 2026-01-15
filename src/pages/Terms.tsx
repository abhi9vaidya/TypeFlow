import { Header } from "@/components/Header";
import { FileText, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export default function Terms() {
    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 pt-24 pb-16 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12 animate-spring-in">
                    <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 mb-6">
                        <FileText className="h-10 w-10 text-primary" />
                    </div>
                    <h1 className="text-4xl font-black mb-4">Terms of Service</h1>
                    <p className="text-muted-foreground">
                        Last updated: January 2026
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-8">
                    <TermsSection title="1. Acceptance of Terms">
                        <p>
                            By accessing and using TypeFlow, you accept and agree to be bound by these Terms of Service.
                            If you do not agree to these terms, please do not use our service.
                        </p>
                    </TermsSection>

                    <TermsSection title="2. Use of Service">
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                                <p>Use TypeFlow to practice and improve your typing skills</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                                <p>Participate in multiplayer races and leaderboards fairly</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                                <p>Share your results and achievements</p>
                            </div>
                        </div>
                    </TermsSection>

                    <TermsSection title="3. Prohibited Activities">
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                                <p>Using automated tools, bots, or scripts to cheat</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                                <p>Manipulating your scores or statistics</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                                <p>Harassing other users in multiplayer modes</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                                <p>Attempting to access other users' accounts</p>
                            </div>
                        </div>
                    </TermsSection>

                    <TermsSection title="4. Account Responsibility">
                        <p>
                            You are responsible for maintaining the confidentiality of your account credentials
                            and for all activities that occur under your account.
                        </p>
                    </TermsSection>

                    <TermsSection title="5. Disclaimer">
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-gold/10 border border-gold/20">
                            <AlertTriangle className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
                            <p className="text-sm">
                                TypeFlow is provided "as is" without warranties of any kind.
                                We do not guarantee uninterrupted access to the service.
                            </p>
                        </div>
                    </TermsSection>

                    <TermsSection title="6. Changes to Terms">
                        <p>
                            We reserve the right to modify these terms at any time.
                            Continued use of TypeFlow after changes constitutes acceptance of the new terms.
                        </p>
                    </TermsSection>
                </div>
            </main>
        </div>
    );
}

function TermsSection({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="glass-premium rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            <div className="text-muted-foreground leading-relaxed">
                {children}
            </div>
        </div>
    );
}
