import React, { useState, useRef, useEffect } from 'react';
import { Driver } from "@/entities/Driver";
import { ChevronDown, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function DriverSelector({ onDriversChange, selectedDrivers = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    loadDrivers();
  }, []);

  useEffect(() => {
    filterDrivers();
  }, [drivers, searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadDrivers = async () => {
    try {
      const data = await Driver.list("-created_date");
      setDrivers(data);
      setFilteredDrivers(data);
    } catch (error) {
      console.error("Error loading drivers:", error);
    }
  };

  const filterDrivers = () => {
    if (!searchTerm) {
      setFilteredDrivers(drivers);
      return;
    }
    
    const filtered = drivers.filter(driver =>
      driver.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone?.includes(searchTerm) ||
      driver.id_number?.includes(searchTerm)
    );
    setFilteredDrivers(filtered);
  };

  const handleDriverSelect = (driver) => {
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
      // Deselect all currently filtered drivers
      newSelected = selectedDrivers.filter(d => !allFilteredIds.has(d.id));
    } else {
      // Select all filtered drivers that are not already selected
      const newDriversToAdd = filteredDrivers.filter(d => !selectedIds.has(d.id));
      newSelected = [...selectedDrivers, ...newDriversToAdd];
    }
    onDriversChange(newSelected);
  };


  const getDisplayText = () => {
    if (selectedDrivers.length === 0) return 'בחר';
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
          font-size: 14px;
        }
        
        .driver-details {
          font-size: 12px;
          color: #6b7280;
        }
        
        .no-results {
          padding: 20px;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
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
             <div
              className={`driver-item ${areAllFilteredSelected ? 'selected' : ''}`}
              onClick={handleSelectAll}
            >
              <div className="driver-name">כל הנהגים</div>
              {areAllFilteredSelected && (
                <div className="text-yellow-600">✓</div>
              )}
            </div>

            {filteredDrivers.map(driver => {
              const isSelected = selectedDrivers.some(d => d.id === driver.id);
              return (
                <div
                  key={driver.id}
                  className={`driver-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleDriverSelect(driver)}
                >
                  <div className="driver-info">
                    <div className="driver-name">{driver.full_name}</div>
                    <div className="driver-details">
                      {driver.phone} | {driver.residence_area || 'לא צוין'}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="text-yellow-600">✓</div>
                  )}
                </div>
              );
            })}
            
            {filteredDrivers.length === 0 && (
                 <div className="no-results">
                    לא נמצאו נהגים
                  </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 