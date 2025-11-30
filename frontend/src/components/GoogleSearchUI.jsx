import { useState } from "react";
import { API_BASE_URL } from "../config";

export default function GoogleSearchUI({ sessionId }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);

  const runSearch = async () => {
    if (!query) return;

    const res = await fetch(`${API_BASE_URL}/tools/google_search?query=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResult(data.result);
  };

  return (
    <div style={{ width: "900px", marginTop: "40px", padding: "20px", border: "1px solid #ddd" }}>
      <h2>Google Search Tool</h2>

      <input
        type="text"
        value={query}
        placeholder="Enter search query"
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: "400px", padding: "8px", marginRight: "10px" }}
      />

      <button onClick={runSearch} style={{ padding: "8px 15px" }}>
        Search
      </button>

      {result && (
        <div style={{ marginTop: "20px", background: "#fafafa", padding: "10px", borderRadius: "6px" }}>
          <h3>Results</h3>
          <pre style={{ fontSize: "13px" }}>
{JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
