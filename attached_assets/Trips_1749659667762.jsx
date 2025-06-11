import React from 'react';
import { Pencil, CalendarDays, Image, ChevronDown } from 'lucide-react';
import TopActionsBar from '../Components/common/TopActionsBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';


export default function Trips() {
    return (
        <div className="p-8 bg-gray-50 min-h-screen">
             <style>{`
                .settings-page h2 { font-weight: 500; margin-bottom: 1rem; font-size: 1.8rem; color: #374151;}
                .tabs-nav { border-bottom: 1px solid #e5e7eb; margin-bottom: 2rem; }
                .tabs-nav a { display: inline-block; padding: 0.75rem 0; margin-left: 2rem; text-decoration: none; color: #6b7280; font-weight: 500; }
                .tabs-nav a.active { color: #111827; border-bottom: 3px solid #facc15; }

                .settings-card { background-color: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 2rem; margin-bottom: 2rem; }
                .settings-card h3 { font-weight: 500; font-size: 1.125rem; margin-top: 0; margin-bottom: 1.5rem; color: #1f2937; }
                .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem 2rem; }
                .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
                .form-group label { font-size: 0.9rem; color: #4b5563; }
                .label-info { font-size: 0.8rem; }
                .input-with-icon { position: relative; }
                .input-with-icon .icon-override { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #9ca3af; pointer-events: none; }
                
                .settings-page input, .settings-page select { 
                    background-color: #f9fafb !important; 
                    border: 1px solid #d1d5db !important; 
                    border-radius: 8px !important; 
                    padding: 0.7rem !important; 
                    font-family: 'Heebo', sans-serif !important; 
                    width: 100% !important; 
                    box-sizing: border-box !important; 
                    height: auto !important;
                }
                .settings-page input[disabled] { background-color: #e9ecef !important; cursor: not-allowed !important; }

                .card-actions { margin-top: 2rem; display: flex; justify-content: flex-end; gap: 1rem; }
                .btn-action { 
                    background-color: #fcd34d; 
                    border: none; 
                    padding: 0.7rem 1.5rem; 
                    font-weight: 700; 
                    border-radius: 8px;
                    color: #1f2937;
                    cursor: pointer;
                }
                .btn-action-secondary { 
                    background-color: #fef3c7; 
                    border: 1px solid #fde68a; 
                    padding: 0.7rem 1.5rem; 
                    font-weight: 700; 
                    border-radius: 8px;
                    color: #1f2937;
                    cursor: pointer;
                }
                .checkbox-group { margin-top: 1rem; display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; }

                .toggle-switch-label { display: flex; align-items: center; justify-content: space-between; gap: 2rem; }
                .toggle-info { font-size: 0.9rem; color: #6b7280; line-height: 1.5; }

                .form-grid-complex { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; align-items: flex-start; }
                .form-inputs { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem 2rem; }
                .image-uploader { display: flex; flex-direction:column; align-items: center; justify-content: center; border: 2px dashed #d1d5db; border-radius: 8px; background-color: #f9fafb; height: 100%; min-height: 150px; cursor: pointer; }
                .image-uploader .icon-img { font-size: 3rem; color: #d1d5db; }
             `}</style>
             <TopActionsBar />
            <section className="settings-page">
                <h2>הגדרות</h2>
                <nav className="tabs-nav">
                    <a href="#" className="active">הגדרות העסק</a>
                </nav>

                <div className="settings-card">
                    <h3>פרטי מנהל תחנה</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>שם פרטי</label>
                            <div className="input-with-icon"><Input type="text" /><Pencil size={16} className="icon-override" /></div>
                        </div>
                        <div className="form-group">
                            <label>שם משפחה</label>
                            <div className="input-with-icon"><Input type="text" /><Pencil size={16} className="icon-override" /></div>
                        </div>
                        <div className="form-group">
                            <label>מספר זהות</label>
                            <div className="input-with-icon"><Input type="text" /><Pencil size={16} className="icon-override" /></div>
                        </div>
                         <div className="form-group">
                            <label>תאריך לידה</label>
                            <div className="input-with-icon"><Input type="text" /><Pencil size={16} className="icon-override" /></div>
                        </div>
                         <div className="form-group">
                            <label>טלפון ליצירת קשר</label>
                            <div className="input-with-icon"><Input type="text" /><Pencil size={16} className="icon-override" /></div>
                        </div>
                         <div className="form-group">
                            <label>שם משתמש</label>
                            <div className="input-with-icon"><Input type="text" /><Pencil size={16} className="icon-override" /></div>
                        </div>
                        <div className="form-group date-field">
                            <label>תאריך הצטרפות למערכת: 01.01.2026</label>
                            <div className="input-with-icon"><Input type="text" disabled /><CalendarDays size={16} className="icon-override" /></div>
                        </div>
                    </div>
                    <div className="card-actions">
                        <button className="btn-action">עדכן פרטים</button>
                    </div>
                </div>

                <div className="settings-card">
                    <h3>עדכון סיסמת כניסה</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>סיסמה נוכחית</label>
                            <div className="input-with-icon"><Input type="password" /><Pencil size={16} className="icon-override" /></div>
                        </div>
                         <div className="form-group">
                            <label>סיסמה חדשה <span className="label-info">8-16 תווים</span></label>
                            <div className="input-with-icon"><Input type="password" /><Pencil size={16} className="icon-override" /></div>
                        </div>
                         <div className="form-group">
                            <label>אישור סיסמה <span className="label-info">8-16 תווים, זהים לסיסמה החדשה</span></label>
                            <div className="input-with-icon"><Input type="password" /><Pencil size={16} className="icon-override" /></div>
                        </div>
                    </div>
                     <div className="checkbox-group">
                        <Checkbox id="forgot-password" />
                        <label htmlFor="forgot-password">שכחתי סיסמה</label>
                    </div>
                    <div className="card-actions">
                        <button className="btn-action">שלחו לי קישור להתחברות</button>
                        <button className="btn-action">עדכן סיסמה</button>
                    </div>
                </div>

                <div className="settings-card">
                    <h3>אימות דו שלבי בכניסה לחשבון</h3>
                     <label className="toggle-switch-label">
                        <span className="toggle-info">אימות דו שלבי, מגביר את אבטחת החשבון שלך. כשהאימות מופעל, תתבקש להזין סיסמה וגם קוד אימות שישלח אליך</span>
                        <Switch />
                    </label>
                </div>
                
                <div className="settings-card">
                    <h3>פרטי תחנה</h3>
                     <div className="form-grid-complex">
                         <div className="form-inputs">
                            <div className="form-group"><label>שם התחנה</label><div className="input-with-icon"><Input type="text" /><Pencil size={16} className="icon-override" /></div></div>
                            <div className="form-group"><label>ח.פ / ת.ז</label><div className="input-with-icon"><Input type="text" /><Pencil size={16} className="icon-override" /></div></div>
                            <div className="form-group"><label>תאור</label><div className="input-with-icon"><Input type="text" /><Pencil size={16} className="icon-override" /></div></div>
                            <div className="form-group"><label>מיקום</label><div className="input-with-icon"><Input type="text" /><Pencil size={16} className="icon-override" /></div></div>
                         </div>
                         <div className="form-group uploader-group">
                             <label>לוגו החברה</label>
                             <div className="image-uploader">
                                 <Image size={48} className="icon-img" />
                             </div>
                         </div>
                     </div>
                     <div className="card-actions">
                         <button className="btn-action">עדכן פרטים</button>
                     </div>
                </div>

                <div className="settings-card">
                    <h3>שליחת דוחות</h3>
                     <div className="form-grid">
                        <div className="form-group">
                            <label>בחירת ערוץ</label>
                            <Select><SelectTrigger><SelectValue/></SelectTrigger></Select>
                        </div>
                        <div className="form-group">
                            <label>תאריך לשליחת דוח חודשי</label>
                            <div className="input-with-icon">
                                <Input type="text" defaultValue="15/06/2023" />
                                <CalendarDays size={16} className="icon-override" />
                            </div>
                        </div>
                     </div>
                     <div className="card-actions">
                         <button className="btn-action-secondary">הוספת ערוץ לשליחה</button>
                         <button className="btn-action">אישור</button>
                     </div>
                </div>
            </section>
        </div>
    );
}