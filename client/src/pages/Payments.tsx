import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

import PaymentTabs from "@/components/payments/PaymentTabs";
import PaymentTable from "@/components/payments/PaymentTable";
import TopActionsBar from "@/components/common/TopActionsBar";
import SearchInput from "@/components/common/SearchInput";
import type { Payment, Driver } from "@shared/schema";

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedDriverForDetails, setSelectedDriverForDetails] = useState<Driver | null>(null);

  // Fetch payments
  const { data: fetchedPayments = [], refetch: refetchPayments } = useQuery<Payment[]>({
    queryKey: ["/api/payments"],
  });

  // Fetch drivers for lookup
  const { data: drivers = [] } = useQuery<Driver[]>({
    queryKey: ["/api/drivers"],
  });

  useEffect(() => {
    loadPayments();
  }, [fetchedPayments]);

  useEffect(() => {
    applyFilters();
  }, [payments, activeTab, searchTerm]);

  const loadPayments = async () => {
    try {
      setPayments(fetchedPayments);
    } catch (error) {
      console.error("Error loading payments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = payments;

    // Apply tab filter first
    switch (activeTab) {
      case 'drivers':
        filtered = filtered.filter(p => p.payment_type === 'salary' || p.payment_type === 'commission');
        break;
      case 'debts':
        filtered = filtered.filter(p => p.status === 'pending' || parseFloat(p.amount) < 0);
        break;
      default:
        // all - no additional filtering
        break;
    }

    // Apply search term
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(payment => {
        const driver = drivers.find(d => d.id === payment.driver_id);
        return (
          driver?.full_name?.toLowerCase().includes(lowerSearchTerm) ||
          payment.id.toString().includes(lowerSearchTerm) ||
          driver?.phone?.includes(lowerSearchTerm)
        );
      });
    }

    setFilteredPayments(filtered);
  };

  const getCounts = () => {
    return {
      all: payments.length,
      drivers: payments.filter(p => p.payment_type === 'salary' || p.payment_type === 'commission').length,
      debts: payments.filter(p => p.status === 'pending' || parseFloat(p.amount) < 0).length,
    };
  };

  const handleEditPayment = (payment: Payment) => {
    console.log("Edit payment:", payment);
    // Handle edit logic
  };

  const handleViewPayment = async (payment: Payment) => {
    if (!payment.driver_id) {
      console.error("Payment object does not have a driver_id", payment);
      alert("לתשלום זה לא משויך נהג.");
      return;
    }
    try {
      const driver = drivers.find(d => d.id === payment.driver_id);
      if (driver) {
        setSelectedDriverForDetails(driver);
        setIsDetailsModalOpen(true);
      } else {
        alert(`שגיאה: לא ניתן למצוא את פרטי הנהג. ייתכן שהנהג נמחק מהמערכת.`);
      }
    } catch (error) {
      console.error("Error fetching driver details:", error);
      alert("אירעה שגיאה בעת שליפת נתוני הנהג.");
    }
  };

  const handleDeletePayment = async (payment: Payment) => {
    const driver = drivers.find(d => d.id === payment.driver_id);
    const driverName = driver?.full_name || `נהג #${payment.driver_id}`;
    
    if (window.confirm(`האם אתה בטוח שברצונך למחוק את התשלום של ${driverName}?`)) {
      try {
        const response = await fetch(`/api/payments/${payment.id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          refetchPayments();
        }
      } catch (error) {
        console.error("Error deleting payment:", error);
      }
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  if (isLoading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <TopActionsBar />

      <section className="payments-section">
        <div className="flex justify-between items-center mb-5">
          <PaymentTabs 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            counts={getCounts()}
          />
          <div className="flex justify-end gap-5">
            <SearchInput 
              onSearch={handleSearch}
              placeholder="חיפוש תשלומים..."
            />
          </div>
        </div>

        {filteredPayments.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border border-gray-200 text-center">
            <CreditCard className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-500 text-lg">
              {searchTerm ? 
                'לא נמצאו תשלומים התואמים לחיפוש' :
                activeTab === 'all' ? 'אין תשלומים במערכת' : 
                activeTab === 'drivers' ? 'אין תשלומים לנהגים' : 
                'אין חובות או יתרות'}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              תשלומים חדשים יוצגו כאן
            </p>
          </div>
        ) : (
          <PaymentTable
            payments={filteredPayments}
            drivers={drivers}
            onEdit={handleEditPayment}
            onView={handleViewPayment}
            onDelete={handleDeletePayment}
          />
        )}
      </section>

      {isDetailsModalOpen && selectedDriverForDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">פרטי נהג - {selectedDriverForDetails.full_name}</h2>
              <button 
                onClick={() => setIsDetailsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div><strong>טלפון:</strong> {selectedDriverForDetails.phone}</div>
              <div><strong>כתובת:</strong> {selectedDriverForDetails.address || 'לא צוין'}</div>
              <div><strong>סטטוס:</strong> {selectedDriverForDetails.status}</div>
              <div><strong>תאריך הצטרפות:</strong> {selectedDriverForDetails.created_at ? new Date(selectedDriverForDetails.created_at).toLocaleDateString('he-IL') : 'לא צוין'}</div>
            </div>
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                סגור
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}