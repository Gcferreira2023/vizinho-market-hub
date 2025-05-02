
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import EditProfile from "./pages/user/EditProfile";
import Messages from "./pages/messages/Messages";
import Conversation from "./pages/messages/Conversation";
import HowItWorksPage from "./pages/HowItWorksPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
            <Route path="/editar-perfil" element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            } />
            <Route path="/mensagens" element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            } />
            <Route path="/conversa/:id" element={
              <ProtectedRoute>
                <Conversation />
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
