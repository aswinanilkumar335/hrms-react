import { useEffect, useState } from "react";

function PunchButton() {
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchInTime, setPunchInTime] = useState<Date | null>(null);
  const [punchOutTime, setPunchOutTime] = useState<Date | null>(null);

  //  Load saved data (on page load)
  useEffect(() => {
    const storedData = localStorage.getItem("attendance");

    if (storedData) {
      const data = JSON.parse(storedData);

      setIsPunchedIn(data.isPunchedIn);
      setPunchInTime(data.punchInTime ? new Date(data.punchInTime) : null);
      setPunchOutTime(data.punchOutTime ? new Date(data.punchOutTime) : null);
    }
  }, []);

  //  Save data whenever state changes
  useEffect(() => {
    localStorage.setItem(
      "attendance",
      JSON.stringify({
        isPunchedIn,
        punchInTime,
        punchOutTime,
      })
    );
  }, [isPunchedIn, punchInTime, punchOutTime]);

  //  Handle Punch
  const handlePunch = () => {
    const now = new Date();

    if (!isPunchedIn) {
      setPunchInTime(now);
      setPunchOutTime(null);
      setIsPunchedIn(true);
    } else {
      setPunchOutTime(now);
      setIsPunchedIn(false);
    }
  };

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