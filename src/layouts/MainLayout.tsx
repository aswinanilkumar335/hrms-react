import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  CalendarCheck, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  Search,
  Settings
} from "lucide-react";

function MainLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/attendance", label: "Attendance", icon: CalendarCheck },
    { to: "/leaves", label: "Leaves", icon: FileText },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-main)" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: collapsed ? "var(--sidebar-width-collapsed)" : "var(--sidebar-width-expanded)",
          height: "100vh",
          background: "var(--sidebar-bg)",
          color: "var(--sidebar-text)",
          padding: "20px 12px",
          display: "flex",
          flexDirection: "column",
          transition: "var(--transition-sidebar)",
          position: "sticky",
          top: 0,
          boxShadow: "var(--shadow-sidebar)",
          zIndex: 50,
          overflow: "hidden"
        }}
      >
        {/* Header / Logo */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: collapsed ? "center" : "space-between",
          marginBottom: "24px",
          padding: "0 4px"
        }}>
          {!collapsed && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ 
                width: "28px", 
                height: "28px", 
                background: "var(--accent-gradient)", 
                borderRadius: "var(--border-radius-sm)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "14px"
              }}>
                H
              </div>
              <span style={{ fontWeight: "700", fontSize: "16px", letterSpacing: "-0.5px" }}>HRMS</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              background: "var(--sidebar-divider)",
              border: "none",
              color: "var(--sidebar-text-muted)",
              cursor: "pointer",
              padding: "4px",
              borderRadius: "var(--border-radius-sm)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "var(--transition-fast)"
            }}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Search */}
        <div style={{ marginBottom: "20px", padding: "0 4px" }}>
          <div style={{ 
            position: "relative",
            display: "flex",
            alignItems: "center"
          }}>
            <Search 
              size={16} 
              style={{ 
                position: "absolute", 
                left: collapsed ? "50%" : "10px", 
                transform: collapsed ? "translateX(-50%)" : "none",
                color: "var(--sidebar-search-icon)" 
              }} 
            />
            {!collapsed && (
              <input 
                type="text" 
                placeholder="Search" 
                style={{
                  width: "100%",
                  background: "var(--sidebar-search-bg)",
                  border: "1px solid var(--sidebar-search-border)",
                  borderRadius: "var(--border-radius-md)",
                  padding: "8px 10px 8px 34px",
                  color: "var(--sidebar-text)",
                  fontSize: "13px",
                  outline: "none"
                }}
              />
            )}
            {collapsed && (
              <div style={{ width: "32px", height: "32px" }} />
            )}
          </div>
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px",
                borderRadius: "var(--border-radius-md)",
                color: isActive ? "var(--sidebar-text)" : "var(--sidebar-text-muted)",
                background: isActive ? "var(--sidebar-item-active-bg)" : "transparent",
                textDecoration: "none",
                transition: "var(--transition-fast)",
                justifyContent: collapsed ? "center" : "flex-start"
              })}
            >
              <item.icon size={20} />
              {!collapsed && <span style={{ fontWeight: "500", fontSize: "14px" }}>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ marginTop: "auto", padding: "0 4px" }}>
             <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px",
                borderRadius: "var(--border-radius-md)",
                color: "var(--sidebar-text-muted)",
                cursor: "pointer",
                justifyContent: collapsed ? "center" : "flex-start"
              }}
            >
              <Settings size={20} />
              {!collapsed && <span style={{ fontWeight: "500", fontSize: "14px" }}>Settings</span>}
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          padding: "var(--main-padding)",
          background: "var(--bg-main)",
          minHeight: "100vh",
          transition: "var(--transition-fast)"
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {children}
        </div>
      </main>
    </div>
  );
}

export default MainLayout;