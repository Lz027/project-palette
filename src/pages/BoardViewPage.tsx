import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { ArrowLeft, Star, Plus, MoreHorizontal, Trash2 } from 'lucide-react';
import { useBoards } from '@/contexts/BoardContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const boardColorClasses: Record<string, string> = {
  coral: 'from-board-coral to-board-peach',
  lavender: 'from-board-lavender to-board-rose',
  mint: 'from-board-mint to-board-sky',
  sky: 'from-board-sky to-board-lavender',
  peach: 'from-board-peach to-board-coral',
  rose: 'from-board-rose to-board-lavender',
};

export default function BoardViewPage() {
  const { boardId } = useParams<{ boardId: string }>();
  const { boards, toggleFavorite, addColumn, addCard, deleteColumn, deleteCard } = useBoards();
  
  const board = boards.find(b => b.id === boardId);
  const [newColumnName, setNewColumnName] = React.useState('');
  const [addingColumnId, setAddingColumnId] = React.useState<string | null>(null);
  const [newCardTitle, setNewCardTitle] = React.useState('');

  if (!board) {
    return <Navigate to="/boards" replace />;
  }

  const handleAddColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColumnName.trim()) return;
    addColumn(board.id, newColumnName.trim());
    setNewColumnName('');
  };

  const handleAddCard = (columnId: string) => {
    if (!newCardTitle.trim()) return;
    addCard(board.id, columnId, newCardTitle.trim());
    setNewCardTitle('');
    setAddingColumnId(null);
  };

  return (
    <div className="h-full flex flex-col -m-4 md:-m-6">
      {/* Board Header */}
      <div className={cn(
        "p-4 md:p-6 bg-gradient-to-r",
        boardColorClasses[board.color] || 'from-primary to-secondary'
      )}>
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            asChild
            className="bg-background/20 hover:bg-background/40 text-foreground"
          >
            <Link to="/boards">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-xl md:text-2xl font-bold truncate text-foreground">
              {board.name}
            </h1>
            {board.description && (
              <p className="text-sm opacity-80 truncate">{board.description}</p>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleFavorite(board.id)}
            className={cn(
              "bg-background/20 hover:bg-background/40",
              board.isFavorite ? "text-warning" : "text-foreground"
            )}
          >
            <Star className={cn("h-5 w-5", board.isFavorite && "fill-current")} />
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <ScrollArea className="flex-1 p-4 md:p-6">
        <div className="flex gap-4 min-h-full pb-4">
          {board.columns.map(column => (
            <div 
              key={column.id}
              className="w-72 md:w-80 shrink-0 flex flex-col bg-muted/50 rounded-xl"
            >
              {/* Column Header */}
              <div className="p-3 flex items-center justify-between">
                <h3 className="font-medium text-sm">
                  {column.name}
                  <span className="ml-2 text-xs text-muted-foreground">
                    {column.cards.length}
                  </span>
                </h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={() => deleteColumn(board.id, column.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Column
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Cards */}
              <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[calc(100vh-280px)]">
                {column.cards.map(card => (
                  <Card 
                    key={card.id} 
                    className="group cursor-pointer hover:shadow-md transition-shadow bg-card"
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm flex-1">{card.title}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                          onClick={() => deleteCard(board.id, column.id, card.id)}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                      {card.labels.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {card.labels.map(label => (
                            <span 
                              key={label.id}
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: label.color }}
                            >
                              {label.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {/* Add Card Form */}
                {addingColumnId === column.id ? (
                  <div className="space-y-2">
                    <Input
                      placeholder="Enter card title..."
                      value={newCardTitle}
                      onChange={(e) => setNewCardTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddCard(column.id);
                        if (e.key === 'Escape') setAddingColumnId(null);
                      }}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleAddCard(column.id)}
                        className="gradient-primary text-primary-foreground"
                      >
                        Add
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => setAddingColumnId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingColumnId(column.id)}
                    className="w-full p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add card
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Add Column */}
          <div className="w-72 md:w-80 shrink-0">
            <form onSubmit={handleAddColumn} className="space-y-2">
              <Input
                placeholder="Add new column..."
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                className="bg-muted/50"
              />
              {newColumnName && (
                <Button type="submit" size="sm" className="w-full gradient-primary text-primary-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Column
                </Button>
              )}
            </form>
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
