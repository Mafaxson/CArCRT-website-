
import { useEffect, useState } from "react";

const statuses = ["upcoming", "ongoing", "past"];

export default function EventsAdmin() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: "", dateFrom: "", dateTo: "", location: "", description: "", status: "upcoming", registrationLink: "", registrationNote: "", applicationEmail: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch(() => setMessage("Failed to load events."));
  }, []);

  const handleChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
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
      Object.entries(newEvent).forEach(([key, value]) => formData.append(key, value));
      const res = await fetch("/api/admin/events", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const { event } = await res.json();
        setEvents([...events, event]);
        setNewEvent({ title: "", dateFrom: "", dateTo: "", location: "", description: "", status: "upcoming", registrationLink: "", registrationNote: "", applicationEmail: "" });
        setMessage("Event added!");
      } else setMessage("Failed to add event.");
    } catch {
      setMessage("Error adding event.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    if (!password) {
      setMessage("Admin password required");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setEvents(events.filter((e) => e.id !== id));
        setMessage("Event deleted!");
      } else setMessage("Failed to delete event.");
    } catch {
      setMessage("Error deleting event.");
    } finally {
      setLoading(false);
    }
  };

  // Simple edit: just change description
  const handleEdit = async (id, newDescription) => {
    if (!password) {
      setMessage("Admin password required");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const event = events.find((e) => e.id === id);
      if (!event) return;
      const formData = new FormData();
      formData.append("password", password);
      Object.entries({ ...event, description: newDescription }).forEach(([key, value]) => formData.append(key, value));
      const res = await fetch(`/api/admin/events/${id}`, {
        method: "PUT",
        body: formData,
      });
      if (res.ok) {
        const { event: updatedEvent } = await res.json();
        setEvents(events.map((e) => e.id === id ? updatedEvent : e));
        setMessage("Event updated!");
      } else setMessage("Failed to update event.");
    } catch {
      setMessage("Error updating event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h4>Events Admin</h4>
      <div>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Admin Password" />
        <input name="title" value={newEvent.title} onChange={handleChange} placeholder="Title" />
        <input name="dateFrom" type="date" value={newEvent.dateFrom} onChange={handleChange} placeholder="Start Date" />
        <input name="dateTo" type="date" value={newEvent.dateTo} onChange={handleChange} placeholder="End Date" />
        <input name="location" value={newEvent.location} onChange={handleChange} placeholder="Location" />
        <textarea name="description" value={newEvent.description} onChange={handleChange} placeholder="Description" />
        <select name="status" value={newEvent.status} onChange={handleChange}>
          {statuses.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <input name="registrationLink" value={newEvent.registrationLink} onChange={handleChange} placeholder="Registration Link" />
        <input name="registrationNote" value={newEvent.registrationNote} onChange={handleChange} placeholder="Registration Note" />
        <input name="applicationEmail" value={newEvent.applicationEmail} onChange={handleChange} placeholder="Application Email" />
        <button onClick={handleAdd} disabled={loading}>Add Event</button>
      </div>
      <ul>
        {events.map((e) => (
          <li key={e.id}>
            <strong>{e.title}</strong> ({e.status})
            <span>{e.dateFrom} - {e.dateTo}</span>
            <span>{e.location}</span>
            <p>{e.description}</p>
            <button onClick={() => handleDelete(e.id)} disabled={loading}>Delete</button>
            <button onClick={() => {
              const newDescription = prompt("Edit event description:", e.description);
              if (newDescription !== null) handleEdit(e.id, newDescription);
            }} disabled={loading}>Edit</button>
          </li>
        ))}
      </ul>
      {message && <p>{message}</p>}
    </div>
  );
}
