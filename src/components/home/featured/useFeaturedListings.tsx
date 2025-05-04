
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ListingStatus } from "../../listings/StatusBadge";

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

export const useFeaturedListings = () => {
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
            ad_images (*),
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
          // Get the first image from ad_images or use default
          let imageUrl = "/placeholder.svg";
          
          if (item.ad_images && item.ad_images.length > 0) {
            imageUrl = item.ad_images[0].image_url;
          }
          
          return {
            id: item.id,
            title: item.title,
            price: item.price,
            imageUrl: imageUrl,
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

  return { realListings, isLoading, mockListings: availableMockListings };
};
