import React from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2, ArrowUpDown } from "lucide-react";

const statusConfig = {
  pending: { 
    label: "חייב", 
    className: "bg-red-100 text-red-700" 
  },
  completed: { 
    label: "זכאי", 
    className: "bg-green-100 text-green-700" 
  },
  failed: { 
    label: "ביטול", 
    className: "bg-gray-100 text-gray-700" 
  },
  cancelled: { 
    label: "ממתין", 
    className: "bg-yellow-100 text-yellow-700" 
  }
};

export default function PaymentTable({ payments, onEdit, onView, onDelete }) {
  const formatCurrency = (amount) => `₪ ${amount?.toLocaleString() || '0'}`;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <style>{`
        .payment-table-header, .payment-table-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1.5fr 1.5fr 1.5fr 1fr 150px;
          align-items: center;
          padding: 15px 20px;
          gap: 15px;
        }
        
        .payment-table-header {
          background-color: #f8f9fa;
          color: #6c757d;
          font-weight: 500;
          font-size: 14px;
          border-bottom: 1px solid #dee2e6;
        }
        
        .payment-table-row {
          border-bottom: 1px solid #f1f3f5;
          font-size: 15px;
          transition: background-color 0.2s;
        }
        
        .payment-table-row:hover {
          background-color: #f8f9fa;
        }
        
        .payment-table-row:last-child {
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
      
      <div className="payment-table-header">
        <div className="flex items-center gap-2">
          מספר סידורי
          <ArrowUpDown size={14} className="text-gray-400" />
        </div>
        <div>סכום יתרה</div>
        <div>סטטוס</div>
        <div>טלפון נהג</div>
        <div>טלפון</div>
        <div>עם לקוח</div>
        <div>שם הנהג</div>
        <div className="text-left">פעולות</div>
      </div>
      
      <div>
        {payments.map((payment) => {
          const statusStyle = statusConfig[payment.status] || statusConfig.pending;
          
          return (
            <div key={payment.id} className="payment-table-row">
              <div className="font-medium">
                {payment.payment_number}
              </div>
              <div className="font-semibold">
                {formatCurrency(payment.amount)}
              </div>
              <div>
                <Badge className={`${statusStyle.className} border`}>
                  {statusStyle.label}
                </Badge>
              </div>
              <div className="text-sm">
                {payment.phone || '050.7.655642'}
              </div>
              <div className="text-sm">
                {payment.phone || '050.7.655642'}
              </div>
              <div className="text-sm">
                {payment.description || 'משה אברהמי'}
              </div>
              <div className="font-medium">
                {payment.driver_name}
              </div>
              <div className="col-actions">
                <button 
                  onClick={() => onEdit?.(payment)}
                  className="btn-icon-action"
                  title="עריכה"
                >
                  <Edit size={14} />
                </button>
                <button 
                  onClick={() => onView?.(payment)}
                  className="btn-icon-action"
                  title="צפייה"
                >
                  <Eye size={14} />
                </button>
                <button 
                  onClick={() => onDelete?.(payment)}
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