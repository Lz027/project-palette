import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useFocus } from '@/contexts/FocusContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SpinningFocusWheel } from '@/components/features/SpinningFocusWheel';
import { FocusChangeOverlay } from '@/components/features/FocusChangeOverlay';
import { useFocusSound } from '@/hooks/useFocusSound';

export function MobileTopBar() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { user } = useAuth();
  const { pendingModeChange, confirmModeChange } = useFocus();
  const { playFocusSound } = useFocusSound();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleModeChangeComplete = () => {
    confirmModeChange();
  };

  // Play sound when mode change is triggered
  React.useEffect(() => {
    if (pendingModeChange) {
      playFocusSound(pendingModeChange);
    }
  }, [pendingModeChange, playFocusSound]);

  return (
    <>
      <FocusChangeOverlay 
        targetMode={pendingModeChange} 
        onComplete={handleModeChangeComplete} 
      />
      
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border/50 safe-area-pt">
        <div className="flex items-center justify-between h-14 px-3">
          {/* Left: Notifications & Theme */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="text-muted-foreground relative h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground h-8 w-8">
                  {resolvedTheme === 'dark' ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  <Sun className="h-4 w-4 mr-2" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  <Moon className="h-4 w-4 mr-2" />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  <Monitor className="h-4 w-4 mr-2" />
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right: Focus Wheel + Profile (grouped together) */}
          <div className="flex items-center gap-2">
            <SpinningFocusWheel size="compact" />
            
            {user && (
              <Link to="/profile">
                <Avatar className="h-8 w-8 border-2 border-primary/20 cursor-pointer hover:border-primary/40 transition-colors">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
