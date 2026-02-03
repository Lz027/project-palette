import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Star, 
  Settings, 
  Plus,
  User,
  X,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import paletteLogo from '@/assets/palette-logo.jpeg';
import shosekiLogo from '@/assets/shoseki-logo.png';
import { useBoards } from '@/contexts/BoardContext';
import { useFocus } from '@/contexts/FocusContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { FocusWheel } from '@/components/features/FocusWheel';

const mainNavItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'All Boards', url: '/boards', icon: FolderKanban },
  { title: 'Favorites', url: '/favorites', icon: Star },
];

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileSidebar({ open, onOpenChange }: MobileSidebarProps) {
  const location = useLocation();
  const { boards } = useBoards();
  const { colors } = useFocus();

  const favoriteBoards = boards.filter(b => b.isFavorite).slice(0, 5);
  const recentBoards = boards.slice(-5).reverse();

  const getBoardColorClass = (color: string) => {
    const colors: Record<string, string> = {
      coral: 'bg-board-coral',
      lavender: 'bg-board-lavender',
      mint: 'bg-board-mint',
      sky: 'bg-board-sky',
      peach: 'bg-board-peach',
      rose: 'bg-board-rose',
    };
    return colors[color] || 'bg-primary';
  };

  const handleLinkClick = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-0 bg-sidebar">
        <SheetHeader className="p-4 border-b border-sidebar-border">
          <SheetTitle className="flex items-center gap-3">
            <img 
              src={paletteLogo} 
              alt="Palette" 
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span className="font-display font-bold text-lg text-gradient">
              Palette
            </span>
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="p-4 space-y-4">
            {/* Focus Wheel */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
              <FocusWheel compact />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium text-foreground">{colors.name} Mode</p>
                <p>Tap to switch</p>
              </div>
            </div>

            {/* Main Navigation */}
            <nav className="space-y-1">
              {mainNavItems.map((item) => (
                <NavLink 
                  key={item.title}
                  to={item.url} 
                  onClick={handleLinkClick}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                  activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span>{item.title}</span>
                </NavLink>
              ))}
            </nav>

            {/* Create New Board Button */}
            <Button 
              asChild 
              className="w-full gradient-primary text-primary-foreground"
            >
              <Link to="/boards/new" onClick={handleLinkClick}>
                <Plus className="h-4 w-4 mr-2" />
                {colors.createLabel}
              </Link>
            </Button>

            {/* Favorite Boards */}
            {favoriteBoards.length > 0 && (
              <div>
                <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Favorites
                </p>
                <div className="space-y-1">
                  {favoriteBoards.map((board) => (
                    <NavLink 
                      key={board.id}
                      to={`/boards/${board.id}`}
                      onClick={handleLinkClick}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent"
                    >
                      <div className={cn(
                        "w-3 h-3 rounded-sm shrink-0",
                        getBoardColorClass(board.color)
                      )} />
                      <span className="truncate text-sm">{board.name}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Boards */}
            {recentBoards.length > 0 && (
              <div>
                <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Recent
                </p>
                <div className="space-y-1">
                  {recentBoards.map((board) => (
                    <NavLink 
                      key={board.id}
                      to={`/boards/${board.id}`}
                      onClick={handleLinkClick}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent"
                    >
                      <div className={cn(
                        "w-3 h-3 rounded-sm shrink-0",
                        getBoardColorClass(board.color)
                      )} />
                      <span className="truncate text-sm">{board.name}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border bg-sidebar space-y-2">
          {/* Shoseki AI Directory */}
          <a
            href="https://shoseki.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-foreground"
          >
            <img 
              src={shosekiLogo} 
              alt="Shoseki" 
              className="w-5 h-5 object-contain"
            />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-background">Shoseki AI</span>
            </div>
          </a>

          <div className="flex gap-2">
            <NavLink 
              to="/profile"
              onClick={handleLinkClick}
              className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-sidebar-accent text-sm"
              activeClassName="bg-sidebar-accent"
            >
              <User className="h-4 w-4" />
              Profile
            </NavLink>
            <NavLink 
              to="/settings"
              onClick={handleLinkClick}
              className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-sidebar-accent text-sm"
              activeClassName="bg-sidebar-accent"
            >
              <Settings className="h-4 w-4" />
              Settings
            </NavLink>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
