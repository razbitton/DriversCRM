import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Filter } from "lucide-react";
import TopActionsBar from "@/components/common/TopActionsBar";
import SearchInput from "@/components/common/SearchInput";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { Trip } from "@shared/schema";

const statusConfig = {
  scheduled: { label: "מתוכנן", className: "bg-blue-100 text-blue-700" },
  in_progress: { label: "בביצוע", className: "bg-yellow-100 text-yellow-700" },
  completed: { label: "הושלם", className: "bg-green-100 text-green-700" },
  cancelled: { label: "בוטל", className: "bg-red-100 text-red-700" },
};

const tripTypeConfig = {
  delivery: { label: "משלוח", className: "bg-green-100 text-green-700" },
  ride: { label: "הסעה", className: "bg-blue-100 text-blue-700" },
  special: { label: "מיוחד", className: "bg-purple-100 text-purple-700" },
};

export default function Trips() {
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

  // Fetch trips
  const { data: trips = [], isLoading, refetch } = useQuery<Trip[]>({
    queryKey: ["/api/trips"],
  });

  const handleRefresh = () => {
    refetch();
  };

  const handleDeleteTrip = (trip: Trip) => {
    setConfirmModal({
      isOpen: true,
      title: "מחיקת נסיעה",
      message: `האם אתה בטוח שברצונך למחוק את הנסיעה ${trip.origin} - ${trip.destination}?`,
      onConfirm: () => {
        // TODO: Implement delete functionality
        console.log("Deleting trip:", trip.id);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleEditTrip = (trip: Trip) => {
    console.log("Editing trip:", trip.id);
    // TODO: Implement edit functionality
  };

  const handleStopTrip = (trip: Trip) => {
    console.log("Stopping trip:", trip.id);
    // TODO: Implement stop functionality
  };

  const handleSearch = (query: string) => {
    console.log("Searching:", query);
    // TODO: Implement search functionality
  };

  const getFilteredTrips = () => {
    switch (activeTab) {
      case "scheduled":
        return trips.filter(t => t.status === "scheduled");
      case "in_progress":
        return trips.filter(t => t.status === "in_progress");
      case "completed":
        return trips.filter(t => t.status === "completed");
      default:
        return trips;
    }
  };

  const tabs = [
    { id: "all", label: `כל הנסיעות (${trips.length})` },
    { id: "scheduled", label: `מתוכננות (${trips.filter(t => t.status === "scheduled").length})` },
    { id: "in_progress", label: `בביצוע (${trips.filter(t => t.status === "in_progress").length})` },
    { id: "completed", label: `הושלמו (${trips.filter(t => t.status === "completed").length})` },
  ];

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
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`tab-link ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Toolbar */}
          <div className="flex items-center gap-4">
            <SearchInput onSearch={handleSearch} placeholder="חיפוש נסיעות..." />

            <Button variant="outline" className="btn-outline-fleet">
              <Filter size={16} />
              סינון
            </Button>
          </div>
        </div>

        {/* Trips Table */}
        <div className="content-card">
          <div className="data-table">
            <div className="table-header" style={{ gridTemplateColumns: "1fr 2fr 1.5fr 1fr 1fr 1.5fr 150px" }}>
              <div>מספר נסיעה</div>
              <div>מסלול</div>
              <div>לקוח</div>
              <div>סוג</div>
              <div>סטטוס</div>
              <div>זמן מתוכנן</div>
              <div className="text-left">פעולות</div>
            </div>
            
            <div>
              {getFilteredTrips().map((trip) => {
                const statusStyle = statusConfig[trip.status as keyof typeof statusConfig] || statusConfig.scheduled;
                const typeStyle = tripTypeConfig[trip.trip_type as keyof typeof tripTypeConfig] || tripTypeConfig.delivery;
                
                return (
                  <div key={trip.id} className="table-row" style={{ gridTemplateColumns: "1fr 2fr 1.5fr 1fr 1fr 1.5fr 150px" }}>
                    <div className="font-medium text-blue-600">#{trip.trip_number}</div>
                    <div>{trip.origin} - {trip.destination}</div>
                    <div className="font-semibold">{trip.client_name}</div>
                    <div><Badge className={`${typeStyle.className} border`}>{typeStyle.label}</Badge></div>
                    <div><Badge className={`${statusStyle.className} border`}>{statusStyle.label}</Badge></div>
                    <div className="text-gray-500">
                      {format(new Date(trip.scheduled_time), "dd/MM/yyyy HH:mm")}
                    </div>
                    <div className="col-actions">
                      <button onClick={() => handleStopTrip(trip)} className="btn-icon-action" title="עצירה">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <rect width="6" height="6" x="9" y="9"/>
                        </svg>
                      </button>
                      <button onClick={() => handleEditTrip(trip)} className="btn-icon-action" title="עריכה">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button onClick={() => handleDeleteTrip(trip)} className="btn-icon-action" title="מחיקה">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3,6 5,6 21,6"/>
                          <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1 2-2h4a2,2 0 0,1 2,2v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
              
              {getFilteredTrips().length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-icon">🚗</div>
                  <div className="empty-state-title">אין נסיעות להציג</div>
                  <div className="empty-state-description">צור נסיעה חדשה מהתפריט העליון</div>
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
