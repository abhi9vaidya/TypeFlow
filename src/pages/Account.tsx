import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  User, 
  AtSign, 
  FileText, 
  Save, 
  Loader2, 
  Users, 
  Camera, 
  Upload, 
  ChevronLeft,
  Zap,
  ShieldCheck,
  Globe,
  PenLine
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FriendsPanel } from "@/components/FriendsPanel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
      toast.success("Avatar uploaded! Remember to save your profile.");
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error("Upload failed. Verify 'avatars' storage exists.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    if (nickname.length < 3) {
      toast.error("Nickname must be 3+ characters.");
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
          throw new Error("Nickname already claimed.");
        }
        throw error;
      }

      await fetchProfile(user.id);
      toast.success("Identity updated.");
      
      setTimeout(() => {
        navigate("/statistics");
      }, 1500);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Update failed');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen pb-20 pt-12">
      <main className="container mx-auto px-4">
        <motion.div 
          className="max-w-4xl mx-auto space-y-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate(-1)}
                  className="rounded-full h-8 w-8 p-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 py-1 px-3">
                  <ShieldCheck className="w-3 h-3 mr-1" /> Profile Nexus
                </Badge>
              </div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent italic tracking-tight uppercase pr-4 pb-2">
                ACCOUNT
              </h1>
              <p className="text-muted-foreground font-medium">
                Customize your digital presence across the TypeFlow network.
              </p>
            </div>
            
            <div className="flex items-center gap-3 bg-panel/20 backdrop-blur-md border border-white/5 p-4 rounded-2xl">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status: Authorized</span>
            </div>
          </div>

          <Tabs defaultValue="profile" className="w-full space-y-8">
            <div className="flex justify-center md:justify-start">
              <TabsList className="bg-panel/10 backdrop-blur-md border border-white/5 p-1 rounded-2xl h-14">
                <TabsTrigger value="profile" className="px-8 rounded-xl font-black italic uppercase tracking-widest text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <User className="w-3.5 h-3.5 mr-2" /> PROFILE
                </TabsTrigger>
                <TabsTrigger value="friends" className="px-8 rounded-xl font-black italic uppercase tracking-widest text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Users className="w-3.5 h-3.5 mr-2" /> NETWORK
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="profile" className="mt-0">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Left Column: Avatar & Quick Stats */}
                  <div className="space-y-8">
                    <Card className="border-white/5 bg-panel/5 backdrop-blur-xl overflow-hidden rounded-3xl">
                      <CardContent className="pt-10 pb-8 flex flex-col items-center">
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                          <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-secondary rounded-full blur opacity-25 group-hover:opacity-60 transition duration-500"></div>
                          <Avatar className="h-40 w-40 relative border-4 border-background ring-2 ring-white/10 transition-transform group-hover:scale-[1.02]">
                            <AvatarImage src={avatarUrl || ""} className="object-cover" />
                            <AvatarFallback className="bg-white/5 text-4xl font-black">
                              {nickname ? nickname.substring(0, 2).toUpperCase() : "TY"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            {isUploading ? <Loader2 className="h-10 w-10 animate-spin text-white" /> : <Camera className="h-10 w-10 text-white" />}
                          </div>
                          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                        </div>
                        
                        <div className="mt-8 text-center space-y-1">
                          <h2 className="text-2xl font-black italic tracking-tight">{nickname || "Unnamed Typist"}</h2>
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60 flex items-center justify-center gap-1">
                            <AtSign className="w-3 h-3" /> {user.email}
                          </p>
                        </div>
                        
                        <Button 
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          variant="outline"
                          className="mt-6 w-full rounded-xl font-bold gap-2 border-white/10 hover:bg-white/5"
                        >
                          <Upload className="w-4 h-4" /> CHANGE AVATAR
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="border-white/5 bg-panel/5 backdrop-blur-xl rounded-3xl p-6">
                       <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">ID Verified</span>
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                          </div>
                          <Separator className="bg-white/5" />
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Joined</span>
                            <span className="text-xs font-bold font-mono">{new Date(user.created_at || "").toLocaleDateString()}</span>
                          </div>
                       </div>
                    </Card>
                  </div>

                  {/* Right Column: Editor */}
                  <div className="md:col-span-2">
                    <Card className="border-white/5 bg-panel/5 backdrop-blur-xl rounded-3xl h-full flex flex-col">
                      <CardHeader className="pb-2">
                         <CardTitle className="text-xl font-black italic flex items-center gap-2">
                            <PenLine className="w-5 h-5 text-primary" /> EDIT PROTOCOL
                         </CardTitle>
                         <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-50">Modify your public identifiers</CardDescription>
                      </CardHeader>
                      
                      <CardContent className="flex-1 space-y-8 pt-6">
                        <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Alias / Nickname</Label>
                          <div className="relative">
                             <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                             <Input 
                               value={nickname}
                               onChange={(e) => setNickname(e.target.value)}
                               placeholder="Enter your callsign..."
                               className="h-14 pl-12 rounded-2xl bg-white/5 border-white/5 focus:border-primary/50 focus:ring-primary/20 transition-all font-bold italic"
                             />
                          </div>
                          <p className="text-[10px] text-muted-foreground/60 px-1">Visible on leaderboards and in multiplayer rooms.</p>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Mission Objective (Bio)</Label>
                          <div className="relative">
                             <FileText className="absolute left-4 top-5 w-4 h-4 text-muted-foreground" />
                             <textarea 
                               value={bio}
                               onChange={(e) => setBio(e.target.value)}
                               placeholder="Tell the world your goals..."
                               className="w-full min-h-[160px] p-4 pl-12 rounded-2xl bg-white/5 border-white/5 focus:border-primary/50 focus:ring-primary/20 transition-all font-medium text-sm text-foreground resize-none"
                             />
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="p-8 bg-white/[0.02] border-t border-white/5">
                        <Button 
                          onClick={handleSave}
                          disabled={isSaving}
                          className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black italic tracking-widest shadow-xl shadow-primary/20 gap-3 text-lg"
                        >
                          {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                          INITIALIZE UPDATE
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
               </div>
            </TabsContent>

            <TabsContent value="friends" className="mt-0">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.98 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="grid grid-cols-1 gap-8"
               >
                 <FriendsPanel />
               </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}
