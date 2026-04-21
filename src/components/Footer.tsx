const logoItems = [
  '/assets/logo.webp',
  '/assets/logo.webp',
  '/assets/logo.webp',
  '/assets/logo.webp',
];

export default function Footer() {
  const allLogos = [...logoItems, ...logoItems, ...logoItems];

  return (
    <footer className="bg-forest-deep pt-20 pb-12 page-padding">
      {/* Logo Marquee */}
      <div className="overflow-hidden w-full mb-10">
        <div className="flex animate-marquee whitespace-nowrap">
          {allLogos.map((logo, i) => (
            <img
              key={i}
              src={logo}
              alt="La Petite Villageoise"
              className="h-[60px] w-auto inline-block mx-8 opacity-40"
            />
          ))}
        </div>
      </div>

      {/* Footer Grid */}
      <div className="content-max-width grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
        {/* Column 1: Contact */}
        <div>
          <h4 className="font-body text-xs uppercase tracking-[0.2em] text-cream mb-4 font-medium">
            Contact
          </h4>
          <p className="font-display text-xl text-cream">(+237) 696 61 91 71</p>
          <p className="font-display text-xl text-cream mb-3">(+237) 683 33 21 31</p>
          <p className="font-body text-base text-midgray">
            Rue Castelnau, Akwa &mdash; Derri&egrave;re l&apos;h&ocirc;tel Parfait Garden, Douala
          </p>
          <p className="font-body text-base text-midgray mt-1">
            Lun &mdash; Dim : 10h &mdash; 22h
          </p>
        </div>

        {/* Column 2: Navigation */}
        <div>
          <h4 className="font-body text-xs uppercase tracking-[0.2em] text-cream mb-4 font-medium">
            Navigation
          </h4>
          <div className="flex flex-col gap-2">
            {['Menu', 'Brunch', 'Événements', 'Galerie', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')}`}
                className="font-body text-base text-midgray hover:text-cream transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        {/* Column 3: Social */}
        <div>
          <h4 className="font-body text-xs uppercase tracking-[0.2em] text-cream mb-4 font-medium">
            Suivez-nous
          </h4>
          <a
            href="https://web.facebook.com/LapetiteVillageoise"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-base text-midgray hover:text-cream transition-colors duration-200"
          >
            La Petite Villageoise
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="content-max-width border-t border-[#2D4A3E] pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
        <p className="font-body text-sm text-midgray">
          &copy; 2025 La Petite Villageoise. Tous droits r&eacute;serv&eacute;s.
        </p>
        <p className="font-body text-sm text-midgray">
          La gardienne des traditions.
        </p>
      </div>
    </footer>
  );
}
