
import { ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";

const SecurityInfo = () => {
  return (
    <Card className="p-4 border-l-4 border-l-primary bg-gradient-to-r from-blue-50 to-transparent">
      <div className="flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-sm mb-1">Compra segura</h3>
          <p className="text-xs text-gray-600">
            Converse com o vendedor antes de realizar qualquer pagamento e faça negociações seguras, preferencialmente em locais públicos dentro do condomínio.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default SecurityInfo;
