import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Filter, Download, Calendar } from "lucide-react";
import TopActionsBar from "@/components/common/TopActionsBar";
import SearchInput from "@/components/common/SearchInput";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { format } from "date-fns";
import { formatCurrency } from "@/utils";
import type { Driver, Trip, Payment } from "@shared/schema";

export default function DriverReport() {
  const [selectedDriver, setSelectedDriver] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("month");

  // Fetch drivers
  const { data: drivers = [] } = useQuery<Driver[]>({
    queryKey: ["/api/drivers"],
  });

  // Fetch trips
  const { data: trips = [] } = useQuery<Trip[]>({
    queryKey: ["/api/trips"],
  });

  // Fetch payments
  const { data: payments = [] } = useQuery<Payment[]>({
    queryKey: ["/api/payments"],
  });

  const handleSearch = (query: string) => {
    console.log("Searching:", query);
    // TODO: Implement search functionality
  };

  const handleExportReport = () => {
    console.log("Exporting driver report");
    // TODO: Implement export functionality
  };

  const getDriverStats = (driverId: number) => {
    const driverTrips = trips.filter(t => t.driver_id === driverId);
    const driverPayments = payments.filter(p => p.driver_id === driverId);
    
    return {
      totalTrips: driverTrips.length,
      completedTrips: driverTrips.filter(t => t.status === "completed").length,
      totalEarnings: driverPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0),
      avgRating: 4.5, // Mock rating
    };
  };

  const getFilteredDrivers = () => {
    if (selectedDriver === "all") {
      return drivers;
    }
    return drivers.filter(d => d.id.toString() === selectedDriver);
  };

  return (
    <div className="page-container">
      <TopActionsBar />
      
      <div className="page-header">
        <h1 className="page-title">דוח נהגים</h1>
        <p className="text-gray-600">מידע מפורט על ביצועי הנהגים במערכת</p>
      </div>
      
      <section>
        <div className="toolbar-container">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <Select value={selectedDriver} onValueChange={setSelectedDriver}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="בחר נהג" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הנהגים</SelectItem>
                {drivers.map((driver) => (
                  <SelectItem key={driver.id} value={driver.id.toString()}>
                    {driver.first_name} {driver.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="טווח תאריכים" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">שבוע אחרון</SelectItem>
                <SelectItem value="month">חודש אחרון</SelectItem>
                <SelectItem value="quarter">רבעון אחרון</SelectItem>
                <SelectItem value="year">שנה אחרונה</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-4">
            <Button 
              className="btn-primary-fleet"
              onClick={handleExportReport}
            >
              <Download size={16} />
              ייצוא דוח
            </Button>

            <SearchInput onSearch={handleSearch} placeholder="חיפוש נהגים..." />

            <Button variant="outline" className="btn-outline-fleet">
              <Filter size={16} />
              סינונים מתקדמים
            </Button>
          </div>
        </div>

        {/* Drivers Report Table */}
        <div className="content-card">
          <div className="data-table">
            <div className="table-header" style={{ gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 1fr 1fr 150px" }}>
              <div>נהג</div>
              <div>טלפון</div>
              <div>נסיעות</div>
              <div>הושלמו</div>
              <div>הכנסות</div>
              <div>דירוג</div>
              <div>סטטוס</div>
              <div className="text-left">פעולות</div>
            </div>
            
            <div>
              {getFilteredDrivers().map((driver) => {
                const stats = getDriverStats(driver.id);
                const statusStyle = driver.status === "active" 
                  ? "bg-green-100 text-green-700" 
                  : driver.status === "inactive" 
                  ? "bg-red-100 text-red-700" 
                  : "bg-yellow-100 text-yellow-700";

                return (
                  <div key={driver.id} className="table-row" style={{ gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 1fr 1fr 150px" }}>
                    <div>
                      <div className="font-semibold">{driver.first_name} {driver.last_name}</div>
                      <div className="text-sm text-gray-500">רישיון: {driver.license_number}</div>
                    </div>
                    <div>{driver.phone}</div>
                    <div className="font-semibold">{stats.totalTrips}</div>
                    <div className="font-semibold text-green-600">{stats.completedTrips}</div>
                    <div className="font-semibold">{formatCurrency(stats.totalEarnings)}</div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{stats.avgRating}</span>
                      <span className="text-yellow-500">⭐</span>
                    </div>
                    <div>
                      <Badge className={`${statusStyle} border`}>
                        {driver.status === "active" ? "פעיל" : driver.status === "inactive" ? "לא פעיל" : "מושעה"}
                      </Badge>
                    </div>
                    <div className="col-actions">
                      <button className="btn-icon-action" title="פרטים מלאים">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      </button>
                      <button className="btn-icon-action" title="ייצוא נתוני נהג">
                        <Download size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
              
              {getFilteredDrivers().length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-icon">📊</div>
                  <div className="empty-state-title">אין נתונים להציג</div>
                  <div className="empty-state-description">בחר נהג או שנה את הפילטרים</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        {selectedDriver !== "all" && getFilteredDrivers().length === 1 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">סיכום נתונים</h3>
            <div className="stats-grid">
              {(() => {
                const driver = getFilteredDrivers()[0];
                const stats = getDriverStats(driver.id);
                return (
                  <>
                    <div className="stats-card">
                      <div className="stats-value">{stats.totalTrips}</div>
                      <div className="stats-label">סה"כ נסיעות</div>
                    </div>
                    <div className="stats-card">
                      <div className="stats-value">{stats.completedTrips}</div>
                      <div className="stats-label">נסיעות שהושלמו</div>
                    </div>
                    <div className="stats-card">
                      <div className="stats-value">{formatCurrency(stats.totalEarnings)}</div>
                      <div className="stats-label">סה"כ הכנסות</div>
                    </div>
                    <div className="stats-card">
                      <div className="stats-value">{stats.avgRating} ⭐</div>
                      <div className="stats-label">דירוג ממוצע</div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
