
import React, { useState, useEffect } from "react";
import { Payment } from "@/entities/Payment";
import { Driver } from "@/entities/Driver"; // Import Driver entity
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

import PaymentTabs from "../components/payments/PaymentTabs";
import PaymentTable from "../Components/payments/PaymentTable";
import TopActionsBar from "../Components/common/TopActionsBar";
import SearchInput from "../Components/common/SearchInput";
import DriverDetailsModal from "../components/drivers/DriverDetailsModal"; // Import DriverDetailsModal

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedDriverForDetails, setSelectedDriverForDetails] = useState(null);

  useEffect(() => {
    loadPayments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [payments, activeTab, searchTerm]);

  const loadPayments = async () => {
    try {
      const data = await Payment.list("-payment_date");
      setPayments(data);
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
        filtered = filtered.filter(p => p.payment_type === 'driver_payment');
        break;
      case 'debts':
        filtered = filtered.filter(p => p.status === 'pending' || p.amount < 0);
        break;
      default:
        // all - no additional filtering
        break;
    }

    // Apply search term
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(payment => 
        payment.driver_name?.toLowerCase().includes(lowerSearchTerm) ||
        payment.payment_number?.toLowerCase().includes(lowerSearchTerm) ||
        payment.phone?.includes(lowerSearchTerm)
      );
    }

    setFilteredPayments(filtered);
  };

  const getCounts = () => {
    return {
      all: payments.length,
      drivers: payments.filter(p => p.payment_type === 'driver_payment').length,
      debts: payments.filter(p => p.status === 'pending' || p.amount < 0).length,
    };
  };

  const handleEditPayment = (payment) => {
    console.log("Edit payment:", payment);
    // Handle edit logic
  };

  const handleViewPayment = async (payment) => {
    if (!payment.driver_name) {
      console.error("Payment object does not have a driver_name", payment);
      alert("לתשלום זה לא משויך שם נהג.");
      return;
    }
    try {
      const drivers = await Driver.filter({ full_name: payment.driver_name });
      if (drivers && drivers.length > 0) {
        setSelectedDriverForDetails(drivers[0]);
        setIsDetailsModalOpen(true);
      } else {
        alert(`שגיאה: לא ניתן למצוא את פרטי הנהג '${payment.driver_name}'. ייתכן שהנהג נמחק מהמערכת.`);
      }
    } catch (error) {
      console.error("Error fetching driver details:", error);
      alert("אירעה שגיאה בעת שליפת נתוני הנהג.");
    }
  };

  const handleDeletePayment = async (payment) => {
    if (window.confirm(`האם אתה בטוח שברצונך למחוק את התשלום של ${payment.driver_name}?`)) {
      try {
        await Payment.delete(payment.id);
        loadPayments(); // Reload payments after deletion
      } catch (error) {
        console.error("Error deleting payment:", error);
      }
    }
  };

  const handleSearch = (term) => {
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
            onEdit={handleEditPayment}
            onView={handleViewPayment}
            onDelete={handleDeletePayment}
          />
        )}
      </section>

      {isDetailsModalOpen && selectedDriverForDetails && (
        <DriverDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          driver={selectedDriverForDetails}
          initialTab={'payments'}
        />
      )}
    </div>
  );
}
