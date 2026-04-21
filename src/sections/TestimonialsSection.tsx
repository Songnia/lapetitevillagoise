import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeader from '@/components/SectionHeader';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote: 'Je tenais sincèrement à dire Merci à vous et à votre superbe équipe pour toute l\'assistance et la générosité. Le personnel est tellement gentil, bienveillant, agréable et très respectueux. L\'ambiance était trop top !',
    name: 'Mme Gilberte',
    detail: 'Association C.U, Douala',
  },
  {
    quote: 'Une expérience culinaire exceptionnelle ! Le Ndolé est tout simplement le meilleur de Douala. L\'accueil est chaleureux et le cadre magnifique. Un vrai bijou à Akwa.',
    name: 'Marie-Claire N.',
    detail: 'Cliente régulière',
  },
  {
    quote: 'Nous avons célébré notre mariage à La Petite Villageoise et c\'était magique. L\'équipe a tout géré à la perfection, de la décoration au menu. Nos invités parlent encore de ce soir !',
    name: 'Jean-Pierre & Estelle',
    detail: 'Mariage — Mars 2025',
  },
];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.testimonial-card');
        gsap.fromTo(cards,
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1, stagger: 0.15, duration: 1, ease: 'power3.out',
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
      className="bg-cream section-padding page-padding"
    >
      <div className="content-max-width">
        <SectionHeader
          label="TÉMOIGNAGES"
          labelColor="text-terracotta"
          title="Ils Nous Ont Aimés"
          titleColor="text-forest"
        />

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="testimonial-card bg-white p-10 border-t-[3px] border-terracotta border-b border-lightgray hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(27,67,50,0.08)] transition-all duration-300 opacity-0"
            >
              {/* Quote mark */}
              <span className="block font-display text-7xl text-terracotta/30 leading-[0.5] mb-2">
                &ldquo;
              </span>

              {/* Quote text */}
              <p className="font-display text-2xl italic text-charcoal leading-relaxed">
                {t.quote}
              </p>

              {/* Stars */}
              <div className="flex gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#E8A838">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              {/* Divider */}
              <div className="w-10 h-px bg-lightgray mt-4 mb-4" />

              {/* Author */}
              <span className="block font-body text-xs font-bold text-forest uppercase tracking-wider">
                {t.name}
              </span>
              <span className="block font-body text-xs text-midgray mt-1">
                {t.detail}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
