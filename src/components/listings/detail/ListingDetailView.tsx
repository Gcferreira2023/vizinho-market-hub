
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import ListingImageGallery from "@/components/listings/ListingImageGallery";
import SellerInfo from "@/components/listings/SellerInfo";
import SecurityInfo from "@/components/listings/detail/SecurityInfo";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import ListingDetailTabs from "@/components/listings/detail/ListingDetailTabs";
import ListingHeader from "@/components/listings/detail/ListingHeader";
import SimilarListings from "@/components/listings/similar/SimilarListings";
import FavoriteButton from "@/components/listings/FavoriteButton";
import { ListingStatus } from "@/components/listings/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface ListingDetailViewProps {
  listing: any;
  displayListing: any;
  listingImages: string[];
  listingStatus: ListingStatus;
  id?: string;
  handleStatusChange: (newStatus: ListingStatus) => void;
  viewCount?: number;
}

const ListingDetailView = ({
  listing,
  displayListing,
  listingImages,
  listingStatus,
  id,
  handleStatusChange,
  viewCount = 0
}: ListingDetailViewProps) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  // Garanta que displayListing.images seja sempre um array
  const images = Array.isArray(listingImages) ? listingImages : [];
  
  // Garanta que seller seja sempre um objeto com as propriedades necessárias
  const seller = displayListing?.seller || {
    id: "",
    name: "Carregando...",
    apartment: "...",
    block: "...",
    rating: 0,
    listings: 0,
    phone: "",
    condominium: {
      name: displayListing?.condominium_name || "Desconhecido",
      id: displayListing?.condominium_id || ""
    }
  };

  // Verificar se o anúncio é do mesmo condomínio do usuário logado
  const isUserCondominium = user?.user_metadata?.condominiumId === listing?.condominium_id;
  const isOwner = user?.id === listing?.user_id;
  
  // Obter o nome do condomínio do anúncio
  const condominiumName = listing?.condominium_name || seller?.condominium?.name;

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <Breadcrumb
        items={[
          { label: "Explorar", href: "/explorar" },
          { label: displayListing?.title || "Anúncio" }
        ]}
      />

      {/* Banner de condomínio */}
      {condominiumName && (
        <div className={`mb-4 p-3 rounded-md flex items-center gap-2 ${
          isUserCondominium 
            ? 'bg-primary/10 text-primary border border-primary/20' 
            : 'bg-gray-100 text-gray-700'
        }`}>
          <MapPin size={18} />
          <div>
            <span className="font-medium">Condomínio: {condominiumName}</span>
            {isUserCondominium && (
              <Badge className="ml-2 bg-primary/20 text-primary border-primary/30">
                Seu condomínio
              </Badge>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        {/* Coluna Esquerda - Imagens e Detalhes */}
        <div className="lg:col-span-2">
          {/* Alerta de não necessidade de cadastro */}
          {!user && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 p-3 rounded-md text-sm flex items-center justify-between">
              <p>Navegue e contate vendedores sem precisar se cadastrar. Apenas anunciantes precisam criar conta.</p>
            </div>
          )}
          
          {/* Galeria de imagens */}
          <ListingImageGallery 
            images={images} 
            title={displayListing?.title || "Anúncio"} 
            status={listingStatus}
          />

          {/* Detalhes do anúncio */}
          <Card className="p-4 md:p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <ListingHeader
                title={displayListing?.title || ""}
                category={displayListing?.category || ""}
                type={displayListing?.type || "produto"}
                rating={displayListing?.rating || 0}
                price={displayListing?.price || 0}
                status={listingStatus}
                adId={displayListing?.id || ""}
                userId={user?.id}
                ownerId={listing?.user_id || seller?.id || ""}
                onStatusChange={handleStatusChange}
                condominiumName={condominiumName}
                isUserCondominium={isUserCondominium}
              />
              {id && (
                <FavoriteButton 
                  listingId={id} 
                  size={isMobile ? "sm" : "default"}
                  variant="outline"
                  showText={!isMobile}
                />
              )}
            </div>

            <ListingDetailTabs
              description={displayListing?.description || ""}
              availability={displayListing?.availability || ""}
              delivery={displayListing?.delivery || false}
              deliveryFee={displayListing?.deliveryFee || 0}
              location={displayListing?.location || ""}
              paymentMethods={displayListing?.paymentMethods || []}
            />
          </Card>
          
          {/* Em dispositivos móveis, exibir as informações do vendedor entre os detalhes e anúncios similares */}
          {isMobile && (
            <div className="space-y-4 mb-6">
              <SellerInfo 
                seller={seller} 
                adId={id || ""}
                isOwner={isOwner}
                viewCount={viewCount}
              />
              <SecurityInfo />
            </div>
          )}
        </div>

        {/* Coluna Direita - Informações do vendedor e ações */}
        {!isMobile && (
          <div className="space-y-6">
            {/* Informações do vendedor */}
            <SellerInfo 
              seller={seller} 
              adId={id || ""}
              isOwner={isOwner}
              viewCount={viewCount}
            />

            {/* Segurança */}
            <SecurityInfo />
          </div>
        )}
      </div>

      {/* Anúncios relacionados */}
      {listing && (
        <SimilarListings 
          currentListingId={id || ""}
          category={listing.category || ""}
        />
      )}
    </div>
  );
};

export default ListingDetailView;
