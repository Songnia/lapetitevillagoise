import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ClipImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
}

export default function ClipImage({ src, alt, className = '', aspectRatio = '4/3' }: ClipImageProps) {
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(imageRef.current,
        { clipPath: 'inset(40% 0 40% 0)' },
        {
          clipPath: 'inset(0% 0 0% 0)',
          ease: 'none',
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top bottom',
            end: 'center center',
            scrub: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={imageRef}
      className={`overflow-hidden ${className}`}
      style={{ clipPath: 'inset(40% 0 40% 0)', aspectRatio }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
}
