
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  MapPin,
  BarChart3,
  Users,
  CreditCard,
  Car,
  Star,
  FileText,
  Megaphone,
  Settings,
  LogOut,
  User,
  ChevronDown 
} from "lucide-react";

const navigationItems = [
  {
    title: "כל המכרזים",
    url: createPageUrl("Tenders"),
    icon: Megaphone,
  },
  {
    title: "נהגים",
    url: createPageUrl("Drivers"),
    icon: Users,
  },
  {
    title: "דוחות",
    url: createPageUrl("Dashboard"),
    icon: BarChart3,
    submenu: [
      {
        title: "דוח נהגים",
        url: createPageUrl("DriverReport"),
      },
      {
        title: "דוח כללי", // Changed from "דוח כללי נתונים" to "דוח כללי"
        url: createPageUrl("GeneralReport"),
      },
      {
        title: "דוח מותאם אישי",
        url: createPageUrl("CustomReport"),
      }
    ]
  },
  {
    title: "תשלומים",
    url: createPageUrl("Payments"),
    icon: CreditCard,
  },
  {
    title: "נסיעות",
    url: createPageUrl("Trips"),
    icon: Car,
  },
  {
    title: "לקוחות",
    url: createPageUrl("Clients"),
    icon: Star,
  },
  {
    title: "מחירון כללי",
    url: createPageUrl("Pricing"),
    icon: FileText,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState(new Set());

  const toggleSubmenu = (title) => {
    const newExpanded = new Set(expandedMenus);
    if (newExpanded.has(title)) {
      newExpanded.delete(title);
    } else {
      newExpanded.add(title);
    }
    setExpandedMenus(newExpanded);
  };

  // Auto-expand reports menu if on reports page
  useEffect(() => {
    const reportPages = ["Dashboard", "DriverReport", "GeneralReport", "CustomReport"]; // Added Dashboard
    if (reportPages.includes(currentPageName)) {
      setExpandedMenus(prev => new Set([...prev, "דוחות"]));
    }
  }, [currentPageName]); 

  return (
    <div style={{ fontFamily: "'Heebo', sans-serif" }} dir="rtl">
      <style>{`
        :root {
          --sidebar-bg: #2b3035;
          --main-bg: #f4f6f9;
          --card-yellow-bg: #f9d871;
          --text-dark: #333;
          --text-light: #e9ecef;
          --text-muted: #6c757d;
          --border-color: #dee2e6;
        }

        * {
          box-sizing: border-box;
        }

        body {
          background-color: var(--main-bg);
          margin: 0;
          padding: 0;
          direction: rtl;
        }

        .dashboard-container {
          display: flex;
          min-height: 100vh;
        }

        .sidebar {
          width: 260px;
          background-color: var(--sidebar-bg);
          color: var(--text-light);
          display: flex;
          flex-direction: column;
          padding: 20px;
          position: sticky;
          top: 0;
          height: 100vh;
        }

        .sidebar-header {
          margin-bottom: 30px;
        }

        .logo-text {
          font-size: 24px;
          font-weight: 800;
          text-align: right;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .logo-icon {
          color: var(--card-yellow-bg);
        }

        /* Added style for the new logo link */
        .logo-link {
          text-decoration: none;
          color: inherit; /* Ensure the text color is inherited from .sidebar-header */
        }


        .sidebar-nav {
          flex: 1;
        }

        .sidebar-nav ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .sidebar-nav li {
          margin-bottom: 10px;
          position: relative;
        }

        .sidebar-nav a {
          text-decoration: none;
          color: var(--text-light);
          display: flex;
          align-items: center;
          padding: 12px 15px;
          border-radius: 8px;
          transition: background-color 0.3s;
          font-size: 16px;
          gap: 15px;
        }

        .sidebar-nav a:hover,
        .sidebar-nav .active > a { 
          background-color: rgba(255, 255, 255, 0.1);
        }

        .nav-arrow {
          margin-right: auto;
          font-size: 18px;
        }

        .sidebar-footer {
          margin-top: auto;
          text-align: center;
        }

        .user-profile {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 20px;
        }

        .user-logo {
          width: 80px;
          height: 80px;
          background-color: #fff;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #000;
          font-weight: bold;
          margin-bottom: 10px;
          font-size: 14px;
        }

        .user-name {
          font-weight: 700;
          font-size: 16px;
          margin-bottom: 2px;
        }

        .user-id {
          font-size: 12px;
          color: var(--text-muted);
        }

        .footer-actions {
          display: flex;
          justify-content: center;
          gap: 10px;
        }

        .btn-footer {
          background-color: #495057;
          color: #fff;
          border: none;
          padding: 8px 15px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          text-decoration: none; /* Add this for Link component */
        }

        .main-content {
          flex: 1;
          overflow-y: auto;
        }

        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            left: -260px;
            transition: left 0.3s;
            z-index: 1000;
          }

          .sidebar.open {
            left: 0;
          }

          .main-content {
            margin-right: 0;
          }
        }

        /* New styles for submenu */
        .submenu {
          list-style: none;
          margin: 0;
          padding: 0;
          margin-right: 2rem; 
          margin-top: 0.5rem;
        }

        .submenu a {
          font-size: 0.9rem;
          padding: 0.5rem 1rem;
          color: #adb5bd; 
          display: block;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .submenu .active a {
          color: #fff;
          background-color: rgba(255, 255, 255, 0.1);
          font-weight: 600;
        }

        .menu-arrow {
          margin-right: auto;
          transition: transform 0.2s;
        }

        .menu-arrow.expanded {
          transform: rotate(180deg);
        }
      `}</style>

      <div className="dashboard-container">
        <aside className="sidebar">
          <div className="sidebar-header">
            <Link to={createPageUrl("Dashboard")} className="logo-link"> {/* Added Link component here */}
              <h1 className="logo-text">
                <MapPin className="logo-icon" size={24} />
                דרייביט
              </h1>
            </Link>
          </div>

          <nav className="sidebar-nav">
            <ul>
              {navigationItems.map((item) => {
                const isMenuItemActive = item.submenu
                  ? item.submenu.some(subItem => location.pathname === subItem.url)
                  : location.pathname === item.url;

                const reportPages = ["Dashboard", "DriverReport", "GeneralReport", "CustomReport"]; // Added Dashboard
                const isReportsMenuItemActive = item.title === "דוחות" && reportPages.includes(currentPageName);

                const isActive = isMenuItemActive || isReportsMenuItemActive;
                const isExpanded = expandedMenus.has(item.title);

                return (
                  <li key={item.title} className={isActive ? "active" : ""}>
                    <Link
                      to={item.url}
                      onClick={item.submenu ? () => { // Removed e.preventDefault()
                        toggleSubmenu(item.title);
                      } : undefined}
                    >
                      <item.icon size={18} />
                      {item.title}
                      {item.submenu && (
                        <ChevronDown
                          size={14}
                          className={`menu-arrow ${isExpanded ? 'expanded' : ''}`}
                        />
                      )}
                      {isActive && !item.submenu && <span className="nav-arrow">‹</span>}
                    </Link>

                    {item.submenu && isExpanded && (
                      <ul className="submenu">
                        {item.submenu.map((subItem) => {
                          const isSubActive = location.pathname === subItem.url;
                          return (
                            <li key={subItem.title} className={isSubActive ? "active" : ""}>
                              <Link to={subItem.url}>{subItem.title}</Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="sidebar-footer">
            <div className="user-profile">
              <div className="user-logo">
                <User size={32} />
              </div>
              <span className="user-name">ישראל ישראלי</span>
              <span className="user-id">מ.ז: 22635894</span>
            </div>
            <div className="footer-actions">
              <Link to={createPageUrl("Settings")} className="btn-footer" style={{flexGrow: 1, justifyContent: 'center'}}>
                <Settings size={14} />
                הגדרות
              </Link>
              <button className="btn-footer" style={{flexGrow: 1, justifyContent: 'center'}}>
                <LogOut size={14} />
                יציאה
              </button>
            </div>
          </div>
        </aside>

        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
