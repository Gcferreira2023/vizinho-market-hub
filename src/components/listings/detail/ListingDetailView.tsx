
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import ListingImageGallery from "@/components/listings/ListingImageGallery";
import SellerInfo from "@/components/listings/SellerInfo";
import SecurityInfo from "@/components/listings/detail/SecurityInfo";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import ListingDetailTabs from "@/components/listings/detail/ListingDetailTabs";
import ListingHeader from "@/components/listings/detail/ListingHeader";
import SimilarListings from "@/components/listings/similar/SimilarListings";
import FavoriteButton from "@/components/listings/FavoriteButton";
import { ListingStatus } from "@/components/listings/StatusBadge";

interface ListingDetailViewProps {
  listing: any;
  displayListing: any;
  listingImages: string[];
  listingStatus: ListingStatus;
  id?: string;
  handleStatusChange: (newStatus: ListingStatus) => void;
}

const ListingDetailView = ({
  listing,
  displayListing,
  listingImages,
  listingStatus,
  id,
  handleStatusChange
}: ListingDetailViewProps) => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Explorar", href: "/explorar" },
          { label: displayListing.title }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna Esquerda - Imagens e Detalhes */}
        <div className="lg:col-span-2">
          {/* Galeria de imagens */}
          <ListingImageGallery 
            images={displayListing.images} 
            title={displayListing.title} 
            status={listingStatus}
          />

          {/* Detalhes do anúncio */}
          <Card className="p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <ListingHeader
                title={displayListing.title}
                category={displayListing.category}
                type={displayListing.type}
                rating={displayListing.rating}
                price={displayListing.price}
                status={listingStatus}
                adId={displayListing.id}
                userId={user?.id}
                ownerId={listing?.user_id || displayListing.seller.id}
                onStatusChange={handleStatusChange}
              />
              {id && (
                <FavoriteButton 
                  listingId={id} 
                  size="default" 
                  variant="outline"
                  showText
                />
              )}
            </div>

            <ListingDetailTabs
              description={displayListing.description}
              availability={displayListing.availability}
              delivery={displayListing.delivery}
              deliveryFee={displayListing.deliveryFee}
              location={displayListing.location}
              paymentMethods={displayListing.paymentMethods}
            />
          </Card>
        </div>

        {/* Coluna Direita - Informações do vendedor e ações */}
        <div className="space-y-6">
          {/* Informações do vendedor */}
          <SellerInfo 
            seller={displayListing.seller} 
            adId={id}
          />

          {/* Segurança */}
          <SecurityInfo />
        </div>
      </div>

      {/* Anúncios relacionados */}
      {listing && (
        <SimilarListings 
          currentListingId={id || ""}
          category={listing.category}
        />
      )}
    </div>
  );
};

export default ListingDetailView;
