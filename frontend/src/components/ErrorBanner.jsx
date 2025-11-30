export default function ErrorBanner({ error, onClose }) {
    if (!error) return null;
  
    return (
      <div
        style={{
          background: "#ffdddd",
          color: "#990000",
          padding: "12px",
          border: "1px solid #dd5555",
          borderRadius: "6px",
          marginBottom: "15px",
          width: "900px"
        }}
      >
        <strong>Error:</strong> {error}
        <button
          onClick={onClose}
          style={{
            float: "right",
            background: "#990000",
            color: "#fff",
            padding: "4px 10px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          X
        </button>
      </div>
    );
  }
  