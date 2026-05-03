import { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { useAdminStore } from '@/hooks/useAdminStore';
import DeliverySection from '@/components/DeliverySection';
import { CreditCard, Smartphone, CheckCircle2, ArrowLeft, Loader2, Truck } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { geniusPay } from '@/lib/geniuspay';

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCart();
  const { settings, addOrder } = useAdminStore();
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [deliveryData, setDeliveryData] = useState({ phone: '', landmark: '', city: '', quarter: '' });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'momo' | 'cod'>('cod');
  const [needChange, setNeedChange] = useState<string>('non');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber] = useState(() => Math.floor(1000 + Math.random() * 9000));
  const navigate = useNavigate();

  // Set default payment method when settings are loaded
  useEffect(() => {
    if (settings.isGeniusPayEnabled) {
      setPaymentMethod('momo');
    } else {
      setPaymentMethod('cod');
    }
  }, [settings.isGeniusPayEnabled]);

  const total = getTotalPrice() + deliveryPrice;

  const isValid = 
    deliveryData.phone.length >= 8 && 
    deliveryData.city !== '' && 
    deliveryData.quarter !== '';

  const handlePlaceOrder = async () => {
    if (!isValid) {
      toast.error("Veuillez remplir les informations de livraison", {
        description: "Le téléphone, la ville et le quartier sont obligatoires.",
      });
      return;
    }

    setIsProcessing(true);
    
    // Create the order object
    const orderData = {
      customer: {
        name: "Client Invité",
        phone: deliveryData.phone,
        whatsapp: deliveryData.phone.startsWith('237') ? deliveryData.phone : `237${deliveryData.phone}`,
      },
      delivery: {
        neighborhood: `${deliveryData.quarter}, ${deliveryData.city}`,
        landmark: deliveryData.landmark,
        monnaie: paymentMethod === 'cod' && needChange !== 'non' ? `Sur ${needChange} FCFA` : 'Somme exacte',
        fee: deliveryPrice,
      },
      items: items.map(item => ({
        ...item,
        quantity: item.quantity
      })),
      total: total,
      paymentMethod: paymentMethod
    };

    if (paymentMethod === 'cod') {
      // Simulate order processing for Cash on Delivery
      setTimeout(() => {
        addOrder(orderData);
        setIsProcessing(false);
        setIsSuccess(true);
        clearCart();
        toast.success("Commande enregistrée !", {
          description: "Préparez la somme exacte pour le livreur.",
        });
      }, 2500);
    } else {
      // GeniusPay Integration for Card/Momo
      try {
        const response = await geniusPay.initiatePayment({
          amount: total,
          description: `Commande #${orderNumber} - La Petite Villageoise`,
          customer: {
            name: "Client Invité",
            phone: deliveryData.phone,
          },
          success_url: `${window.location.origin}/checkout/success`,
          error_url: `${window.location.origin}/checkout?payment_error=true`,
          metadata: {
            order_number: orderNumber,
            ...orderData
          }
        });

        if (response.success && response.data.checkout_url) {
          // SAVE TEMPORARY ORDER to localStorage as backup for SuccessPage
          localStorage.setItem('last_pending_order', JSON.stringify({
            ...orderData,
            order_number: orderNumber
          }));
          
          // Redirect to GeniusPay
          window.location.href = response.data.checkout_url;
        } else {
          throw new Error("Impossible de générer l'URL de paiement");
        }
      } catch (error: any) {
        toast.error("Erreur de paiement", {
          description: error.message || "Une erreur est survenue lors de l'initialisation du paiement.",
        });
        setIsProcessing(false);
      }
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-12 rounded-[40px] shadow-2xl max-w-xl w-full animate-in zoom-in duration-500">
          <div className="bg-forest/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-forest" />
          </div>
          <h2 className="font-display text-4xl text-forest mb-2">Commande n°{orderNumber}</h2>
          <p className="font-body text-midgray mb-8">Nous avons bien reçu votre commande !</p>
          
          <div className="bg-cream/50 rounded-2xl p-6 text-left space-y-4 mb-8">
            <div className="flex justify-between border-b border-forest/5 pb-2">
              <span className="text-xs uppercase tracking-widest text-midgray font-bold">Livraison à</span>
              <span className="text-sm font-body text-forest font-bold">{deliveryData.quarter}, {deliveryData.city}</span>
            </div>
            <div className="flex justify-between border-b border-forest/5 pb-2">
              <span className="text-xs uppercase tracking-widest text-midgray font-bold">Contact</span>
              <span className="text-sm font-body text-forest font-bold">{deliveryData.phone}</span>
            </div>
            <div className="flex justify-between border-b border-forest/5 pb-2">
              <span className="text-xs uppercase tracking-widest text-midgray font-bold">Paiement</span>
              <span className="text-sm font-body text-forest font-bold">
                {paymentMethod === 'cod' ? 'À la livraison (Cash)' : paymentMethod === 'momo' ? 'Mobile Money' : 'Carte Bancaire'}
              </span>
            </div>
            {paymentMethod === 'cod' && needChange !== 'non' && (
              <div className="flex justify-between border-b border-forest/5 pb-2">
                <span className="text-xs uppercase tracking-widest text-midgray font-bold">Monnaie sur</span>
                <span className="text-sm font-body text-forest font-bold">{needChange} FCFA</span>
              </div>
            )}
            <div className="flex justify-between pt-2">
              <span className="text-xs uppercase tracking-widest text-forest font-bold">Total à payer</span>
              <span className="text-lg font-display text-terracotta">{total.toLocaleString()} FCFA</span>
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

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-display text-3xl text-forest mb-6">Votre panier est vide</h2>
        <Link to="/menu" className="bg-forest text-cream px-8 py-3 rounded-full font-body text-sm font-medium">
          Voir le menu
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-[100px] pb-20 bg-cream min-h-screen">
      <div className="page-padding">
        <div className="content-max-width">
          <Link to="/" className="flex items-center gap-2 text-forest hover:opacity-70 transition-opacity mb-8 font-body text-sm font-medium uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" />
            Continuer mes achats
          </Link>

          <h1 className="font-display text-4xl md:text-5xl text-forest mb-12">Finaliser ma commande</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Left Column: Delivery & Payment */}
            <div className="lg:col-span-2 space-y-8">
              <DeliverySection 
                onPriceChange={setDeliveryPrice} 
                onDataChange={setDeliveryData}
              />

              <div className="bg-white rounded-xl shadow-sm border border-forest/10 p-8">
                <h3 className="font-display text-xl text-forest mb-6 uppercase tracking-wider font-bold">Moyen de paiement</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {settings.isGeniusPayEnabled && (
                    <>
                      <button
                        onClick={() => setPaymentMethod('momo')}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                          paymentMethod === 'momo' ? 'border-terracotta bg-terracotta/5' : 'border-forest/5 hover:border-forest/20'
                        }`}
                      >
                        <div className={`p-3 rounded-lg ${paymentMethod === 'momo' ? 'bg-terracotta text-cream' : 'bg-forest/5 text-forest'}`}>
                          <Smartphone className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <p className="font-body font-bold text-charcoal">Mobile Money</p>
                          <p className="font-body text-xs text-midgray">Orange / MTN</p>
                        </div>
                      </button>

                      <button
                        onClick={() => setPaymentMethod('card')}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                          paymentMethod === 'card' ? 'border-terracotta bg-terracotta/5' : 'border-forest/5 hover:border-forest/20'
                        }`}
                      >
                        <div className={`p-3 rounded-lg ${paymentMethod === 'card' ? 'bg-terracotta text-cream' : 'bg-forest/5 text-forest'}`}>
                          <CreditCard className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <p className="font-body font-bold text-charcoal">Carte Bancaire</p>
                          <p className="font-body text-xs text-midgray">Visa / Mastercard</p>
                        </div>
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'cod' ? 'border-terracotta bg-terracotta/5' : 'border-forest/5 hover:border-forest/20'
                    }`}
                  >
                    <div className={`p-3 rounded-lg ${paymentMethod === 'cod' ? 'bg-terracotta text-cream' : 'bg-forest/5 text-forest'}`}>
                      <Truck className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <p className="font-body font-bold text-charcoal">À la livraison</p>
                      <p className="font-body text-xs text-midgray">Paiement Cash</p>
                    </div>
                  </button>
                </div>

                {/* Question Monnaie - Only for COD */}
                {paymentMethod === 'cod' && (
                  <div className="bg-cream/50 rounded-xl p-6 border border-forest/5 animate-in slide-in-from-top duration-300">
                    <h4 className="font-display text-sm text-forest mb-4 uppercase tracking-widest font-bold">
                      Avez-vous besoin de monnaie ?
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {['non', '2000', '5000', '10000'].map((val) => (
                        <button
                          key={val}
                          onClick={() => setNeedChange(val)}
                          className={`px-6 py-2 rounded-full font-body text-sm transition-all ${
                            needChange === val 
                              ? 'bg-forest text-cream shadow-lg' 
                              : 'bg-white text-forest border border-forest/10 hover:border-forest'
                          }`}
                        >
                          {val === 'non' ? "Non, j'ai la somme exacte" : `Sur ${val} F`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="bg-forest text-cream rounded-[32px] p-8 lg:sticky lg:top-[100px] shadow-2xl">
              <h3 className="font-display text-2xl mb-8 border-b border-cream/10 pb-4">Résumé</h3>
              <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.name} className="flex justify-between items-center gap-4 text-sm">
                    <span className="font-body opacity-80 flex-1">{item.quantity}x {item.name}</span>
                    <span className="font-body font-bold">{(parseInt(item.price.replace(/[^0-9]/g, '')) * item.quantity).toLocaleString()} F</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-t border-cream/10 pt-6 font-body">
                <div className="flex justify-between text-sm opacity-70">
                  <span>Plats</span>
                  <span>{getTotalPrice().toLocaleString()} F</span>
                </div>
                <div className="flex justify-between text-sm opacity-70">
                  <span>Livraison</span>
                  <span>{deliveryPrice.toLocaleString()} F</span>
                </div>
                <div className="flex justify-between text-2xl font-display pt-4 border-t border-cream/10">
                  <span>Total</span>
                  <span className="text-saffron">{total.toLocaleString()} F</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing || !isValid}
                className="w-full bg-saffron text-forest mt-10 py-5 rounded-2xl font-display text-xl hover:bg-white transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  !isValid ? "Infos manquantes" : "Confirmer ma commande"
                )}
              </button>

              <p className="mt-4 text-center font-body text-[10px] md:text-xs text-midgray leading-relaxed">
                En confirmant, vous acceptez nos{' '}
                <Link to="/politique-de-retour" className="text-forest font-bold underline hover:no-underline">
                  conditions de retour et de remboursement
                </Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

