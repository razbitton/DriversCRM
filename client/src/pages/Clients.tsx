import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react"; 

import ClientTabs from "@/components/clients/ClientTabs";
import ClientToolbar from "@/components/clients/ClientToolbar";
import ClientTable from "@/components/clients/ClientTable";
import TopActionsBar from "@/components/common/TopActionsBar";
import type { Client } from "@shared/schema";

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch clients
  const { data: fetchedClients = [], refetch } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  useEffect(() => {
    loadClients();
  }, [fetchedClients]);

  useEffect(() => {
    applyFilters();
  }, [clients, searchTerm]);

  const loadClients = async () => {
    try {
      setClients(fetchedClients);
    } catch (error) {
      console.error("Error loading clients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = clients.filter(client =>
      client.full_name &&
      client.phone &&
      client.status
    );

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(client => 
        client.full_name?.toLowerCase().includes(lowerSearchTerm) ||
        client.phone?.includes(lowerSearchTerm) ||
        client.address?.toLowerCase().includes(lowerSearchTerm)
      );
    }

    setFilteredClients(filtered);
  };
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleDeleteClient = async (client: Client) => {
    if (window.confirm(`האם אתה בטוח שברצונך למחוק את הלקוח ${client.full_name}?`)) {
      try {
        const response = await fetch(`/api/clients/${client.id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          refetch();
        }
      } catch (error) {
        console.error("Error deleting client:", error);
      }
    }
  };

  const handleViewClient = (client: Client) => {
    console.log("Viewing client:", client.id);
    // Handle view logic
  };

  const handleShowClientDetails = (client: Client) => {
    console.log("Showing client details:", client.id);
    // Handle details logic
  };

  const handleAddNewClient = () => {
    console.log("Adding new client");
    // Handle add logic
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

      <section className="clients-section">
        <div className="flex justify-between items-center mb-5">
            <ClientTabs counts={{ all: filteredClients.length }} />
            <ClientToolbar onSearch={handleSearch} onAddNew={handleAddNewClient} />
        </div>
        
        {filteredClients.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border border-gray-200 text-center">
            <Users className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-500 text-lg">
              {searchTerm ? 'לא נמצאו לקוחות התואמים לחיפוש' : 'אין לקוחות במערכת'}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              לקוחות חדשים יוצגו כאן
            </p>
          </div>
        ) : (
          <ClientTable
            clients={filteredClients}
            onDelete={handleDeleteClient}
            onView={handleViewClient}
            onShowDetails={handleShowClientDetails}
          />
        )}
      </section>
    </div>
  );
}