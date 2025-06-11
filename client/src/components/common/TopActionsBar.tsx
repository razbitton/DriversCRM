import React, { useState } from "react";
import { Users, MessageSquare, Package, Car } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NewTripModal from "../modals/NewTripModal";
import NewDeliveryModal from "../modals/NewDeliveryModal";
import MessageModal from "../modals/MessageModal";
import NewDriverModal from "../modals/NewDriverModal";

export default function TopActionsBar({ onRefresh }: { onRefresh?: () => void }) {
  const [isNewTripModalOpen, setIsNewTripModalOpen] = useState(false);
  const [isNewDeliveryModalOpen, setIsNewDeliveryModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isNewDriverModalOpen, setIsNewDriverModalOpen] = useState(false);

  const refreshPage = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      window.location.reload();
    }
  }

  const handleTripCreated = () => {
    setIsNewTripModalOpen(false);
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleDeliveryCreated = () => {
    setIsNewDeliveryModalOpen(false);
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <>
      <header className="top-actions">
        <style>{`
          .top-actions {
            display: flex;
            justify-content: flex-start;
            gap: 15px;
            margin-bottom: 30px;
          }
          
          .btn-light-yellow {
            background-color: hsl(57, 100%, 95%);
            border: 1px solid hsl(48, 96%, 89%);
            padding: 10px 20px;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s;
            text-decoration: none;
            color: inherit;
          }
          
          .btn-light-yellow:hover {
            background-color: hsl(48, 100%, 91%);
            transform: translateY(-1px);
          }
        `}</style>
        
        <button className="btn-light-yellow" onClick={() => setIsNewDriverModalOpen(true)}>
          <Users size={16} />
          נהג חדש
        </button>
        <button className="btn-light-yellow" onClick={() => setIsMessageModalOpen(true)}>
          <MessageSquare size={16} />
          הודעה לנהגים
        </button>
        <button className="btn-light-yellow" onClick={() => setIsNewDeliveryModalOpen(true)}>
          <Package size={16} />
          שליחות חדשה
        </button>
        <button className="btn-light-yellow" onClick={() => setIsNewTripModalOpen(true)}>
          <Car size={16} />
          נסיעה חדשה
        </button>
      </header>
      
      {/* Trip Modal */}
      <Dialog open={isNewTripModalOpen} onOpenChange={setIsNewTripModalOpen}>
        <DialogContent className="max-w-[500px] p-0" dir="rtl">
            <DialogHeader className="p-4 border-b text-right bg-white">
                <DialogTitle>
                    <span className="text-gray-400 text-sm font-normal">12523 | </span>
                    <span className="font-medium">נסיעה חדשה</span>
                </DialogTitle>
            </DialogHeader>
            <div className="bg-gray-100">
                <NewTripModal setOpen={setIsNewTripModalOpen} onTripCreated={handleTripCreated} />
            </div>
        </DialogContent>
      </Dialog>

      {/* Delivery Modal */}
      <Dialog open={isNewDeliveryModalOpen} onOpenChange={setIsNewDeliveryModalOpen}>
        <DialogContent className="max-w-[500px] p-0" dir="rtl">
            <DialogHeader className="p-4 border-b text-right bg-white">
                <DialogTitle>
                    <span className="text-gray-400 text-sm font-normal">12523 | </span>
                    <span className="font-medium">שליחות חדשה</span>
                </DialogTitle>
            </DialogHeader>
            <div className="bg-gray-100">
                <NewDeliveryModal setOpen={setIsNewDeliveryModalOpen} onDeliveryCreated={handleDeliveryCreated} />
            </div>
        </DialogContent>
      </Dialog>

      {/* Message Modal */}
      <Dialog open={isMessageModalOpen} onOpenChange={setIsMessageModalOpen}>
        <DialogContent className="max-w-[700px] p-0" dir="rtl">
          <DialogHeader className="p-6 border-b text-right">
            <DialogTitle className="text-xl font-medium">שליחת הודעות</DialogTitle>
          </DialogHeader>
          <MessageModal setOpen={setIsMessageModalOpen} />
        </DialogContent>
      </Dialog>
      
      {/* New Driver Modal */}
      <Dialog open={isNewDriverModalOpen} onOpenChange={setIsNewDriverModalOpen}>
          <DialogContent className="max-w-[650px] p-0" dir="rtl">
              <DialogHeader className="p-6 border-b text-right">
                <DialogTitle className="text-xl font-medium">נהג חדש</DialogTitle>
              </DialogHeader>
              <NewDriverModal setOpen={setIsNewDriverModalOpen} onDriverCreated={refreshPage} />
          </DialogContent>
      </Dialog>
    </>
  );
}
