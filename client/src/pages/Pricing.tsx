import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Filter } from "lucide-react";
import TopActionsBar from "@/components/common/TopActionsBar";
import SearchInput from "@/components/common/SearchInput";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils";
import type { Pricing } from "@shared/schema";

export default function Pricing() {
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

  // Fetch pricing
  const { data: pricing = [], isLoading, refetch } = useQuery<Pricing[]>({
    queryKey: ["/api/pricing"],
  });

  const handleRefresh = () => {
    refetch();
  };

  const handleDeletePricing = (pricingItem: Pricing) => {
    setConfirmModal({
      isOpen: true,
      title: "מחיקת מחיר",
      message: `האם אתה בטוח שברצונך למחוק את המחיר עבור ${pricingItem.route_name}?`,
      onConfirm: () => {
        // TODO: Implement delete functionality
        console.log("Deleting pricing:", pricingItem.id);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleEditPricing = (pricingItem: Pricing) => {
    console.log("Editing pricing:", pricingItem.id);
    // TODO: Implement edit functionality
  };

  const handleViewPricing = (pricingItem: Pricing) => {
    console.log("Viewing pricing:", pricingItem.id);
    // TODO: Implement view functionality
  };

  const handleSearch = (query: string) => {
    console.log("Searching:", query);
    // TODO: Implement search functionality
  };

  const handleAddNewPricing = () => {
    console.log("Adding new pricing");
    // TODO: Implement add functionality
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
          {/* Tabs Navigation */}
          <nav className="tab-navigation">
            <div style={{ display: 'flex', gap: '2rem' }}>
              <button className="tab-link active">
                מחירון כללי ({pricing.length})
              </button>
            </div>
          </nav>

          {/* Toolbar */}
          <div className="flex items-center gap-4">
            <Button 
              className="btn-primary-fleet"
              onClick={handleAddNewPricing}
            >
              <Plus size={16} />
              מחיר חדש
            </Button>

            <SearchInput onSearch={handleSearch} placeholder="חיפוש מחירים..." />

            <Button variant="outline" className="btn-outline-fleet">
              <Filter size={16} />
              סינון
            </Button>
          </div>
        </div>

        {/* Pricing Table */}
        <div className="content-card">
          <div className="data-table">
            <div className="table-header" style={{ gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr 1fr 1fr 150px" }}>
              <div>שם מסלול</div>
              <div>נתיב</div>
              <div>סוג שירות</div>
              <div>מחיר בסיס</div>
              <div>מחיר לק"מ</div>
              <div>מחיר מינימום</div>
              <div>סטטוס</div>
              <div className="text-left">פעולות</div>
            </div>
            
            <div>
              {pricing.map((pricingItem) => (
                <div key={pricingItem.id} className="table-row" style={{ gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr 1fr 1fr 150px" }}>
                  <div className="font-semibold">{pricingItem.route_name}</div>
                  <div>{pricingItem.origin} - {pricingItem.destination}</div>
                  <div className="capitalize">{pricingItem.service_type}</div>
                  <div className="font-semibold">{formatCurrency(pricingItem.base_price)}</div>
                  <div>{pricingItem.per_km_price ? formatCurrency(pricingItem.per_km_price) : '-'}</div>
                  <div>{pricingItem.min_price ? formatCurrency(pricingItem.min_price) : '-'}</div>
                  <div>
                    <Badge className={`${pricingItem.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} border`}>
                      {pricingItem.is_active ? 'פעיל' : 'לא פעיל'}
                    </Badge>
                  </div>
                  <div className="col-actions">
                    <button onClick={() => handleEditPricing(pricingItem)} className="btn-icon-action" title="עריכה">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button onClick={() => handleViewPricing(pricingItem)} className="btn-icon-action" title="צפייה">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                    <button onClick={() => handleDeletePricing(pricingItem)} className="btn-icon-action" title="מחיקה">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1 2-2h4a2,2 0 0,1 2,2v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              
              {pricing.length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-icon">💰</div>
                  <div className="empty-state-title">אין מחירים במערכת</div>
                  <div className="empty-state-description">הוסף מחיר חדש כדי להתחיל</div>
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
