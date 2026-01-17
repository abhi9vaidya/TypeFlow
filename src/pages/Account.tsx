import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { User, AtSign, FileText, Save, Loader2, Users, Camera, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FriendsPanel } from "@/components/FriendsPanel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Account() {
  const { user, profile, fetchProfile } = useAuthStore();
  const navigate = useNavigate();
  
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setNickname(profile.nickname || "");
      setBio(profile.bio || "");
      setAvatarUrl(profile.avatar_url || null);
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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!user) return;
      setIsUploading(true);
      
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
      toast.success("Avatar uploaded! Don't forget to save your profile.");
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error("Failed to upload avatar. Make sure you have an 'avatars' bucket in Supabase.");
    } finally {
      setIsUploading(false);
    }
  };

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
        .upsert({
          id: user.id,
          nickname,
          bio,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        if (error.code === '23505') {
          throw new Error("This nickname is already taken. Please choose another one.");
        }
        throw error;
      }

      await fetchProfile(user.id);
      toast.success("Profile updated successfully!");
      
      // Redirect back to main page after a short delay so they see the toast
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      
      
      <main className="container mx-auto px-4 pb-12">
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
            <p className="text-muted-foreground">
              Manage your profile and stay connected with other typists.
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-panel/50 border-border/50">
              <TabsTrigger value="profile" className="gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="friends" className="gap-2">
                <Users className="h-4 w-4" />
                Friends
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
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
                  {/* Avatar Section */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-primary/10">
                    <div className="relative group">
                      <Avatar className="h-24 w-24 border-2 border-primary/20 transition-all group-hover:border-primary/50">
                        <AvatarImage src={avatarUrl || ""} alt={nickname} className="object-cover" />
                        <AvatarFallback className="bg-primary/10 text-xl font-bold">
                          {nickname ? nickname.substring(0, 2).toUpperCase() : "GK"}
                        </AvatarFallback>
                      </Avatar>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
                      >
                        {isUploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Camera className="h-6 w-6" />}
                      </button>
                    </div>
                    <div className="flex flex-col gap-2 items-center sm:items-start text-center sm:text-left">
                      <Label className="text-sm font-medium">Profile Picture</Label>
                      <p className="text-xs text-muted-foreground max-w-[240px]">
                        Upload a square image for best results. Max size 2MB.
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          className="h-8 gap-2 border-primary/20 hover:border-primary/40"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                        >
                          <Upload className="h-3.5 w-3.5" />
                          Upload
                        </Button>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                        {avatarUrl && (
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => setAvatarUrl(null)}
                            disabled={isUploading}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

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
            </TabsContent>

            <TabsContent value="friends">
              <FriendsPanel />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
