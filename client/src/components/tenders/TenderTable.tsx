import React from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StopCircle, Edit, Trash2, ArrowUpDown } from "lucide-react";
import type { Tender } from '@shared/schema';

const statusConfig = {
  available: { 
    label: "פנוי", 
    className: "bg-green-100 text-green-700" 
  },
  taken: { 
    label: "תפוס", 
    className: "bg-red-100 text-red-700" 
  },
  completed: { 
    label: "הושלם", 
    className: "bg-blue-100 text-blue-700" 
  },
  cancelled: { 
    label: "בוטל", 
    className: "bg-gray-100 text-gray-700" 
  }
};

const serviceTypeLabels = {
  delivery: "משלוח",
  ride: "הסעה",
  special: "מיוחד"
};

interface TenderTableProps {
  tenders: Tender[];
  onStop?: (tender: Tender) => void;
  onEdit?: (tender: Tender) => void;
  onDelete?: (tender: Tender) => void;
}

export default function TenderTable({ tenders, onStop, onEdit, onDelete }: TenderTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <style>{`
        .tender-table-header, .tender-table-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1.5fr 1fr 2fr 150px;
          align-items: center;
          padding: 15px 20px;
          gap: 15px;
        }
        
        .tender-table-header {
          background-color: #f8f9fa;
          color: #6c757d;
          font-weight: 500;
          font-size: 14px;
          border-bottom: 1px solid #dee2e6;
        }
        
        .tender-table-row {
          border-bottom: 1px solid #f1f3f5;
          font-size: 15px;
          transition: background-color 0.2s;
        }
        
        .tender-table-row:hover {
          background-color: #f8f9fa;
        }
        
        .tender-table-row:last-child {
          border-bottom: none;
        }
        
        .col-actions {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 8px;
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
          transform: translateY(-1px);
        }
      `}</style>
      
      <div className="tender-table-header">
        <div className="flex items-center gap-2">
          שם מכרז
          <ArrowUpDown size={14} className="text-gray-400" />
        </div>
        <div>סוג שירות</div>
        <div>שעת פרסום</div>
        <div>סטטוס</div>
        <div>נהג שקיבל את המכרז</div>
        <div className="text-left">פעולות</div>
      </div>
      
      <div>
        {tenders.map((tender) => {
          const statusStyle = statusConfig[tender.status as keyof typeof statusConfig] || statusConfig.available;
          
          return (
            <div key={tender.id} className="tender-table-row">
              <div className="font-medium">
                {tender.origin} - {tender.destination}
              </div>
              <div>
                {serviceTypeLabels[tender.service_type as keyof typeof serviceTypeLabels] || tender.service_type}
              </div>
              <div className="text-gray-600">
                {tender.created_at ? format(new Date(tender.created_at), "dd.MM.yyyy HH:mm") : 'N/A'}
              </div>
              <div>
                <Badge className={`${statusStyle.className} border`}>
                  {statusStyle.label}
                </Badge>
              </div>
              <div className="text-sm">
                {tender.driver_id ? (
                  <>
                    <span className="font-medium">נהג #{tender.driver_id}</span>
                    <span className="text-gray-500"> | טלפון</span>
                  </>
                ) : (
                  <span className="text-gray-400">לא שויך נהג</span>
                )}
              </div>
              <div className="col-actions">
                <button 
                  onClick={() => onStop?.(tender)}
                  className="btn-icon-action"
                  title="עצירה"
                >
                  <StopCircle size={14} />
                </button>
                <button 
                  onClick={() => onEdit?.(tender)}
                  className="btn-icon-action"
                  title="עריכה"
                >
                  <Edit size={14} />
                </button>
                <button 
                  onClick={() => onDelete?.(tender)}
                  className="btn-icon-action"
                  title="מחיקה"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}