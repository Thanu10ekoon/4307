// src/pages/MyEvents.js
import { useEffect, useState } from "react";
import axios from "../api/axios";
import EventDetails from "../components/EventDetails";

export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user?.email) {
      axios.get(`/events/created/${user.email}`).then(res => setEvents(res.data));
    }
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>My Created Events</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {events.map(ev => (
          <li 
            key={ev.id} 
            style={{ 
              border: '1px solid #ccc', 
              padding: '10px', 
              marginBottom: '10px', 
              cursor: 'pointer',
              backgroundColor: selected?.id === ev.id ? '#e3f2fd' : 'white'
            }} 
            onClick={() => setSelected(ev)}
          >
            <strong>{ev.title}</strong>
            <br />
            <small>{new Date(ev.event_date).toLocaleString()} - {ev.location}</small>
          </li>
        ))}
      </ul>
      {selected && <EventDetails event={selected} />}
    </div>
  );
}