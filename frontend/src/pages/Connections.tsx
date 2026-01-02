import React, { useEffect, useState } from "react";
import { connection, entity } from "../../wailsjs/go/models";
import { GetAllConnections } from "../../wailsjs/go/main/App";
import CreateConn from "../components/Connection";
import { ConnectionList } from "../components/ConnectionsList";

export function Connections() {
  const [connections, setConnections] = useState<connection.Connection[]>([]);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(false);

  async function loadConnections() {
    setLoading(true);
    setError("");

    try {
      const res: entity.Response____wails_postgres_panel_connection_Connection_ =
        await GetAllConnections();

      if (res.response_metadata.has_error) {
        setError(res.response_metadata.err);
        return;
      }

      setConnections(res.data ?? []);
    } catch (err: any) {
      setError(err.message || "failed to load connections");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadConnections();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Connections</h2>

        <button onClick={() => setShowCreate((v) => !v)}>
          {showCreate ? "Close" : "Add connection"}
        </button>
      </div>

      {showCreate && (
        <div style={{ marginTop: 20 }}>
          <CreateConn />
        </div>
      )}

      {loading && <div>Loading...</div>}

      {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}

      {!loading && !error && <ConnectionList connections={connections} />}
    </div>
  );
}
