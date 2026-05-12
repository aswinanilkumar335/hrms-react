import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Moon, Sun, LayoutDashboard, CalendarCheck, FileText, ChevronLeft, ChevronRight, Search, Settings, LogOut } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import "./MainLayout.css";

function MainLayout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const userName = user?.name || "User";

  if (!user) {
    return (
      <div className="no-user-layout">
        <main>
          {children}
        </main>
      </div>
    );
  }

  const navItems = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/attendance", label: "Attendance", icon: CalendarCheck },
    { to: "/leaves", label: "Leaves", icon: FileText },
  ];

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <aside className={`sidebar ${collapsed ? "collapsed" : "expanded"}`}>
        {/* Header / Logo */}
        <div className="sidebar-header">
          {!collapsed && (
            <div className="logo-container">
              <div className="logo-icon">H</div>
              <span className="logo-text">HRMS</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="collapse-btn"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Search */}
        <div className="search-container">
          <div className="search-wrapper">
            <Search size={16} className="search-icon" />
            {!collapsed && (
              <input
                type="text"
                placeholder="Search"
                className="search-input"
              />
            )}
            {collapsed && (
              <div className="search-placeholder" />
            )}
          </div>
        </div>

        {/* Nav Links */}
        <nav className="nav-list">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            >
              <item.icon size={20} />
              {!collapsed && <span className="nav-item-label">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="footer-container">
          {/* User Profile */}
          {!collapsed && (
            <div className="user-profile">
              <div className="user-avatar">
                {userName.charAt(0)}
              </div>
              <div className="user-info">
                <span className="user-name">{userName}</span>
                <span className="user-role">Employee</span>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="user-avatar-collapsed">
              {userName.charAt(0)}
            </div>
          )}

          <div className="settings-btn" onClick={toggleTheme}>
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            {!collapsed && <span className="btn-label">{theme === "light" ? "Dark Mode" : "Light Mode"}</span>}
          </div>

          <div className="settings-btn">
            <Settings size={20} />
            {!collapsed && <span className="btn-label">Settings</span>}
          </div>
          <div
            onClick={() => {
              logout();
            }}
            className="logout-btn"
          >
            <LogOut size={20} />
            {!collapsed && <span className="btn-label">Logout</span>}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="main-inner">
          {children}
        </div>
      </main>
    </div>
  );
}

export default MainLayout;