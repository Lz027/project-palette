import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Star, 
  Settings, 
  Plus,
  ChevronRight,
  User,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useBoards } from '@/contexts/BoardContext';
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

const mainNavItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'All Boards', url: '/boards', icon: FolderKanban },
  { title: 'Favorites', url: '/favorites', icon: Star },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
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

  return (
    <Sidebar 
      className={cn(
        "border-r border-sidebar-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
      collapsible="icon"
    >
      <SidebarHeader className="p-4">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">P</span>
          </div>
          {!collapsed && (
            <span className="font-display font-bold text-lg text-gradient">
              Palette
            </span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <ScrollArea className="h-[calc(100vh-180px)]">
          {/* Main Navigation */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                        activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Create New Board Button */}
          <div className="px-2 py-3">
            <Button 
              asChild 
              className={cn(
                "w-full gradient-primary text-primary-foreground",
                collapsed && "px-0 justify-center"
              )}
              size={collapsed ? "icon" : "default"}
            >
              <Link to="/boards/new">
                <Plus className="h-4 w-4" />
                {!collapsed && <span className="ml-2">New Board</span>}
              </Link>
            </Button>
          </div>

          {/* Favorite Boards */}
          {!collapsed && favoriteBoards.length > 0 && (
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
          {!collapsed && recentBoards.length > 0 && (
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

      <SidebarFooter className="p-2 border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink 
                to="/profile"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent"
                activeClassName="bg-sidebar-accent"
              >
                <User className="h-5 w-5 shrink-0" />
                {!collapsed && <span>Profile</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink 
                to="/settings"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent"
                activeClassName="bg-sidebar-accent"
              >
                <Settings className="h-5 w-5 shrink-0" />
                {!collapsed && <span>Settings</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
