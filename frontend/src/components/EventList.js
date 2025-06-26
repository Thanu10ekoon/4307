import { useEffect, useState } from "react";
import axios from "../api/axios";
import EventDetails from "./EventDetails";

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    // Since there's no /events route in backend, we'll need to get all events
    // For now, let's show a message that this needs backend support
    setEvents([]);
  }, []);

  return (
    <div className="card">
      <h3 style={{ marginBottom: '20px', color: '#007bff' }}>All Events</h3>
      <p style={{ color: '#666', fontStyle: 'italic', marginBottom: '20px' }}>
        Note: All events listing needs backend support. Currently showing user's events only.
      </p>
      <div style={{ display: 'grid', gap: '10px' }}>
        {events.map((event) => (
          <div 
            key={event.id} 
            style={{ 
              border: '1px solid #dee2e6', 
              padding: '15px', 
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: selected?.id === event.id ? '#e3f2fd' : '#f8f9fa',
              transition: 'all 0.2s ease'
            }} 
            onClick={() => setSelected(event)}
          >
            <h5 style={{ margin: '0 0 8px 0', color: '#007bff' }}>{event.title}</h5>
            {event.event_date && (
              <small style={{ color: '#666' }}>
                📅 {new Date(event.event_date).toLocaleString()} - 📍 {event.location}
              </small>
            )}
          </div>
        ))}
      </div>
      {events.length === 0 && (
        <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
          No events to display.
        </div>
      )}
      {selected && <EventDetails event={selected} />}
    </div>
  );
}
