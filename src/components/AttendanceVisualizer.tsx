import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './AttendanceVisualizer.css';

interface Session {
  in: string;
  out: string | null;
}

interface AttendanceRecord {
  date: string;
  sessions: Session[];
}

interface AttendanceVisualizerProps {
  records: AttendanceRecord[];
}

interface DayStatus {
  day: number;
  date: Date;
  status: 'present' | 'late' | 'half-day' | 'day-off' | 'holiday' | 'weekend' | 'empty';
  totalHours?: number;
}

const AttendanceVisualizer: React.FC<AttendanceVisualizerProps> = ({ records }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const days: DayStatus[] = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const date = new Date(year, month, day);
    let status: DayStatus['status'] = 'empty';
    
    // Check if it's a weekend
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) status = 'weekend';

    // Find record for this day
    const record = records.find(r => {
      const rDate = new Date(r.date);
      return rDate.getDate() === day && rDate.getMonth() === month && rDate.getFullYear() === year;
    });

    let totalHours = 0;
    if (record) {
      let firstIn: Date | null = null;
      for (const s of record.sessions) {
        if (s.in) {
          const inTime = new Date(s.in);
          if (!firstIn || inTime.getTime() < firstIn.getTime()) {
            firstIn = inTime;
          }
          
          if (s.out) {
            totalHours += (new Date(s.out).getTime() - inTime.getTime()) / (1000 * 3600);
          }
        }
      }

      if (totalHours > 0) {
        if (firstIn && firstIn.getHours() >= 10) {
          status = 'late';
        } else if (totalHours < 4) {
          status = 'half-day';
        } else {
          status = 'present';
        }
      }
    }
    
    // Future dates should be empty
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dDate = new Date(date);
    dDate.setHours(0, 0, 0, 0);

    if (dDate > today) {
       if (status !== 'weekend') status = 'empty';
    }
    
    return { day, date, status, totalHours };
  });

  const legend = [
    { label: 'Present', color: '#22c55e' },
    { label: 'Late', color: '#f97316' },
    { label: 'Half Day', color: '#ef4444' },
    { label: 'Day Off', color: '#a855f7' },
    { label: 'Holiday', color: 'transparent', isBorder: true, borderColor: '#d946ef' },
    { label: 'Weekend', color: '#e5e7eb' },
  ];

  const renderStatusIcon = (status: DayStatus['status']) => {
    switch (status) {
      case 'present':
        return <div className="status-dot present"></div>;
      case 'half-day':
        return <div className="status-dot half-day"></div>;
      case 'holiday':
        return <div className="status-dot holiday"></div>;
      case 'weekend':
      case 'empty':
        return <div className="status-dot empty"></div>;
      case 'late':
        return <div className="status-dot late"></div>;
      default:
        return <div className={`status-dot ${status}`}></div>;
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="attendance-visualizer-card">
      <div className="visualizer-header">
        <div className="header-title-nav">
          <h2>Attendance</h2>
          <div className="month-nav">
            <button onClick={handlePrevMonth} className="nav-btn"><ChevronLeft size={16} /></button>
            <span className="current-month">{monthName} {year}</span>
            <button onClick={handleNextMonth} className="nav-btn"><ChevronRight size={16} /></button>
          </div>
        </div>
        <div className="visualizer-legend">
          {legend.map((item) => (
            <div key={item.label} className="legend-item">
              <span 
                className="legend-dot" 
                style={{ 
                  backgroundColor: item.color,
                  ...(item.isBorder && { border: `2px dashed ${item.borderColor}` })
                }}
              >
              </span>
              <span className="legend-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="visualizer-scroll-container">
        <div className="days-row">
          {days.map((d) => (
            <div key={d.day} className={`day-column ${d.status} ${d.date.toDateString() === new Date().toDateString() ? 'today' : ''}`}>
              <span className="day-number">{d.day.toString().padStart(2, '0')}</span>
              <div className="day-status-wrapper">
                {renderStatusIcon(d.status)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendanceVisualizer;
