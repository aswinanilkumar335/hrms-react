import { useEffect, useState } from "react";

function PunchButton() {
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchInTime, setPunchInTime] = useState<Date | null>(null);
  const [punchOutTime, setPunchOutTime] = useState<Date | null>(null);

  //  Handle Punch
  const handlePunch = async () => {
    try {
      const now = new Date();
      const today = new Date().toDateString();

      const res = await fetch("http://localhost:3001/attendance");
      if (!res.ok) throw new Error("Failed to fetch attendance data");
      const records = await res.json();

      let todayRecord = records.find((r: any) => r.date === today);

      // 🔥 FIXED LOGIC
      if (!todayRecord) {
        // First time → Punch In
        const postRes = await fetch("http://localhost:3001/attendance", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: today,
            in: now,
            out: null,
          }),
        });
        
        if (postRes.ok) {
          setIsPunchedIn(true);
          setPunchInTime(now);
        }
      } else if (!todayRecord.out) {
        // Already punched in → Punch Out
        const patchRes = await fetch(`http://localhost:3001/attendance/${todayRecord.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ out: now }),
        });
        
        if (patchRes.ok) {
          setIsPunchedIn(false);
          setPunchOutTime(now);
        }
      } else {
        // Already completed → Reset (optional)
        alert("Already punched out for today");
        return;
      }

      // Refresh UI to sync with backend
      await fetchTodayData();
    } catch (error) {
      console.error("Error in handlePunch:", error);
    }
  };

  const fetchTodayData = async () => {
    const res = await fetch("http://localhost:3001/attendance");
    const records = await res.json();

    const today = new Date().toDateString();
    const todayRecord = records.find((r: any) => r.date === today);

    if (todayRecord) {
      setPunchInTime(todayRecord.in ? new Date(todayRecord.in) : null);
      setPunchOutTime(todayRecord.out ? new Date(todayRecord.out) : null);
      setIsPunchedIn(!todayRecord.out);
    }
  };

  useEffect(() => {
    fetchTodayData();
  }, []);

  //  Calculate worked hours
  const getWorkedHours = () => {
    if (punchInTime && punchOutTime) {
      const diff =
        (punchOutTime.getTime() - punchInTime.getTime()) / 1000;

      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);

      return `${hours}h ${minutes}m`;
    }
    return "--";
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {/* Button */}
      <button
        onClick={handlePunch}
        style={{
          padding: "12px",
          borderRadius: "var(--border-radius-md)",
          border: "none",
          background: isPunchedIn ? "var(--danger)" : "var(--success)",
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer",
          transition: "var(--transition-fast)",
        }}
      >
        {isPunchedIn ? "Punch Out" : "Punch In"}
      </button>

      {/* Data */}
      <p>In: {punchInTime?.toLocaleTimeString() || "--"}</p>
      <p>Out: {punchOutTime?.toLocaleTimeString() || "--"}</p>
      <p>Worked: {getWorkedHours()}</p>
    </div>
  );
}

export default PunchButton;