import { useEffect, useState } from "react";
import api from "../api/api";
import "./Feeds.css";

function Feeds() {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const res = await api.get("/feeds");
        setFeeds(res.data);
      } catch (error) {
        console.error("Failed to load feeds:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeeds();
  }, []);

  const loadFeeds = async () => {
    try {
      const res = await api.get("/feeds");
      setFeeds(res.data);
    } catch (error) {
      console.error("Failed to reload feeds:", error);
    }
  };

  const approve = async (id) => {
    try {
      await api.post(`/approve/${id}`);
      await loadFeeds();
    } catch (error) {
      console.error("Failed to approve feed:", error);
    }
  };

  const reject = async (id) => {
    try {
      await api.post(`/reject/${id}`);
      await loadFeeds();
    } catch (error) {
      console.error("Failed to reject feed:", error);
    }
  };

  const generate = async (id) => {
    try {
      await api.get(`/generate/${id}`);
      await loadFeeds();
    } catch (error) {
      console.error("Failed to generate blog:", error);
    }
  };

  if (loading) {
    return <h2>Loading feeds...</h2>;
  }

  return (
    <div className="feed-grid">
      {feeds.map((feed) => (
        <div className="feed-card" key={feed.id}>
          <h3>{feed.title}</h3>

          <p className="feed-status">Status: {feed.status}</p>

          <div className="actions">
            <button className="approve-btn" onClick={() => approve(feed.id)}>
              Approve
            </button>

            <button className="reject-btn" onClick={() => reject(feed.id)}>
              Reject
            </button>

            <button className="generate-btn" onClick={() => generate(feed.id)}>
              Generate
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Feeds;
