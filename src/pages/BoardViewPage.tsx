import React, { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { ArrowLeft, Star, Plus, Trash2, Type, Hash, Calendar, Paperclip, Link as LinkIcon } from 'lucide-react';
import { useBoards } from '@/contexts/BoardContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { ColumnType } from '@/types';

const columnTypeConfig: Record<ColumnType, { icon: React.ElementType; label: string }> = {
  text: { icon: Type, label: 'Text' },
  number: { icon: Hash, label: 'Number' },
  date: { icon: Calendar, label: 'Date' },
  file: { icon: Paperclip, label: 'File' },
  link: { icon: LinkIcon, label: 'Link' },
};

export default function BoardViewPage() {
  const { boardId } = useParams<{ boardId: string }>();
  const { boards, toggleFavorite, addColumn, deleteColumn } = useBoards();
  
  const board = boards.find(b => b.id === boardId);
  const [newColumnName, setNewColumnName] = useState('');
  const [rows, setRows] = useState<{ id: string; cells: Record<string, string> }[]>([
    { id: '1', cells: {} },
  ]);
  const [columnTypes, setColumnTypes] = useState<Record<string, ColumnType>>({});
  const [editingCell, setEditingCell] = useState<{ rowId: string; colId: string } | null>(null);

  if (!board) {
    return <Navigate to="/boards" replace />;
  }

  const handleAddColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColumnName.trim()) return;
    addColumn(board.id, newColumnName.trim());
    setNewColumnName('');
  };

  const handleAddRow = () => {
    setRows([...rows, { id: Date.now().toString(), cells: {} }]);
  };

  const handleCellChange = (rowId: string, colId: string, value: string) => {
    setRows(rows.map(row => 
      row.id === rowId 
        ? { ...row, cells: { ...row.cells, [colId]: value } }
        : row
    ));
  };

  const handleDeleteRow = (rowId: string) => {
    setRows(rows.filter(row => row.id !== rowId));
  };

  const handleColumnTypeChange = (colId: string, type: ColumnType) => {
    setColumnTypes({ ...columnTypes, [colId]: type });
  };

  const getColumnType = (colId: string): ColumnType => {
    return columnTypes[colId] || 'text';
  };

  const renderCellInput = (rowId: string, colId: string, type: ColumnType) => {
    const value = rows.find(r => r.id === rowId)?.cells[colId] || '';
    const isEditing = editingCell?.rowId === rowId && editingCell?.colId === colId;

    const inputProps = {
      value,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleCellChange(rowId, colId, e.target.value),
      onBlur: () => setEditingCell(null),
      onFocus: () => setEditingCell({ rowId, colId }),
      className: "h-9 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent",
    };

    switch (type) {
      case 'number':
        return <Input {...inputProps} type="number" placeholder="0" />;
      case 'date':
        return <Input {...inputProps} type="date" />;
      case 'link':
        return (
          <Input 
            {...inputProps} 
            type="url" 
            placeholder="https://"
            className={cn(inputProps.className, value && "text-primary underline")}
          />
        );
      case 'file':
        return (
          <div className="flex items-center gap-2 px-3 h-9">
            <Button variant="ghost" size="sm" className="h-7 text-xs">
              Upload
            </Button>
            {value && <span className="text-xs text-muted-foreground truncate">{value}</span>}
          </div>
        );
      default:
        return <Input {...inputProps} type="text" placeholder="Enter text..." />;
    }
  };

  return (
    <div className="h-full flex flex-col -m-4 md:-m-6">
      {/* Board Header */}
      <div className="p-4 md:p-6 border-b border-border bg-card">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            asChild
          >
            <Link to="/boards">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-xl md:text-2xl font-bold text-foreground">
              {board.name}
            </h1>
            {board.description && (
              <p className="text-sm text-muted-foreground truncate">{board.description}</p>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleFavorite(board.id)}
            className={cn(
              board.isFavorite ? "text-warning" : "text-muted-foreground"
            )}
          >
            <Star className={cn("h-5 w-5", board.isFavorite && "fill-current")} />
          </Button>
        </div>
      </div>

      {/* Spreadsheet View */}
      <ScrollArea className="flex-1">
        <div className="min-w-max">
          {/* Header Row */}
          <div className="flex border-b border-border bg-muted/30 sticky top-0 z-10">
            {/* Row number column */}
            <div className="w-12 shrink-0 px-2 py-2 border-r border-border flex items-center justify-center">
              <span className="text-xs text-muted-foreground">#</span>
            </div>
            
            {/* Existing columns */}
            {board.columns.map((column, index) => {
              const type = getColumnType(column.id);
              const TypeIcon = columnTypeConfig[type].icon;
              
              return (
                <div 
                  key={column.id}
                  className="w-48 shrink-0 border-r border-border"
                >
                  <div className="flex items-center justify-between px-3 py-2 group">
                    <span className="font-medium text-sm truncate">{column.name}</span>
                    <div className="flex items-center gap-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 opacity-60 hover:opacity-100">
                            <TypeIcon className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {Object.entries(columnTypeConfig).map(([typeKey, config]) => (
                            <DropdownMenuItem 
                              key={typeKey}
                              onClick={() => handleColumnTypeChange(column.id, typeKey as ColumnType)}
                              className={cn(type === typeKey && "bg-accent")}
                            >
                              <config.icon className="h-4 w-4 mr-2" />
                              {config.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-60 hover:opacity-100"
                        onClick={() => deleteColumn(board.id, column.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Add Column */}
            <div className="w-48 shrink-0 px-2 py-2">
              <form onSubmit={handleAddColumn} className="flex gap-1">
                <Input
                  placeholder="New column..."
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  className="h-7 text-sm"
                />
                {newColumnName && (
                  <Button type="submit" size="icon" className="h-7 w-7 shrink-0">
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                )}
              </form>
            </div>
          </div>

          {/* Data Rows */}
          {rows.map((row, rowIndex) => (
            <div key={row.id} className="flex border-b border-border hover:bg-muted/20 group">
              {/* Row number */}
              <div className="w-12 shrink-0 px-2 py-1 border-r border-border flex items-center justify-center relative">
                <span className="text-xs text-muted-foreground group-hover:opacity-0">{rowIndex + 1}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 absolute opacity-0 group-hover:opacity-100"
                  onClick={() => handleDeleteRow(row.id)}
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
              
              {/* Cells */}
              {board.columns.map((column) => (
                <div 
                  key={column.id}
                  className="w-48 shrink-0 border-r border-border"
                >
                  {renderCellInput(row.id, column.id, getColumnType(column.id))}
                </div>
              ))}

              {/* Empty cell for add column space */}
              <div className="w-48 shrink-0" />
            </div>
          ))}

          {/* Add Row Button */}
          <div className="flex border-b border-border">
            <button
              onClick={handleAddRow}
              className="w-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add row
            </button>
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
