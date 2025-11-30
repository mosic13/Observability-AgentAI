import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

import { useApi } from "../hooks/useApi";
import ErrorBanner from "./ErrorBanner";



export default function LogViewer() {
  const [logs, setLogs] = useState([]);
  const [paused, setPaused] = useState(false);

  const { safeFetch, error, setError } = useApi();

  useEffect(() => {
    const load = async () => {
      if (!paused) {
        const data = await safeFetch(`${API_BASE_URL}/logs`);
        if (!data) return;
        setLogs(data.logs);
      }
    };
  
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, [paused]);

  return (
    <div style={{ width: "900px", marginTop: "40px" }}>
      <h2>Observability Logs (Last 200 events)</h2>

      {error && <ErrorBanner error={error} onClose={() => setError(null)} />}


        <div style={{ marginBottom: "10px" }}>
            <button
                onClick={() => setPaused(true)}
                style={{ padding: "6px 12px", marginRight: "10px" }}
            >
                Pause Logs
            </button>

            <button
                onClick={() => setPaused(false)}
                style={{ padding: "6px 12px" }}
            >
                Resume Logs
            </button>

            <span style={{ marginLeft: "15px", fontSize: "13px", color: paused ? "red" : "green" }}>
                {paused ? "⏸️ Paused" : "▶️ Live"}
            </span>
        </div>



      <div
        style={{
          background: "#111",
          color: "#0f0",
          padding: "10px",
          height: "300px",
          overflowY: "scroll",
          fontFamily: "monospace",
          fontSize: "12px",
          border: "1px solid #444",
        }}
      >
        {logs.length === 0 && <p>No logs found.</p>}
        {logs.map((line, idx) => (
          <div key={idx}>{line}</div>
        ))}
      </div>
    </div>
  );
}
