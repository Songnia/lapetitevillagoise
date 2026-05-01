import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import gsap from 'gsap';
import CartSidebar from './CartSidebar';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';
  
  const navLinks = [
    { label: 'Menu', href: isHome ? '#menu' : '/menu' },
    { label: 'Brunch', href: '#brunch' },
    { label: 'Événements', href: '#evenements' },
    { label: 'Galerie', href: '#galerie' },
    { label: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen && mobileMenuRef.current && linksRef.current) {
      const links = linksRef.current.querySelectorAll('a');
      gsap.fromTo(links,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, [mobileOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    
    // If it's a real route (starts with /), just navigate
    if (href.startsWith('/')) {
      navigate(href);
      return;
    }

    // If it's an anchor link
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: href } });
    } else {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Handle cross-page scrolling from home page state
  useEffect(() => {
    if (location.pathname === '/' && location.state?.scrollTo) {
      const href = location.state.scrollTo;
      const el = document.querySelector(href);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
          // Clear state after scroll
          navigate('/', { replace: true, state: {} });
        }, 100);
      }
    }
  }, [location, navigate]);

  const scrollToContact = () => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: '#contact' } });
    } else {
      const el = document.querySelector('#contact');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 w-full z-50 h-[70px] transition-all duration-400 ${
          scrolled || location.pathname !== '/'
            ? 'bg-forest/95 backdrop-blur-[8px]'
            : 'bg-transparent'
        }`}
      >
        <div className="page-padding h-full flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            className="flex items-center gap-2"
          >
            <img src="/assets/logo.png" alt="La Petite Villageoise" className="h-[40px] w-auto" />
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-cream text-sm uppercase tracking-[0.15em] font-body hover:opacity-60 transition-opacity duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right: CTA + Hamburger */}
          <div className="flex items-center gap-2 md:gap-4">
            <CartSidebar />
            
            <button
              onClick={scrollToContact}
              className="hidden lg:block border border-cream text-cream text-xs uppercase tracking-[0.15em] font-body font-medium px-7 py-2.5 rounded-full hover:bg-cream hover:text-forest transition-colors duration-200"
            >
              Réserver
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden flex flex-col gap-[6px] p-2"
              aria-label="Menu"
            >
              <span className={`block w-6 h-[2px] bg-cream transition-transform duration-300 ${mobileOpen ? 'rotate-45 translate-y-[8px]' : ''}`} />
              <span className={`block w-6 h-[2px] bg-cream transition-opacity duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-[2px] bg-cream transition-transform duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[8px]' : ''}`} />
            </button>
          </div>
        </div>
      </nav>


      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed inset-0 z-[60] bg-forest flex flex-col items-center justify-center"
        >
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-5 right-6 text-cream text-3xl"
            aria-label="Fermer"
          >
            &times;
          </button>
          <div ref={linksRef} className="flex flex-col items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-cream font-display text-4xl md:text-5xl"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => { setMobileOpen(false); scrollToContact(); }}
              className="mt-6 border border-cream text-cream text-sm uppercase tracking-[0.15em] font-body font-medium px-8 py-3 rounded-full hover:bg-cream hover:text-forest transition-colors duration-200"
            >
              Réserver
            </button>
          </div>
        </div>
      )}
    </>
  );
}

