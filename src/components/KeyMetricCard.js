import React from "react";

function KeyMetricCard({ title, value }) {
  return (
    <div className="metric-card">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}

export default KeyMetricCard;
