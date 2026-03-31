import Card from "../components/Card";
// import PunchButton from "../components/PunchButton";

function Dashboard() {
  return (
    <div>

      <h2 style={{ marginBottom: "20px" }}>Dashboard</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px"
      }}>

        <Card title="Attendance">
          <p>In: --</p>
          <p>Out: --</p>
          <p>Hours: 0h</p>
        </Card>

        {/* <Card title="Punch Status">
          <PunchButton />
        </Card> */}

        <Card title="Leaves">
          <p>Remaining: 10</p>
        </Card>

      </div>

    </div>
  );
}

export default Dashboard;