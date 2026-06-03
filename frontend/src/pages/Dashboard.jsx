import "./Dashboard.css";

function Dashboard() {
  return (
    <>
      <h1 className="page-title">Travel Content Agent</h1>

      <div className="stats">
        <div className="stat-card">
          <h2>Feeds</h2>
        </div>

        <div className="stat-card">
          <h2>Drafts</h2>
        </div>

        <div className="stat-card">
          <h2>Queue</h2>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
