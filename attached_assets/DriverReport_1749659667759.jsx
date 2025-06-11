import React, { useState, useEffect } from "react";
import { DriverReport as DriverReportEntity } from "@/entities/DriverReport";
import { Driver } from "@/entities/Driver";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, Search, ArrowUpDown, Eye, Download, Send, Printer, FileSpreadsheet } from "lucide-react";
import TopActionsBar from "../Components/common/TopActionsBar";
import SearchInput from "../Components/common/SearchInput";
import DriverDetailsModal from "../Components/drivers/DriverDetailsModal";
import DriverExportModal from "../Components/drivers/DriverExportModal";

export default function DriverReport() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [selectedReports, setSelectedReports] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedDriverForDetails, setSelectedDriverForDetails] = useState(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedReportForExport, setSelectedReportForExport] = useState(null);
  const [selectedDriverForExport, setSelectedDriverForExport] = useState(null);

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    filterReports();
  }, [reports, searchTerm]);

  const loadReports = async () => {
    try {
      const data = await DriverReportEntity.list("-created_date");
      setReports(data);
    } catch (error) {
      console.error("Error loading driver reports:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterReports = () => {
    let filtered = reports;

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(report =>
        report.driver_name.toLowerCase().includes(lowerSearch) ||
        report.serial_number.includes(lowerSearch)
      );
    }

    setFilteredReports(filtered);
  };

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedReports(new Set(filteredReports.map(report => report.id)));
    } else {
      setSelectedReports(new Set());
    }
  };

  const handleSelectReport = (reportId, checked) => {
    const newSelected = new Set(selectedReports);
    if (checked) {
      newSelected.add(reportId);
    } else {
      newSelected.delete(reportId);
    }
    setSelectedReports(newSelected);
    setSelectAll(newSelected.size > 0 && newSelected.size === filteredReports.length);
  };

  const handleViewDriver = async (report) => {
    if (!report.driver_name) {
        console.error("Report does not have a driver_name");
        alert("לדוח זה לא משויך שם נהג.");
        return;
    }
    try {
        const drivers = await Driver.filter({ full_name: report.driver_name });
        if (drivers && drivers.length > 0) {
            setSelectedDriverForDetails(drivers[0]);
            setIsDetailsModalOpen(true);
        } else {
            alert(`שגיאה: לא ניתן למצוא את פרטי הנהג '${report.driver_name}'. ייתכן שהנהג נמחק מהמערכת.`);
        }
    } catch (error) {
        console.error("Error fetching driver details:", error);
        alert("אירעה שגיאה בעת שליפת נתוני הנהג.");
    }
  };

  const handleExportDriver = async (report) => {
    if (!report.driver_name) {
      console.error("Report does not have a driver_name");
      alert("לדוח זה לא משויך שם נהג.");
      return;
    }
    try {
      const drivers = await Driver.filter({ full_name: report.driver_name });
      if (drivers && drivers.length > 0) {
        setSelectedDriverForExport(drivers[0]);
        setSelectedReportForExport(report);
        setIsExportModalOpen(true);
      } else {
        alert(`שגיאה: לא ניתן למצוא את פרטי הנהג '${report.driver_name}'.`);
      }
    } catch (error) {
      console.error("Error fetching driver for export:", error);
      alert("אירעה שגיאה בעת שליפת נתוני הנהג.");
    }
  };

  const formatCurrency = (amount) => {
    return `₪ ${amount?.toLocaleString() || '0'}`;
  };

  if (isLoading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <style>{`
        .report-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .report-header h2 {
          margin: 0;
          font-weight: 500;
          font-size: 1.5rem;
        }
        
        .subtitle {
          font-weight: 400;
          color: #6c757d;
          font-size: 1rem;
          margin-right: 0.5rem;
        }
        
        .filters {
          display: flex;
          gap: 1rem;
        }
        
        .filter-btn {
          background: none;
          border: 1px solid #ced4da;
          border-radius: 8px;
          padding: 0.5rem 1rem;
          cursor: pointer;
          color: #6c757d;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .data-table-container {
          background-color: #fff;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e9ecef;
        }
        
        .table-header, .table-row {
          display: grid;
          grid-template-columns: 40px 120px 2fr 1fr 1fr 1fr 1fr 1fr 1fr 120px;
          align-items: center;
          padding: 10px 20px;
          gap: 15px;
        }
        
        .table-header {
          background-color: #f8f9fa;
          color: #6c757d;
          font-weight: 500;
          font-size: 14px;
          border-bottom: 1px solid #dee2e6;
          padding: 15px 20px;
        }
        
        .table-row {
          border: 1px solid transparent;
          border-bottom: 1px solid #f1f3f5;
          font-size: 15px;
          transition: background-color 0.2s;
        }

        .table-row:last-child {
            border-bottom: 1px solid transparent;
        }
        
        .table-row:hover {
          background-color: #f8f9fa;
        }
        
        .row-highlighted {
          border-color: #fceec4;
          background-color: #fffcf2;
        }
        
        .col-actions {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 8px;
        }
        
        .btn-icon-action {
          background: #fef8e7;
          border: 1px solid #f0dca4;
          color: #a8842c;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.2s;
        }
        
        .btn-icon-action:hover {
          background-color: #fff3cd;
        }
        
        .report-actions-footer {
          margin-top: 1.5rem;
          display: flex;
          justify-content: flex-start;
          gap: 1rem;
          padding: 1rem 0;
        }
        
        .btn-action {
          background-color: #fef8e7;
          border: 1px solid #f0dca4;
          color: #212529;
          padding: 0.6rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .btn-action:hover {
          background-color: #fff3cd;
        }
      `}</style>
      
      <TopActionsBar />

      <section>
        <div className="report-header">
          <h2>
            דוחות נהגים 
            <span className="subtitle">(כל הנהגים)</span>
          </h2>
          <div className="filters">
            <SearchInput onSearch={setSearchTerm} placeholder="חיפוש..." />
            <button className="filter-btn">
              <Filter size={16} />
              סינון
            </button>
          </div>
        </div>

        <div className="data-table-container">
          <div className="table-header">
            <div>
              <Checkbox
                checked={selectAll}
                onCheckedChange={handleSelectAll}
              />
            </div>
            <div>מספר סידורי</div>
            <div className="flex items-center gap-1 cursor-pointer">
              שם הנהג 
              <ArrowUpDown size={14} />
            </div>
            <div>קבועים</div>
            <div>משתנים חובה</div>
            <div>משתנים זכות</div>
            <div>יתרה קודמת</div>
            <div>כמות נסיעות</div>
            <div>סה"כ</div>
            <div></div>
          </div>
          
          <div className="table-body">
            {filteredReports.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                אין דוחות להצגה
              </div>
            ) : (
              filteredReports.map((report) => (
                <div 
                  key={report.id}
                  className={`table-row ${selectedReports.has(report.id) ? 'row-highlighted' : ''}`}
                >
                  <div>
                    <Checkbox
                      checked={selectedReports.has(report.id)}
                      onCheckedChange={(checked) => handleSelectReport(report.id, checked)}
                    />
                  </div>
                  <div className="font-medium">{report.serial_number}</div>
                  <div className="font-semibold text-gray-900">{report.driver_name}</div>
                  <div>{formatCurrency(report.fixed_amount)}</div>
                  <div>{formatCurrency(report.mandatory_variables)}</div>
                  <div>{formatCurrency(report.optional_variables)}</div>
                  <div>{formatCurrency(report.previous_balance)}</div>
                  <div>{report.trip_count}</div>
                  <div className="font-semibold">{formatCurrency(report.total_amount)}</div>
                  <div className="col-actions">
                    <button onClick={() => handleViewDriver(report)} className="btn-icon-action" title="צפה">
                      <Eye size={16} />
                    </button>
                    <button onClick={() => handleExportDriver(report)} className="btn-icon-action" title="ייצוא">
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="report-actions-footer">
          <button className="btn-action">
            <Send size={16} />
            שליחת דוחות
          </button>
          <button className="btn-action">
            <Printer size={16} />
            הדפסה
          </button>
          <button className="btn-action">
            <Download size={16} />
            PDF
          </button>
          <button className="btn-action">
            <FileSpreadsheet size={16} />
            אקסל
          </button>
        </div>
      </section>

      {isDetailsModalOpen && selectedDriverForDetails && (
        <DriverDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedDriverForDetails(null); // Clear selected driver on close
          }}
          driver={selectedDriverForDetails}
          initialTab={'reports'}
        />
      )}

      {isExportModalOpen && selectedDriverForExport && selectedReportForExport && (
        <DriverExportModal
            isOpen={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
            driver={selectedDriverForExport}
            report={selectedReportForExport}
        />
      )}
    </div>
  );
} 