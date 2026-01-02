import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// --- Icons ---
const LogoIcon = () => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#3182ce"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
    <line x1="4" y1="22" x2="4" y2="15"></line>
  </svg>
);

const ConnectIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#4a5568"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
  </svg>
);

const QueryIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#4a5568"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="4 17 10 11 4 5"></polyline>
    <line x1="12" y1="19" x2="20" y2="19"></line>
  </svg>
);

const SpeedIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#4a5568"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

function Home() {
  const navigate = useNavigate();
  const [btnHover, setBtnHover] = useState(false);

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.logoWrapper}>
          <LogoIcon />
        </div>
        <h1 style={styles.title}>Postgres Panel</h1>
        <p style={styles.subtitle}>
          A lightweight, modern client for managing your PostgreSQL databases.
          <br />
          Fast, secure, and built with Go & React.
        </p>

        <button
          onClick={() => navigate("/connections")}
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          style={{
            ...styles.ctaButton,
            transform: btnHover ? "translateY(-2px)" : "translateY(0)",
            boxShadow: btnHover
              ? "0 6px 12px rgba(49, 130, 206, 0.3)"
              : "0 4px 6px rgba(49, 130, 206, 0.2)",
          }}
        >
          Manage Connections &rarr;
        </button>
      </div>

      {/* Features Grid */}
      <div style={styles.featuresGrid}>
        <FeatureCard
          icon={<ConnectIcon />}
          title="Multiple Connections"
          desc="Save and manage multiple database instances with ease."
        />
        <FeatureCard
          icon={<QueryIcon />}
          title="SQL Execution"
          desc="Run raw SQL queries and view results in a clean table view."
        />
        <FeatureCard
          icon={<SpeedIcon />}
          title="High Performance"
          desc="Native Go backend ensures low latency and high stability."
        />
      </div>
    </div>
  );
}

// Simple internal component for the feature cards
const FeatureCard = ({
  icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc: string;
}) => (
  <div style={styles.card}>
    <div style={styles.cardIcon}>{icon}</div>
    <h3 style={styles.cardTitle}>{title}</h3>
    <p style={styles.cardDesc}>{desc}</p>
  </div>
);

// --- CSS-in-JS Styles ---
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f7fafc",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  hero: {
    textAlign: "center",
    maxWidth: "600px",
    marginBottom: "60px",
    animation: "fadeIn 0.5s ease-out",
  },
  logoWrapper: {
    marginBottom: "20px",
    display: "inline-block",
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "24px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
  },
  title: {
    fontSize: "3rem",
    fontWeight: "800",
    color: "#2d3748",
    margin: "0 0 15px 0",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "#718096",
    lineHeight: "1.6",
    margin: "0 0 30px 0",
  },
  ctaButton: {
    padding: "14px 28px",
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "white",
    backgroundColor: "#3182ce",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
  },

  // Features Grid
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
    width: "100%",
    maxWidth: "1000px",
  },
  card: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.04)",
    border: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    transition: "transform 0.2s",
  },
  cardIcon: {
    marginBottom: "15px",
    padding: "10px",
    backgroundColor: "#edf2f7",
    borderRadius: "10px",
    color: "#4a5568",
  },
  cardTitle: {
    margin: "0 0 10px 0",
    fontSize: "1.1rem",
    color: "#2d3748",
    fontWeight: "600",
  },
  cardDesc: {
    margin: 0,
    fontSize: "0.95rem",
    color: "#718096",
    lineHeight: "1.5",
  },
};

export default Home;
