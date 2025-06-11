import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, User, Phone, StopCircle, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import type { Trip } from "@shared/schema";

interface TripItemProps {
  trip: Trip;
  onStop: (trip: Trip) => void;
  onDelete: (trip: Trip) => void;
}

export default function TripItem({ trip, onStop, onDelete }: TripItemProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "waiting":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "completed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "פעיל";
      case "waiting":
        return "ממתין";
      case "completed":
        return "הושלם";
      default:
        return status;
    }
  };

  const formatTime = (date: Date | string | null) => {
    if (!date) return "--:--";
    try {
      return format(new Date(date), "HH:mm", { locale: he });
    } catch {
      return "--:--";
    }
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "לא נקבע";
    try {
      return format(new Date(date), "dd/MM/yyyy", { locale: he });
    } catch {
      return "לא נקבע";
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Badge className={`${getStatusColor(trip.status)} border`}>
            {getStatusText(trip.status)}
          </Badge>
          <span className="text-sm text-gray-500">
            נסיעה #{trip.id}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {trip.status === "active" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStop(trip)}
              className="text-orange-600 border-orange-200 hover:bg-orange-50"
            >
              <StopCircle size={16} />
              עצור
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(trip)}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <Trash2 size={16} />
            מחק
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-green-600" />
            <div>
              <span className="text-sm text-gray-500">מקור:</span>
              <span className="font-medium mr-2">{trip.origin}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-red-600" />
            <div>
              <span className="text-sm text-gray-500">יעד:</span>
              <span className="font-medium mr-2">{trip.destination}</span>
            </div>
          </div>
          {trip.notes && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">הערות:</span> {trip.notes}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-blue-600" />
            <div>
              <span className="text-sm text-gray-500">זמן מתוכנן:</span>
              <span className="font-medium mr-2">
                {formatTime(trip.scheduled_time)} | {formatDate(trip.scheduled_time)}
              </span>
            </div>
          </div>
          {trip.driver_id && (
            <div className="flex items-center gap-2">
              <User size={16} className="text-purple-600" />
              <div>
                <span className="text-sm text-gray-500">נהג:</span>
                <span className="font-medium mr-2">נהג #{trip.driver_id}</span>
              </div>
            </div>
          )}
          <div className="text-sm text-gray-500">
            נוצר: {formatDate(trip.created_at)}
          </div>
        </div>
      </div>
    </div>
  );
}