import { connection, entity } from "../../wailsjs/go/models";

type Prop = {
  connections: connection.Connection[];
  onConnect: (id: number) => void;
};

export const ConnectionList: React.FC<Prop> = ({
  connections,
  onConnect,
}: Prop) => {
  if (connections.length === 0) {
    return <div>No connections yet</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {connections.map((conn) => (
        <div
          key={conn.connection_id}
          onClick={() => onConnect(conn.connection_id)}
          style={{
            border: "1px solid #ccc",
            padding: 10,
            cursor: "pointer",
            borderRadius: 5,
          }}
        >
          <strong>{conn.name}</strong>
          <p style={{ margin: 0, fontSize: "0.9em", color: "#666" }}>
            {conn.description}
          </p>
        </div>
      ))}
    </div>
  );
};
