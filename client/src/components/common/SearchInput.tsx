import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SearchInput({ onSearch, placeholder = "חיפוש כללי..." }: { onSearch?: (query: string) => void, placeholder?: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
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
          color: hsl(220, 9%, 43%);
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
          background-color: hsl(220, 14%, 96%);
          color: hsl(0, 0%, 20%);
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
          border: 1px solid hsl(220, 13%, 91%);
          border-radius: 6px;
          font-size: 14px;
          direction: rtl;
          background: white;
          opacity: ${isExpanded ? '1' : '0'};
          transition: opacity 0.2s ease;
        }
        
        .search-input:focus {
          outline: none;
          border-color: hsl(48, 89%, 71%);
          box-shadow: 0 0 0 2px hsla(48, 89%, 71%, 0.2);
        }
        
        .search-icon-overlay {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: hsl(220, 9%, 43%);
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
