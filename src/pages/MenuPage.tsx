import { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import SectionHeader from '@/components/SectionHeader';
import { useAdminStore } from '@/hooks/useAdminStore';
import TiltCard from '@/components/TiltCard';
import ClipImage from '@/components/ClipImage';
import AddToCartButton from '@/components/AddToCartButton';
import { Search, X, UtensilsCrossed } from 'lucide-react';

const CATEGORIES = ['Toutes', 'Traditionnel', 'Plats Signature', 'Grillades', 'Entrées'];

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const { outOfStockItems, menuItems } = useAdminStore();

  // Filtering Logic - More robust
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const isAvailable = !outOfStockItems.includes(item.name);
      const search = searchQuery.toLowerCase().trim();
      const matchesSearch = !search || 
                          item.name.toLowerCase().includes(search) || 
                          item.description.toLowerCase().includes(search);
      
      const matchesCategory = selectedCategory === 'Toutes' || 
                            item.category?.trim() === selectedCategory.trim();
      
      return isAvailable && matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, outOfStockItems]);

  // Animation logic with better cleanup
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll('.menu-card-item');
      if (cards && cards.length > 0) {
        // Reset state before animating
        gsap.set(cards, { y: 20, opacity: 0 });
        
        gsap.to(cards, { 
          y: 0, 
          opacity: 1, 
          stagger: 0.05, 
          duration: 0.4, 
          ease: 'power2.out',
          overwrite: true
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [filteredItems]); 

  return (
    <div ref={sectionRef} className="pt-[100px] pb-20 bg-cream min-h-screen">
      <div className="page-padding">
        <div className="content-max-width">
          <SectionHeader
            label="MENU COMPLET"
            labelColor="text-terracotta"
            title="Toutes nos Saveurs"
            titleColor="text-forest"
            description="Explorez l'intégralité de notre carte, des entrées aux desserts, pour un voyage culinaire inoubliable."
            descriptionColor="text-midgray"
          />

          {/* Search and Filters Bar */}
          <div className="mt-12 flex flex-col gap-6">
            <div className="relative max-w-2xl mx-auto w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-midgray group-focus-within:text-forest transition-colors" />
              <input
                type="text"
                placeholder="Rechercher un plat, un ingrédient..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-forest/10 rounded-2xl pl-12 pr-12 py-4 font-body text-charcoal focus:outline-none focus:border-forest/30 focus:ring-4 focus:ring-forest/5 transition-all shadow-sm"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-cream rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-midgray" />
                </button>
              )}
            </div>

            <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar gap-2 justify-start sm:justify-center">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-body text-sm whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === category 
                    ? 'bg-forest text-cream shadow-lg shadow-forest/20 scale-105' 
                    : 'bg-white text-midgray border border-forest/10 hover:border-forest/30 hover:bg-forest/5'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Grid Container */}
          <div className="mt-12 min-h-[400px]">
            {filteredItems.length > 0 ? (
              <div 
                key={`${selectedCategory}-${searchQuery}`} // Force re-mount on filter for cleaner transition
                ref={gridRef}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
              >
                {filteredItems.map((item) => (
                  <div key={item.name} className="menu-card-item opacity-0">
                    <TiltCard>
                      <div className="bg-white border border-forest/5 overflow-hidden group h-full flex flex-row md:flex-col shadow-sm hover:shadow-xl hover:border-forest/10 transition-all rounded-2xl md:rounded-3xl">
                        {/* Image */}
                        <div className="relative overflow-hidden w-28 h-28 min-w-[112px] sm:w-32 sm:h-32 sm:min-w-[128px] md:w-full md:h-auto md:aspect-square">
                          <ClipImage
                            src={item.image}
                            alt={item.name}
                            aspectRatio="1/1"
                          />
                          {item.category && (
                            <div className="absolute top-2 left-2 hidden md:block">
                              <span className="bg-forest/90 backdrop-blur-sm text-cream text-[10px] px-2 py-1 rounded-full font-body uppercase tracking-wider">
                                {item.category}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* Content */}
                        <div className="p-4 md:p-6 flex flex-col flex-1 min-w-0">
                          <div className="flex flex-col justify-between items-start gap-1 mb-2">
                            <h3 className="font-display text-base md:text-lg text-charcoal leading-tight truncate w-full group-hover:text-forest transition-colors">
                              {item.name}
                            </h3>
                            <p className="font-body text-lg md:text-xl text-forest font-bold">
                              {item.price}
                            </p>
                          </div>
                          
                          <p className="font-body text-xs md:text-sm text-midgray line-clamp-2 mb-4 flex-1">
                            {item.description}
                          </p>
                          
                          <div className="flex flex-col gap-3">
                            <a
                              href={`https://wa.me/237683332131?text=${encodeURIComponent(
                                `Bonjour, je souhaiterais avoir plus d'informations sur le plat : ${item.name}`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] md:text-xs text-forest font-body uppercase tracking-[0.1em] font-bold hover:text-terracotta transition-colors flex items-center gap-2 group/wa"
                            >
                              <span className="w-4 h-[1px] bg-forest group-hover/wa:bg-terracotta transition-colors" />
                              En savoir plus
                            </a>
                            <AddToCartButton item={item} className="w-full py-2.5 md:py-3 text-sm" />
                          </div>
                        </div>
                      </div>
                    </TiltCard>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <div className="bg-forest/5 p-6 rounded-full mb-6">
                  <UtensilsCrossed className="w-12 h-12 text-forest/20" />
                </div>
                <h3 className="font-display text-2xl text-charcoal mb-2">Aucun plat trouvé</h3>
                <p className="font-body text-midgray max-w-xs mx-auto mb-8">
                  Désolé, nous n'avons trouvé aucun plat correspondant à "{searchQuery || selectedCategory}".
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('Toutes');
                  }}
                  className="bg-forest text-cream px-8 py-3 rounded-xl font-display hover:bg-forest-deep transition-all shadow-lg shadow-forest/10"
                >
                  Voir tout le menu
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
