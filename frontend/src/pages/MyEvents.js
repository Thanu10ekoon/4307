// src/pages/MyEvents.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import EventDetails from "../components/EventDetails";

export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const refreshEvents = () => {
    if (user?.email) {
      axios.get(`/events/created/${user.email}`).then(res => setEvents(res.data));
    }
  };

  const handleEventDeleted = (deletedEventId) => {
    // Remove the deleted event from the state
    setEvents(events.filter(ev => ev.id !== deletedEventId));
    // Clear selection if the deleted event was selected
    if (selected?.id === deletedEventId) {
      setSelected(null);
    }
  };

  const handleEventUpdated = (updatedEvent) => {
    // Update the event in the state
    setEvents(events.map(ev => ev.id === updatedEvent.id ? updatedEvent : ev));
    // Update selection if the updated event was selected
    if (selected?.id === updatedEvent.id) {
      setSelected(updatedEvent);
    }
  };

  useEffect(() => {
    refreshEvents();
  }, []);

  return (
    <div className="container">
      <h2 className="text-center mb-3" style={{ color: '#007bff' }}>My Created Events</h2>
      <div className="grid-auto">
        {events.map(ev => (
          <div 
            key={ev.id} 
            className="card"
            style={{ 
              cursor: 'pointer',
              backgroundColor: selected?.id === ev.id ? '#e3f2fd' : 'white',
              border: selected?.id === ev.id ? '2px solid #007bff' : '1px solid #dee2e6',
              transition: 'all 0.2s ease'
            }} 
            onClick={() => setSelected(ev)}
          >
            <h4 style={{ margin: '0 0 8px 0', color: '#007bff' }}>{ev.title}</h4>
            <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
              📅 {new Date(ev.event_date).toLocaleString()}
            </p>
            <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
              📍 {ev.location}
            </p>
          </div>
        ))}
      </div>
      {events.length === 0 && (
        <div className="card text-center" style={{ color: '#666' }}>
          <p>You haven't created any events yet.</p>
          <button 
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            Create Your First Event
          </button>
        </div>
      )}
      {selected && <EventDetails event={selected} onEventDeleted={handleEventDeleted} onEventUpdated={handleEventUpdated} />}
    </div>
  );
}