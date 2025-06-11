import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Users, MessageSquare, Package, Car } from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";

import StatsCard from "@/components/dashboard/StatsCard";
import TripItem from "@/components/dashboard/TripItem";
import TopActionsBar from "@/components/common/TopActionsBar";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import type { Trip } from "@shared/schema";

export default function Dashboard() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // Add active tab state
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    trip: null as Trip | null
  });

  // Fetch trips
  const { data: fetchedTrips = [], refetch: refetchTrips } = useQuery<Trip[]>({
    queryKey: ["/api/trips"],
  });

  useEffect(() => {
    loadTrips();
  }, [fetchedTrips]);

  const loadTrips = async () => {
    try {
      setTrips(fetchedTrips);
    } catch (error) {
      console.error("Error loading trips:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const activeTrips = trips.filter(trip => trip.status === "active");
  const waitingTrips = trips.filter(trip => trip.status === "waiting");
  const completedTrips = trips.filter(trip => trip.status === "completed");

  // Get displayed trips based on active tab
  const getDisplayedTrips = () => {
    switch(activeTab) {
      case 'active':
        return activeTrips;
      case 'waiting':
        return waitingTrips;
      case 'completed':
        return completedTrips;
      default:
        return activeTrips;
    }
  };

  // Get section title based on active tab
  const getSectionTitle = () => {
    switch(activeTab) {
      case 'active':
        return `נסיעות פעילות (${activeTrips.length})`;
      case 'waiting':
        return `נסיעות ממתינות (${waitingTrips.length})`;
      case 'completed':
        return `נסיעות שהסתיימו (${completedTrips.length})`;
      default:
        return `נסיעות פעילות (${activeTrips.length})`;
    }
  };

  // Get empty state message based on active tab
  const getEmptyMessage = () => {
    switch(activeTab) {
      case 'active':
        return "אין נסיעות פעילות כרגע";
      case 'waiting':
        return "אין נסיעות ממתינות כרגע";
      case 'completed':
        return "אין נסיעות שהסתיימו כרגע";
      default:
        return "אין נסיעות כרגע";
    }
  };

  const handleStopTrip = (trip: Trip) => {
    setConfirmationModal({
      isOpen: true,
      trip: trip
    });
  };

  const confirmStopTrip = async () => {
    if (!confirmationModal.trip) return;
    
    try {
      // Update trip status to completed
      const response = await fetch(`/api/trips/${confirmationModal.trip.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: "completed"
        }),
      });
      
      if (response.ok) {
        refetchTrips();
      }
      setConfirmationModal({ isOpen: false, trip: null });
    } catch (error) {
      console.error("Error stopping trip:", error);
    }
  };

  const handleDeleteTrip = async (trip: Trip) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק את הנסיעה?")) {
      try {
        const response = await fetch(`/api/trips/${trip.id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          refetchTrips();
        }
      } catch (error) {
        console.error("Error deleting trip:", error);
      }
    }
  };

  const handleRefresh = () => {
    refetchTrips();
  };

  if (isLoading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const displayedTrips = getDisplayedTrips();

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <TopActionsBar onRefresh={handleRefresh} />

      <section className="stats-section mb-10">
        <h2 className="text-xl font-semibold mb-5 text-gray-700">
          דוח כללי - {format(new Date(), "d.M.yyyy", { locale: he })}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <StatsCard 
            title="סכום כסף?"
            isPlaceholder={true}
          />
          <button 
            onClick={() => setActiveTab('completed')}
            className="w-full"
          >
            <StatsCard 
              title="נסיעות שהסתיימו"
              value={completedTrips.length}
              isActive={activeTab === 'completed'}
            />
          </button>
          <button 
            onClick={() => setActiveTab('waiting')}
            className="w-full"
          >
            <StatsCard 
              title="נסיעות ממתינות"
              value={waitingTrips.length}
              isActive={activeTab === 'waiting'}
            />
          </button>
          <button 
            onClick={() => setActiveTab('active')}
            className="w-full"
          >
            <StatsCard 
              title="נסיעות פעילות"
              value={activeTrips.length}
              isActive={activeTab === 'active'}
            />
          </button>
        </div>
      </section>

      <section className="trips-list-section">
        <h2 className="text-xl font-semibold mb-5 text-gray-700">{getSectionTitle()}</h2>
        <div className="space-y-3">
          {displayedTrips.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
              <Car className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-500 text-lg">{getEmptyMessage()}</p>
              <p className="text-gray-400 text-sm mt-2">נסיעות חדשות יוצגו כאן</p>
            </div>
          ) : (
            displayedTrips.map((trip) => (
              <TripItem
                key={trip.id}
                trip={trip}
                onStop={handleStopTrip}
                onDelete={handleDeleteTrip}
              />
            ))
          )}
        </div>
      </section>

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ isOpen: false, trip: null })}
        onConfirm={confirmStopTrip}
        title="עצירת נסיעה"
        message={`האם אתה בטוח שברצונך לעצור את הנסיעה "${confirmationModal.trip?.origin} - ${confirmationModal.trip?.destination}"?`}
        confirmText="עצור נסיעה"
        cancelText="ביטול"
      />
    </div>
  );
}