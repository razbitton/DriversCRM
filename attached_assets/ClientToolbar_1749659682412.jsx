import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import SearchInput from '../common/SearchInput';

export default function ClientToolbar({ onSearch, onAddNew }) {
  return (
    <div className="flex items-center gap-4">
      <Button className="bg-yellow-300 hover:bg-yellow-400 text-gray-800 font-medium" onClick={onAddNew}>
        <Plus size={16} className="ml-2" />
        לקוח חדש
      </Button>
      <SearchInput 
        onSearch={onSearch}
        placeholder="חיפוש..."
      />
      <Button variant="outline" className="gap-2">
        <Filter size={16} />
        סינון
      </Button>
    </div>
  );
} 