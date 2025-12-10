import { useEffect, useState } from "react";

export default function ImpactStoriesAdmin() {
  const [stories, setStories] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetch("/api/admin/stories?password=" + encodeURIComponent(password))
      .then((res) => res.json())
      .then((data) => setStories(data))
      .catch(() => setMessage("Failed to load stories."));
  }, [password]);

  const handleApprove = async (id) => {
    if (!password) {
      setMessage("Admin password required");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/stories/${id}/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setStories(stories.map((s) => s.id === id ? { ...s, approved: true } : s));
        setMessage("Story approved!");
      } else setMessage("Failed to approve story.");
    } catch {
      setMessage("Error approving story.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this story?")) return;
    if (!password) {
      setMessage("Admin password required");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/stories/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setStories(stories.filter((s) => s.id !== id));
        setMessage("Story deleted!");
      } else setMessage("Failed to delete story.");
    } catch {
      setMessage("Error deleting story.");
    } finally {
      setLoading(false);
    }
  };

  // Simple edit: just change content
  const handleEdit = async (id, newContent) => {
    if (!password) {
      setMessage("Admin password required");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const story = stories.find((s) => s.id === id);
      if (!story) return;
      const res = await fetch(`/api/admin/stories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, ...story, content: newContent }),
      });
      if (res.ok) {
        setStories(stories.map((s) => s.id === id ? { ...s, content: newContent } : s));
        setMessage("Story updated!");
      } else setMessage("Failed to update story.");
    } catch {
      setMessage("Error updating story.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h4>Impact Stories Admin</h4>
      <label>
        Admin Password
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </label>
      <ul>
        {stories.map((s) => (
          <li key={s.id}>
            <strong>{s.title}</strong> {s.approved ? "(Approved)" : "(Pending)"}
            <p>{s.content}</p>
            <button onClick={() => handleApprove(s.id)} disabled={loading || s.approved}>Approve</button>
            <button onClick={() => handleDelete(s.id)} disabled={loading}>Delete</button>
            <button onClick={() => {
              const newContent = prompt("Edit story content:", s.content);
              if (newContent !== null) handleEdit(s.id, newContent);
            }} disabled={loading}>Edit</button>
          </li>
        ))}
      </ul>
      {message && <p>{message}</p>}
    </div>
  );
}
