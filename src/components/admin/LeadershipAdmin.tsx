import { useEffect, useState } from "react";

export default function LeadershipAdmin() {
  const [team, setTeam] = useState([]);
  const [newMember, setNewMember] = useState({ name: "", role: "", bio: "", photo: "", category: "Leadership" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetch("/api/leadership")
      .then((res) => res.json())
      .then((data) => setTeam(data))
      .catch(() => setMessage("Failed to load team."));
  }, []);

  const handleChange = (e) => {
    setNewMember({ ...newMember, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    if (!password) {
      setMessage("Admin password required");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("password", password);
      Object.entries(newMember).forEach(([key, value]) => formData.append(key, value));
      const res = await fetch("/api/admin/leadership", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const { member } = await res.json();
        setTeam([...team, member]);
        setNewMember({ name: "", role: "", bio: "", photo: "", category: "Leadership" });
        setMessage("Member added!");
      } else setMessage("Failed to add member.");
    } catch {
      setMessage("Error adding member.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this member?")) return;
    if (!password) {
      setMessage("Admin password required");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/leadership/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setTeam(team.filter((m) => m.id !== id));
        setMessage("Member deleted!");
      } else setMessage("Failed to delete member.");
    } catch {
      setMessage("Error deleting member.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h4>Leadership, Team & Internship Admin</h4>
      <div>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Admin Password" />
        <input name="name" value={newMember.name} onChange={handleChange} placeholder="Name" />
        <input name="role" value={newMember.role} onChange={handleChange} placeholder="Role/Position" />
        <input name="bio" value={newMember.bio} onChange={handleChange} placeholder="Bio" />
        <input name="photo" value={newMember.photo} onChange={handleChange} placeholder="Photo URL or Path" />
        <select name="category" value={newMember.category} onChange={handleChange}>
          <option value="Leadership">Leadership</option>
          <option value="Coordinator">Coordinator</option>
          <option value="Representative">Internship/Representative</option>
        </select>
        <button onClick={handleAdd} disabled={loading}>Add Member</button>
      </div>
      <ul>
        {team.map((m) => (
          <li key={m.id}>
            {m.photo && <img src={m.photo} alt={m.name} style={{ width: 100 }} />}
            <span>{m.name} ({m.role}) [{m.category}]</span>
            <button onClick={() => handleDelete(m.id)} disabled={loading}>Delete</button>
          </li>
        ))}
      </ul>
      {message && <p>{message}</p>}
    </div>
  );
}
