
import { useParams, useLocation } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import CategoryHeader from "@/components/listings/explore/CategoryHeader";
import CategoryListings from "@/components/listings/explore/CategoryListings";
import { categories } from "@/constants/listings";

const ExploreByCategory = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get("search") || undefined;
  
  // Find the category by ID
  const category = categories.find(cat => cat.id === categoryId);
  const categoryTitle = category ? category.name : "Categoria";

  console.log(`Exploring category: ${categoryId}, title: ${categoryTitle}`);
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <CategoryHeader 
          categoryTitle={categoryTitle} 
          searchTerm={searchTerm}
        />
        <CategoryListings 
          categoryId={categoryId}
          searchTerm={searchTerm} 
        />
      </div>
    </Layout>
  );
};

export default ExploreByCategory;
