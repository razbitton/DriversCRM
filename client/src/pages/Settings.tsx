import React from 'react';
import { Pencil, CalendarDays, Image } from 'lucide-react';
import TopActionsBar from '@/components/common/TopActionsBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';

export default function Settings() {
    return (
        <div className="page-container">
            <TopActionsBar />
            <section className="settings-page">
                <h2>הגדרות</h2>
                <nav className="tab-navigation">
                    <a href="#" className="tab-link active">הגדרות העסק</a>
                </nav>

                <div className="settings-card">
                    <h3>פרטי מנהל תחנה</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>שם פרטי</label>
                            <div className="input-with-icon">
                                <Input type="text" />
                                <Pencil size={16} className="icon-override" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>שם משפחה</label>
                            <div className="input-with-icon">
                                <Input type="text" />
                                <Pencil size={16} className="icon-override" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>מספר זהות</label>
                            <div className="input-with-icon">
                                <Input type="text" />
                                <Pencil size={16} className="icon-override" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>תאריך לידה</label>
                            <div className="input-with-icon">
                                <Input type="text" />
                                <Pencil size={16} className="icon-override" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>טלפון ליצירת קשר</label>
                            <div className="input-with-icon">
                                <Input type="text" />
                                <Pencil size={16} className="icon-override" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>שם משתמש</label>
                            <div className="input-with-icon">
                                <Input type="text" />
                                <Pencil size={16} className="icon-override" />
                            </div>
                        </div>
                        <div className="form-group date-field">
                            <label>תאריך הצטרפות למערכת: 01.01.2026</label>
                            <div className="input-with-icon">
                                <Input type="text" disabled />
                                <CalendarDays size={16} className="icon-override" />
                            </div>
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
                            <div className="input-with-icon">
                                <Input type="password" />
                                <Pencil size={16} className="icon-override" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>סיסמה חדשה <span className="label-info">8-16 תווים</span></label>
                            <div className="input-with-icon">
                                <Input type="password" />
                                <Pencil size={16} className="icon-override" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>אישור סיסמה <span className="label-info">8-16 תווים, זהים לסיסמה החדשה</span></label>
                            <div className="input-with-icon">
                                <Input type="password" />
                                <Pencil size={16} className="icon-override" />
                            </div>
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
                            <div className="form-group">
                                <label>שם התחנה</label>
                                <div className="input-with-icon">
                                    <Input type="text" />
                                    <Pencil size={16} className="icon-override" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>ח.פ / ת.ז</label>
                                <div className="input-with-icon">
                                    <Input type="text" />
                                    <Pencil size={16} className="icon-override" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>תאור</label>
                                <div className="input-with-icon">
                                    <Input type="text" />
                                    <Pencil size={16} className="icon-override" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>מיקום</label>
                                <div className="input-with-icon">
                                    <Input type="text" />
                                    <Pencil size={16} className="icon-override" />
                                </div>
                            </div>
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
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="בחר ערוץ" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="email">אימייל</SelectItem>
                                    <SelectItem value="sms">SMS</SelectItem>
                                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                </SelectContent>
                            </Select>
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
