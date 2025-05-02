
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ListingCard from "../listings/ListingCard";
import { Link } from "react-router-dom";

// Dados de exemplo (mockup)
const mockListings = [
  {
    id: "1",
    title: "Bolo de Chocolate Caseiro",
    price: 35.90,
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
    category: "Alimentos",
    type: "produto" as const,
    rating: 4.8,
    location: "Bloco A, 101"
  },
  {
    id: "2",
    title: "Serviço de Passeio com Pets",
    price: "A combinar",
    imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb",
    category: "Serviços",
    type: "serviço" as const,
    rating: 4.5,
    location: "Bloco B, 304"
  },
  {
    id: "3",
    title: "Fones de Ouvido Bluetooth - Seminovo",
    price: 120.00,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    category: "Produtos Gerais",
    type: "produto" as const,
    rating: 4.2,
    location: "Bloco C, 202"
  },
  {
    id: "4",
    title: "Aulas de Inglês Online",
    price: 50.00,
    imageUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d",
    category: "Serviços",
    type: "serviço" as const,
    rating: 5.0,
    location: "Bloco D, 405"
  },
];

const FeaturedListings = () => {
  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Anúncios em destaque</h2>
          <Link to="/explorar" className="text-primary font-medium hover:underline">
            Ver todos
          </Link>
        </div>

        <Tabs defaultValue="todos" className="mb-6">
          <TabsList className="mb-6">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="produtos">Produtos</TabsTrigger>
            <TabsTrigger value="servicos">Serviços</TabsTrigger>
          </TabsList>
          <TabsContent value="todos">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {mockListings.map((listing) => (
                <ListingCard key={listing.id} {...listing} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="produtos">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {mockListings
                .filter((listing) => listing.type === "produto")
                .map((listing) => (
                  <ListingCard key={listing.id} {...listing} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="servicos">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {mockListings
                .filter((listing) => listing.type === "serviço")
                .map((listing) => (
                  <ListingCard key={listing.id} {...listing} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default FeaturedListings;
