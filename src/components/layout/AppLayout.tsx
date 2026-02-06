import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { MobileSidebar } from '@/components/layout/MobileSidebar';
import { MobileTopBar } from '@/components/layout/MobileTopBar';
import { TopBar } from '@/components/layout/TopBar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

function LayoutContent() {
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  const location = useLocation();

  const isAuthPage = location.pathname === '/login';

  if (!isAuthenticated && !isAuthPage) {
    return null;
  }

  if (isAuthPage) {
    return <Outlet />;
  }

  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col w-full bg-background">
        <MobileTopBar />
        <div className="flex flex-1 w-full overflow-hidden">
          <MobileSidebar />
          <main className="flex-1 overflow-auto p-3 pb-4">
            <Outlet />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      <TopBar />
      <div className="flex flex-1 w-full overflow-hidden">
        <AppSidebar />
        <main className="flex-1 overflow-auto p-3 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function AppLayout() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <LayoutContent />;
  }

  return (
    <SidebarProvider defaultOpen>
      <LayoutContent />
    </SidebarProvider>
  );
}
