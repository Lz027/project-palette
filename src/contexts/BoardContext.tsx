import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Board, BoardColor, BoardTemplate, Column, Card } from '@/types';
import { BOARD_TEMPLATES } from '@/lib/board-templates';
import { boardNameSchema, columnNameSchema, cardTitleSchema, validateInput, INPUT_LIMITS } from '@/lib/validation';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface BoardContextType {
  boards: Board[];
  activeBoard: Board | null;
  isLoading: boolean;
  setActiveBoard: (board: Board | null) => void;
  createBoard: (name: string, template: BoardTemplate, color: BoardColor, description?: string) => Promise<Board | null>;
  deleteBoard: (id: string) => Promise<void>;
  updateBoard: (id: string, updates: Partial<Board>) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  addColumn: (boardId: string, name: string) => Promise<void>;
  updateColumn: (boardId: string, columnId: string, updates: Partial<Column>) => Promise<void>;
  updateColumnName: (boardId: string, columnId: string, name: string) => Promise<void>;
  deleteColumn: (boardId: string, columnId: string) => Promise<void>;
  addCard: (boardId: string, columnId: string, title: string) => Promise<void>;
  updateCard: (boardId: string, columnId: string, cardId: string, updates: Partial<Card>) => Promise<void>;
  deleteCard: (boardId: string, columnId: string, cardId: string) => Promise<void>;
  moveCard: (boardId: string, cardId: string, fromColumnId: string, toColumnId: string, newOrder: number) => Promise<void>;
  refreshBoards: () => Promise<void>;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export function BoardProvider({ children }: { children: React.ReactNode }) {
  const [boards, setBoards] = useState<Board[]>([]);
  const [activeBoard, setActiveBoard] = useState<Board | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  // Fetch boards from Supabase
  const fetchBoards = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setBoards([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Fetch boards
      const { data: boardsData, error: boardsError } = await supabase
        .from('boards')
        .select('*')
        .order('created_at', { ascending: false });

      if (boardsError) throw boardsError;

      // Fetch columns for all boards
      const boardIds = boardsData?.map(b => b.id) || [];
      
      let columnsData: any[] = [];
      let tasksData: any[] = [];
      
      if (boardIds.length > 0) {
        const { data: cols, error: colsError } = await supabase
          .from('columns')
          .select('*')
          .in('board_id', boardIds)
          .order('position', { ascending: true });
        
        if (colsError) throw colsError;
        columnsData = cols || [];

        // Fetch tasks for all columns
        const columnIds = columnsData.map(c => c.id);
        if (columnIds.length > 0) {
          const { data: tasks, error: tasksError } = await supabase
            .from('tasks')
            .select('*')
            .in('column_id', columnIds)
            .order('position', { ascending: true });
          
          if (tasksError) throw tasksError;
          tasksData = tasks || [];
        }
      }

      // Transform data to match our Board type
      const transformedBoards: Board[] = (boardsData || []).map(board => {
        const boardColumns = columnsData
          .filter(c => c.board_id === board.id)
          .map(col => ({
            id: col.id,
            name: col.name,
            boardId: col.board_id,
            order: col.position,
            type: col.column_type,
            cards: tasksData
              .filter(t => t.column_id === col.id)
              .map(task => ({
                id: task.id,
                title: task.title,
                description: task.description,
                columnId: task.column_id,
                order: task.position,
                labels: [],
                dueDate: task.due_date ? new Date(task.due_date) : undefined,
                createdAt: new Date(task.created_at),
                updatedAt: new Date(task.created_at),
              })),
          }));

        return {
          id: board.id,
          name: board.name,
          description: undefined,
          color: 'coral' as BoardColor,
          template: (board.template_type || 'canvas') as BoardTemplate,
          columns: boardColumns,
          createdAt: new Date(board.created_at || Date.now()),
          updatedAt: new Date(board.last_opened_at || board.created_at || Date.now()),
          isFavorite: board.pinned || false,
          ownerId: board.user_id,
        };
      });

      setBoards(transformedBoards);
    } catch (error) {
      console.error('Error fetching boards:', error);
      toast.error('Failed to load boards');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const refreshBoards = useCallback(async () => {
    await fetchBoards();
  }, [fetchBoards]);

  const createBoard = async (name: string, template: BoardTemplate, color: BoardColor, description?: string): Promise<Board | null> => {
    if (!user) return null;
    
    const validation = validateInput(boardNameSchema, name);
    if (!validation.success) {
      toast.error('error' in validation ? validation.error : 'Invalid board name');
      return null;
    }
    const validatedName = validation.data;
    
    try {
      // Create board in Supabase
      const { data: newBoard, error: boardError } = await supabase
        .from('boards')
        .insert({
          name: validatedName,
          user_id: user.id,
          template_type: template,
          pinned: false,
        })
        .select()
        .single();

      if (boardError) throw boardError;

      // Create default columns
      const templateConfig = BOARD_TEMPLATES.find(t => t.id === template);
      const defaultColumns = templateConfig?.defaultColumns || ['To Do', 'In Progress', 'Done'];
      
      const columnsToInsert = defaultColumns.map((colName, index) => ({
        board_id: newBoard.id,
        name: colName,
        position: index,
        column_type: 'text',
      }));

      const { error: colsError } = await supabase
        .from('columns')
        .insert(columnsToInsert);

      if (colsError) throw colsError;

      await refreshBoards();
      toast.success('Board created!');
      
      return boards.find(b => b.id === newBoard.id) || null;
    } catch (error) {
      console.error('Error creating board:', error);
      toast.error('Failed to create board');
      return null;
    }
  };

  const deleteBoard = async (id: string) => {
    try {
      const { error } = await supabase
        .from('boards')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setBoards(prev => prev.filter(b => b.id !== id));
      if (activeBoard?.id === id) {
        setActiveBoard(null);
      }
      toast.success('Board deleted');
    } catch (error) {
      console.error('Error deleting board:', error);
      toast.error('Failed to delete board');
    }
  };

  const updateBoard = async (id: string, updates: Partial<Board>) => {
    try {
      const dbUpdates: any = {};
      if (updates.name) dbUpdates.name = updates.name;
      if (updates.isFavorite !== undefined) dbUpdates.pinned = updates.isFavorite;
      dbUpdates.last_opened_at = new Date().toISOString();

      const { error } = await supabase
        .from('boards')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      setBoards(prev => prev.map(b => 
        b.id === id ? { ...b, ...updates, updatedAt: new Date() } : b
      ));
    } catch (error) {
      console.error('Error updating board:', error);
      toast.error('Failed to update board');
    }
  };

  const toggleFavorite = async (id: string) => {
    const board = boards.find(b => b.id === id);
    if (!board) return;

    try {
      const { error } = await supabase
        .from('boards')
        .update({ pinned: !board.isFavorite })
        .eq('id', id);

      if (error) throw error;

      setBoards(prev => prev.map(b =>
        b.id === id ? { ...b, isFavorite: !b.isFavorite } : b
      ));
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorite');
    }
  };

  const addColumn = async (boardId: string, name: string) => {
    const validation = validateInput(columnNameSchema, name);
    if (!validation.success) {
      toast.error('error' in validation ? validation.error : 'Invalid column name');
      return;
    }
    const validatedName = validation.data;
    
    const board = boards.find(b => b.id === boardId);
    const newPosition = board?.columns.length || 0;

    try {
      const { data: newColumn, error } = await supabase
        .from('columns')
        .insert({
          board_id: boardId,
          name: validatedName,
          position: newPosition,
          column_type: 'text',
        })
        .select()
        .single();

      if (error) throw error;

      setBoards(prev => prev.map(b => {
        if (b.id !== boardId) return b;
        return {
          ...b,
          columns: [...b.columns, {
            id: newColumn.id,
            name: validatedName,
            boardId,
            order: newPosition,
            cards: [],
          }],
          updatedAt: new Date(),
        };
      }));
    } catch (error) {
      console.error('Error adding column:', error);
      toast.error('Failed to add column');
    }
  };

  const updateColumn = async (boardId: string, columnId: string, updates: Partial<Column>) => {
    try {
      const dbUpdates: any = {};
      if (updates.name) dbUpdates.name = updates.name;
      if (updates.order !== undefined) dbUpdates.position = updates.order;

      const { error } = await supabase
        .from('columns')
        .update(dbUpdates)
        .eq('id', columnId);

      if (error) throw error;

      setBoards(prev => prev.map(b => {
        if (b.id !== boardId) return b;
        return {
          ...b,
          columns: b.columns.map(c => c.id === columnId ? { ...c, ...updates } : c),
          updatedAt: new Date(),
        };
      }));
    } catch (error) {
      console.error('Error updating column:', error);
      toast.error('Failed to update column');
    }
  };

  const updateColumnName = async (boardId: string, columnId: string, name: string) => {
    const validation = validateInput(columnNameSchema, name);
    if (!validation.success) {
      toast.error('error' in validation ? validation.error : 'Invalid column name');
      return;
    }
    await updateColumn(boardId, columnId, { name: validation.data });
  };

  const deleteColumn = async (boardId: string, columnId: string) => {
    try {
      const { error } = await supabase
        .from('columns')
        .delete()
        .eq('id', columnId);

      if (error) throw error;

      setBoards(prev => prev.map(b => {
        if (b.id !== boardId) return b;
        return {
          ...b,
          columns: b.columns.filter(c => c.id !== columnId),
          updatedAt: new Date(),
        };
      }));
    } catch (error) {
      console.error('Error deleting column:', error);
      toast.error('Failed to delete column');
    }
  };

  const addCard = async (boardId: string, columnId: string, title: string) => {
    const validation = validateInput(cardTitleSchema, title);
    if (!validation.success) {
      toast.error('error' in validation ? validation.error : 'Invalid card title');
      return;
    }
    const validatedTitle = validation.data;
    
    const board = boards.find(b => b.id === boardId);
    const column = board?.columns.find(c => c.id === columnId);
    const newPosition = column?.cards.length || 0;

    try {
      const { data: newTask, error } = await supabase
        .from('tasks')
        .insert({
          column_id: columnId,
          title: validatedTitle,
          position: newPosition,
        })
        .select()
        .single();

      if (error) throw error;

      setBoards(prev => prev.map(b => {
        if (b.id !== boardId) return b;
        return {
          ...b,
          columns: b.columns.map(c => {
            if (c.id !== columnId) return c;
            return {
              ...c,
              cards: [...c.cards, {
                id: newTask.id,
                title: validatedTitle,
                columnId,
                order: newPosition,
                labels: [],
                createdAt: new Date(),
                updatedAt: new Date(),
              }],
            };
          }),
          updatedAt: new Date(),
        };
      }));
    } catch (error) {
      console.error('Error adding card:', error);
      toast.error('Failed to add card');
    }
  };

  const updateCard = async (boardId: string, columnId: string, cardId: string, updates: Partial<Card>) => {
    try {
      const dbUpdates: any = {};
      if (updates.title) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate?.toISOString().split('T')[0];

      const { error } = await supabase
        .from('tasks')
        .update(dbUpdates)
        .eq('id', cardId);

      if (error) throw error;

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
    } catch (error) {
      console.error('Error updating card:', error);
      toast.error('Failed to update card');
    }
  };

  const deleteCard = async (boardId: string, columnId: string, cardId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', cardId);

      if (error) throw error;

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
    } catch (error) {
      console.error('Error deleting card:', error);
      toast.error('Failed to delete card');
    }
  };

  const moveCard = async (boardId: string, cardId: string, fromColumnId: string, toColumnId: string, newOrder: number) => {
    try {
      // Update the task's column and position
      const { error } = await supabase
        .from('tasks')
        .update({
          column_id: toColumnId,
          position: newOrder,
        })
        .eq('id', cardId);

      if (error) throw error;

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
    } catch (error) {
      console.error('Error moving card:', error);
      toast.error('Failed to move card');
    }
  };

  return (
    <BoardContext.Provider value={{
      boards,
      activeBoard,
      isLoading,
      setActiveBoard,
      createBoard,
      deleteBoard,
      updateBoard,
      toggleFavorite,
      addColumn,
      updateColumn,
      updateColumnName,
      deleteColumn,
      addCard,
      updateCard,
      deleteCard,
      moveCard,
      refreshBoards,
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
