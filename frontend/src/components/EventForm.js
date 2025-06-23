import { useState } from "react";
import axios from "../api/axios";

export default function EventForm({ onEventCreated }) {
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const res = await axios.post("/events/create", {
        creator_email: user.email,
        title,
        event_date: eventDate,
        location,
        reminders
      });
      onEventCreated(res.data);
      setTitle("");
      setEventDate("");
      setLocation("");
      setReminders([]);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create event');
    }
  };

  const addReminder = () => {
    if (newReminder && !reminders.includes(parseInt(newReminder))) {
      setReminders([...reminders, parseInt(newReminder)]);
      setNewReminder("");
    }
  };

  const removeReminder = (daysBefore) => {
    setReminders(reminders.filter(r => r !== daysBefore));
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>Create New Event</h3>
      
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Event Title"
        required
        style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc' }}
      />
      
      <input
        type="datetime-local"
        value={eventDate}
        onChange={(e) => setEventDate(e.target.value)}
        required
        style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc' }}
      />
      
      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Event Location"
        required
        style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc' }}
      />
      
      <div style={{ marginBottom: '10px' }}>
        <h4>Reminders (days before event):</h4>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type="number"
            value={newReminder}
            onChange={(e) => setNewReminder(e.target.value)}
            placeholder="Days before"
            min="1"
            style={{ padding: '8px', border: '1px solid #ccc' }}
          />
          <button type="button" onClick={addReminder} style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none' }}>
            Add Reminder
          </button>
        </div>
        <div>
          {reminders.map(days => (
            <span key={days} style={{ margin: '5px', padding: '5px 10px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6' }}>
              {days} days before
              <button type="button" onClick={() => removeReminder(days)} style={{ marginLeft: '5px', color: 'red', border: 'none', background: 'none' }}>×</button>
            </span>
          ))}
        </div>
      </div>
      
      <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none' }}>
        Create Event
      </button>
    </form>
  );
}