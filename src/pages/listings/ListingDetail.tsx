
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Clock } from "lucide-react";
import ListingCard from "@/components/listings/ListingCard";
import ListingImageGallery from "@/components/listings/ListingImageGallery";
import SellerInfo from "@/components/listings/SellerInfo";
import StatusSelector from "@/components/listings/StatusSelector";
import { ListingStatus } from "@/components/listings/StatusBadge";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

// Dados de exemplo (mockup) para o anúncio específico
const mockListing = {
  id: "1",
  title: "Bolo de Chocolate Caseiro",
  price: 35.9,
  description:
    "Delicioso bolo de chocolate caseiro com cobertura de brigadeiro. Feito com ingredientes selecionados e muito carinho. Ideal para festas, aniversários ou para matar aquela vontade de comer algo doce. Tamanho médio, serve aproximadamente 10 pessoas.",
  images: [
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187",
    "https://images.unsplash.com/photo-1606313564200-e75d5e30476c",
  ],
  category: "Alimentos",
  type: "produto" as const,
  rating: 4.8,
  location: "Bloco A, 101",
  status: "disponível" as ListingStatus,
  seller: {
    id: "s1",
    name: "Maria Silva",
    apartment: "101",
    block: "A",
    rating: 4.9,
    listings: 12,
    phone: "5511999999999",
  },
  availability: "Segunda a Sexta, das 09h às 18h",
  delivery: true,
  deliveryFee: 5.0,
  paymentMethods: ["Pix", "Dinheiro", "Cartão de Crédito"],
};

// Dados de exemplo para anúncios similares
const mockSimilarListings = [
  {
    id: "5",
    title: "Pão Artesanal de Fermentação Natural",
    price: 15.9,
    imageUrl: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04",
    category: "Alimentos",
    type: "produto" as const,
    rating: 4.7,
    location: "Bloco A, 302",
    status: "disponível" as ListingStatus,
  },
  {
    id: "9",
    title: "Cookies Americanos",
    price: 20.0,
    imageUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35",
    category: "Alimentos",
    type: "produto" as const,
    rating: 4.6,
    location: "Bloco B, 201",
    status: "disponível" as ListingStatus,
  },
  {
    id: "10",
    title: "Brigadeiros Gourmet",
    price: 25.0,
    imageUrl: "https://images.unsplash.com/photo-1586882829491-b81178aa622e",
    category: "Alimentos",
    type: "produto" as const,
    rating: 4.9,
    location: "Bloco C, 307",
    status: "reservado" as ListingStatus,
  },
];

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [listingStatus, setListingStatus] = useState<ListingStatus>("disponível");

  // Em uma aplicação real, buscaríamos os detalhes do anúncio pelo ID
  const listing = mockListing;
  
  useEffect(() => {
    // Inicializa o estado com o status atual do anúncio
    setListingStatus(listing.status);
    
    // Em um app real, aqui você faria a chamada para API para buscar os detalhes 
    // do anúncio baseado no ID vindo da URL
    console.log("Fetching listing details for ID:", id);
  }, [listing.status, id]);
  
  const handleStatusChange = (newStatus: ListingStatus) => {
    setListingStatus(newStatus);
    toast({
      title: "Status atualizado",
      description: `O anúncio agora está ${newStatus}.`,
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Link
            to="/explorar"
            className="text-primary hover:underline flex items-center"
          >
            ← Voltar para anúncios
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Esquerda - Imagens e Detalhes */}
          <div className="lg:col-span-2">
            {/* Galeria de imagens */}
            <ListingImageGallery 
              images={listing.images} 
              title={listing.title} 
              status={listingStatus}
            />

            {/* Detalhes do anúncio */}
            <Card className="p-6 mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      listing.type === "produto" ? "default" : "secondary"
                    }
                  >
                    {listing.type}
                  </Badge>
                  <span className="text-sm text-gray-500">{listing.category}</span>
                </div>
                <StatusSelector 
                  adId={listing.id}
                  currentStatus={listingStatus}
                  onStatusChange={handleStatusChange}
                  userId={user?.id}
                  ownerId={listing.seller.id}
                />
              </div>
              <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
              <div className="flex items-center gap-2 mb-4">
                <Star
                  size={18}
                  className="text-yellow-400 fill-yellow-400"
                />
                <span className="font-semibold">{listing.rating}</span>
              </div>

              <div className="mb-6">
                <span className="text-2xl font-bold text-primary">
                  {typeof listing.price === "number"
                    ? `R$ ${listing.price.toFixed(2)}`
                    : listing.price}
                </span>
              </div>

              <Tabs defaultValue="descricao" className="mb-6">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="descricao">Descrição</TabsTrigger>
                  <TabsTrigger value="disponibilidade">Disponibilidade</TabsTrigger>
                  <TabsTrigger value="pagamento">Pagamento</TabsTrigger>
                </TabsList>
                <TabsContent value="descricao" className="text-gray-700">
                  <p>{listing.description}</p>
                </TabsContent>
                <TabsContent value="disponibilidade" className="space-y-3">
                  <div>
                    <h3 className="font-medium flex items-center gap-2">
                      <Clock size={18} className="text-gray-500" /> 
                      Horário de disponibilidade:
                    </h3>
                    <p className="text-gray-700 ml-6">{listing.availability}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Entrega:</h3>
                    <p className="text-gray-700">
                      {listing.delivery
                        ? `Sim (Taxa de R$ ${listing.deliveryFee.toFixed(2)})`
                        : "Não disponível"}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">Localização:</h3>
                    <p className="text-gray-700">{listing.location}</p>
                  </div>
                </TabsContent>
                <TabsContent value="pagamento">
                  <h3 className="font-medium mb-2">Formas de pagamento aceitas:</h3>
                  <div className="flex flex-wrap gap-2">
                    {listing.paymentMethods.map((method, index) => (
                      <Badge key={index} variant="outline">{method}</Badge>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Coluna Direita - Informações do vendedor e ações */}
          <div className="space-y-6">
            {/* Informações do vendedor */}
            <SellerInfo 
              seller={listing.seller} 
              adId={id}
            />

            {/* Segurança */}
            <Card className="p-4">
              <h3 className="font-medium mb-2 text-sm">Compra segura</h3>
              <p className="text-xs text-gray-500">
                Converse com o vendedor antes de realizar qualquer pagamento e faça negociações seguras, preferencialmente em locais públicos dentro do condomínio.
              </p>
            </Card>
          </div>
        </div>

        {/* Anúncios relacionados */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Anúncios Similares</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {mockSimilarListings.map((listing) => (
              <ListingCard key={listing.id} {...listing} />
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ListingDetail;
