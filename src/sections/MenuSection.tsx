import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeader from '@/components/SectionHeader';
import TiltCard from '@/components/TiltCard';
import ClipImage from '@/components/ClipImage';

gsap.registerPlugin(ScrollTrigger);

const menuItems = [
  {
    name: 'Porc DG',
    description: 'Porc DG, servi avec ses accompagnements de viande et poisson.',
    price: '4 500 FCFA',
    image: '/assets/porc-dg.webp',
  },
  {
    name: 'Poulet DG',
    description: 'Poulet braisé, servi avec ses accompagnements de viande et poisson.',
    price: '4 500 FCFA',
    image: '/assets/poulet-dg.webp',
  },
  {
    name: 'Poisson braisé',
    description: "Poisson braisé, servi avec ses accompagnements de viande et poisson.",
    price: '5 500 FCFA',
    image: '/assets/poisson-braise.webp',
  },
  {
    name: 'Taro',
    description: 'Taro, servi avec ses accompagnements de viande et poisson.',
    price: '4 000 FCFA',
    image: '/assets/taro.webp',
  },
  {
    name: 'Sallade',
    description: "Sallade, servi avec ses accompagnements de viande et poisson.",
    price: '5 000 FCFA',
    image: '/assets/salade.webp',
  },
  {
    name: 'Ndolé',
    description: "Le plat de fête par excellence. Épinards amers mijotés avec des crevettes, du bœuf et des arachides fraîches.",
    price: '6 000 FCFA',
    image: '/assets/ndole.webp',
  },
  {
    name: 'Soupe Egussi',
    description: 'Notre soupe épaisse aux graines de melon, garnie de viande de bœuf, de poisson fumé et épices traditionnelles.',
    price: '5 500 FCFA',
    image: '/assets/dish-egussi.webp',
  },
];

export default function MenuSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Split items into left and right columns
  const leftItems = menuItems.filter((_, i) => i % 2 === 0);
  const rightItems = menuItems.filter((_, i) => i % 2 === 1);

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
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="flex flex-col gap-12">
            {leftItems.map((item) => (
              <TiltCard key={item.name} className="menu-card opacity-0">
                <div className="bg-cream overflow-hidden">
                  <ClipImage
                    src={item.image}
                    alt={item.name}
                    aspectRatio="4/3"
                  />
                  <div className="p-8">
                    <h3 className="font-display text-[clamp(28px,3vw,48px)] leading-tight text-charcoal tracking-[-0.01em]">
                      {item.name}
                    </h3>
                    <p className="font-body text-base text-midgray mt-3 leading-relaxed">
                      {item.description}
                    </p>
                    <p className="font-body text-2xl text-forest font-medium mt-4">
                      {item.price}
                    </p>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>

          {/* Right Column (offset) */}
          <div className="flex flex-col gap-12 md:mt-[120px]">
            {rightItems.map((item) => (
              <TiltCard key={item.name} className="menu-card opacity-0">
                <div className="bg-cream overflow-hidden">
                  <ClipImage
                    src={item.image}
                    alt={item.name}
                    aspectRatio="4/3"
                  />
                  <div className="p-8">
                    <h3 className="font-display text-[clamp(28px,3vw,48px)] leading-tight text-charcoal tracking-[-0.01em]">
                      {item.name}
                    </h3>
                    <p className="font-body text-base text-midgray mt-3 leading-relaxed">
                      {item.description}
                    </p>
                    <p className="font-body text-2xl text-forest font-medium mt-4">
                      {item.price}
                    </p>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
