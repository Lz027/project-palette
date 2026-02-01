import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Board, BoardColor, BoardTemplate, Column, Card } from '@/types';
import { BOARD_TEMPLATES } from '@/lib/board-templates';

interface BoardContextType {
  boards: Board[];
  activeBoard: Board | null;
  setActiveBoard: (board: Board | null) => void;
  createBoard: (name: string, template: BoardTemplate, color: BoardColor, description?: string) => Board;
  deleteBoard: (id: string) => void;
  updateBoard: (id: string, updates: Partial<Board>) => void;
  toggleFavorite: (id: string) => void;
  addColumn: (boardId: string, name: string) => void;
  updateColumn: (boardId: string, columnId: string, updates: Partial<Column>) => void;
  deleteColumn: (boardId: string, columnId: string) => void;
  addCard: (boardId: string, columnId: string, title: string) => void;
  updateCard: (boardId: string, columnId: string, cardId: string, updates: Partial<Card>) => void;
  deleteCard: (boardId: string, columnId: string, cardId: string) => void;
  moveCard: (boardId: string, cardId: string, fromColumnId: string, toColumnId: string, newOrder: number) => void;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

const STORAGE_KEY = 'palette-boards';

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function BoardProvider({ children }: { children: React.ReactNode }) {
  const [boards, setBoards] = useState<Board[]>([]);
  const [activeBoard, setActiveBoard] = useState<Board | null>(null);

  // Load boards from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setBoards(parsed.map((b: Board) => ({
        ...b,
        createdAt: new Date(b.createdAt),
        updatedAt: new Date(b.updatedAt),
      })));
    }
  }, []);

  // Save boards to localStorage
  useEffect(() => {
    if (boards.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(boards));
    }
  }, [boards]);

  const createBoard = (name: string, template: BoardTemplate, color: BoardColor, description?: string): Board => {
    const templateConfig = BOARD_TEMPLATES.find(t => t.id === template);
    const defaultColumns = templateConfig?.defaultColumns || ['To Do', 'In Progress', 'Done'];
    
    const newBoard: Board = {
      id: generateId(),
      name,
      description,
      color,
      template,
      columns: defaultColumns.map((colName, index) => ({
        id: generateId(),
        name: colName,
        boardId: '',
        order: index,
        cards: [],
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
      isFavorite: false,
      ownerId: 'demo-user',
    };
    
    newBoard.columns = newBoard.columns.map(col => ({ ...col, boardId: newBoard.id }));
    
    setBoards(prev => [...prev, newBoard]);
    return newBoard;
  };

  const deleteBoard = (id: string) => {
    setBoards(prev => prev.filter(b => b.id !== id));
    if (activeBoard?.id === id) {
      setActiveBoard(null);
    }
  };

  const updateBoard = (id: string, updates: Partial<Board>) => {
    setBoards(prev => prev.map(b => 
      b.id === id ? { ...b, ...updates, updatedAt: new Date() } : b
    ));
  };

  const toggleFavorite = (id: string) => {
    setBoards(prev => prev.map(b =>
      b.id === id ? { ...b, isFavorite: !b.isFavorite } : b
    ));
  };

  const addColumn = (boardId: string, name: string) => {
    setBoards(prev => prev.map(b => {
      if (b.id !== boardId) return b;
      return {
        ...b,
        columns: [...b.columns, {
          id: generateId(),
          name,
          boardId,
          order: b.columns.length,
          cards: [],
        }],
        updatedAt: new Date(),
      };
    }));
  };

  const updateColumn = (boardId: string, columnId: string, updates: Partial<Column>) => {
    setBoards(prev => prev.map(b => {
      if (b.id !== boardId) return b;
      return {
        ...b,
        columns: b.columns.map(c => c.id === columnId ? { ...c, ...updates } : c),
        updatedAt: new Date(),
      };
    }));
  };

  const deleteColumn = (boardId: string, columnId: string) => {
    setBoards(prev => prev.map(b => {
      if (b.id !== boardId) return b;
      return {
        ...b,
        columns: b.columns.filter(c => c.id !== columnId),
        updatedAt: new Date(),
      };
    }));
  };

  const addCard = (boardId: string, columnId: string, title: string) => {
    setBoards(prev => prev.map(b => {
      if (b.id !== boardId) return b;
      return {
        ...b,
        columns: b.columns.map(c => {
          if (c.id !== columnId) return c;
          return {
            ...c,
            cards: [...c.cards, {
              id: generateId(),
              title,
              columnId,
              order: c.cards.length,
              labels: [],
              createdAt: new Date(),
              updatedAt: new Date(),
            }],
          };
        }),
        updatedAt: new Date(),
      };
    }));
  };

  const updateCard = (boardId: string, columnId: string, cardId: string, updates: Partial<Card>) => {
    setBoards(prev => prev.map(b => {
      if (b.id !== boardId) return b;
      return {
        ...b,
        columns: b.columns.map(c => {
          if (c.id !== columnId) return c;
          return {
            ...c,
            cards: c.cards.map(card => 
              card.id === cardId ? { ...card, ...updates, updatedAt: new Date() } : card
            ),
          };
        }),
        updatedAt: new Date(),
      };
    }));
  };

  const deleteCard = (boardId: string, columnId: string, cardId: string) => {
    setBoards(prev => prev.map(b => {
      if (b.id !== boardId) return b;
      return {
        ...b,
        columns: b.columns.map(c => {
          if (c.id !== columnId) return c;
          return {
            ...c,
            cards: c.cards.filter(card => card.id !== cardId),
          };
        }),
        updatedAt: new Date(),
      };
    }));
  };

  const moveCard = (boardId: string, cardId: string, fromColumnId: string, toColumnId: string, newOrder: number) => {
    setBoards(prev => prev.map(b => {
      if (b.id !== boardId) return b;
      
      let movedCard: Card | undefined;
      
      const columnsWithoutCard = b.columns.map(c => {
        if (c.id !== fromColumnId) return c;
        const card = c.cards.find(card => card.id === cardId);
        if (card) movedCard = card;
        return {
          ...c,
          cards: c.cards.filter(card => card.id !== cardId),
        };
      });

      if (!movedCard) return b;

      const columnsWithCard = columnsWithoutCard.map(c => {
        if (c.id !== toColumnId) return c;
        const newCards = [...c.cards];
        newCards.splice(newOrder, 0, { ...movedCard!, columnId: toColumnId, order: newOrder });
        return {
          ...c,
          cards: newCards.map((card, idx) => ({ ...card, order: idx })),
        };
      });

      return {
        ...b,
        columns: columnsWithCard,
        updatedAt: new Date(),
      };
    }));
  };

  return (
    <BoardContext.Provider value={{
      boards,
      activeBoard,
      setActiveBoard,
      createBoard,
      deleteBoard,
      updateBoard,
      toggleFavorite,
      addColumn,
      updateColumn,
      deleteColumn,
      addCard,
      updateCard,
      deleteCard,
      moveCard,
    }}>
      {children}
    </BoardContext.Provider>
  );
}

export function useBoards() {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoards must be used within a BoardProvider');
  }
  return context;
}
