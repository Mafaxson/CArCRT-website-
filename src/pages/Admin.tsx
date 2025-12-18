
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

  // This page is now obsolete. Please use Supabase Auth and the new admin dashboard only.
  export default function Admin() {
    return <div style={{padding: 40, textAlign: 'center'}}>This admin page is obsolete. Please use the new admin dashboard with Supabase login.</div>;
  }
          <h2 style={{ marginBottom: 16 }}>Simple Admin Login</h2>
