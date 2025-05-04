
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ListingCard from "../listings/ListingCard";
import { Link } from "react-router-dom";
import { ListingStatus } from "../listings/StatusBadge";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";

// Dados de exemplo (mockup)
const mockListings = [
  {
    id: "1",
    title: "Bolo de Chocolate Caseiro",
    price: 35.90,
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
    category: "Alimentos",
    type: "produto" as const,
    rating: 4.8,
    location: "Bloco A, 101",
    status: "disponível" as ListingStatus
  },
  {
    id: "2",
    title: "Serviço de Passeio com Pets",
    price: "A combinar",
    imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb",
    category: "Serviços",
    type: "serviço" as const,
    rating: 4.5,
    location: "Bloco B, 304",
    status: "reservado" as ListingStatus
  },
  {
    id: "3",
    title: "Fones de Ouvido Bluetooth - Seminovo",
    price: 120.00,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    category: "Produtos Gerais",
    type: "produto" as const,
    rating: 4.2,
    location: "Bloco C, 202",
    status: "disponível" as ListingStatus
  },
  {
    id: "4",
    title: "Aulas de Inglês Online",
    price: 50.00,
    imageUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d",
    category: "Serviços",
    type: "serviço" as const,
    rating: 5.0,
    location: "Bloco D, 405",
    status: "disponível" as ListingStatus
  },
];

const FeaturedListings = () => {
  const [realListings, setRealListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("todos");

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
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Erro ao buscar anúncios em destaque:", error);
          return;
        }

        // Transformar os dados do banco para o formato esperado pelo ListingCard
        const formattedData = data?.map(item => {
          return {
            id: item.id,
            title: item.title,
            price: item.price,
            imageUrl: item.image_url || "https://images.unsplash.com/photo-1586769852836-bc069f19e1dc", // imagem padrão se não tiver
            category: item.category,
            type: item.type,
            location: item.users ? `${item.users.block}, ${item.users.apartment}` : "Localização não disponível",
            status: item.status === "active" ? "disponível" as ListingStatus : "vendido" as ListingStatus,
          };
        }) || [];

        setRealListings(formattedData);
      } catch (error) {
        console.error("Erro ao processar anúncios em destaque:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealListings();
  }, []);

  // Filtrar para apenas mostrar anúncios disponíveis ou reservados
  const availableMockListings = mockListings.filter(
    listing => listing.status !== "vendido"
  );

  // Combinar anúncios reais com mockups para cada categoria, sem repetir categorias
  const getCombinedListings = (filterType?: string) => {
    // Primeiro filtrar por tipo se necessário
    const filteredReal = filterType 
      ? realListings.filter(item => item.type === filterType)
      : realListings;
      
    // Se tiver 4 ou mais anúncios reais da categoria, mostrar apenas os reais
    if (filteredReal.length >= 4) {
      return filteredReal.slice(0, 4);
    }
    
    // Caso contrário, complementar com mockups
    const usedCategories = new Set(filteredReal.map(item => item.category));
    
    // Filtrar mockups por tipo (se necessário) e por categorias não usadas
    let filteredMockups = filterType
      ? availableMockListings.filter(mock => mock.type === filterType)
      : availableMockListings;
      
    // Filtrar para não repetir categorias já existentes nos reais
    filteredMockups = filteredMockups.filter(mock => !usedCategories.has(mock.category));
    
    // Combinar e retornar até 4 itens
    return [...filteredReal, ...filteredMockups].slice(0, 4);
  };

  const renderListings = (filterType?: string) => {
    const listings = getCombinedListings(filterType);
    
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-4 h-80 animate-pulse">
              <div className="h-48 bg-gray-200 rounded-md mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      );
    }
    
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listings.map((listing) => {
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
        
        {listings.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">
              Não há anúncios {filterType ? `do tipo ${filterType}` : ""} disponíveis no momento.
            </p>
          </div>
        )}
        
        {realListings.length === 0 && listings.length > 0 && (
          <div className="text-center text-gray-500 text-sm mt-2">
            Os anúncios mostrados são ilustrativos. Crie seus próprios anúncios para vê-los aqui.
          </div>
        )}
      </>
    );
  };
  
  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Anúncios em destaque</h2>
          <Link to="/explorar" className="text-primary font-medium hover:underline">
            Ver todos
          </Link>
        </div>

        <Tabs defaultValue="todos" className="mb-6" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="produtos">Produtos</TabsTrigger>
            <TabsTrigger value="servicos">Serviços</TabsTrigger>
          </TabsList>
          <TabsContent value="todos">
            {renderListings()}
          </TabsContent>
          <TabsContent value="produtos">
            {renderListings("produto")}
          </TabsContent>
          <TabsContent value="servicos">
            {renderListings("serviço")}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default FeaturedListings;
