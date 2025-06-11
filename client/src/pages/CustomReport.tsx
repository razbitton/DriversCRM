import React, { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import TopActionsBar from '@/components/common/TopActionsBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Calendar, Clock, FileText, Eye, X } from 'lucide-react';
import type { Driver } from "@shared/schema";

const DriverSelector = ({ selectedDrivers, onDriversChange }: { selectedDrivers: any[], onDriversChange: (drivers: any[]) => void }) => {
  const { data: drivers = [] } = useQuery<Driver[]>({
    queryKey: ["/api/drivers"],
  });

  const handleDriverSelect = (driverId: string) => {
    const driver = drivers.find(d => d.id.toString() === driverId);
    if (driver && !selectedDrivers.find(d => d.id === driver.id)) {
      onDriversChange([...selectedDrivers, { id: driver.id, full_name: driver.full_name }]);
    }
  };

  return (
    <Select onValueChange={handleDriverSelect}>
      <SelectTrigger>
        <SelectValue placeholder="בחר נהג..." />
      </SelectTrigger>
      <SelectContent>
        {drivers.map(driver => (
          <SelectItem key={driver.id} value={driver.id.toString()}>
            {driver.full_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const CustomReportTable = ({ reports }: { reports: any[] }) => {
  const formatCurrency = (amount: number) => `₪ ${amount?.toLocaleString() || '0'}`;

  return (
    <div className="data-table-container">
      <div className="table-header">
        <div>מספר סידורי</div>
        <div>שם הנהג</div>
        <div>קבועים</div>
        <div>משתנים חובה</div>
        <div>משתנים זכות</div>
        <div>יתרה קודמת</div>
        <div>כמות נסיעות</div>
        <div>סה"כ</div>
        <div className="col-actions justify-end"></div>
      </div>
      <div className="table-body">
        {reports.map((report) => (
          <div key={report.id} className="table-row">
            <div>{report.serial_number}</div>
            <div className="font-semibold text-gray-900">{report.driver_name}</div>
            <div>{formatCurrency(report.fixed_amount)}</div>
            <div>{formatCurrency(report.mandatory_variables)}</div>
            <div>{formatCurrency(report.optional_variables)}</div>
            <div>{formatCurrency(report.previous_balance)}</div>
            <div>{report.trip_count}</div>
            <div className="font-semibold">{formatCurrency(report.total_amount)}</div>
            <div className="col-actions">
              <button className="btn-icon-action" title="פרטים"><FileText size={16} /></button>
              <button className="btn-icon-action" title="צפה"><Eye size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function CustomReport() {
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDrivers, setSelectedDrivers] = useState<any[]>([]);
  const [allAvailableDrivers, setAllAvailableDrivers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    dateRange: "15/06/24 - 18/08/24",
    timeRange: "09:00 - 00:00",
    driverPhone: "",
    serviceType: "",
    channelNumber: "",
    veteranName: "",
    sync: false,
    incomingTrips: false,
    outgoingTrips: false,
    driversWithDebts: false,
    driversWithCredits: false
  });

  useEffect(() => {
    const loadReports = async () => {
      try {
        // Mock data for demonstration - in real app would fetch from API
        const mockReports = [
          {
            id: 1,
            serial_number: '001',
            driver_name: 'נהג איתי',
            fixed_amount: 2500,
            mandatory_variables: 800,
            optional_variables: 300,
            previous_balance: -150,
            trip_count: 28,
            total_amount: 3450
          },
          {
            id: 2,
            serial_number: '002',
            driver_name: 'נהג יוסף',
            fixed_amount: 2500,
            mandatory_variables: 920,
            optional_variables: 450,
            previous_balance: 200,
            trip_count: 32,
            total_amount: 4070
          },
          {
            id: 3,
            serial_number: '003',
            driver_name: 'נהג דוד',
            fixed_amount: 2500,
            mandatory_variables: 750,
            optional_variables: 200,
            previous_balance: 0,
            trip_count: 25,
            total_amount: 3450
          }
        ];
        setReports(mockReports);
      } catch (error) {
        console.error("Error loading reports:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadReports();

    // Simulate fetching all drivers
    const fetchAllDrivers = async () => {
      const mockAllDrivers = [
        { id: 'd1', full_name: 'נהג איתי' },
        { id: 'd2', full_name: 'נהג יוסף' },
        { id: 'd3', full_name: 'נהג דוד' },
        { id: 'd4', full_name: 'נהג יואל' },
        { id: 'd5', full_name: 'נהג משה' },
      ];
      setAllAvailableDrivers(mockAllDrivers);
    };
    fetchAllDrivers();
  }, []);

  const handleDriversChange = (drivers: any[]) => {
    setSelectedDrivers(drivers);
  };
  
  const handleRemoveDriver = (driverId: string) => {
    setSelectedDrivers(prev => prev.filter(d => d.id !== driverId));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    console.log("Searching with filters:", {
      selectedDrivers,
      formData
    });
    // Here would be the logic for searching and filtering
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <style>{`
        .form-section {
          background: white;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
          padding: 2rem;
        }
        .form-column {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding: 1.5rem;
          border: 1px solid #f1f3f5;
          border-radius: 8px;
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .input-group label, .checkbox-group label {
          font-size: 0.875rem;
          color: #495057;
          font-weight: 500;
        }
        .input-with-icon {
          position: relative;
        }
        .input-with-icon .icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #adb5bd;
        }
        .checkbox-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .action-buttons {
          display: flex;
          gap: 1rem;
          margin-top: auto;
        }
        .btn-primary-yellow {
          background-color: #fceec4;
          border: 1px solid #f0dca4;
          color: #343a40;
          font-weight: 500;
          padding: 0.6rem 1.2rem;
          border-radius: 6px;
          cursor: pointer;
        }
        .btn-primary-yellow:hover {
          background-color: #fff3cd;
        }
        .btn-secondary-light {
          background-color: #f8f9fa;
          border: 1px solid #dee2e6;
          color: #343a40;
          padding: 0.6rem 1.2rem;
          border-radius: 6px;
          cursor: pointer;
        }
        .btn-secondary-light:hover {
          background-color: #e9ecef;
        }
        /* Table styles */
        .data-table-container {
          margin-top: 2rem;
          background-color: #fff;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e9ecef;
        }
        .table-header, .table-row {
          display: grid;
          grid-template-columns: 1fr 2fr 1fr 1fr 1fr 1fr 1fr 1fr 120px;
          align-items: center;
          padding: 15px 20px;
          gap: 15px;
        }
        .table-header {
          background-color: #f8f9fa;
          color: #6c757d;
          font-weight: 500;
          font-size: 14px;
          border-bottom: 1px solid #dee2e6;
        }
        .table-row {
          border-bottom: 1px solid #f1f3f5;
          font-size: 15px;
        }
        .table-row:last-child { border-bottom: none; }
        .col-actions { display: flex; justify-content: flex-end; align-items: center; gap: 8px; }
        .btn-icon-action { background: #fef8e7; border: 1px solid #f0dca4; color: #a8842c; width: 32px; height: 32px; border-radius: 6px; cursor: pointer; display: flex; justify-content: center; align-items: center; }
        .selected-drivers-container {
          margin-top: 1rem;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .driver-badge {
          background-color: #fef3c7;
          color: #92400e;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .remove-driver {
          cursor: pointer;
          width: 14px;
          height: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
      
      <TopActionsBar />
      
      <h2 className="text-2xl font-medium mb-4">דוחות בהתאמה אישית</h2>

      <div className="tabs mb-6">
        <span className="pb-2 border-b-2 border-yellow-400 font-semibold text-gray-800">בחירת נהג</span>
      </div>

      <div className="form-section">
        <div className="form-grid">
          {/* Left Column */}
          <div className="form-column">
            <div className="grid grid-cols-2 gap-4">
              <div className="input-group">
                <label>טווח תאריכים:</label>
                <div className="input-with-icon">
                  <Input 
                    value={formData.dateRange}
                    onChange={(e) => handleInputChange('dateRange', e.target.value)}
                  />
                  <Calendar size={16} className="icon" />
                </div>
              </div>
              <div className="input-group">
                <label>טווח שעות:</label>
                <div className="input-with-icon">
                  <Input 
                    value={formData.timeRange}
                    onChange={(e) => handleInputChange('timeRange', e.target.value)}
                  />
                  <Clock size={16} className="icon" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label>סנכרון:</label>
                <Switch 
                  checked={formData.sync}
                  onCheckedChange={(checked) => handleInputChange('sync', checked)}
                />
              </div>
            </div>
            <div className="checkbox-grid">
              <div className="checkbox-group">
                <Checkbox 
                  id="incoming" 
                  checked={formData.incomingTrips}
                  onCheckedChange={(checked) => handleInputChange('incomingTrips', checked)}
                />
                <label htmlFor="incoming">נסיעות נכנסות</label>
              </div>
              <div className="checkbox-group">
                <Checkbox 
                  id="outgoing"
                  checked={formData.outgoingTrips}
                  onCheckedChange={(checked) => handleInputChange('outgoingTrips', checked)}
                />
                <label htmlFor="outgoing">נסיעות יוצאות</label>
              </div>
              <div className="checkbox-group">
                <Checkbox 
                  id="debts"
                  checked={formData.driversWithDebts}
                  onCheckedChange={(checked) => handleInputChange('driversWithDebts', checked)}
                />
                <label htmlFor="debts">נהגים עם חובות</label>
              </div>
              <div className="checkbox-group">
                <Checkbox 
                  id="credits"
                  checked={formData.driversWithCredits}
                  onCheckedChange={(checked) => handleInputChange('driversWithCredits', checked)}
                />
                <label htmlFor="credits">נהגים עם זכויות</label>
              </div>
            </div>
            <div className="action-buttons">
              <button className="btn-secondary-light">סינון נהג נוסף</button>
              <button className="btn-primary-yellow" onClick={handleSearch}>
                סינון וחיפוש דוח
              </button>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="form-column">
             <div className="grid grid-cols-2 gap-4">
                <div className="input-group">
                  <label>בחירת נהג:</label>
                  <DriverSelector 
                    selectedDrivers={selectedDrivers}
                    onDriversChange={handleDriversChange}
                  />
                </div>
                 <div className="input-group">
                  <label>טלפון הנהג:</label>
                  <Input 
                    placeholder="הזן טלפון" 
                    value={formData.driverPhone}
                    onChange={(e) => handleInputChange('driverPhone', e.target.value)}
                  />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
               <div className="input-group">
                  <label>סוג שירות:</label>
                  <Select value={formData.serviceType} onValueChange={(value) => handleInputChange('serviceType', value)}>
                    <SelectTrigger><SelectValue placeholder="בחר" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="delivery">משלוח</SelectItem>
                      <SelectItem value="ride">הסעה</SelectItem>
                      <SelectItem value="special">מיוחד</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                 <div className="input-group">
                  <label>מספר ערוץ:</label>
                  <Select value={formData.channelNumber} onValueChange={(value) => handleInputChange('channelNumber', value)}>
                    <SelectTrigger><SelectValue placeholder="בחר" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">ערוץ 1</SelectItem>
                      <SelectItem value="2">ערוץ 2</SelectItem>
                      <SelectItem value="3">ערוץ 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                 <div className="input-group">
                  <label>שם וותק:</label>
                  <Select value={formData.veteranName} onValueChange={(value) => handleInputChange('veteranName', value)}>
                    <SelectTrigger><SelectValue placeholder="בחר" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="veteran1">וותיק 1</SelectItem>
                      <SelectItem value="veteran2">וותיק 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
            </div>
            {selectedDrivers.length > 0 && (
                <div className="selected-drivers-container">
                  {selectedDrivers.map(driver => (
                    <div key={driver.id} className="driver-badge">
                      {driver.full_name}
                      <span className="remove-driver" onClick={() => handleRemoveDriver(driver.id)}>
                        <X size={12} />
                      </span>
                    </div>
                  ))}
                </div>
            )}
          </div>
        </div>
      </div>
      
      <h3 className="text-xl font-medium mt-10 mb-4">תוצאות החיפוש</h3>
      {isLoading ? (
        <div className="text-center py-8 text-gray-500">טוען נתונים...</div>
      ) : (
        <CustomReportTable reports={reports} />
      )}
    </div>
  );
}