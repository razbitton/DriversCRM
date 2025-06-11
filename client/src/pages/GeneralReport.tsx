import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Filter, Download, TrendingUp, Users, Car, CreditCard } from "lucide-react";
import TopActionsBar from "@/components/common/TopActionsBar";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { formatCurrency } from "@/utils";
import type { Driver, Trip, Payment, Client } from "@shared/schema";

export default function GeneralReport() {
  const [dateRange, setDateRange] = useState<string>("month");

  // Fetch all data
  const { data: drivers = [] } = useQuery<Driver[]>({
    queryKey: ["/api/drivers"],
  });

  const { data: trips = [] } = useQuery<Trip[]>({
    queryKey: ["/api/trips"],
  });

  const { data: payments = [] } = useQuery<Payment[]>({
    queryKey: ["/api/payments"],
  });

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const handleExportReport = () => {
    console.log("Exporting general report");
    // TODO: Implement export functionality
  };

  // Calculate statistics
  const stats = {
    totalDrivers: drivers.length,
    activeDrivers: drivers.filter(d => d.status === "active").length,
    totalTrips: trips.length,
    completedTrips: trips.filter(t => t.status === "completed").length,
    totalRevenue: payments.reduce((sum, p) => sum + parseFloat(p.amount), 0),
    totalClients: clients.length,
    regularClients: clients.filter(c => c.status === "regular").length,
    averageTripsPerDriver: drivers.length > 0 ? Math.round(trips.length / drivers.length * 10) / 10 : 0,
  };

  // Mock monthly data for trends
  const monthlyData = [
    { month: "ינואר", trips: 145, revenue: 25000 },
    { month: "פברואר", trips: 132, revenue: 22500 },
    { month: "מרץ", trips: 167, revenue: 28300 },
    { month: "אפריל", trips: 198, revenue: 31200 },
    { month: "מאי", trips: 203, revenue: 33500 },
    { month: "יוני", trips: 189, revenue: 29800 },
  ];

  return (
    <div className="page-container">
      <TopActionsBar />
      
      <div className="page-header">
        <h1 className="page-title">דוח כללי</h1>
        <p className="text-gray-600">סקירה כללית של נתוני המערכת וביצועים</p>
      </div>
      
      <section>
        <div className="toolbar-container">
          {/* Filters */}
          <div className="flex items-center gap-4">
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

            <Button variant="outline" className="btn-outline-fleet">
              <Filter size={16} />
              סינונים מתקדמים
            </Button>
          </div>
        </div>

        {/* Key Statistics */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">מדדים עיקריים</h3>
          <div className="stats-grid">
            <div className="stats-card">
              <div className="flex items-center justify-between mb-4">
                <Users className="text-blue-500" size={24} />
                <TrendingUp className="text-green-500" size={16} />
              </div>
              <div className="stats-value">{stats.totalDrivers}</div>
              <div className="stats-label">סה"כ נהגים</div>
              <div className="text-sm text-green-600 mt-2">
                {stats.activeDrivers} פעילים
              </div>
            </div>

            <div className="stats-card">
              <div className="flex items-center justify-between mb-4">
                <Car className="text-green-500" size={24} />
                <TrendingUp className="text-green-500" size={16} />
              </div>
              <div className="stats-value">{stats.totalTrips}</div>
              <div className="stats-label">סה"כ נסיעות</div>
              <div className="text-sm text-green-600 mt-2">
                {stats.completedTrips} הושלמו
              </div>
            </div>

            <div className="stats-card">
              <div className="flex items-center justify-between mb-4">
                <CreditCard className="text-purple-500" size={24} />
                <TrendingUp className="text-green-500" size={16} />
              </div>
              <div className="stats-value">{formatCurrency(stats.totalRevenue)}</div>
              <div className="stats-label">סה"כ הכנסות</div>
              <div className="text-sm text-gray-500 mt-2">
                ממוצע לנהג: {formatCurrency(stats.activeDrivers > 0 ? stats.totalRevenue / stats.activeDrivers : 0)}
              </div>
            </div>

            <div className="stats-card">
              <div className="flex items-center justify-between mb-4">
                <Users className="text-orange-500" size={24} />
                <TrendingUp className="text-green-500" size={16} />
              </div>
              <div className="stats-value">{stats.totalClients}</div>
              <div className="stats-label">סה"כ לקוחות</div>
              <div className="text-sm text-blue-600 mt-2">
                {stats.regularClients} קבועים
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">מדדי ביצועים</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="content-card p-6">
              <h4 className="font-semibold mb-2">יעילות נהגים</h4>
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {stats.averageTripsPerDriver}
              </div>
              <div className="text-sm text-gray-500">נסיעות ממוצע לנהג</div>
            </div>

            <div className="content-card p-6">
              <h4 className="font-semibold mb-2">שביעות רצון</h4>
              <div className="text-2xl font-bold text-green-600 mb-1">
                4.7 ⭐
              </div>
              <div className="text-sm text-gray-500">דירוג ממוצע</div>
            </div>

            <div className="content-card p-6">
              <h4 className="font-semibold mb-2">זמן תגובה</h4>
              <div className="text-2xl font-bold text-purple-600 mb-1">
                12 דק'
              </div>
              <div className="text-sm text-gray-500">זמן ממוצע להגעה</div>
            </div>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">מגמות חודשיות</h3>
          <div className="content-card">
            <div className="data-table">
              <div className="table-header" style={{ gridTemplateColumns: "2fr 1fr 1.5fr 1fr" }}>
                <div>חודש</div>
                <div>נסיעות</div>
                <div>הכנסות</div>
                <div>ממוצע לנסיעה</div>
              </div>
              
              <div>
                {monthlyData.map((month, index) => (
                  <div key={index} className="table-row" style={{ gridTemplateColumns: "2fr 1fr 1.5fr 1fr" }}>
                    <div className="font-semibold">{month.month}</div>
                    <div>{month.trips}</div>
                    <div className="font-semibold">{formatCurrency(month.revenue)}</div>
                    <div>{formatCurrency(month.revenue / month.trips)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">נהגים מובילים</h3>
            <div className="content-card">
              <div className="p-4 space-y-4">
                {drivers.slice(0, 5).map((driver, index) => (
                  <div key={driver.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold">{driver.first_name} {driver.last_name}</div>
                        <div className="text-sm text-gray-500">{driver.phone}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{Math.floor(Math.random() * 50) + 20} נסיעות</div>
                      <div className="text-sm text-gray-500">חודש זה</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">לקוחות פעילים</h3>
            <div className="content-card">
              <div className="p-4 space-y-4">
                {clients.slice(0, 5).map((client, index) => (
                  <div key={client.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold">{client.full_name}</div>
                        <div className="text-sm text-gray-500">{client.city}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{Math.floor(Math.random() * 15) + 5} נסיעות</div>
                      <div className="text-sm text-gray-500">חודש זה</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
