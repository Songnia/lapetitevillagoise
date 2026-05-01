import { useRef, useEffect } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeader from '@/components/SectionHeader';
import TiltCard from '@/components/TiltCard';
import ClipImage from '@/components/ClipImage';
import AddToCartButton from '@/components/AddToCartButton';
import { menuItems } from '@/lib/menu-data';

gsap.registerPlugin(ScrollTrigger);

export default function MenuSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('.menu-card');
        gsap.fromTo(cards,
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1, stagger: 0.15, duration: 1, ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top bottom-=15%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      if (buttonRef.current) {
        gsap.fromTo(buttonRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1, delay: 0.5, ease: 'power3.out',
            scrollTrigger: {
              trigger: buttonRef.current,
              start: 'top bottom-=5%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Show only 4 items on the home page preview
  const previewItems = menuItems.slice(0, 4);
  const leftItems = previewItems.filter((_, i) => i % 2 === 0);
  const rightItems = previewItems.filter((_, i) => i % 2 === 1);

  return (
    <section
      ref={sectionRef}
      id="menu"
      className="bg-forest section-padding page-padding"
    >
      <div className="content-max-width">
        <SectionHeader
          label="NOTRE MENU"
          labelColor="text-terracotta"
          title="Saveurs du Terroir"
          titleColor="text-cream"
          description="Une cuisine camerounaise authentique préparée avec amour et tradition."
          descriptionColor="text-cream/80"
        />

        {/* Staggered 2-column grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Left Column */}
          <div className="flex flex-col gap-8 md:gap-12">
            {leftItems.map((item) => (
              <TiltCard key={item.name} className="menu-card opacity-0">
                <div className="bg-cream overflow-hidden group">
                  <div className="relative overflow-hidden">
                    <ClipImage
                      src={item.image}
                      alt={item.name}
                      aspectRatio="4/3"
                    />
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-display text-2xl md:text-[clamp(28px,3vw,48px)] leading-tight text-charcoal tracking-[-0.01em]">
                          {item.name}
                        </h3>
                        <p className="font-body text-sm md:text-base text-midgray mt-2 md:mt-3 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                      <p className="font-body text-xl md:text-2xl text-forest font-medium shrink-0">
                        {item.price}
                      </p>
                    </div>
                    <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-midgray/10">
                      <AddToCartButton item={item} className="w-full py-3 md:py-4" />
                    </div>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>

          {/* Right Column (offset) */}
          <div className="flex flex-col gap-8 md:gap-12 md:mt-[120px]">
            {rightItems.map((item) => (
              <TiltCard key={item.name} className="menu-card opacity-0">
                <div className="bg-cream overflow-hidden group">
                  <div className="relative overflow-hidden">
                    <ClipImage
                      src={item.image}
                      alt={item.name}
                      aspectRatio="4/3"
                    />
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-display text-2xl md:text-[clamp(28px,3vw,48px)] leading-tight text-charcoal tracking-[-0.01em]">
                          {item.name}
                        </h3>
                        <p className="font-body text-sm md:text-base text-midgray mt-2 md:mt-3 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                      <p className="font-body text-xl md:text-2xl text-forest font-medium shrink-0">
                        {item.price}
                      </p>
                    </div>
                    <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-midgray/10">
                      <AddToCartButton item={item} className="w-full py-3 md:py-4" />
                    </div>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>

        {/* View More Button */}
        <div ref={buttonRef} className="mt-20 text-center opacity-0">
          <Link
            to="/menu"
            className="inline-block border-[1.5px] border-cream text-cream text-xs uppercase tracking-[0.15em] font-body font-medium px-12 py-4 rounded-full hover:bg-cream hover:text-forest transition-all duration-300 transform hover:scale-105"
          >
            Voir tout le menu
          </Link>
        </div>
      </div>
    </section>
  );
}

