import { useState, useEffect } from "react";

export default function InfoPanel() {
  const [info, setInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/info")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setInfo)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return (
    <section>
      <h2>System Info</h2>
      <p className="error">Error: {error}</p>
    </section>
  );

  if (!info) return (
    <section>
      <h2>System Info</h2>
      <p>Loading…</p>
    </section>
  );

  const labels = {
    version: "Version",
    hostname: "Hostname",
    python_version: "Python",
    timestamp: "Timestamp",
  };

  return (
    <section>
      <h2>System Info</h2>
      <table className="info-table">
        <tbody>
          {Object.entries(info).map(([k, v]) => (
            <tr key={k}>
              <td>{labels[k] ?? k}</td>
              <td>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
