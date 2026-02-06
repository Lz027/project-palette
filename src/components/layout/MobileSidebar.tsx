import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  ChevronRight,
  ChevronLeft,
  Lightbulb,
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

const quickTips = [
  "Tap icons to navigate quickly",
  "Expand to see workspace names",
  "Long press for quick actions",
];

export function MobileSidebar() {
  const [expanded, setExpanded] = useState(false);
  const { boards } = useBoards();
  const { focusMode } = useFocus();

  useEffect(() => {
    const handleToggle = () => setExpanded(prev => !prev);
    window.addEventListener('toggle-sidebar', handleToggle);
    return () => window.removeEventListener('toggle-sidebar', handleToggle);
  }, []);

  useEffect(() => {
    if (expanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [expanded]);

  const favoriteBoards = boards.filter(b => b.isFavorite).slice(0, 5);

  const getCreateIcon = () => {
    switch (focusMode) {
      case 'tech': return Code;
      case 'design': return Palette;
      default: return Briefcase;
    }
  };

  const CreateIcon = getCreateIcon();

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

  // Icons-only sidebar (permanent)
  const IconsOnlySidebar = () => (
    <aside className="fixed left-0 top-14 bottom-0 w-16 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-4 gap-2 z-30 md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setExpanded(true)}
        className="h-10 w-10 rounded-xl mb-2 hover:bg-sidebar-accent"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      {mainNavItems.map((item) => (
        <NavLink
          key={item.title}
          to={item.url}
          className="h-10 w-10 rounded-xl flex items-center justify-center hover:bg-sidebar-accent active:scale-95 transition-colors"
          activeClassName="bg-sidebar-accent text-sidebar-primary"
        >
          <item.icon className="h-5 w-5" />
        </NavLink>
      ))}

      <NavLink
        to="/boards/new"
        className="h-10 w-10 rounded-xl flex items-center justify-center bg-primary/10 text-primary hover:bg-primary/20 active:scale-95 transition-colors mt-2"
      >
        <Plus className="h-5 w-5" />
      </NavLink>

      <div className="flex-1" />

      <a
        href="https://shoseki.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        className="h-10 w-10 rounded-xl flex items-center justify-center bg-black dark:bg-white hover:opacity-80 transition-opacity"
      >
        <img src={shosekiLogo} alt="Shoseki" className="h-6 w-6 object-contain rounded" />
      </a>

      <NavLink
        to="/profile"
        className="h-10 w-10 rounded-xl flex items-center justify-center hover:bg-sidebar-accent active:scale-95 transition-colors"
        activeClassName="bg-sidebar-accent"
      >
        <User className="h-5 w-5" />
      </NavLink>

      <NavLink
        to="/settings"
        className="h-10 w-10 rounded-xl flex items-center justify-center hover:bg-sidebar-accent active:scale-95 transition-colors"
        activeClassName="bg-sidebar-accent"
      >
        <Settings className="h-5 w-5" />
      </NavLink>
    </aside>
  );

  // Expanded sidebar (overlay)
  const ExpandedSidebar = () => (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={() => setExpanded(false)}
      />
      <aside className="fixed left-0 top-0 h-full w-72 bg-sidebar border-r border-sidebar-border flex flex-col z-50 md:hidden">
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <Link to="/dashboard" onClick={() => setExpanded(false)} className="flex items-center gap-3">
            <img src={paletteLogo} alt="Palette" className="w-10 h-10 rounded-xl object-cover" />
            <div>
              <span className="font-bold text-lg">Palette</span>
              <p className="text-xs text-muted-foreground">Creative Workspace</p>
            </div>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setExpanded(false)} className="h-8 w-8">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4">
            <NavLink
              to="/boards/new"
              onClick={() => setExpanded(false)}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg active:scale-95 transition-all"
            >
              <Plus className="h-5 w-5" />
              <span>New Workspace</span>
            </NavLink>
          </div>

          <nav className="px-3 space-y-1">
            {mainNavItems.map((item) => (
              <NavLink
                key={item.title}
                to={item.url}
                onClick={() => setExpanded(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-sidebar-accent active:scale-95 transition-colors"
                activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span className="text-sm">{item.title}</span>
              </NavLink>
            ))}
          </nav>

          {favoriteBoards.length > 0 && (
            <div className="px-3 mt-4">
              <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Favorites
              </p>
              <div className="space-y-1">
                {favoriteBoards.map((board) => (
                  <NavLink
                    key={board.id}
                    to={`/boards/${board.id}`}
                    onClick={() => setExpanded(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent active:scale-95 transition-colors"
                    activeClassName="bg-sidebar-accent"
                  >
                    <div className={cn("w-3 h-3 rounded-sm shrink-0", getBoardColorClass(board.color))} />
                    <span className="text-sm truncate">{board.name}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          )}

          <div className="px-3 mt-6">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Quick Tips
            </p>
            <div className="space-y-2">
              {quickTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
                  <Lightbulb className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>

        <div className="p-3 border-t border-sidebar-border">
          <a
            href="https://shoseki.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black transition-colors"
          >
            <img src={shosekiLogo} alt="Shoseki" className="w-8 h-8 object-contain rounded-lg" />
            <div className="flex flex-col">
              <span className="text-sm font-bold">Shoseki</span>
              <span className="text-xs opacity-80">AI Tools Directory</span>
            </div>
          </a>
        </div>

        <div className="border-t border-sidebar-border p-3 space-y-1">
          <NavLink
            to="/profile"
            onClick={() => setExpanded(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent active:scale-95 transition-colors"
            activeClassName="bg-sidebar-accent"
          >
            <User className="h-5 w-5 shrink-0" />
            <span className="text-sm">Profile</span>
          </NavLink>
          <NavLink
            to="/settings"
            onClick={() => setExpanded(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent active:scale-95 transition-colors"
            activeClassName="bg-sidebar-accent"
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
      <IconsOnlySidebar />
      {expanded && <ExpandedSidebar />}
    </>
  );
}
