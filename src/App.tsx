import { BrowserRouter, Routes, Route } from 'react-router';
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
import MenuPage from '@/pages/MenuPage';
import CheckoutPage from '@/pages/CheckoutPage';
import ReturnPolicyPage from '@/pages/ReturnPolicyPage';
import ScrollToTop from '@/components/ScrollToTop';

function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <MenuSection />
      <BrunchSection />
      <EvenementsSection />
      <TestimonialsSection />
      <GallerySection />
      <ContactSection />
    </>
  );
}

function App() {
  useLenis();

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="relative bg-cream min-h-screen">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/politique-de-retour" element={<ReturnPolicyPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}


export default App;

