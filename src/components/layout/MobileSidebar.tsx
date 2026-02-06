import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Star,
  Settings,
  User,
  Code,
  Palette,
  Briefcase,
  Plus,
  PanelLeft,
  X,
  Lightbulb,
  Zap,
  Target,
  Coffee,
  PenTool,
  Terminal,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import paletteLogo from '@/assets/palette-logo.jpeg';
import shosekiLogo from '@/assets/shoseki-logo.png';
import { useBoards } from '@/contexts/BoardContext';
import { useFocus } from '@/contexts/FocusContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const mainNavItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Workspaces', url: '/boards', icon: FolderKanban },
  { title: 'Favorites', url: '/favorites', icon: Star },
];

// Focus-specific tips
const focusTips = {
  productive: [
    { icon: Coffee, text: "Take breaks every 25 minutes" },
    { icon: Target, text: "Set 3 priorities for today" },
  ],
  tech: [
    { icon: Terminal, text: "Commit code before switching tasks" },
    { icon: Zap, text: "Test your changes frequently" },
  ],
  design: [
    { icon: PenTool, text: "Save versions as you iterate" },
    { icon: Palette, text: "Check contrast ratios" },
  ],
};

// Focus-specific create button
const focusCreate = {
  productive: { icon: Briefcase, label: 'New Workspace' },
  tech: { icon: Code, label: 'New Project' },
  design: { icon: Palette, label: 'New Design' },
};

export function MobileSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { boards } = useBoards();
  const { focusMode } = useFocus();
  const location = useLocation();

  useEffect(() => {
    setIsCollapsed(true);
  }, [location.pathname]);

  const favoriteBoards = boards.filter(b => b.isFavorite).slice(0, 5);
  const currentTips = focusTips[focusMode] || focusTips.productive;
  const createConfig = focusCreate[focusMode] || focusCreate.productive;
  const CreateIcon = createConfig.icon;

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

  // Collapsed sidebar
  const CollapsedBar = () => (
    <aside className="fixed left-0 top-14 bottom-0 w-14 bg-background border-r border-border flex flex-col items-center py-3 gap-1 z-30 md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsCollapsed(false)}
        className="h-9 w-9 rounded-lg mb-2 text-muted-foreground hover:text-foreground hover:bg-muted"
      >
        <PanelLeft className="h-5 w-5" />
      </Button>

      {mainNavItems.map((item) => (
        <NavLink
          key={item.title}
          to={item.url}
          className={cn(
            "h-9 w-9 rounded-lg flex items-center justify-center transition-all",
            "text-muted-foreground hover:text-foreground hover:bg-muted",
            "active:scale-95"
          )}
          activeClassName="bg-primary/10 text-primary"
        >
          <item.icon className="h-[18px] w-[18px]" />
        </NavLink>
      ))}

      <NavLink
        to="/boards/new"
        className="h-9 w-9 rounded-lg flex items-center justify-center bg-primary/10 text-primary hover:bg-primary/20 active:scale-95 transition-colors mt-2"
      >
        <Plus className="h-[18px] w-[18px]" />
      </NavLink>

      <div className="flex-1" />

      <a
        href="https://shoseki.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        className="h-9 w-9 rounded-lg flex items-center justify-center bg-black dark:bg-white text-white dark:text-black hover:opacity-80 transition-opacity mb-1"
      >
        <img src={shosekiLogo} alt="Shoseki" className="h-5 w-5 object-contain rounded" />
      </a>

      <NavLink
        to="/profile"
        className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-colors"
        activeClassName="bg-primary/10 text-primary"
      >
        <User className="h-[18px] w-[18px]" />
      </NavLink>

      <NavLink
        to="/settings"
        className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-colors"
        activeClassName="bg-primary/10 text-primary"
      >
        <Settings className="h-[18px] w-[18px]" />
      </NavLink>
    </aside>
  );

  // Expanded sidebar
  const ExpandedSidebar = () => (
    <>
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
        onClick={() => setIsCollapsed(true)}
      />
      <aside className="fixed left-0 top-0 h-full w-64 bg-background border-r border-border flex flex-col z-50 md:hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Link to="/dashboard" className="flex items-center gap-3">
            <img src={paletteLogo} alt="PALETTE" className="w-9 h-9 rounded-xl object-cover" />
            <div>
              <span className="font-bold text-lg tracking-tight">PALETTE</span>
            </div>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsCollapsed(true)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1 px-3 py-2">
          {/* Dynamic Create Button */}
          <NavLink
            to="/boards/new"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium mb-4 active:scale-95 transition-all shadow-sm"
          >
            <CreateIcon className="h-5 w-5" />
            <span>{createConfig.label}</span>
          </NavLink>

          {/* Main Nav */}
          <nav className="space-y-0.5">
            {mainNavItems.map((item) => (
              <NavLink
                key={item.title}
                to={item.url}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-colors"
                activeClassName="bg-muted text-foreground font-medium"
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span className="text-sm">{item.title}</span>
              </NavLink>
            ))}
          </nav>

          {/* Favorites */}
          {favoriteBoards.length > 0 && (
            <div className="mt-6">
              <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Favorites
              </p>
              <div className="space-y-0.5">
                {favoriteBoards.map((board) => (
                  <NavLink
                    key={board.id}
                    to={`/boards/${board.id}`}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-colors"
                    activeClassName="bg-muted text-foreground"
                  >
                    <div className={cn("w-2 h-2 rounded-full shrink-0", getBoardColorClass(board.color))} />
                    <span className="text-sm truncate">{board.name}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          )}

          {/* Focus Tips - 2 tips only */}
          <div className="mt-6">
            <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              {focusMode.charAt(0).toUpperCase() + focusMode.slice(1)} Tips
            </p>
            <div className="space-y-2">
              {currentTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
                  <tip.icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Space reserved for Ko-fi (future) */}
          <div className="mt-4 h-16 rounded-lg border-2 border-dashed border-muted flex items-center justify-center">
            <span className="text-xs text-muted-foreground"></span>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 border-t border-border space-y-0.5">
          <a
            href="https://shoseki.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-black dark:bg-white text-white dark:text-black transition-colors mb-2"
          >
            <img src={shosekiLogo} alt="Shoseki" className="w-6 h-6 object-contain rounded" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Shoseki</span>
              <span className="text-[10px] opacity-80">AI Directory</span>
            </div>
          </a>
          
          <NavLink
            to="/profile"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-colors"
            activeClassName="bg-muted text-foreground"
          >
            <User className="h-5 w-5 shrink-0" />
            <span className="text-sm">Profile</span>
          </NavLink>
          
          <NavLink
            to="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-colors"
            activeClassName="bg-muted text-foreground"
          >
            <Settings className="h-5 w-5 shrink-0" />
            <span className="text-sm">Settings</span>
          </NavLink>
        </div>
      </aside>
    </>
  );

  return (
    <>
      {isCollapsed ? <CollapsedBar /> : <ExpandedSidebar />}
    </>
  );
}
