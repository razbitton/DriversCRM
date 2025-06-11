import React from 'react';
import { Search, Route } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function PricingFilter({ routes, onFilterChange }) {
  return (
    <aside className="pricing-filter-sidebar">
      <style>{`
        .pricing-filter-sidebar {
          background-color: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px;
          width: 280px;
          height: fit-content;
        }
        .search-box {
          position: relative;
          margin-bottom: 16px;
        }
        .search-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }
        .search-input {
          padding-right: 36px;
        }
        .route-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .route-item {
          display: flex;
          align-items: center;
          padding: 10px;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .route-item:hover {
          background-color: #f9fafb;
        }
        .route-icon-container {
          background-color: #f3f4f6;
          border-radius: 6px;
          padding: 6px;
          margin-left: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .route-icon-container svg {
          color: #6b7280;
        }
        .route-name {
          flex-grow: 1;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .status-dot.active {
          background-color: #22c55e;
        }
        .status-dot.inactive {
          background-color: #ef4444;
        }
      `}</style>
      <div className="search-box">
        <Search size={18} className="search-icon" />
        <Input 
          placeholder="חיפוש" 
          className="search-input"
          onChange={(e) => onFilterChange(e.target.value)}
        />
      </div>
      <ul className="route-list">
        {routes.map(route => (
          <li key={route.id} className="route-item">
            <div className="route-icon-container">
              <Route size={18} />
            </div>
            <span className="route-name">{route.origin} - {route.destination}</span>
            <span className={`status-dot ${route.status}`}></span>
          </li>
        ))}
      </ul>
    </aside>
  );
} 