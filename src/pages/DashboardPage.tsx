import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowRight, Sparkles, Target, Clock } from 'lucide-react';
import { useBoards } from '@/contexts/BoardContext';
import { useAuth } from '@/contexts/AuthContext';
import { useFocus } from '@/contexts/FocusContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BoardCard } from '@/components/boards/BoardCard';
import { FocusToolsPanel } from '@/components/features/FocusToolsPanel';
import { CodeSnippets } from '@/components/features/CodeSnippets';
import { NoteTaker } from '@/components/features/NoteTaker';
import { ImageEditor } from '@/components/features/ImageEditor';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { boards } = useBoards();
  const { user } = useAuth();
  const { colors, focusMode } = useFocus();
  const isMobile = useIsMobile();

  const favoriteBoards = boards.filter(b => b.isFavorite);
  const recentBoards = boards.slice(-4).reverse();
  
  // Stats
  const totalCards = boards.reduce((acc, b) => 
    acc + b.columns.reduce((colAcc, c) => colAcc + c.cards.length, 0), 0
  );
  const totalColumns = boards.reduce((acc, b) => acc + b.columns.length, 0);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold">
              {greeting()}, {user?.name?.split(' ')[0] || 'there'}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Here's what's happening with your projects
            </p>
          </div>
          <Button asChild className="gradient-primary text-primary-foreground">
            <Link to="/boards/new">
              <Plus className="h-4 w-4 mr-2" />
              {colors.createLabel}
            </Link>
          </Button>
        </div>
      </div>

      {/* Focus Tools Panel */}
      <div className={cn(
        "grid gap-4",
        focusMode === 'tech' ? "md:grid-cols-2" : 
        focusMode === 'design' ? "md:grid-cols-2" : 
        "md:grid-cols-2"
      )}>
        <FocusToolsPanel compact={isMobile} />
        {focusMode === 'tech' && <CodeSnippets />}
        {focusMode === 'design' && <ImageEditor />}
        {focusMode === 'productive' && <NoteTaker />}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card className="glass-card">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold">{boards.length}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Boards</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-secondary" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold">{totalCards}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Cards</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold">{totalColumns}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Columns</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-board-rose/20 flex items-center justify-center">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-board-rose" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold">{favoriteBoards.length}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Favorites</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Boards */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-base sm:text-lg font-semibold">Recent Boards</h2>
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground text-xs sm:text-sm">
            <Link to="/boards">
              View all <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
            </Link>
          </Button>
        </div>
        
        {recentBoards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {recentBoards.map(board => (
              <BoardCard key={board.id} board={board} />
            ))}
          </div>
        ) : (
          <Card className="glass-card">
            <CardContent className="p-6 sm:p-8 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-2 text-sm sm:text-base">No boards yet</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                Create your first board to get started
              </p>
              <Button asChild className="gradient-primary text-primary-foreground">
                <Link to="/boards/new">{colors.createLabel}</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Favorites Section */}
      {favoriteBoards.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-base sm:text-lg font-semibold">Favorites</h2>
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground text-xs sm:text-sm">
              <Link to="/favorites">
                View all <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {favoriteBoards.slice(0, 4).map(board => (
              <BoardCard key={board.id} board={board} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
