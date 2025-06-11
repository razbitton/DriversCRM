import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import type { Driver } from '@shared/schema';

interface DriverSelectorProps {
  onDriversChange: (drivers: Driver[]) => void;
  selectedDrivers?: Driver[];
}

export default function DriverSelector({ onDriversChange, selectedDrivers = [] }: DriverSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: drivers = [] } = useQuery({
    queryKey: ['/api/drivers'],
  });

  useEffect(() => {
    filterDrivers();
  }, [drivers, searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filterDrivers = () => {
    if (!searchTerm) {
      setFilteredDrivers(drivers);
      return;
    }
    
    const filtered = drivers.filter((driver: Driver) =>
      driver.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone?.includes(searchTerm) ||
      driver.id_number?.includes(searchTerm)
    );
    setFilteredDrivers(filtered);
  };

  const handleDriverSelect = (driver: Driver) => {
    const isSelected = selectedDrivers.some(d => d.id === driver.id);
    let newSelected;
    
    if (isSelected) {
      newSelected = selectedDrivers.filter(d => d.id !== driver.id);
    } else {
      newSelected = [...selectedDrivers, driver];
    }
    
    onDriversChange(newSelected);
  };
  
  const handleSelectAll = () => {
    const allFilteredIds = new Set(filteredDrivers.map(d => d.id));
    const selectedIds = new Set(selectedDrivers.map(d => d.id));

    const allAreSelected = filteredDrivers.length > 0 && filteredDrivers.every(d => selectedIds.has(d.id));

    let newSelected;
    if (allAreSelected) {
      newSelected = selectedDrivers.filter(d => !allFilteredIds.has(d.id));
    } else {
      const newDriversToAdd = filteredDrivers.filter(d => !selectedIds.has(d.id));
      newSelected = [...selectedDrivers, ...newDriversToAdd];
    }
    onDriversChange(newSelected);
  };

  const getDisplayText = () => {
    if (selectedDrivers.length === 0) return 'בחר נהגים';
    if (selectedDrivers.length === 1) return selectedDrivers[0].full_name;
    return `${selectedDrivers.length} נהגים נבחרו`;
  };
  
  const areAllFilteredSelected = filteredDrivers.length > 0 && filteredDrivers.every(d => selectedDrivers.some(sd => sd.id === d.id));

  return (
    <div className="relative" ref={dropdownRef}>
      <style>{`
        .driver-selector-trigger {
          width: 100%;
          min-height: 40px;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
        }
        
        .driver-selector-trigger:hover {
          border-color: #9ca3af;
        }
        
        .driver-selector-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          z-index: 50;
          max-height: 300px;
          overflow: hidden;
        }
        
        .driver-search {
          padding: 12px;
          border-bottom: 1px solid #f3f4f6;
        }
        
        .driver-search input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .driver-list {
          max-height: 200px;
          overflow-y: auto;
        }
        
        .driver-item {
          padding: 10px 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #f9fafb;
        }
        
        .driver-item:hover {
          background-color: #f9fafb;
        }
        
        .driver-item.selected {
          background-color: #fef3c7;
          border-left: 3px solid #f59e0b;
        }
        
        .driver-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .driver-name {
          font-weight: 500;
          color: #1f2937;
        }
        
        .driver-phone {
          font-size: 12px;
          color: #6b7280;
        }
        
        .select-all-item {
          padding: 10px 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 2px solid #e5e7eb;
          background-color: #f9fafb;
          font-weight: 500;
        }
        
        .select-all-item:hover {
          background-color: #f3f4f6;
        }
      `}</style>
      
      <div className="driver-selector-trigger" onClick={() => setIsOpen(!isOpen)}>
        <span>{getDisplayText()}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="driver-selector-dropdown">
          <div className="driver-search">
            <input
              type="text"
              placeholder="חיפוש נהג..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          <div className="driver-list">
            <div className="select-all-item" onClick={handleSelectAll}>
              <span>{areAllFilteredSelected ? 'בטל בחירת הכל' : 'בחר הכל'}</span>
              <input
                type="checkbox"
                checked={areAllFilteredSelected}
                readOnly
              />
            </div>
            
            {filteredDrivers.map((driver) => (
              <div
                key={driver.id}
                className={`driver-item ${selectedDrivers.some(d => d.id === driver.id) ? 'selected' : ''}`}
                onClick={() => handleDriverSelect(driver)}
              >
                <div className="driver-info">
                  <span className="driver-name">{driver.full_name}</span>
                  <span className="driver-phone">{driver.phone}</span>
                </div>
                <input
                  type="checkbox"
                  checked={selectedDrivers.some(d => d.id === driver.id)}
                  readOnly
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}