import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ExecuteQuery } from "../../wailsjs/go/main/App";
import { entity } from "../../wailsjs/go/models";
import { ResultsTable } from "../components/ResultsTable";

// Icons
const PlayIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const BackIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

function Query() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [query, setQuery] = useState<string>("");
  const [result, setResult] = useState<string[][] | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [execTime, setExecTime] = useState<number | null>(null);

  const executeQuery = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setResult(null); // Clear previous results while loading
    setError("");
    const startTime = performance.now();

    try {
      const connId = Number(id);
      if (isNaN(connId)) throw new Error("Invalid Connection ID");

      const res: entity.Response__wails_postgres_panel_connection_ExecutionResult_ =
        await ExecuteQuery(connId, query);

      if (res.response_metadata.has_error) {
        setError(res.response_metadata.err);
      } else {
        setResult(res.data?.data ?? []);
      }
    } catch (err: any) {
      setError(err.message || "Failed to execute query");
    } finally {
      setExecTime(performance.now() - startTime);
      setLoading(false);
    }
  };

  // Allow Ctrl+Enter to submit
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === "Enter") {
      executeQuery();
    }
  };

  return (
    <div style={styles.container}>
      {/* Header Bar */}
      <div style={styles.header}>
        <button
          onClick={() => navigate("/connections")}
          style={styles.backButton}
        >
          <BackIcon />
          <span style={{ marginLeft: 8 }}>Connections</span>
        </button>
        <h2 style={styles.title}>
          Query Editor <span style={styles.idBadge}>ID: {id}</span>
        </h2>
      </div>

      {/* Editor Section */}
      <div style={styles.editorContainer}>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="SELECT * FROM users LIMIT 100;"
          spellCheck={false}
          style={styles.textarea}
        />

        <div style={styles.controlsBar}>
          <button
            onClick={executeQuery}
            disabled={loading}
            style={{
              ...styles.runButton,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "wait" : "pointer",
            }}
          >
            <PlayIcon />
            <span style={{ marginLeft: 6 }}>
              {loading ? "Running..." : "Run Query"}
            </span>
          </button>

          <div style={styles.metaInfo}>
            {execTime !== null && !loading && (
              <span style={{ marginRight: 15 }}>⏱ {execTime.toFixed(0)}ms</span>
            )}
            {result && <span>{result.length - 1} rows</span>}
          </div>
        </div>
      </div>

      {/* Error Output */}
      {error && (
        <div style={styles.errorBanner}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Results Section */}
      <div style={styles.resultsArea}>
        <ResultsTable data={result || []} />
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "30px",
    backgroundColor: "#f7fafc",
    minHeight: "100vh",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    margin: 0,
    fontSize: "1.2rem",
    color: "#2d3748",
    display: "flex",
    alignItems: "center",
  },
  idBadge: {
    fontSize: "0.8rem",
    backgroundColor: "#edf2f7",
    color: "#718096",
    padding: "2px 8px",
    borderRadius: "12px",
    marginLeft: "10px",
    fontWeight: "normal",
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    background: "none",
    border: "none",
    color: "#718096",
    cursor: "pointer",
    marginRight: "20px",
    padding: "5px",
    borderRadius: "4px",
    transition: "background 0.2s",
  },

  // Editor
  editorContainer: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid #e2e8f0",
    marginBottom: "20px",
    overflow: "hidden",
  },
  textarea: {
    width: "100%",
    height: "150px",
    border: "none",
    padding: "15px",
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontSize: "14px",
    resize: "vertical",
    outline: "none",
    backgroundColor: "#fff",
    color: "#2d3748",
    boxSizing: "border-box",
  },
  controlsBar: {
    padding: "10px 15px",
    borderTop: "1px solid #edf2f7",
    backgroundColor: "#f8fafc",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  runButton: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#3182ce",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    fontWeight: "600",
    fontSize: "0.9rem",
    boxShadow: "0 2px 4px rgba(49, 130, 206, 0.2)",
  },
  metaInfo: {
    fontSize: "0.85rem",
    color: "#718096",
    fontFamily: "monospace",
  },

  // Error
  errorBanner: {
    backgroundColor: "#fff5f5",
    color: "#c53030",
    padding: "12px 16px",
    borderRadius: "6px",
    border: "1px solid #feb2b2",
    marginBottom: "20px",
    fontSize: "0.9rem",
  },

  // Results
  resultsArea: {
    flex: 1,
    minHeight: "0",
  },
};

export default Query;
