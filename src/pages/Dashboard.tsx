import { useEffect, useState } from "react";
import { Users, Clock, Calendar, Briefcase, TrendingUp, CalendarDays } from "lucide-react";
import Card from "../components/Card";
import PunchButton from "../components/PunchButton";
import AttendanceChart from "../components/AttendanceChart";
import "./Dashboard.css";

function Dashboard() {
  const [punchInTime, setPunchInTime] = useState<Date | null>(null);
  const [punchOutTime, setPunchOutTime] = useState<Date | null>(null);

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const userName = user?.name || "User";

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:3001/attendance");
      const records = await res.json();

      const today = new Date().toDateString();
      const todayRecord = records.find((r: any) => r.date === today);

      if (todayRecord) {
        setPunchInTime(todayRecord.in ? new Date(todayRecord.in) : null);
        setPunchOutTime(todayRecord.out ? new Date(todayRecord.out) : null);
      }
    };

    fetchData();
  }, []);

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDate = () => {
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(new Date());
  };

  return (
    <div className="dashboard-container">
      {/* Top Header */}
      <header className="dashboard-header">
        <div className="header-greeting">
          <h1>Good Morning, {userName} 👋</h1>
          <p>Here's what's happening with your HR portal today.</p>
        </div>
        <div className="header-date">
          <div className="date-text">
            <Calendar size={18} />
            {formatDate()}
          </div>
        </div>
      </header>

      {/* Main Banner */}
      <section className="welcome-banner">
        <div className="banner-content">
          <h2>Welcome to HRMS 2.0</h2>
          <p>Your centralized hub for attendance, leave management, and company-wide notifications. Stay productive!</p>
        </div>
      </section>

      {/* Mini Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(99, 102, 241, 0.1)", color: "#6366f1" }}>
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h3>Team Size</h3>
            <p>24 Active</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(34, 197, 94, 0.1)", color: "#22c55e" }}>
            <CalendarDays size={24} />
          </div>
          <div className="stat-info">
            <h3>Applied Leaves</h3>
            <p>02 Pending</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(245, 158, 11, 0.1)", color: "#f59e0b" }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <h3>Attendance</h3>
            <p>94% Quality</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444" }}>
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <h3>Current Time</h3>
            <p>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>
      </div>

      {/* Main Grid Actions */}
      <div className="main-grid">
        <div className="main-left">
          <Card 
            title="Attendance Insights" 
            headerAction={<div style={{ color: "var(--text-muted)", fontSize: "13px" }}>Weekly View</div>}
          >
            <AttendanceChart />
          </Card>
        </div>
        
        <div className="main-right">
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", height: "100%" }}>
            <Card title="Punch Station">
              <PunchButton />
            </Card>
            
            <Card title="Quick Tasks">
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: "var(--bg-main)", borderRadius: "var(--border-radius-md)" }}>
                  <Briefcase size={18} style={{ color: "var(--primary)" }} />
                  <span style={{ fontSize: "14px", fontWeight: "500" }}>Complete Profile</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: "var(--bg-main)", borderRadius: "var(--border-radius-md)" }}>
                  <Calendar size={18} style={{ color: "var(--success)" }} />
                  <span style={{ fontSize: "14px", fontWeight: "500" }}>Check Holidays</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;