import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchInput from "../common/SearchInput";
import FilterDropdown from "./FilterDropdown";
import type { Driver } from '@shared/schema';

interface TenderToolbarProps {
  onSearch?: (query: string) => void;
  onFilter?: (filters: any) => void;
  onAddNew?: () => void;
  drivers?: Driver[];
}

export default function TenderToolbar({ onSearch, onFilter, onAddNew, drivers = [] }: TenderToolbarProps) {
  return (
    <div className="flex justify-end gap-5">
      <SearchInput 
        onSearch={onSearch}
        placeholder="חיפוש מכרזים..."
      />
      <FilterDropdown 
        onFilterChange={onFilter}
        drivers={drivers}
      />
      <Button 
        onClick={onAddNew}
        className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-4 py-2 rounded-lg flex items-center gap-2"
      >
        <Plus size={18} />
        צור נסיעה חדשה
      </Button>
    </div>
  );
}