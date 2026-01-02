import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connection } from "../../wailsjs/go/models";
import { Connect, GetAllConnections } from "../../wailsjs/go/main/App";
import CreateConn from "../components/Connection";

const DbIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#3182ce"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
  </svg>
);

const PlusIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#a0aec0"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export function Connections() {
  const [connections, setConnections] = useState<connection.Connection[]>([]);
  const [error, setError] = useState(""); // General page error
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [connectingId, setConnectingId] = useState<number | null>(null);

  const navigate = useNavigate();

  async function loadConnections() {
    // Only set global loading on first load to avoid flickering
    if (connections.length === 0) setLoading(true);
    setError("");

    try {
      const res = await GetAllConnections();

      if (res.response_metadata.has_error) {
        // If it fails, we show the error but don't clear existing list if we have one
        setError(res.response_metadata.err);
      } else {
        setConnections(res.data ?? []);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load connections");
    } finally {
      setLoading(false);
    }
  }

  async function handleConnect(connectionId: number) {
    if (connectingId !== null) return;

    setConnectingId(connectionId);
    setError("");

    try {
      const res = await Connect(connectionId);

      if (res.response_metadata.has_error) {
        setError(res.response_metadata.err);
        setConnectingId(null);
        return;
      }

      navigate(`/connection/${connectionId}/query`);
    } catch (err: any) {
      setError(err.message || "Failed to establish connection");
      setConnectingId(null);
    }
  }

  const handleCreateSuccess = () => {
    setShowCreate(false);
    loadConnections();
  };

  useEffect(() => {
    loadConnections();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.pageTitle}>Connections</h2>
        <p style={styles.subTitle}>Manage your database instances</p>
      </div>

      {error && <div style={styles.errorBanner}>{error}</div>}

      <div style={styles.grid}>
        <div
          style={{ ...styles.card, ...styles.addCard }}
          onClick={() => setShowCreate(true)}
        >
          <div style={styles.iconWrapperDashed}>
            <PlusIcon />
          </div>
          <span style={styles.addText}>New Connection</span>
        </div>

        {connections.map((conn) => (
          <div
            key={conn.connection_id}
            style={styles.card}
            onClick={() => handleConnect(conn.connection_id)}
          >
            <div style={styles.iconWrapper}>
              <DbIcon />
            </div>
            <div style={styles.cardContent}>
              <h3 style={styles.cardTitle}>{conn.name}</h3>
              <p style={styles.cardDesc}>
                {conn.description || "No description"}
              </p>
            </div>

            {/* Loading Overlay for specific card */}
            {connectingId === conn.connection_id && (
              <div style={styles.loadingOverlay}>
                <div style={styles.spinner}></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {loading && connections.length === 0 && (
        <div style={{ marginTop: 40, color: "#718096" }}>Loading...</div>
      )}

      {showCreate && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalContainer}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0 }}>Add New Connection</h3>
              <button
                onClick={() => setShowCreate(false)}
                style={styles.closeBtn}
              >
                &times;
              </button>
            </div>

            <CreateConn
              onSuccess={handleCreateSuccess}
              onCancel={() => setShowCreate(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "40px",
    backgroundColor: "#f7fafc",
    minHeight: "100vh",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  header: { marginBottom: "30px" },
  pageTitle: { margin: "0", color: "#2d3748", fontSize: "24px" },
  subTitle: { margin: "5px 0 0", color: "#718096", fontSize: "14px" },

  errorBanner: {
    padding: "12px",
    backgroundColor: "#fed7d7",
    color: "#c53030",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid #feb2b2",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },

  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid #e2e8f0",
    cursor: "pointer",
    position: "relative",
    transition: "transform 0.2s, box-shadow 0.2s",
    overflow: "hidden",
    height: "180px", // Fixed height for uniformity
  },

  addCard: {
    border: "2px dashed #cbd5e0",
    backgroundColor: "transparent",
    boxShadow: "none",
  },

  iconWrapper: {
    padding: "12px",
    backgroundColor: "#ebf8ff",
    borderRadius: "50%",
    marginBottom: "16px",
  },
  iconWrapperDashed: {
    padding: "12px",
    backgroundColor: "#edf2f7",
    borderRadius: "50%",
    marginBottom: "16px",
  },

  cardContent: { width: "100%" },
  cardTitle: { margin: "0 0 4px", fontSize: "16px", color: "#2d3748" },
  cardDesc: {
    margin: 0,
    fontSize: "13px",
    color: "#718096",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  addText: { fontWeight: "600", color: "#718096" },

  // Spinner / Connecting state
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    width: "24px",
    height: "24px",
    border: "3px solid #e2e8f0",
    borderTopColor: "#3182ce",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  modalBackdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: "white",
    width: "480px",
    borderRadius: "12px",
    padding: "30px",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    position: "relative",
    animation: "fadeIn 0.2s ease-out",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    borderBottom: "1px solid #edf2f7",
    paddingBottom: "16px",
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    fontSize: "24px",
    lineHeight: "1",
    cursor: "pointer",
    color: "#a0aec0",
  },
};
