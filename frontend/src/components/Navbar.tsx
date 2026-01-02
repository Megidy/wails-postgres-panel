import { Link } from "react-router-dom";
import React from "react";

export const Navbar = () => {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#1F2937", // gray-800
        color: "white",
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: 18 }}>MyApp</div>

      <div style={{ display: "flex", gap: 15 }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          Home
        </Link>
        <Link to="/query" style={{ color: "white", textDecoration: "none" }}>
          Query
        </Link>
        <Link
          to="/connections"
          style={{ color: "white", textDecoration: "none" }}
        >
          Connections
        </Link>
      </div>
    </nav>
  );
};
