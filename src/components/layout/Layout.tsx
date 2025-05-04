
import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "./Header";
import Footer from "./Footer";
import { useScrollToTop } from "@/hooks/useScrollToTop";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  // Use o hook para rolar para o topo nas mudanças de rota
  useScrollToTop();
  
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default Layout;
