import React from "react";
import SearchInput from "../common/SearchInput";
import FilterDropdown from "./FilterDropdown";
import type { Driver } from '@shared/schema';

interface TenderToolbarProps {
  onSearch?: (query: string) => void;
  onFilter?: (filters: any) => void;
  drivers?: Driver[];
}

export default function TenderToolbar({ onSearch, onFilter, drivers = [] }: TenderToolbarProps) {
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
    </div>
  );
}