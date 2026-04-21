import type { ReactNode } from 'react';
import { useTilt } from '@/hooks/useTilt';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

export default function TiltCard({ children, className = '' }: TiltCardProps) {
  const { containerRef, innerRef, glareRef } = useTilt({
    maxRotation: 15,
    smoothing: 0.1,
    glareOpacity: 0.15,
  });

  return (
    <div ref={containerRef} className={`${className}`}>
      <div ref={innerRef} className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
        {children}
        <div
          ref={glareRef}
          className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300"
          style={{ zIndex: 10 }}
        />
      </div>
    </div>
  );
}
