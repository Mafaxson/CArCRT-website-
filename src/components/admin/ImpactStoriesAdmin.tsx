import { useEffect, useState } from "react";

export default function ImpactStoriesAdmin() {
  const [stories, setStories] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/data/stories.json")
      .then((res) => res.json())
      .then((data) => setStories(data))
      .catch(() => setMessage("Failed to load stories."));
  }, []);

  const handleApprove = async (id) => {
    setLoading(true);
    setMessage("");
    try {
      const updated = stories.map((s) => s.id === id ? { ...s, approved: true } : s);
      const res = await fetch("/data/stories.json", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setStories(updated);
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
    setLoading(true);
    setMessage("");
    try {
      const updated = stories.filter((s) => s.id !== id);
      const res = await fetch("/data/stories.json", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setStories(updated);
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
    setLoading(true);
    setMessage("");
    try {
      const updated = stories.map((s) => s.id === id ? { ...s, content: newContent } : s);
      const res = await fetch("/data/stories.json", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setStories(updated);
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
