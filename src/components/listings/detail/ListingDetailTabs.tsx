
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  deliveryFee,
  location,
  paymentMethods
}: ListingDetailTabsProps) => {
  return (
    <Tabs defaultValue="descricao" className="mb-6">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="descricao">Descrição</TabsTrigger>
        <TabsTrigger value="disponibilidade">Disponibilidade</TabsTrigger>
        <TabsTrigger value="pagamento">Pagamento</TabsTrigger>
      </TabsList>
      <TabsContent value="descricao" className="text-gray-700">
        <p>{description}</p>
      </TabsContent>
      <TabsContent value="disponibilidade" className="space-y-3">
        <div>
          <h3 className="font-medium flex items-center gap-2">
            <Clock size={18} className="text-gray-500" /> 
            Horário de disponibilidade:
          </h3>
          <p className="text-gray-700 ml-6">{availability}</p>
        </div>
        <div>
          <h3 className="font-medium">Entrega:</h3>
          <p className="text-gray-700">
            {delivery
              ? `Sim (Taxa de R$ ${deliveryFee?.toFixed(2)})`
              : "Não disponível"}
          </p>
        </div>
        <div>
          <h3 className="font-medium">Localização:</h3>
          <p className="text-gray-700">{location}</p>
        </div>
      </TabsContent>
      <TabsContent value="pagamento">
        <h3 className="font-medium mb-2">Formas de pagamento aceitas:</h3>
        <div className="flex flex-wrap gap-2">
          {paymentMethods.map((method, index) => (
            <Badge key={index} variant="outline">{method}</Badge>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ListingDetailTabs;
