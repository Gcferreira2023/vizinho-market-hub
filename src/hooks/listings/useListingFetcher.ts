
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import * as listingService from "@/services";

export const useListingFetcher = (listingId: string, setIsLoading: (value: boolean) => void) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchListingData = async (
    setFormData: (data: any) => void,
    setExistingImages: (images: any[]) => void,
    setImageUrls: (urls: string[]) => void
  ) => {
    if (!user || !listingId) return;
    
    try {
      setIsLoading(true);
      
      // Fetch listing data
      const adData = await listingService.fetchListing(listingId);
      
      // Check if the listing belongs to the logged in user
      if (!listingService.checkListingOwnership(adData, user.id)) {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para editar este anúncio",
          variant: "destructive"
        });
        navigate(-1);
        return;
      }
      
      // Fill form with existing data
      setFormData({
        title: adData.title || "",
        description: adData.description || "",
        price: adData.price?.toString() || "0",
        category: adData.category || "",
        type: adData.type || "produto",
        availability: adData.availability || "",
        delivery: adData.delivery || false,
        deliveryFee: adData.delivery_fee?.toString() || "0",
        paymentMethods: adData.payment_methods || "",
        // Use a type-safe way to access the property, using any as a workaround
        priceUponRequest: Boolean((adData as any).price_upon_request) || false,
      });
      
      // Fetch listing images
      const imageData = await listingService.fetchListingImages(listingId);
      
      setExistingImages(imageData || []);
      
      // Convert existing images to URLs for the image manager
      const existingUrls = (imageData || []).map(img => img.image_url);
      setImageUrls(existingUrls);
      
    } catch (error: any) {
      console.error("Erro ao carregar dados:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do anúncio",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchListingData };
};
