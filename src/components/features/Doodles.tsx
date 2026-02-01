import React from 'react';
import { cn } from '@/lib/utils';

interface DoodleProps {
  className?: string;
  style?: React.CSSProperties;
}

// Kirby-inspired star doodle
export function StarDoodle({ className }: DoodleProps) {
  return (
    <svg 
      viewBox="0 0 40 40" 
      className={cn("w-8 h-8 text-board-coral/60", className)}
      fill="currentColor"
    >
      <path d="M20 2l4.5 9.5L35 13l-7.5 7 2 10.5L20 25l-9.5 5.5 2-10.5L5 13l10.5-1.5z" />
    </svg>
  );
}

// Kirby-inspired cloud doodle
export function CloudDoodle({ className }: DoodleProps) {
  return (
    <svg 
      viewBox="0 0 60 40" 
      className={cn("w-12 h-8 text-board-lavender/50", className)}
      fill="currentColor"
    >
      <ellipse cx="20" cy="25" rx="15" ry="12" />
      <ellipse cx="35" cy="20" rx="18" ry="15" />
      <ellipse cx="50" cy="25" rx="12" ry="10" />
    </svg>
  );
}

// Cute sparkle doodle
export function SparkleDoodle({ className }: DoodleProps) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      className={cn("w-6 h-6 text-board-mint/70", className)}
      fill="currentColor"
    >
      <path d="M12 0l2 8 8 2-8 2-2 8-2-8-8-2 8-2z" />
    </svg>
  );
}

// Wavy line doodle
export function WavyDoodle({ className }: DoodleProps) {
  return (
    <svg 
      viewBox="0 0 100 20" 
      className={cn("w-24 h-5 text-primary/30", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M0 10 Q 12.5 0, 25 10 T 50 10 T 75 10 T 100 10" />
    </svg>
  );
}

// Heart doodle
export function HeartDoodle({ className, style }: DoodleProps) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      className={cn("w-6 h-6 text-board-coral/50", className)}
      style={style}
      fill="currentColor"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

// Circle doodle with face (Kirby-inspired)
export function BlobDoodle({ className }: DoodleProps) {
  return (
    <svg 
      viewBox="0 0 40 40" 
      className={cn("w-10 h-10 text-board-lavender", className)}
      fill="currentColor"
    >
      <ellipse cx="20" cy="22" rx="16" ry="14" />
      <ellipse cx="14" cy="20" rx="2" ry="2.5" fill="hsl(var(--foreground))" />
      <ellipse cx="26" cy="20" rx="2" ry="2.5" fill="hsl(var(--foreground))" />
      <ellipse cx="10" cy="24" rx="4" ry="3" className="text-board-coral/60" />
      <ellipse cx="30" cy="24" rx="4" ry="3" className="text-board-coral/60" />
    </svg>
  );
}

// Floating dots pattern
export function DotsDoodle({ className }: DoodleProps) {
  return (
    <svg 
      viewBox="0 0 40 40" 
      className={cn("w-10 h-10 text-primary/20", className)}
      fill="currentColor"
    >
      <circle cx="8" cy="8" r="3" />
      <circle cx="20" cy="12" r="2" />
      <circle cx="32" cy="8" r="2.5" />
      <circle cx="12" cy="24" r="2" />
      <circle cx="28" cy="28" r="3" />
      <circle cx="8" cy="36" r="2" />
      <circle cx="36" cy="20" r="2" />
    </svg>
  );
}

// Swirl doodle
export function SwirlDoodle({ className }: DoodleProps) {
  return (
    <svg 
      viewBox="0 0 40 40" 
      className={cn("w-8 h-8 text-board-mint/50", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M20 20 Q 25 15, 25 20 T 22 25 T 18 22 T 20 18" />
      <path d="M20 20 Q 30 10, 32 20 T 25 30 T 15 27 T 12 18 T 20 12" />
    </svg>
  );
}
