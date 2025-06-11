import React from "react";

export default function TenderTabs({ activeTab, onTabChange, counts }) {
  const tabs = [
    { id: 'all', label: `כל המכרזים (${counts.all || 0})` },
    { id: 'active', label: `מכרזים פעילים (${counts.active || 0})` },
    { id: 'completed', label: `מכרזים שהסתיימו (${counts.completed || 0})` },
  ];

  return (
    <nav className="border-b border-gray-200 mb-5">
      <style>{`
        .tender-tabs {
          list-style: none;
          display: flex;
          gap: 30px;
          padding: 0;
          margin: 0;
        }
        
        .tender-tab-link {
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
        
        .tender-tab-link:hover {
          color: #333;
        }
        
        .tender-tab-link.active {
          color: #333;
          font-weight: 700;
          border-bottom-color: #f9d871;
        }
      `}</style>
      
      <ul className="tender-tabs">
        {tabs.map((tab) => (
          <li key={tab.id}>
            <button
              className={`tender-tab-link ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
} 