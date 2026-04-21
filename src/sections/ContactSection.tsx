import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeader from '@/components/SectionHeader';

gsap.registerPlugin(ScrollTrigger);

const services = [
  'Restaurant sur place',
  'Vente à emporter',
  'Service traiteur',
  "Organisation d'événements",
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    subject: 'Réservation de table',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (leftRef.current) {
        const blocks = leftRef.current.querySelectorAll('.contact-block');
        gsap.fromTo(blocks,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: 'power3.out',
            scrollTrigger: {
              trigger: leftRef.current,
              start: 'top bottom-=15%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      if (formRef.current) {
        gsap.fromTo(formRef.current,
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2,
            scrollTrigger: {
              trigger: formRef.current,
              start: 'top bottom-=15%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="bg-cream section-padding page-padding"
    >
      <div className="content-max-width">
        <SectionHeader
          label="CONTACT"
          labelColor="text-terracotta"
          title="Réservez Votre Table"
          titleColor="text-forest"
          description="Pour toute réservation, commande à emporter ou demande de devis traiteur, contactez-nous directement ou remplissez le formulaire ci-dessous."
          descriptionColor="text-charcoal/80"
        />

        <div className="flex flex-col lg:flex-row gap-16 mt-12">
          {/* Left: Contact Info */}
          <div ref={leftRef} className="lg:w-[60%] space-y-8">
            {/* Phone */}
            <div className="contact-block opacity-0">
              <span className="block font-body text-xs uppercase text-midgray tracking-wider mb-2">
                Téléphone
              </span>
              <a href="tel:+237696619171" className="block font-display text-3xl text-forest hover:text-terracotta transition-colors">
                (+237) 696 61 91 71
              </a>
              <a href="tel:+237683332131" className="block font-display text-3xl text-forest hover:text-terracotta transition-colors">
                (+237) 683 33 21 31
              </a>
            </div>

            {/* Address */}
            <div className="contact-block opacity-0">
              <span className="block font-body text-xs uppercase text-midgray tracking-wider mb-2">
                Adresse
              </span>
              <span className="block font-display text-2xl text-forest">
                Rue Castelnau, Akwa
              </span>
              <span className="block font-body text-base text-midgray">
                Derri&egrave;re l&apos;h&ocirc;tel Parfait Garden, Douala
              </span>
            </div>

            {/* Hours */}
            <div className="contact-block opacity-0">
              <span className="block font-body text-xs uppercase text-midgray tracking-wider mb-2">
                Horaires
              </span>
              <span className="block font-display text-2xl text-forest">
                Lundi &mdash; Dimanche
              </span>
              <span className="block font-body text-base text-midgray">
                10h00 &mdash; 22h00
              </span>
            </div>

            {/* Services */}
            <div className="contact-block opacity-0">
              <span className="block font-body text-xs uppercase text-midgray tracking-wider mb-2">
                Services
              </span>
              <div className="flex flex-wrap gap-3">
                {services.map((service) => (
                  <span key={service} className="flex items-center gap-2 font-body text-base text-charcoal">
                    <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div ref={formRef} className="lg:w-[40%] opacity-0">
            <div className="bg-white border border-lightgray p-12">
              {submitted ? (
                <div className="text-center py-12">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1B4332" strokeWidth="2" className="mx-auto mb-4">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <h3 className="font-display text-2xl text-forest mb-2">Message envoyé !</h3>
                  <p className="font-body text-midgray">Nous vous recontacterons très bientôt.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block font-body text-sm text-charcoal mb-1.5">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      placeholder="Votre nom"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full h-[52px] border border-lightgray px-4 font-body text-base text-charcoal focus:border-forest focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-body text-sm text-charcoal mb-1.5">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      placeholder="(+237) 6XX XX XX XX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full h-[52px] border border-lightgray px-4 font-body text-base text-charcoal focus:border-forest focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-body text-sm text-charcoal mb-1.5">
                      Objet
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full h-[52px] border border-lightgray px-4 font-body text-base text-charcoal focus:border-forest focus:outline-none transition-colors bg-white"
                    >
                      <option>Réservation de table</option>
                      <option>Commande à emporter</option>
                      <option>Demande de devis traiteur</option>
                      <option>Événement privé</option>
                      <option>Autre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-body text-sm text-charcoal mb-1.5">
                      Message
                    </label>
                    <textarea
                      placeholder="Décrivez votre demande..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full h-[120px] border border-lightgray px-4 py-3 font-body text-base text-charcoal focus:border-forest focus:outline-none transition-colors resize-none"
                      rows={4}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full h-[52px] bg-forest text-cream font-body text-xs uppercase tracking-[0.15em] font-medium hover:bg-forest-deep transition-colors duration-200"
                  >
                    Envoyer
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
