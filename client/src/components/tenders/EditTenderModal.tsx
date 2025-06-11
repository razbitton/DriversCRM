import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Pencil, CircleDollarSign } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { Tender, Driver, Client } from '@shared/schema';

interface EditTenderModalProps {
  setOpen: (open: boolean) => void;
  onTenderUpdated: () => void;
  tender: Tender;
}

export default function EditTenderModal({ setOpen, onTenderUpdated, tender }: EditTenderModalProps) {
  const [formData, setFormData] = useState({
    channel_id: '',
    service_type: '',
    assigned_driver_id: '',
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
  const queryClient = useQueryClient();

  const { data: drivers = [] } = useQuery<Driver[]>({
    queryKey: ['/api/drivers'],
  });

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
  });

  const updateTenderMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest(`/api/tenders/${tender.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tenders'] });
      onTenderUpdated();
      setOpen(false);
    },
  });

  useEffect(() => {
    if (tender && clients.length > 0) {
        const originParts = tender.origin ? tender.origin.split(',') : [''];
        const origin_city = originParts.pop()?.trim() || '';
        const origin_address = originParts.join(',').trim();

        const destinationParts = tender.destination ? tender.destination.split(',') : [''];
        const destination_city = destinationParts.pop()?.trim() || '';
        const destination_address = destinationParts.join(',').trim();

        const client = clients.find((c: Client) => c.id === tender.driver_id) || 
                     clients.find((c: Client) => c.full_name === tender.client_name);
        const client_type = client ? client.status : 'casual';
        
        setFormData({
            channel_id: 'all_channels',
            service_type: tender.service_type || 'ride',
            assigned_driver_id: tender.driver_id?.toString() || 'dispatcher',
            client_type: client_type,
            client_id: client?.id?.toString() || '',
            contact_phone: tender.client_phone || '',
            origin_address: origin_address,
            origin_city: origin_city,
            destination_address: destination_address,
            destination_city: destination_city,
            is_immediate: true, 
            price: '0',
            notes: tender.notes || '',
        });

        setFilteredClients(clients.filter((c: Client) => c.status === client_type));
    }
  }, [tender, clients]);
  
  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleClientTypeChange = (value: string) => {
    handleChange('client_type', value);
    handleChange('client_id', '');
    handleChange('contact_phone', '');
    setFilteredClients(clients.filter((c: Client) => c.status === value));
  };
  
  const handleClientChange = (clientId: string) => {
    const client = clients.find((c: Client) => c.id.toString() === clientId);
    if (client) {
        handleChange('client_id', clientId);
        handleChange('contact_phone', client.phone);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.price) { 
      alert('נא למלא סכום לתשלום'); 
      return; 
    }

    const driver = drivers.find((d: Driver) => d.id.toString() === formData.assigned_driver_id);
    const client = clients.find((c: Client) => c.id.toString() === formData.client_id);

    const tenderData = {
        origin: `${formData.origin_address}, ${formData.origin_city}`,
        destination: `${formData.destination_address}, ${formData.destination_city}`,
        service_type: formData.service_type,
        status: formData.assigned_driver_id && formData.assigned_driver_id !== 'dispatcher' ? 'taken' : 'available',
        driver_id: driver?.id || null,
        client_name: client?.full_name || 'לקוח מזדמן',
        client_phone: formData.contact_phone,
        notes: formData.notes,
    };
    
    updateTenderMutation.mutate(tenderData);
  };

  return (
    <>
      <style>{`
        .modal-body-new-trip { padding: 1.5rem 2rem; overflow-y: auto; background-color: #f8f9fa; max-height: 75vh; }
        .form-section { margin-bottom: 2rem; }
        .form-section h4 { font-weight: 500; margin-top: 0; margin-bottom: 1rem; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .form-group.full-span { grid-column: 1 / -1; }
        .form-group label { font-size: 0.9rem; color: #6c757d; }
        .input-with-icon { position: relative; }
        .input-with-icon .icon-override { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #9ca3af; }
        .required-star { color: #dc3545; margin-left: 2px; }
        .modal-footer { display: flex; justify-content: flex-end; padding: 1.5rem 2rem; border-top: 1px solid #e9ecef; background-color: #ffffff; }
        .btn-submit-accent { background-color: #fdd85d; border: 1px solid #fdd85d; color: #212529; padding: 0.75rem 2rem; border-radius: 8px; font-weight: 700; cursor: pointer; transition: background-color 0.2s; }
        .btn-submit-accent:hover { background-color: #fce588; }
      `}</style>
      <form onSubmit={handleSubmit}>
        <div className="modal-body-new-trip">
            <div className="form-section">
              <h4>פרטי נסיעה</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label>סוג שירות</label>
                  <Select value={formData.service_type} onValueChange={value => handleChange('service_type', value)}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ride">הסעה</SelectItem>
                      <SelectItem value="delivery">משלוח</SelectItem>
                      <SelectItem value="special">מיוחד</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="form-group">
                  <label>שיוך הנסיעה לנהג</label>
                  <Select value={formData.assigned_driver_id} onValueChange={value => handleChange('assigned_driver_id', value)}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dispatcher">מוקדן</SelectItem>
                      {drivers.map((d: Driver) => <SelectItem key={d.id} value={d.id.toString()}>{d.full_name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <div className="form-grid">
                <div className="form-group">
                  <label>סוג לקוח</label>
                  <Select value={formData.client_type} onValueChange={handleClientTypeChange}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">קבוע</SelectItem>
                      <SelectItem value="casual">מזדמן</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="form-group">
                  <label>בחר לקוח</label>
                  <Select disabled={formData.client_type === 'casual'} value={formData.client_id} onValueChange={handleClientChange}>
                    <SelectTrigger><SelectValue placeholder="בחר לקוח..."/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="" disabled>בחר לקוח...</SelectItem>
                      {filteredClients.map((c: Client) => <SelectItem key={c.id} value={c.id.toString()}>{c.full_name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="form-group full-span">
                  <label>טלפון ליצירת קשר<span className="required-star">*</span></label>
                  <Input value={formData.contact_phone} onChange={e => handleChange('contact_phone', e.target.value)}/>
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h4>מוצא ויעד</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label>כתובת מוצא<span className="required-star">*</span></label>
                  <Input value={formData.origin_address} onChange={e => handleChange('origin_address', e.target.value)}/>
                </div>
                <div className="form-group">
                  <label>עיר מוצא<span className="required-star">*</span></label>
                  <Input value={formData.origin_city} onChange={e => handleChange('origin_city', e.target.value)}/>
                </div>
                <div className="form-group">
                  <label>כתובת יעד<span className="required-star">*</span></label>
                  <Input value={formData.destination_address} onChange={e => handleChange('destination_address', e.target.value)}/>
                </div>
                <div className="form-group">
                  <label>עיר יעד<span className="required-star">*</span></label>
                  <Input value={formData.destination_city} onChange={e => handleChange('destination_city', e.target.value)}/>
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h4>פרטים נוספים</h4>
              <div className="form-group">
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <label>נסיעה מיידית</label>
                  <Switch checked={formData.is_immediate} onCheckedChange={checked => handleChange('is_immediate', checked)}/>
                </div>
              </div>
              <div className="form-group">
                <label>סכום לתשלום<span className="required-star">*</span></label>
                <div className="input-with-icon">
                  <Input type="number" value={formData.price} onChange={e => handleChange('price', e.target.value)}/>
                  <CircleDollarSign size={16} className="icon-override"/>
                </div>
              </div>
              <div className="form-group">
                <label>הערות</label>
                <div className="input-with-icon">
                  <Textarea value={formData.notes} onChange={e => handleChange('notes', e.target.value)}/>
                  <Pencil size={16} className="icon-override"/>
                </div>
              </div>
            </div>
        </div>
        <footer className="modal-footer">
          <button type="submit" className="btn-submit-accent" disabled={updateTenderMutation.isPending}>
            {updateTenderMutation.isPending ? 'מעדכן...' : 'עדכון מכרז'}
          </button>
        </footer>
      </form>
    </>
  );
}