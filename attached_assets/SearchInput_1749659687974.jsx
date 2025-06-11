import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/Components/ui/input";

export default function SearchInput({ onSearch, placeholder = "חיפוש כללי..." }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleToggle = () => {
    if (isExpanded && searchTerm) {
      onSearch?.(searchTerm);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch?.(searchTerm);
    }
  };

  return (
    <div className="search-container">
      <style>{`
        .search-container {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .search-btn {
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
          white-space: nowrap;
        }
        
        .search-btn:hover {
          background-color: #f8f9fa;
          color: #333;
        }
        
        .search-input-container {
          position: absolute;
          right: 0;
          top: 0;
          height: 100%;
          overflow: hidden;
          transition: width 0.3s ease;
          width: ${isExpanded ? '250px' : '0'};
          z-index: 10;
        }
        
        .search-input {
          width: 250px;
          height: 100%;
          padding: 8px 40px 8px 12px;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          font-size: 14px;
          direction: rtl;
          background: white;
          opacity: ${isExpanded ? '1' : '0'};
          transition: opacity 0.2s ease;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #f9d871;
          box-shadow: 0 0 0 2px rgba(249, 216, 113, 0.2);
        }
        
        .search-icon-overlay {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #6c757d;
          cursor: pointer;
          z-index: 11;
        }
      `}</style>
      
      <button 
        className="search-btn"
        onClick={handleToggle}
        style={{ opacity: isExpanded ? 0 : 1 }}
      >
        <Search size={16} />
        חיפוש
      </button>
      
      <div className="search-input-container">
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className="search-input"
        />
        <div className="search-icon-overlay" onClick={handleToggle}>
          <Search size={16} />
        </div>
      </div>
    </div>
  );
} 