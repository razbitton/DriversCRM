import React from "react";

export default function ClientTabs({ counts }) {
  const tabs = [
    { id: 'all', label: `לקוחות (${counts.all || 0})` },
  ];

  return (
    <nav className="border-b border-gray-200">
      <style>{`
        .client-tabs {
          list-style: none;
          display: flex;
          gap: 30px;
          padding: 0;
          margin: 0;
        }
        
        .client-tab-link {
          text-decoration: none;
          color: #6c757d;
          font-size: 16px;
          padding-bottom: 15px;
          display: block;
          position: relative;
          border-bottom: 3px solid transparent;
          transition: all 0.3s;
          font-weight: 500;
        }
        
        .client-tab-link.active {
          color: #333;
          font-weight: 700;
          border-bottom-color: #f9d871;
        }
      `}</style>
      
      <ul className="client-tabs">
        {tabs.map((tab) => (
          <li key={tab.id}>
            <button
              className={`client-tab-link active`}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
} 