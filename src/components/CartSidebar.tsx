import { Drawer } from 'vaul';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Link } from 'react-router';

export default function CartSidebar() {
  const { items, updateQuantity, removeItem, getTotalPrice, getItemCount } = useCart();

  return (
    <Drawer.Root direction="right">
      <Drawer.Trigger asChild>
        <button className="relative p-2 text-cream hover:opacity-70 transition-opacity">
          <ShoppingBag className="w-6 h-6" />
          {getItemCount() > 0 && (
            <span className="absolute -top-1 -right-1 bg-terracotta text-cream text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
              {getItemCount()}
            </span>
          )}
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[100]" />
        <Drawer.Content className="bg-cream flex flex-col rounded-l-[20px] h-full w-full max-w-md fixed bottom-0 right-0 z-[101] shadow-2xl">
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <Drawer.Title className="font-display text-3xl text-forest">Votre Panier</Drawer.Title>
              <Drawer.Close asChild>
                <button className="p-2 hover:bg-forest/5 rounded-full transition-colors">
                  <X className="w-6 h-6 text-forest" />
                </button>
              </Drawer.Close>
            </div>

            {items.length === 0 ? (
              <div className="h-[60%] flex flex-col items-center justify-center text-center p-8">
                <div className="bg-forest/5 p-8 rounded-full mb-6">
                  <ShoppingBag className="w-16 h-16 text-forest/20" />
                </div>
                <h3 className="font-display text-2xl text-forest">Votre panier est vide</h3>
                <p className="font-body text-midgray mt-2">Découvrez nos délices et commencez votre commande !</p>
                <Drawer.Close asChild>
                  <Link
                    to="/menu"
                    className="mt-8 bg-forest text-cream px-8 py-3 rounded-full font-body text-sm font-medium hover:bg-forest/90 transition-colors"
                  >
                    Voir le menu
                  </Link>
                </Drawer.Close>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.name} className="flex gap-4 p-4 bg-white rounded-2xl border border-forest/5 shadow-sm">
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-display text-lg text-charcoal truncate">{item.name}</h4>
                        <button 
                          onClick={() => removeItem(item.name)}
                          className="text-midgray hover:text-terracotta transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="font-body text-sm text-forest font-bold mt-1">{item.price}</p>
                      
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center border border-forest/10 rounded-full px-2 py-1 gap-3 bg-cream/30">
                          <button 
                            onClick={() => updateQuantity(item.name, item.quantity - 1)}
                            className="p-1 hover:bg-forest/10 rounded-full transition-colors"
                          >
                            <Minus className="w-3 h-3 text-forest" />
                          </button>
                          <span className="font-body text-sm font-bold text-forest w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.name, item.quantity + 1)}
                            className="p-1 hover:bg-forest/10 rounded-full transition-colors"
                          >
                            <Plus className="w-3 h-3 text-forest" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="p-6 bg-white border-t border-forest/10 rounded-t-[20px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between mb-4">
                <span className="font-body text-midgray">Sous-total</span>
                <span className="font-body text-xl font-bold text-forest">{getTotalPrice().toLocaleString()} FCFA</span>
              </div>
              <p className="font-body text-[10px] text-midgray mb-6 uppercase tracking-widest text-center">
                Livraison calculée à l'étape suivante
              </p>
              <Drawer.Close asChild>
                <Link
                  to="/checkout"
                  className="flex items-center justify-center gap-3 w-full bg-forest text-cream py-5 rounded-2xl font-display text-xl hover:bg-forest/90 transition-all shadow-xl shadow-forest/20 group"
                >
                  Passer à la caisse
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Drawer.Close>
            </div>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
