
import React, { useState, useEffect } from "react";
import { Client } from "@/entities/Client";
import { Users } from "lucide-react"; 

import ClientTabs from "../Components/clients/ClientTabs";
import ClientToolbar from "../Components/clients/ClientToolbar";
import ClientTable from "../Components/clients/ClientTable";
import TopActionsBar from "../Components/common/TopActionsBar"; 

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [clients, searchTerm]);

  const loadClients = async () => {
    try {
      const data = await Client.list("-last_activity_date");
      setClients(data);
    } catch (error) {
      console.error("Error loading clients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = clients.filter(client =>
      client.serial_number &&
      client.full_name &&
      client.phone &&
      client.status &&
      client.city &&
      client.payment_status &&
      client.last_activity_date
    );

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(client => 
        client.full_name?.toLowerCase().includes(lowerSearchTerm) ||
        client.serial_number?.toLowerCase().includes(lowerSearchTerm) ||
        client.phone?.includes(lowerSearchTerm) ||
        client.city?.toLowerCase().includes(lowerSearchTerm)
      );
    }

    setFilteredClients(filtered);
  };
  
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleDeleteClient = async (client) => {
    if (window.confirm(`האם אתה בטוח שברצונך למחוק את הלקוח ${client.full_name}?`)) {
      try {
        await Client.delete(client.id);
        loadClients();
      } catch (error) {
        console.error("Error deleting client:", error);
      }
    }
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
            <ClientToolbar onSearch={handleSearch} />
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
          />
        )}
      </section>
    </div>
  );
}
