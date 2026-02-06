import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowRight, Code, ImageIcon, StickyNote, Wrench, ExternalLink } from 'lucide-react';
import { useBoards } from '@/contexts/BoardContext';
import { useAuth } from '@/contexts/AuthContext';
import { useFocus, FocusMode } from '@/contexts/FocusContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BoardCard } from '@/components/boards/BoardCard';
import { FocusToolsPanel } from '@/components/features/FocusToolsPanel';
import { CodeSnippets } from '@/components/features/CodeSnippets';
import { NoteTaker } from '@/components/features/NoteTaker';
import { ImageEditor } from '@/components/features/ImageEditor';
import { CollapsibleToolPanel } from '@/components/features/CollapsibleToolPanel';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

// Tool data for the collapsible panels
const getToolIcon = (mode: FocusMode) => {
  switch (mode) {
    case 'tech': return <Code className="h-4 w-4" />;
    case 'design': return <ImageIcon className="h-4 w-4" />;
    case 'productive': return <StickyNote className="h-4 w-4" />;
  }
};

const getSpecialToolTitle = (mode: FocusMode) => {
  switch (mode) {
    case 'tech': return 'Code Snippets';
    case 'design': return 'Quick Image Edit';
    case 'productive': return 'Quick Notes';
  }
};

// Tech tools with logos and URLs
const techTools = [
  { id: 'lovable', name: 'Lovable', logo: 'https://lovable.dev/favicon.ico', url: 'https://lovable.dev', category: 'AI Builder' },
  { id: 'replit', name: 'Replit', logo: 'https://cdn.replit.com/dotcom/favicon.ico', url: 'https://replit.com', category: 'AI Builder' },
  { id: 'cursor', name: 'Cursor', logo: 'https://www.cursor.com/favicon.ico', url: 'https://cursor.com', category: 'AI Editor' },
  { id: 'manus', name: 'Manus', logo: 'https://manus.im/favicon.svg', url: 'https://manus.im', category: 'AI Agent' },
  { id: 'github', name: 'GitHub', logo: 'https://github.githubassets.com/favicons/favicon.svg', url: 'https://github.com', category: 'Git' },
  { id: 'supabase', name: 'Supabase', logo: 'https://supabase.com/favicon/favicon-32x32.png', url: 'https://supabase.com', category: 'Database' },
];

// Design tools with logos and URLs
const designTools = [
  { id: 'figma', name: 'Figma', logo: 'https://static.figma.com/app/icon/1/favicon.png', url: 'https://figma.com', category: 'Design' },
  { id: 'canva', name: 'Canva', logo: 'https://static.canva.com/static/images/favicon-1.ico', url: 'https://canva.com', category: 'Design' },
  { id: 'leonardo', name: 'Leonardo', logo: 'https://leonardo.ai/favicon.ico', url: 'https://leonardo.ai', category: 'AI Image' },
  { id: 'midjourney', name: 'Midjourney', logo: 'https://www.midjourney.com/favicon.ico', url: 'https://midjourney.com', category: 'AI Image' },
  { id: 'photopea', name: 'Photopea', logo: 'https://www.photopea.com/promo/icon512.png', url: 'https://photopea.com', category: 'Editor' },
  { id: 'coolors', name: 'Coolors', logo: 'https://coolors.co/assets/img/favicon.png', url: 'https://coolors.co', category: 'Colors' },
];

// Productivity tools
const productivityTools = [
  { id: 'linear', name: 'Linear', logo: 'https://linear.app/favicon.ico', url: 'https://linear.app', category: 'Project' },
  { id: 'slack', name: 'Slack', logo: 'https://a.slack-edge.com/80588/marketing/img/meta/favicon-32.png', url: 'https://slack.com', category: 'Chat' },
  { id: 'genspark', name: 'Genspark', logo: 'https://www.genspark.ai/favicon.ico', url: 'https://genspark.ai', category: 'AI Search' },
  { id: 'excalidraw', name: 'Excalidraw', logo: 'https://excalidraw.com/favicon.ico', url: 'https://excalidraw.com', category: 'Whiteboard' },
  { id: 'todoist', name: 'Todoist', logo: 'https://todoist.com/favicon.ico', url: 'https://todoist.com', category: 'Tasks' },
  { id: 'poe', name: 'Poe AI', logo: 'https://poe.com/favicon.ico', url: 'https://poe.com', category: 'AI Chat' },
];

