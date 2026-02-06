import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Star,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  Code,
  Palette,
  Briefcase,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import paletteLogo from '@/assets/palette-logo.jpeg';
import shosekiLogo from '@/assets/shoseki-logo.png';
import { useBoards } from '@/contexts/BoardContext';
import { useFocus } from '@/contexts/FocusContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';

const mainNavItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Boards', url: '/boards', icon: FolderKanban },
  { title: 'Favorites', url: '/favorites', icon: Star },
];

export function MobileSidebar() {
  const [expanded, setExpanded] = useState(false);
  const { boards } = useBoards();
  const { focusMode } = useFocus();

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
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "h-full bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-200 relative shrink-0 z-30",
          expanded ? "w-48" : "w-12"
        )}
      >
        {/* Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setExpanded(!expanded)}
          className="absolute -right-3 top-3 z-50 h-6 w-6 rounded-full border border-border bg-background shadow-sm hover:bg-muted touch-manipulation"
        >
          {expanded ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </Button>

        {/* Logo */}
        <div className={cn("p-2 flex justify-center", expanded && "p-3")}>
          <Link to="/dashboard">
            <img
              src={paletteLogo}
              alt="Palette"
              className={cn("rounded-lg object-cover", expanded ? "w-9 h-9" : "w-7 h-7")}
            />
          </Link>
        </div>

        <ScrollArea className="flex-1">
          {/* Main Nav */}
          <nav className="flex flex-col gap-1 px-1.5 py-1">
            {mainNavItems.map((item) => {
              const link = (
                <NavLink
                  key={item.title}
                  to={item.url}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg transition-colors touch-manipulation active:scale-95",
                    expanded ? "px-2.5 py-2" : "justify-center p-2"
                  )}
                  activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {expanded && <span className="text-sm truncate">{item.title}</span>}
                </NavLink>
              );

              if (!expanded) {
                return (
                  <Tooltip key={item.title}>
                    <TooltipTrigger asChild>{link}</TooltipTrigger>
                    <TooltipContent side="right" sideOffset={8}>{item.title}</TooltipContent>
                  </Tooltip>
                );
              }
              return <React.Fragment key={item.title}>{link}</React.Fragment>;
            })}
          </nav>

          {/* Create Action */}
          <div className="px-1.5 py-1">
            {!expanded ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <NavLink
                    to={createAction.url}
                    className="flex items-center justify-center p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary active:scale-95 touch-manipulation"
                  >
                    <createAction.icon className="h-5 w-5" />
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>{createAction.label}</TooltipContent>
              </Tooltip>
            ) : (
              <NavLink
                to={createAction.url}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium active:scale-95 touch-manipulation"
              >
                <createAction.icon className="h-5 w-5" />
                <span className="text-sm">{createAction.label}</span>
              </NavLink>
            )}
          </div>

          {/* Favorites */}
          {expanded && favoriteBoards.length > 0 && (
            <div className="px-1.5 py-1">
              <p className="px-2.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Favorites</p>
              {favoriteBoards.map((board) => (
                <NavLink
                  key={board.id}
                  to={`/boards/${board.id}`}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-sidebar-accent"
                  activeClassName="bg-sidebar-accent"
                >
                  <div className={cn("w-2.5 h-2.5 rounded-sm shrink-0", getBoardColorClass(board.color))} />
                  <span className="truncate text-xs">{board.name}</span>
                </NavLink>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Shoseki */}
        <div className={cn("px-1.5 pb-1", !expanded && "flex justify-center")}>
          {!expanded ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href="https://shoseki.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 touch-manipulation"
                >
                  <img src={shosekiLogo} alt="Shoseki" className="w-5 h-5 object-contain" />
                </a>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>Shoseki AI Directory</TooltipContent>
            </Tooltip>
          ) : (
            <a
              href="https://shoseki.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 touch-manipulation"
            >
              <img src={shosekiLogo} alt="Shoseki" className="w-5 h-5 object-contain" />
              <div className="flex flex-col">
                <span className="text-xs font-medium">Shoseki</span>
                <span className="text-[10px] text-muted-foreground">AI Directory</span>
              </div>
            </a>
          )}
        </div>

        {/* Footer nav */}
        <div className="border-t border-sidebar-border px-1.5 py-1.5 flex flex-col gap-1">
          {[
            { icon: User, title: 'Profile', url: '/profile' },
            { icon: Settings, title: 'Settings', url: '/settings' },
          ].map((item) => {
            const link = (
              <NavLink
                key={item.title}
                to={item.url}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg hover:bg-sidebar-accent touch-manipulation active:scale-95",
                  expanded ? "px-2.5 py-2" : "justify-center p-2"
                )}
                activeClassName="bg-sidebar-accent"
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {expanded && <span className="text-sm">{item.title}</span>}
              </NavLink>
            );

            if (!expanded) {
              return (
                <Tooltip key={item.title}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8}>{item.title}</TooltipContent>
                </Tooltip>
              );
            }
            return <React.Fragment key={item.title}>{link}</React.Fragment>;
          })}
        </div>
      </aside>
    </TooltipProvider>
  );
}
