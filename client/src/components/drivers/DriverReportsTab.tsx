import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { CalendarDays } from 'lucide-react';

export default function DriverReportsTab({ driver }: any) {
  const [activeSubTab, setActiveSubTab] = useState('summary');

  // State for the export form
  const [exportFormData, setExportFormData] = useState({
      startDate: '15/06/2023',
      endDate: '31/12/2023',
      noDate: false,
      tripsTaken: false,
      tripsGiven: false,
      shortSummary: false,
      fullSummary: false
  });

  const handleExportChange = (field: string, value: any) => {
      setExportFormData(prev => ({...prev, [field]: value}));
  };

  // Dummy data based on the provided HTML
  const summaryData = {
    totalTrips: 259,
    currentMonthTrips: 28,
    fixedCharges: 250,
    variableCharges: 250,
    variableCredits: 250,
    creditCardCredits: 250,
    previousBalance: 950,
    finalBalance: 0
  };

  return (
    <div>
      <style>{`
        :root {
            --negative-bg: #fdeeee; /* Light red */
            --positive-bg: #eaf7ef; /* Light green */
        }
        .tab-actions-bar { display: flex; justify-content: center; gap: 1rem; background-color: #f8f9fa; border-radius: 8px; padding: 0.5rem; margin-bottom: 1.5rem; }
        .tab-action-btn { background: none; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; font-weight: 500; cursor: pointer; color: #6c757d; }
        .tab-action-btn.active { background-color: #2b3035; color: #fff; }

        .summary-card { background-color: #fff; border: 1px solid #e9ecef; border-radius: 8px; padding: 1.5rem; }
        .summary-row, .summary-row-colored { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1rem; text-align: center; }
        .summary-row-colored { grid-template-columns: 1fr 1fr; padding: 1rem; border-radius: 8px; }
        .summary-row-colored .stat-item:first-child { border-left: 1px solid rgba(0,0,0,0.1); padding-left: 1rem; }
        .row-negative { background-color: var(--negative-bg); }
        .row-positive { background-color: var(--positive-bg); }
        .final-row { grid-template-columns: 1fr 1fr; }
        .stat-label { color: #6c757d; font-size: 0.9rem; }
        .stat-value { font-size: 1.5rem; font-weight: 700; display: block; }
        .summary-row .stat-item:first-child { text-align: right; font-weight: 500; color: #212529; font-size: 1rem; }
        .details-action { text-align: center; margin-top: 2rem; }
        
        .reports-footer { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 0; border-top: 1px solid #e9ecef; margin-top: 1.5rem; }
        .btn-update-payment { background-color: #fdd85d; border: none; padding: 0.7rem 2rem; font-weight: 700; border-radius: 8px; cursor: pointer; }
        
        /* Export Form Styles */
        .export-form-card { background-color: #fff; border: 1px solid #e9ecef; border-radius: 8px; padding: 2rem; }
        .date-range-selector { margin-bottom: 2rem; }
        .date-range-selector h4 { font-weight: 500; text-align: center; margin: 0 0 1.5rem 0; }
        .date-inputs { display: flex; justify-content: center; gap: 2rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .form-group label { font-size: 0.9rem; color: #6c757d; }
        .input-with-icon { position: relative; }
        .input-with-icon .icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #6c757d; }
        .export-form-card input[type="text"] { background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 6px; padding: 0.75rem; font-family: 'Heebo', sans-serif; width: 100%; box-sizing: border-box; }

        .export-options { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem; padding: 1.5rem 0; border-top: 1px solid #e9ecef; border-bottom: 1px solid #e9ecef; }
        .checkbox-option { display: flex; align-items: center; gap: 0.75rem; background-color: #f8f9fa; padding: 0.75rem 1rem; border-radius: 6px; cursor: pointer; }
        .checkbox-option.main-option { background-color: transparent; padding: 0; }
        .checkbox-option span { font-weight: 500; }

        .form-action { text-align: center; }
        .btn-action { background-color: #fdd85d; border: none; padding: 0.7rem 2rem; font-weight: 700; border-radius: 8px; cursor: pointer; }
      `}</style>
      
      <div className="tab-actions-bar">
        <button 
          className={`tab-action-btn ${activeSubTab === 'export' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('export')}
        >
          ייצוא דוחות
        </button>
        <button 
          className={`tab-action-btn ${activeSubTab === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('summary')}
        >
          סיכומים כללים
        </button>
      </div>
      
      {activeSubTab === 'summary' && (
        <>
          <div className="summary-card">
            <div className="summary-row">
              <div className="stat-item">
                <span className="stat-label">סיכום נסיעות:</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">סה"כ נסיעות</span>
                <strong className="stat-value">{summaryData.totalTrips}</strong>
              </div>
              <div className="stat-item">
                <span className="stat-label">חודש נוכחי</span>
                <strong className="stat-value">{summaryData.currentMonthTrips}</strong>
              </div>
            </div>
            <div className="summary-row-colored row-negative">
              <div className="stat-item">
                <span className="stat-label">חיובים קבועים:</span>
                <strong className="stat-value">₪ {summaryData.fixedCharges}</strong>
              </div>
              <div className="stat-item">
                <span className="stat-label">חיובים משתנים:</span>
                <strong className="stat-value">₪ {summaryData.variableCharges}</strong>
              </div>
            </div>
            <div className="summary-row-colored row-positive">
              <div className="stat-item">
                <span className="stat-label">זיכויים משתנים:</span>
                <strong className="stat-value">₪ {summaryData.variableCredits}</strong>
              </div>
              <div className="stat-item">
                <span className="stat-label">זיכויים באשראי:</span>
                <strong className="stat-value">₪ {summaryData.creditCardCredits}</strong>
              </div>
            </div>
            <div className="summary-row final-row">
              <div className="stat-item">
                <span className="stat-label">יתרה קודמת</span>
                <strong className="stat-value">₪ {summaryData.previousBalance}</strong>
              </div>
              <div className="stat-item">
                <span className="stat-label">סיכום סופי</span>
                <strong className="stat-value">₪ {summaryData.finalBalance}</strong>
              </div>
            </div>
            <div className="details-action">
              <Button className="btn-update-payment">הצג פירוט</Button>
            </div>
          </div>
          
          <footer className="reports-footer">
            <div className="flex items-center space-x-2" dir="ltr">
              <Label htmlFor="disable-driver-switch" className="font-medium text-gray-800">השבתת נהג</Label>
              <Switch id="disable-driver-switch" />
            </div>
            <Button className="btn-update-payment">עדכון תשלום</Button>
          </footer>
        </>
      )}

      {activeSubTab === 'export' && (
        <div className="export-form-card">
            <div className="date-range-selector">
                <h4>בחר טווח תאריכים:</h4>
                <div className="date-inputs">
                    <div className="form-group">
                        <label>תאריך התחלה:</label>
                        <div className="input-with-icon">
                            <Input type="text" value={exportFormData.startDate} onChange={(e) => handleExportChange('startDate', e.target.value)} />
                            <CalendarDays size={16} className="icon" />
                        </div>
                    </div>
                     <div className="form-group">
                        <label>תאריך סיום:</label>
                        <div className="input-with-icon">
                            <Input type="text" value={exportFormData.endDate} onChange={(e) => handleExportChange('endDate', e.target.value)} />
                            <CalendarDays size={16} className="icon" />
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="export-options">
                <label className="checkbox-option main-option">
                    <Checkbox checked={exportFormData.noDate} onCheckedChange={(checked) => handleExportChange('noDate', checked)} />
                    <span className="ml-2">ייצוא דוחות ללא בחירת תאריך</span>
                </label>
                
                <label className="checkbox-option">
                    <Checkbox checked={exportFormData.tripsTaken} onCheckedChange={(checked) => handleExportChange('tripsTaken', checked)} />
                    <span className="ml-2">פירוט נסיעות שלקח</span>
                </label>
                 <label className="checkbox-option">
                    <Checkbox checked={exportFormData.tripsGiven} onCheckedChange={(checked) => handleExportChange('tripsGiven', checked)} />
                    <span className="ml-2">פירוט נסיעות שהביא</span>
                </label>
                 <label className="checkbox-option">
                    <Checkbox checked={exportFormData.shortSummary} onCheckedChange={(checked) => handleExportChange('shortSummary', checked)} />
                    <span className="ml-2">פירוט פעולות (מקוצר)</span>
                </label>
                 <label className="checkbox-option">
                    <Checkbox checked={exportFormData.fullSummary} onCheckedChange={(checked) => handleExportChange('fullSummary', checked)} />
                    <span className="ml-2">פירוט פעולות (מורחב)</span>
                </label>
            </div>
            
            <div className="form-action">
                <Button className="btn-action">ייצוא ושליחה למייל</Button>
            </div>
        </div>
      )}
    </div>
  );
}