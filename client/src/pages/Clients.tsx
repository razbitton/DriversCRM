import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import TopActionsBar from "@/components/common/TopActionsBar";
import ClientTable from "@/components/clients/ClientTable";
import ClientTabs from "@/components/clients/ClientTabs";
import ClientToolbar from "@/components/clients/ClientToolbar";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import NewClientModal from "@/components/modals/NewClientModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Client } from "@shared/schema";

export default function Clients() {
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
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

  // Fetch clients
  const { data: clients = [], isLoading, refetch } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const handleRefresh = () => {
    refetch();
  };

  const handleClientCreated = () => {
    handleRefresh();
  };

  const handleDeleteClient = (client: Client) => {
    setConfirmModal({
      isOpen: true,
      title: "מחיקת לקוח",
      message: `האם אתה בטוח שברצונך למחוק את הלקוח ${client.full_name}?`,
      onConfirm: () => {
        // TODO: Implement delete functionality
        console.log("Deleting client:", client.id);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleViewClient = (client: Client) => {
    console.log("Viewing client:", client.id);
    // TODO: Implement view functionality
  };

  const handleShowClientDetails = (client: Client) => {
    console.log("Showing client details:", client.id);
    // TODO: Implement details functionality
  };

  const handleSearch = (query: string) => {
    console.log("Searching:", query);
    // TODO: Implement search functionality
  };

  const handleAddNewClient = () => {
    setIsNewClientModalOpen(true);
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
          <ClientTabs counts={{ all: clients.length }} />

          {/* Toolbar */}
          <ClientToolbar onSearch={handleSearch} onAddNew={handleAddNewClient} />
        </div>

        {/* Clients Table */}
        <div className="content-card">
          <ClientTable
            clients={clients}
            onDelete={handleDeleteClient}
            onView={handleViewClient}
            onShowDetails={handleShowClientDetails}
          />
        </div>
      </section>

      {/* New Client Modal */}
      <Dialog open={isNewClientModalOpen} onOpenChange={setIsNewClientModalOpen}>
        <DialogContent className="max-w-[500px] p-0" dir="rtl">
          <DialogHeader className="p-6 border-b text-right">
            <DialogTitle className="text-xl font-medium">לקוח חדש</DialogTitle>
          </DialogHeader>
          <NewClientModal setOpen={setIsNewClientModalOpen} onClientCreated={handleClientCreated} />
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
