
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import ListingImageGallery from "./ListingImageGallery";
import ListingDetailTabs from "./ListingDetailTabs";
import ContactSeller from "./ContactSeller";
import StatusBadge, { mapStatusFromDB } from "../StatusBadge";

const ListingDetailView = ({
  listing,
  displayListing,
  listingImages,
  listingStatus,
  id,
  handleStatusChange,
  viewCount = 0
}: {
  listing: any;
  displayListing: any;
  listingImages: string[];
  listingStatus: string;
  id?: string;
  handleStatusChange: (newStatus: string) => void;
  viewCount?: number;
}) => {
  const { user } = useAuth();
  const isOwner = user?.id === listing?.user_id;
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Título do anúncio */}
      <h1 className="text-2xl font-bold mb-4">{listing.title}</h1>
      
      {/* Badge de status e controles do proprietário */}
      <div className="flex items-center justify-between mb-4">
        <StatusBadge status={mapStatusFromDB(listingStatus)} />
        
        {isOwner && (
          <div className="space-x-2">
            <button 
              onClick={() => handleStatusChange(listingStatus === 'active' ? 'reserved' : 'active')}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {listingStatus === 'active' ? 'Marcar como Reservado' : 'Marcar como Ativo'}
            </button>
            <button 
              onClick={() => handleStatusChange('sold')}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Marcar como Vendido
            </button>
          </div>
        )}
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
          {/* Galeria de imagens */}
          <ListingImageGallery images={listingImages} />
          
          {/* Abas de detalhes e informações */}
          <ListingDetailTabs
            listing={displayListing}
            viewCount={viewCount}
          />
        </div>
        
        {/* Coluna da direita com informações de contato */}
        <div className="w-full lg:w-1/3">
          <ContactSeller listing={displayListing} />
        </div>
      </div>
    </div>
  );
};

export default ListingDetailView;
