
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface NewCondominiumDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string, address?: string) => Promise<void>;
  isLoading: boolean;
}

const NewCondominiumDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  isLoading
}: NewCondominiumDialogProps) => {
  const [newCondominiumData, setNewCondominiumData] = useState({
    name: "",
    address: ""
  });

  const handleSubmit = async () => {
    await onSubmit(newCondominiumData.name, newCondominiumData.address);
    setNewCondominiumData({ name: "", address: "" }); // Reset form after submission
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sugerir Novo Condomínio</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label htmlFor="condoName">Nome do Condomínio</Label>
            <Input
              id="condoName"
              placeholder="Ex: Edifício Solar das Flores"
              value={newCondominiumData.name}
              onChange={(e) => setNewCondominiumData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="condoAddress">Endereço (opcional)</Label>
            <Input
              id="condoAddress"
              placeholder="Ex: Av. Paulista, 1000"
              value={newCondominiumData.address}
              onChange={(e) => setNewCondominiumData(prev => ({ ...prev, address: e.target.value }))}
            />
          </div>
        </div>
        <DialogFooter className="flex space-x-2 sm:space-x-0">
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancelar</Button>
          </DialogClose>
          <Button 
            type="button" 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sugerir Condomínio
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewCondominiumDialog;
