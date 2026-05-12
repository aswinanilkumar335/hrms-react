import { useEffect, useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  ChevronUp,
  BarChart2,
  Edit3
} from "lucide-react";
import AttendanceVisualizer from "../components/AttendanceVisualizer";
import "./Attendance.css";
import type {
  AttendanceRecord,
  Session,
} from "../types/attendance";

function Attendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [stats, setStats] = useState({
    totalDays: 0,
    avgHours: "0h 0m",
    lateCount: 0,
    overtime: "0h 0m"
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:3001/attendance");
      const data = await res.json();

      // Normalize data: ensure all records have sessions
      const normalizedData = data.map((item: any) => {
        if (!item.sessions && item.in) {
          return {
            ...item,
            sessions: [{ in: item.in, out: item.out }]
          };
        }
        return item;
      });

      const reversedData = [...normalizedData].reverse();
      setRecords(reversedData);
      calculateStats(normalizedData);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  const calculateStats = (data: AttendanceRecord[]) => {
    if (data.length === 0) return;

    let totalSeconds = 0;
    let lateDays = 0;

    data.forEach(day => {
      let daySeconds = 0;
      let firstIn: Date | null = null;

      if (day.sessions) {
        for (const s of day.sessions) {
          if (s.in) {
            const inDate = new Date(s.in);
            if (!firstIn || inDate.getTime() < firstIn.getTime()) {
              firstIn = inDate;
            }

            if (s.out) {
              const duration = (new Date(s.out).getTime() - inDate.getTime()) / 1000;
              daySeconds += duration;
            }
          }
        }
      }

      totalSeconds += daySeconds;

      // Late if first punch in is after 10 AM
      if (firstIn && firstIn.getHours() >= 10) {
        lateDays++;
      }
    });

    const avgSeconds = totalSeconds / data.length;
    const h = Math.floor(avgSeconds / 3600);
    const m = Math.floor((avgSeconds % 3600) / 60);

    const overtimeSec = data.reduce((acc, day) => {
      let daySec = 0;
      day.sessions?.forEach(s => {
        if (s.in && s.out) daySec += (new Date(s.out).getTime() - new Date(s.in).getTime()) / 1000;
      });
      return acc + Math.max(0, daySec - (8 * 3600));
    }, 0);

    const oh = Math.floor(overtimeSec / 3600);
    const om = Math.floor((overtimeSec % 3600) / 60);

    setStats({
      totalDays: data.length,
      avgHours: `${h}h ${m}m`,
      lateCount: lateDays,
      overtime: `${oh}h ${om}m`
    });
  };

  const getDuration = (inTime: string, outTime: string | null) => {
    if (!inTime || !outTime) return "";
    const diff = (new Date(outTime).getTime() - new Date(inTime).getTime()) / 1000;
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    return `${h}h ${m}m`;
  };

  const getTotalSeconds = (sessions: Session[]) => {
    let totalSeconds = 0;
    sessions?.forEach((s) => {
      if (s.in && s.out) {
        totalSeconds += (new Date(s.out).getTime() - new Date(s.in).getTime()) / 1000;
      }
    });
    return totalSeconds;
  };

  const getTotalHours = (sessions: Session[]) => {
    const totalSeconds = getTotalSeconds(sessions);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const matchesSearch = record.date.toLowerCase().includes(searchQuery.toLowerCase());

      if (activeFilter === "full") {
        return matchesSearch && getTotalSeconds(record.sessions) >= 8 * 3600;
      }
      if (activeFilter === "breaks") {
        return matchesSearch && (record.sessions?.length || 0) > 1;
      }

      return matchesSearch;
    });
  }, [records, searchQuery, activeFilter]);

  const exportCSV = () => {
    const headers = ["Date", "Sessions", "Total Hours"];
    const rows = filteredRecords.map(r => [
      r.date,
      r.sessions.length,
      getTotalHours(r.sessions)
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `attendance_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="attendance-page">
      {/* Header Section */}
      <div className="attendance-page-header">
        <div className="header-titles">
          <h1>Work Log & Insights</h1>
          <p>Track your work hours, attendance and performance in one place.</p>
        </div>
        <div className="header-date-picker">
          <button className="date-nav-btn"><ChevronLeft size={16} /></button>
          <div className="current-date-pill">
            <Calendar size={14} />
            <span>May 12, 2026</span>
          </div>
          <button className="date-nav-btn"><ChevronRight size={16} /></button>
        </div>
      </div>

      {/* Performance Overview Banner */}
      <div className="performance-banner">
        <div className="banner-left">
          <div className="banner-icon-wrapper">
            <TrendingUp size={24} />
          </div>
          <div className="banner-text">
            <h2>Work Performance Overview</h2>
            <p>Your average work hours and punctuality this month.</p>
          </div>
        </div>

        <div className="banner-stats">
          <div className="banner-stat-item">
            <span className="stat-label">AVG HOURS</span>
            <span className="stat-value">{stats.avgHours}</span>
          </div>
          <div className="stat-divider"></div>
          <div className="banner-stat-item">
            <span className="stat-label">OVERTIME</span>
            <span className="stat-value">{stats.overtime}</span>
          </div>
          <div className="stat-divider"></div>
          <div className="banner-stat-item">
            <span className="stat-label">LATE IN</span>
            <span className="stat-value">{stats.lateCount}</span>
          </div>
        </div>
      </div>

      {/* Day-wise Visualizer */}
      <AttendanceVisualizer records={records} />

      {/* Top Controls Section */}
      <div className="attendance-top-controls">
        <div className="controls-left">
          <div className="search-bar">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by date or status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery("")}>
                <X size={14} />
              </button>
            )}
          </div>
          <button className="icon-btn outline"><Filter size={16} /></button>
        </div>

        <div className="controls-right summary-pills">
          <div
            className={`summary-pill ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            All History
          </div>
          <div
            className={`summary-pill ${activeFilter === "full" ? "active" : ""}`}
            onClick={() => setActiveFilter("full")}
          >
            Full Attendance
          </div>
          <div
            className={`summary-pill ${activeFilter === "breaks" ? "active" : ""}`}
            onClick={() => setActiveFilter("breaks")}
          >
            Breaks Taken
          </div>
        </div>
      </div>

      <div className="attendance-content-grid">
        {/* Left Column */}
        <div className="attendance-left-column">
          <div className="daily-logs-card">
            <div className="daily-logs-header">
              <div className="daily-logs-title">
                <Calendar size={16} />
                <h3>Daily Logs</h3>
              </div>
              <ChevronUp size={16} className="text-muted" />
            </div>
            
            <div className="attendance-list">
              {filteredRecords.length === 0 ? (
                <div className="empty-state">
                  <AlertCircle size={48} />
                  <p>{records.length === 0 ? "No records found for your account." : "No records match your search/filter."}</p>
                </div>
              ) : (
                filteredRecords.map((item: AttendanceRecord, index: number) => (
                  <div key={item.id || index} className="attendance-record-card">
                    <div className="record-header">
                      <div className="record-date">
                        <Calendar size={18} />
                        {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="record-actions">
                        <div className="record-total">
                          {getTotalHours(item.sessions)} Total
                        </div>
                        <ChevronUp size={16} className="text-muted" style={{ cursor: 'pointer' }} />
                        <MoreHorizontal size={16} className="text-muted" style={{ cursor: 'pointer', marginLeft: '8px' }} />
                      </div>
                    </div>

                    <div className="record-body">
                      <div className="sessions-grid">
                        {item.sessions?.map((s: Session, i: number) => (
                          <div key={i} className="session-item">
                            <div className="session-times">
                              <div className="status-dot-small present"></div>
                              <span>{new Date(s.in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                              <ArrowRight size={14} className="session-arrow" />
                              <span>
                                {s.out
                                  ? new Date(s.out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
                                  : "Running..."}
                              </span>
                              {s.out && <CheckCircle2 size={14} style={{ color: "#22c55e" }} />}
                            </div>
                            <div className="session-duration">
                              {s.out ? getDuration(s.in, s.out) : <span className="active-badge">Active</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="attendance-right-column">
          {/* Insights Card */}
          <div className="insights-card">
            <div className="insights-header">
              <h3>Insights</h3>
              <div className="insights-actions">
                <button className="toolbar-btn"><Filter size={14} /> Filters</button>
                <button className="toolbar-btn primary" onClick={exportCSV}><Download size={14} /> Export CSV</button>
              </div>
            </div>
            <div className="insights-body">
              <div className="insights-chart-container">
                <div className="donut-chart">
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    <path className="circle-bg"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path className="circle-dayoff"
                      strokeDasharray="8, 100"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path className="circle-late"
                      strokeDasharray="8, 100"
                      strokeDashoffset="-8"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path className="circle-present"
                      strokeDasharray="76, 100"
                      strokeDashoffset="-16"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="donut-hole">
                    <span className="donut-percentage">92%</span>
                    <span className="donut-label">Present</span>
                  </div>
                </div>
              </div>
              <div className="insights-stats-list">
                <div className="stat-row">
                  <div className="stat-left">
                    <div className="stat-dot present"></div>
                    <span className="stat-name">Present</span>
                  </div>
                  <span className="stat-val">13 Days</span>
                </div>
                <div className="stat-row">
                  <div className="stat-left">
                    <div className="stat-dot late"></div>
                    <span className="stat-name">Late</span>
                  </div>
                  <span className="stat-val">1 Day</span>
                </div>
                <div className="stat-row">
                  <div className="stat-left">
                    <div className="stat-dot half-day"></div>
                    <span className="stat-name">Half Day</span>
                  </div>
                  <span className="stat-val">0 Days</span>
                </div>
                <div className="stat-row">
                  <div className="stat-left">
                    <div className="stat-dot day-off"></div>
                    <span className="stat-name">Day Off</span>
                  </div>
                  <span className="stat-val">1 Day</span>
                </div>
                <div className="stat-footer">Based on 15 working days</div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="quick-actions-card">
            <h3>Quick Actions</h3>
            <div className="action-list">
              <div className="action-item">
                <div className="action-icon" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>
                  <BarChart2 size={18} />
                </div>
                <div className="action-text">
                  <h4>View Attendance Report</h4>
                  <p>Detailed attendance analytics</p>
                </div>
                <ChevronRight size={16} className="action-arrow" />
              </div>
              <div className="action-item">
                <div className="action-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                  <Clock size={18} />
                </div>
                <div className="action-text">
                  <h4>View Timesheet</h4>
                  <p>See your timesheet details</p>
                </div>
                <ChevronRight size={16} className="action-arrow" />
              </div>
              <div className="action-item">
                <div className="action-icon" style={{ background: 'rgba(249, 115, 22, 0.1)', color: '#f97316' }}>
                  <Edit3 size={18} />
                </div>
                <div className="action-text">
                  <h4>Request Correction</h4>
                  <p>Report attendance issue</p>
                </div>
                <ChevronRight size={16} className="action-arrow" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Attendance;