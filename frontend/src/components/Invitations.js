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
    <div className="container">
      <h2 className="text-center mb-3" style={{ color: '#007bff' }}>My Invitations</h2>

      {pendingInvitations.length > 0 && (
        <div className="mb-3">
          <h3 className="mb-2" style={{ color: '#dc3545' }}>
            Pending RSVPs ({pendingInvitations.length})
          </h3>
          {pendingInvitations.map((inv) => (
            <div key={inv.id} className="card" style={{ 
              border: '2px solid #dc3545', 
              backgroundColor: '#fff5f5' 
            }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#dc3545' }}>{inv.event.title}</h4>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>📅 Date:</strong> {new Date(inv.event.event_date).toLocaleString()}
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>📍 Location:</strong> {inv.event.location}
              </p>
              <p className="mb-2">
                <strong>🎭 Host:</strong> {inv.event.creator_email}
              </p>
              
              <div className="flex-center">
                <button 
                  onClick={() => respondToInvitation(inv.event_id, 'Attending')}
                  className="btn btn-success"
                >
                  ✓ I'll Attend
                </button>
                <button 
                  onClick={() => respondToInvitation(inv.event_id, 'Not Attending')}
                  className="btn btn-danger"
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
          <h3 className="mb-2">Responded Invitations ({respondedInvitations.length})</h3>
          {respondedInvitations.map((inv) => (
            <div key={inv.id} className="card" style={{ 
              backgroundColor: inv.response === 'Attending' ? '#d4edda' : '#f8d7da' 
            }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#007bff' }}>{inv.event.title}</h4>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>📅 Date:</strong> {new Date(inv.event.event_date).toLocaleString()}
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>📍 Location:</strong> {inv.event.location}
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>🎭 Host:</strong> {inv.event.creator_email}
              </p>
              <p className="mb-2">
                <strong>Your Response:</strong> 
                <span style={{ 
                  color: inv.response === 'Attending' ? '#155724' : '#721c24',
                  fontWeight: 'bold',
                  marginLeft: '10px'
                }}>
                  {inv.response}
                </span>
              </p>
              
              <div className="text-center">
                <button 
                  onClick={() => respondToInvitation(inv.event_id, inv.response === 'Attending' ? 'Not Attending' : 'Attending')}
                  className="btn btn-secondary btn-small"
                >
                  Change to {inv.response === 'Attending' ? 'Not Attending' : 'Attending'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {receivedInvitations.length === 0 && (
        <div className="card text-center" style={{ color: '#666' }}>
          <h4>No invitations found</h4>
          <p>When someone invites you to an event, it will appear here.</p>
        </div>
      )}
    </div>
  );
}