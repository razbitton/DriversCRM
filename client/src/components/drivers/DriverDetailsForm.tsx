import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Plus } from 'lucide-react';

export default function DriverDetailsForm({ driver }: any) {
    const [formData, setFormData] = useState<any>({});

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
                notes: '', // Notes field to be added
                vehicle_condition: driver.vehicle_condition || '',
                vehicle_seats: driver.vehicle_seats || '',
                vehicle_type: driver.vehicle_type || ''
            });
        }
    }, [driver]);

    const handleChange = (field: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    if (!driver) return null;

    return (
        <div>
            <style>{`
                .driver-form {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                    padding: 1.5rem 0;
                }
                
                .form-section {
                    background-color: #fff;
                    border: 1px solid #e9ecef;
                    border-radius: 8px;
                    padding: 1.5rem;
                }
                
                .form-section h5 {
                    font-weight: 500;
                    margin: 0 0 1.5rem 0;
                    font-size: 1rem;
                    color: #212529;
                }
                
                .form-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1.5rem 2rem;
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
                    color: #6c757d;
                }
                
                .required {
                    color: #dc3545;
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
                
                .driver-form input,
                .driver-form textarea {
                    background-color: #f8f9fa;
                    border: 1px solid #e9ecef;
                    border-radius: 6px;
                    padding: 0.7rem;
                    width: 100%;
                    box-sizing: border-box;
                }
                
                .btn-add-field-icon {
                    background-color: #f8f9fa;
                    border: 1px solid #e9ecef;
                    border-radius: 6px;
                    padding: 0.7rem;
                    cursor: pointer;
                    color: #6c757d;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    min-height: 42px;
                }
                
                .btn-add-field-icon:hover {
                    background-color: #e9ecef;
                }
            `}</style>
            
            <form className="driver-form">
                <section className="form-section">
                    <h5>פרטים אישיים <span className="required">*</span></h5>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>שם פרטי <span className="required">*</span></label>
                            <div className="input-with-icon">
                                <Input value={formData.first_name} onChange={e => handleChange('first_name', e.target.value)} />
                                <Pencil size={14} className="icon-override" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>שם משפחה <span className="required">*</span></label>
                            <div className="input-with-icon">
                                <Input value={formData.last_name} onChange={e => handleChange('last_name', e.target.value)} />
                                <Pencil size={14} className="icon-override" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>כתובת <span className="required">*</span></label>
                            <div className="input-with-icon">
                                <Input value={formData.address} onChange={e => handleChange('address', e.target.value)} />
                                <Pencil size={14} className="icon-override" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>עיר</label>
                            <div className="input-with-icon">
                                <Input value={formData.city} onChange={e => handleChange('city', e.target.value)} />
                                <Pencil size={14} className="icon-override" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>טלפון <span className="required">*</span></label>
                            <div className="input-with-icon">
                                <Input value={formData.phone} onChange={e => handleChange('phone', e.target.value)} />
                                <Pencil size={14} className="icon-override" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>טלפון נוסף <span className="required">*</span></label>
                            <div className="input-with-icon">
                                <Input value={formData.additional_phone} onChange={e => handleChange('additional_phone', e.target.value)} />
                                <Pencil size={14} className="icon-override" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>כתובת מייל</label>
                            <div className="input-with-icon">
                                <Input type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)} />
                                <Pencil size={14} className="icon-override" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>שדה חדש</label>
                            <button type="button" className="btn-add-field-icon"><Plus size={16} /></button>
                        </div>
                        <div className="form-group full-span">
                            <label>הערות</label>
                            <div className="input-with-icon">
                                <Textarea value={formData.notes} onChange={e => handleChange('notes', e.target.value)} />
                                <Pencil size={14} className="icon-override" />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="form-section">
                    <h5>פרטי רכב</h5>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>מצב</label>
                            <div className="input-with-icon">
                                <Input value={formData.vehicle_condition} onChange={e => handleChange('vehicle_condition', e.target.value)} />
                                <Pencil size={14} className="icon-override" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>מספר מקומות</label>
                            <div className="input-with-icon">
                                <Input type="number" value={formData.vehicle_seats} onChange={e => handleChange('vehicle_seats', e.target.value)} />
                                <Pencil size={14} className="icon-override" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>סוג רכב</label>
                            <div className="input-with-icon">
                                <Input value={formData.vehicle_type} onChange={e => handleChange('vehicle_type', e.target.value)} />
                                <Pencil size={14} className="icon-override" />
                            </div>
                        </div>
                         <div className="form-group">
                            <label>שדה חדש</label>
                            <div className="input-with-icon">
                                 <Input type="text" />
                                 <Pencil size={14} className="icon-override" />
                            </div>
                        </div>
                    </div>
                </section>
            </form>
        </div>
    );
}