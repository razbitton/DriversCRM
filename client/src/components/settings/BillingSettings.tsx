import React from 'react';
import { CreditCard, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function BillingSettings() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <style>{`
        .billing-settings h3 {
          font-weight: 500;
          margin-bottom: 1.5rem;
          color: #1f2937;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .billing-form {
          display: grid;
          gap: 1.5rem;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-group label {
          font-weight: 500;
          color: #374151;
        }
        .billing-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-start;
          margin-top: 1.5rem;
        }
        .btn-billing {
          background-color: #fef8e7;
          border: 1px solid #f0dca4;
          color: #1f2937;
          font-weight: 500;
          padding: 0.6rem 1.2rem;
          border-radius: 6px;
          cursor: pointer;
        }
        .btn-billing:hover {
          background-color: #fff3cd;
        }
      `}</style>
      
      <div className="billing-settings">
        <h3>
          <CreditCard size={20} />
          הגדרות חיוב
        </h3>
        
        <div className="billing-form">
          <div className="form-row">
            <div className="form-group">
              <label>אחוז עמלה</label>
              <Input type="number" placeholder="15" />
            </div>
            <div className="form-group">
              <label>מטבע</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="בחר מטבע" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ils">שקל (₪)</SelectItem>
                  <SelectItem value="usd">דולר ($)</SelectItem>
                  <SelectItem value="eur">יורו (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>תאריך חיוב חודשי</label>
              <Input type="number" placeholder="1" min="1" max="28" />
            </div>
            <div className="form-group">
              <label>שיטת תשלום</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="בחר שיטת תשלום" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">העברה בנקאית</SelectItem>
                  <SelectItem value="credit">כרטיס אשראי</SelectItem>
                  <SelectItem value="check">המחאה</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="form-group">
            <label>הערות נוספות</label>
            <Input placeholder="הערות לגבי החיוב..." />
          </div>
        </div>
        
        <div className="billing-actions">
          <button className="btn-billing">
            <DollarSign size={16} />
            עדכן הגדרות חיוב
          </button>
        </div>
      </div>
    </div>
  );
}