
import Layout from "@/components/layout/Layout";
import HeroBanner from "@/components/home/HeroBanner";
import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import FeaturedListings from "@/components/home/FeaturedListings";
import RecentListings from "@/components/home/RecentListings";
import HowItWorks from "@/components/home/HowItWorks";
import CallToAction from "@/components/home/CallToAction";
import { supabase } from "../integrations/supabase/client";
import { useEffect } from "react";

const Index = () => {

  useEffect(() => {
    async function testarConexao() {
      try {
        const { data, error } = await supabase.from("users").select("*").limit(1);
        if (error) {
          console.error("Erro ao conectar ao Supabase:", error.message);
        } else {
          console.log("Conexão com Supabase funcionando! Dados:", data);
        }
      } catch (e) {
        console.error("Erro geral:", e);
      }
    }
    
    testarConexao();
  }, []);
  
  return (
    <Layout>
      <HeroSection />
      <HeroBanner />
      <CategorySection />
      <FeaturedListings />
      <RecentListings />
      <HowItWorks />
      <CallToAction />
    </Layout>
  );
};

export default Index;
