import React from 'react';
import { MapPin, Edit, Trash2 } from 'lucide-react';

export default function PricingRow({ route }) {
  const isAssignedToChannel = !!route.channel_id;

  const formatPrice = (price) => {
    return price ? `₪${price.toLocaleString()}` : '-';
  };

  return (
    <div className={`pricing-row ${isAssignedToChannel ? 'channel-assigned' : ''}`}>
      <style>{`
        .pricing-row {
          display: grid;
          grid-template-columns: 2.5fr 1fr 1fr 1fr 1fr;
          align-items: center;
          background-color: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 1rem 1.5rem;
          transition: all 0.2s ease-in-out;
          gap: 1rem;
        }
        .pricing-row:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          border-color: #d1d5db;
          transform: translateY(-2px);
        }
        .pricing-row.channel-assigned {
          background-color: #faf5ff;
          border-color: #e9d5ff;
        }
        .route-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .route-name {
          font-weight: 600;
          color: #1f2937;
        }
        .channel-info-row {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          font-weight: 500;
          color: #8b5cf6;
        }
        .price-cell {
          font-weight: 500;
          color: #374151;
          text-align: center;
        }
        .actions-cell {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
        }
        .btn-icon-action {
          background: #fef8e7;
          border: 1px solid #f0dca4;
          color: #a8842c;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.2s;
        }
        .btn-icon-action:hover {
          background-color: #fff3cd;
        }
      `}</style>
      
      <div className="route-info">
        <span className="route-name">{route.origin} - {route.destination}</span>
        {isAssignedToChannel && (
          <div className="channel-info-row">
            <MapPin size={12} />
            <span>משויך לערוץ: {route.channel_id}</span>
          </div>
        )}
      </div>
      
      <div className="price-cell">{formatPrice(route.one_way_price)}</div>
      <div className="price-cell">{formatPrice(route.return_price)}</div>
      <div className="price-cell">{formatPrice(route.round_trip_price)}</div>

      <div className="actions-cell">
        <button className="btn-icon-action" title="עריכה">
          <Edit size={14} />
        </button>
        <button className="btn-icon-action" title="מחיקה">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
} 