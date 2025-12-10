import { useEffect, useState } from "react";

const statuses = ["upcoming", "ongoing", "past"];

export default function EventsAdmin() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: "", dateFrom: "", dateTo: "", location: "", description: "", status: "upcoming", registrationLink: "", registrationNote: "", applicationEmail: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/data/events.json")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch(() => setMessage("Failed to load events."));
  }, []);

  const handleChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    setLoading(true);
    setMessage("");
    try {
      const updated = [...events, { ...newEvent, id: Date.now() }];
      const res = await fetch("/data/events.json", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setEvents(updated);
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
    setLoading(true);
    setMessage("");
    try {
      const updated = events.filter((e) => e.id !== id);
      const res = await fetch("/data/events.json", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setEvents(updated);
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
    setLoading(true);
    setMessage("");
    try {
      const updated = events.map((e) => e.id === id ? { ...e, description: newDescription } : e);
      const res = await fetch("/data/events.json", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setEvents(updated);
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
