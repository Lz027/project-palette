import React, { useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBoards } from '@/contexts/BoardContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { LogOut, Camera, FolderKanban, Calendar, Loader2, Save, ImagePlus } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { displayNameSchema, bioSchema, validateInput, INPUT_LIMITS } from '@/lib/validation';

export default function ProfilePage() {
  const { user, logout, uploadAvatar } = useAuth();
  const { boards } = useBoards();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isBannerUploading, setIsBannerUploading] = useState(false);
  const [displayName, setDisplayName] = useState(() => {
    return (user?.name || '').slice(0, INPUT_LIMITS.DISPLAY_NAME);
  });
  const [bio, setBio] = useState(() => {
    const saved = localStorage.getItem('palette-profile-bio');
    return (saved || '').slice(0, INPUT_LIMITS.BIO);
  });
  const [bannerUrl, setBannerUrl] = useState<string | null>(() => {
    return localStorage.getItem('palette-profile-banner');
  });

  if (!user) return null;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const totalCards = boards.reduce((acc, b) => 
    acc + b.columns.reduce((colAcc, c) => colAcc + c.cards.length, 0), 0
  );

  const handleAvatarClick = () => {
    avatarInputRef.current?.click();
  };

  const handleBannerClick = () => {
    bannerInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadAvatar(file);
      if (url) {
        toast.success('Profile picture updated!');
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setIsBannerUploading(true);
    try {
      // For banner, we'll store it locally for now
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setBannerUrl(url);
        localStorage.setItem('palette-profile-banner', url);
        toast.success('Banner updated!');
        setIsBannerUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Failed to upload banner');
      setIsBannerUploading(false);
    }
  };

  const handleSaveProfile = () => {
    // Validate display name
    const nameValidation = validateInput(displayNameSchema, displayName);
    if (!nameValidation.success) {
      toast.error('error' in nameValidation ? nameValidation.error : 'Invalid display name');
      return;
    }
    
    // Validate bio
    const bioValidation = validateInput(bioSchema, bio);
    if (!bioValidation.success) {
      toast.error('error' in bioValidation ? bioValidation.error : 'Invalid bio');
      return;
    }
    
    localStorage.setItem('palette-profile-bio', bioValidation.data);
    toast.success('Profile saved!');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8">
      {/* Banner & Avatar Section */}
      <div className="relative">
        {/* Banner */}
        <div 
          className={cn(
            "relative w-full h-32 sm:h-48 rounded-xl overflow-hidden cursor-pointer group",
            !bannerUrl && "bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30"
          )}
          onClick={handleBannerClick}
        >
          {bannerUrl && (
            <img 
              src={bannerUrl} 
              alt="Profile banner" 
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            {isBannerUploading ? (
              <Loader2 className="h-8 w-8 text-foreground animate-spin" />
            ) : (
              <div className="flex flex-col items-center gap-1 text-foreground">
                <ImagePlus className="h-6 w-6" />
                <span className="text-xs font-medium">Change Banner</span>
              </div>
            )}
          </div>
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/*"
            onChange={handleBannerChange}
            className="hidden"
          />
        </div>

        {/* Avatar - Overlapping banner */}
        <div className="absolute -bottom-12 left-4 sm:left-6">
          <div className="relative group">
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-2xl font-bold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <button 
              onClick={handleAvatarClick}
              disabled={isUploading}
              className="absolute inset-0 flex items-center justify-center bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer"
            >
              {isUploading ? (
                <Loader2 className="h-6 w-6 text-foreground animate-spin" />
              ) : (
                <Camera className="h-6 w-6 text-foreground" />
              )}
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-14 px-1">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <FolderKanban className="h-4 w-4" />
              {boards.length} boards
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {totalCards} cards
            </span>
          </div>
        </div>
      </div>

      {/* Edit Profile */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="font-display text-lg">Edit Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="displayName">Display Name</Label>
              <Input 
                id="displayName" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value.slice(0, INPUT_LIMITS.DISPLAY_NAME))}
                maxLength={INPUT_LIMITS.DISPLAY_NAME}
                className="mt-1" 
              />
              <p className="text-xs text-muted-foreground mt-1">
                {displayName.length}/{INPUT_LIMITS.DISPLAY_NAME}
              </p>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={user.email} 
                disabled 
                className="mt-1" 
              />
              <p className="text-xs text-muted-foreground mt-1">
                Email cannot be changed
              </p>
            </div>
          </div>
          
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea 
              id="bio" 
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, INPUT_LIMITS.BIO))}
              maxLength={INPUT_LIMITS.BIO}
              placeholder="Tell us about yourself..."
              className="mt-1 min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {bio.length}/{INPUT_LIMITS.BIO}
            </p>
          </div>

          <Button onClick={handleSaveProfile} className="gradient-primary text-primary-foreground">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Stats */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="font-display text-lg">Your Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-primary">{boards.length}</p>
              <p className="text-xs text-muted-foreground">Boards</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-secondary">{totalCards}</p>
              <p className="text-xs text-muted-foreground">Cards</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-accent">
                {boards.filter(b => b.isFavorite).length}
              </p>
              <p className="text-xs text-muted-foreground">Favorites</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-board-rose">
                {boards.reduce((acc, b) => acc + b.columns.length, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Columns</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sign Out */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <p className="font-medium text-destructive">Sign Out</p>
              <p className="text-sm text-muted-foreground">
                Sign out of your account
              </p>
            </div>
            <Button variant="destructive" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}