
import ListingCard from "../listings/ListingCard";
import { Link } from "react-router-dom";
import { ListingStatus } from "../listings/StatusBadge";

// Dados de exemplo (mockup)
const mockRecentListings = [
  {
    id: "5",
    title: "Pão Artesanal de Fermentação Natural",
    price: 15.90,
    imageUrl: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04",
    category: "Alimentos",
    type: "produto" as const,
    rating: 4.7,
    location: "Bloco A, 302",
    status: "disponível" as ListingStatus
  },
  {
    id: "6",
    title: "Conserto de Eletrônicos",
    price: "A combinar",
    imageUrl: "https://images.unsplash.com/photo-1601524909162-ae8725290836",
    category: "Serviços",
    type: "serviço" as const,
    rating: 4.9,
    location: "Bloco B, 105",
    status: "disponível" as ListingStatus
  },
  {
    id: "7",
    title: "Plantas de Interior - Variadas",
    price: 25.00,
    imageUrl: "https://images.unsplash.com/photo-1610189378457-7c1a76b4361c",
    category: "Produtos Gerais",
    type: "produto" as const,
    rating: 4.3,
    location: "Bloco C, 408",
    status: "reservado" as ListingStatus
  },
  {
    id: "8",
    title: "Aulas de Yoga em Domicílio",
    price: 60.00,
    imageUrl: "https://images.unsplash.com/photo-1545205597-3d9d02c29597",
    category: "Serviços",
    type: "serviço" as const,
    rating: 4.8,
    location: "Bloco D, 201",
    status: "disponível" as ListingStatus
  },
];

const RecentListings = () => {
  // Filtrar para apenas mostrar anúncios disponíveis ou reservados na página inicial
  const availableListings = mockRecentListings.filter(
    listing => listing.status !== "vendido"
  );
  
  return (
    <section className="py-10 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Anúncios recentes</h2>
          <Link to="/explorar" className="text-primary font-medium hover:underline">
            Ver todos
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {availableListings.map((listing) => (
            <ListingCard 
              key={listing.id} 
              {...listing} 
              isMockListing={true}
              linkTo="/explorar"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentListings;
