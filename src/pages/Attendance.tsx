import { useEffect, useState } from "react";
import { 
  Calendar, 
  Clock, 
  Timer, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  History,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Coffee
} from "lucide-react";
import "./Attendance.css";

function Attendance() {
  const [records, setRecords] = useState<any[]>([]);
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
      const reversedData = [...data].reverse();
      setRecords(reversedData);
      calculateStats(data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  const calculateStats = (data: any[]) => {
    if (data.length === 0) return;
    
    let totalSeconds = 0;
    let lateDays = 0;
    
    data.forEach(day => {
      day.sessions?.forEach((s: any) => {
        if (s.in && s.out) {
          const duration = (new Date(s.out).getTime() - new Date(s.in).getTime()) / 1000;
          totalSeconds += duration;
        }
        
        // Simulating "late" if first punch in is after 10 AM
        if (s.in && new Date(s.in).getHours() >= 10) {
          lateDays++;
        }
      });
    });

    const avgSeconds = totalSeconds / data.length;
    const h = Math.floor(avgSeconds / 3600);
    const m = Math.floor((avgSeconds % 3600) / 60);

    const overtimeSec = Math.max(0, totalSeconds - (data.length * 8 * 3600));
    const oh = Math.floor(overtimeSec / 3600);
    const om = Math.floor((overtimeSec % 3600) / 60);
    
    setStats({
      totalDays: data.length,
      avgHours: `${h}h ${m}m`,
      lateCount: Math.floor(lateDays / 2), // Approximation
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

  const getTotalHours = (sessions: any[]) => {
    let totalSeconds = 0;
    sessions?.forEach((s) => {
      if (s.in && s.out) {
        totalSeconds += (new Date(s.out).getTime() - new Date(s.in).getTime()) / 1000;
      }
    });

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="attendance-page">
      {/* Hero Header */}
      <header className="attendance-hero">
        <div className="hero-content">
          <h1>Work Log & Insights</h1>
          <p>Detailed performance and punctuality tracking</p>
        </div>
        <div className="hero-stats">
          <div className="hero-stat-item">
            <h3>Avg Hours</h3>
            <p>{stats.avgHours}</p>
          </div>
          <div className="hero-stat-item">
            <h3>Overtime</h3>
            <p style={{ color: "rgba(255,255,255,0.9)" }}>{stats.overtime}</p>
          </div>
          <div className="hero-stat-item">
            <h3>Late In</h3>
            <p style={{ color: "rgba(255,255,255,0.9)" }}>{stats.lateCount}</p>
          </div>
        </div>
      </header>

      {/* Toolbar Section */}
      <div className="attendance-toolbar">
        <div className="search-bar">
          <Search size={16} />
          <input type="text" placeholder="Search by date or session..." />
        </div>
        <div className="toolbar-actions">
          <button className="toolbar-btn">
            <Filter size={16} />
            Filters
          </button>
          <button className="toolbar-btn primary">
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary Row */}
      <div className="summary-pills">
        <div className="summary-pill active">
          <History size={14} />
          All History
        </div>
        <div className="summary-pill">
          <CheckCircle2 size={14} />
          Full Attendance
        </div>
        <div className="summary-pill">
          <Coffee size={14} />
          Breaks Taken
        </div>
      </div>

      {/* Main List */}
      <div className="attendance-list">
        {records.length === 0 ? (
          <div className="empty-state">
            <AlertCircle size={48} />
            <p>No records found for your account.</p>
          </div>
        ) : (
          records.map((item: any, index: number) => (
            <div key={index} className="attendance-record-card">
              <div className="record-header">
                <div className="record-date">
                  <Calendar size={18} />
                  {item.date}
                </div>
                <div className="record-actions">
                  <div className="record-total">
                    <Timer size={14} />
                    {getTotalHours(item.sessions)} Total
                  </div>
                  <button className="icon-btn">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </div>

              <div className="record-body">
                <div className="sessions-grid">
                  {item.sessions?.map((s: any, i: number) => (
                    <div key={i} className="session-item">
                      <div className="session-icon">
                        <Clock size={16} />
                      </div>
                      <div className="session-times">
                        <span>{new Date(s.in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <ArrowRight size={14} className="session-arrow" />
                        <span>
                          {s.out 
                            ? new Date(s.out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                            : "Running..."}
                        </span>
                      </div>
                      <div className="session-duration">
                        {s.out ? getDuration(s.in, s.out) : "Active"}
                      </div>
                      {s.out && <CheckCircle2 size={14} style={{ color: "var(--success)" }} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Attendance;