import React, { useState } from "react";
import { CreateConnection } from "../../wailsjs/go/main/App";

interface CreateConnProps {
  onSuccess: () => void;
  onCancel: () => void;
}

function CreateConn({ onSuccess, onCancel }: CreateConnProps) {
  const [uri, setUri] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!uri || !name) {
      setError("URI and Name are required.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await CreateConnection(uri, name, desc);

      if (res.response_metadata.has_error) {
        setError(res.response_metadata.err);
        setLoading(false);
        return;
      }

      // Success
      setUri("");
      setName("");
      setDesc("");
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to create connection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      {error && <div style={styles.errorAlert}>{error}</div>}

      <div style={styles.formGroup}>
        <label style={styles.label}>Connection Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Production DB"
          style={styles.input}
          disabled={loading}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Postgres URI</label>
        <input
          type="text"
          value={uri}
          onChange={(e) => setUri(e.target.value)}
          placeholder="postgres://user:pass@host:5432/db"
          style={styles.input}
          disabled={loading}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Description (Optional)</label>
        <input
          type="text"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Short description..."
          style={styles.input}
          disabled={loading}
        />
      </div>

      <div style={styles.buttonGroup}>
        <button
          onClick={onCancel}
          style={styles.cancelButton}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            ...styles.createButton,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "wait" : "pointer",
          }}
        >
          {loading ? "Creating..." : "Create Connection"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  formGroup: { marginBottom: "15px" },
  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: "500",
    color: "#4a5568",
    fontSize: "0.9rem",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #cbd5e0",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box" as const,
  },
  errorAlert: {
    padding: "10px",
    backgroundColor: "#fff5f5",
    color: "#c53030",
    border: "1px solid #fc8181",
    borderRadius: "6px",
    marginBottom: "15px",
    fontSize: "0.9rem",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "20px",
  },
  cancelButton: {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "1px solid #cbd5e0",
    backgroundColor: "#fff",
    color: "#4a5568",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  createButton: {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#3182ce",
    color: "#fff",
    fontWeight: "600",
    fontSize: "0.9rem",
  },
};

export default CreateConn;
