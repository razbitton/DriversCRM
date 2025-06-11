import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { User, Star, MessageSquare, Calendar, Pencil, FileText, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

export default function DriverExportModal({ isOpen, onClose, driver, report }: any) {
    const [showFormatButtons, setShowFormatButtons] = useState(false);

    if (!driver || !report) return null;

    const renderStars = (rating: number) => {
        const totalStars = 5;
        const fullStars = Math.round(rating);
        let stars = [];
        for (let i = 0; i < totalStars; i++) {
            stars.push(
                <Star key={i} size={16} fill={i < fullStars ? '#fdd85d' : '#e5e7eb'} strokeWidth={0} />
            );
        }
        return stars.reverse();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[850px] p-0" dir="rtl">
                <style>{`
                    :root {
                        --primary-bg: #f8f9fa;
                        --modal-bg: #ffffff;
                        --overlay-bg: rgba(0, 0, 0, 0.6);
                        --text-dark: #212529;
                        --text-muted: #6c757d;
                        --accent-color: #fef8e7;
                        --accent-border: #f0dca4;
                        --accent-strong: #fdd85d;
                        --border-color: #e9ecef;
                        --red-status: #dc3545;
                    }
                    .modal-header-custom { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; }
                    .modal-header-custom h3 { margin: 0; font-weight: 500; }
                    .close-btn-custom { background: none; border: none; font-size: 2rem; color: var(--text-muted); cursor: pointer; }
                    .modal-body-custom { padding: 0 2rem 1.5rem 2rem; overflow-y: auto; }
                    .section-container { background-color: var(--modal-bg); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem; margin: 1.5rem 0; }
                    .section-container h4 { margin: 0 0 1rem 0; font-weight: 500; }
                    .driver-profile-header { display: flex; justify-content: space-between; align-items: center; }
                    .driver-info { display: flex; align-items: center; gap: 1rem; }
                    .driver-avatar { width: 60px; height: 60px; border-radius: 50%; background-color: var(--border-color); position: relative; display: flex; align-items: center; justify-content: center; }
                    .driver-avatar::after { content: ''; position: absolute; top: 2px; right: 2px; width: 12px; height: 12px; background-color: ${driver.status === 'active' ? '#22c55e' : 'var(--red-status)'}; border: 2px solid white; border-radius: 50%; }
                    .driver-details h5 { margin: 0; font-size: 1.25rem; font-weight: 500; }
                    .driver-details span { color: var(--text-muted); font-size: 0.9rem; }
                    .driver-actions { display: flex; align-items: center; gap: 1rem; }
                    .rating { color: var(--text-muted); display: flex; align-items: center; gap: 0.2rem; }
                    .rating span { margin-left: 0.5rem; }
                    .icon-btn { background-color: var(--accent-color); border: 1px solid var(--accent-border); color: var(--text-dark); width: 40px; height: 40px; border-radius: 8px; cursor: pointer; font-size: 1.1rem; display:flex; align-items:center; justify-content:center; }
                    
                    .export-form-card { background-color: #fff; border: 1px solid var(--border-color); border-radius: 8px; padding: 2rem; }
                    .date-range-selector { margin-bottom: 2rem; }
                    .date-range-selector h4 { font-weight: 500; text-align: center; margin: 0 0 1.5rem 0; }
                    .date-inputs { display: flex; justify-content: center; gap: 2rem; }
                    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
                    .form-group label { font-size: 0.9rem; color: var(--text-muted); }
                    .input-with-icon { position: relative; }
                    .input-with-icon .icon-override { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
                    .export-form-card input[type="text"], .export-form-card textarea { background-color: var(--primary-bg); border: 1px solid var(--border-color); border-radius: 6px; padding: 0.75rem; font-family: 'Heebo', sans-serif; width: 100%; box-sizing: border-box; }
                    .export-form-card textarea { resize: vertical; min-height: 50px; }

                    .export-options { display: flex; flex-direction: column; gap: 1rem; margin: 2rem 0; }
                    .checkbox-option { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; border-radius: 6px; cursor: pointer; }
                    .checkbox-option.main-option { padding: 0; }
                    .checkbox-option:not(.main-option) { background-color: var(--primary-bg); }
                    .checkbox-option span { font-weight: 500; }
                    
                    .message-group { border-top: 1px solid var(--border-color); padding-top: 2rem; }
                    
                    .form-actions { display: flex; justify-content: flex-start; align-items: center; gap: 1rem; margin-top: 2rem; flex-wrap: wrap; }
                    .btn-action.primary { background-color: var(--accent-strong); color: var(--text-dark); }
                    .btn-action.secondary { background-color: var(--accent-color); color: var(--text-dark); border: 1px solid var(--accent-border); }
                    
                    .export-button-group { display: flex; margin-left: auto; }
                    .export-button-group .btn-action { border-radius: 0 8px 8px 0; }
                    .btn-format { background-color: var(--accent-color); color: var(--text-dark); border: 1px solid var(--accent-border); border-left: none; padding: 0.7rem; font-size: 1.1rem; cursor: pointer; width:44px; height:44px; display:flex; align-items:center; justify-content:center; }
                    .btn-format:first-of-type { border-radius: 8px 0 0 8px; border-left: 1px solid var(--accent-border); border-right:none;}
                `}</style>

                <header className="modal-header-custom">
                    <h3>ערוץ: {driver.channel_id || 'לא משויך'}</h3>
                    <button onClick={onClose} className="close-btn-custom">×</button>
                </header>

                <main className="modal-body-custom">
                    <section className="section-container">
                        <h4>פרטי הנהג</h4>
                        <div className="driver-profile-header">
                            <div className="driver-info">
                                <div className="driver-avatar"><User size={28} color="#94a3b8" /></div>
                                <div className="driver-details">
                                    <h5>{driver.full_name}</h5>
                                    <span>{driver.phone} | {driver.residence_area}</span>
                                </div>
                            </div>
                            <div className="driver-actions">
                                <div className="rating">
                                    <span>({driver.total_trips || 0})</span>
                                    {renderStars(driver.rating || 0)}
                                </div>
                                <button className="icon-btn"><MessageSquare size={18} /></button>
                            </div>
                        </div>
                    </section>
                    
                    <div className="export-form-card">
                        <div className="date-range-selector">
                            <h4>בחר טווח תאריכים:</h4>
                            <div className="date-inputs">
                                <div className="form-group">
                                    <label>תאריך התחלה:</label>
                                    <div className="input-with-icon">
                                        <Input type="text" defaultValue="15/06/2023" />
                                        <Calendar size={16} className="icon-override" />
                                    </div>
                                </div>
                                 <div className="form-group">
                                    <label>תאריך סיום:</label>
                                    <div className="input-with-icon">
                                        <Input type="text" defaultValue="31/12/2023" />
                                        <Calendar size={16} className="icon-override" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="export-options">
                            <label className="checkbox-option main-option"><Checkbox /><span>ייצוא דוחות ללא בחירת תאריך</span></label>
                            <label className="checkbox-option"><Checkbox /><span>פירוט נסיעות שלקח</span></label>
                            <label className="checkbox-option"><Checkbox /><span>פירוט נסיעות שהביא</span></label>
                            <label className="checkbox-option"><Checkbox /><span>פירוט פעולות (מקוצר)</span></label>
                            <label className="checkbox-option"><Checkbox /><span>פירוט פעולות (מורחב)</span></label>
                        </div>

                        <div className="form-group message-group">
                            <label>הודעה לנהג</label>
                            <div className="input-with-icon">
                                <Textarea />
                                <Pencil size={14} className="icon-override" style={{top: '16px'}}/>
                            </div>
                        </div>
                        
                        <div className="form-actions">
                            <Button className="btn-action primary">שליחה</Button>
                            <Button className="btn-action secondary">הדפסה</Button>
                            <div className="export-button-group">
                                <Button className="btn-action secondary" onClick={() => setShowFormatButtons(true)}>ייצוא</Button>
                                {showFormatButtons && (
                                    <>
                                        <button className="btn-format"><FileSpreadsheet size={18} /></button>
                                        <button className="btn-format"><FileText size={18} /></button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </DialogContent>
        </Dialog>
    );
}