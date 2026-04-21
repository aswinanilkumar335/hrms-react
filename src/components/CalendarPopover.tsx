import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import './CalendarPopover.css';

interface CalendarPopoverProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onClose: () => void;
}

const CalendarPopover: React.FC<CalendarPopoverProps> = ({ selectedDate, onDateSelect, onClose }) => {
  const [viewDate, setViewDate] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const monthName = viewDate.toLocaleString('default', { month: 'long' });
  const year = viewDate.getFullYear();

  const days = [];
  const totalDays = daysInMonth(viewDate.getFullYear(), viewDate.getMonth());
  const startDay = firstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());

  // Adjust for Monday start if preferred, but let's stick to Sunday for now for simplicity
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }

  for (let d = 1; d <= totalDays; d++) {
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
    const isSelected = date.toDateString() === selectedDate.toDateString();
    const isToday = date.toDateString() === new Date().toDateString();

    days.push(
      <div
        key={d}
        className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onDateSelect(date);
          onClose();
        }}
      >
        {d}
      </div>
    );
  }

  return (
    <div className="calendar-popover" onClick={(e) => e.stopPropagation()}>
      <div className="calendar-header">
        <button onClick={handlePrevMonth} className="nav-btn">
          <ChevronLeft size={18} />
        </button>
        <span className="current-month">{monthName} {year}</span>
        <button onClick={handleNextMonth} className="nav-btn">
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="calendar-weekdays">
        <div>Su</div>
        <div>Mo</div>
        <div>Tu</div>
        <div>We</div>
        <div>Th</div>
        <div>Fr</div>
        <div>Sa</div>
      </div>
      <div className="calendar-grid">
        {days}
      </div>
      <button className="close-popover" onClick={onClose}>
        <X size={14} />
      </button>
    </div>
  );
};

export default CalendarPopover;
