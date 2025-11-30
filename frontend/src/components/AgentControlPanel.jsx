import { useState } from "react";
import { API_BASE_URL } from "../config";

import { useApi } from "../hooks/useApi";
import ErrorBanner from "../components/ErrorBanner";

export default function AgentControlPanel({ sessionId }) {
  const { safeFetch, error, setError } = useApi();

  const [cycles, setCycles] = useState(5);
  const [interval, setIntervalValue] = useState(2);
  const [status, setStatus] = useState("");

  const startAgent = async () => {
    if (!sessionId) {
      setStatus("Create or enter a Session ID first.");
      return;
    }

    
    setStatus("LongRunningAgent: Starting long-running cycles...");

    const data = await safeFetch(`${API_BASE_URL}/agent/longrun/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        cycles: Number(cycles),
        interval: Number(interval),
      }),
    });
    
    if (!data) {
      setStatus("Error starting agent.");
      return;
    }

    if (data.ok) {
      setStatus("LongRunningAgent: Completed all cycles.");
    } else {
      setStatus("Error starting agent.");
    }
  };

  const pauseAgent = async () => {
    if (!sessionId) {
      setStatus("Session ID required.");
      return;
    }

    const data = await safeFetch(`${API_BASE_URL}/agent/longrun/pause`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId }),
    });
    
    if (!data) {
      setStatus("Pause failed.");
      return;
    }
    

    setStatus(data.ok ? "Agent paused." : "Pause failed.");
  };

  const resumeAgent = async () => {
    if (!sessionId) {
      setStatus("Session ID required.");
      return;
    }

    const data = await safeFetch(`${API_BASE_URL}/agent/longrun/resume`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId }),
    });
    
    if (!data) {
      setStatus("Resume failed.");
      return;
    }

    setStatus(data.ok ? "Agent resumed." : "Resume failed.");
  };

  return (
    <div style={{ width: "900px", marginTop: "40px", padding: "20px", border: "1px solid #ddd" }}>
    {error && <ErrorBanner error={error} onClose={() => setError(null)} />}


    <h2>Agent Control Panel</h2>
    <div style={{ marginBottom: "10px", fontSize: "14px" }}>
        <p><strong>Controlling Agent:</strong> LongRunningAgent</p>
        <p><strong>Description:</strong> This agent gathers system metrics repeatedly on a schedule and logs each iteration into the session timeline. You can start, pause, or resume this background process.</p>
        <p><strong>Session ID:</strong> {sessionId || "None"}</p>
    </div>


      <p><strong>Session ID:</strong> {sessionId || "None"}</p>

      <div style={{ marginBottom: "20px" }}>
        <label>Cycles: </label>
        <input
          type="number"
          value={cycles}
          onChange={(e) => setCycles(e.target.value)}
          style={{ width: "100px", marginRight: "20px", padding: "5px" }}
        />

        <label>Interval (seconds): </label>
        <input
          type="number"
          value={interval}
          onChange={(e) => setIntervalValue(e.target.value)}
          style={{ width: "100px", padding: "5px" }}
        />
      </div>

      <button onClick={startAgent} style={{ padding: "10px", marginRight: "10px" }}>
        Start Long-Running Agent
      </button>

      <button onClick={pauseAgent} style={{ padding: "10px", marginRight: "10px" }}>
        Pause Agent
      </button>

      <button onClick={resumeAgent} style={{ padding: "10px" }}>
        Resume Agent
      </button>

      <p style={{ marginTop: "20px", fontWeight: "bold" }}>{status}</p>

        <p
            style={{
                marginTop: "20px",
                fontWeight: "bold",
                color: status.includes("Paused")
                    ? "orange"
                    : status.includes("Starting") || status.includes("Resumed")
                        ? "blue"
                        : status.includes("Completed")
                            ? "green"
                            : "black"
            }}
        >
            {status}
        </p>
    </div>
  );
}
