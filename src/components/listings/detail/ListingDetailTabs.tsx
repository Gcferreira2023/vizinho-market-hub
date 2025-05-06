
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CalendarDays, Eye, Info, Truck, CreditCard } from "lucide-react";
import { format } from "date-fns";

interface ListingDetailTabsProps {
  listing: any;
  viewCount?: number;
}

const ListingDetailTabs = ({ listing, viewCount = 0 }: ListingDetailTabsProps) => {
  // Format payment methods string into array
  const paymentMethods = listing.payment_methods
    ? listing.payment_methods.split(',').map((method: string) => method.trim())
    : ['Dinheiro', 'Pix'];

  return (
    <Tabs defaultValue="description" className="mt-8">
      <TabsList className="w-full mb-4">
        <TabsTrigger value="description">Descrição</TabsTrigger>
        <TabsTrigger value="details">Detalhes</TabsTrigger>
        {listing.delivery && (
          <TabsTrigger value="delivery">Entrega</TabsTrigger>
        )}
        <TabsTrigger value="stats">Estatísticas</TabsTrigger>
      </TabsList>
      
      <TabsContent value="description">
        <div className="rounded-lg border p-4">
          <h3 className="text-lg font-medium mb-4">Descrição</h3>
          <div className="whitespace-pre-line">{listing.description}</div>
        </div>
      </TabsContent>
      
      <TabsContent value="details">
        <div className="rounded-lg border p-4">
          <h3 className="text-lg font-medium mb-4">Detalhes do Produto</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Categoria</p>
              <p className="font-medium">{listing.category}</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Tipo</p>
              <p className="font-medium capitalize">{listing.type}</p>
            </div>
            
            {listing.availability && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Disponibilidade</p>
                <p className="font-medium">{listing.availability}</p>
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-2">Formas de Pagamento</p>
            <div className="flex flex-wrap gap-2">
              {paymentMethods.map((method: string, index: number) => (
                <div 
                  key={index} 
                  className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded"
                >
                  <CreditCard className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">{method}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TabsContent>
      
      {listing.delivery && (
        <TabsContent value="delivery">
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium mb-4">Informações de Entrega</h3>
            
            <div className="flex items-start gap-3 mb-4">
              <Truck className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="font-medium">Entrega disponível</p>
                <p className="text-sm text-gray-600">O vendedor oferece entrega para este item</p>
              </div>
            </div>
            
            {listing.delivery_fee !== null && (
              <div className="rounded bg-gray-50 p-3 mt-4">
                <p className="text-sm text-gray-600">Taxa de Entrega</p>
                <p className="font-medium">
                  {listing.delivery_fee > 0 
                    ? `R$ ${Number(listing.delivery_fee).toFixed(2)}` 
                    : 'Grátis'}
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      )}
      
      <TabsContent value="stats">
        <div className="rounded-lg border p-4">
          <h3 className="text-lg font-medium mb-4">Estatísticas do Anúncio</h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Eye className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total de visualizações</p>
                <p className="text-xl font-bold">{viewCount}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <CalendarDays className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Data de publicação</p>
                <p className="text-xl font-bold">
                  {listing.created_at ? format(new Date(listing.created_at), 'dd/MM/yyyy') : '-'}
                </p>
              </div>
            </div>
          </div>
          
          <Alert className="mt-6 bg-blue-50 border-blue-200 text-blue-700">
            <AlertDescription className="flex items-start gap-2">
              <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Métricas em tempo real</p>
                <p className="text-sm">As visualizações são registradas de forma anônima e incrementadas a cada visitante único.</p>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ListingDetailTabs;
