
import { ListingStatus } from "@/components/listings/StatusBadge";

// Types for listing data
export type ListingFormData = {
  title: string;
  description: string;
  price: string;
  category: string;
  type: string;
  availability: string;
  delivery: boolean;
  deliveryFee: string;
  paymentMethods: string;
};

// Type for a listing from the database
export type Listing = {
  id: string;
  title: string;
  description?: string;
  price: number | string;
  category: string;
  type: "produto" | "serviço";
  status: ListingStatus;
  imageUrl?: string;
  location?: string;
  condominiumName?: string;
  isUserCondominium?: boolean;
  viewCount?: number;
  created_at?: string;
  view_count?: number;
  condominium_id?: string;
};

// Type for editing a listing
export type EditListingFormData = ListingFormData;

export const initialListingFormData: ListingFormData = {
  title: "",
  description: "",
  price: "",
  category: "",
  type: "produto",
  availability: "",
  delivery: false,
  deliveryFee: "0",
  paymentMethods: "Dinheiro, Pix",
};
