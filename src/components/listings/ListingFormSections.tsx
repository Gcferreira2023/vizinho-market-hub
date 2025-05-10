
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { categories, listingTypes } from "@/constants/listings";
import { ListingFormData } from "@/types/listing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface ListingFormSectionsProps {
  formData: ListingFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleCheckboxChange?: (name: string, checked: boolean) => void;
}

const ListingFormSections = ({ 
  formData,
  handleChange,
  handleSelectChange,
  handleCheckboxChange
}: ListingFormSectionsProps) => {
  return (
    <>
      {/* Informações básicas */}
      <div className="space-y-4">
        <h3 className="font-medium">Informações básicas</h3>
        
        <div className="space-y-2">
          <Label htmlFor="title">Título do anúncio</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ex: Bolo de Chocolate Caseiro"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descreva seu produto ou serviço em detalhes..."
            rows={5}
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleSelectChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {listingTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleSelectChange("category", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="price">Preço (R$)</Label>
          <div className="flex flex-col space-y-3">
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="0,00"
              step="0.01"
              min="0"
              disabled={formData.priceUponRequest}
              required={!formData.priceUponRequest}
            />
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="priceUponRequest" 
                checked={formData.priceUponRequest}
                onCheckedChange={(checked) => {
                  if (handleCheckboxChange) {
                    handleCheckboxChange("priceUponRequest", checked === true);
                  }
                }}
              />
              <Label htmlFor="priceUponRequest">Preço a combinar</Label>
            </div>
          </div>
        </div>
      </div>
      
      {/* Informações adicionais */}
      <div className="space-y-4">
        <h3 className="font-medium">Informações adicionais</h3>
        
        <div className="space-y-2">
          <Label htmlFor="availability">Disponibilidade</Label>
          <Input
            id="availability"
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            placeholder="Ex: Segunda a Sexta, das 09h às 18h"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2 mb-2">
            <Checkbox 
              id="delivery" 
              checked={formData.delivery}
              onCheckedChange={(checked) => {
                if (handleCheckboxChange) {
                  handleCheckboxChange("delivery", checked === true);
                }
              }}
            />
            <Label htmlFor="delivery">Oferece entrega?</Label>
          </div>
          
          {formData.delivery && (
            <div className="space-y-2 ml-6">
              <Label htmlFor="deliveryFee">Taxa de entrega (R$)</Label>
              <Input
                id="deliveryFee"
                name="deliveryFee"
                type="number"
                value={formData.deliveryFee}
                onChange={handleChange}
                placeholder="0,00"
                step="0.01"
                min="0"
              />
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="paymentMethods">Formas de pagamento aceitas</Label>
          <Input
            id="paymentMethods"
            name="paymentMethods"
            value={formData.paymentMethods}
            onChange={handleChange}
            placeholder="Ex: Dinheiro, Pix, Cartão de crédito"
          />
        </div>
      </div>
    </>
  );
};

export default ListingFormSections;
