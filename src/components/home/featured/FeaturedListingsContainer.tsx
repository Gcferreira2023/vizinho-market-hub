
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ListingStatus } from "../../listings/StatusBadge";
import FeaturedListingsGrid from "./FeaturedListingsGrid";
import { useFeaturedListings } from "./useFeaturedListings";

const FeaturedListingsContainer = () => {
  const [activeTab, setActiveTab] = useState("todos");
  const { realListings, isLoading, mockListings } = useFeaturedListings();
  
  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Anúncios em destaque</h2>
          <Link to="/explorar" className="text-primary font-medium hover:underline">
            Ver todos
          </Link>
        </div>

        <Tabs defaultValue="todos" className="mb-6" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="produtos">Produtos</TabsTrigger>
            <TabsTrigger value="servicos">Serviços</TabsTrigger>
          </TabsList>
          <TabsContent value="todos">
            <FeaturedListingsGrid 
              isLoading={isLoading}
              filterType={undefined}
              realListings={realListings}
              mockListings={mockListings}
            />
          </TabsContent>
          <TabsContent value="produtos">
            <FeaturedListingsGrid 
              isLoading={isLoading}
              filterType="produto"
              realListings={realListings}
              mockListings={mockListings}
            />
          </TabsContent>
          <TabsContent value="servicos">
            <FeaturedListingsGrid 
              isLoading={isLoading}
              filterType="serviço"
              realListings={realListings}
              mockListings={mockListings}
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default FeaturedListingsContainer;
