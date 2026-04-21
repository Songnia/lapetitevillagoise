import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { number: '300', label: 'convives' },
  { number: '7j/7', label: '10h — 22h' },
  { number: 'Cuisine', label: 'camerounaise' },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Left column entrance
      if (leftRef.current) {
        gsap.fromTo(leftRef.current,
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1, ease: 'power3.out',
            scrollTrigger: {
              trigger: leftRef.current,
              start: 'top bottom-=15%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Right column entrance
      if (rightRef.current) {
        gsap.fromTo(rightRef.current,
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.15,
            scrollTrigger: {
              trigger: rightRef.current,
              start: 'top bottom-=15%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Stats stagger
      if (statsRef.current) {
        const items = statsRef.current.querySelectorAll('.stat-item');
        gsap.fromTo(items,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: 'power3.out',
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top bottom-=15%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="bg-cream section-padding page-padding"
    >
      <div className="content-max-width flex flex-col lg:flex-row gap-10 lg:gap-20">
        {/* Left Column */}
        <div ref={leftRef} className="lg:w-[35%] opacity-0">
          <span className="block font-body text-xs uppercase tracking-[0.2em] text-terracotta font-medium mb-4">
            NOTRE HISTOIRE
          </span>
          <div className="w-10 h-[2px] bg-terracotta mb-6" />
          <h2 className="font-display text-[clamp(40px,7vw,96px)] leading-[0.9] tracking-[-0.02em] text-forest">
            La Tradition Rencontre le Go&ucirc;t
          </h2>
        </div>

        {/* Right Column */}
        <div ref={rightRef} className="lg:w-[55%] lg:ml-[10%] opacity-0">
          <p className="font-body text-lg leading-relaxed text-charcoal">
            Depuis notre ouverture &agrave; Douala, La Petite Villageoise s&apos;engage &agrave; pr&eacute;server et c&eacute;l&eacute;brer les saveurs authentiques de la cuisine camerounaise. Situ&eacute;e au c&oelig;ur d&apos;Akwa, notre table accueille jusqu&apos;&agrave; 300 convives dans un cadre chaleureux et raffin&eacute; o&ugrave; chaque plat raconte une histoire. Notre cuisine traditionnelle revisite avec passion les recettes ancestrales &mdash; de l&apos;Achu au Cornfufu, du Kati-kati &agrave; l&apos;Ekwang &mdash; pour offrir une exp&eacute;rience culinaire inoubliable.
          </p>

          {/* Stats */}
          <div ref={statsRef} className="flex flex-wrap gap-12 mt-10">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-item opacity-0">
                <span className="block font-display text-5xl text-forest font-normal">
                  {stat.number}
                </span>
                <span className="block font-body text-xs uppercase text-midgray tracking-wider mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
