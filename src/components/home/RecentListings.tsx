import { useEffect, useState } from "react";
import ListingCard from "../listings/ListingCard";
import { Link } from "react-router-dom";
import { ListingStatus } from "../listings/StatusBadge";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";

// Dados de exemplo (mockup)
const mockRecentListings = [
  {
    id: "5",
    title: "Pão Artesanal de Fermentação Natural",
    price: 15.90,
    imageUrl: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04",
    category: "Alimentos",
    type: "produto" as const,
    rating: 4.7,
    location: "Bloco A, 302",
    status: "disponível" as ListingStatus
  },
  {
    id: "6",
    title: "Conserto de Eletrônicos",
    price: "A combinar",
    imageUrl: "https://images.unsplash.com/photo-1601524909162-ae8725290836",
    category: "Serviços",
    type: "serviço" as const,
    rating: 4.9,
    location: "Bloco B, 105",
    status: "disponível" as ListingStatus
  },
  {
    id: "7",
    title: "Plantas de Interior - Variadas",
    price: 25.00,
    imageUrl: "https://images.unsplash.com/photo-1610189378457-7c1a76b4361c",
    category: "Produtos Gerais",
    type: "produto" as const,
    rating: 4.3,
    location: "Bloco C, 408",
    status: "reservado" as ListingStatus
  },
  {
    id: "8",
    title: "Aulas de Yoga em Domicílio",
    price: 60.00,
    imageUrl: "https://images.unsplash.com/photo-1545205597-3d9d02c29597",
    category: "Serviços",
    type: "serviço" as const,
    rating: 4.8,
    location: "Bloco D, 201",
    status: "disponível" as ListingStatus
  },
];

const RecentListings = () => {
  const [realListings, setRealListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Buscar anúncios reais do banco de dados
  useEffect(() => {
    const fetchRealListings = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("ads")
          .select(`
            *,
            users!ads_user_id_fkey (name, block, apartment)
          `)
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(4);

        if (error) {
          console.error("Erro ao buscar anúncios recentes:", error);
          return;
        }

        // Transformar os dados do banco para o formato esperado pelo ListingCard
        const formattedData = data?.map(item => {
          return {
            id: item.id,
            title: item.title,
            price: item.price,
            imageUrl: "https://images.unsplash.com/photo-1586769852836-bc069f19e1dc", // imagem padrão se não tiver
            category: item.category,
            type: item.type,
            location: item.users ? `${item.users.block}, ${item.users.apartment}` : "Localização não disponível",
            status: item.status === "active" ? "disponível" as ListingStatus : "vendido" as ListingStatus,
          };
        }) || [];

        setRealListings(formattedData);
      } catch (error) {
        console.error("Erro ao processar anúncios recentes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealListings();
  }, []);

  // Filtrar para apenas mostrar anúncios disponíveis ou reservados na página inicial
  const availableMockListings = mockRecentListings.filter(
    listing => listing.status !== "vendido"
  );

  // Combinar anúncios reais com anúncios mockup para preencher os espaços vazios
  const combinedListings = () => {
    if (realListings.length >= 4) {
      // Se tiver 4 ou mais anúncios reais, mostrar apenas os reais
      return realListings.slice(0, 4);
    } else {
      // Se tiver menos de 4, complementar com mockups de categorias diferentes
      const usedCategories = new Set(realListings.map(item => item.category));
      
      // Filtrar mockups para não repetir categorias já existentes nos reais
      const filteredMockups = availableMockListings.filter(
        mock => !usedCategories.has(mock.category)
      );
      
      // Combinar os reais com os mockups complementares
      return [...realListings, ...filteredMockups].slice(0, 4);
    }
  };
  
  const listingsToShow = combinedListings();
  
  return (
    <section className="py-10 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Anúncios recentes</h2>
          <Link to="/explorar" className="text-primary font-medium hover:underline">
            Ver todos
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border p-4 h-80 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-md mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {listingsToShow.map((listing) => {
                // Verificar se é um anúncio mockup
                const isMockListing = !realListings.some(real => real.id === listing.id);
                
                return (
                  <div key={listing.id} className="relative">
                    <ListingCard 
                      {...listing} 
                      isMockListing={isMockListing}
                      linkTo={isMockListing ? "/explorar" : `/anuncio/${listing.id}`}
                    />
                    
                    {isMockListing && (
                      <Badge 
                        className="absolute top-2 left-2 z-10 bg-orange-100 text-orange-800 flex items-center gap-1"
                        variant="outline"
                      >
                        <AlertCircle size={12} />
                        Ilustrativo
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
            
            {realListings.length === 0 && (
              <div className="text-center text-gray-500 text-sm mt-2">
                Os anúncios mostrados são ilustrativos. Crie seus próprios anúncios para vê-los aqui.
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default RecentListings;
