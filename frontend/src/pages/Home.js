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
      <h1 className="text-center mb-3" style={{ color: '#007bff', fontSize: '1.75rem', fontWeight: '700' }}>
        👋 Welcome back!
      </h1>
      <p className="text-center" style={{ color: '#666', marginBottom: '25px', fontSize: '14px' }}>
        {user?.email}
      </p>
      
      {/* Dashboard Stats */}
      <div className="grid-auto mb-3">
        <div className="card text-center" style={{ 
          backgroundColor: '#e3f2fd', 
          border: '2px solid #2196f3',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#1976d2', fontSize: '1rem', fontWeight: '600' }}>
            📅 My Events
          </h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1976d2', marginBottom: '5px' }}>
            {myEventsCount}
          </div>
          <small style={{ color: '#1976d2', fontSize: '12px' }}>Events Created</small>
        </div>
        
        <div className="card text-center" style={{ 
          backgroundColor: pendingInvitations.length > 0 ? '#ffebee' : '#e8f5e8', 
          border: `2px solid ${pendingInvitations.length > 0 ? '#f44336' : '#4caf50'}`,
          borderRadius: '12px',
          padding: '20px'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: pendingInvitations.length > 0 ? '#d32f2f' : '#388e3c', fontSize: '1rem', fontWeight: '600' }}>
            📧 Pending Invites
          </h3>
          <div style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: pendingInvitations.length > 0 ? '#d32f2f' : '#388e3c',
            marginBottom: '5px'
          }}>
            {pendingInvitations.length}
          </div>
          {pendingInvitations.length > 0 ? (
            <small style={{ color: '#d32f2f', fontSize: '12px', fontWeight: '600' }}>Need Response!</small>
          ) : (
            <small style={{ color: '#388e3c', fontSize: '12px' }}>All Caught Up!</small>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex-center mb-3">
        <button 
          onClick={() => document.getElementById('event-form').scrollIntoView({ behavior: 'smooth' })}
          className="btn btn-success"
          style={{ borderRadius: '10px', fontWeight: '600' }}
        >
          ✨ Create New Event
        </button>
        
        <button 
          onClick={() => navigate('/myevents')}
          className="btn btn-primary"
          style={{ borderRadius: '10px', fontWeight: '600' }}
        >
          📋 Manage Events
        </button>
        
        <button 
          onClick={() => navigate('/invitations')}
          className="btn btn-secondary"
          style={{ backgroundColor: '#6f42c1', borderRadius: '10px', fontWeight: '600' }}
        >
          📧 Invitations {pendingInvitations.length > 0 && `(${pendingInvitations.length})`}
        </button>
      </div>

      {/* Event Creation Form */}
      <div id="event-form">
        <EventForm onEventCreated={() => {
          window.location.reload();
        }} />
      </div>
      
    </div>
  );
}

