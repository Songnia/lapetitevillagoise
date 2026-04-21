import { useEffect, useRef, useCallback } from 'react';

interface TiltOptions {
  maxRotation?: number;
  smoothing?: number;
  glareOpacity?: number;
}

export function useTilt(options: TiltOptions = {}) {
  const {
    maxRotation = 15,
    smoothing = 0.1,
    glareOpacity = 0.15,
  } = options;

  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const rafIdRef = useRef<number>(0);
  const isHoveringRef = useRef(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    targetRef.current = {
      x: ((mouseY - centerY) / (rect.height / 2)) * -maxRotation,
      y: ((mouseX - centerX) / (rect.width / 2)) * maxRotation,
    };
  }, [maxRotation]);

  const handleMouseEnter = useCallback(() => {
    isHoveringRef.current = true;
    if (glareRef.current) {
      glareRef.current.style.opacity = String(glareOpacity);
    }
  }, [glareOpacity]);

  const handleMouseLeave = useCallback(() => {
    isHoveringRef.current = false;
    targetRef.current = { x: 0, y: 0 };
    if (glareRef.current) {
      glareRef.current.style.opacity = '0';
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const animate = () => {
      rotationRef.current.x += (targetRef.current.x - rotationRef.current.x) * smoothing;
      rotationRef.current.y += (targetRef.current.y - rotationRef.current.y) * smoothing;

      if (innerRef.current) {
        innerRef.current.style.transform = `perspective(1000px) rotateX(${rotationRef.current.x}deg) rotateY(${rotationRef.current.y}deg)`;
      }

      if (glareRef.current && isHoveringRef.current && container) {
        const mouseX = targetRef.current.y / maxRotation * 50 + 50;
        const mouseY = targetRef.current.x / -maxRotation * 50 + 50;
        glareRef.current.style.background = `radial-gradient(circle at ${mouseX}% ${mouseY}%, rgba(245,240,232,${glareOpacity}), transparent 60%)`;
      }

      rafIdRef.current = requestAnimationFrame(animate);
    };

    rafIdRef.current = requestAnimationFrame(animate);

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(rafIdRef.current);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave, smoothing, maxRotation, glareOpacity]);

  return { containerRef, innerRef, glareRef };
}
