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
    <div className="card">
      <h3 style={{ marginBottom: '20px', color: '#007bff' }}>Create New Event</h3>
      <form onSubmit={handleSubmit}>
        
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event Title"
          required
          className="form-input"
        />
        
        <input
          type="datetime-local"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          required
          className="form-input"
        />
        
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Event Location"
          required
          className="form-input"
        />
        
        <div className="mb-2">
          <h4 style={{ marginBottom: '10px' }}>Reminders (days before event):</h4>
          <div className="flex-start mb-1">
            <input
              type="number"
              value={newReminder}
              onChange={(e) => setNewReminder(e.target.value)}
              placeholder="Days before"
              min="1"
              className="form-input"
              style={{ flex: '1', minWidth: '120px', marginBottom: '10px', marginRight: '10px' }}
            />
            <button 
              type="button" 
              onClick={addReminder} 
              className="btn btn-primary btn-small"
            >
              Add Reminder
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {reminders.map(days => (
              <span key={days} style={{ 
                padding: '5px 10px', 
                backgroundColor: '#f8f9fa', 
                border: '1px solid #dee2e6',
                borderRadius: '4px',
                fontSize: '14px',
                whiteSpace: 'nowrap'
              }}>
                {days} days before
                <button 
                  type="button" 
                  onClick={() => removeReminder(days)} 
                  style={{ 
                    marginLeft: '8px', 
                    color: 'red', 
                    border: 'none', 
                    background: 'none',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >×</button>
              </span>
            ))}
          </div>
        </div>
        
        <button type="submit" className="btn btn-success btn-full">
          Create Event
        </button>
      </form>
    </div>
  );
}