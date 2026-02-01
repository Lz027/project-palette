import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Code, Palette, Target } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export type FocusMode = 'tech' | 'productive' | 'design';

interface FocusWheelProps {
  value: FocusMode;
  onChange: (mode: FocusMode) => void;
  className?: string;
  compact?: boolean;
}

const focusModes: { id: FocusMode; label: string; icon: React.ReactNode; color: string; description: string }[] = [
  { id: 'tech', label: 'Tech', icon: <Code className="w-3 h-3" />, color: 'bg-board-lavender', description: 'Software Development' },
  { id: 'productive', label: 'Focus', icon: <Target className="w-3 h-3" />, color: 'bg-board-mint', description: 'Productivity & General' },
  { id: 'design', label: 'Design', icon: <Palette className="w-3 h-3" />, color: 'bg-board-coral', description: 'Design & Image Editing' },
];

export function FocusWheel({ value, onChange, className, compact = false }: FocusWheelProps) {
  const [rotation, setRotation] = useState(0);
  
  const currentIndex = focusModes.findIndex(m => m.id === value);
  const currentMode = focusModes.find(m => m.id === value);
  
  const handleRotate = () => {
    const nextIndex = (currentIndex + 1) % focusModes.length;
    setRotation(prev => prev + 120);
    onChange(focusModes[nextIndex].id);
  };

  const wheelSize = compact ? 'w-10 h-10' : 'w-24 h-24';
  const armLength = compact ? 12 : 32;
  const circleSize = compact ? 'w-4 h-4' : 'w-8 h-8';
  const circlePx = compact ? 8 : 16;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("relative flex items-center gap-2", className)}>
            {/* Center hub */}
            <button
              onClick={handleRotate}
              className={cn(
                "relative rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 group",
                wheelSize
              )}
              aria-label="Rotate focus wheel"
            >
              {/* Rotating wheel with 3 arms */}
              <div 
                className="absolute inset-1 transition-transform duration-500 ease-out"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                {/* Arms connecting to circles */}
                {focusModes.map((mode, index) => {
                  const angle = (index * 120 - 90) * (Math.PI / 180);
                  const endX = Math.cos(angle) * armLength;
                  const endY = Math.sin(angle) * armLength;
                  
                  return (
                    <div key={mode.id}>
                      {/* Arm line */}
                      <div 
                        className="absolute top-1/2 left-1/2 h-0.5 bg-primary/40 origin-left"
                        style={{
                          width: `${armLength}px`,
                          transform: `rotate(${index * 120 - 90}deg) translateY(-50%)`,
                        }}
                      />
                      {/* End circle */}
                      <div
                        className={cn(
                          "absolute rounded-full flex items-center justify-center shadow-sm transition-all duration-300",
                          circleSize,
                          mode.color,
                          value === mode.id ? "ring-1 ring-primary ring-offset-1" : ""
                        )}
                        style={{
                          left: `calc(50% + ${endX}px - ${circlePx}px)`,
                          top: `calc(50% + ${endY}px - ${circlePx}px)`,
                        }}
                      >
                        <span 
                          className="text-foreground"
                          style={{ transform: `rotate(${-rotation}deg)` }}
                        >
                          {mode.icon}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Center dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={cn(
                  "rounded-full bg-primary/60 group-hover:bg-primary transition-colors",
                  compact ? "w-1.5 h-1.5" : "w-4 h-4"
                )} />
              </div>
            </button>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          <p className="font-medium">{currentMode?.label} Mode</p>
          <p className="text-muted-foreground">{currentMode?.description}</p>
          <p className="text-muted-foreground mt-1">Click to rotate</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
