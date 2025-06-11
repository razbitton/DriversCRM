import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Filter } from "lucide-react";
import TopActionsBar from "@/components/common/TopActionsBar";
import SearchInput from "@/components/common/SearchInput";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import NewDriverModal from "@/components/modals/NewDriverModal";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { Driver } from "@shared/schema";

const statusConfig = {
  active: { label: "פעיל", className: "bg-green-100 text-green-700" },
  inactive: { label: "לא פעיל", className: "bg-red-100 text-red-700" },
  suspended: { label: "מושעה", className: "bg-yellow-100 text-yellow-700" },
};

export default function Drivers() {
  const [isNewDriverModalOpen, setIsNewDriverModalOpen] = useState(false);
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

  // Fetch drivers
  const { data: drivers = [], isLoading, refetch } = useQuery<Driver[]>({
    queryKey: ["/api/drivers"],
  });

  const handleRefresh = () => {
    refetch();
  };

  const handleDriverCreated = () => {
    handleRefresh();
  };

  const handleDeleteDriver = (driver: Driver) => {
    setConfirmModal({
      isOpen: true,
      title: "מחיקת נהג",
      message: `האם אתה בטוח שברצונך למחוק את הנהג ${driver.first_name} ${driver.last_name}?`,
      onConfirm: () => {
        // TODO: Implement delete functionality
        console.log("Deleting driver:", driver.id);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleEditDriver = (driver: Driver) => {
    console.log("Editing driver:", driver.id);
    // TODO: Implement edit functionality
  };

  const handleViewDriver = (driver: Driver) => {
    console.log("Viewing driver:", driver.id);
    // TODO: Implement view functionality
  };

  const handleSearch = (query: string) => {
    console.log("Searching:", query);
    // TODO: Implement search functionality
  };

  const handleAddNewDriver = () => {
    setIsNewDriverModalOpen(true);
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
                נהגים ({drivers.length})
              </button>
            </div>
          </nav>

          {/* Toolbar */}
          <div className="flex items-center gap-4">
            <Button 
              className="btn-primary-fleet"
              onClick={handleAddNewDriver}
            >
              <Plus size={16} />
              נהג חדש
            </Button>

            <SearchInput onSearch={handleSearch} placeholder="חיפוש נהגים..." />

            <Button variant="outline" className="btn-outline-fleet">
              <Filter size={16} />
              סינון
            </Button>
          </div>
        </div>

        {/* Drivers Table */}
        <div className="content-card">
          <div className="data-table">
            <div className="table-header" style={{ gridTemplateColumns: "1fr 2fr 1.5fr 1.5fr 1fr 1fr 1.5fr 150px" }}>
              <div>מספר נהג</div>
              <div>שם מלא</div>
              <div>טלפון</div>
              <div>רישיון נהיגה</div>
              <div>רכב</div>
              <div>סטטוס</div>
              <div>תאריך הצטרפות</div>
              <div className="text-left">פעולות</div>
            </div>
            
            <div>
              {drivers.map((driver) => {
                const statusStyle = statusConfig[driver.status as keyof typeof statusConfig] || statusConfig.active;
                
                return (
                  <div key={driver.id} className="table-row" style={{ gridTemplateColumns: "1fr 2fr 1.5fr 1.5fr 1fr 1fr 1.5fr 150px" }}>
                    <div className="font-medium">#{driver.id}</div>
                    <div className="font-semibold">{driver.first_name} {driver.last_name}</div>
                    <div>{driver.phone}</div>
                    <div>{driver.license_number}</div>
                    <div>{driver.vehicle_number || '-'}</div>
                    <div><Badge className={`${statusStyle.className} border`}>{statusStyle.label}</Badge></div>
                    <div className="text-gray-500">
                      {driver.created_at ? format(new Date(driver.created_at), "dd/MM/yyyy") : 'N/A'}
                    </div>
                    <div className="col-actions">
                      <button onClick={() => handleEditDriver(driver)} className="btn-icon-action" title="עריכה">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button onClick={() => handleViewDriver(driver)} className="btn-icon-action" title="צפייה">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      </button>
                      <button onClick={() => handleDeleteDriver(driver)} className="btn-icon-action" title="מחיקה">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3,6 5,6 21,6"/>
                          <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1 2-2h4a2,2 0 0,1 2,2v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
              
              {drivers.length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-icon">👤</div>
                  <div className="empty-state-title">אין נהגים במערכת</div>
                  <div className="empty-state-description">הוסף נהג חדש כדי להתחיל</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* New Driver Modal */}
      <Dialog open={isNewDriverModalOpen} onOpenChange={setIsNewDriverModalOpen}>
        <DialogContent className="max-w-[650px] p-0" dir="rtl">
          <DialogHeader className="p-6 border-b text-right">
            <DialogTitle className="text-xl font-medium">נהג חדש</DialogTitle>
          </DialogHeader>
          <NewDriverModal setOpen={setIsNewDriverModalOpen} onDriverCreated={handleDriverCreated} />
        </DialogContent>
      </Dialog>

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
