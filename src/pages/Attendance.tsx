import { useEffect, useState, useMemo } from "react";
import { 
  Calendar, 
  Clock, 
  Timer, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  History,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Coffee,
  X
} from "lucide-react";
import AttendanceVisualizer from "../components/AttendanceVisualizer";
import "./Attendance.css";

interface Session {
  in: string;
  out: string | null;
}

interface AttendanceRecord {
  date: string;
  sessions: Session[];
  id?: number;
}

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

      {/* Day-wise Visualizer */}
      <AttendanceVisualizer records={records} />

      {/* Toolbar Section */}
      <div className="attendance-toolbar">
        <div className="search-bar">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search by date..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery("")}>
              <X size={14} />
            </button>
          )}
        </div>
        <div className="toolbar-actions">
          <button className="toolbar-btn">
            <Filter size={16} />
            Filters
          </button>
          <button className="toolbar-btn primary" onClick={exportCSV}>
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary Row */}
      <div className="summary-pills">
        <div 
          className={`summary-pill ${activeFilter === "all" ? "active" : ""}`}
          onClick={() => setActiveFilter("all")}
        >
          <History size={14} />
          All History
        </div>
        <div 
          className={`summary-pill ${activeFilter === "full" ? "active" : ""}`}
          onClick={() => setActiveFilter("full")}
        >
          <CheckCircle2 size={14} />
          Full Attendance
        </div>
        <div 
          className={`summary-pill ${activeFilter === "breaks" ? "active" : ""}`}
          onClick={() => setActiveFilter("breaks")}
        >
          <Coffee size={14} />
          Breaks Taken
        </div>
      </div>

      {/* Main List */}
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
                  {item.sessions?.map((s: Session, i: number) => (
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