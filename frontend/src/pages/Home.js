import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EventForm from "../components/EventForm";
import EventList from "../components/EventList";
import axios from "../api/axios";

export default function Home() {
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [myEventsCount, setMyEventsCount] = useState(0);
  const navigate = useNavigate();
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
    <div className="container">
      <h1 className="text-center mb-3" style={{ color: '#007bff' }}>
        Welcome back, {user?.email}!
      </h1>
      
      {/* Dashboard Stats */}
      <div className="grid-auto mb-3">
        <div className="card text-center" style={{ 
          backgroundColor: '#e3f2fd', 
          border: '1px solid #2196f3'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>My Events</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1976d2' }}>
            {myEventsCount}
          </div>
        </div>
        
        <div className="card text-center" style={{ 
          backgroundColor: pendingInvitations.length > 0 ? '#ffebee' : '#e8f5e8', 
          border: `1px solid ${pendingInvitations.length > 0 ? '#f44336' : '#4caf50'}`
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
      <div className="flex-center mb-3">
        <button 
          onClick={() => document.getElementById('event-form').scrollIntoView({ behavior: 'smooth' })}
          className="btn btn-success"
        >
          📅 Create New Event
        </button>
        
        <button 
          onClick={() => navigate('/myevents')}
          className="btn btn-primary"
        >
          📋 Manage My Events
        </button>
        
        <button 
          onClick={() => navigate('/invitations')}
          className="btn btn-secondary"
          style={{ backgroundColor: '#6f42c1' }}
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

