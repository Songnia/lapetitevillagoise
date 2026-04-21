import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeader from '@/components/SectionHeader';

gsap.registerPlugin(ScrollTrigger);

const galleryImages = [
  { src: '/assets/gallery-restaurant-front.jpg', alt: 'Façade du restaurant', aspect: '16/9' as const },
  { src: '/assets/gallery-table-setting.png', alt: 'Table dressée', aspect: '3/4' as const },
  { src: '/assets/gallery-food-platter.png', alt: 'Plat à partager', aspect: '16/9' as const },
  { src: '/assets/gallery-detail.png', alt: 'Détail culinaire', aspect: '3/4' as const },
  { src: '/assets/gallery-staff1.jpeg', alt: 'Ambiance brunch', aspect: '16/9' as const },
  { src: '/assets/gallery-staff.jpeg', alt: 'Notre équipe', aspect: '3/4' as const },
];

export default function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (gridRef.current) {
        const items = gridRef.current.querySelectorAll('.gallery-item');
        gsap.fromTo(items,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out',
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

  return (
    <section
      ref={sectionRef}
      id="galerie"
      className="bg-forest section-padding page-padding"
    >
      <div className="content-max-width">
        <SectionHeader
          label="GALERIE"
          labelColor="text-terracotta"
          title="Nos Moments"
          titleColor="text-cream"
        />

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryImages.map((img, i) => (
            <div
              key={i}
              className={`gallery-item overflow-hidden opacity-0 ${
                img.aspect === '3/4' ? 'row-span-1' : ''
              }`}
            >
              <div className="overflow-hidden h-full">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-400"
                  style={{ aspectRatio: img.aspect }}
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
