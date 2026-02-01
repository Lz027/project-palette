import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowRight, Sparkles, Target, Clock } from 'lucide-react';
import { useBoards } from '@/contexts/BoardContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BoardCard } from '@/components/boards/BoardCard';
import { QuickCapture } from '@/components/features/QuickCapture';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { boards } = useBoards();
  const { user } = useAuth();

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
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">
            {greeting()}, {user?.name?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your projects
          </p>
        </div>
        <Button asChild className="gradient-primary text-primary-foreground w-full md:w-auto">
          <Link to="/boards/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Board
          </Link>
        </Button>
      </div>

      {/* Quick Capture */}
      <QuickCapture />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{boards.length}</p>
                <p className="text-xs text-muted-foreground">Active Boards</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalCards}</p>
                <p className="text-xs text-muted-foreground">Total Cards</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalColumns}</p>
                <p className="text-xs text-muted-foreground">Columns</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-board-rose/20 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-board-rose" />
              </div>
              <div>
                <p className="text-2xl font-bold">{favoriteBoards.length}</p>
                <p className="text-xs text-muted-foreground">Favorites</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Boards */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold">Recent Boards</h2>
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
            <Link to="/boards">
              View all <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
        
        {recentBoards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentBoards.map(board => (
              <BoardCard key={board.id} board={board} />
            ))}
          </div>
        ) : (
          <Card className="glass-card">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-2">No boards yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first board to get started
              </p>
              <Button asChild className="gradient-primary text-primary-foreground">
                <Link to="/boards/new">Create Board</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Favorites Section */}
      {favoriteBoards.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold">⭐ Favorites</h2>
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
              <Link to="/favorites">
                View all <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {favoriteBoards.slice(0, 4).map(board => (
              <BoardCard key={board.id} board={board} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
