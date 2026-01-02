import { connection, entity } from "../../wailsjs/go/models";

type Prop = {
  connections: connection.Connection[];
};

export function ConnectionList({ connections }: Prop) {
  if (connections.length === 0) {
    return <div>No connections yet</div>;
  }

  return (
    <div style={{ marginTop: 20 }}>
      {connections.map((c) => (
        <div
          key={c.connection_id}
          style={{
            border: "1px solid #ccc",
            padding: 10,
            marginBottom: 8,
          }}
        >
          <div>
            <b>{c.name}</b>
          </div>
          <div>{c.description}</div>
          <div style={{ fontSize: 12, color: "#666" }}>
            id: {c.connection_id}
          </div>
        </div>
      ))}
    </div>
  );
}
