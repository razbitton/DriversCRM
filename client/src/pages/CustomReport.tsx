import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Filter, Download, Plus, X, Calendar, BarChart3 } from "lucide-react";
import TopActionsBar from "@/components/common/TopActionsBar";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { formatCurrency, formatDate } from "@/utils";
import type { Driver, Trip, Payment, Client } from "@shared/schema";

type ReportField = {
  id: string;
  label: string;
  table: string;
  type: 'text' | 'number' | 'date' | 'currency' | 'status';
};

type ReportFilter = {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between';
  value: string | number;
  value2?: string | number; // For between operator
};

const availableFields: ReportField[] = [
  // Driver fields
  { id: 'driver_name', label: 'שם נהג', table: 'drivers', type: 'text' },
  { id: 'driver_phone', label: 'טלפון נהג', table: 'drivers', type: 'text' },
  { id: 'driver_license', label: 'רישיון נהיגה', table: 'drivers', type: 'text' },
  { id: 'driver_status', label: 'סטטוס נהג', table: 'drivers', type: 'status' },
  { id: 'driver_vehicle', label: 'רכב נהג', table: 'drivers', type: 'text' },
  
  // Trip fields
  { id: 'trip_number', label: 'מספר נסיעה', table: 'trips', type: 'text' },
  { id: 'trip_origin', label: 'נקודת מוצא', table: 'trips', type: 'text' },
  { id: 'trip_destination', label: 'יעד', table: 'trips', type: 'text' },
  { id: 'trip_client', label: 'לקוח', table: 'trips', type: 'text' },
  { id: 'trip_type', label: 'סוג נסיעה', table: 'trips', type: 'status' },
  { id: 'trip_status', label: 'סטטוס נסיעה', table: 'trips', type: 'status' },
  { id: 'trip_scheduled_time', label: 'זמן מתוכנן', table: 'trips', type: 'date' },
  { id: 'trip_price', label: 'מחיר נסיעה', table: 'trips', type: 'currency' },
  
  // Client fields
  { id: 'client_name', label: 'שם לקוח', table: 'clients', type: 'text' },
  { id: 'client_phone', label: 'טלפון לקוח', table: 'clients', type: 'text' },
  { id: 'client_city', label: 'עיר לקוח', table: 'clients', type: 'text' },
  { id: 'client_status', label: 'סטטוס לקוח', table: 'clients', type: 'status' },
  { id: 'client_payment_status', label: 'סטטוס תשלום לקוח', table: 'clients', type: 'status' },
  
  // Payment fields
  { id: 'payment_amount', label: 'סכום תשלום', table: 'payments', type: 'currency' },
  { id: 'payment_type', label: 'סוג תשלום', table: 'payments', type: 'status' },
  { id: 'payment_status', label: 'סטטוס תשלום', table: 'payments', type: 'status' },
  { id: 'payment_date', label: 'תאריך תשלום', table: 'payments', type: 'date' },
];

