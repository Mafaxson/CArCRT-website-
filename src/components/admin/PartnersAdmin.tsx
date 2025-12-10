import { useEffect, useState } from "react";

export default function PartnersAdmin() {
  const [partners, setPartners] = useState([]);
  const [newPartner, setNewPartner] = useState({ name: "", type: "Partner", website: "", logo: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetch("/api/partners")
      .then((res) => res.json())
      .then((data) => setPartners(data))
      .catch(() => setMessage("Failed to load partners."));
  }, []);

  const handleChange = (e) => {
    setNewPartner({ ...newPartner, [e.target.name]: e.target.value });
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
      Object.entries(newPartner).forEach(([key, value]) => formData.append(key, value));
      const res = await fetch("/api/admin/partners", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const { partner } = await res.json();
        setPartners([...partners, partner]);
        setNewPartner({ name: "", type: "Partner", website: "", logo: "" });
        setMessage("Partner added!");
      } else setMessage("Failed to add partner.");
    } catch {
      setMessage("Error adding partner.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this partner?")) return;
    if (!password) {
      setMessage("Admin password required");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/partners/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setPartners(partners.filter((p) => p.id !== id));
        setMessage("Partner deleted!");
      } else setMessage("Failed to delete partner.");
    } catch {
      setMessage("Error deleting partner.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h4>Partners & Sponsors Admin</h4>
      <div>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Admin Password" />
        <input name="name" value={newPartner.name} onChange={handleChange} placeholder="Name" />
        <select name="type" value={newPartner.type} onChange={handleChange}>
          <option value="Partner">Partner</option>
          <option value="Sponsor">Sponsor</option>
          <option value="Affiliate">Affiliate Partner</option>
        </select>
        <input name="website" value={newPartner.website} onChange={handleChange} placeholder="Website" />
        <input name="logo" value={newPartner.logo} onChange={handleChange} placeholder="Logo URL or Path" />
        <button onClick={handleAdd} disabled={loading}>Add Partner</button>
      </div>
      <ul>
        {partners.map((p) => (
          <li key={p.id}>
            {p.logo && <img src={p.logo} alt={p.name} style={{ width: 100 }} />}
            <span>{p.name} ({p.type})</span>
            {p.website && <a href={p.website} target="_blank" rel="noopener noreferrer">Website</a>}
            <button onClick={() => handleDelete(p.id)} disabled={loading}>Delete</button>
          </li>
        ))}
      </ul>
      {message && <p>{message}</p>}
    </div>
  );
}
