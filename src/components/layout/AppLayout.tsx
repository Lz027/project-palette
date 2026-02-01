import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { TopBar } from '@/components/layout/TopBar';
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

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
      <TopBar />
      <div className="flex flex-1 w-full overflow-hidden">
        {!isMobile && <AppSidebar />}
        <main className="flex-1 overflow-auto p-4 md:p-6 pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>
      {isMobile && <MobileNav />}
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
