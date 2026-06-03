import { useEffect, useState } from "react";
import api from "../api/api";

function Queue() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchQueue();
  }, []);

  const loadQueue = async () => {
    try {
      const res = await api.get("/publishing-queue");
      setQueue(res.data);
    } catch (error) {
      console.error("Failed to reload queue:", error);
    }
  };

  const publish = async (id) => {
    try {
      await api.post(`/publish/${id}`);
      await loadQueue();
    } catch (error) {
      console.error("Failed to publish:", error);
    }
  };

  if (loading) {
    return <h2>Loading queue...</h2>;
  }

  return (
    <div>
      <h2>Publishing Queue</h2>

      {queue.length === 0 ? (
        <p>No publishing jobs found.</p>
      ) : (
        queue.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid gray",
              margin: "10px",
              padding: "10px",
            }}
          >
            <h3>{item.platform}</h3>

            <p>Status: {item.status}</p>

            <button onClick={() => publish(item.id)}>Publish</button>
          </div>
        ))
      )}
    </div>
  );
}

export default Queue;
