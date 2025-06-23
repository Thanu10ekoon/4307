import { useState, useEffect } from "react";
import EventForm from "../components/EventForm";
import EventList from "../components/EventList";
import axios from "../api/axios";

export default function Home() {
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [myEventsCount, setMyEventsCount] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user?.email) {
      // Get pending invitations count
      axios.get(`/invitations/for-user/${user.email}`)
        .then(res => {
          const pending = res.data.filter(inv => !inv.response);
          setPendingInvitations(pending);
        })
        .catch(err => console.log('Error fetching invitations:', err));

      // Get my events count
      axios.get(`/events/created/${user.email}`)
        .then(res => setMyEventsCount(res.data.length))
        .catch(err => console.log('Error fetching events:', err));
    }
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#007bff', marginBottom: '30px' }}>
        Welcome back, {user?.email}!
      </h1>
      
      {/* Dashboard Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#e3f2fd', 
          border: '1px solid #2196f3', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>My Events</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1976d2' }}>
            {myEventsCount}
          </div>
        </div>
        
        <div style={{ 
          padding: '20px', 
          backgroundColor: pendingInvitations.length > 0 ? '#ffebee' : '#e8f5e8', 
          border: `1px solid ${pendingInvitations.length > 0 ? '#f44336' : '#4caf50'}`, 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: pendingInvitations.length > 0 ? '#d32f2f' : '#388e3c' }}>
            Pending Invitations
          </h3>
          <div style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: pendingInvitations.length > 0 ? '#d32f2f' : '#388e3c' 
          }}>
            {pendingInvitations.length}
          </div>
          {pendingInvitations.length > 0 && (
            <small style={{ color: '#d32f2f' }}>Awaiting your response!</small>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        marginBottom: '40px',
        flexWrap: 'wrap'
      }}>
        <button 
          onClick={() => document.getElementById('event-form').scrollIntoView({ behavior: 'smooth' })}
          style={{
            padding: '12px 24px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          📅 Create New Event
        </button>
        
        <button 
          onClick={() => window.location.href = '/myevents'}
          style={{
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          📋 Manage My Events
        </button>
        
        <button 
          onClick={() => window.location.href = '/invitations'}
          style={{
            padding: '12px 24px',
            backgroundColor: '#6f42c1',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          📧 View Invitations {pendingInvitations.length > 0 && `(${pendingInvitations.length})`}
        </button>
      </div>

      {/* Event Creation Form */}
      <div id="event-form">
        <EventForm onEventCreated={() => {
          window.location.reload();
        }} />
      </div>
      
      {/* Recent Events */}
      
    </div>
  );
}

