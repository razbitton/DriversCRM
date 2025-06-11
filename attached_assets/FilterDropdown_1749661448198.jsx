import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function FilterDropdown({ onFilterChange, drivers = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);
  const [filters, setFilters] = useState({
    name: "",
    serviceType: "",
    publishDate: "",
    status: "",
    driverName: ""
  });
  
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setExpandedItem(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFilterUpdate = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
    if (!isOpen) {
      setExpandedItem(null);
    }
  };

  const toggleSubmenu = (itemKey, e) => {
    e.stopPropagation();
    setExpandedItem(expandedItem === itemKey ? null : itemKey);
  };

  return (
    <div className="filter-container">
      <style>{`
        .filter-container {
          position: relative;
        }
        
        .toolbar-btn {
          background: none;
          border: none;
          color: #6c757d;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 6px;
          transition: all 0.2s;
        }
        
        .toolbar-btn:hover {
          background-color: #f8f9fa;
          color: #333;
        }
        
        .filter-dropdown {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          background-color: #fff;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          z-index: 1000;
          width: 200px;
          overflow: hidden;
        }
        
        .filter-dropdown.show {
          display: block;
        }
        
        .filter-dropdown ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        
        .filter-item {
          border-bottom: 1px solid #f1f3f5;
        }
        
        .filter-item:last-child {
          border-bottom: none;
        }
        
        .filter-item-header {
          padding: 12px 15px;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background-color 0.2s;
          background-color: #fff;
        }
        
        .filter-item-header:hover {
          background-color: #f8f9fa;
        }
        
        .filter-item-header.expanded {
          background-color: #f1f3f5;
        }
        
        .submenu-content {
          padding: 10px 15px;
          background-color: #fafbfc;
          border-top: 1px solid #e9ecef;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .submenu-content label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          padding: 4px 0;
          cursor: pointer;
          transition: color 0.2s;
        }
        
        .submenu-content label:hover {
          color: #f9d871;
        }
        
        .submenu-content input[type="radio"] {
          margin-left: 5px;
          accent-color: #f9d871;
        }
        
        .submenu-title {
          font-size: 12px;
          color: #6c757d;
          margin-bottom: 5px;
          font-weight: 500;
        }
        
        .filter-input {
          width: 100%;
          padding: 6px 8px;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          font-size: 13px;
          direction: rtl;
        }
        
        .filter-input:focus {
          outline: none;
          border-color: #f9d871;
          box-shadow: 0 0 0 2px rgba(249, 216, 113, 0.2);
        }
        
        .simple-item {
          padding: 12px 15px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
          color: #6c757d;
        }
        
        .simple-item:hover {
          background-color: #f8f9fa;
        }
      `}</style>
      
      <button 
        ref={buttonRef}
        className="toolbar-btn"
        onClick={toggleDropdown}
      >
        <Filter size={16} />
        סינון
      </button>
      
      <div 
        ref={dropdownRef}
        className={`filter-dropdown ${isOpen ? 'show' : ''}`}
      >
        <ul>
          {/* שם מכרז */}
          <li className="filter-item">
            <div 
              className={`filter-item-header ${expandedItem === 'name' ? 'expanded' : ''}`}
              onClick={(e) => toggleSubmenu('name', e)}
            >
              <span>שם מכרז</span>
              {expandedItem === 'name' ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </div>
            {expandedItem === 'name' && (
              <div className="submenu-content">
                <Input
                  type="text"
                  placeholder="הקלד שם מכרז..."
                  value={filters.name}
                  onChange={(e) => handleFilterUpdate('name', e.target.value)}
                  className="filter-input"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </li>
          
          {/* סוג שירות */}
          <li className="filter-item">
            <div 
              className={`filter-item-header ${expandedItem === 'serviceType' ? 'expanded' : ''}`}
              onClick={(e) => toggleSubmenu('serviceType', e)}
            >
              <span>סוג שירות</span>
              {expandedItem === 'serviceType' ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </div>
            {expandedItem === 'serviceType' && (
              <div className="submenu-content">
                <label onClick={(e) => e.stopPropagation()}>
                  <input 
                    type="radio" 
                    name="service-type" 
                    value="ride"
                    checked={filters.serviceType === 'ride'}
                    onChange={(e) => handleFilterUpdate('serviceType', e.target.value)}
                  />
                  הסעה
                </label>
                <label onClick={(e) => e.stopPropagation()}>
                  <input 
                    type="radio" 
                    name="service-type" 
                    value="delivery"
                    checked={filters.serviceType === 'delivery'}
                    onChange={(e) => handleFilterUpdate('serviceType', e.target.value)}
                  />
                  משלוח
                </label>
                <label onClick={(e) => e.stopPropagation()}>
                  <input 
                    type="radio" 
                    name="service-type" 
                    value="special"
                    checked={filters.serviceType === 'special'}
                    onChange={(e) => handleFilterUpdate('serviceType', e.target.value)}
                  />
                  מיוחד
                </label>
                <label onClick={(e) => e.stopPropagation()}>
                  <input 
                    type="radio" 
                    name="service-type" 
                    value=""
                    checked={filters.serviceType === ''}
                    onChange={(e) => handleFilterUpdate('serviceType', '')}
                  />
                  הכל
                </label>
              </div>
            )}
          </li>
          
          {/* זמן פרסום */}
          <li className="filter-item">
            <div 
              className={`filter-item-header ${expandedItem === 'publishDate' ? 'expanded' : ''}`}
              onClick={(e) => toggleSubmenu('publishDate', e)}
            >
              <span>זמן פרסום</span>
              {expandedItem === 'publishDate' ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </div>
            {expandedItem === 'publishDate' && (
              <div className="submenu-content">
                <input 
                  type="date"
                  value={filters.publishDate}
                  onChange={(e) => handleFilterUpdate('publishDate', e.target.value)}
                  className="filter-input"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </li>
          
          {/* סטטוס */}
          <li className="filter-item">
            <div 
              className={`filter-item-header ${expandedItem === 'status' ? 'expanded' : ''}`}
              onClick={(e) => toggleSubmenu('status', e)}
            >
              <span>סטטוס</span>
              {expandedItem === 'status' ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </div>
            {expandedItem === 'status' && (
              <div className="submenu-content">
                <label onClick={(e) => e.stopPropagation()}>
                  <input 
                    type="radio" 
                    name="status" 
                    value="completed"
                    checked={filters.status === 'completed'}
                    onChange={(e) => handleFilterUpdate('status', e.target.value)}
                  />
                  בוצע
                </label>
                <label onClick={(e) => e.stopPropagation()}>
                  <input 
                    type="radio" 
                    name="status" 
                    value="taken"
                    checked={filters.status === 'taken'}
                    onChange={(e) => handleFilterUpdate('status', e.target.value)}
                  />
                  תפוס
                </label>
                <label onClick={(e) => e.stopPropagation()}>
                  <input 
                    type="radio" 
                    name="status" 
                    value="available"
                    checked={filters.status === 'available'}
                    onChange={(e) => handleFilterUpdate('status', e.target.value)}
                  />
                  ממתין
                </label>
                <label onClick={(e) => e.stopPropagation()}>
                  <input 
                    type="radio" 
                    name="status" 
                    value="cancelled"
                    checked={filters.status === 'cancelled'}
                    onChange={(e) => handleFilterUpdate('status', e.target.value)}
                  />
                  מבוטל
                </label>
                <label onClick={(e) => e.stopPropagation()}>
                  <input 
                    type="radio" 
                    name="status" 
                    value=""
                    checked={filters.status === ''}
                    onChange={(e) => handleFilterUpdate('status', '')}
                  />
                  הכל
                </label>
              </div>
            )}
          </li>
          
          {/* בחירת נהג */}
          <li className="filter-item">
            <div 
              className={`filter-item-header ${expandedItem === 'driverName' ? 'expanded' : ''}`}
              onClick={(e) => toggleSubmenu('driverName', e)}
            >
              <span>בחירת נהג</span>
              {expandedItem === 'driverName' ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </div>
            {expandedItem === 'driverName' && (
              <div className="submenu-content">
                <div className="submenu-title">הקלד כאן את שם הנהג</div>
                <Input
                  type="text"
                  placeholder="שם הנהג..."
                  value={filters.driverName}
                  onChange={(e) => handleFilterUpdate('driverName', e.target.value)}
                  className="filter-input"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </li>
          
          {/* נהג שקיבל */}
          <li className="simple-item">
            נהג שקיבל
          </li>
        </ul>
      </div>
    </div>
  );
} 