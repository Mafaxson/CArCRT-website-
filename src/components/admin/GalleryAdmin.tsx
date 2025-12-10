import { useEffect, useState } from "react";

export default function GalleryAdmin() {
  const [gallery, setGallery] = useState([]);
  const [newPhoto, setNewPhoto] = useState({ caption: "", image: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/data/gallery.json")
      .then((res) => res.json())
      .then((data) => setGallery(data))
      .catch(() => setMessage("Failed to load gallery."));
  }, []);

  const handleChange = (e) => {
    setNewPhoto({ ...newPhoto, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    setLoading(true);
    setMessage("");
    try {
      const updated = [...gallery, { ...newPhoto, id: Date.now() }];
      const res = await fetch("/data/gallery.json", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setGallery(updated);
        setNewPhoto({ caption: "", image: "" });
        setMessage("Photo added!");
      } else setMessage("Failed to add photo.");
    } catch {
      setMessage("Error adding photo.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this photo?")) return;
    setLoading(true);
    setMessage("");
    try {
      const updated = gallery.filter((g) => g.id !== id);
      const res = await fetch("/data/gallery.json", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setGallery(updated);
        setMessage("Photo deleted!");
      } else setMessage("Failed to delete photo.");
    } catch {
      setMessage("Error deleting photo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h4>Gallery Admin</h4>
      <div>
        <input name="caption" value={newPhoto.caption} onChange={handleChange} placeholder="Caption" />
        <input name="image" value={newPhoto.image} onChange={handleChange} placeholder="Image URL or Path" />
        <button onClick={handleAdd} disabled={loading}>Add Photo</button>
      </div>
      <ul>
        {gallery.map((g) => (
          <li key={g.id}>
            <img src={g.image} alt={g.caption} style={{ width: 100 }} />
            <span>{g.caption}</span>
            <button onClick={() => handleDelete(g.id)} disabled={loading}>Delete</button>
          </li>
        ))}
      </ul>
      {message && <p>{message}</p>}
    </div>
  );
}
