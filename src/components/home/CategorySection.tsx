
import { Link } from "react-router-dom";
import { ShoppingCart, User, Star, Bell } from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

const categories: Category[] = [
  {
    id: "alimentos",
    name: "Alimentos",
    icon: <ShoppingCart size={28} />,
    color: "bg-red-100 text-red-600",
  },
  {
    id: "servicos",
    name: "Serviços",
    icon: <User size={28} />,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: "produtos",
    name: "Produtos Gerais",
    icon: <Star size={28} />,
    color: "bg-green-100 text-green-600",
  },
  {
    id: "vagas",
    name: "Vagas/Empregos",
    icon: <Bell size={28} />,
    color: "bg-yellow-100 text-yellow-600",
  },
];

const CategorySection = () => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Categorias</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/categoria/${category.id}`}
              className="card-hover flex flex-col items-center p-4 rounded-lg border bg-white"
            >
              <div className={`rounded-full p-3 ${category.color}`}>
                {category.icon}
              </div>
              <span className="mt-3 font-medium">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
