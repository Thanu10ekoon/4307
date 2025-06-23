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
    <div style={{ padding: '20px', border: '2px solid #007bff', marginTop: '20px', backgroundColor: '#f8f9fa' }}>
      <h3 style={{ color: '#007bff' }}>{event.title}</h3>
      <p><strong>Date:</strong> {eventDate.toLocaleString()}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Created by:</strong> {event.creator_email}</p>
      
      {isCreator && (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #dee2e6', backgroundColor: 'white' }}>
          <h4>Send Invitations</h4>
          <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
            {allUsers.map(u => (
              <div key={u.email} style={{ marginBottom: '5px' }}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(u.email)}
                    onChange={() => handleUserSelection(u.email)}
                    disabled={u.email === user.email} // Don't allow self-invitation
                  />
                  {u.username} ({u.email})
                </label>
              </div>
            ))}
          </div>
          <button 
            onClick={sendInvitations}
            style={{ 
              marginTop: '10px', 
              padding: '8px 16px', 
              backgroundColor: '#28a745', 
              color: 'white', 
              border: 'none' 
            }}
          >
            Send Invitations ({selectedUsers.length} selected)
          </button>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <h4>Invitations ({invitations.length})</h4>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {invitations.map((inv, i) => (
            <li key={i} style={{ padding: '5px', borderBottom: '1px solid #eee' }}>
              {inv.recipient_email} - 
              <span style={{ 
                color: inv.response === 'Attending' ? 'green' : inv.response === 'Not Attending' ? 'red' : '#666',
                fontWeight: 'bold',
                marginLeft: '10px'
              }}>
                {inv.response || 'Pending'}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h4>Feedbacks ({feedbacks.length})</h4>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {feedbacks.map((fb, i) => (
            <li key={i} style={{ padding: '10px', backgroundColor: 'white', marginBottom: '5px', border: '1px solid #dee2e6' }}>
              <strong>{fb.user_email}:</strong> {fb.message}
            </li>
          ))}
        </ul>
        
        {isEventPast && !isCreator && <FeedbackForm eventId={event.id} onFeedbackSubmitted={() => {
          axios.get(`/events/${event.id}/feedback`).then((res) => setFeedbacks(res.data));
        }} />}
      </div>
    </div>
  );
}