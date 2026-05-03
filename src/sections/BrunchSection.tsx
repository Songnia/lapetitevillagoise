import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeader from '@/components/SectionHeader';
import ClipImage from '@/components/ClipImage';
import { useCart } from '@/hooks/useCart';
import { useNavigate } from 'react-router';
import type { MenuItem } from '@/lib/menu-data';

gsap.registerPlugin(ScrollTrigger);

const brunchCategories = [
  {
    title: 'Variétés de Mignardises',
    items: ['Mini-burgers', 'Mini-quiches', 'Mini-pizzas', 'Mini-cupcakes', 'Nems', 'Samoussas'],
  },
  {
    title: 'Entrées',
    items: ['Salade hawaïne', 'Salade d\'avocat', 'Œuf noyé'],
  },
  {
    title: 'Plats Chauds',
    items: ['Mbongo d\'escargot', 'Taro royal', 'Ndolé grand-mère', 'Poulet braisé', 'Gombo crabe', 'Gigot de porc piqué'],
  },
  {
    title: 'Accompagnements',
    items: ['Couscous de maïs', 'Riz blanc', 'Plantain', 'Miondo', 'Manioc'],
  },
  {
    title: 'Desserts',
    items: ['Fruits de saison', 'Mousse au chocolat', 'Yaourt'],
  },
  {
    title: 'Boissons',
    items: ['Jus naturels (Bissap, Baobab, Ananas, Papaye)', 'Cocktail', 'Thé maison'],
  },
];

const pricingCards = [
  { label: 'Adulte', price: '12 500 FCFA' },
  { label: 'Enfant (-10 ans)', price: '10 000 FCFA' },
  { label: 'De 0 à 3 ans', price: 'Gratuit' },
];

export default function BrunchSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();
  const navigate = useNavigate();

  const handleDirectBooking = (item: MenuItem) => {
    addItem(item);
    navigate('/checkout');
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Categories stagger
      if (categoriesRef.current) {
        const cats = categoriesRef.current.querySelectorAll('.brunch-category');
        gsap.fromTo(cats,
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, stagger: 0.08, duration: 0.8, ease: 'power3.out',
            scrollTrigger: {
              trigger: categoriesRef.current,
              start: 'top bottom-=15%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Pricing cards
      if (pricingRef.current) {
        const cards = pricingRef.current.querySelectorAll('.price-card');
        gsap.fromTo(cards,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: 'power3.out',
            scrollTrigger: {
              trigger: pricingRef.current,
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
      id="brunch"
      className="bg-cream section-padding page-padding"
    >
      <div className="content-max-width">
        <SectionHeader
          label="TOUS LES DIMANCHES"
          labelColor="text-terracotta"
          title="Le Brunch du Dimanche"
          titleColor="text-forest"
        />

        {/* Hours badge */}
        <div className="flex justify-center -mt-10 mb-12">
          <span className="bg-forest text-cream font-body text-xs uppercase tracking-[0.15em] px-6 py-2 rounded-full">
            12h &mdash; 17h
          </span>
        </div>

        {/* Two column layout */}
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left: Image */}
          <div className="lg:w-1/2">
            <ClipImage
              src="/assets/brunch-buffet.webp"
              alt="Buffet brunch"
              aspectRatio="3/4"
              className="w-full"
            />
          </div>

          {/* Right: Menu + Pricing */}
          <div className="lg:w-1/2">
            {/* Categories */}
            <div ref={categoriesRef} className="space-y-8">
              {brunchCategories.map((cat) => (
                <div key={cat.title} className="brunch-category opacity-0">
                  <h4 className="font-body text-xs uppercase tracking-[0.15em] text-forest font-bold mb-2">
                    {cat.title}
                  </h4>
                  <p className="font-body text-base text-charcoal leading-relaxed">
                    {cat.items.join(' · ')}
                  </p>
                </div>
              ))}
            </div>

            {/* Entertainment note */}
            <p className="font-script text-[28px] text-terracotta mt-6 mb-8">
              Buffet gourmand &middot; Karaok&eacute; &middot; Piano live
            </p>

            {/* Pricing */}
            <div ref={pricingRef} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {pricingCards.map((card) => (
                <div key={card.label} className="price-card bg-forest p-6 text-center opacity-0">
                  <span className="block font-body text-xs uppercase text-cream/80 tracking-wider mb-2">
                    {card.label}
                  </span>
                  <span className="block font-display text-3xl text-saffron">
                    {card.price}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA - Dynamic Reservation */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleDirectBooking({
                  name: 'Brunch Traditionnel (Adulte)',
                  description: 'Buffet complet, Karaoké & Piano Live. Dimanche 12h-17h.',
                  price: '12 500 FCFA',
                  image: '/assets/brunch-buffet.webp',
                  category: 'Brunch'
                })}
                className="flex-1 bg-forest text-cream text-xs uppercase tracking-[0.15em] font-body font-medium px-8 py-4 rounded-full hover:bg-forest-deep transition-all duration-300 shadow-lg shadow-forest/10 active:scale-95"
              >
                Réserver (Adulte)
              </button>
              <button
                onClick={() => handleDirectBooking({
                  name: 'Brunch Traditionnel (Enfant)',
                  description: 'Buffet complet pour enfant (-10 ans). Dimanche 12h-17h.',
                  price: '10 000 FCFA',
                  image: '/assets/brunch-buffet.webp',
                  category: 'Brunch'
                })}
                className="flex-1 border border-forest text-forest text-xs uppercase tracking-[0.15em] font-body font-medium px-8 py-4 rounded-full hover:bg-forest hover:text-cream transition-all duration-300 active:scale-95"
              >
                Réserver (Enfant)
              </button>
            </div>
            
            <div className="mt-8 flex justify-center lg:justify-start">
              <a
                href={`https://wa.me/237683332131?text=${encodeURIComponent(
                  "Bonjour, je souhaiterais avoir plus d'informations sur le Brunch du Dimanche"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-forest font-body uppercase tracking-[0.15em] font-bold hover:text-terracotta transition-colors flex items-center gap-3 group"
              >
                <span className="w-8 h-[1px] bg-forest group-hover:bg-terracotta transition-colors" />
                Questions sur le brunch ? Contactez-nous
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

