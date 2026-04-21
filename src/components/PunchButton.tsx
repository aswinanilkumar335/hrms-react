import { useEffect, useState } from "react";

function PunchButton() {
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchInTime, setPunchInTime] = useState<Date | null>(null);
  const [punchOutTime, setPunchOutTime] = useState<Date | null>(null);
  const [workedHours, setWorkedHours] = useState<string>("--");

  const fetchTodayData = async () => {
    try {
      const res = await fetch("http://localhost:3001/attendance");
      const records = await res.json();

      const today = new Date().toDateString();
      const todayRecord = records.find((r: any) => r.date === today);

      if (todayRecord) {
        const sessions = todayRecord.sessions || [];
        const lastSession = sessions[sessions.length - 1];

        setIsPunchedIn(!!(lastSession && !lastSession.out));
        setPunchInTime(lastSession?.in ? new Date(lastSession.in) : null);
        setPunchOutTime(lastSession?.out ? new Date(lastSession.out) : null);

        // Calculate worked hours
        let totalSeconds = 0;
        sessions.forEach((s: any) => {
          if (s.in && s.out) {
            totalSeconds +=
              (new Date(s.out).getTime() - new Date(s.in).getTime()) / 1000;
          }
        });

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        setWorkedHours(`${hours}h ${minutes}m`);
      } else {
        setIsPunchedIn(false);
        setPunchInTime(null);
        setPunchOutTime(null);
        setWorkedHours("--");
      }
    } catch (error) {
      console.error("Error fetching today's data:", error);
    }
  };

  useEffect(() => {
    fetchTodayData();
  }, []);

  //  Handle Punch
  const handlePunch = async () => {
    try {
      const now = new Date();
      const today = new Date().toDateString();

      const res = await fetch("http://localhost:3001/attendance");
      const records = await res.json();

      let todayRecord = records.find((r: any) => r.date === today);

      if (!todayRecord) {
        // ✅ First punch of the day
        await fetch("http://localhost:3001/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: today,
            sessions: [{ in: now, out: null }]
          }),
        });

      } else {
        const sessions = todayRecord.sessions || [];
        const lastSession = sessions[sessions.length - 1];

        if (!lastSession.out) {
          // ✅ Punch OUT
          lastSession.out = now;
        } else {
          // ✅ New Punch IN
          sessions.push({ in: now, out: null });
        }

        await fetch(`http://localhost:3001/attendance/${todayRecord.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...todayRecord,
            sessions
          }),
        });
      }

      await fetchTodayData();
    } catch (error) {
      console.error(error);
    }
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
      <div style={{ fontSize: "14px", color: "var(--text-main)" }}>
        <p style={{ margin: "4px 0" }}>In: {punchInTime?.toLocaleTimeString() || "--"}</p>
        <p style={{ margin: "4px 0" }}>Out: {punchOutTime?.toLocaleTimeString() || "--"}</p>
        <p style={{ margin: "4px 0", fontWeight: "600" }}>Worked Today: {workedHours}</p>
      </div>
    </div>
  );
}

export default PunchButton;