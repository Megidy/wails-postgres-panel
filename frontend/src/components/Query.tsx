import { useState } from "react";
import { ExecuteQuery } from "../../wailsjs/go/main/App";
import { entity } from "../../wailsjs/go/models";

function Query() {
  const [query, setQuery] = useState<string>("");
  const [result, setResult] = useState<string[][] | null>(null);
  const [error, setError] = useState<string>("");

  const executeQuery = async () => {
    const res: entity.Response__wails_postgres_panel_connection_ExecutionResult_ =
      await ExecuteQuery(1, query);
    if (res.response_metadata.has_error == true) {
      setError(res.response_metadata.err);
      setResult(null);
    } else {
      setResult(res.data?.data ?? null);
      setError("");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter SQL query"
        style={{ width: "100%", height: "150px", fontFamily: "monospace" }}
      />

      <button
        onClick={executeQuery}
        style={{ marginTop: "10px", padding: "8px 16px", cursor: "pointer" }}
      >
        Execute Query
      </button>

      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}

      {result && (
        <table
          style={{
            marginTop: "20px",
            borderCollapse: "collapse",
            width: "100%",
          }}
        >
          <thead>
            <tr>
              {result[0].map((col, i) => (
                <th
                  key={i}
                  style={{
                    border: "1px solid black",
                    padding: "4px",
                    background: "#eee",
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, i) => (
                  <td
                    key={i}
                    style={{ border: "1px solid black", padding: "4px" }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Query;
