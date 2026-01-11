import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { useAuthStore } from "@/store/useAuthStore";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { User, AtSign, FileText, Save, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Account() {
  const { user, profile, fetchProfile } = useAuthStore();
  const navigate = useNavigate();
  
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setNickname(profile.nickname || "");
      setBio(profile.bio || "");
    }
  }, [profile]);

  useEffect(() => {
    // Redirect if not logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
        toast.error("Please sign in to access your account settings.");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSave = async () => {
    if (!user) return;
    
    if (nickname.length < 3) {
      toast.error("Nickname must be at least 3 characters long.");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          nickname,
          bio,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        if (error.code === '23505') {
          throw new Error("This nickname is already taken. Please choose another one.");
        }
        throw error;
      }

      await fetchProfile(user.id);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
            <p className="text-muted-foreground">
              Manage your profile and how you appear on the leaderboard.
            </p>
          </div>

          <Card className="glass-lg border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Public Profile
              </CardTitle>
              <CardDescription>
                This information will be visible to other typists on the leaderboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <AtSign className="h-4 w-4 text-muted-foreground" />
                  Email Address
                </Label>
                <Input 
                  id="email" 
                  value={user.email} 
                  disabled 
                  className="bg-muted/50 border-primary/10 cursor-not-allowed"
                />
                <p className="text-[10px] text-muted-foreground italic">
                  Email is private and will never be shared.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nickname" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Display Nickname
                </Label>
                <Input 
                  id="nickname" 
                  placeholder="CoolSpeed77"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="bg-background/50 border-primary/20 focus:border-primary"
                />
                <p className="text-[10px] text-muted-foreground">
                  Your nickname on the leaderboard. Minimum 3 characters.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Bio
                </Label>
                <Input 
                  id="bio" 
                  placeholder="Fastest typist in the solar system..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="bg-background/50 border-primary/20 focus:border-primary"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-primary/10 pt-6">
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
