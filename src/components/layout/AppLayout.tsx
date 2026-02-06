import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { MobileTopBar } from '@/components/layout/MobileTopBar';
import { TopBar } from '@/components/layout/TopBar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

function LayoutContent() {
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  const location = useLocation();

  // Don't show sidebar on auth pages
  const isAuthPage = location.pathname === '/login';

  if (!isAuthenticated && !isAuthPage) {
    return null; // Will be handled by route protection
  }

  if (isAuthPage) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      {isMobile ? <MobileTopBar /> : <TopBar />}
      <div className="flex flex-1 w-full overflow-hidden">
        <AppSidebar />
        <main className={cn(
          "flex-1 overflow-auto p-3 md:p-6",
          isMobile && "pb-4"
        )}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function AppLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <LayoutContent />
    </SidebarProvider>
  );
}
