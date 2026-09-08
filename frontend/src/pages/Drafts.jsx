import { useEffect, useState } from "react";
import { FileText, Inbox, CheckCircle } from "lucide-react";
import api from "../api/api";

function Drafts() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      const res = await api.get("/drafts");
      setDrafts(res.data);
    } catch (error) {
      console.error("Failed to load drafts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    setActionLoading((prev) => ({ ...prev, [`${id}-${action}`]: true }));
    try {
      await api.post(`/${action}/${id}`);
      await fetchDrafts();
    } catch (error) {
      console.error(`Failed to ${action}:`, error);
    } finally {
      setActionLoading((prev) => ({ ...prev, [`${id}-${action}`]: false }));
    }
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getBadgeClass = (status) => {
    return `badge badge-${status || "pending"}`;
  };

  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner spinner-dark" />
        <span>Loading drafts...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>
          <FileText size={24} />
          Blog Drafts
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
          {drafts.length} drafts
        </span>
      </div>

      {drafts.length === 0 ? (
        <div className="empty-state">
          <Inbox size={48} />
          <h3>No drafts yet</h3>
          <p>
            Generate blog drafts from approved feeds on the Feeds page. AI will
            create SEO-friendly articles for you.
          </p>
        </div>
      ) : (
        <div className="data-grid">
          {drafts.map((draft) => (
            <div className="item-card" key={draft.id}>
              <div className="item-card-header">
                <h3>{draft.title}</h3>
                <span className={getBadgeClass(draft.status)}>
                  {draft.status}
                </span>
              </div>

              <div className="item-card-body">
                <p
                  style={{
                    WebkitLineClamp: expanded[draft.id] ? "unset" : 3,
                    overflow: expanded[draft.id] ? "visible" : "hidden",
                    display: expanded[draft.id] ? "block" : "-webkit-box",
                    whiteSpace: expanded[draft.id] ? "pre-wrap" : "normal",
                  }}
                >
                  {draft.content || "No content available."}
                </p>
                {draft.content && draft.content.length > 150 && (
                  <button
                    className="btn-ghost btn-sm"
                    onClick={() => toggleExpand(draft.id)}
                    style={{ marginTop: 8 }}
                  >
                    {expanded[draft.id] ? "Show less" : "Read more"}
                  </button>
                )}
              </div>

              <div className="item-card-footer">
                {draft.status === "pending" && (
                  <>
                    <button
                      className="btn-success btn-sm"
                      onClick={() =>
                        handleAction(draft.id, "approve-draft")
                      }
                      disabled={
                        actionLoading[`${draft.id}-approve-draft`]
                      }
                    >
                      {actionLoading[`${draft.id}-approve-draft`] ? (
                        <div className="spinner" />
                      ) : (
                        "Approve & Queue"
                      )}
                    </button>

                    <button
                      className="btn-danger btn-sm"
                      onClick={() =>
                        handleAction(draft.id, "reject-draft")
                      }
                      disabled={
                        actionLoading[`${draft.id}-reject-draft`]
                      }
                    >
                      {actionLoading[`${draft.id}-reject-draft`] ? (
                        <div className="spinner" />
                      ) : (
                        "Reject"
                      )}
                    </button>
                  </>
                )}

                {draft.status === "approved" && (
                  <span
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: "var(--accent-emerald)",
                      display: "flex",
                      alignItems: "center",
                      gap: 4
                    }}
                  >
                    <CheckCircle size={14} /> Approved — queued for publishing
                  </span>
                )}

                {draft.status === "rejected" && (
                  <span
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: "var(--text-muted)",
                    }}
                  >
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

export default Drafts;
