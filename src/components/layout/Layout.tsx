
import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useScrollToTop } from "@/hooks/useScrollToTop";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  // Use the hook to scroll to top on route changes
  useScrollToTop();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
