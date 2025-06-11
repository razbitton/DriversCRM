import React from "react";

interface PaymentTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  counts: {
    all?: number;
    drivers?: number;
    debts?: number;
  };
}

export default function PaymentTabs({ activeTab, onTabChange, counts }: PaymentTabsProps) {
  const tabs = [
    { id: 'all', label: `לקוחות (${counts.all || 0})` },
    { id: 'drivers', label: `נהגים (${counts.drivers || 0})` },
    { id: 'debts', label: `יתרות / חובות (${counts.debts || 0})` },
  ];

  return (
    <nav className="border-b border-gray-200 mb-5">
      <style>{`
        .payment-tabs {
          list-style: none;
          display: flex;
          gap: 30px;
          padding: 0;
          margin: 0;
        }
        
        .payment-tab-link {
          text-decoration: none;
          color: #6c757d;
          font-size: 16px;
          padding-bottom: 15px;
          display: block;
          position: relative;
          border-bottom: 3px solid transparent;
          transition: all 0.3s;
          font-weight: 500;
          background: none;
          border: none;
          cursor: pointer;
        }
        
        .payment-tab-link:hover {
          color: #333;
        }
        
        .payment-tab-link.active {
          color: #333;
          font-weight: 700;
          border-bottom-color: #f9d871;
        }
      `}</style>
      
      <ul className="payment-tabs">
        {tabs.map((tab) => (
          <li key={tab.id}>
            <button
              className={`payment-tab-link ${activeTab === tab.id ? 'active' : ''}`}
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