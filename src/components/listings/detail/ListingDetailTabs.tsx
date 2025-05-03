
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Truck, MapPin, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

interface ListingDetailTabsProps {
  description: string;
  availability: string;
  delivery: boolean;
  deliveryFee?: number;
  location: string;
  paymentMethods: string[];
}

const ListingDetailTabs = ({
  description,
  availability,
  delivery,
  deliveryFee = 0,
  location,
  paymentMethods = []
}: ListingDetailTabsProps) => {
  const isMobile = useIsMobile();
  
  // Certifique-se de que paymentMethods é sempre um array
  const methods = Array.isArray(paymentMethods) 
    ? paymentMethods 
    : paymentMethods 
      ? String(paymentMethods).split(',') 
      : ["Dinheiro", "Pix"];

  return (
    <Tabs defaultValue="descricao" className="mb-6">
      <TabsList className={`grid ${isMobile ? "grid-cols-2" : "grid-cols-3"} mb-4`}>
        <TabsTrigger value="descricao">Descrição</TabsTrigger>
        <TabsTrigger value="disponibilidade">Disponibilidade</TabsTrigger>
        {!isMobile && <TabsTrigger value="pagamento">Pagamento</TabsTrigger>}
      </TabsList>
      
      <TabsContent value="descricao" className="text-gray-700">
        <p className="whitespace-pre-line">{description || "Sem descrição disponível."}</p>
      </TabsContent>
      
      <TabsContent value="disponibilidade" className="space-y-4">
        <div>
          <h3 className="font-medium flex items-center gap-2 mb-1">
            <Clock size={18} className="text-gray-500" /> 
            Horário de disponibilidade:
          </h3>
          <p className="text-gray-700 ml-6">{availability || "Não informado"}</p>
        </div>
        
        <div>
          <h3 className="font-medium flex items-center gap-2 mb-1">
            <Truck size={18} className="text-gray-500" /> 
            Entrega:
          </h3>
          <p className="text-gray-700 ml-6">
            {delivery
              ? `Sim (Taxa de entrega: R$ ${Number(deliveryFee).toFixed(2)})`
              : "Não disponível"}
          </p>
        </div>
        
        <div>
          <h3 className="font-medium flex items-center gap-2 mb-1">
            <MapPin size={18} className="text-gray-500" /> 
            Localização:
          </h3>
          <p className="text-gray-700 ml-6">{location || "Não informado"}</p>
        </div>
        
        {isMobile && (
          <div>
            <h3 className="font-medium flex items-center gap-2 mb-1">
              <CreditCard size={18} className="text-gray-500" /> 
              Formas de pagamento:
            </h3>
            <div className="flex flex-wrap gap-2 ml-6 mt-1">
              {methods && methods.length > 0 ? (
                methods.map((method, index) => (
                  <Badge key={index} variant="outline">{method}</Badge>
                ))
              ) : (
                <p className="text-gray-700">Não informado</p>
              )}
            </div>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="pagamento">
        <h3 className="font-medium mb-2 flex items-center gap-2">
          <CreditCard size={18} className="text-gray-500" />
          Formas de pagamento aceitas:
        </h3>
        <div className="flex flex-wrap gap-2">
          {methods && methods.length > 0 ? (
            methods.map((method, index) => (
              <Badge key={index} variant="outline">{method}</Badge>
            ))
          ) : (
            <p className="text-gray-700">Não informado</p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ListingDetailTabs;
