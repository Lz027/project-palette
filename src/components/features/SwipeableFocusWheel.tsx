import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Code, Palette, Target, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFocus } from '@/contexts/FocusContext';
import type { FocusMode } from '@/contexts/FocusContext';

interface SwipeableFocusWheelProps {
  className?: string;
}

const focusModes: { id: FocusMode; label: string; icon: React.ReactNode; color: string; bgColor: string; description: string }[] = [
  { id: 'tech', label: 'Tech', icon: <Code className="w-4 h-4" />, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-500', description: 'Dev Tools' },
  { id: 'productive', label: 'Focus', icon: <Target className="w-4 h-4" />, color: 'text-rose-600 dark:text-rose-400', bgColor: 'bg-rose-500', description: 'Productivity' },
  { id: 'design', label: 'Design', icon: <Palette className="w-4 h-4" />, color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-500', description: 'Design Tools' },
];

export function SwipeableFocusWheel({ className }: SwipeableFocusWheelProps) {
  const { focusMode, setFocusMode } = useFocus();
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const currentIndex = focusModes.findIndex(m => m.id === focusMode);
  const currentMode = focusModes[currentIndex];
  
  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + focusModes.length) % focusModes.length;
    setFocusMode(focusModes[prevIndex].id);
  };
  
  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % focusModes.length;
    setFocusMode(focusModes[nextIndex].id);
  };

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentTranslate(0);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    setCurrentTranslate(Math.max(-50, Math.min(50, diff)));
  }, [isDragging, startX]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (currentTranslate > 30) {
      handlePrev();
    } else if (currentTranslate < -30) {
      handleNext();
    }
    
    setCurrentTranslate(0);
  }, [isDragging, currentTranslate, handlePrev, handleNext]);

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div 
        ref={containerRef}
        className="relative flex items-center gap-2"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Previous button */}
        <button
          onClick={handlePrev}
          className="p-2 rounded-full bg-muted/50 hover:bg-muted active:scale-95 transition-all touch-manipulation"
          aria-label="Previous mode"
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        
        {/* Current mode display */}
        <div 
          className={cn(
            "flex items-center gap-3 px-4 py-2.5 rounded-xl border border-border/50 bg-card shadow-sm transition-all duration-300",
            isDragging && "scale-95"
          )}
          style={{
            transform: `translateX(${currentTranslate}px)`,
            opacity: 1 - Math.abs(currentTranslate) / 100,
          }}
        >
          <div className={cn(
            "flex items-center justify-center w-9 h-9 rounded-full text-primary-foreground shadow-md transition-transform",
            currentMode.bgColor
          )}>
            {currentMode.icon}
          </div>
          <div className="min-w-[80px]">
            <p className="text-sm font-semibold">{currentMode.label}</p>
            <p className="text-xs text-muted-foreground">{currentMode.description}</p>
          </div>
        </div>
        
        {/* Next button */}
        <button
          onClick={handleNext}
          className="p-2 rounded-full bg-muted/50 hover:bg-muted active:scale-95 transition-all touch-manipulation"
          aria-label="Next mode"
        >
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
      
      {/* Mode indicators */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-1.5 mt-2">
        {focusModes.map((mode, index) => (
          <button
            key={mode.id}
            onClick={() => setFocusMode(mode.id)}
            className={cn(
              "w-2 h-2 rounded-full transition-all touch-manipulation",
              index === currentIndex 
                ? cn(mode.bgColor, "scale-110") 
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
            aria-label={`Switch to ${mode.label} mode`}
          />
        ))}
      </div>
    </div>
  );
}
