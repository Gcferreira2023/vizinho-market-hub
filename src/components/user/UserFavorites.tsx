
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { ListingStatus } from "@/components/listings/StatusBadge";
import LoadingSpinner from "@/components/ui/loading-spinner";

const UserFavorites = () => {
  const { favorites, isLoading } = useFavorites();
  
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <LoadingSpinner message="Carregando seus favoritos..." />
      </div>
    );
  }
  
  if (favorites.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="mb-4">Você ainda não possui anúncios favoritos</p>
        <Button asChild>
          <Link to="/explorar">Explorar Anúncios</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {favorites.slice(0, 4).map((fav) => {
          if (!fav.ad) return null;
          
          const imageUrl = fav.ad.ad_images && fav.ad.ad_images.length > 0
            ? fav.ad.ad_images[0].image_url
            : '/placeholder.svg';
            
          const status: ListingStatus = 
            fav.ad.status === "active" ? "disponível" :
            fav.ad.status === "reserved" ? "reservado" : "vendido";
            
          return (
            <Card key={fav.id} className="overflow-hidden">
              <div className="p-4">
                <h3 className="font-medium mb-2">{fav.ad.title}</h3>
                <p className="text-primary font-bold">
                  R$ {Number(fav.ad.price).toFixed(2)}
                </p>
                <div className="mt-4">
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link to={`/anuncio/${fav.ad.id}`}>Ver Anúncio</Link>
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      {favorites.length > 4 && (
        <div className="text-center mt-6">
          <Button asChild>
            <Link to="/favoritos">Ver todos os {favorites.length} favoritos</Link>
          </Button>
        </div>
      )}
    </>
  );
};

export default UserFavorites;
