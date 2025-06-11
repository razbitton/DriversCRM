import React, { useState } from 'react';
import { PlusCircle, Settings, Trash2, Edit, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface Channel {
  id: number;
  name: string;
  type: 'radio' | 'whatsapp' | 'telegram';
  frequency: string;
  isActive: boolean;
  description: string;
}

const mockChannels: Channel[] = [
  { id: 1, name: 'ערוץ ראשי', type: 'radio', frequency: '87.5 FM', isActive: true, description: 'ערוץ תקשורת ראשי עם הנהגים' },
  { id: 2, name: 'WhatsApp Business', type: 'whatsapp', frequency: 'API', isActive: true, description: 'קבוצת WhatsApp לנהגים' },
  { id: 3, name: 'Telegram Channel', type: 'telegram', frequency: 'Bot API', isActive: false, description: 'ערוץ Telegram לעדכונים' },
];

export default function ChannelSettings() {
  const [channels, setChannels] = useState<Channel[]>(mockChannels);

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'radio': return <Radio size={16} />;
      case 'whatsapp': return <span className="text-green-600">📱</span>;
      case 'telegram': return <span className="text-blue-600">✈️</span>;
      default: return <Settings size={16} />;
    }
  };

  const getChannelTypeLabel = (type: string) => {
    switch (type) {
      case 'radio': return 'רדיו';
      case 'whatsapp': return 'WhatsApp';
      case 'telegram': return 'Telegram';
      default: return type;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <style>{`
        .channel-settings h3 {
          font-weight: 500;
          margin-bottom: 1.5rem;
          color: #1f2937;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .channel-actions {
          display: flex;
          gap: 1rem;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .channel-stats {
          display: flex;
          gap: 2rem;
          align-items: center;
        }
        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #6b7280;
        }
        .channel-grid {
          display: grid;
          gap: 1rem;
        }
        .channel-card {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 1.5rem;
          transition: all 0.2s;
        }
        .channel-card:hover {
          border-color: #d1d5db;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .channel-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }
        .channel-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .channel-name {
          font-weight: 600;
          color: #1f2937;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .channel-meta {
          display: flex;
          gap: 1rem;
          align-items: center;
          font-size: 0.875rem;
          color: #6b7280;
        }
        .channel-description {
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }
        .channel-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .channel-actions-row {
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
        .btn-add-channel {
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
        .btn-add-channel:hover {
          background-color: #fff3cd;
        }
        .toggle-control {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
      `}</style>
      
      <div className="channel-settings">
        <h3>
          <PlusCircle size={20} />
          ניהול ערוצי תקשורת
        </h3>
        
        <div className="channel-actions">
          <div className="channel-stats">
            <div className="stat-item">
              <Radio size={16} />
              <span>{channels.filter(c => c.isActive).length} ערוצים פעילים</span>
            </div>
            <div className="stat-item">
              <Settings size={16} />
              <span>{channels.length} סה"כ ערוצים</span>
            </div>
          </div>
          <button className="btn-add-channel">
            <PlusCircle size={16} />
            הוסף ערוץ חדש
          </button>
        </div>
        
        <div className="channel-grid">
          {channels.map((channel) => (
            <div key={channel.id} className="channel-card">
              <div className="channel-header">
                <div className="channel-info">
                  <div className="channel-name">
                    {getChannelIcon(channel.type)}
                    {channel.name}
                  </div>
                  <div className="channel-meta">
                    <Badge variant="outline">
                      {getChannelTypeLabel(channel.type)}
                    </Badge>
                    <span>{channel.frequency}</span>
                  </div>
                </div>
                <Badge className={channel.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                  {channel.isActive ? 'פעיל' : 'לא פעיל'}
                </Badge>
              </div>
              
              <div className="channel-description">
                {channel.description}
              </div>
              
              <div className="channel-controls">
                <div className="toggle-control">
                  <Switch checked={channel.isActive} />
                  <span className="text-sm text-gray-600">
                    {channel.isActive ? 'מופעל' : 'כבוי'}
                  </span>
                </div>
                <div className="channel-actions-row">
                  <button className="btn-icon" title="עריכה">
                    <Edit size={14} />
                  </button>
                  <button className="btn-icon" title="מחיקה">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}