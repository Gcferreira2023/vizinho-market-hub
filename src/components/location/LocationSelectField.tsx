
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface SelectOption {
  id: string;
  name: string;
  [key: string]: any;
}

interface LocationSelectFieldProps {
  label: string;
  placeholder: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
  emptyMessage?: string;
}

const LocationSelectField = ({
  label,
  placeholder,
  options,
  value,
  onChange,
  disabled = false,
  isLoading = false,
  emptyMessage = "Nenhuma opção disponível"
}: LocationSelectFieldProps) => {
  return (
    <div>
      <Label htmlFor={label}>{label}</Label>
      <Select 
        value={value} 
        onValueChange={onChange}
        disabled={disabled || isLoading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {isLoading ? (
            <div className="flex justify-center p-2">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : options.length > 0 ? (
            options.map(option => (
              <SelectItem key={option.id} value={option.id}>
                {option.name}{option.uf ? ` (${option.uf})` : ''}
              </SelectItem>
            ))
          ) : (
            <div className="p-2 text-sm text-gray-500">
              {emptyMessage}
            </div>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LocationSelectField;
