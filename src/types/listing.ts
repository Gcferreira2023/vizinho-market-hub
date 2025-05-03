
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
