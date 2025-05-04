
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import CategoryHeader from "@/components/listings/explore/CategoryHeader";
import CategoryListings from "@/components/listings/explore/CategoryListings";

const categoryTitles: Record<string, string> = {
  alimentos: "Alimentos",
  servicos: "Serviços",
  produtos: "Produtos Gerais",
  vagas: "Vagas e Empregos"
};

const ExploreByCategory = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  
  // Nome da categoria para exibição
  const categoryTitle = categoryTitles[categoryId || ""] || "Categoria";

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <CategoryHeader categoryTitle={categoryTitle} />
        <CategoryListings categoryId={categoryId} />
      </div>
    </Layout>
  );
};

export default ExploreByCategory;
