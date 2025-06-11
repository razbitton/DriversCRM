import React, { useState } from 'react';
import {
    RefreshCw, CreditCard, UserCog, PlusCircle, Home, Users, Building2, Megaphone
} from 'lucide-react';
import TopActionsBar from '../components/common/TopActionsBar';
import { Button } from '@/components/ui/button';
import BillingSettings from '../components/settings/BillingSettings';
import DispatcherSettings from '../components/settings/DispatcherSettings';
import ChannelSettings from '../components/settings/ChannelSettings';

const settingsNavItems = [
    {
        group: 'מנהל התחנה',
        items: [
            { id: 'shortcuts', label: 'קיצורים', icon: RefreshCw },
            { id: 'billing', label: 'הגדרת חיוב', icon: CreditCard },
            { id: 'dispatchers', label: 'מוקדנים', icon: UserCog },
            { id: 'channels', label: 'ערוצים', icon: PlusCircle },
        ]
    }
];

const shortcutsData = [
    { icon: Megaphone, label: 'כל המכרזים', keys: ['Ctrl', 'A'] },
    { icon: Users, label: 'נהגים', keys: ['Ctrl', 'B'] },
    { icon: CreditCard, label: 'תשלומים', keys: ['Ctrl', 'C'] },
    { icon: Home, label: 'נסיעות', keys: ['Ctrl', 'D'] },
    { icon: PlusCircle, label: 'לקוחות', keys: ['Ctrl', 'E'] },
    { icon: Building2, label: 'מחירון כללי', keys: ['Ctrl', 'F'] },
];

const SettingsContent = ({ activeView }) => {
    if (activeView === 'shortcuts') {
        return (
            <div className="settings-content">
                <h3>קיצורים נפוצים</h3>
                <div className="shortcuts-list">
                    {shortcutsData.map((shortcut, index) => (
                        <div key={index} className="shortcut-item">
                            <shortcut.icon className="text-gray-500" size={20} />
                            <span>{shortcut.label}</span>
                            <div className="shortcut-keys">
                                {shortcut.keys.map(key => <kbd key={key}>{key}</kbd>)}
                            </div>
                        </div>
                    ))}
                </div>
                <Button className="btn-create-shortcut">יצירת קיצור חדש</Button>
            </div>
        );
    }
    if (activeView === 'billing') {
        return (
            <div className="settings-content">
                <BillingSettings />
            </div>
        );
    }
    if (activeView === 'dispatchers') {
        return (
            <div className="settings-content">
                <DispatcherSettings />
            </div>
        );
    }
    if (activeView === 'channels') {
        return (
            <div className="settings-content">
                <ChannelSettings />
            </div>
        );
    }
    // Placeholder for other views
    return <div className="settings-content"><p>תוכן עבור {activeView}</p></div>;
};

export default function Settings() {
    const [activeView, setActiveView] = useState('shortcuts');

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <style>{`
                .settings-page h2 { font-weight: 500; font-size: 1.8rem; margin-bottom: 1.5rem; color: #374151; }
                .settings-layout { display: flex; gap: 2rem; align-items: flex-start; }
                .settings-nav {
                    flex: 0 0 250px;
                    background-color: #fff;
                    border-radius: 8px;
                    padding: 1.5rem 1rem;
                    border: 1px solid #e9ecef;
                }
                .nav-group { margin-bottom: 1.5rem; }
                .nav-group:last-child { margin-bottom: 0; }
                .nav-group h5 { font-weight: 500; margin: 0 0 1rem 0; padding-right: 0.5rem; color: #344054; }
                .settings-nav ul { list-style: none; padding: 0; margin: 0; }
                .settings-nav button {
                    display: flex;
                    width: 100%;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1rem;
                    border-radius: 6px;
                    text-decoration: none;
                    color: #6b7280;
                    font-weight: 500;
                    transition: background-color 0.2s;
                    background: none;
                    border: none;
                    text-align: right;
                    cursor: pointer;
                }
                .settings-nav button:hover { background-color: #f9fafb; }
                .settings-nav button.active { background-color: #f9fafb; color: #1f2937; }
                .settings-nav button .icon { width: 20px; text-align: center; }
                .settings-content { flex: 1; }
                .settings-content h3 { font-weight: 500; margin-top: 0; margin-bottom: 1.5rem; color: #1f2937; }
                .shortcuts-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }
                .shortcut-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    background-color: #fff;
                    border: 1px solid #e9ecef;
                    border-radius: 8px;
                    padding: 0.75rem 1.5rem;
                }
                .shortcut-item span { margin-left: auto; font-weight: 500; }
                .shortcut-keys { display: flex; gap: 0.5rem; }
                .shortcut-keys kbd {
                    background-color: #f9fafb;
                    border: 1px solid #d1d5db;
                    border-radius: 4px;
                    padding: 0.2rem 0.6rem;
                    font-family: monospace;
                    font-size: 0.85rem;
                    color: #6b7280;
                }
                .btn-create-shortcut {
                    background-color: #fef8e7;
                    border: 1px solid #f0dca4;
                    color: #1f2937;
                    font-weight: 700;
                    padding: 0.7rem 1.5rem;
                }
                .btn-create-shortcut:hover {
                    background-color: #fff3cd;
                }
            `}</style>
            <TopActionsBar />
            <section className="settings-page">
                <h2>הגדרות</h2>
                <div className="settings-layout">
                    <nav className="settings-nav">
                        {settingsNavItems.map(group => (
                            <div key={group.group} className="nav-group">
                                <h5>{group.group}</h5>
                                <ul>
                                    {group.items.map(item => (
                                        <li key={item.id}>
                                            <button 
                                                className={activeView === item.id ? 'active' : ''}
                                                onClick={() => setActiveView(item.id)}
                                            >
                                                <item.icon size={18} className="icon" />
                                                {item.label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
                    <SettingsContent activeView={activeView} />
                </div>
            </section>
        </div>
    );
} 