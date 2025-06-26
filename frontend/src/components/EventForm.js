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
    <div className="card" style={{ borderRadius: '12px' }}>
      <h3 style={{ marginBottom: '20px', color: '#007bff', fontSize: '1.5rem', fontWeight: '700' }}>
        ✨ Create New Event
      </h3>
      <form onSubmit={handleSubmit}>
        
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="🎉 Event Title"
          required
          className="form-input"
          style={{ fontSize: '16px', padding: '16px' }}
        />
        
        <input
          type="datetime-local"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          required
          className="form-input"
          style={{ fontSize: '16px', padding: '16px' }}
        />
        
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="📍 Event Location"
          required
          className="form-input"
          style={{ fontSize: '16px', padding: '16px' }}
        />
        
        <div className="mb-2">
          <h4 style={{ marginBottom: '15px', fontSize: '1.1rem', fontWeight: '600' }}>
            ⏰ Reminders (days before event):
          </h4>
          <div className="flex-start mb-1">
            <input
              type="number"
              value={newReminder}
              onChange={(e) => setNewReminder(e.target.value)}
              placeholder="Days before"
              min="1"
              className="form-input"
              style={{ 
                flex: '1', 
                minWidth: '120px', 
                marginBottom: '10px', 
                marginRight: '10px',
                fontSize: '16px',
                padding: '12px'
              }}
            />
            <button 
              type="button" 
              onClick={addReminder} 
              className="btn btn-primary btn-small"
              style={{ borderRadius: '8px', fontWeight: '600' }}
            >
              ➕ Add
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {reminders.map(days => (
              <span key={days} style={{ 
                padding: '8px 12px', 
                backgroundColor: '#f8f9fa', 
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                fontSize: '14px',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                ⏰ {days} days before
                <button 
                  type="button" 
                  onClick={() => removeReminder(days)} 
                  style={{ 
                    marginLeft: '5px', 
                    color: '#dc3545', 
                    border: 'none', 
                    background: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >×</button>
              </span>
            ))}
          </div>
        </div>
        
        <button type="submit" className="btn btn-success btn-full" style={{ 
          borderRadius: '10px', 
          fontSize: '16px', 
          fontWeight: '600',
          padding: '16px'
        }}>
          🚀 Create Event
        </button>
      </form>
    </div>
  );
}