import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { User, Star, MessageSquare } from 'lucide-react';
import DriverDetailsForm from './DriverDetailsForm';
import DriverPaymentsTab from './DriverPaymentsTab';
import DriverReportsTab from './DriverReportsTab';

export default function DriverDetailsModal({ isOpen, onClose, driver, initialTab }: any) {
    const [activeTab, setActiveTab] = useState('details');

    useEffect(() => {
        if (initialTab) {
            setActiveTab(initialTab);
        }
    }, [initialTab]);

    if (!driver) return null;

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
                    .modal-content-custom { background-color: var(--modal-bg); border-radius: 16px; width: 100%; max-height: 95vh; display: flex; flex-direction: column; }
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
                    .icon-btn-custom { background-color: var(--accent-color); border: 1px solid var(--accent-border); color: var(--text-dark); width: 40px; height: 40px; border-radius: 8px; cursor: pointer; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; }
                    .tabs-nav { display: flex; justify-content: flex-end; border-bottom: 1px solid var(--border-color); margin-bottom: 1.5rem; }
                    .tab-link { padding: 0.75rem 1.5rem; text-decoration: none; color: var(--text-muted); font-weight: 500; position: relative; top: 1px; background: none; border: none; cursor: pointer; }
                    .tab-link.active { color: var(--text-dark); border-bottom: 3px solid var(--accent-strong); }
                    .form-section { margin-bottom: 2rem; }
                    .form-section h5 { font-weight: 500; margin: 0 0 1.5rem 0; }
                    .required { color: var(--red-status); }
                    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem 1.5rem; }
                    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
                    .form-group.full-span { grid-column: 1 / -1; }
                    .form-group label { font-size: 0.9rem; color: var(--text-muted); }
                    .input-with-icon { position: relative; }
                    .input-with-icon .icon-override { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
                    .form-section input, .form-section textarea { background-color: var(--primary-bg); border: 1px solid var(--border-color); border-radius: 6px; padding: 0.75rem; width: 100%; box-sizing: border-box; }
                    .form-section textarea { resize: vertical; min-height: 50px; }
                    .btn-add-field-icon { background-color: var(--primary-bg); border: 1px solid var(--border-color); border-radius: 6px; padding: 0.75rem; cursor: pointer; color: var(--text-muted); width: 100%; display: flex; justify-content: center; align-items: center; height: 44px; }
                `}</style>
                <div className="modal-content-custom">
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
                                    <button className="icon-btn-custom"><MessageSquare size={18} /></button>
                                </div>
                            </div>
                        </section>
                        
                        <nav className="tabs-nav">
                            <button onClick={() => setActiveTab('reports')} className={`tab-link ${activeTab === 'reports' ? 'active' : ''}`}>דוחות ופעולות</button>
                            <button onClick={() => setActiveTab('payments')} className={`tab-link ${activeTab === 'payments' ? 'active' : ''}`}>תשלומים</button>
                            <button onClick={() => setActiveTab('details')} className={`tab-link ${activeTab === 'details' ? 'active' : ''}`}>פרטים נוספים</button>
                        </nav>

                        <div className="tab-content">
                            {activeTab === 'details' && <DriverDetailsForm driver={driver} />}
                            {activeTab === 'payments' && <DriverPaymentsTab driver={driver} />}
                            {activeTab === 'reports' && <DriverReportsTab driver={driver} />}
                        </div>
                    </main>
                </div>
            </DialogContent>
        </Dialog>
    );
}