import { useEffect, useState } from "react";
import api from "../api/api";

function Drafts() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchDrafts();
  }, []);

  const loadDrafts = async () => {
    try {
      const res = await api.get("/drafts");
      setDrafts(res.data);
    } catch (error) {
      console.error("Failed to reload drafts:", error);
    }
  };

  const approveDraft = async (id) => {
    try {
      await api.post(`/approve-draft/${id}`);
      await loadDrafts();
    } catch (error) {
      console.error("Failed to approve draft:", error);
    }
  };

  const rejectDraft = async (id) => {
    try {
      await api.post(`/reject-draft/${id}`);
      await loadDrafts();
    } catch (error) {
      console.error("Failed to reject draft:", error);
    }
  };

  if (loading) {
    return <h2>Loading drafts...</h2>;
  }

  return (
    <div>
      <h2>Drafts</h2>

      {drafts.length === 0 ? (
        <p>No drafts found.</p>
      ) : (
        drafts.map((draft) => (
          <div
            key={draft.id}
            style={{
              border: "1px solid gray",
              margin: "10px",
              padding: "10px",
            }}
          >
            <h3>{draft.title}</h3>

            <p>Status: {draft.status}</p>

            <button onClick={() => approveDraft(draft.id)}>Approve</button>

            <button
              onClick={() => rejectDraft(draft.id)}
              style={{ marginLeft: "10px" }}
            >
              Reject
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Drafts;
