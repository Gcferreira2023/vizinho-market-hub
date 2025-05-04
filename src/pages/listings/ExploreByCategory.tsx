
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import ListingCard from "@/components/listings/ListingCard";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useIsMobile } from "@/hooks/use-mobile";

const categoryTitles: Record<string, string> = {
  alimentos: "Alimentos",
  servicos: "Serviços",
  produtos: "Produtos Gerais",
  vagas: "Vagas e Empregos"
};

const ExploreByCategory = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  
  // Nome da categoria para exibição
  const categoryTitle = categoryTitles[categoryId || ""] || "Categoria";

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from("ads")
          .select(`
            *,
            ad_images (*)
          `)
          .eq("status", "active");
          
        // Filtrar por categoria se houver uma
        if (categoryId) {
          query = query.eq("category", categoryId);
        }
        
        const { data, error } = await query
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        setListings(data || []);
      } catch (error) {
        console.error("Erro ao carregar anúncios:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchListings();
  }, [categoryId]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{categoryTitle}</h1>
            <p className="text-gray-600 mt-1">
              Explore anúncios da categoria {categoryTitle.toLowerCase()}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button asChild variant="outline">
              <Link to="/explorar">Ver todas as categorias</Link>
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <LoadingSpinner message="Carregando anúncios..." />
        ) : listings.length > 0 ? (
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
            {listings.map((listing) => {
              const imageUrl = 
                listing.ad_images && 
                listing.ad_images.length > 0 ? 
                listing.ad_images[0].image_url : 
                '/placeholder.svg';
                
              return (
                <ListingCard
                  key={listing.id}
                  id={listing.id}
                  title={listing.title}
                  price={listing.price}
                  imageUrl={imageUrl}
                  category={listing.category}
                  type={listing.type}
                  location={`${listing.user_metadata?.block || ''} ${listing.user_metadata?.apartment || ''}`}
                  status="disponível"
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <h2 className="text-xl font-medium mb-2">Nenhum anúncio encontrado</h2>
            <p className="text-gray-600 mb-6">
              Não há anúncios disponíveis para esta categoria no momento
            </p>
            <Button asChild>
              <Link to="/criar-anuncio">Seja o primeiro a anunciar</Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ExploreByCategory;
