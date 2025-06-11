import React from "react";

export default function ClientTabs({ counts }: { counts: { all: number } }) {
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
          color: hsl(220, 9%, 43%);
          font-size: 16px;
          padding-bottom: 15px;
          display: block;
          position: relative;
          border-bottom: 3px solid transparent;
          transition: all 0.3s;
          font-weight: 500;
        }
        
        .client-tab-link.active {
          color: hsl(0, 0%, 20%);
          font-weight: 700;
          border-bottom-color: hsl(48, 89%, 71%);
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
