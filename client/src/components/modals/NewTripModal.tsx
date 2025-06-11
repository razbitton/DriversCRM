import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Pencil, CircleDollarSign } from 'lucide-react';
import { apiRequest } from "@/lib/queryClient";
import type { Driver, Client, InsertTender } from '@shared/schema';

export default function NewTripModal({ setOpen, onTripCreated }: {
  setOpen: (open: boolean) => void;
  onTripCreated?: () => void;
}) {
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    channel_id: 'all_channels',
    service_type: 'ride',
    assigned_driver_id: 'dispatcher',
    client_type: 'casual',
    client_id: '',
    contact_phone: '',
    origin_address: '',
    origin_city: '',
    destination_address: '',
    destination_city: '',
    is_immediate: true,
    price: '',
    notes: '',
  });
  
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);

  const { data: drivers = [] } = useQuery<Driver[]>({
    queryKey: ['/api/drivers'],
  });

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
  });

  const { data: channels = [] } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
  });

  const createTenderMutation = useMutation({
    mutationFn: async (data: InsertTender) => {
      return await apiRequest("/api/tenders", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tenders"] });
      onTripCreated?.();
      setOpen(false);
    },
  });

  useEffect(() => {
    setFilteredClients(clients.filter(c => c.status === formData.client_type));
  }, [clients, formData.client_type]);
  
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleClientTypeChange = (value: string) => {
    handleChange('client_type', value);
    handleChange('client_id', '');
    handleChange('contact_phone', '');
    setFilteredClients(clients.filter(c => c.status === value));
  };
  
  const handleClientChange = (clientId: string) => {
    const client = clients.find(c => c.id.toString() === clientId);
    if (client) {
        handleChange('client_id', clientId);
        handleChange('contact_phone', client.phone);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation for required fields
    if (!formData.contact_phone) {
      alert('נא למלא טלפון ליצירת קשר');
      return;
    }
    if (!formData.origin_address || !formData.origin_city) {
      alert('נא למלא כתובת ועיר מוצא');
      return;
    }
    if (!formData.destination_address || !formData.destination_city) {
      alert('נא למלא כתובת ועיר יעד');
      return;
    }
    if (!formData.price) {
      alert('נא למלא סכום לתשלום');
      return;
    }

    const driver = drivers.find(d => d.id.toString() === formData.assigned_driver_id);
    const client = clients.find(c => c.id.toString() === formData.client_id);

    const tenderData: InsertTender = {
        tender_number: `TD${Date.now()}`,
        origin: `${formData.origin_address}, ${formData.origin_city}`,
        destination: `${formData.destination_address}, ${formData.destination_city}`,
        client_name: client?.full_name || 'לקוח מזדמן',
        client_phone: formData.contact_phone,
        service_type: formData.service_type as any,
        status: formData.assigned_driver_id && formData.assigned_driver_id !== 'dispatcher' ? 'waiting' : 'active',
        scheduled_time: formData.is_immediate ? null : new Date(),
        driver_id: driver?.id || null,
        notes: formData.notes || null,
    };
    
    try {
        createTenderMutation.mutate(tenderData);
    } catch(error) {
        console.error("Failed to create tender:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden w-full mx-4">
        <style>{`
          :root {
              --primary-bg-modal: #f8f9fa;
              --modal-bg: #ffffff;
              --text-dark-modal: #212529;
              --text-muted-modal: #6c757d;
              --accent-color-modal: #fef8e7;
              --accent-border-modal: #f0dca4;
              --accent-strong-modal: #fdd85d;
              --border-color-modal: #e9ecef;
          }
          .modal-body-new-trip {
              padding: 1.5rem 2rem;
              overflow-y: auto;
              background-color: var(--primary-bg-modal);
              max-height: 75vh;
          }
          .form-section {
              margin-bottom: 2rem;
          }
          .form-section:last-child {
              margin-bottom: 0;
          }
          .form-section h4 {
              font-weight: 500;
              margin-top: 0;
              margin-bottom: 1rem;
          }
          .form-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 1.5rem;
          }
          .form-group {
              display: flex;
              flex-direction: column;
              gap: 0.5rem;
          }
          .form-group.full-span {
              grid-column: 1 / -1;
          }
          .form-group label {
              font-size: 0.9rem;
              color: var(--text-muted-modal);
          }
          .required {
              color: #dc3545;
          }
          .input-with-icon {
              position: relative;
          }
          .input-with-icon.full-width {
              margin-bottom: 1.5rem;
          }
          .input-with-icon .icon {
              position: absolute;
              left: 12px;
              top: 50%;
              transform: translateY(-50%);
              color: var(--text-muted-modal);
              pointer-events: none;
          }
          .input-with-icon.currency .icon {
              right: 12px;
              left: auto;
          }
          .location-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 1.5rem;
          }
          .location-box {
              background-color: var(--modal-bg);
              border: 1px solid var(--border-color-modal);
              border-radius: 8px;
              padding: 1rem;
              display: flex;
              flex-direction: column;
              gap: 1rem;
          }
          .location-box h5 {
              font-weight: 500;
              margin: 0;
              text-align: center;
          }
          .location-box .input-with-icon input {
              background-color: var(--primary-bg-modal);
          }
          .payment-section {
              background: var(--modal-bg);
              padding: 1.5rem;
              border-radius: 8px;
              border: 1px solid var(--border-color-modal);
          }
          .payment-controls {
              display: flex;
              justify-content: space-between;
              align-items: center;
              flex-wrap: wrap;
              gap: 1rem;
              margin-bottom: 1.5rem;
          }
          .payment-amount {
              display: flex;
              align-items: center;
              gap: 0.5rem;
          }
          .payment-amount label {
              font-weight: 500;
          }
          .payment-amount input {
              width: 120px;
              text-align: right;
              padding-left: 2rem;
          }
          .toggle-switch-label { display: flex; align-items: center; gap: 0.75rem; color: var(--text-muted-modal); font-weight: 500; }
          .modal-footer {
              display: flex;
              justify-content: flex-end;
              gap: 1rem;
              padding: 1rem 2rem;
              border-top: 1px solid var(--border-color-modal);
              background-color: var(--primary-bg-modal);
          }
          .btn {
              padding: 0.75rem 2rem;
              border-radius: 8px;
              font-weight: 700;
              font-size: 1rem;
              cursor: pointer;
          }
          .btn-save {
              background-color: var(--accent-strong-modal);
              border: 1px solid var(--accent-strong-modal);
              color: var(--text-dark-modal);
          }
          .btn-cancel {
              background-color: var(--accent-color-modal);
              border: 1px solid var(--accent-border-modal);
              color: var(--text-dark-modal);
          }
        `}</style>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body-new-trip">
              <section className="form-section">
                  <h4>פרטי נסיעה</h4>
                  <div className="form-group full-span">
                      <label>שיוך לערוץ</label>
                      <Select value={formData.channel_id} onValueChange={(value) => handleChange('channel_id', value)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                              <SelectItem value="all_channels">כל הערוצים</SelectItem>
                              {channels.map(channel => (
                                  <SelectItem key={channel.id} value={channel.id.toString()}>
                                      {channel.full_name}
                                  </SelectItem>
                              ))}
                          </SelectContent>
                      </Select>
                  </div>
                  <div className="form-grid">
                      <div className="form-group">
                          <label>סוג שירות</label>
                          <Select value={formData.service_type} onValueChange={(value) => handleChange('service_type', value)}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="ride">הסעה</SelectItem>
                                  <SelectItem value="special">מיוחד</SelectItem>
                              </SelectContent>
                          </Select>
                      </div>
                      <div className="form-group">
                          <label>שיוך הנסיעה לנהג</label>
                          <Select value={formData.assigned_driver_id} onValueChange={(value) => handleChange('assigned_driver_id', value)}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="dispatcher">מוקדן</SelectItem>
                                  {drivers.map(driver => (
                                      <SelectItem key={driver.id} value={driver.id.toString()}>{driver.full_name}</SelectItem>
                                  ))}
                              </SelectContent>
                          </Select>
                      </div>
                      <div className="form-group">
                          <label>סוג לקוח</label>
                          <Select value={formData.client_type} onValueChange={handleClientTypeChange}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="casual">מזדמן</SelectItem>
                                  <SelectItem value="regular">קבוע</SelectItem>
                              </SelectContent>
                          </Select>
                      </div>
                       <div className="form-group">
                          <label>בחירת לקוח</label>
                          <Select value={formData.client_id} onValueChange={handleClientChange} disabled={formData.client_type === 'casual'}>
                              <SelectTrigger><SelectValue placeholder="בחר לקוח" /></SelectTrigger>
                              <SelectContent>
                                  {filteredClients.map(client => <SelectItem key={client.id} value={client.id.toString()}>{client.full_name}</SelectItem>)}
                              </SelectContent>
                          </Select>
                      </div>
                      <div className="form-group full-span">
                          <label>טלפון ליצירת קשר <span className="required">*</span></label>
                          <Input type="text" value={formData.contact_phone} onChange={(e) => handleChange('contact_phone', e.target.value)} required />
                      </div>
                  </div>
              </section>

              <section className="form-section">
                  <h4>תכנון נסיעה</h4>
                  <div className="location-grid">
                      <div className="location-box">
                          <h5>מעיר</h5>
                          <div className="input-with-icon"><Input type="text" placeholder="כתובת *" value={formData.origin_address} onChange={(e) => handleChange('origin_address', e.target.value)} required /><Pencil size={16} className="icon" /></div>
                          <div className="input-with-icon"><Input type="text" placeholder="עיר *" value={formData.origin_city} onChange={(e) => handleChange('origin_city', e.target.value)} required /><Pencil size={16} className="icon" /></div>
                      </div>
                       <div className="location-box">
                          <h5>ליעד</h5>
                          <div className="input-with-icon"><Input type="text" placeholder="כתובת *" value={formData.destination_address} onChange={(e) => handleChange('destination_address', e.target.value)} required /><Pencil size={16} className="icon" /></div>
                          <div className="input-with-icon"><Input type="text" placeholder="עיר *" value={formData.destination_city} onChange={(e) => handleChange('destination_city', e.target.value)} required /><Pencil size={16} className="icon" /></div>
                      </div>
                  </div>
              </section>

               <section className="form-section payment-section">
                  <div className="payment-controls">
                      <label className="toggle-switch-label">
                          <span>מיידי</span>
                          <Switch checked={!formData.is_immediate} onCheckedChange={(checked) => handleChange('is_immediate', !checked)} />
                          <span>מתוזמן</span>
                      </label>
                      <div className="payment-amount">
                          <label>סכום לתשלום: <span className="required">*</span></label>
                          <div className="input-with-icon currency">
                              <Input type="number" value={formData.price} onChange={(e) => handleChange('price', e.target.value)} required />
                              <CircleDollarSign size={16} className="icon" />
                          </div>
                      </div>
                  </div>
                  <div className="form-group notes">
                      <label>הערות לנהג</label>
                      <div className="input-with-icon">
                          <Textarea value={formData.notes} onChange={(e) => handleChange('notes', e.target.value)} />
                          <Pencil size={16} className="icon" />
                      </div>
                  </div>
              </section>
          </div>

          <footer className="modal-footer">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="btn btn-cancel">ביטול</Button>
              <Button type="submit" className="btn btn-save" disabled={createTenderMutation.isPending}>
                {createTenderMutation.isPending ? "יוצר..." : "צור נסיעה חדשה"}
              </Button>
          </footer>
        </form>
      </div>
    </div>
  );
}