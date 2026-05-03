import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeader from '@/components/SectionHeader';
import ClipImage from '@/components/ClipImage';

gsap.registerPlugin(ScrollTrigger);

const events = [
  {
    title: 'Vendredi On Décompresse',
    description: "À partir de 20 personnes. Planche 'No-Stress' avec saucisse et accompagnements au choix : porc braisé, poulet braisé ou maquereau braisé.",
    image: '/assets/event-afterwork.webp',
    badge: '5 900 FCFA / pers.',
    features: [
      'Jeux de société : Ludo, cartes, Scrabble',
      'Karaoké',
      'Ambiance conviviale garantie',
    ],
  },
  {
    title: 'Ateliers & Privatisation',
    description: 'Des ateliers créatifs pour enfants le dimanche et une salle modulable pour vos événements privés ou professionnels.',
    image: '/assets/event-workshop.webp',
    badge: null,
    features: [
      'Ateliers peinture & jeux pour enfants',
      'Mariages & anniversaires',
      'Soirées d\'entreprise (jusqu\'à 300 personnes)',
      'Service traiteur & décoration sur mesure',
    ],
  },
];

export default function EvenementsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.event-card');
        gsap.fromTo(cards,
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1, stagger: 0.2, duration: 1, ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsRef.current,
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
      id="evenements"
      className="bg-forest section-padding page-padding"
    >
      <div className="content-max-width">
        <SectionHeader
          label="ÉVÉNEMENTS"
          labelColor="text-terracotta"
          title="Célébrez Chez Nous"
          titleColor="text-cream"
          description="Une salle de 300 places, un service traiteur sur mesure et une équipe passionnée pour faire de vos moments forts des souvenirs inoubliables."
          descriptionColor="text-cream/80"
        />

        <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {events.map((event) => (
            <div
              key={event.title}
              className="event-card bg-cream/5 border border-cream/10 overflow-hidden hover:-translate-y-1 transition-transform duration-300 opacity-0 flex flex-col h-full"
            >
              {/* Image with optional badge */}
              <div className="relative">
                <ClipImage
                  src={event.image}
                  alt={event.title}
                  aspectRatio="16/9"
                />
                {event.badge && (
                  <span className="absolute top-4 right-4 bg-saffron text-forest font-body text-xs font-bold px-4 py-1.5 z-10">
                    {event.badge}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col h-full">
                <h3 className="font-display text-[clamp(28px,3vw,48px)] leading-tight text-cream tracking-[-0.01em]">
                  {event.title}
                </h3>
                <p className="font-body text-base text-cream/70 mt-3 leading-relaxed">
                  {event.description}
                </p>
                  <ul className="space-y-3 mb-8 mt-4">
                    {event.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 mt-2 bg-terracotta rounded-full shrink-0" />
                        <span className="font-body text-sm text-cream/60">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto">
                    <a
                      href={`https://wa.me/237683332131?text=${encodeURIComponent(
                        `Bonjour, je souhaiterais en savoir plus sur l'événement : ${event.title}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-cream font-display text-sm uppercase tracking-wider hover:text-terracotta transition-colors group"
                    >
                      En savoir plus
                      <span className="w-8 h-[1px] bg-cream group-hover:bg-terracotta transition-colors" />
                    </a>
                  </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
