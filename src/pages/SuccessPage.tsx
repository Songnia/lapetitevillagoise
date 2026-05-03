import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAdminStore } from '@/hooks/useAdminStore';
import { geniusPay } from '@/lib/geniuspay';
import { toast } from 'sonner';

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { addOrder, orders } = useAdminStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [reference, setReference] = useState<string | null>(null);
  const orderRecorded = useRef(false);

  useEffect(() => {
    const ref = searchParams.get('reference');
    if (!ref) {
      setStatus('error');
      return;
    }
    setReference(ref);

    const checkStatus = async () => {
      console.log("Checking status for reference:", ref);
      
      // 1. Cross-check with existing orders in Store to prevent duplicates across refreshes
      const existingOrder = orders.find(o => o.paymentRef === ref);
      if (existingOrder) {
        console.log("Order already exists in Admin Store (persisted), skipping recording.");
        orderRecorded.current = true;
        clearCart();
        setStatus('success');
        return;
      }

      try {
        const response = await geniusPay.getPaymentStatus(ref);
        console.log("Payment status response received:", response);
        
        // Check if payment is successful
        if (response.success && (
          response.data.status === 'completed' || 
          response.data.status === 'success' || 
          response.data.status === 'paid' ||
          response.data.status === 'approved'
        )) {
          
          // 2. Session guard
          if (orderRecorded.current) {
            console.log("Order already recorded in this session, skipping.");
            setStatus('success');
            return;
          }
          
          // Try to get data from API metadata first
          let orderInfo = response.data.metadata || {};
          console.log("Order info from metadata:", orderInfo);
          
          // FALLBACK: If API metadata is empty, try to get from localStorage
          if (!orderInfo.items || orderInfo.items.length === 0) {
            const localBackup = localStorage.getItem('last_pending_order');
            console.log("Attempting local backup recovery. Found:", localBackup ? "Yes" : "No");
            if (localBackup) {
              try {
                orderInfo = JSON.parse(localBackup);
                console.log("Successfully recovered order from local backup:", orderInfo);
              } catch (e) {
                console.error("Failed to parse local backup:", e);
              }
            }
          }

          // Even if we don't have items, we should try to save SOMETHING if status is success
          if (orderInfo.items || orderInfo.total) {
            console.log("Saving order to Admin Store with paymentRef:", ref);
            addOrder({
              paymentRef: ref,
              customer: orderInfo.customer || {
                name: "Client GeniusPay (Backup)",
                phone: "N/A",
                whatsapp: "N/A",
              },
              items: orderInfo.items || [],
              total: orderInfo.total || 0,
              paymentMethod: 'momo',
              delivery: orderInfo.delivery || {
                neighborhood: "N/A",
                landmark: "N/A",
                monnaie: "Paiement en ligne",
                fee: 0
              }
            });
            console.log("Order saved successfully!");
            
            // Clear the backup only after successful store recording
            localStorage.removeItem('last_pending_order');
          } else {
            console.warn("Payment successful but NO order data found.");
            // Create a minimal placeholder
            addOrder({
              paymentRef: ref,
              customer: { name: "ERREUR DATA - Voir GeniusPay", phone: ref, whatsapp: "" },
              items: [],
              total: 0,
              paymentMethod: 'momo',
              delivery: { neighborhood: "Inconnu", landmark: "Vérifier dashboard GeniusPay", monnaie: "", fee: 0 }
            });
          }

          orderRecorded.current = true;
          clearCart();
          setStatus('success');
          toast.success("Paiement confirmé !");
        } else if (response.data.status === 'failed' || response.data.status === 'expired') {
          setStatus('error');
        } else {
          // Still pending
          setTimeout(checkStatus, 3000);
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
        // On 404 or other errors, we stay in loading state while retries happen in geniuspay.ts
      }
    };

    checkStatus();
  }, [searchParams, clearCart, orders]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-12 rounded-[40px] shadow-2xl max-w-xl w-full">
          <Loader2 className="w-16 h-16 text-forest animate-spin mx-auto mb-6" />
          <h2 className="font-display text-3xl text-forest mb-2">Vérification du paiement...</h2>
          <p className="font-body text-midgray">Veuillez patienter pendant que nous confirmons votre transaction.</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-12 rounded-[40px] shadow-2xl max-w-xl w-full">
          <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="font-display text-3xl text-forest mb-2">Oups !</h2>
          <p className="font-body text-midgray mb-8">Nous n'avons pas pu confirmer votre paiement ou la transaction a échoué.</p>
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-forest text-cream py-4 rounded-2xl font-display text-xl hover:bg-forest/90 transition-all"
          >
            Réessayer le paiement
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-12 rounded-[40px] shadow-2xl max-w-xl w-full animate-in zoom-in duration-500">
        <div className="bg-forest/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-forest" />
        </div>
        <h2 className="font-display text-4xl text-forest mb-2">Paiement Réussi !</h2>
        <p className="font-body text-midgray mb-8">Votre commande est en cours de préparation.</p>
        
        <div className="bg-cream/50 rounded-2xl p-6 text-left space-y-4 mb-8">
          <div className="flex justify-between border-b border-forest/5 pb-2">
            <span className="text-xs uppercase tracking-widest text-midgray font-bold">Référence</span>
            <span className="text-sm font-body text-forest font-bold">{reference}</span>
          </div>
          <div className="flex justify-between pt-2">
            <span className="text-xs uppercase tracking-widest text-forest font-bold">Statut</span>
            <span className="text-sm font-body text-forest font-bold text-green-600">Payé</span>
          </div>
        </div>

        <p className="font-body text-sm text-midgray mb-10 leading-relaxed italic">
          "Un conseiller va vous appeler dans quelques minutes pour confirmer la livraison."
        </p>

        <button
          onClick={() => navigate('/')}
          className="w-full bg-forest text-cream py-4 rounded-2xl font-display text-xl hover:bg-forest/90 transition-all shadow-xl shadow-forest/20"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}
