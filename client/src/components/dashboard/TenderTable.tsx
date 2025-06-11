import React from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, StopCircle, Eye } from "lucide-react";
import type { Tender } from "@shared/schema";

const statusConfig = {
  active: { label: "פעיל", className: "bg-green-100 text-green-700" },
  waiting: { label: "ממתין", className: "bg-yellow-100 text-yellow-700" },
  completed: { label: "הושלם", className: "bg-gray-100 text-gray-700" },
  cancelled: { label: "בוטל", className: "bg-red-100 text-red-700" },
};

const serviceTypeConfig = {
  delivery: { label: "משלוח", className: "bg-green-100 text-green-700" },
  ride: { label: "הסעה", className: "bg-blue-100 text-blue-700" },
  special: { label: "מיוחד", className: "bg-purple-100 text-purple-700" },
};

export default function TenderTable({ tenders, onEdit, onDelete, onStop, onView }: {
  tenders: Tender[];
  onEdit?: (tender: Tender) => void;
  onDelete?: (tender: Tender) => void;
  onStop?: (tender: Tender) => void;
  onView?: (tender: Tender) => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <style>{`
        .tender-table-header, .tender-table-row {
          display: grid;
          grid-template-columns: 1fr 2fr 1.5fr 1fr 1.5fr 1fr 1.5fr 150px;
          align-items: center;
          padding: 15px 20px;
          gap: 15px;
        }
        
        .tender-table-header {
          background-color: hsl(220, 14%, 96%);
          color: hsl(220, 9%, 43%);
          font-weight: 500;
          font-size: 14px;
          border-bottom: 1px solid hsl(220, 13%, 91%);
        }
        
        .tender-table-row {
          border-bottom: 1px solid hsl(220, 26%, 97%);
          font-size: 15px;
          transition: background-color 0.2s;
        }
        
        .tender-table-row:hover {
          background-color: hsl(220, 14%, 96%);
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
          background: hsl(57, 100%, 95%);
          border: 1px solid hsl(48, 94%, 84%);
          color: hsl(30, 50%, 40%);
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
          background-color: hsl(48, 100%, 91%);
          transform: translateY(-1px);
        }
      `}</style>
      
      <div className="tender-table-header">
        <div>מספר מכרז</div>
        <div>נתיב</div>
        <div>לקוח</div>
        <div>סוג שירות</div>
        <div>נהג</div>
        <div>סטטוס</div>
        <div>זמן פרסום</div>
        <div className="text-left">פעולות</div>
      </div>
      
      <div>
        {tenders.map((tender) => {
          const statusStyle = statusConfig[tender.status as keyof typeof statusConfig] || statusConfig.active;
          const serviceStyle = serviceTypeConfig[tender.service_type as keyof typeof serviceTypeConfig] || serviceTypeConfig.delivery;
          
          return (
            <div key={tender.id} className="tender-table-row">
              <div className="font-medium text-blue-600">#{tender.tender_number}</div>
              <div>{tender.origin} - {tender.destination}</div>
              <div>{tender.client_name}</div>
              <div><Badge className={`${serviceStyle.className} border`}>{serviceStyle.label}</Badge></div>
              <div>-</div>
              <div><Badge className={`${statusStyle.className} border`}>{statusStyle.label}</Badge></div>
              <div className="text-gray-500">
                {tender.created_at ? format(new Date(tender.created_at), "dd/MM/yyyy HH:mm") : '-'}
              </div>
              <div className="col-actions">
                <button onClick={() => onEdit?.(tender)} className="btn-icon-action" title="עריכה">
                  <Edit size={14} />
                </button>
                <button onClick={() => onStop?.(tender)} className="btn-icon-action" title="עצירה">
                  <StopCircle size={14} />
                </button>
                <button onClick={() => onDelete?.(tender)} className="btn-icon-action" title="מחיקה">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
        
        {tenders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            אין מכרזים להציג
          </div>
        )}
      </div>
    </div>
  );
}
