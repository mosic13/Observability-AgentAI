import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from "recharts";

import SessionTimeline from "../components/SessionTimeline";

import LogViewer from "../components/LogViewer";
import AgentControlPanel from "../components/AgentControlPanel";

import GoogleSearchUI from "../components/GoogleSearchUI";

import { useApi } from "../hooks/useApi";
import ErrorBanner from "../components/ErrorBanner";

export default function Dashboard() {
  const [sessionId, setSessionId] = useState("");

  const [history, setHistory] = useState([]);
  const [latest, setLatest] = useState(null);

  const { safeFetch, error, setError } = useApi();


  // Fetch metrics every 3 seconds
  useEffect(() => {
    const fetchData = async () => {
      /* const res = await fetch(`${API_BASE_URL}/agent/metrics`);
      const data = await res.json(); */

      const data = await safeFetch(`${API_BASE_URL}/agent/metrics`);
      if (!data) return; 


      setLatest(data);

      setHistory(prev => [
        ...prev.slice(-19),
        {
          time: new Date().toLocaleTimeString(),
          cpu: data.metrics.cpu,
          memory: data.metrics.memory,
          disk: data.metrics.disk
        }
      ]);
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (

    
    <div style={{ padding: "20px" }}>
      <h1>Observability AgentAI Dashboard</h1>

      {error && <ErrorBanner error={error} onClose={() => setError(null)} />}


      {/* ---------- METRICS CHART ---------- */}
      <h2>Live System Metrics</h2>
      <LineChart width={900} height={320} data={history}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="cpu" stroke="#ff0000" name="CPU %" />
        <Line type="monotone" dataKey="memory" stroke="#0000ff" name="Memory %" />
        <Line type="monotone" dataKey="disk" stroke="#00aa00" name="Disk %" />
      </LineChart>

      {/* ---------- EVALUATION ---------- */}
      {latest && (
        <div style={{ marginTop: "30px", padding: "15px", border: "1px solid #ddd", width: "900px" }}>
          <h2>Agent Evaluation</h2>
          <p><strong>Score:</strong> {latest.evaluation.score}</p>
          <p><strong>Rating:</strong> {latest.evaluation.rating}</p>

          <h3>Issues:</h3>
          <ul>
            {latest.evaluation.issues.length === 0 ? (
              <li>No issues detected</li>
            ) : (
              latest.evaluation.issues.map((item, i) => <li key={i}>{item}</li>)
            )}
          </ul>
        </div>
      )}

      {/* ---------- ALERTS PANEL ---------- */}
      {latest && (
        <div style={{ marginTop: "30px", padding: "15px", border: "1px solid #ddd", width: "900px" }}>
          <h2>Alerts</h2>
          {latest.alerts.length === 0 ? (
            <p>No alerts</p>
          ) : (
            <ul>
              {latest.alerts.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          )}
        </div>
      )}


        {/* -------- SESSION CONTROLS -------- */}
        <div style={{ marginTop: "40px", width: "900px" }}>
            <h2>Session Controls</h2>

            <button
                onClick={async () => {
                    const res = await fetch(`${API_BASE_URL}/session/create`, {
                        method: "POST"
                    });
                    const data = await res.json();
                    setSessionId(data.session_id);
                }}
                style={{ padding: "10px", marginRight: "10px" }}
            >
                Create New Session
            </button>

            <input
                type="text"
                placeholder="Enter existing session ID"
                onChange={(e) => setSessionId(e.target.value)}
                style={{ width: "350px", padding: "8px" }}
            />
        </div>

        {/* -------- SESSION TIMELINE -------- */}
        {sessionId && <SessionTimeline sessionId={sessionId} />}

        <AgentControlPanel sessionId={sessionId} />

        {/* <GoogleSearchUI sessionId={sessionId} /> */}


        <LogViewer />

    </div>

     


  );
}
