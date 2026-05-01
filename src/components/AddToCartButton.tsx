import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import type { MenuItem } from '@/lib/menu-data';
import { toast } from 'sonner';

interface AddToCartButtonProps {
  item: MenuItem;
  className?: string;
}

export default function AddToCartButton({ item, className = '' }: AddToCartButtonProps) {
  const addItem = useCart((state) => state.addItem);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(item);
    toast.success(`${item.name} ajouté au panier`, {
      description: "Retrouvez vos articles dans le panier.",
      position: "bottom-right",
    });
  };

  return (
    <button
      onClick={handleAdd}
      className={`group flex items-center justify-center gap-2 bg-terracotta hover:bg-terracotta/90 text-cream px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-terracotta/40 font-body text-sm font-medium ${className}`}
    >
      <ShoppingCart className="w-4 h-4 transition-transform group-hover:rotate-12" />
      <span>Ajouter au panier</span>
    </button>
  );
}

