import { BrowserRouter, Routes, Route, useLocation } from 'react-router';
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
import AdminPage from '@/pages/AdminPage';
import LoginPage from '@/pages/LoginPage';
import ScrollToTop from '@/components/ScrollToTop';
import { useAdminStore } from '@/hooks/useAdminStore';
import { Navigate } from 'react-router';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAdminStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
}

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

import SuccessPage from '@/pages/SuccessPage';

function AppContent() {
  useLenis();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="relative bg-cream min-h-screen">
      <ScrollToTop />
      {!isAdmin && <Navigation />}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout/success" element={<SuccessPage />} />
          <Route path="/politique-de-retour" element={<ReturnPolicyPage />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

