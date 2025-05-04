
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchListingsFormProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: (e: React.FormEvent) => void;
}

const SearchListingsForm = ({
  searchTerm,
  setSearchTerm,
  handleSearch
}: SearchListingsFormProps) => {
  return (
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
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
          size={18}
          onClick={(e) => {
            const form = (e.target as HTMLElement).closest('form');
            if (form) {
              form.requestSubmit();
            }
          }}
        />
      </form>
    </div>
  );
};

export default SearchListingsForm;
