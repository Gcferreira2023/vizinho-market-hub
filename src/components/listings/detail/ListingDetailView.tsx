
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ListingImageGallery } from "@/components/listings/detail/ListingImageGallery";
import ListingDetailTabs from "./ListingDetailTabs";
import ContactSeller from "./ContactSeller";
import StatusBadge, { mapStatusFromDB } from "../StatusBadge";
import ListingHeader from "./ListingHeader";

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
      {/* Status controls for owner */}
      <div className="flex justify-end mb-4">
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
          {/* Listing Header with Price */}
          <ListingHeader
            title={listing.title}
            category={listing.category}
            type={listing.type}
            rating={4.5}
            price={listing.price}
            priceUponRequest={listing.price_upon_request}
            status={mapStatusFromDB(listingStatus)}
            adId={id || ''}
            userId={user?.id}
            ownerId={listing.user_id}
            onStatusChange={handleStatusChange}
            condominiumName={displayListing.condominium_name}
            isUserCondominium={user?.user_metadata?.condominiumId === listing.condominium_id}
          />
          
          {/* Status Badge */}
          <div className="mb-6">
            <StatusBadge status={mapStatusFromDB(listingStatus)} />
          </div>
          
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
