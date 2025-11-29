import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

export default function SystemMetrics() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/metrics/system`)
      .then((res) => res.json())
      .then((data) => {
        setMetrics(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching metrics:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading system metrics...</p>;
  if (!metrics) return <p>Failed to load metrics.</p>;

  return (
    <div style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h2>System Metrics</h2>
      <p><strong>CPU Usage:</strong> {metrics.cpu_usage}%</p>
      <p><strong>Memory Usage:</strong> {metrics.memory_usage}%</p>
      <p><strong>Disk Usage:</strong> {metrics.disk_usage}%</p>
    </div>
  );
}
