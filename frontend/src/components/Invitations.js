// src/components/Invitations.js
import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function Invitations() {
  const [receivedInvitations, setReceivedInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user?.email) {
      fetchReceivedInvitations();
    }
  }, []);

  const fetchReceivedInvitations = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/invitations/for-user/${user.email}`);
      
      // Get event details for each invitation
      const invitationsWithDetails = await Promise.all(
        res.data.map(async (inv) => {
          try {
            const eventRes = await axios.get(`/events/${inv.event_id}`);
            return { ...inv, event: eventRes.data };
          } catch (err) {
            return { ...inv, event: { title: 'Event not found', event_date: '', location: '' } };
          }
        })
      );
      
      setReceivedInvitations(invitationsWithDetails);
    } catch (err) {
      console.error('Failed to fetch invitations:', err);
    } finally {
      setLoading(false);
    }
  };

  const respondToInvitation = async (eventId, response) => {
    try {
      await axios.post('/invitations/respond', {
        event_id: eventId,
        recipient_email: user.email,
        response
      });
      alert(`RSVP updated to: ${response}`);
      fetchReceivedInvitations(); // Refresh the list
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update RSVP');
    }
  };

  const pendingInvitations = receivedInvitations.filter(inv => !inv.response);
  const respondedInvitations = receivedInvitations.filter(inv => inv.response);

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading invitations...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>My Invitations</h2>

      {pendingInvitations.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#dc3545' }}>Pending RSVPs ({pendingInvitations.length})</h3>
          {pendingInvitations.map((inv) => (
            <div 
              key={inv.id} 
              style={{ 
                border: '2px solid #dc3545', 
                padding: '15px', 
                marginBottom: '15px', 
                backgroundColor: '#fff5f5' 
              }}
            >
              <h4>{inv.event.title}</h4>
              <p><strong>Date:</strong> {new Date(inv.event.event_date).toLocaleString()}</p>
              <p><strong>Location:</strong> {inv.event.location}</p>
              <p><strong>Host:</strong> {inv.event.creator_email}</p>
              
              <div style={{ marginTop: '15px' }}>
                <button 
                  onClick={() => respondToInvitation(inv.event_id, 'Attending')}
                  style={{ 
                    padding: '10px 20px', 
                    backgroundColor: '#28a745', 
                    color: 'white', 
                    border: 'none', 
                    marginRight: '10px' 
                  }}
                >
                  ✓ I'll Attend
                </button>
                <button 
                  onClick={() => respondToInvitation(inv.event_id, 'Not Attending')}
                  style={{ 
                    padding: '10px 20px', 
                    backgroundColor: '#dc3545', 
                    color: 'white', 
                    border: 'none' 
                  }}
                >
                  ✗ Can't Attend
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {respondedInvitations.length > 0 && (
        <div>
          <h3>Responded Invitations ({respondedInvitations.length})</h3>
          {respondedInvitations.map((inv) => (
            <div 
              key={inv.id} 
              style={{ 
                border: '1px solid #dee2e6', 
                padding: '15px', 
                marginBottom: '15px', 
                backgroundColor: inv.response === 'Attending' ? '#d4edda' : '#f8d7da' 
              }}
            >
              <h4>{inv.event.title}</h4>
              <p><strong>Date:</strong> {new Date(inv.event.event_date).toLocaleString()}</p>
              <p><strong>Location:</strong> {inv.event.location}</p>
              <p><strong>Host:</strong> {inv.event.creator_email}</p>
              <p>
                <strong>Your Response:</strong> 
                <span style={{ 
                  color: inv.response === 'Attending' ? '#155724' : '#721c24',
                  fontWeight: 'bold',
                  marginLeft: '10px'
                }}>
                  {inv.response}
                </span>
              </p>
              
              <div style={{ marginTop: '10px' }}>
                <small>
                  <button 
                    onClick={() => respondToInvitation(inv.event_id, inv.response === 'Attending' ? 'Not Attending' : 'Attending')}
                    style={{ 
                      padding: '5px 10px', 
                      backgroundColor: '#6c757d', 
                      color: 'white', 
                      border: 'none',
                      fontSize: '12px'
                    }}
                  >
                    Change to {inv.response === 'Attending' ? 'Not Attending' : 'Attending'}
                  </button>
                </small>
              </div>
            </div>
          ))}
        </div>
      )}

      {receivedInvitations.length === 0 && (
        <div style={{ textAlign: 'center', color: '#666', fontStyle: 'italic', padding: '40px' }}>
          No invitations found. When someone invites you to an event, it will appear here.
        </div>
      )}
    </div>
  );
}