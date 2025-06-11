import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Plus } from 'lucide-react';
import type { Driver } from '@shared/schema';

interface DriverDetailsFormProps {
  driver: Driver;
}

export default function DriverDetailsForm({ driver }: DriverDetailsFormProps) {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        address: '',
        city: '',
        phone: '',
        additional_phone: '',
        email: '',
        notes: '',
        vehicle_condition: '',
        vehicle_seats: '',
        vehicle_type: ''
    });

    useEffect(() => {
        if (driver) {
            const [firstName, ...lastNameParts] = driver.full_name.split(' ');
            setFormData({
                first_name: firstName || '',
                last_name: lastNameParts.join(' ') || '',
                address: driver.address || '',
                city: driver.residence_area || '',
                phone: driver.phone || '',
                additional_phone: driver.additional_phone || '',
                email: driver.email || '',
                notes: '',
                vehicle_condition: driver.vehicle_condition || '',
                vehicle_seats: driver.vehicle_seats || '',
                vehicle_type: driver.vehicle_type || ''
            });
        }
    }, [driver]);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (!driver) return null;

    return (
        <form className="driver-form">
            <style>{`
                .driver-form {
                    padding: 1.5rem 0;
                }
                .form-section {
                    margin-bottom: 2rem;
                }
                .form-section h5 {
                    font-weight: 500;
                    margin: 0 0 1.5rem 0;
                    font-size: 1rem;
                    color: #212529;
                }
                .required {
                    color: #dc3545;
                }
                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem 1.5rem;
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .form-group label {
                    font-size: 0.9rem;
                    color: #6c757d;
                }
                .input-with-icon {
                    position: relative;
                }
                .icon-override {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #6c757d;
                    pointer-events: none;
                }
                .driver-form input, .driver-form textarea {
                    background-color: #f8f9fa;
                    border: 1px solid #e9ecef;
                    border-radius: 6px;
                    padding: 0.75rem;
                    width: 100%;
                    box-sizing: border-box;
                    padding-left: 40px;
                }
                .input-add-field {
                    background-color: #f8f9fa;
                    border: 1px solid #e9ecef;
                    border-radius: 6px;
                    padding: 0.75rem;
                    cursor: pointer;
                    color: #6c757d;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                }
            `}</style>
            
            <section className="form-section">
                <h5>פרטים אישיים <span className="required">*</span></h5>
                <div className="form-grid">
                    <div className="form-group">
                        <label>שם פרטי <span className="required">*</span></label>
                        <div className="input-with-icon">
                            <Input 
                                value={formData.first_name} 
                                onChange={e => handleChange('first_name', e.target.value)} 
                            />
                            <Pencil size={14} className="icon-override" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>שם משפחה <span className="required">*</span></label>
                        <div className="input-with-icon">
                            <Input 
                                value={formData.last_name} 
                                onChange={e => handleChange('last_name', e.target.value)} 
                            />
                            <Pencil size={14} className="icon-override" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>כתובת <span className="required">*</span></label>
                        <div className="input-with-icon">
                            <Input 
                                value={formData.address} 
                                onChange={e => handleChange('address', e.target.value)} 
                            />
                            <Pencil size={14} className="icon-override" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>עיר</label>
                        <div className="input-with-icon">
                            <Input 
                                value={formData.city} 
                                onChange={e => handleChange('city', e.target.value)} 
                            />
                            <Pencil size={14} className="icon-override" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>טלפון <span className="required">*</span></label>
                        <div className="input-with-icon">
                            <Input 
                                value={formData.phone} 
                                onChange={e => handleChange('phone', e.target.value)} 
                            />
                            <Pencil size={14} className="icon-override" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>טלפון נוסף <span className="required">*</span></label>
                        <div className="input-with-icon">
                            <Input 
                                value={formData.additional_phone} 
                                onChange={e => handleChange('additional_phone', e.target.value)} 
                            />
                            <Pencil size={14} className="icon-override" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>כתובת מייל</label>
                        <div className="input-with-icon">
                            <Input 
                                type="email" 
                                value={formData.email} 
                                onChange={e => handleChange('email', e.target.value)} 
                            />
                            <Pencil size={14} className="icon-override" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>שדה חדש</label>
                        <div className="input-add-field">
                            <Plus size={16} />
                        </div>
                    </div>
                </div>
            </section>

            <section className="form-section">
                <h5>פרטי רכב</h5>
                <div className="form-grid">
                    <div className="form-group">
                        <label>סוג רכב</label>
                        <div className="input-with-icon">
                            <Input 
                                value={formData.vehicle_type} 
                                onChange={e => handleChange('vehicle_type', e.target.value)} 
                            />
                            <Pencil size={14} className="icon-override" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>מספר מקומות</label>
                        <div className="input-with-icon">
                            <Input 
                                value={formData.vehicle_seats} 
                                onChange={e => handleChange('vehicle_seats', e.target.value)} 
                            />
                            <Pencil size={14} className="icon-override" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>מצב הרכב</label>
                        <div className="input-with-icon">
                            <Input 
                                value={formData.vehicle_condition} 
                                onChange={e => handleChange('vehicle_condition', e.target.value)} 
                            />
                            <Pencil size={14} className="icon-override" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>שדה חדש</label>
                        <div className="input-add-field">
                            <Plus size={16} />
                        </div>
                    </div>
                </div>
            </section>

            <section className="form-section">
                <h5>הערות</h5>
                <div className="form-group">
                    <label>הערות כלליות</label>
                    <div className="input-with-icon">
                        <Textarea 
                            value={formData.notes} 
                            onChange={e => handleChange('notes', e.target.value)}
                            rows={4}
                        />
                        <Pencil size={14} className="icon-override" />
                    </div>
                </div>
            </section>
        </form>
    );
}