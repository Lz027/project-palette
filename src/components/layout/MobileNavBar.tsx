import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Star, Plus, User } from 'lucide-react';
import { useFocus } from '@/contexts/FocusContext';
import { cn } from '@/lib/utils';

const navItems = [
  { title: 'Home', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Boards', url: '/boards', icon: FolderKanban },
  { title: 'Create', url: '/boards/new', icon: Plus, isCreate: true },
  { title: 'Favorites', url: '/favorites', icon: Star },
  { title: 'Profile', url: '/profile', icon: User },
];

export function MobileNavBar() {
  const location = useLocation();
  const { colors } = useFocus();
  
  const isActive = (url: string) => location.pathname === url;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border safe-area-pb">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const active = isActive(item.url);
          
          if (item.isCreate) {
            return (
              <Link
                key={item.title}
                to={item.url}
                className="flex flex-col items-center justify-center -mt-4"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full gradient-primary text-primary-foreground shadow-lg active:scale-95 transition-transform touch-manipulation">
                  <item.icon className="h-5 w-5" />
                </div>
              </Link>
            );
          }
          
          return (
            <Link
              key={item.title}
              to={item.url}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors touch-manipulation active:opacity-70",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", active && "text-primary")} />
              <span className={cn("text-[10px] font-medium", active && "text-primary")}>{item.title}</span>
              {active && (
                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
