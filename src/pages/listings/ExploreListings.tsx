import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { ListingStatus } from "@/components/listings/StatusBadge";
import FilterSidebar from "@/components/listings/explore/FilterSidebar";
import MobileFilterSheet from "@/components/listings/explore/MobileFilterSheet";
import SearchListingsForm from "@/components/listings/explore/SearchListingsForm";
import ListingsGrid from "@/components/listings/explore/ListingsGrid";
import { useListingsFilter } from "@/hooks/useListingsFilter";

// Dados de exemplo (mockup) - combinando produtos e serviços
const mockAllListings = [
  {
    id: "1",
    title: "Bolo de Chocolate Caseiro",
    price: 35.90,
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
    category: "Alimentos",
    type: "produto" as const,
    rating: 4.8,
    location: "Bloco A, 101",
    status: "disponível" as ListingStatus
  },
  {
    id: "2",
    title: "Serviço de Passeio com Pets",
    price: "A combinar",
    imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb",
    category: "Serviços",
    type: "serviço" as const,
    rating: 4.5,
    location: "Bloco B, 304",
    status: "disponível" as ListingStatus
  },
  {
    id: "3",
    title: "Fones de Ouvido Bluetooth - Seminovo",
    price: 120.00,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    category: "Produtos Gerais",
    type: "produto" as const,
    rating: 4.2,
    location: "Bloco C, 202",
    status: "reservado" as ListingStatus
  },
  {
    id: "4",
    title: "Aulas de Inglês Online",
    price: 50.00,
    imageUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d",
    category: "Serviços",
    type: "serviço" as const,
    rating: 5.0,
    location: "Bloco D, 405",
    status: "disponível" as ListingStatus
  },
  {
    id: "5",
    title: "Pão Artesanal de Fermentação Natural",
    price: 15.90,
    imageUrl: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04",
    category: "Alimentos",
    type: "produto" as const,
    rating: 4.7,
    location: "Bloco A, 302",
    status: "vendido" as ListingStatus
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
    status: "disponível" as ListingStatus
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
    status: "vendido" as ListingStatus
  },
];

const ExploreListings = () => {
  const {
    searchTerm,
    setSearchTerm,
    priceRange,
    setPriceRange,
    selectedCategory,
    setSelectedCategory,
    selectedType,
    setSelectedType,
    selectedStatus,
    setSelectedStatus,
    showSoldItems,
    setShowSoldItems,
    filteredListings,
    isFilterSheetOpen,
    setIsFilterSheetOpen,
    resetFilters,
    handleSearch
  } = useListingsFilter(mockAllListings);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Explorar Anúncios</h1>
          <MobileFilterSheet
            isOpen={isFilterSheetOpen}
            setIsOpen={setIsFilterSheetOpen}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            showSoldItems={showSoldItems}
            setShowSoldItems={setShowSoldItems}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />
        </div>

        <SearchListingsForm
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
        />

        <div className="flex flex-col md:flex-row gap-6">
          <FilterSidebar 
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            showSoldItems={showSoldItems}
            setShowSoldItems={setShowSoldItems}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            resetFilters={resetFilters}
          />

          <div className="flex-1">
            <ListingsGrid listings={filteredListings} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ExploreListings;
