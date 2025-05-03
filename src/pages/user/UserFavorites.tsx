
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useFavorites, FavoriteItem } from "@/hooks/useFavorites";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ListingCard from "@/components/listings/ListingCard";
import { ListingStatus } from "@/components/listings/StatusBadge";
import { useIsMobile } from "@/hooks/use-mobile";

const UserFavorites = () => {
  const { favorites, isLoading } = useFavorites();
  const isMobile = useIsMobile();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Meus Favoritos</h1>
          <Button asChild variant="outline">
            <Link to="/perfil">Voltar ao Perfil</Link>
          </Button>
        </div>

        {isLoading ? (
          <LoadingSpinner message="Carregando seus favoritos..." />
        ) : favorites.length > 0 ? (
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
            {favorites.map((fav) => {
              // Verificar se o anúncio existe
              if (!fav.ad) return null;
              
              // Obter a primeira imagem do anúncio, ou usar um placeholder
              const imageUrl = fav.ad.ad_images && fav.ad.ad_images.length > 0
                ? fav.ad.ad_images[0].image_url
                : '/placeholder.svg';
                
              // Mapear o status do banco para o formato usado no componente
              const status: ListingStatus = 
                fav.ad.status === "active" ? "disponível" :
                fav.ad.status === "reserved" ? "reservado" : "vendido";
                
              return (
                <ListingCard
                  key={fav.id}
                  id={fav.ad.id}
                  title={fav.ad.title}
                  price={fav.ad.price}
                  imageUrl={imageUrl}
                  category={fav.ad.category}
                  type={fav.ad.type as "produto" | "serviço"}
                  location="Veja detalhes"
                  status={status}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-medium mb-2">Você ainda não possui favoritos</h2>
            <p className="text-gray-600 mb-6">Adicione anúncios aos seus favoritos para vê-los aqui</p>
            <Button asChild>
              <Link to="/explorar">Explorar Anúncios</Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserFavorites;
