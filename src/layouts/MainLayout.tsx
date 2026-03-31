import { NavLink } from "react-router-dom";

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex" }}>

      {/* Sidebar */}
      <div style={{
        width: "240px",
        height: "100vh",
        background: "linear-gradient(180deg, #111, #1a1a1a)",
        color: "#fff",
        padding: "20px",
        boxShadow: "4px 0 20px rgba(0,0,0,0.3)"
      }}>
        <h2>HRMS</h2>
        <NavLink
          to="/"
          style={({ isActive }) => ({
            display: "block",
            padding: "10px",
            borderRadius: "8px",
            color: isActive ? "#fff" : "#aaa",
            background: isActive ? "#333" : "transparent",
            textDecoration: "none",
            marginBottom: "8px"
          })}
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/attendance"
          style={({ isActive }) => ({
            display: "block",
            padding: "10px",
            borderRadius: "8px",
            color: isActive ? "#fff" : "#aaa",
            background: isActive ? "#333" : "transparent",
            textDecoration: "none",
            marginBottom: "8px"
          })}
        >
          Attendance
        </NavLink>

        <NavLink
          to="/leaves"
          style={({ isActive }) => ({
            display: "block",
            padding: "10px",
            borderRadius: "8px",
            color: isActive ? "#fff" : "#aaa",
            background: isActive ? "#333" : "transparent",
            textDecoration: "none"
          })}
        >
          Leaves
        </NavLink>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: "30px",
        background: "#f5f7fa",
        minHeight: "100vh"
      }}>
        {children}
      </div>

    </div>
  );
}

export default MainLayout;