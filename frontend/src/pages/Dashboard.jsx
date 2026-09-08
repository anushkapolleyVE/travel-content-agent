import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Newspaper,
  FileText,
  Send,
  RefreshCw,
} from "lucide-react";
import api from "../api/api";
import "./Dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState({
    feeds: 0,
    drafts: 0,
    queue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [collecting, setCollecting] = useState(false);
  const [collectMsg, setCollectMsg] = useState("");

  const fetchStats = async () => {
    try {
      const res = await api.get("/stats");
      setStats(res.data);
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleCollect = async () => {
    setCollecting(true);
    setCollectMsg("");
    try {
      const res = await api.post("/collect");
      setCollectMsg(res.data.message);
      await fetchStats();
    } catch (error) {
      setCollectMsg("Failed to collect feeds");
      console.error("Failed to collect:", error);
    } finally {
      setCollecting(false);
      setTimeout(() => setCollectMsg(""), 4000);
    }
  };

  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner spinner-dark" />
        <span>Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>
          <LayoutDashboard size={24} />
          Dashboard
        </h1>

        <button
          className="btn-primary"
          onClick={handleCollect}
          disabled={collecting}
        >
          {collecting ? (
            <>
              <div className="spinner" />
              Collecting...
            </>
          ) : (
            <>
              <RefreshCw size={16} />
              Collect Feeds
            </>
          )}
        </button>
      </div>

      {collectMsg && (
        <div className="collect-feedback action-feedback">
          {collectMsg}
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon indigo">
            <Newspaper size={22} />
          </div>
          <div className="stat-info">
            <h2>{stats.feeds}</h2>
            <p>Total Feeds</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon emerald">
            <FileText size={22} />
          </div>
          <div className="stat-info">
            <h2>{stats.drafts}</h2>
            <p>Blog Drafts</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon sky">
            <Send size={22} />
          </div>
          <div className="stat-info">
            <h2>{stats.queue}</h2>
            <p>Queue Items</p>
          </div>
        </div>
      </div>

      <div className="dashboard-tips card">
        <h3>🚀 Quick Start</h3>
        <ol>
          <li>
            Click <strong>Collect Feeds</strong> to pull the latest travel
            articles from RSS sources.
          </li>
          <li>
            Go to <strong>Feeds</strong> to review, approve, and generate AI
            blog drafts.
          </li>
          <li>
            Review drafts in <strong>Drafts</strong> — approved drafts are
            automatically queued for publishing.
          </li>
          <li>
            Publish content to social platforms from the <strong>Queue</strong>{" "}
            page.
          </li>
        </ol>
      </div>
    </div>
  );
}

export default Dashboard;
