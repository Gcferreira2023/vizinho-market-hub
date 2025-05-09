
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Componente para rotas protegidas
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Páginas
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PasswordReset from "./pages/auth/PasswordReset";
import UpdatePassword from "./pages/auth/UpdatePassword";
import ExploreListings from "./pages/listings/ExploreListings";
import ListingDetail from "./pages/listings/ListingDetail";
import CreateListing from "./pages/listings/CreateListing";
import EditListing from "./pages/listings/EditListing";
import UserProfile from "./pages/user/UserProfile";
import UserListings from "./pages/user/UserListings";
import UserFavorites from "./pages/user/UserFavorites";
import EditProfile from "./pages/user/EditProfile";
import HowItWorksPage from "./pages/HowItWorksPage";

// Redirecionamento para categorias
import ExploreByCategory from "./pages/listings/ExploreByCategory";

// Páginas de informação
import TermsPage from "./pages/info/TermsPage";
import PrivacyPage from "./pages/info/PrivacyPage";
import ContactPage from "./pages/info/ContactPage";

// Componente para ScrollToTop
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" richColors closeButton />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Register />} />
            <Route path="/recuperar-senha" element={<PasswordReset />} />
            <Route path="/atualizar-senha" element={<UpdatePassword />} />
            <Route path="/explorar" element={<ExploreListings />} />
            <Route path="/anuncio/:id" element={<ListingDetail />} />
            <Route path="/como-funciona" element={<HowItWorksPage />} />
            
            {/* Rotas de categorias */}
            <Route path="/categoria/:categoryId" element={<ExploreByCategory />} />
            
            {/* Rotas de informações */}
            <Route path="/termos" element={<TermsPage />} />
            <Route path="/privacidade" element={<PrivacyPage />} />
            <Route path="/contato" element={<ContactPage />} />
            <Route path="/sobre" element={<HowItWorksPage />} />
            
            {/* Rotas protegidas (requer autenticação) */}
            <Route path="/criar-anuncio" element={
              <ProtectedRoute>
                <CreateListing />
              </ProtectedRoute>
            } />
            <Route path="/editar-anuncio/:id" element={
              <ProtectedRoute>
                <EditListing />
              </ProtectedRoute>
            } />
            <Route path="/perfil" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />
            <Route path="/meus-anuncios" element={
              <ProtectedRoute>
                <UserListings />
              </ProtectedRoute>
            } />
            <Route path="/favoritos" element={
              <ProtectedRoute>
                <UserFavorites />
              </ProtectedRoute>
            } />
            <Route path="/editar-perfil" element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            } />
            
            {/* Rota de fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
