import React, { useState, useRef, useEffect } from "react";

interface ResultsTableProps {
  data: string[][];
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ data }) => {
  const [modalContent, setModalContent] = useState<string | null>(null);

  if (!data || data.length === 0) {
    return <div style={styles.emptyState}>No results to display.</div>;
  }

  const headers = data[0];
  const rows = data.slice(1);

  return (
    <>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              {headers.map((col, i) => (
                <ResizableHeader key={i} title={col} />
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} style={styles.row}>
                {row.map((cell, i) => (
                  <DataCell
                    key={i}
                    content={cell}
                    onExpand={() => setModalContent(cell)}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Large Data Modal */}
      {modalContent && (
        <div style={styles.modalBackdrop} onClick={() => setModalContent(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3>Cell Content</h3>
              <button
                onClick={() => setModalContent(null)}
                style={styles.closeBtn}
              >
                ✕
              </button>
            </div>
            <pre style={styles.jsonPre}>{tryFormatJson(modalContent)}</pre>
          </div>
        </div>
      )}
    </>
  );
};

// --- Sub-Components ---

// 1. Resizable Header Component
const ResizableHeader = ({ title }: { title: string }) => {
  return (
    <th style={styles.th}>
      <div style={styles.thContent}>{title}</div>
      {/* Native CSS Resize handle approach */}
      <div style={styles.resizer} />
    </th>
  );
};

// 2. Smart Data Cell Component
const DataCell = ({
  content,
  onExpand,
}: {
  content: string;
  onExpand: () => void;
}) => {
  const formatted = formatCellData(content);
  const isTooLong = content.length > 50;

  return (
    <td style={styles.td}>
      <div style={styles.cellWrapper}>
        <span title={formatted}>
          {isTooLong ? formatted.substring(0, 50) + "..." : formatted}
        </span>
        {isTooLong && (
          <button onClick={onExpand} style={styles.expandBtn}>
            ⤢
          </button>
        )}
      </div>
    </td>
  );
};

// Fixes the Go struct format: "{1000 -18 false finite true}" -> Normal Number
function formatCellData(val: string): string {
  if (!val) return "";

  // Detection for the specific weird number format: {digits exponent boolean...}
  // Example: {1050 -2 false finite true} => 10.50
  const complexNumRegex =
    /^\{(\d+)\s+(-?\d+)\s+(false|true)\s+finite\s+(true|false)\}$/;
  const match = val.match(complexNumRegex);

  if (match) {
    const [_, coeffStr, expStr] = match;
    try {
      const coeff = BigInt(coeffStr);
      const exp = parseInt(expStr, 10);

      // Construct the decimal string manually to avoid precision loss
      const str = coeff.toString();
      if (exp === 0) return str;

      if (exp > 0) {
        return str + "0".repeat(exp);
      } else {
        const absExp = Math.abs(exp);
        if (str.length > absExp) {
          // Insert decimal point
          return (
            str.slice(0, str.length - absExp) +
            "." +
            str.slice(str.length - absExp)
          );
        } else {
          // Pad with zeros (0.000...)
          return "0." + "0".repeat(absExp - str.length) + str;
        }
      }
    } catch (e) {
      return val; // Fallback if parsing fails
    }
  }

  return val;
}

function tryFormatJson(val: string): string {
  try {
    const o = JSON.parse(val);
    if (o && typeof o === "object") {
      return JSON.stringify(o, null, 2);
    }
  } catch (e) {}
  return val;
}

const styles: { [key: string]: React.CSSProperties } = {
  tableContainer: {
    overflowX: "auto",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
    backgroundColor: "#fff",
    maxHeight: "calc(100vh - 300px)", // Leave room for editor
    overflowY: "auto",
  },
  table: {
    borderCollapse: "separate",
    borderSpacing: 0,
    width: "100%",
    minWidth: "600px",
    tableLayout: "fixed", // Crucial for resizing
    fontSize: "13px",
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
  },
  emptyState: {
    padding: "40px",
    textAlign: "center",
    color: "#a0aec0",
    fontStyle: "italic",
    border: "1px dashed #cbd5e0",
    borderRadius: "8px",
    marginTop: "20px",
  },
  th: {
    backgroundColor: "#f7fafc",
    color: "#4a5568",
    fontWeight: "600",
    textAlign: "left",
    borderBottom: "2px solid #e2e8f0",
    borderRight: "1px solid #e2e8f0",
    position: "sticky",
    top: 0,
    zIndex: 10,
    padding: "0",
    resize: "horizontal", // Native CSS resizing
    overflow: "hidden",
    minWidth: "80px",
    width: "150px",
  },
  thContent: {
    padding: "10px 12px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "100%",
  },
  row: {
    backgroundColor: "#fff",
  },
  td: {
    borderBottom: "1px solid #edf2f7",
    borderRight: "1px solid #edf2f7",
    padding: "8px 12px",
    color: "#2d3748",
    whiteSpace: "nowrap",
    overflow: "hidden",
    verticalAlign: "middle",
  },
  cellWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  expandBtn: {
    background: "none",
    border: "none",
    color: "#3182ce",
    cursor: "pointer",
    fontSize: "12px",
    padding: "0 4px",
    marginLeft: "4px",
  },
  // Resizer visual trick
  resizer: {
    display: "inline-block",
    width: "5px",
    height: "100%",
    position: "absolute",
    right: 0,
    top: 0,
    cursor: "col-resize",
    zIndex: 1,
  },
  // Modal Styles
  modalBackdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    backdropFilter: "blur(2px)",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "60vw",
    maxWidth: "800px",
    maxHeight: "80vh",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  },
  modalHeader: {
    padding: "15px 20px",
    borderBottom: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeBtn: {
    border: "none",
    background: "none",
    fontSize: "1.2rem",
    cursor: "pointer",
  },
  jsonPre: {
    padding: "20px",
    margin: 0,
    overflow: "auto",
    fontSize: "13px",
    fontFamily: "monospace",
    whiteSpace: "pre-wrap",
    wordBreak: "break-all",
  },
};
