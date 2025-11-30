import { useState } from "react";

export function useApi() {
  const [error, setError] = useState(null);

  async function safeFetch(url, options = {}) {
    try {
      setError(null);

      const res = await fetch(url, options);

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }

      return await res.json();
    } catch (err) {
      setError(err.message || "Unknown error occurred.");
      return null;
    }
  }

  return { safeFetch, error, setError };
}
