import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Star, 
  Settings, 
  Plus,
  User,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import paletteLogo from '@/assets/palette-logo.jpeg';
import shosekiLogo from '@/assets/shoseki-logo.png';
import { useBoards } from '@/contexts/BoardContext';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const mainNavItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Boards', url: '/boards', icon: FolderKanban },
  { title: 'Favorites', url: '/favorites', icon: Star },
  { title: 'New', url: '/boards/new', icon: Plus },
];

export function AppSidebar() {
  const { open, setOpen } = useSidebar();
  const isMobile = useIsMobile();
  const location = useLocation();
  const { boards } = useBoards();

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

  const NavItem = ({ item }: { item: typeof mainNavItems[0] }) => {
    const content = (
      <NavLink 
        to={item.url} 
        className={cn(
          "flex items-center gap-3 rounded-lg transition-colors touch-manipulation",
          !open ? "justify-center p-2.5" : "px-3 py-2.5",
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          "active:scale-95"
        )}
        activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
      >
        <item.icon className="h-5 w-5 shrink-0" />
        {open && <span className="text-sm">{item.title}</span>}
      </NavLink>
    );

    if (!open) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={10}>
            {item.title}
          </TooltipContent>
        </Tooltip>
      );
    }

    return content;
  };

  return (
    <Sidebar 
      className={cn(
        "border-r border-sidebar-border bg-sidebar transition-all duration-300 relative",
        open ? "w-56" : "w-14"
      )}
      collapsible="icon"
    >
      {/* Toggle button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        className={cn(
          "absolute -right-3 top-4 z-50 h-6 w-6 rounded-full border border-border bg-background shadow-sm",
          "hover:bg-muted transition-colors"
        )}
      >
        {open ? (
          <ChevronLeft className="h-3 w-3" />
        ) : (
          <ChevronRight className="h-3 w-3" />
        )}
      </Button>

      <SidebarHeader className={cn("p-3", !open && "p-2")}>
        <Link to="/dashboard" className="flex items-center justify-center">
          <img 
            src={paletteLogo} 
            alt="Palette" 
            className={cn(
              "rounded-lg object-cover transition-all",
              !open ? "w-8 h-8" : "w-10 h-10"
            )}
          />
        </Link>
      </SidebarHeader>

      <SidebarContent className={cn("px-2", !open && "px-1")}>
        <ScrollArea className="h-[calc(100vh-200px)]">
          {/* Main Navigation */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavItem item={item} />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Favorite Boards */}
          {open && favoriteBoards.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Favorites
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {favoriteBoards.map((board) => (
                    <SidebarMenuItem key={board.id}>
                      <SidebarMenuButton asChild>
                        <NavLink 
                          to={`/boards/${board.id}`}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent"
                          activeClassName="bg-sidebar-accent"
                        >
                          <div className={cn(
                            "w-3 h-3 rounded-sm shrink-0",
                            getBoardColorClass(board.color)
                          )} />
                          <span className="truncate text-sm">{board.name}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {/* Recent Boards */}
          {open && recentBoards.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Recent
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {recentBoards.map((board) => (
                    <SidebarMenuItem key={board.id}>
                      <SidebarMenuButton asChild>
                        <NavLink 
                          to={`/boards/${board.id}`}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent"
                          activeClassName="bg-sidebar-accent"
                        >
                          <div className={cn(
                            "w-3 h-3 rounded-sm shrink-0",
                            getBoardColorClass(board.color)
                          )} />
                          <span className="truncate text-sm">{board.name}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </ScrollArea>
      </SidebarContent>

      {/* Shoseki AI Directory */}
      {open && (
        <div className="px-2 mb-2">
          <a
            href="https://shoseki.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-3 rounded-lg bg-black transition-all hover:opacity-90"
          >
            <img 
              src={shosekiLogo} 
              alt="Shoseki" 
              className="w-6 h-6 object-contain"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">Shoseki</span>
              <span className="text-xs text-white/70">AI Directory</span>
            </div>
          </a>
        </div>
      )}

      <SidebarFooter className={cn("p-2 border-t border-sidebar-border", !open && "p-1")}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              {!open ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <NavLink 
                      to="/profile"
                      className="flex items-center justify-center p-2.5 rounded-lg hover:bg-sidebar-accent touch-manipulation active:scale-95"
                      activeClassName="bg-sidebar-accent"
                    >
                      <User className="h-5 w-5 shrink-0" />
                    </NavLink>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={10}>Profile</TooltipContent>
                </Tooltip>
              ) : (
                <NavLink 
                  to="/profile"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent touch-manipulation active:scale-95"
                  activeClassName="bg-sidebar-accent"
                >
                  <User className="h-5 w-5 shrink-0" />
                  <span className="text-sm">Profile</span>
                </NavLink>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              {!open ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <NavLink 
                      to="/settings"
                      className="flex items-center justify-center p-2.5 rounded-lg hover:bg-sidebar-accent touch-manipulation active:scale-95"
                      activeClassName="bg-sidebar-accent"
                    >
                      <Settings className="h-5 w-5 shrink-0" />
                    </NavLink>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={10}>Settings</TooltipContent>
                </Tooltip>
              ) : (
                <NavLink 
                  to="/settings"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent touch-manipulation active:scale-95"
                  activeClassName="bg-sidebar-accent"
                >
                  <Settings className="h-5 w-5 shrink-0" />
                  <span className="text-sm">Settings</span>
                </NavLink>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
