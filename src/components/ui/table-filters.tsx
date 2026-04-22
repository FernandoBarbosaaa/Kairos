import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface TableFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterValue?: string;
  onFilterChange?: (value: string | null) => void;
  filterOptions?: { value: string; label: string }[];
}

export function TableFilters({
  searchValue,
  onSearchChange,
  filterValue,
  onFilterChange,
  filterOptions,
}: TableFiltersProps) {
  return (
    <div className="flex gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-white/60" />
        <Input
          type="text"
          placeholder="Buscar..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white/[0.05] border-white/[0.1] text-white placeholder-white/40"
        />
      </div>

      {filterOptions && onFilterChange && (
        <Select value={filterValue} onValueChange={onFilterChange}>
          <SelectTrigger className="w-48 bg-white/[0.05] border-white/[0.1] text-white">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filtro" />
          </SelectTrigger>
          <SelectContent className="bg-[var(--spiritual-bg-light)] border-white/[0.1]">
            {filterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
