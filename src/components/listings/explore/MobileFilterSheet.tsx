import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ListingStatus } from "@/components/listings/StatusBadge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MobileLocationFilter from "./MobileLocationFilter";
import MyCondominiumToggle from "./MyCondominiumToggle";
import { categories } from "@/constants/listings";

interface MobileFilterSheetProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  selectedType: string | null;
  setSelectedType: (type: string | null) => void;
  selectedStatus: ListingStatus | null;
  setSelectedStatus: (status: ListingStatus | null) => void;
  showSoldItems: boolean;
  setShowSoldItems: (show: boolean) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  // Location filter props
  selectedStateId: string | null;
  setSelectedStateId: (stateId: string | null) => void;
  selectedCityId: string | null;
  setSelectedCityId: (cityId: string | null) => void;
  selectedCondominiumId: string | null;
  setSelectedCondominiumId: (condominiumId: string | null) => void;
  // Condominium filter toggle
  isCondominiumFilter: boolean;
  setIsCondominiumFilter: (isFiltered: boolean) => void;
  maxPrice?: number;
}

const MobileFilterSheet = ({
  isOpen,
  setIsOpen,
  selectedCategory,
  setSelectedCategory,
  selectedType,
  setSelectedType,
  selectedStatus,
  setSelectedStatus,
  showSoldItems,
  setShowSoldItems,
  priceRange,
  setPriceRange,
  // Location filter props
  selectedStateId,
  setSelectedStateId,
  selectedCityId,
  setSelectedCityId,
  selectedCondominiumId,
  setSelectedCondominiumId,
  // Condominium filter toggle
  isCondominiumFilter,
  setIsCondominiumFilter,
  maxPrice = 500
}: MobileFilterSheetProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
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

        <div className="mt-6 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)] pr-2">
          {/* My Condominium Toggle */}
          <MyCondominiumToggle 
            isCondominiumFilter={isCondominiumFilter}
            onToggleCondominiumFilter={setIsCondominiumFilter}
          />

          {/* Location Filter */}
          <MobileLocationFilter
            selectedStateId={selectedStateId}
            setSelectedStateId={setSelectedStateId}
            selectedCityId={selectedCityId}
            setSelectedCityId={setSelectedCityId}
            selectedCondominiumId={selectedCondominiumId}
            setSelectedCondominiumId={setSelectedCondominiumId}
          />

          {/* Filtro de Categorias (Mobile) */}
          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select
              value={selectedCategory || "all"}
              onValueChange={(value) => 
                setSelectedCategory(value === "all" ? null : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro de Status (Mobile) */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={selectedStatus || "all"}
              onValueChange={(value) => 
                setSelectedStatus(value === "all" ? null : value as ListingStatus)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="disponível">Disponível</SelectItem>
                <SelectItem value="reservado">Reservado</SelectItem>
                <SelectItem value="vendido">Vendido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="show-sold-mobile"
              checked={showSoldItems}
              onCheckedChange={(checked) => setShowSoldItems(!!checked)}
            />
            <Label htmlFor="show-sold-mobile">Mostrar itens vendidos</Label>
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
            onClick={() => setIsOpen(false)}
          >
            Aplicar Filtros
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileFilterSheet;
