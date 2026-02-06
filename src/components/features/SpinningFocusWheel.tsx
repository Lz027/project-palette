import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Code, Palette, Target } from 'lucide-react';
import { useFocus } from '@/contexts/FocusContext';
import type { FocusMode } from '@/contexts/FocusContext';

interface SpinningFocusWheelProps {
  className?: string;
}

const focusModes: { id: FocusMode; label: string; icon: React.ReactNode; color: string; bgColor: string }[] = [
  { id: 'tech', label: 'Tech', icon: <Code className="w-4 h-4" />, color: 'text-blue-500', bgColor: 'bg-blue-500' },
  { id: 'productive', label: 'Focus', icon: <Target className="w-4 h-4" />, color: 'text-rose-500', bgColor: 'bg-rose-500' },
  { id: 'design', label: 'Design', icon: <Palette className="w-4 h-4" />, color: 'text-amber-500', bgColor: 'bg-amber-500' },
];

export function SpinningFocusWheel({ className }: SpinningFocusWheelProps) {
  const { focusMode, setFocusMode } = useFocus();
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startAngle, setStartAngle] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);
  
  const currentIndex = focusModes.findIndex(m => m.id === focusMode);
  const currentMode = focusModes[currentIndex];

  const getAngle = (e: React.Touch | React.MouseEvent) => {
    if (!wheelRef.current) return 0;
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const clientX = 'touches' in e ? (e as unknown as React.Touch).clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? (e as unknown as React.Touch).clientY : (e as React.MouseEvent).clientY;
    return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
  };

  const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    const touch = 'touches' in e ? e.touches[0] : e;
    setStartAngle(getAngle(touch as React.Touch) - rotation);
  };

  const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    const touch = 'touches' in e ? e.touches[0] : e;
    const currentAngle = getAngle(touch as React.Touch);
    setRotation(currentAngle - startAngle);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // Snap to nearest mode (every 120 degrees)
    const normalizedRotation = ((rotation % 360) + 360) % 360;
    const modeIndex = Math.round(normalizedRotation / 120) % 3;
    const snappedRotation = modeIndex * 120;
    
    setRotation(snappedRotation);
    
    // Map rotation to mode
    const modes: FocusMode[] = ['tech', 'productive', 'design'];
    const selectedMode = modes[modeIndex];
    if (selectedMode !== focusMode) {
      setFocusMode(selectedMode);
    }
  };

  const handleClick = () => {
    // Quick tap cycles through modes
    const nextIndex = (currentIndex + 1) % focusModes.length;
    setRotation((nextIndex) * 120);
    setFocusMode(focusModes[nextIndex].id);
  };

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      {/* Spinning Wheel */}
      <div
        ref={wheelRef}
        className="relative w-20 h-20 cursor-grab active:cursor-grabbing touch-none"
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={() => isDragging && handleEnd()}
        onClick={!isDragging ? handleClick : undefined}
      >
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-2 border-border bg-card shadow-lg">
          {/* Rotating segments */}
          <div
            className={cn(
              "absolute inset-1 transition-transform",
              !isDragging && "duration-300 ease-out"
            )}
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {focusModes.map((mode, index) => {
              const angle = index * 120 - 90;
              const radians = angle * (Math.PI / 180);
              const x = Math.cos(radians) * 24;
              const y = Math.sin(radians) * 24;
              
              return (
                <div
                  key={mode.id}
                  className={cn(
                    "absolute w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all",
                    mode.bgColor,
                    "text-white"
                  )}
                  style={{
                    left: `calc(50% + ${x}px - 16px)`,
                    top: `calc(50% + ${y}px - 16px)`,
                  }}
                >
                  <span
                    className="transition-transform"
                    style={{ transform: `rotate(${-rotation}deg)` }}
                  >
                    {mode.icon}
                  </span>
                </div>
              );
            })}
          </div>
          
          {/* Center indicator */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className={cn(
              "w-6 h-6 rounded-full border-2 border-background shadow-inner",
              currentMode.bgColor
            )} />
          </div>
        </div>
        
        {/* Selection indicator (top) */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-primary" />
      </div>
      
      {/* Current mode label */}
      <div className="text-center">
        <p className={cn("text-sm font-semibold", currentMode.color)}>
          {currentMode.label}
        </p>
      </div>
    </div>
  );
}
