import { useEffect, useState } from "react";
import { Send, Inbox } from "lucide-react";
import api from "../api/api";

function Queue() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const res = await api.get("/publishing-queue");
      setQueue(res.data);
    } catch (error) {
      console.error("Failed to load publishing queue:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await api.post(`/publish/${id}`);
      await fetchQueue();
    } catch (error) {
      console.error("Failed to publish:", error);
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const getPlatformClass = (platform) => {
    return `platform-badge platform-${platform || "x"}`;
  };

  const getBadgeClass = (status) => {
    return `badge badge-${status || "pending"}`;
  };

  const getPlatformEmoji = (platform) => {
    const map = {
      linkedin: "💼",
      instagram: "📸",
      facebook: "👥",
      x: "𝕏",
    };
    return map[platform] || "📱";
  };

  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner spinner-dark" />
        <span>Loading queue...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>
          <Send size={24} />
          Publishing Queue
        </h1>
        <span
          style={{
            fontSize: "0.875rem",
            color: "var(--text-muted)",
            fontWeight: 500,
            background: "var(--bg-card)",
            padding: "6px 14px",
            borderRadius: 20,
            border: "1px solid var(--border-light)",
          }}
        >
          {queue.length} items
        </span>
      </div>

      {queue.length === 0 ? (
        <div className="empty-state">
          <Inbox size={48} />
          <h3>Queue is empty</h3>
          <p>
            Approve blog drafts to automatically queue them for publishing
            across LinkedIn, Instagram, Facebook, and X.
          </p>
        </div>
      ) : (
        <div className="data-grid">
          {queue.map((item) => (
            <div className="item-card" key={item.id}>
              <div className="item-card-header">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: "1.25rem" }}>
                    {getPlatformEmoji(item.platform)}
                  </span>
                  <div>
                    <span className={getPlatformClass(item.platform)}>
                      {item.platform}
                    </span>
                  </div>
                </div>
                <span className={getBadgeClass(item.status)}>
                  {item.status}
                </span>
              </div>

              <div className="item-card-body">
                <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                  Draft #{item.draft_id}
                </p>
              </div>

              <div className="item-card-footer">
                {item.status === "pending" ? (
                  <button
                    className="btn-sky btn-sm"
                    onClick={() => handlePublish(item.id)}
                    disabled={actionLoading[item.id]}
                  >
                    {actionLoading[item.id] ? (
                      <>
                        <div className="spinner" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        Publish
                      </>
                    )}
                  </button>
                ) : (
                  <span
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: "var(--accent-sky)",
                    }}
                  >
                    ✅ Published
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Queue;
