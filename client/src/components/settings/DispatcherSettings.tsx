import React, { useState } from 'react';
import { UserCog, Plus, Edit, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Dispatcher {
  id: number;
  name: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  permissions: string[];
}

const mockDispatchers: Dispatcher[] = [
  { id: 1, name: 'יוסי כהן', phone: '050-1234567', email: 'yossi@example.com', status: 'active', permissions: ['trips', 'drivers'] },
  { id: 2, name: 'רחל לוי', phone: '052-9876543', email: 'rachel@example.com', status: 'active', permissions: ['payments', 'reports'] },
];

export default function DispatcherSettings() {
  const [dispatchers, setDispatchers] = useState<Dispatcher[]>(mockDispatchers);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <style>{`
        .dispatcher-settings h3 {
          font-weight: 500;
          margin-bottom: 1.5rem;
          color: #1f2937;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .dispatcher-actions {
          display: flex;
          gap: 1rem;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .dispatcher-table {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
        }
        .table-header {
          background-color: #f9fafb;
          display: grid;
          grid-template-columns: 2fr 1.5fr 2fr 1fr 1.5fr 120px;
          padding: 1rem;
          font-weight: 500;
          color: #6b7280;
          border-bottom: 1px solid #e5e7eb;
        }
        .table-row {
          display: grid;
          grid-template-columns: 2fr 1.5fr 2fr 1fr 1.5fr 120px;
          padding: 1rem;
          border-bottom: 1px solid #f3f4f6;
          align-items: center;
        }
        .table-row:last-child {
          border-bottom: none;
        }
        .table-row:hover {
          background-color: #f9fafb;
        }
        .permissions-list {
          display: flex;
          gap: 0.25rem;
          flex-wrap: wrap;
        }
        .permission-badge {
          background-color: #e0f2fe;
          color: #0369a1;
          font-size: 0.75rem;
          padding: 0.125rem 0.5rem;
          border-radius: 12px;
        }
        .row-actions {
          display: flex;
          gap: 0.5rem;
        }
        .btn-icon {
          background: #fef8e7;
          border: 1px solid #f0dca4;
          color: #a8842c;
          width: 32px;
          height: 32px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .btn-icon:hover {
          background-color: #fff3cd;
        }
        .btn-add-dispatcher {
          background-color: #fef8e7;
          border: 1px solid #f0dca4;
          color: #1f2937;
          font-weight: 500;
          padding: 0.6rem 1.2rem;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .btn-add-dispatcher:hover {
          background-color: #fff3cd;
        }
      `}</style>
      
      <div className="dispatcher-settings">
        <h3>
          <UserCog size={20} />
          ניהול מוקדנים
        </h3>
        
        <div className="dispatcher-actions">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600">{dispatchers.length} מוקדנים פעילים</span>
          </div>
          <button className="btn-add-dispatcher">
            <Plus size={16} />
            הוסף מוקדן חדש
          </button>
        </div>
        
        <div className="dispatcher-table">
          <div className="table-header">
            <div>שם המוקדן</div>
            <div>טלפון</div>
            <div>דוא"ל</div>
            <div>סטטוס</div>
            <div>הרשאות</div>
            <div>פעולות</div>
          </div>
          
          {dispatchers.map((dispatcher) => (
            <div key={dispatcher.id} className="table-row">
              <div className="font-medium">{dispatcher.name}</div>
              <div className="text-sm">{dispatcher.phone}</div>
              <div className="text-sm">{dispatcher.email}</div>
              <div>
                <Badge className={dispatcher.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                  {dispatcher.status === 'active' ? 'פעיל' : 'לא פעיל'}
                </Badge>
              </div>
              <div className="permissions-list">
                {dispatcher.permissions.map((permission) => (
                  <span key={permission} className="permission-badge">
                    {permission === 'trips' ? 'נסיעות' :
                     permission === 'drivers' ? 'נהגים' :
                     permission === 'payments' ? 'תשלומים' :
                     permission === 'reports' ? 'דוחות' : permission}
                  </span>
                ))}
              </div>
              <div className="row-actions">
                <button className="btn-icon" title="עריכה">
                  <Edit size={14} />
                </button>
                <button className="btn-icon" title="מחיקה">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}