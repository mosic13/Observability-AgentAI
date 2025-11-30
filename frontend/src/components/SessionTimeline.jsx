import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

import { useApi } from "../hooks/useApi";
import ErrorBanner from "../components/ErrorBanner";

export default function SessionTimeline({ sessionId }) {
  const [session, setSession] = useState(null);
  const { safeFetch, error, setError } = useApi();

  useEffect(() => {
    if (!sessionId) return;

    /* const fetchSession = async () => {
      const data = await safeFetch(`${API_BASE_URL}/tools/google_search?query=${encodeURIComponent(query)}`);
      if (!data) return;
      setSession(data);
    }; */

    const fetchSession = async () => {
      const data = await safeFetch(`${API_BASE_URL}/session/${sessionId}`);
      if (!data) return;
      setSession(data);
    };

    fetchSession();
    const interval = setInterval(fetchSession, 3000);
    return () => clearInterval(interval);

  }, [sessionId]);

  if (!sessionId) {
    return <p>No session selected.</p>;
  }

  if (!session) {
    return <p>Loading session timeline...</p>;
  }


  
  function computeSummary(session) {
    if (!session || !session.history) return {};
  
    let chainRuns = 0;
    let longSteps = 0;
    let alerts = 0;
    let latestScore = null;
  
    session.history.forEach(item => {
      const event = item.event;
  
      if (event.type === "agent_chain") {
        chainRuns++;
  
        if (event.evaluation) {
          latestScore = event.evaluation.score;
        }
  
        if (event.alerts && event.alerts.length > 0) {
          alerts += event.alerts.length;
        }
      }
  
      if (event.type === "long_running_step") {
        longSteps++;
      }
    });
  
    return {
      chainRuns,
      longSteps,
      alerts,
      latestScore
    };
  }
  





  return (

    
    <div style={{ border: "1px solid #ddd", padding: "20px", width: "900px", marginTop: "20px" }}>
      {error && <ErrorBanner error={error} onClose={() => setError(null)} />}

      <h2>Session Timeline</h2>

      <p><strong>Session ID:</strong> {sessionId}</p>
      <p><strong>Created:</strong> {session.created}</p>

      <h3>Events</h3>




        {/* -------- SUMMARY CARD -------- */}
        {session && (
            <div style={{
                marginTop: "20px",
                padding: "15px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                width: "880px",
                background: "#fafafa",     
                color: "red"           
            }}>
                <h3>Session Summary</h3>

                {(() => {
                    const s = computeSummary(session);

                    return (
                        <ul>
                            <li><strong>Total Agent Chain Runs:</strong> {s.chainRuns}</li>
                            <li><strong>Total Long-Running Steps:</strong> {s.longSteps}</li>
                            <li><strong>Total Alerts:</strong> {s.alerts}</li>
                            <li><strong>Latest Evaluation Score:</strong> {s.latestScore ?? "N/A"}</li>
                        </ul>
                    );
                })()}
            </div>
        )}





      <ul>
        {session.history.length === 0 && <li>No events recorded yet.</li>}

        {session.history.map((item, index) => (
            <li key={index} style={{ marginBottom: "12px" }}>
                <strong>{item.timestamp}</strong> — <em>{item.event.type}</em>
                <pre
                    style={{
                        background: "#fafafa",
                        color: "#333",
                        border: "1px solid #eee",
                        borderRadius: "4px",
                        padding: "8px",
                        fontSize: "12px",
                        overflowX: "auto"
                    }}
                >
                    {item.event.data
                        ? JSON.stringify(item.event.data, null, 2)
                        : JSON.stringify(item.event, null, 2)}
                </pre>
            </li>
        ))}
      </ul>
    </div>
  

    
  );

}
