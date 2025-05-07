
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import { useUserListings } from "@/hooks/useUserListings";
import ListingsStatsSummary from "@/components/user/listings/ListingsStatsSummary";
import EmptyListingsState from "@/components/user/listings/EmptyListingsState";
import ListingCardGrid from "@/components/user/listings/ListingCardGrid";

const UserListings = () => {
  const {
    userListings,
    isLoading,
    listingImages,
    translateStatus,
    userLocation,
    totalViews,
    totalListings,
    formatDate
  } = useUserListings();
    
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Meus Anúncios</h1>
            <p className="text-gray-600">Gerencie seus produtos e serviços</p>
          </div>
          <Button asChild>
            <Link to="/criar-anuncio">Criar Novo Anúncio</Link>
          </Button>
        </div>
        
        {isLoading ? (
          <>
            <div className="bg-muted/20 p-4 rounded-lg mb-6">
              <div className="animate-pulse h-16 bg-muted rounded"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </>
        ) : userListings.length > 0 ? (
          <>
            <ListingsStatsSummary 
              totalListings={totalListings} 
              totalViews={totalViews} 
            />
            
            {/* Only show grid view */}
            <div className="mb-6">
              <ListingCardGrid 
                listings={userListings}
                images={listingImages}
                userLocation={userLocation}
                translateStatus={translateStatus}
              />
            </div>
          </>
        ) : (
          <EmptyListingsState />
        )}
      </div>
    </Layout>
  );
};

export default UserListings;
