import { useLenis } from '@/hooks/useLenis';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import HeroSection from '@/sections/HeroSection';
import AboutSection from '@/sections/AboutSection';
import MenuSection from '@/sections/MenuSection';
import BrunchSection from '@/sections/BrunchSection';
import EvenementsSection from '@/sections/EvenementsSection';
import TestimonialsSection from '@/sections/TestimonialsSection';
import GallerySection from '@/sections/GallerySection';
import ContactSection from '@/sections/ContactSection';

function App() {
  useLenis();

  return (
    <div className="relative">
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <MenuSection />
        <BrunchSection />
        <EvenementsSection />
        <TestimonialsSection />
        <GallerySection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
