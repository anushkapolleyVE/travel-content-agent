import { useEffect, useState } from "react";
import { Newspaper, Inbox } from "lucide-react";
import api from "../api/api";
import "./Feeds.css";

function Feeds() {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchFeeds();
  }, []);

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

  const handleAction = async (id, action) => {
    setActionLoading((prev) => ({ ...prev, [`${id}-${action}`]: true }));
    try {
      if (action === "generate") {
        await api.post(`/generate/${id}`);
      } else {
        await api.post(`/${action}/${id}`);
      }
      await fetchFeeds();
    } catch (error) {
      console.error(`Failed to ${action} feed:`, error);
    } finally {
      setActionLoading((prev) => ({ ...prev, [`${id}-${action}`]: false }));
    }
  };

  const getBadgeClass = (status) => {
    return `badge badge-${status || "pending"}`;
  };

  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner spinner-dark" />
        <span>Loading feeds...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>
          <Newspaper size={24} />
          RSS Feeds
        </h1>
        <span className="feed-count">{feeds.length} feeds</span>
      </div>

      {feeds.length === 0 ? (
        <div className="empty-state">
          <Inbox size={48} />
          <h3>No feeds yet</h3>
          <p>
            Go to the Dashboard and click "Collect Feeds" to pull the latest
            travel articles from RSS sources.
          </p>
        </div>
      ) : (
        <div className="data-grid">
          {feeds.map((feed) => (
            <div className="item-card" key={feed.id}>
              <div className="item-card-header">
                <h3>{feed.title}</h3>
                <span className={getBadgeClass(feed.status)}>
                  {feed.status}
                </span>
              </div>

              {feed.summary && (
                <div className="item-card-body">
                  <p>{feed.summary}</p>
                </div>
              )}

              <div className="item-card-footer">
                {feed.status === "pending" && (
                  <>
                    <button
                      className="btn-success btn-sm"
                      onClick={() => handleAction(feed.id, "approve")}
                      disabled={actionLoading[`${feed.id}-approve`]}
                    >
                      {actionLoading[`${feed.id}-approve`] ? (
                        <div className="spinner" />
                      ) : (
                        "Approve"
                      )}
                    </button>

                    <button
                      className="btn-danger btn-sm"
                      onClick={() => handleAction(feed.id, "reject")}
                      disabled={actionLoading[`${feed.id}-reject`]}
                    >
                      {actionLoading[`${feed.id}-reject`] ? (
                        <div className="spinner" />
                      ) : (
                        "Reject"
                      )}
                    </button>
                  </>
                )}

                {(feed.status === "pending" ||
                  feed.status === "approved") && (
                  <button
                    className="btn-primary btn-sm"
                    onClick={() => handleAction(feed.id, "generate")}
                    disabled={actionLoading[`${feed.id}-generate`]}
                  >
                    {actionLoading[`${feed.id}-generate`] ? (
                      <>
                        <div className="spinner" />
                        Generating...
                      </>
                    ) : (
                      "Generate Blog"
                    )}
                  </button>
                )}

                {feed.status === "generated" && (
                  <span className="feed-done-text">✨ Draft created</span>
                )}

                {feed.status === "rejected" && (
                  <span className="feed-done-text rejected-text">
                    Rejected
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

export default Feeds;
