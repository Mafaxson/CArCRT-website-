import { useEffect, useState } from "react";

const categories = ["Announcements", "Programs", "Impact", "Partnerships", "Events", "Reports"];

export default function NewsAdmin() {
  const [news, setNews] = useState([]);
  const [newNews, setNewNews] = useState({ title: "", category: [], excerpt: "", content: "", date: new Date().toISOString().split('T')[0], link: "", videoUrl: "", image: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/data/news.json")
      .then((res) => res.json())
      .then((data) => setNews(data))
      .catch(() => setMessage("Failed to load news."));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "category") {
      setNewNews((prev) => {
        if (checked) return { ...prev, category: [...prev.category, value] };
        else return { ...prev, category: prev.category.filter((c) => c !== value) };
      });
    } else {
      setNewNews({ ...newNews, [name]: value });
    }
  };

  const handleAdd = async () => {
    setLoading(true);
    setMessage("");
    try {
      const updated = [...news, { ...newNews, id: Date.now() }];
      const res = await fetch("/data/news.json", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setNews(updated);
        setNewNews({ title: "", category: [], excerpt: "", content: "", date: new Date().toISOString().split('T')[0], link: "", videoUrl: "", image: "" });
        setMessage("News added!");
      } else setMessage("Failed to add news.");
    } catch {
      setMessage("Error adding news.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this news article?")) return;
    setLoading(true);
    setMessage("");
    try {
      const updated = news.filter((n) => n.id !== id);
      const res = await fetch("/data/news.json", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setNews(updated);
        setMessage("News deleted!");
      } else setMessage("Failed to delete news.");
    } catch {
      setMessage("Error deleting news.");
    } finally {
      setLoading(false);
    }
  };

  // Simple edit: just change content
  const handleEdit = async (id, newContent) => {
    setLoading(true);
    setMessage("");
    try {
      const updated = news.map((n) => n.id === id ? { ...n, content: newContent } : n);
      const res = await fetch("/data/news.json", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setNews(updated);
        setMessage("News updated!");
      } else setMessage("Failed to update news.");
    } catch {
      setMessage("Error updating news.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h4>News & Updates Admin</h4>
      <div>
        <input name="title" value={newNews.title} onChange={handleChange} placeholder="Title" />
        <div>
          {categories.map((cat) => (
            <label key={cat}>
              <input type="checkbox" name="category" value={cat} checked={newNews.category.includes(cat)} onChange={handleChange} /> {cat}
            </label>
          ))}
        </div>
        <input name="excerpt" value={newNews.excerpt} onChange={handleChange} placeholder="Excerpt" />
        <textarea name="content" value={newNews.content} onChange={handleChange} placeholder="Content" />
        <input name="date" type="date" value={newNews.date} onChange={handleChange} />
        <input name="link" value={newNews.link} onChange={handleChange} placeholder="Link" />
        <input name="videoUrl" value={newNews.videoUrl} onChange={handleChange} placeholder="Video URL" />
        <input name="image" value={newNews.image} onChange={handleChange} placeholder="Image URL or Path" />
        <button onClick={handleAdd} disabled={loading}>Add News</button>
      </div>
      <ul>
        {news.map((n) => (
          <li key={n.id}>
            {n.image && <img src={n.image} alt={n.title} style={{ width: 100 }} />}
            <strong>{n.title}</strong> ({n.category?.join(", ")})
            <span>{n.date}</span>
            <p>{n.excerpt}</p>
            <button onClick={() => handleDelete(n.id)} disabled={loading}>Delete</button>
            <button onClick={() => {
              const newContent = prompt("Edit news content:", n.content);
              if (newContent !== null) handleEdit(n.id, newContent);
            }} disabled={loading}>Edit</button>
          </li>
        ))}
      </ul>
      {message && <p>{message}</p>}
    </div>
  );
}
