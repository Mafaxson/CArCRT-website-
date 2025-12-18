
import { useState, useEffect } from "react";

export default function Admin() {

  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  // Editable stats state
  const [stats, setStats] = useState({
    communityMembers: "0",
    projects: "0",
    districts: "0",
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load stats from backend API
  useEffect(() => {
    if (!loggedIn) return;
    setLoading(true);
    fetch("/api/stats")
      .then(res => res.json())
      .then(data => {
        setStats({
          communityMembers: data.membersReached || "0",
          projects: data.projectsImplemented || "0",
          districts: data.districtsEngaged || "0",
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [loggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check (replace with real auth in production)
    if (password === "admin123") {
      setLoggedIn(true);
    } else {
      alert("Incorrect password");
    }
  };

  if (!loggedIn) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <form onSubmit={handleLogin} style={{ background: "#fff", padding: 32, borderRadius: 8, boxShadow: "0 2px 8px #0001" }}>
          <h2 style={{ marginBottom: 16 }}>Simple Admin Login</h2>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ padding: 8, width: 200, marginBottom: 16, display: "block" }}
            required
          />
          <button type="submit" style={{ padding: 8, width: 200 }}>Login</button>
        </form>
      </div>
    );
  }

  if (loading) {
    return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", padding: 32, borderRadius: 8, boxShadow: "0 2px 8px #0001", minWidth: 320 }}>
        <h2>Welcome, Admin!</h2>
        <p>Edit Stats</p>
        {editing ? (
          <form
            onSubmit={async e => {
              e.preventDefault();
              setSaving(true);
              await fetch("/api/admin/stats", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  password,
                  membersReached: stats.communityMembers,
                  projectsImplemented: stats.projects,
                  districtsEngaged: stats.districts,
                }),
              });
              setSaving(false);
              setEditing(false);
            }}
            style={{ marginTop: 16 }}
          >
            <div style={{ marginBottom: 12 }}>
              <label>Community Members Reached<br />
                <input
                  type="text"
                  value={stats.communityMembers}
                  onChange={e => setStats(s => ({ ...s, communityMembers: e.target.value }))}
                  style={{ width: 200, padding: 6 }}
                  placeholder="e.g. 15,000+"
                />
              </label>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>Projects Implemented<br />
                <input
                  type="text"
                  value={stats.projects}
                  onChange={e => setStats(s => ({ ...s, projects: e.target.value }))}
                  style={{ width: 200, padding: 6 }}
                  placeholder="e.g. 15"
                />
              </label>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>Districts Engaged<br />
                <input
                  type="text"
                  value={stats.districts}
                  onChange={e => setStats(s => ({ ...s, districts: e.target.value }))}
                  style={{ width: 200, padding: 6 }}
                  placeholder="e.g. 5"
                />
              </label>
            </div>
            <button type="submit" style={{ padding: 8, width: 200, marginTop: 8 }} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
          </form>
        ) : (
          <div style={{ marginTop: 16 }}>
            <div style={{ marginBottom: 12 }}>
              <strong>Community Members Reached</strong><br />
              {stats.communityMembers}
            </div>
            <div style={{ marginBottom: 12 }}>
              <strong>Projects Implemented</strong><br />
              {stats.projects}
            </div>
            <div style={{ marginBottom: 12 }}>
              <strong>Districts Engaged</strong><br />
              {stats.districts}
            </div>
            <button onClick={() => setEditing(true)} style={{ padding: 8, width: 200 }}>Edit</button>
          </div>
        )}
      </div>
    </div>
  );
}
