
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ListingStatus } from "@/components/listings/StatusBadge";
import LocationFilter from "./LocationFilter";
import MyCondominiumToggle from "./MyCondominiumToggle";
import { useAuth } from "@/contexts/AuthContext";

interface FilterSidebarProps {
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
  resetFilters: () => void;
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
}

const FilterSidebar = ({
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
  resetFilters,
  // Location filter props
  selectedStateId,
  setSelectedStateId,
  selectedCityId,
  setSelectedCityId,
  selectedCondominiumId,
  setSelectedCondominiumId,
  // Condominium filter toggle
  isCondominiumFilter,
  setIsCondominiumFilter
}: FilterSidebarProps) => {
  const { user } = useAuth();
  const userCondominiumId = user?.user_metadata?.condominiumId;
  
  return (
    <div className="hidden md:block w-64 space-y-6">
      <div className="bg-white p-4 rounded-lg border space-y-5">
        <h3 className="font-semibold text-lg">Filtros</h3>

        {/* My Condominium Toggle - Made more prominent with background */}
        {userCondominiumId && (
          <div className="bg-primary/10 rounded-lg p-3 -mx-2">
            <MyCondominiumToggle 
              isCondominiumFilter={isCondominiumFilter}
              onToggleCondominiumFilter={setIsCondominiumFilter}
            />
          </div>
        )}

        {/* Location Filter - Now first in the sidebar for more prominence */}
        <LocationFilter
          selectedStateId={selectedStateId}
          setSelectedStateId={setSelectedStateId}
          selectedCityId={selectedCityId}
          setSelectedCityId={setSelectedCityId}
          selectedCondominiumId={selectedCondominiumId}
          setSelectedCondominiumId={setSelectedCondominiumId}
        />

        {/* Filtro de Categorias */}
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
              <SelectItem value="Alimentos">Alimentos</SelectItem>
              <SelectItem value="Serviços">Serviços</SelectItem>
              <SelectItem value="Produtos Gerais">Produtos Gerais</SelectItem>
              <SelectItem value="Vagas/Empregos">Vagas/Empregos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Filtro de Status */}
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
            id="show-sold"
            checked={showSoldItems}
            onCheckedChange={(checked) => setShowSoldItems(!!checked)}
          />
          <Label htmlFor="show-sold">Mostrar itens vendidos</Label>
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
          onClick={resetFilters}
        >
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
};

export default FilterSidebar;
