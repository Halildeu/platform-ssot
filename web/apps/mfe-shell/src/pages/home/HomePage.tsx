import React from "react";
import { ContextHealthWidget } from "./ContextHealthWidget";

export const HomePage: React.FC = () => {
  return (
    <div style={{ padding: "0" }}>
      <h1
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "var(--text-primary, #111827)",
          marginBottom: 24,
        }}
      >
        Dashboard
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(380, 1fr))",
          gap: 24,
        }}
      >
        <ContextHealthWidget />
      </div>
    </div>
  );
};

export default HomePage;
