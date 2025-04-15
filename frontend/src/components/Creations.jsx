import { useState, useEffect } from "react";
import { getCreations } from "../services/api";

function Creations() {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 9; // Number of items per page

  // Fetch creations when component mounts or page changes
  useEffect(() => {
    const fetchCreations = async () => {
      try {
        setLoading(true);
        const data = await getCreations(page, limit);
        setCreations(data.creations);
        setTotalCount(data.count);
        setError(null);
      } catch (err) {
        setError("Failed to load creations. Please try again later.");
        console.error("Error fetching creations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCreations();
  }, [page]);

  // Handle pagination
  const totalPages = Math.ceil(totalCount / limit);

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className="page-container">
      <h1 className="sub-heading">Creation Gallery</h1>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading creations...</p>
        </div>
      )}

      {error && !loading && (
        <div className="message-container" style={{ color: "red" }}>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && creations.length === 0 && (
        <div className="message-container">
          <p>No creations found. Start by generating some images!</p>
        </div>
      )}

      {!loading && !error && creations.length > 0 && (
        <>
          <div className="gallery-grid">
            {creations.map((creation) => (
              <div key={creation.id} className="gallery-item">
                <img
                  src={creation.image}
                  alt={creation.textprompt}
                  className="gallery-image"
                />
                <div className="gallery-caption">
                  <p className="gallery-prompt">{creation.textprompt}</p>
                  <p className="gallery-date">
                    {new Date(creation.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination controls */}
          <div className="pagination-controls">
            <button
              onClick={handlePrevPage}
              disabled={page <= 1}
              className={`button ${page <= 1 ? "button-disabled" : ""}`}
            >
              Previous
            </button>
            <span className="pagination-info">
              Page {page} of {totalPages || 1}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page >= totalPages}
              className={`button ${
                page >= totalPages ? "button-disabled" : ""
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Creations;
