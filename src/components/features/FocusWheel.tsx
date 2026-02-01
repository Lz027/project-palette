import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Code, Palette, Target } from 'lucide-react';

export type FocusMode = 'tech' | 'productive' | 'design';

interface FocusWheelProps {
  value: FocusMode;
  onChange: (mode: FocusMode) => void;
  className?: string;
}

const focusModes: { id: FocusMode; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'tech', label: 'Tech', icon: <Code className="w-5 h-5" />, color: 'bg-board-lavender' },
  { id: 'productive', label: 'Focus', icon: <Target className="w-5 h-5" />, color: 'bg-board-mint' },
  { id: 'design', label: 'Design', icon: <Palette className="w-5 h-5" />, color: 'bg-board-coral' },
];

export function FocusWheel({ value, onChange, className }: FocusWheelProps) {
  const [rotation, setRotation] = useState(0);
  
  const currentIndex = focusModes.findIndex(m => m.id === value);
  
  const handleRotate = () => {
    const nextIndex = (currentIndex + 1) % focusModes.length;
    setRotation(prev => prev + 120);
    onChange(focusModes[nextIndex].id);
  };

  return (
    <div className={cn("relative", className)}>
      {/* Center hub */}
      <button
        onClick={handleRotate}
        className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
        aria-label="Rotate focus wheel"
      >
        {/* Rotating wheel with 3 arms */}
        <div 
          className="absolute inset-2 transition-transform duration-500 ease-out"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* Arms connecting to circles */}
          {focusModes.map((mode, index) => {
            const angle = (index * 120 - 90) * (Math.PI / 180);
            const armLength = 32;
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
                    "absolute w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-300",
                    mode.color,
                    value === mode.id ? "ring-2 ring-primary ring-offset-2" : ""
                  )}
                  style={{
                    left: `calc(50% + ${endX}px - 16px)`,
                    top: `calc(50% + ${endY}px - 16px)`,
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
          <div className="w-4 h-4 rounded-full bg-primary/60 group-hover:bg-primary transition-colors" />
        </div>
      </button>
      
      {/* Current mode label */}
      <div className="text-center mt-3">
        <span className="text-sm font-medium text-muted-foreground">
          {focusModes.find(m => m.id === value)?.label} Mode
        </span>
      </div>
    </div>
  );
}
