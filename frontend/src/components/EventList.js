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
    <div style={{ padding: '20px' }}>
      <h2>All Events</h2>
      <p style={{ color: '#666', fontStyle: 'italic' }}>
        Note: All events listing needs backend support. Currently showing user's events only.
      </p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {events.map((event) => (
          <li 
            key={event.id} 
            style={{ 
              border: '1px solid #ccc', 
              padding: '10px', 
              marginBottom: '10px', 
              cursor: 'pointer',
              backgroundColor: selected?.id === event.id ? '#e3f2fd' : 'white'
            }} 
            onClick={() => setSelected(event)}
          >
            <strong>{event.title}</strong>
            <br />
            <small>{event.event_date ? new Date(event.event_date).toLocaleString() : ''} - {event.location}</small>
          </li>
        ))}
      </ul>
      {selected && <EventDetails event={selected} />}
    </div>
  );
}
