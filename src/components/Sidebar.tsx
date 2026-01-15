import { Settings, BarChart3, LineChart, LogIn, LogOut, User, Trophy, Users, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { AuthModal } from "@/components/AuthModal";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTypingStore } from "@/store/useTypingStore";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, profile, signOut, isLoading } = useAuthStore();
    const { isRunning, testMode } = useTypingStore();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    return (
        <motion.aside
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={cn(
                "fixed left-0 top-0 z-50 h-full w-20 flex flex-col items-center py-8 border-r border-border/20 bg-background/80 backdrop-blur-xl transition-all duration-700 ease-in-out",
                isRunning && "opacity-0 hover:opacity-100 focus-within:opacity-100"
            )}
        >
            {/* Logo */}
            <button
                onClick={() => navigate("/")}
                className="mb-8 relative group"
            >
                <div className="relative group-hover:scale-110 transition-transform duration-300">
                    <img
                        src="/logo.png"
                        alt="TypeFlow Logo"
                        className="w-10 h-10 object-contain drop-shadow-lg"
                    />
                </div>
            </button>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col items-center gap-4 w-full px-2">
                <TooltipProvider delayDuration={0}>
                    {[
                        { path: "/", icon: Home, label: "Home", color: "primary" },
                        { path: "/statistics", icon: LineChart, label: "Statistics", color: "primary" },
                        { path: "/leaderboard", icon: Trophy, label: "Leaderboard", color: "yellow-500" },
                        { path: "/multiplayer", icon: Users, label: "Multiplayer", color: "cyan-500" },
                        { path: "/history", icon: BarChart3, label: "History", color: "secondary" },
                    ].map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Tooltip key={item.path}>
                                <TooltipTrigger asChild>
                                    <div className="relative group w-full flex justify-center">
                                        {isActive && (
                                            <motion.div
                                                layoutId="sidebar-nav-bg"
                                                className="absolute inset-0 bg-primary/10 rounded-xl mx-2"
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => navigate(item.path)}
                                            className={cn(
                                                "relative h-12 w-12 rounded-xl transition-all duration-300 group z-10",
                                                isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                                            )}
                                        >
                                            <item.icon className={cn(
                                                "h-6 w-6 transition-all duration-300",
                                                isActive && "scale-110 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]",
                                                !isActive && "group-hover:scale-110"
                                            )} />
                                        </Button>
                                        {/* Active Indicator Line */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="sidebar-active-indicator"
                                                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"
                                            />
                                        )}
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="bg-popover/80 backdrop-blur-md border-border/50 ml-2">
                                    <p>{item.label}</p>
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </TooltipProvider>
            </nav>

            {/* Bottom Actions */}
            <div className="flex flex-col items-center gap-4 w-full px-2 mt-auto">
                <TooltipProvider delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate("/settings")}
                                className={cn(
                                    "h-12 w-12 rounded-xl text-muted-foreground hover:text-accent transition-all duration-300",
                                    location.pathname === "/settings" && "text-accent bg-accent/10"
                                )}
                            >
                                <Settings className="h-6 w-6 transition-transform duration-300 hover:rotate-90" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-popover/80 backdrop-blur-md border-border/50 ml-2">
                            <p>Settings</p>
                        </TooltipContent>
                    </Tooltip>

                    <div className="w-8 h-px bg-border/50" />

                    {isLoading ? (
                        <div className="h-10 w-10 rounded-full bg-primary/10 animate-pulse border border-primary/20" />
                    ) : user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-12 w-12 rounded-full p-0 overflow-hidden ring-2 ring-transparent hover:ring-primary/20 transition-all">
                                    <Avatar className="h-10 w-10 border border-primary/20 transition-transform hover:scale-110">
                                        <AvatarImage src={profile?.avatar_url || user.user_metadata?.avatar_url} />
                                        <AvatarFallback className="bg-primary/10 text-primary uppercase font-bold text-sm">
                                            {(profile?.nickname || user.email)?.charAt(0) || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 glass-lg border-primary/20 ml-4" side="right" align="end">
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none truncate">
                                            {profile?.nickname || "Typist"}
                                        </p>
                                        <p className="text-xs leading-none text-muted-foreground truncate">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => navigate("/account")}>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Account Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate("/statistics")}>
                                    <LineChart className="mr-2 h-4 w-4" />
                                    <span>Your Progress</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => signOut()} className="text-destructive focus:text-destructive">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={() => setIsAuthModalOpen(true)}
                                    className="h-12 w-12 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                                    size="icon"
                                >
                                    <LogIn className="h-5 w-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="bg-popover/80 backdrop-blur-md border-border/50 ml-2">
                                <p>Sign In</p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </TooltipProvider>
            </div>

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </motion.aside>
    );
}
