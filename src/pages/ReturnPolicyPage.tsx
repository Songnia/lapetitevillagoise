import { ArrowLeft, ShieldCheck, Clock, RefreshCcw, AlertCircle } from 'lucide-react';
import { Link } from 'react-router';

export default function ReturnPolicyPage() {
  return (
    <div className="pt-[100px] pb-20 bg-cream min-h-screen">
      <div className="page-padding">
        <div className="content-max-width max-w-4xl mx-auto">
          <Link to="/" className="flex items-center gap-2 text-forest hover:opacity-70 transition-opacity mb-8 font-body text-sm font-medium uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>

          <h1 className="font-display text-4xl md:text-6xl text-forest mb-6">Politique de Retour</h1>
          <p className="font-body text-midgray text-lg mb-12 leading-relaxed">
            Chez La petite Villagoise, nous nous engageons à vous servir des repas d'une qualité exceptionnelle. 
            Étant donné la nature périssable de nos produits, notre politique de retour est encadrée par les règles suivantes.
          </p>

          <div className="space-y-12">
            {/* Section 1 */}
            <section className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-forest/5">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-forest/5 p-3 rounded-2xl">
                  <ShieldCheck className="w-8 h-8 text-forest" />
                </div>
                <h2 className="font-display text-2xl text-forest">Vérification à la Livraison</h2>
              </div>
              <div className="font-body text-midgray space-y-4 leading-relaxed">
                <p>
                  Nous vous recommandons vivement de vérifier le contenu de votre commande **en présence du livreur**. 
                  Toute réclamation concernant l'aspect visuel, l'emballage ou la conformité des articles doit être signalée immédiatement.
                </p>
                <div className="bg-cream/50 p-4 rounded-xl border-l-4 border-terracotta">
                  <p className="text-sm font-bold text-forest uppercase tracking-widest mb-1">Important</p>
                  <p className="text-sm">Une fois que le livreur a quitté les lieux et que la commande a été acceptée, aucune réclamation liée à l'aspect extérieur ou à des articles manquants ne pourra être traitée.</p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-forest/5">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-forest/5 p-3 rounded-2xl">
                  <AlertCircle className="w-8 h-8 text-forest" />
                </div>
                <h2 className="font-display text-2xl text-forest">Motifs de Refus Valides</h2>
              </div>
              <p className="font-body text-midgray mb-6">Vous pouvez refuser un plat ou la commande entière pour les raisons suivantes :</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Plat non conforme à la commande",
                  "Emballage ouvert ou sérieusement endommagé",
                  "Température inappropriée (plat froid alors qu'il doit être chaud)",
                  "Ingrédient allergène présent malgré votre signalement"
                ].map((reason, i) => (
                  <li key={i} className="flex items-start gap-3 bg-cream/30 p-4 rounded-xl">
                    <span className="w-2 h-2 mt-2 bg-terracotta rounded-full shrink-0" />
                    <span className="font-body text-sm text-charcoal">{reason}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Section 3 */}
            <section className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-forest/5">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-forest/5 p-3 rounded-2xl">
                  <RefreshCcw className="w-8 h-8 text-forest" />
                </div>
                <h2 className="font-display text-2xl text-forest">Options de Remboursement</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-display text-lg text-forest">Remplacement</h4>
                  <p className="font-body text-sm text-midgray">Nous préparons et livrons à nouveau votre plat sans frais supplémentaires.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-display text-lg text-forest">Bon d'achat</h4>
                  <p className="font-body text-sm text-midgray">Un crédit de la valeur du plat est ajouté à votre compte pour votre prochaine commande.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-display text-lg text-forest">Remboursement</h4>
                  <p className="font-body text-sm text-midgray">Pour les paiements par carte ou Mobile Money, le remboursement se fait sous 24h à 48h.</p>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section className="bg-forest text-cream rounded-[32px] p-8 md:p-12 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-cream/10 p-3 rounded-2xl">
                  <Clock className="w-8 h-8 text-saffron" />
                </div>
                <h2 className="font-display text-2xl">Besoin d'aide ?</h2>
              </div>
              <p className="font-body text-cream/80 mb-8 leading-relaxed">
                Notre service client est à votre disposition pour résoudre tout problème lié à votre commande. 
                Contactez-nous directement par téléphone pour une assistance immédiate.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="tel:+237696619171" className="bg-saffron text-forest px-8 py-4 rounded-2xl font-display text-lg text-center hover:bg-white transition-colors">
                  (+237) 696 61 91 71
                </a>
                <a href="https://wa.me/237683332131" target="_blank" rel="noopener noreferrer" className="bg-white/10 border border-white/20 text-cream px-8 py-4 rounded-2xl font-display text-lg text-center hover:bg-white/20 transition-colors">
                  WhatsApp Support
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
