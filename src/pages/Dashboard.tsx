import { useEffect, useState } from "react";
import Card from "../components/Card";
import PunchButton from "../components/PunchButton";
import AttendanceChart from "../components/AttendanceChart";

function Dashboard() {
  const [punchInTime, setPunchInTime] = useState<Date | null>(null);
  const [punchOutTime, setPunchOutTime] = useState<Date | null>(null);

  // Load data from localStorage
  useEffect(() => {
    const interval = setInterval(() => {
      const storedData = localStorage.getItem("attendance");

      if (storedData) {
        const data = JSON.parse(storedData);

        setPunchInTime(data.punchInTime ? new Date(data.punchInTime) : null);
        setPunchOutTime(data.punchOutTime ? new Date(data.punchOutTime) : null);
      }
    }, 1000); // check every 1 second

    return () => clearInterval(interval);
  }, []);

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Calculate worked hours
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
    <div>
      <h2 style={{ marginBottom: "20px" }}>Dashboard</h2>

      <Card title="Welcome">
        <h3 style={{ margin: 0 }}>Good Morning 👋</h3>
        <p style={{ color: "#666" }}>
          {time.toLocaleTimeString()}
        </p>
      </Card>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "16px",
        }}
      >
        <Card title="Today Status">
          <p>
            {punchOutTime
              ? "Completed"
              : punchInTime
                ? "Working"
                : "Not Started"}
          </p>
        </Card>

        {/* Attendance Card */}
        <Card title="Attendance">
          <p>In: {punchInTime?.toLocaleTimeString() || "--"}</p>
          <p>Out: {punchOutTime?.toLocaleTimeString() || "--"}</p>
          <p>Hours: {getWorkedHours()}</p>
        </Card>

        {/* Punch Button */}
        <Card title="Punch Status">
          <PunchButton />
        </Card>

        {/* Leaves */}
        <Card title="Leaves">
          <p>Remaining: 10</p>
        </Card>

        <Card title="Weekly Work Hours">
          <AttendanceChart />
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;