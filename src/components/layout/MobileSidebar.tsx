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

const mainNavItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Boards', url: '/boards', icon: FolderKanban },
  { title: 'Favorites', url: '/favorites', icon: Star },
];

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState(true); // Always expanded when open
  const { boards } = useBoards();
  const { focusMode } = useFocus();

  // Listen for toggle event from MobileTopBar
  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    window.addEventListener('toggle-sidebar', handleToggle);
    return () => window.removeEventListener('toggle-sidebar', handleToggle);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const favoriteBoards = boards.filter(b => b.isFavorite).slice(0, 5);

  const getCreateAction = () => {
    switch (focusMode) {
      case 'tech':
        return { icon: Code, label: 'New Project', url: '/boards/new' };
      case 'design':
        return { icon: Palette, label: 'New Design', url: '/boards/new' };
      default:
        return { icon: Briefcase, label: 'New Board', url: '/boards/new' };
    }
  };

  const createAction = getCreateAction();

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

  return (
    <>
      {/* OVERLAY BACKDROP - closes sidebar when clicked */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* SLIDING SIDEBAR */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border flex flex-col z-50 transition-transform duration-300 ease-out md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
          expanded ? "w-64" : "w-64" // Always full width on mobile
        )}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between p-3 border-b border-sidebar-border">
          <Link to="/dashboard" onClick={() => setIsOpen(false)}>
            <div className="flex items-center gap-2">
              <img
                src={paletteLogo}
                alt="Palette"
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="font-semibold text-lg">Palette</span>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          {/* Main Nav */}
          <nav className="flex flex-col gap-1 px-3 py-2">
            {mainNavItems.map((item) => (
              <NavLink
                key={item.title}
                to={item.url}
                onClick={() => setIsOpen(false)} // Close on navigate
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-sidebar-accent active:scale-95 transition-colors"
                activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span className="text-sm">{item.title}</span>
              </NavLink>
            ))}
          </nav>

          {/* Create Action */}
          <div className="px-3 py-2">
            <NavLink
              to={createAction.url}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium active:scale-95 transition-colors"
            >
              <createAction.icon className="h-5 w-5" />
              <span className="text-sm">{createAction.label}</span>
            </NavLink>
          </div>

          {/* Favorites */}
          {favoriteBoards.length > 0 && (
            <div className="px-3 py-2">
              <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Favorites
              </p>
              {favoriteBoards.map((board) => (
                <NavLink
                  key={board.id}
                  to={`/boards/${board.id}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent active:scale-95 transition-colors"
                  activeClassName="bg-sidebar-accent"
                >
                  <div className={cn("w-3 h-3 rounded-sm shrink-0", getBoardColorClass(board.color))} />
                  <span className="text-sm truncate">{board.name}</span>
                </NavLink>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Shoseki */}
        <div className="px-3 py-2 border-t border-sidebar-border">
          <a
            href="https://shoseki.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors"
          >
            <img src={shosekiLogo} alt="Shoseki" className="w-6 h-6 object-contain" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">Shoseki</span>
              <span className="text-xs text-muted-foreground">AI Directory</span>
            </div>
          </a>
        </div>

        {/* Footer nav */}
        <div className="border-t border-sidebar-border px-3 py-2 flex flex-col gap-1">
          {[
            { icon: User, title: 'Profile', url: '/profile' },
            { icon: Settings, title: 'Settings', url: '/settings' },
          ].map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent active:scale-95 transition-colors"
              activeClassName="bg-sidebar-accent"
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className="text-sm">{item.title}</span>
            </NavLink>
          ))}
        </div>
      </aside>
    </>
  );
}
