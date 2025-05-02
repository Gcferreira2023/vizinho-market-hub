
import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import SupabaseConnectionTest from "../utils/SupabaseConnectionTest";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto mt-4">
        <SupabaseConnectionTest />
      </div>
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
