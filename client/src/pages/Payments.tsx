import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Filter } from "lucide-react";
import TopActionsBar from "@/components/common/TopActionsBar";
import SearchInput from "@/components/common/SearchInput";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import PaymentTable from "@/components/payments/PaymentTable";
import PaymentTabs from "@/components/payments/PaymentTabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { formatCurrency } from "@/utils";
import type { Payment } from "@shared/schema";

const paymentTypeConfig = {
  salary: { label: "משכורת", className: "bg-blue-100 text-blue-700" },
  commission: { label: "עמלה", className: "bg-green-100 text-green-700" },
  bonus: { label: "בונוס", className: "bg-purple-100 text-purple-700" },
  deduction: { label: "ניכוי", className: "bg-red-100 text-red-700" },
};

const statusConfig = {
  pending: { label: "ממתין", className: "bg-yellow-100 text-yellow-700" },
  paid: { label: "שולם", className: "bg-green-100 text-green-700" },
  cancelled: { label: "בוטל", className: "bg-red-100 text-red-700" },
};

export default function Payments() {
  const [activeTab, setActiveTab] = useState("all");
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // Fetch payments
  const { data: payments = [], isLoading, refetch } = useQuery<Payment[]>({
    queryKey: ["/api/payments"],
  });

  const handleRefresh = () => {
    refetch();
  };

  const handleDeletePayment = (payment: Payment) => {
    setConfirmModal({
      isOpen: true,
      title: "מחיקת תשלום",
      message: `האם אתה בטוח שברצונך למחוק את התשלום בסך ${formatCurrency(payment.amount)}?`,
      onConfirm: () => {
        // TODO: Implement delete functionality
        console.log("Deleting payment:", payment.id);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleEditPayment = (payment: Payment) => {
    console.log("Editing payment:", payment.id);
    // TODO: Implement edit functionality
  };

  const handleViewPayment = (payment: Payment) => {
    console.log("Viewing payment:", payment.id);
    // TODO: Implement view functionality
  };

  const handleSearch = (query: string) => {
    console.log("Searching:", query);
    // TODO: Implement search functionality
  };

  const handleAddNewPayment = () => {
    console.log("Adding new payment");
    // TODO: Implement add functionality
  };

  const getFilteredPayments = () => {
    switch (activeTab) {
      case "pending":
        return payments.filter(p => p.status === "pending");
      case "paid":
        return payments.filter(p => p.status === "paid");
      case "cancelled":
        return payments.filter(p => p.status === "cancelled");
      default:
        return payments;
    }
  };

  const tabCounts = {
    all: payments.length,
    drivers: payments.filter(p => p.payment_type === "salary").length,
    debts: payments.filter(p => p.status === "pending").length,
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <TopActionsBar onRefresh={handleRefresh} />
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <TopActionsBar onRefresh={handleRefresh} />
      
      <section>
        <div className="toolbar-container">
          <PaymentTabs 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            counts={tabCounts} 
          />

          {/* Toolbar */}
          <div className="flex items-center gap-4">
            <Button 
              className="btn-primary-fleet"
              onClick={handleAddNewPayment}
            >
              <Plus size={16} />
              תשלום חדש
            </Button>

            <SearchInput onSearch={handleSearch} placeholder="חיפוש תשלומים..." />

            <Button variant="outline" className="btn-outline-fleet">
              <Filter size={16} />
              סינון
            </Button>
          </div>
        </div>

        {/* Payments Table */}
        <div className="content-card">
          <div className="data-table">
            <div className="table-header" style={{ gridTemplateColumns: "1fr 2fr 1fr 1.5fr 1fr 1.5fr 150px" }}>
              <div>מספר תשלום</div>
              <div>נהג</div>
              <div>סוג תשלום</div>
              <div>סכום</div>
              <div>סטטוס</div>
              <div>תאריך</div>
              <div className="text-left">פעולות</div>
            </div>
            
            <div>
              {getFilteredPayments().map((payment) => {
                const typeStyle = paymentTypeConfig[payment.payment_type as keyof typeof paymentTypeConfig] || paymentTypeConfig.salary;
                const statusStyle = statusConfig[payment.status as keyof typeof statusConfig] || statusConfig.pending;
                
                return (
                  <div key={payment.id} className="table-row" style={{ gridTemplateColumns: "1fr 2fr 1fr 1.5fr 1fr 1.5fr 150px" }}>
                    <div className="font-medium text-blue-600">#{payment.id}</div>
                    <div className="font-semibold">נהג #{payment.driver_id}</div>
                    <div><Badge className={`${typeStyle.className} border`}>{typeStyle.label}</Badge></div>
                    <div className="font-semibold">{formatCurrency(payment.amount)}</div>
                    <div><Badge className={`${statusStyle.className} border`}>{statusStyle.label}</Badge></div>
                    <div className="text-gray-500">
                      {payment.payment_date ? format(new Date(payment.payment_date), "dd/MM/yyyy") : 'N/A'}
                    </div>
                    <div className="col-actions">
                      <button onClick={() => handleEditPayment(payment)} className="btn-icon-action" title="עריכה">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button onClick={() => handleViewPayment(payment)} className="btn-icon-action" title="צפייה">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      </button>
                      <button onClick={() => handleDeletePayment(payment)} className="btn-icon-action" title="מחיקה">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3,6 5,6 21,6"/>
                          <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1 2-2h4a2,2 0 0,1 2,2v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
              
              {getFilteredPayments().length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-icon">💳</div>
                  <div className="empty-state-title">אין תשלומים להציג</div>
                  <div className="empty-state-description">הוסף תשלום חדש כדי להתחיל</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText="מחק"
        cancelText="ביטול"
        type="danger"
      />
    </div>
  );
}