const getToolsForMode = (mode: FocusMode) => {
  switch (mode) {
    case 'tech': return techTools;
    case 'design': return designTools;
    case 'productive': return productivityTools;
  }
};

function MobileToolsGrid({ mode }: { mode: FocusMode }) {
  const tools = getToolsForMode(mode);
  
  return (
    <div className="grid grid-cols-3 gap-2">
      {tools.map((tool) => (
        <a
          key={tool.id}
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/50 hover:bg-muted active:scale-95 transition-all touch-manipulation"
        >
          <img
            src={tool.logo}
            alt={tool.name}
            className="w-7 h-7 rounded-md object-contain"
            onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
          />
          <span className="text-[10px] text-center font-medium truncate w-full">{tool.name}</span>
        </a>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { boards } = useBoards();
  const { user } = useAuth();
  const { colors, focusMode } = useFocus();
  const isMobile = useIsMobile();
  
  const favoriteBoards = boards.filter(b => b.isFavorite);
  const recentBoards = boards.slice(-4).reverse();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const renderSpecialTool = () => {
    if (isMobile) {
      // Mobile: Render inside collapsible panel
      switch (focusMode) {
        case 'tech': return <CodeSnippets />;
        case 'design': return <ImageEditor />;
        case 'productive': return <NoteTaker />;
      }
    }
    
    // Desktop: Normal rendering
    switch (focusMode) {
      case 'tech': return <CodeSnippets />;
      case 'design': return <ImageEditor />;
      case 'productive': return <NoteTaker />;
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="font-display text-lg sm:text-2xl md:text-3xl font-bold">
              {greeting()}, {user?.name?.split(' ')[0] || 'there'}
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">
              Here's what's happening with your projects
            </p>
          </div>
          {!isMobile && (
            <Button asChild className="gradient-primary text-primary-foreground">
              <Link to="/boards/new">
                <Plus className="h-4 w-4 mr-2" />
                {colors.createLabel}
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile: Collapsible Tool Panels */}
      {isMobile ? (
        <div className="space-y-2">
          {/* Focus Tools - Collapsible */}
          <CollapsibleToolPanel
            title={`${colors.name} Tools`}
            icon={<Wrench className="h-4 w-4" />}
          >
            <MobileToolsGrid mode={focusMode} />
          </CollapsibleToolPanel>

          {/* Special Tool - Collapsible */}
          <CollapsibleToolPanel
            title={getSpecialToolTitle(focusMode)}
            icon={getToolIcon(focusMode)}
          >
            <div className="-m-3 -mt-2">
              {renderSpecialTool()}
            </div>
          </CollapsibleToolPanel>
        </div>
      ) : (
        /* Desktop: Grid layout */
        <div className="grid gap-4 md:grid-cols-2">
          <FocusToolsPanel compact={isMobile} />
          {renderSpecialTool()}
        </div>
      )}

      {/* Recent Boards */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-sm sm:text-lg font-semibold">Recent Boards</h2>
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground text-xs sm:text-sm h-8">
            <Link to="/boards">
              View all <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
            </Link>
          </Button>
        </div>
        
        {recentBoards.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            {recentBoards.map(board => <BoardCard key={board.id} board={board} />)}
          </div>
        ) : (
          <Card className="glass-card">
            <CardContent className="p-4 sm:p-8 text-center">
              <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                <Plus className="h-5 w-5 sm:h-8 sm:w-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-1.5 text-sm sm:text-base">No boards yet</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                Create your first board to get started
              </p>
              <Button asChild className="gradient-primary text-primary-foreground" size={isMobile ? "sm" : "default"}>
                <Link to="/boards/new">{colors.createLabel}</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Favorites Section */}
      {favoriteBoards.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-sm sm:text-lg font-semibold">Favorites</h2>
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground text-xs sm:text-sm h-8">
              <Link to="/favorites">
                View all <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            {favoriteBoards.slice(0, 4).map(board => <BoardCard key={board.id} board={board} />)}
          </div>
        </section>
      )}
    </div>
  );
}
