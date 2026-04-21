import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SectionHeaderProps {
  label: string;
  labelColor?: string;
  title: string;
  titleColor?: string;
  description?: string;
  descriptionColor?: string;
  className?: string;
}

export default function SectionHeader({
  label,
  labelColor = 'text-terracotta',
  title,
  titleColor = 'text-forest',
  description,
  descriptionColor = 'text-charcoal/80',
  className = '',
}: SectionHeaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Label entrance
      if (labelRef.current) {
        gsap.fromTo(labelRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: {
              trigger: labelRef.current,
              start: 'top bottom-=15%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Title entrance with character animation
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1, ease: 'power3.out',
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top bottom-=10%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Description entrance
      if (descRef.current) {
        gsap.fromTo(descRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.2,
            scrollTrigger: {
              trigger: descRef.current,
              start: 'top bottom-=15%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={`text-center mb-16 ${className}`}>
      <span
        ref={labelRef}
        className={`inline-block font-body text-xs uppercase tracking-[0.2em] ${labelColor} font-medium mb-4 opacity-0`}
      >
        {label}
      </span>
      <h2
        ref={titleRef}
        className={`font-display text-[clamp(56px,8vw,120px)] leading-[0.9] tracking-[-0.02em] ${titleColor} opacity-0`}
      >
        {title}
      </h2>
      {description && (
        <p
          ref={descRef}
          className={`font-body text-lg leading-relaxed max-w-[600px] mx-auto mt-6 ${descriptionColor} opacity-0`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