export default function CustomReport() {
  const [reportName, setReportName] = useState<string>("");
  const [selectedTables, setSelectedTables] = useState<string[]>(['drivers']);
  const [selectedFields, setSelectedFields] = useState<string[]>(['driver_name', 'driver_phone', 'driver_status']);
  const [filters, setFilters] = useState<ReportFilter[]>([]);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: ''
  });
  const [reportData, setReportData] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleTableToggle = (table: string) => {
    if (selectedTables.includes(table)) {
      setSelectedTables(prev => prev.filter(t => t !== table));
      // Remove fields from deselected table
      setSelectedFields(prev => prev.filter(fieldId => {
        const field = availableFields.find(f => f.id === fieldId);
        return field && field.table !== table;
      }));
    } else {
      setSelectedTables(prev => [...prev, table]);
    }
  };

  const handleFieldToggle = (fieldId: string) => {
    if (selectedFields.includes(fieldId)) {
      setSelectedFields(prev => prev.filter(f => f !== fieldId));
    } else {
      setSelectedFields(prev => [...prev, fieldId]);
    }
  };

  const addFilter = () => {
    const newFilter: ReportFilter = {
      id: Date.now().toString(),
      field: availableFields[0].id,
      operator: 'equals',
      value: ''
    };
    setFilters(prev => [...prev, newFilter]);
  };

  const removeFilter = (filterId: string) => {
    setFilters(prev => prev.filter(f => f.id !== filterId));
  };

  const updateFilter = (filterId: string, updates: Partial<ReportFilter>) => {
    setFilters(prev => prev.map(f => f.id === filterId ? { ...f, ...updates } : f));
  };

  const generateReport = () => {
    setIsGenerating(true);
    
    // Mock report generation - in real implementation, this would call the backend
    setTimeout(() => {
      let data: any[] = [];
      
      if (selectedTables.includes('drivers')) {
        data = drivers.map(driver => ({
          driver_name: `${driver.first_name} ${driver.last_name}`,
          driver_phone: driver.phone,
          driver_license: driver.license_number,
          driver_status: driver.status,
          driver_vehicle: driver.vehicle_number || '-',
          _type: 'driver',
          _id: driver.id
        }));
      }
      
      if (selectedTables.includes('trips')) {
        const tripData = trips.map(trip => ({
          trip_number: trip.trip_number,
          trip_origin: trip.origin,
          trip_destination: trip.destination,
          trip_client: trip.client_name,
          trip_type: trip.trip_type,
          trip_status: trip.status,
          trip_scheduled_time: trip.scheduled_time,
          trip_price: trip.price || 0,
          _type: 'trip',
          _id: trip.id
        }));
        
        if (selectedTables.length === 1) {
          data = tripData;
        } else {
          // Join with drivers if both selected
          data = data.map(row => {
            const relatedTrips = tripData.filter(t => 
              trips.find(trip => trip.id === t._id)?.driver_id === row._id
            );
            return relatedTrips.length > 0 ? { ...row, ...relatedTrips[0] } : row;
          });
        }
      }
      
      // Apply filters
      const filteredData = data.filter(row => {
        return filters.every(filter => {
          const value = row[filter.field];
          const filterValue = filter.value;
          
          switch (filter.operator) {
            case 'equals':
              return value?.toString().toLowerCase() === filterValue?.toString().toLowerCase();
            case 'contains':
              return value?.toString().toLowerCase().includes(filterValue?.toString().toLowerCase());
            case 'greater_than':
              return Number(value) > Number(filterValue);
            case 'less_than':
              return Number(value) < Number(filterValue);
            default:
              return true;
          }
        });
      });
      
      setReportData(filteredData);
      setIsGenerating(false);
    }, 1500);
  };

  const exportReport = () => {
    console.log("Exporting custom report:", reportName);
    // TODO: Implement export functionality
  };

  const getAvailableFields = () => {
    return availableFields.filter(field => selectedTables.includes(field.table));
  };

  const renderFieldValue = (field: ReportField, value: any) => {
    if (!value && value !== 0) return '-';
    
    switch (field.type) {
      case 'currency':
        return formatCurrency(value);
      case 'date':
        return formatDate(value);
      case 'status':
        return (
          <Badge className="bg-blue-100 text-blue-700 border">
            {value}
          </Badge>
        );
      default:
        return value;
    }
  };

  return (
    <div className="page-container">
      <TopActionsBar />
      
      <div className="page-header">
        <h1 className="page-title">דוח מותאם אישי</h1>
        <p className="text-gray-600">צור דוח מותאם לפי הצרכים שלך</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Report Configuration */}
        <div className="lg:col-span-1 space-y-6">
          {/* Report Name */}
          <div className="content-card p-6">
            <h3 className="text-lg font-semibold mb-4">שם הדוח</h3>
            <Input
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              placeholder="הכנס שם לדוח..."
              className="w-full"
            />
          </div>

          {/* Data Sources */}
          <div className="content-card p-6">
            <h3 className="text-lg font-semibold mb-4">מקורות מידע</h3>
            <div className="space-y-3">
              {[
                { id: 'drivers', label: 'נהגים', icon: '👤' },
                { id: 'trips', label: 'נסיעות', icon: '🚗' },
                { id: 'clients', label: 'לקוחות', icon: '👥' },
                { id: 'payments', label: 'תשלומים', icon: '💳' }
              ].map((table) => (
                <div key={table.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={table.id}
                    checked={selectedTables.includes(table.id)}
                    onCheckedChange={() => handleTableToggle(table.id)}
                  />
                  <label htmlFor={table.id} className="flex items-center gap-2 cursor-pointer">
                    <span>{table.icon}</span>
                    <span>{table.label}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="content-card p-6">
            <h3 className="text-lg font-semibold mb-4">טווח תאריכים</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">תאריך התחלה</label>
                <Input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">תאריך סיום</label>
                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Generate Report Button */}
          <Button
            onClick={generateReport}
            disabled={isGenerating || selectedFields.length === 0}
            className="w-full btn-primary-fleet"
          >
            {isGenerating ? (
              <>
                <div className="spinner w-4 h-4 ml-2"></div>
                מייצר דוח...
              </>
            ) : (
              <>
                <BarChart3 size={16} />
                יצירת דוח
              </>
            )}
          </Button>
        </div>

        {/* Fields and Filters */}
        <div className="lg:col-span-2 space-y-6">
          {/* Field Selection */}
          <div className="content-card p-6">
            <h3 className="text-lg font-semibold mb-4">בחירת שדות</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {getAvailableFields().map((field) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={field.id}
                    checked={selectedFields.includes(field.id)}
                    onCheckedChange={() => handleFieldToggle(field.id)}
                  />
                  <label htmlFor={field.id} className="cursor-pointer text-sm">
                    {field.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="content-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">פילטרים</h3>
              <Button onClick={addFilter} variant="outline" size="sm">
                <Plus size={16} />
                הוסף פילטר
              </Button>
            </div>
            
            {filters.length === 0 ? (
              <p className="text-gray-500 text-center py-4">אין פילטרים פעילים</p>
            ) : (
              <div className="space-y-4">
                {filters.map((filter) => (
                  <div key={filter.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Select
                      value={filter.field}
                      onValueChange={(value) => updateFilter(filter.id, { field: value })}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableFields().map((field) => (
                          <SelectItem key={field.id} value={field.id}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={filter.operator}
                      onValueChange={(value: any) => updateFilter(filter.id, { operator: value })}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">שווה ל</SelectItem>
                        <SelectItem value="contains">מכיל</SelectItem>
                        <SelectItem value="greater_than">גדול מ</SelectItem>
                        <SelectItem value="less_than">קטן מ</SelectItem>
                      </SelectContent>
                    </Select>

                    <Input
                      value={filter.value}
                      onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                      placeholder="ערך..."
                      className="flex-1"
                    />

                    <Button
                      onClick={() => removeFilter(filter.id)}
                      variant="outline"
                      size="sm"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Report Results */}
          {reportData.length > 0 && (
            <div className="content-card">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">תוצאות הדוח</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">
                      {reportData.length} תוצאות
                    </span>
                    <Button onClick={exportReport} className="btn-primary-fleet">
                      <Download size={16} />
                      ייצוא
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <div className="data-table">
                  <div 
                    className="table-header" 
                    style={{ 
                      gridTemplateColumns: `repeat(${selectedFields.length}, 1fr)`,
                      minWidth: `${selectedFields.length * 150}px`
                    }}
                  >
                    {selectedFields.map((fieldId) => {
                      const field = availableFields.find(f => f.id === fieldId);
                      return <div key={fieldId}>{field?.label}</div>;
                    })}
                  </div>
                  
                  <div>
                    {reportData.map((row, index) => (
                      <div 
                        key={index} 
                        className="table-row"
                        style={{ 
                          gridTemplateColumns: `repeat(${selectedFields.length}, 1fr)`,
                          minWidth: `${selectedFields.length * 150}px`
                        }}
                      >
                        {selectedFields.map((fieldId) => {
                          const field = availableFields.find(f => f.id === fieldId);
                          const value = row[fieldId];
                          return (
                            <div key={fieldId}>
                              {field ? renderFieldValue(field, value) : '-'}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
