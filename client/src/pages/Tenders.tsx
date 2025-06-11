import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Filter } from "lucide-react";
import TopActionsBar from "@/components/common/TopActionsBar";
import TenderTable from "@/components/dashboard/TenderTable";
import SearchInput from "@/components/common/SearchInput";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import NewTenderModal from "@/components/modals/NewTenderModal";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Tender } from "@shared/schema";

export default function Tenders() {
  const [activeTab, setActiveTab] = useState("all");
  const [isNewTenderModalOpen, setIsNewTenderModalOpen] = useState(false);
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

  // Fetch tenders
  const { data: tenders = [], isLoading, refetch } = useQuery<Tender[]>({
    queryKey: ["/api/tenders"],
  });

  const handleRefresh = () => {
    refetch();
  };

  const handleTenderCreated = () => {
    handleRefresh();
  };

  const handleDeleteTender = (tender: Tender) => {
    setConfirmModal({
      isOpen: true,
      title: "מחיקת מכרז",
      message: `האם אתה בטוח שברצונך למחוק את מכרז #${tender.tender_number}?`,
      onConfirm: () => {
        // TODO: Implement delete functionality
        console.log("Deleting tender:", tender.id);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleEditTender = (tender: Tender) => {
    console.log("Editing tender:", tender.id);
    // TODO: Implement edit functionality
  };

  const handleStopTender = (tender: Tender) => {
    console.log("Stopping tender:", tender.id);
    // TODO: Implement stop functionality
  };

  const handleViewTender = (tender: Tender) => {
    console.log("Viewing tender:", tender.id);
    // TODO: Implement view functionality
  };

  const handleSearch = (query: string) => {
    console.log("Searching:", query);
    // TODO: Implement search functionality
  };

  const getFilteredTenders = () => {
    switch (activeTab) {
      case "active":
        return tenders.filter(t => t.status === "active");
      case "completed":
        return tenders.filter(t => t.status === "completed");
      case "waiting":
        return tenders.filter(t => t.status === "waiting");
      default:
        return tenders;
    }
  };

  const tabs = [
    { id: "all", label: `כל המכרזים (${tenders.length})` },
    { id: "active", label: `פעילים (${tenders.filter(t => t.status === "active").length})` },
    { id: "completed", label: `הושלמו (${tenders.filter(t => t.status === "completed").length})` },
    { id: "waiting", label: `ממתינים (${tenders.filter(t => t.status === "waiting").length})` },
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
            <Button 
              className="btn-primary-fleet"
              onClick={() => setIsNewTenderModalOpen(true)}
            >
              <Plus size={16} />
              מכרז חדש
            </Button>

            <SearchInput onSearch={handleSearch} placeholder="חיפוש מכרזים..." />

            <Button variant="outline" className="btn-outline-fleet">
              <Filter size={16} />
              סינון
            </Button>
          </div>
        </div>

        {/* Tenders Table */}
        <div className="content-card">
          <TenderTable
            tenders={getFilteredTenders()}
            onEdit={handleEditTender}
            onDelete={handleDeleteTender}
            onStop={handleStopTender}
            onView={handleViewTender}
          />
        </div>
      </section>

      {/* New Tender Modal */}
      <Dialog open={isNewTenderModalOpen} onOpenChange={setIsNewTenderModalOpen}>
        <DialogContent className="max-w-[500px] p-0" dir="rtl">
          <DialogHeader className="p-4 border-b text-right bg-white">
            <DialogTitle>
              <span className="text-gray-400 text-sm font-normal">12523 | </span>
              <span className="font-medium">מכרז חדש</span>
            </DialogTitle>
          </DialogHeader>
          <div className="bg-gray-100">
            <NewTenderModal setOpen={setIsNewTenderModalOpen} onTenderCreated={handleTenderCreated} />
          </div>
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
