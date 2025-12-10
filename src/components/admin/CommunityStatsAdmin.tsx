import { useEffect, useState } from "react";

export default function CommunityStatsAdmin() {
  const [stats, setStats] = useState({ membersReached: "", projectsImplemented: "", districtsEngaged: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/data/stats.json")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => setMessage("Failed to load stats."));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStats({ ...stats, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/data/stats.json", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stats),
      });
      if (res.ok) setMessage("Stats updated and saved to backend!");
      else setMessage("Failed to save stats.");
    } catch {
      setMessage("Error saving stats.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h4>Edit Community Stats</h4>
      <label>
        Community Members Reached
        <input name="membersReached" value={stats.membersReached} onChange={handleChange} />
      </label>
      <label>
        Projects Implemented
        <input name="projectsImplemented" value={stats.projectsImplemented} onChange={handleChange} />
      </label>
      <label>
        Districts Engaged
        <input name="districtsEngaged" value={stats.districtsEngaged} onChange={handleChange} />
      </label>
      <button onClick={handleSave} disabled={loading}>Save</button>
      {message && <p>{message}</p>}
    </div>
  );
}
