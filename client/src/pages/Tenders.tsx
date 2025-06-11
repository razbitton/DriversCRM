import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Megaphone } from "lucide-react"; 
import { format, startOfDay, endOfDay } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";

import TenderTabs from "@/components/tenders/TenderTabs";
import TenderToolbar from "@/components/tenders/TenderToolbar";
import TenderTable from "@/components/tenders/TenderTable";
import TopActionsBar from "@/components/common/TopActionsBar"; 
import ConfirmationModal from "@/components/common/ConfirmationModal";
import EditTenderModal from "@/components/tenders/EditTenderModal";
import type { Tender, Driver } from "@shared/schema";

export default function Tenders() {
  const queryClient = useQueryClient();
  const [filteredTenders, setFilteredTenders] = useState<Tender[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    name: "",
    serviceType: "",
    publishDate: "",
    status: "",
    driverName: ""
  });
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    tender: null as Tender | null
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTender, setEditingTender] = useState<Tender | null>(null);

  // Fetch tenders and drivers
  const { data: tenders = [], isLoading, refetch } = useQuery<Tender[]>({
    queryKey: ["/api/tenders"],
  });

  const { data: drivers = [] } = useQuery<Driver[]>({
    queryKey: ["/api/drivers"],
  });

  const deleteTenderMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("/api/tenders", "DELETE", { id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tenders"] });
    },
  });

  const updateTenderMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Tender> }) => {
      return await apiRequest(`/api/tenders/${id}`, "PATCH", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tenders"] });
    },
  });

  useEffect(() => {
    applyFilters();
  }, [tenders, activeTab, searchTerm, filters]);

  const applyFilters = () => {
    let filtered = tenders;

    // Apply tab filter first
    switch (activeTab) {
      case 'active':
        filtered = filtered.filter(t => t.status === 'available' || t.status === 'taken');
        break;
      case 'completed':
        filtered = filtered.filter(t => t.status === 'completed' || t.status === 'cancelled');
        break;
      default:
        // all - no additional filtering
        break;
    }

    // Apply search term
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(tender => 
        tender.tender_number?.toLowerCase().includes(lowerSearchTerm) ||
        tender.origin?.toLowerCase().includes(lowerSearchTerm) ||
        tender.destination?.toLowerCase().includes(lowerSearchTerm) ||
        tender.assigned_driver_name?.toLowerCase().includes(lowerSearchTerm) ||
        tender.client_name?.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // Apply advanced filters
    if (filters.name) {
      const lowerName = filters.name.toLowerCase();
      filtered = filtered.filter(tender => 
        tender.tender_number?.toLowerCase().includes(lowerName) ||
        tender.origin?.toLowerCase().includes(lowerName) ||
        tender.destination?.toLowerCase().includes(lowerName)
      );
    }

    if (filters.serviceType) {
      filtered = filtered.filter(tender => tender.service_type === filters.serviceType);
    }

    if (filters.publishDate) {
      const filterDate = new Date(filters.publishDate);
      filtered = filtered.filter(tender => {
        const tenderDate = new Date(tender.publication_time);
        return tenderDate >= startOfDay(filterDate) && tenderDate <= endOfDay(filterDate);
      });
    }

    if (filters.status) {
      filtered = filtered.filter(tender => tender.status === filters.status);
    }

    if (filters.driverName) {
      const lowerDriverName = filters.driverName.toLowerCase();
      filtered = filtered.filter(tender => 
        tender.assigned_driver_name?.toLowerCase().includes(lowerDriverName)
      );
    }

    setFilteredTenders(filtered);
  };

  const getCounts = () => {
    return {
      all: tenders.length,
      active: tenders.filter(t => t.status === 'available' || t.status === 'taken').length,
      completed: tenders.filter(t => t.status === 'completed' || t.status === 'cancelled').length,
    };
  };
  
  const handleEditTender = (tender: Tender) => {
    setEditingTender(tender);
    setIsEditModalOpen(true);
  };

  const handleTenderUpdated = () => {
    setIsEditModalOpen(false);
    setEditingTender(null);
    refetch();
  };

  const handleStopTender = (tender: Tender) => {
    setConfirmationModal({
      isOpen: true,
      tender: tender
    });
  };

  const confirmStopTender = async () => {
    if (confirmationModal.tender) {
      try {
        await updateTenderMutation.mutateAsync({
          id: confirmationModal.tender.id,
          data: { 
            status: "cancelled",
            completion_time: new Date()
          }
        });
        setConfirmationModal({ isOpen: false, tender: null });
      } catch (error) {
        console.error("Error stopping tender:", error);
      }
    }
  };

  const handleDeleteTender = async (tender: Tender) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק את המכרז?")) {
      try {
        await deleteTenderMutation.mutateAsync(tender.id);
      } catch (error) {
        console.error("Error deleting tender:", error);
      }
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilter = (newFilters: any) => {
    setFilters(newFilters);
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
      <TopActionsBar onRefresh={refetch} />

      <section className="tenders-section">
        <div className="flex justify-between items-center mb-5">
           <TenderTabs 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            counts={getCounts()}
          />
          <TenderToolbar 
            onSearch={handleSearch}
            onFilter={handleFilter}
            drivers={drivers}
          />
        </div>

        {filteredTenders.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border border-gray-200 text-center">
            <Megaphone className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-500 text-lg">
              {searchTerm || Object.values(filters).some(f => f) ? 
                'לא נמצאו מכרזים התואמים לחיפוש' :
                activeTab === 'all' ? 'אין מכרזים במערכת' : 
                activeTab === 'active' ? 'אין מכרזים פעילים' : 
                'אין מכרזים שהסתיימו'}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {searchTerm || Object.values(filters).some(f => f) ? 
                'נסה לשנות את הסינון או החיפוש' :
                activeTab === 'all' ? 'מכרזים חדשים יוצגו כאן' : 
                'נסה לבחור טאב אחר או לשנות את הסינון'}
            </p>
          </div>
        ) : (
          <TenderTable
            tenders={filteredTenders}
            onStop={handleStopTender}
            onDelete={handleDeleteTender}
            onEdit={handleEditTender}
          />
        )}
      </section>

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ isOpen: false, tender: null })}
        onConfirm={confirmStopTender}
        title="ביטול מכרז"
        message={`האם אתה בטוח שברצונך לבטל את המכרז "${confirmationModal.tender?.origin} - ${confirmationModal.tender?.destination}"?`}
        confirmText="בטל מכרז"
        cancelText="ביטול"
      />

      {isEditModalOpen && editingTender && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="max-w-[500px] p-0" dir="rtl">
                <DialogHeader className="p-4 border-b text-right bg-white">
                    <DialogTitle>
                        <span className="text-gray-400 text-sm font-normal">עריכת מכרז | </span>
                        <span className="font-medium">{editingTender.tender_number}</span>
                    </DialogTitle>
                </DialogHeader>
                <div className="bg-gray-100">
                    <EditTenderModal 
                        setOpen={setIsEditModalOpen} 
                        onTenderUpdated={handleTenderUpdated}
                        tender={editingTender}
                    />
                </div>
            </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
