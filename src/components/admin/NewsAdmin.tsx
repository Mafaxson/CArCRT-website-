import { useEffect, useState } from "react";

const categories = ["Announcements", "Programs", "Impact", "Partnerships", "Events", "Reports"];

export default function NewsAdmin() {
  const [news, setNews] = useState([]);
  const [newNews, setNewNews] = useState({ title: "", category: [], excerpt: "", content: "", date: new Date().toISOString().split('T')[0], link: "", videoUrl: "", image: "", imageFile: null });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetch("/api/news")
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          setMessage(`Failed to load news: ${res.status} ${text}`);
          return [];
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setNews(data);
      })
      .catch((err) => {
        setMessage("Failed to load news: " + err.message);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === "category") {
      setNewNews((prev) => {
        if (checked) return { ...prev, category: [...prev.category, value] };
        else return { ...prev, category: prev.category.filter((c) => c !== value) };
      });
    } else if (name === "imageFile") {
      setNewNews({ ...newNews, imageFile: files[0] });
    } else {
      setNewNews({ ...newNews, [name]: value });
    }
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
      Object.entries(newNews).forEach(([key, value]) => {
        if (key === "imageFile" && value) {
          formData.append("image", value);
        } else if (key === "imageFile") {
          // skip if no file
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });
      const res = await fetch("/api/admin/news", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const { article } = await res.json();
        setNews([...news, article]);
        setNewNews({ title: "", category: [], excerpt: "", content: "", date: new Date().toISOString().split('T')[0], link: "", videoUrl: "", image: "", imageFile: null });
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
    if (!password) {
      setMessage("Admin password required");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/news/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setNews(news.filter((n) => n.id !== id));
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
    if (!password) {
      setMessage("Admin password required");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const article = news.find((n) => n.id === id);
      if (!article) return;
      const formData = new FormData();
      formData.append("password", password);
      Object.entries({ ...article, content: newContent }).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });
      const res = await fetch(`/api/admin/news/${id}`, {
        method: "PUT",
        body: formData,
      });
      if (res.ok) {
        const { article: updatedArticle } = await res.json();
        setNews(news.map((n) => n.id === id ? updatedArticle : n));
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
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Admin Password" />
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
        <div>
          <label>Image URL:</label>
          <input name="image" value={newNews.image} onChange={handleChange} placeholder="Image URL (optional)" />
        </div>
        <div>
          <label>Or Upload Image:</label>
          <input name="imageFile" type="file" accept="image/*" onChange={handleChange} />
        </div>
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
