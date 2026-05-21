import { useEffect, useState } from "react";
import { Fingerprint, LogOut, LogIn } from "lucide-react";
import {
  getAttendance,
  createAttendance,
  updateAttendance,
} from "../services/attendanceService";
import "./PunchButton.css";

function PunchButton() {
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchInTime, setPunchInTime] = useState<Date | null>(null);
  const [punchOutTime, setPunchOutTime] = useState<Date | null>(null);
  const [workedHours, setWorkedHours] = useState<string>("--");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [progress, setProgress] = useState(0);
  const [todaySessions, setTodaySessions] = useState<any[]>([]);

  // Constants
  const WORK_DAY_SECONDS = 8 * 3600;

  // Clock & Progress Update
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      if (isPunchedIn && punchInTime) {
        // Recalculate total seconds including current active session
        const totalSecs = calculateTotalSeconds(todaySessions, now);
        const hours = Math.floor(totalSecs / 3600);
        const minutes = Math.floor((totalSecs % 3600) / 60);
        setWorkedHours(`${hours}h ${minutes}m`);
        setProgress(Math.min(100, (totalSecs / WORK_DAY_SECONDS) * 100));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isPunchedIn, punchInTime, todaySessions]);

  const calculateTotalSeconds = (sessions: any[], activeSessionNow?: Date) => {
    let total = 0;
    sessions.forEach((s: any) => {
      if (s.in && s.out) {
        total += (new Date(s.out).getTime() - new Date(s.in).getTime()) / 1000;
      } else if (s.in && !s.out && activeSessionNow) {
        total += (activeSessionNow.getTime() - new Date(s.in).getTime()) / 1000;
      }
    });
    return total;
  };

  const fetchTodayData = async () => {
    try {
      const records = await getAttendance();
      const today = new Date().toDateString();
      const todayRecord = records.find((r: any) => r.date === today);

      if (todayRecord) {
        const sessions = todayRecord.sessions || [];
        setTodaySessions(sessions);
        const lastSession = sessions[sessions.length - 1];

        const punchedIn = !!(lastSession && !lastSession.out);
        setIsPunchedIn(punchedIn);
        setPunchInTime(lastSession?.in ? new Date(lastSession.in) : null);
        setPunchOutTime(lastSession?.out ? new Date(lastSession.out) : null);

        const totalSecs = calculateTotalSeconds(sessions, punchedIn ? new Date() : undefined);
        const hours = Math.floor(totalSecs / 3600);
        const minutes = Math.floor((totalSecs % 3600) / 60);
        setWorkedHours(`${hours}h ${minutes}m`);
        setProgress(Math.min(100, (totalSecs / WORK_DAY_SECONDS) * 100));
      } else {
        setTodaySessions([]);
        setIsPunchedIn(false);
        setPunchInTime(null);
        setPunchOutTime(null);
        setWorkedHours("--");
        setProgress(0);
      }
    } catch (error) {
      console.error("Error fetching today's data:", error);
    }
  };

  useEffect(() => {
    fetchTodayData();
  }, []);

  const handlePunch = async () => {
    try {
      const now = new Date();
      const today = new Date().toDateString();
      const records = await getAttendance();
      let todayRecord = records.find((r: any) => r.date === today);

      if (!todayRecord) {
        await createAttendance({
          date: today,
          sessions: [{ in: now, out: null }]
        });
      } else {
        const sessions = todayRecord.sessions || [];
        const lastSession = sessions[sessions.length - 1];

        if (lastSession && !lastSession.out) {
          lastSession.out = now;
        } else {
          sessions.push({ in: now, out: null });
        }

        await updateAttendance(todayRecord.id, {
          ...todayRecord,
          sessions,
        });
      }
      await fetchTodayData();
    } catch (error) {
      console.error(error);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  };

  // SVG Progress Constants
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="punch-station-container">
      <div className="punch-main-info">
        <div className="punch-visual">
          <svg width="90" height="90" viewBox="0 0 90 90" className="punch-svg">
            <circle
              cx="45"
              cy="45"
              r={radius}
              fill="transparent"
              stroke="rgba(16, 185, 129, 0.1)"
              strokeWidth="6"
            />
            <circle
              cx="45"
              cy="45"
              r={radius}
              fill="transparent"
              stroke="#10b981"
              strokeWidth="6"
              strokeDasharray={circumference}
              style={{ 
                strokeDashoffset, 
                transition: "stroke-dashoffset 0.5s ease",
                strokeLinecap: "round"
              }}
              transform="rotate(-90 45 45)"
            />
          </svg>
          <div className="punch-icon-wrapper">
            <Fingerprint size={32} />
          </div>
        </div>

        <div className="punch-details">
          <div className="punch-current-time">
            {formatTime(currentTime)}
          </div>
          <div className={`punch-status-badge ${isPunchedIn ? 'in' : 'out'}`}>
            {isPunchedIn ? "You are currently punched in" : "You are currently punched out"}
          </div>
          <div className="punch-times">
            <span>In: {punchInTime ? formatTime(punchInTime) : "--:--:--"}</span>
            <span>Out: {punchOutTime ? formatTime(punchOutTime) : "--:--:--"}</span>
          </div>
          <div className="punch-divider"></div>
          <div className="punch-worked-today">
            Worked Today: {workedHours}
          </div>
        </div>
      </div>

      <button 
        className={`punch-action-button ${isPunchedIn ? 'out' : 'in'}`}
        onClick={handlePunch}
      >
        {isPunchedIn ? (
          <>
            <LogOut size={20} />
            Punch Out
          </>
        ) : (
          <>
            <LogIn size={20} />
            Punch In
          </>
        )}
      </button>
    </div>
  );
}

export default PunchButton;