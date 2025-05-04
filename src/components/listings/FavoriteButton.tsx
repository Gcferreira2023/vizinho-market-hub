
import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface FavoriteButtonProps {
  listingId: string;
  className?: string;
  size?: 'sm' | 'default' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'ghost';
  showText?: boolean;
}

const FavoriteButton = ({
  listingId,
  className = '',
  size = 'default',
  variant = 'outline',
  showText = false
}: FavoriteButtonProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Usar try/catch para obter o contexto de autenticação
  let authContext;
  try {
    authContext = useAuth();
  } catch (error) {
    // Se o contexto não estiver disponível, continuamos sem ele
    console.log("AuthContext não disponível para FavoriteButton");
  }
  
  // Extrair o usuário do contexto de autenticação, se disponível
  const user = authContext?.user || null;

  useEffect(() => {
    if (user) {
      checkIfFavorite();
    }
  }, [user, listingId]);

  const checkIfFavorite = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('ad_id', listingId)
        .maybeSingle();
        
      if (error) {
        console.error('Error checking favorite:', error);
        return;
      }
      
      setIsFavorite(!!data);
    } catch (error) {
      console.error('Unexpected error checking favorite:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Atenção",
        description: "Você precisa estar logado para favoritar anúncios",
        variant: "warning"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isFavorite) {
        // Remove dos favoritos
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('ad_id', listingId);
        
        if (error) throw error;
        
        setIsFavorite(false);
        toast({
          title: "Removido dos favoritos",
          description: "Anúncio removido da sua lista de favoritos"
        });
      } else {
        // Adiciona aos favoritos
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            ad_id: listingId
          });
        
        if (error) throw error;
        
        setIsFavorite(true);
        toast({
          title: "Adicionado aos favoritos",
          description: "Anúncio adicionado à sua lista de favoritos"
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: `Não foi possível ${isFavorite ? 'remover dos' : 'adicionar aos'} favoritos: ${error.message}`,
        variant: "destructive"
      });
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={`${className} ${isFavorite ? 'text-red-500 hover:text-red-700' : ''}`}
      onClick={(e) => {
        e.preventDefault();  // Impedir navegação ao clicar no botão dentro de um link
        e.stopPropagation(); // Evitar propagação do evento
        toggleFavorite();
      }}
      disabled={isLoading}
    >
      {isFavorite ? (
        <Heart className="h-5 w-5 fill-current" />
      ) : (
        <Heart className="h-5 w-5" />
      )}
      {showText && (
        <span className="ml-2">
          {isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        </span>
      )}
    </Button>
  );
};

export default FavoriteButton;
