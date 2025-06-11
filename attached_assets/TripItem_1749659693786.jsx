import React from "react";
import { Square, Edit, Trash2, StopCircle } from "lucide-react";
import { format } from "date-fns";

const statusConfig = {
  delivery: { 
    label: "משלוח", 
    className: "bg-green-100 text-green-700" 
  },
  ride: { 
    label: "הסעה", 
    className: "bg-blue-100 text-blue-700" 
  },
  special: { 
    label: "מיוחד", 
    className: "bg-purple-100 text-purple-700" 
  }
};

export default function TripItem({ trip, onEdit, onDelete, onStop }) {
  const statusStyle = statusConfig[trip.trip_type] || statusConfig.delivery;
  
  return (
    <div className="flex items-center bg-white p-4 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
      <style>{`
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
          transform: translateY(-1px);
        }
      `}</style>
      
      <input 
        type="checkbox" 
        className="w-5 h-5 ml-4 accent-yellow-400" 
      />
      
      <div className="flex-grow">
        <span className="font-medium text-gray-900">
          {trip.origin} - {trip.destination} - {trip.client_name}
        </span>
      </div>
      
      <div className="flex items-center gap-5 min-w-[200px]">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle.className}`}>
          {statusStyle.label}
        </span>
        <span className="text-gray-500 text-sm">
          {format(new Date(trip.scheduled_time), "dd.MM.yyyy HH:mm")}
        </span>
      </div>
      
      <div className="flex gap-2 mx-6">
        <button 
          onClick={() => onStop?.(trip)}
          className="btn-icon-action"
          title="עצירה"
        >
          <StopCircle size={14} />
        </button>
        <button 
          onClick={() => onEdit?.(trip)}
          className="btn-icon-action"
          title="עריכה"
        >
          <Edit size={14} />
        </button>
        <button 
          onClick={() => onDelete?.(trip)}
          className="btn-icon-action"
          title="מחיקה"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
} 