import { Github, Twitter, Keyboard, Heart, Coffee } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative w-full border-t border-border/20 bg-gradient-to-t from-background via-background/95 to-transparent">
            {/* Subtle glow effect at top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                    {/* Brand */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="flex items-center gap-2 text-lg font-bold">
                            <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:from-primary/30 group-hover:to-secondary/30 transition-colors">
                                <Keyboard className="h-4 w-4 text-primary" />
                            </div>
                            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                TypeFlow
                            </span>
                        </div>
                        <span className="text-muted-foreground/50 text-sm hidden sm:inline">|</span>
                        <span className="text-muted-foreground/70 text-sm hidden sm:inline group-hover:text-muted-foreground transition-colors">
                            Master your typing speed
                        </span>
                    </Link>

                    {/* Links */}
                    <div className="flex items-center gap-6 text-sm text-muted-foreground/70">
                        <Link to="/about" className="hover:text-primary transition-colors duration-200">
                            About
                        </Link>
                        <Link to="/privacy" className="hover:text-primary transition-colors duration-200">
                            Privacy
                        </Link>
                        <Link to="/terms" className="hover:text-primary transition-colors duration-200">
                            Terms
                        </Link>
                        <a
                            href="https://github.com/abhi9vaidya/TypeFlow"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary transition-colors duration-200"
                            title="View on GitHub"
                        >
                            <Github className="h-4 w-4" />
                        </a>
                        <a
                            href="https://twitter.com/abhi9_1535"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-secondary transition-colors duration-200"
                            title="Follow on Twitter"
                        >
                            <Twitter className="h-4 w-4" />
                        </a>
                    </div>

                    {/* Copyright */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground/60">
                        <span>Made with</span>
                        <Heart className="h-3.5 w-3.5 text-red-500 animate-pulse" />
                        <span>by</span>
                        <a
                            href="https://github.com/abhi9vaidya"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-muted-foreground/80 hover:text-primary transition-colors duration-200"
                        >
                            Abhinav Vaidya
                        </a>
                        <span className="hidden sm:inline">• © {currentYear}</span>
                    </div>
                </div>

                {/* Bottom accent line */}
                <div className="mt-6 pt-4 border-t border-border/10 flex items-center justify-center gap-2 text-xs text-muted-foreground/40">
                    <Coffee className="h-3 w-3" />
                    <span>Fueled by caffeine and a passion for speed</span>
                </div>
            </div>
        </footer>
    );
}
