import { useEffect, useState, useRef } from "react";
import { Users, Clock, Calendar, Briefcase, TrendingUp, CalendarDays, MoreVertical, Bell, CheckCircle, Info } from "lucide-react";
import Card from "../components/Card";
import PunchButton from "../components/PunchButton";
import AttendanceChart from "../components/AttendanceChart";
import CalendarPopover from "../components/CalendarPopover";
import "./Dashboard.css";

function Dashboard() {
  const [showCalendar, setShowCalendar] = useState(false);
  const headerDateRef = useRef<HTMLDivElement>(null);

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const userName = user?.name || "User";

  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:3001/attendance");
      const records = await res.json();

      setAttendanceRecords(records); // ✅ store all data
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

  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatDate = () => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(selectedDate);
  };

  const handleCalendarClick = () => {
    setShowCalendar(!showCalendar);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerDateRef.current && !headerDateRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="dashboard-container">
      {/* Top Header */}
      <header className="dashboard-header">
        <div className="header-greeting">
          <h1>Good Morning, {userName} 👋</h1>
          <p>Here's what's happening with your HR portal today.</p>
        </div>
        <div className="header-date" ref={headerDateRef}>
          <div
            className={`date-text clickable ${showCalendar ? 'active' : ''}`}
            onClick={handleCalendarClick}
          >
            <Calendar size={18} />
            {formatDate()}
          </div>
          {showCalendar && (
            <CalendarPopover
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              onClose={() => setShowCalendar(false)}
            />
          )}
        </div>
      </header>

      {/* Top Section: Banner + Stats */}
      <div className="dashboard-top-section">
        {/* Main Banner */}
        <section className="welcome-banner">
          <div className="banner-content">
            <h2>Welcome to HRMS 2.0</h2>
            <p>Your centralized hub for attendance, leave management, and company-wide notifications. Stay productive!</p>
          </div>
          <div className="banner-graphic">
            <img src="/src/assets/dashboard-preview.png" alt="Dashboard Preview" />
          </div>
        </section>

        {/* Mini Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: "rgba(99, 102, 241, 0.1)", color: "#6366f1" }}>
              <Users size={20} />
            </div>
            <div className="stat-label">Team Size</div>
            <div className="stat-value">{attendanceRecords.length}</div>
            <div className="stat-sub-label">Records</div>
            <div className="stat-indicator positive">
              <TrendingUp size={12} />
              <span>1 new this month</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: "rgba(34, 197, 94, 0.1)", color: "#22c55e" }}>
              <CalendarDays size={20} />
            </div>
            <div className="stat-label">Applied Leaves</div>
            <div className="stat-value">
              {attendanceRecords.filter((r: any) => !r.out).length}
            </div>
            <div className="stat-sub-label">Active</div>
            <div className="stat-indicator warning">
              <span>2 pending approval</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: "rgba(245, 158, 11, 0.1)", color: "#f59e0b" }}>
              <TrendingUp size={20} />
            </div>
            <div className="stat-label">Attendance</div>
            <div className="stat-value">
              {attendanceRecords.length > 0
                ? Math.min(100, attendanceRecords.length * 10) + "%"
                : "0%"}
            </div>
            <div className="stat-sub-label">This Week</div>
            <div className="stat-indicator positive">
              <TrendingUp size={12} />
              <span>8% vs last week</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444" }}>
              <Clock size={20} />
            </div>
            <div className="stat-label">Current Time</div>
            <div className="stat-value">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
            </div>
            <div className="stat-sub-label">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Actions */}
      <div className="main-grid">
        <div className="main-left">
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <Card
              title="Attendance Insights"
              headerAction={<div style={{ color: "var(--text-muted)", fontSize: "13px", cursor: "pointer" }}>Weekly View</div>}
            >
              <AttendanceChart />
            </Card>

            <Card
              title="Recent Notifications"
              headerAction={<div style={{ color: "var(--primary)", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>View All</div>}
            >
              <div className="notifications-list">
                <div className="notification-item">
                  <div className="notification-icon success">
                    <CheckCircle size={16} />
                  </div>
                  <div className="notification-content">
                    <p className="notification-text">Your <strong>leave request</strong> for May 15 has been approved.</p>
                    <span className="notification-time">2 minutes ago</span>
                  </div>
                </div>
                
                <div className="notification-item">
                  <div className="notification-icon info">
                    <Info size={16} />
                  </div>
                  <div className="notification-content">
                    <p className="notification-text">New <strong>company policy</strong> updated in the handbook.</p>
                    <span className="notification-time">1 hour ago</span>
                  </div>
                </div>

                <div className="notification-item">
                  <div className="notification-icon warning">
                    <Bell size={16} />
                  </div>
                  <div className="notification-content">
                    <p className="notification-text">Reminder: <strong>Monthly Townhall</strong> meeting at 4:00 PM.</p>
                    <span className="notification-time">3 hours ago</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="main-right">
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", height: "100%" }}>
            <Card
              title="Punch Station"
              headerAction={<MoreVertical size={18} style={{ color: "var(--text-muted)", cursor: "pointer" }} />}
            >
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