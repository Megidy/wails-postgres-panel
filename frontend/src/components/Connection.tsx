import React, { useState } from "react";
import { CreateConnection } from "../../wailsjs/go/main/App";
import { entity } from "../../wailsjs/go/models";

function CreateConn() {
  const [uri, setUri] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const createConnection = async () => {
    setError("");
    setLoading(true);

    try {
      const res: entity.Response__wails_postgres_panel_connection_Connection_ =
        await CreateConnection(uri, name, desc);

      if (res.response_metadata.has_error) {
        setError(res.response_metadata.err);
        return;
      }

      // success
      console.log("Connection created:", res.data);
      setUri("");
      setName("");
      setDesc("");
    } catch (err: any) {
      setError(err.message || "failed to create connection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, padding: 20 }}>
      <h2>Create connection</h2>

      <div style={{ marginBottom: 10 }}>
        <label>Postgres URI</label>
        <input
          type="text"
          value={uri}
          onChange={(e) => setUri(e.target.value)}
          placeholder="postgres://user:pass@host:5432/db"
          style={{ width: "100%", padding: 6 }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Local DB"
          style={{ width: "100%", padding: 6 }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Description</label>
        <input
          type="text"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="optional"
          style={{ width: "100%", padding: 6 }}
        />
      </div>

      <button
        onClick={createConnection}
        disabled={loading}
        style={{ padding: "8px 16px", cursor: "pointer" }}
      >
        {loading ? "Creating..." : "Create"}
      </button>

      {error && <div style={{ marginTop: 10, color: "red" }}>{error}</div>}
    </div>
  );
}

export default CreateConn;
