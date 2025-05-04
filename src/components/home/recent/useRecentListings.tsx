import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ListingStatus } from "../../listings/StatusBadge";

// Mock data for when there aren't enough real listings
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
    imageUrl: "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3",
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

export const useRecentListings = () => {
  const [realListings, setRealListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real listings from database
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
          .order("created_at", { ascending: false })
          .limit(4);

        if (error) {
          console.error("Erro ao buscar anúncios recentes:", error);
          return;
        }

        // Transform database data to the format expected by ListingCard
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
        console.error("Erro ao processar anúncios recentes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealListings();
  }, []);

  // Filter to only show available or reserved listings on the home page
  const availableMockListings = mockRecentListings.filter(
    listing => listing.status !== "vendido"
  );

  // Combine real listings with mock listings to fill empty spaces
  const combinedListings = () => {
    if (realListings.length >= 4) {
      // If we have 4 or more real listings, show only the real ones
      return realListings.slice(0, 4);
    } else {
      // If we have fewer than 4, complement with mockups from different categories
      const usedCategories = new Set(realListings.map(item => item.category));
      
      // Filter mockups to avoid repeating categories already present in real listings
      const filteredMockups = availableMockListings.filter(
        mock => !usedCategories.has(mock.category)
      );
      
      // Combine real listings with complementary mockups
      return [...realListings, ...filteredMockups].slice(0, 4);
    }
  };

  return {
    realListings,
    combinedListings: combinedListings(),
    isLoading,
    mockListings: availableMockListings,
    showIllustrativeMessage: realListings.length === 0
  };
};
