import { useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLSpanElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Step 1: Nav already handled in Navigation component
      // Step 2: Title words slide up
      if (titleRef.current) {
        const words = titleRef.current.querySelectorAll('.word');
        tl.fromTo(words,
          { y: '100%' },
          { y: '0%', stagger: 0.08, duration: 1.2 },
          0.2
        );
      }

      // Step 3: Subtitle
      if (subtitleRef.current) {
        tl.fromTo(subtitleRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          0.5
        );
      }

      // Step 4: Tagline
      if (taglineRef.current) {
        tl.fromTo(taglineRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          0.7
        );
      }

      // Step 5: CTA
      if (ctaRef.current) {
        tl.fromTo(ctaRef.current,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1, ease: 'power2.out' },
          0.9
        );
      }

      // Step 6: Bottom bar
      if (bottomBarRef.current) {
        tl.fromTo(bottomBarRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: 'power2.out' },
          1.1
        );
      }

      // Step 7: Background fade in
      if (bgRef.current) {
        tl.fromTo(bgRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 2, ease: 'none' },
          0
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToMenu = () => {
    const el = document.querySelector('#menu');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} className="relative w-full min-h-[100dvh] overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div ref={bgRef} className="absolute inset-0 z-0 opacity-0">
        <img
          src="/assets/hero-bg.webp"
          alt="Intérieur du restaurant"
          className="w-full h-full object-cover"
        />
        {/* Overlay gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(20, 46, 34, 0.55) 0%, rgba(20, 46, 34, 0.3) 40%, rgba(20, 46, 34, 0.6) 100%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-[90vw] pt-[70px]">
        {/* Title */}
        <h1
          ref={titleRef}
          className="font-display text-[clamp(40px,10vw,120px)] leading-[0.9] tracking-[-0.02em] text-cream uppercase font-normal overflow-hidden"
        >
          {'LA PETITE VILLAGEOISE'.split(' ').map((word, i) => (
            <span key={i} className="inline-block overflow-hidden mx-[0.15em]">
              <span className="word inline-block">{word}</span>
            </span>
          ))}
        </h1>

        {/* Cursive Subtitle */}
        <span
          ref={subtitleRef}
          className="block font-script text-[clamp(32px,5vw,56px)] text-saffron mt-4 opacity-0"
        >
          Douala
        </span>

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="font-body text-base md:text-lg text-cream/80 uppercase tracking-[0.1em] mt-6 opacity-0"
        >
          La gardienne des traditions
        </p>

        {/* CTA */}
        <button
          ref={ctaRef}
          onClick={scrollToMenu}
          className="mt-10 border-[1.5px] border-cream text-cream text-xs uppercase tracking-[0.15em] font-body font-medium px-10 py-3.5 rounded-full hover:bg-cream hover:text-forest transition-colors duration-250 opacity-0"
        >
          D&eacute;couvrir Notre Menu
        </button>
      </div>

      {/* Bottom Info Bar */}
      <div
        ref={bottomBarRef}
        className="absolute bottom-0 left-0 w-full h-[60px] bg-forest/30 backdrop-blur-[4px] flex items-center justify-between page-padding opacity-0 z-10"
      >
        <span className="font-body text-xs text-cream tracking-wider flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          (+237) 696 61 91 71
        </span>
        <span className="hidden md:flex font-body text-xs text-cream/70 tracking-wider items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Lun &mdash; Dim : 10h &mdash; 22h
        </span>
        <span className="font-body text-xs text-cream tracking-wider flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          Akwa, Douala
        </span>
      </div>
    </section>
  );
}
