
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import ListingCard from "@/components/listings/ListingCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";

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
  {
    id: "5",
    title: "Pão Artesanal de Fermentação Natural",
    price: 15.90,
    imageUrl: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04",
    category: "Alimentos",
    type: "produto" as const,
    rating: 4.7,
    location: "Bloco A, 302"
  },
  {
    id: "6",
    title: "Conserto de Eletrônicos",
    price: "A combinar",
    imageUrl: "https://images.unsplash.com/photo-1601524909162-ae8725290836",
    category: "Serviços",
    type: "serviço" as const,
    rating: 4.9,
    location: "Bloco B, 105"
  },
  {
    id: "7",
    title: "Plantas de Interior - Variadas",
    price: 25.00,
    imageUrl: "https://images.unsplash.com/photo-1610189378457-7c1a76b4361c",
    category: "Produtos Gerais",
    type: "produto" as const,
    rating: 4.3,
    location: "Bloco C, 408"
  },
  {
    id: "8",
    title: "Aulas de Yoga em Domicílio",
    price: 60.00,
    imageUrl: "https://images.unsplash.com/photo-1545205597-3d9d02c29597",
    category: "Serviços",
    type: "serviço" as const,
    rating: 4.8,
    location: "Bloco D, 201"
  },
];

const ExploreListings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // Filtros simulados
  const filteredListings = mockAllListings.filter((listing) => {
    // Filtro por termo de pesquisa
    if (
      searchTerm &&
      !listing.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Filtro por categoria
    if (selectedCategory && listing.category !== selectedCategory) {
      return false;
    }

    // Filtro por tipo
    if (selectedType && listing.type !== selectedType) {
      return false;
    }

    // Filtro por preço (ignora items com preço "A combinar")
    if (
      typeof listing.price === "number" &&
      (listing.price < priceRange[0] || listing.price > priceRange[1])
    ) {
      return false;
    }

    return true;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Pesquisa já está sendo aplicada no filtro
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Explorar Anúncios</h1>
          <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 md:hidden">
                <Filter size={16} />
                Filtros
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
                <SheetDescription>
                  Refine sua busca com os filtros abaixo
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Filtro de Categorias (Mobile) */}
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select
                    value={selectedCategory || ""}
                    onValueChange={(value) => 
                      setSelectedCategory(value === "" ? null : value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as categorias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas as categorias</SelectItem>
                      <SelectItem value="Alimentos">Alimentos</SelectItem>
                      <SelectItem value="Serviços">Serviços</SelectItem>
                      <SelectItem value="Produtos Gerais">Produtos Gerais</SelectItem>
                      <SelectItem value="Vagas/Empregos">Vagas/Empregos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtro de Tipos (Mobile) */}
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="produtos-mobile" 
                        checked={selectedType === "produto"}
                        onCheckedChange={() => setSelectedType(selectedType === "produto" ? null : "produto")}
                      />
                      <label 
                        htmlFor="produtos-mobile"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Produtos
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="servicos-mobile" 
                        checked={selectedType === "serviço"}
                        onCheckedChange={() => setSelectedType(selectedType === "serviço" ? null : "serviço")}
                      />
                      <label 
                        htmlFor="servicos-mobile"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Serviços
                      </label>
                    </div>
                  </div>
                </div>

                {/* Filtro de Preço (Mobile) */}
                <div className="space-y-4">
                  <Label>Faixa de Preço</Label>
                  <Slider
                    defaultValue={[0, 500]}
                    max={500}
                    step={10}
                    value={priceRange}
                    onValueChange={setPriceRange}
                  />
                  <div className="flex justify-between">
                    <span className="text-sm">R$ {priceRange[0]}</span>
                    <span className="text-sm">R$ {priceRange[1]}</span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => setIsFilterSheetOpen(false)}
                >
                  Aplicar Filtros
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Barra de pesquisa */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="search"
              placeholder="Pesquisar anúncios..."
              className="pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </form>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar de filtros (Desktop) */}
          <div className="hidden md:block w-64 space-y-6">
            <div className="bg-white p-4 rounded-lg border space-y-5">
              <h3 className="font-semibold text-lg">Filtros</h3>

              {/* Filtro de Categorias */}
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select
                  value={selectedCategory || ""}
                  onValueChange={(value) => 
                    setSelectedCategory(value === "" ? null : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as categorias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as categorias</SelectItem>
                    <SelectItem value="Alimentos">Alimentos</SelectItem>
                    <SelectItem value="Serviços">Serviços</SelectItem>
                    <SelectItem value="Produtos Gerais">Produtos Gerais</SelectItem>
                    <SelectItem value="Vagas/Empregos">Vagas/Empregos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro de Tipos */}
              <div className="space-y-2">
                <Label>Tipo</Label>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="produtos" 
                      checked={selectedType === "produto"}
                      onCheckedChange={() => setSelectedType(selectedType === "produto" ? null : "produto")}
                    />
                    <label 
                      htmlFor="produtos"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Produtos
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="servicos" 
                      checked={selectedType === "serviço"}
                      onCheckedChange={() => setSelectedType(selectedType === "serviço" ? null : "serviço")}
                    />
                    <label 
                      htmlFor="servicos"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Serviços
                    </label>
                  </div>
                </div>
              </div>

              {/* Filtro de Preço */}
              <div className="space-y-4">
                <Label>Faixa de Preço</Label>
                <Slider
                  defaultValue={[0, 500]}
                  max={500}
                  step={10}
                  value={priceRange}
                  onValueChange={setPriceRange}
                />
                <div className="flex justify-between">
                  <span className="text-sm">R$ {priceRange[0]}</span>
                  <span className="text-sm">R$ {priceRange[1]}</span>
                </div>
              </div>

              {/* Botão para limpar filtros */}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setSearchTerm("");
                  setPriceRange([0, 500]);
                  setSelectedCategory(null);
                  setSelectedType(null);
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          </div>

          {/* Lista de anúncios */}
          <div className="flex-1">
            {filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <ListingCard key={listing.id} {...listing} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">
                  Nenhum anúncio encontrado
                </h3>
                <p className="text-gray-500">
                  Tente ajustar seus filtros ou busque por outro termo.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ExploreListings;
