import { useEffect, useState } from "react";
import axios from "../api/axios";
import FeedbackForm from "./FeedbackForm";

export default function EventDetails({ event }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (event?.id) {
      // Get feedbacks for this event
      axios.get(`/events/${event.id}/feedback`).then((res) => setFeedbacks(res.data));
      
      // Get invitations for this event
      axios.get(`/events/${event.id}/invitations`).then((res) => setInvitations(res.data));
      
      // Get all users for invitation
      axios.get(`/auth/users`).then((res) => setAllUsers(res.data));
    }
  }, [event]);

  const isCreator = event.creator_email === user?.email;
  const eventDate = new Date(event.event_date);
  const isEventPast = eventDate < new Date();

  const sendInvitations = async () => {
    if (selectedUsers.length === 0) {
      alert('Please select users to invite');
      return;
    }
    
    try {
      await axios.post('/invitations/send', {
        event_id: event.id,
        recipient_emails: selectedUsers
      });
      alert('Invitations sent successfully!');
      // Refresh invitations
      axios.get(`/events/${event.id}/invitations`).then((res) => setInvitations(res.data));
      setSelectedUsers([]);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to send invitations');
    }
  };

  const handleUserSelection = (email) => {
    if (selectedUsers.includes(email)) {
      setSelectedUsers(selectedUsers.filter(u => u !== email));
    } else {
      setSelectedUsers([...selectedUsers, email]);
    }
  };

  return (
    <div className="card mt-2" style={{ border: '2px solid #007bff', backgroundColor: '#f8f9fa' }}>
      <h3 style={{ color: '#007bff', marginBottom: '15px' }}>{event.title}</h3>
      <p style={{ marginBottom: '8px' }}><strong>Date:</strong> {eventDate.toLocaleString()}</p>
      <p style={{ marginBottom: '8px' }}><strong>Location:</strong> {event.location}</p>
      <p style={{ marginBottom: '20px' }}><strong>Created by:</strong> {event.creator_email}</p>
      
      {isCreator && (
        <div className="card mt-2">
          <h4 style={{ marginBottom: '15px' }}>Send Invitations</h4>
          <div style={{ 
            maxHeight: '150px', 
            overflowY: 'auto', 
            border: '1px solid #ccc', 
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '15px'
          }}>
            {allUsers.map(u => (
              <div key={u.email} style={{ marginBottom: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(u.email)}
                    onChange={() => handleUserSelection(u.email)}
                    disabled={u.email === user.email} // Don't allow self-invitation
                  />
                  <span>{u.username} ({u.email})</span>
                </label>
              </div>
            ))}
          </div>
          <button 
            onClick={sendInvitations}
            className="btn btn-success"
          >
            Send Invitations ({selectedUsers.length} selected)
          </button>
        </div>
      )}

      <div className="mt-2">
        <h4 style={{ marginBottom: '15px' }}>Invitations ({invitations.length})</h4>
        <div className="card" style={{ backgroundColor: 'white' }}>
          {invitations.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center' }}>No invitations sent yet</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {invitations.map((inv, i) => (
                <li key={i} style={{ 
                  padding: '8px 0', 
                  borderBottom: i < invitations.length - 1 ? '1px solid #eee' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  <span>{inv.recipient_email}</span>
                  <span style={{ 
                    color: inv.response === 'Attending' ? 'green' : inv.response === 'Not Attending' ? 'red' : '#666',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}>
                    {inv.response || 'Pending'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-2">
        <h4 style={{ marginBottom: '15px' }}>Feedbacks ({feedbacks.length})</h4>
        <div className="card" style={{ backgroundColor: 'white' }}>
          {feedbacks.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center' }}>No feedback yet</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {feedbacks.map((fb, i) => (
                <li key={i} style={{ 
                  padding: '10px', 
                  backgroundColor: '#f8f9fa', 
                  marginBottom: '8px', 
                  border: '1px solid #dee2e6',
                  borderRadius: '4px'
                }}>
                  <strong style={{ color: '#007bff' }}>{fb.user_email}:</strong>
                  <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>{fb.message}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {isEventPast && !isCreator && (
          <div className="mt-2">
            <FeedbackForm eventId={event.id} onFeedbackSubmitted={() => {
              axios.get(`/events/${event.id}/feedback`).then((res) => setFeedbacks(res.data));
            }} />
          </div>
        )}
      </div>
    </div>
  );
}