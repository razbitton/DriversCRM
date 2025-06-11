import React, { useState, useEffect, useRef } from 'react';
import { Message } from '@/entities/Message';
import { Driver } from '@/entities/Driver';
import { Channel } from '@/entities/Channel'; // Import Channel entity
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Calendar, Clock } from 'lucide-react';

export default function MessageModal({ setOpen }) {
  const [formData, setFormData] = useState({
    channel_id: 'all_channels', // Changed to channel_id with default 'all_channels'
    assigned_driver_id: 'all_drivers', // Changed to assigned_driver_id with default 'all_drivers'
    title: '',
    content: '',
    // Removed notes field as per requirement
    urgency_level: 'medium',
    scheduled_date: '',
    scheduled_time: '',
    is_scheduled: true
  });
  
  const [drivers, setDrivers] = useState([]);
  const [channels, setChannels] = useState([]); // Add state for channels
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [timeSearchTerm, setTimeSearchTerm] = useState('');
  
  const timeInputRef = useRef(null);
  const timeDropdownRef = useRef(null);

  const timeOptions = [
    '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45',
    '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45',
    '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45',
    '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45',
    '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45',
    '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45',
    '20:00', '20:15', '20:30', '20:45'
  ];

  useEffect(() => {
    const fetchLists = async () => { // Renamed to fetchLists
      try {
        const [driversData, channelsData] = await Promise.all([ // Fetch both drivers and channels
            Driver.list(),
            Channel.list()
        ]);
        setDrivers(driversData);
        setChannels(channelsData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    fetchLists();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only check for time dropdown, driver dropdown is replaced with Select
      if (timeDropdownRef.current && !timeDropdownRef.current.contains(event.target) &&
          timeInputRef.current && !timeInputRef.current.contains(event.target)) {
        setShowTimeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTimeSearch = (value) => {
    setTimeSearchTerm(value);
    setShowTimeDropdown(true);
  };

  const handleTimeSelect = (time) => {
    setTimeSearchTerm(time);
    handleChange('scheduled_time', time);
    setShowTimeDropdown(false);
  };

  const filteredTimeOptions = timeOptions.filter(time => 
    time.includes(timeSearchTerm)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let driverName = '';
      let driverId = null;
      if (formData.assigned_driver_id !== 'all_drivers') {
        const selectedDriver = drivers.find(d => d.id === formData.assigned_driver_id);
        if (selectedDriver) {
          driverName = selectedDriver.full_name;
          driverId = selectedDriver.id;
        }
      }

      let channelName = 'כל הערוצים';
      if (formData.channel_id !== 'all_channels') {
          const selectedChannel = channels.find(c => c.id === formData.channel_id);
          if (selectedChannel) {
              channelName = selectedChannel.channel_name;
          }
      }

      const submissionData = {
        ...formData,
        channel_assignment: channelName, // Use derived channel name
        assigned_driver_id: driverId,   // Use derived driver ID
        assigned_driver_name: driverName, // Use derived driver name
        scheduled_time: timeSearchTerm,
        status: formData.is_scheduled ? 'scheduled' : 'sent'
      };
      delete submissionData.channel_id; // Remove temporary channel_id from submissionData before sending
      // No need to delete submissionData.notes as it's removed from formData state.

      await Message.create(submissionData);
      setOpen(false);
    } catch (error) {
      console.error("Failed to create message:", error);
    }
  };

  return (
    <>
      <style>{`
        .message-modal-body {
          padding: 1.5rem 2rem;
          overflow-y: auto;
          background-color: #f8f9fa;
          max-height: 75vh;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem 2rem;
        }
        
        .form-group {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .form-group.full-span {
          grid-column: 1 / -1;
        }
        
        .form-group label {
          font-size: 0.9rem;
          color: #6c757d;
        }
        
        .input-with-icon {
          position: relative;
        }
        
        .input-with-icon .icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #6c757d;
          pointer-events: none;
        }

        .input-with-icon .icon-override { /* Added for the outline's use of icon-override */
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #6c757d;
          pointer-events: none;
        }
        
        .message-modal-body input,
        .message-modal-body select,
        .message-modal-body textarea {
          background-color: #ffffff !important;
          border: 1px solid #e9ecef !important;
          border-radius: 6px !important;
          padding: 0.75rem !important;
          font-family: 'Heebo', sans-serif !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }
        
        .message-modal-body textarea {
          resize: vertical;
          min-height: 120px;
        }
        
        .autocomplete-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          width: 100%;
          background-color: #ffffff;
          border: 1px solid #e9ecef;
          border-radius: 6px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          z-index: 50;
          max-height: 200px;
          overflow-y: auto;
        }
        
        .dropdown-item {
          padding: 0.75rem 1rem;
          cursor: pointer;
          border-bottom: 1px solid #f8f9fa;
        }
        
        .dropdown-item:hover {
          background-color: #f8f9fa;
        }
        
        .dropdown-item:last-child {
          border-bottom: none;
        }
        
        .scheduling-section {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e9ecef;
          display: flex;
          align-items: flex-end;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .section-title {
          width: 100%;
          font-size: 1.2rem;
          font-weight: 600;
          color: #343a40;
          margin-bottom: 1rem;
        }
        
        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding-bottom: 0.75rem;
        }
        
        .checkbox-group label {
          font-size: 0.9rem;
          color: #212529;
          font-weight: 500;
        }
        
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          padding: 1rem 2rem;
          border-top: 1px solid #e9ecef;
          background-color: #f8f9fa;
          border-radius: 0 0 16px 16px;
        }
        
        .btn-save {
          background-color: #fdd85d;
          border: 1px solid #fdd85d;
          color: #212529;
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
        }
        
        .btn-cancel {
          background-color: #fef8e7;
          border: 1px solid #f0dca4;
          color: #212529;
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
        }
      `}</style>
      
      <div className="message-modal-body">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group full-span">
              <label>שיוך לערוץ</label>
              {/* Replaced Input with Select for channel assignment */}
              <Select value={formData.channel_id} onValueChange={(value) => handleChange('channel_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר ערוץ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_channels">כל הערוצים</SelectItem>
                  {channels.map((channel) => (
                    <SelectItem key={channel.id} value={channel.id}>
                      {channel.channel_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="form-group">
              <label>שיוך לנהג</label>
              {/* Replaced Input with Select for driver assignment */}
              <Select value={formData.assigned_driver_id} onValueChange={(value) => handleChange('assigned_driver_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר נהג" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_drivers">כל הנהגים</SelectItem>
                  {drivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {driver.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="form-group">
              <label>כותרת הודעה</label>
              <div className="input-with-icon">
                <Input
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                />
                <Pencil size={16} className="icon-override" />
              </div>
            </div>

            <div className="form-group full-span">
              <label>תוכן הודעה</label>
              <Textarea
                value={formData.content}
                onChange={(e) => handleChange('content', e.target.value)}
                rows={5}
              />
            </div>
            
            {/* Removed the notes form group as per requirement */}

            <div className="form-group">
              <label>רמת דחיפות</label>
              <Input
                value={formData.urgency_level}
                onChange={(e) => handleChange('urgency_level', e.target.value)}
              />
            </div>
          </div>
          
          <div className="scheduling-section">
            <h5 className="section-title">תזמון ההודעה</h5>
            <div className="form-group">
              <label>תאריך</label>
              <div className="input-with-icon">
                <Input
                  type="date"
                  value={formData.scheduled_date}
                  onChange={(e) => handleChange('scheduled_date', e.target.value)}
                />
                <Calendar size={16} className="icon" />
              </div>
            </div>
            
            <div className="form-group autocomplete-group">
              <label>שעה</label>
              <div className="input-with-icon">
                <Input
                  ref={timeInputRef}
                  value={timeSearchTerm}
                  onChange={(e) => handleTimeSearch(e.target.value)}
                  onFocus={() => setShowTimeDropdown(true)}
                  placeholder="הקלד שעה..."
                />
                <Clock size={16} className="icon" />
              </div>
              {showTimeDropdown && (
                <div ref={timeDropdownRef} className="autocomplete-dropdown">
                  {filteredTimeOptions.map((time) => (
                    <div
                      key={time}
                      className="dropdown-item"
                      onClick={() => handleTimeSelect(time)}
                    >
                      {time}
                    </div>
                  ))}
                  {filteredTimeOptions.length === 0 && (
                    <div className="dropdown-item">לא נמצאו שעות</div>
                  )}
                </div>
              )}
            </div>
            
            <div className="checkbox-group">
              <Checkbox
                id="schedule-msg"
                checked={formData.is_scheduled}
                onCheckedChange={(checked) => handleChange('is_scheduled', checked)}
              />
              <label htmlFor="schedule-msg">תזמון הודעה</label>
            </div>
          </div>
        </form>
      </div>

      <div className="modal-footer">
        <button 
          type="button" 
          className="btn-cancel"
          onClick={() => setOpen(false)}
        >
          ביטול
        </button>
        <button 
          type="submit" 
          className="btn-save"
          onClick={handleSubmit} // Submit button should trigger form submission
        >
          שמור
        </button>
      </div>
    </>
  );
} 