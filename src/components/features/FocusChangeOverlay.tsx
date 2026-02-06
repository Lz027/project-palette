import React, { useEffect, useState } from 'react';
import { FocusMode, useFocus } from '@/contexts/FocusContext';
import { cn } from '@/lib/utils';

interface FocusChangeOverlayProps {
  targetMode: FocusMode | null;
  onComplete: () => void;
}

const modeColors: Record<FocusMode, string> = {
  productive: 'hsl(350, 70%, 65%)',
  design: 'hsl(45, 85%, 60%)',
  tech: 'hsl(220, 70%, 60%)',
};

const modeLabels: Record<FocusMode, string> = {
  productive: 'Productive Mode',
  design: 'Design Mode',
  tech: 'Tech Mode',
};

export function FocusChangeOverlay({ targetMode, onComplete }: FocusChangeOverlayProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showLabel, setShowLabel] = useState(false);

  useEffect(() => {
    if (targetMode) {
      setIsAnimating(true);
      setShowLabel(true);

      // Hide label after animation
      const labelTimer = setTimeout(() => setShowLabel(false), 600);
      
      // Complete animation
      const completeTimer = setTimeout(() => {
        setIsAnimating(false);
        onComplete();
      }, 800);

      return () => {
        clearTimeout(labelTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [targetMode, onComplete]);

  if (!targetMode || !isAnimating) return null;

  const color = modeColors[targetMode];

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
      {/* Multiple ripple rings for echo effect */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: '200vmax',
            height: '200vmax',
            background: `radial-gradient(circle, transparent 0%, transparent 40%, ${color}20 50%, ${color}40 60%, transparent 70%)`,
            animation: `focusRipple 0.8s ease-out forwards`,
            animationDelay: `${i * 0.1}s`,
            opacity: 0,
          }}
        />
      ))}

      {/* Mode label */}
      <div
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          "text-2xl md:text-4xl font-bold text-center transition-all duration-300",
          showLabel ? "opacity-100 scale-100" : "opacity-0 scale-110"
        )}
        style={{ color }}
      >
        {modeLabels[targetMode]}
      </div>

      <style>{`
        @keyframes focusRipple {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
