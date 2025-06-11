import React from "react";
import SearchInput from "../common/SearchInput";
import FilterDropdown from "./FilterDropdown";

export default function TenderToolbar({ onSearch, onFilter, drivers = [] }) {
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