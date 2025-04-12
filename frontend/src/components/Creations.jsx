import { useState, useEffect } from "react";
import { getCreations } from "../services/api";
import { styles } from "../styles";

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

  console.log(creations);

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
    <div style={styles.pageContainer}>
      <h1 style={styles.subHeading}>Creation Gallery</h1>

      {loading && (
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p>Loading creations...</p>
        </div>
      )}

      {error && !loading && (
        <div style={{ ...styles.messageContainer, color: "red" }}>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && creations.length === 0 && (
        <div style={styles.messageContainer}>
          <p>No creations found. Start by generating some images!</p>
        </div>
      )}

      {!loading && !error && creations.length > 0 && (
        <>
          <div style={styles.galleryGrid}>
            {creations.map((creation) => (
              <div key={creation.id} style={styles.galleryItem}>
                <img
                  src={creation.image}
                  alt={creation.textprompt}
                  style={styles.galleryImage}
                />
                <div style={styles.galleryCaption}>
                  <p style={styles.galleryPrompt}>{creation.textprompt}</p>
                  <p style={styles.galleryDate}>
                    {new Date(creation.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination controls */}
          <div style={styles.paginationControls}>
            <button
              onClick={handlePrevPage}
              disabled={page <= 1}
              style={{
                ...styles.button,
                ...(page <= 1 ? styles.buttonDisabled : {}),
              }}
            >
              Previous
            </button>
            <span style={styles.paginationInfo}>
              Page {page} of {totalPages || 1}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page >= totalPages}
              style={{
                ...styles.button,
                ...(page >= totalPages ? styles.buttonDisabled : {}),
              }}
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
