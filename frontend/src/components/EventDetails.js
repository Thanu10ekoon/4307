import { useEffect, useState } from "react";
import axios from "../api/axios";
import FeedbackForm from "./FeedbackForm";

export default function EventDetails({ event, onEventDeleted, onEventUpdated }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Edit form states
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editReminders, setEditReminders] = useState([]);
  const [newReminder, setNewReminder] = useState('');
  
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (event?.id) {
      // Get feedbacks for this event
      axios.get(`/events/${event.id}/feedback`).then((res) => setFeedbacks(res.data));
      
      // Get invitations for this event
      axios.get(`/events/${event.id}/invitations`).then((res) => setInvitations(res.data));
      
      // Get all users for invitation
      axios.get(`/auth/users`).then((res) => setAllUsers(res.data));
      
      // Initialize edit form with current values
      setEditTitle(event.title);
      setEditDate(new Date(event.event_date).toISOString().slice(0, 16));
      setEditLocation(event.location);
      
      // Get reminders for this event
      axios.get(`/events/${event.id}/reminders`).then((res) => setEditReminders(res.data));
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

  const deleteEvent = async () => {
    if (!window.confirm(`Are you sure you want to delete "${event.title}"? This action cannot be undone and all invitees will be notified.`)) {
      return;
    }

    setIsDeleting(true);
    
    try {
      const response = await axios.delete(`/events/${event.id}`, {
        data: { creator_email: user.email }
      });

      // Send cancellation notifications to invitees
      if (response.data.invitees && response.data.invitees.length > 0) {
        try {
          await axios.post('/invitations/notify-cancellation', {
            event_title: event.title,
            event_date: new Date(event.event_date).toLocaleString(),
            invitee_emails: response.data.invitees,
            creator_email: user.email
          });
        } catch (notifyErr) {
          console.error('Failed to send cancellation notifications:', notifyErr);
          // Don't fail the deletion if notification fails
        }
      }

      alert(`Event "${event.title}" has been deleted successfully.`);
      
      // Call parent callback to refresh the events list
      if (onEventDeleted) {
        onEventDeleted(event.id);
      }
      
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete event');
    } finally {
      setIsDeleting(false);
    }
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    // Reset to original values
    setEditTitle(event.title);
    setEditDate(new Date(event.event_date).toISOString().slice(0, 16));
    setEditLocation(event.location);
    // Reset reminders - get them again
    axios.get(`/events/${event.id}/reminders`).then((res) => setEditReminders(res.data));
  };

  const addEditReminder = () => {
    if (newReminder && !editReminders.includes(parseInt(newReminder))) {
      setEditReminders([...editReminders, parseInt(newReminder)]);
      setNewReminder('');
    }
  };

  const removeEditReminder = (daysBefore) => {
    setEditReminders(editReminders.filter(r => r !== daysBefore));
  };

  const updateEvent = async () => {
    if (!editTitle.trim() || !editDate || !editLocation.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsUpdating(true);
    
    try {
      // Determine what changed
      const changes = [];
      if (editTitle !== event.title) changes.push('title');
      if (editDate !== new Date(event.event_date).toISOString().slice(0, 16)) changes.push('date');
      if (editLocation !== event.location) changes.push('location');
      
      const response = await axios.put(`/events/${event.id}`, {
        creator_email: user.email,
        title: editTitle,
        event_date: editDate,
        location: editLocation,
        reminders: editReminders
      });

      // Send update notifications to invitees if there are changes
      if (changes.length > 0 && response.data.invitees && response.data.invitees.length > 0) {
        try {
          await axios.post('/invitations/notify-update', {
            event_title: editTitle,
            event_date: new Date(editDate).toLocaleString(),
            location: editLocation,
            invitee_emails: response.data.invitees,
            creator_email: user.email,
            changes: changes
          });
        } catch (notifyErr) {
          console.error('Failed to send update notifications:', notifyErr);
        }
      }

      alert(`Event "${editTitle}" has been updated successfully.`);
      
      setIsEditing(false);
      
      // Call parent callback to refresh the events list with updated event
      if (onEventUpdated) {
        const updatedEvent = {
          ...event,
          title: editTitle,
          event_date: editDate,
          location: editLocation
        };
        onEventUpdated(updatedEvent);
      }
      
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="card mt-2" style={{ border: '2px solid #007bff', backgroundColor: '#f8f9fa' }}>
      <div className="flex-space-between mb-2">
        <h3 style={{ color: '#007bff', margin: 0 }}>{event.title}</h3>
        {isCreator && (
          <div className="flex-start" style={{ gap: '8px' }}>
            {!isEditing ? (
              <>
                <button 
                  onClick={startEditing}
                  className="btn btn-primary btn-small"
                  style={{ 
                    fontSize: '12px',
                    padding: '6px 12px'
                  }}
                >
                  ✏️ Edit
                </button>
                <button 
                  onClick={deleteEvent}
                  disabled={isDeleting}
                  className="btn btn-danger btn-small"
                  style={{ 
                    fontSize: '12px',
                    padding: '6px 12px',
                    backgroundColor: isDeleting ? '#ccc' : '#dc3545'
                  }}
                >
                  {isDeleting ? '🔄 Deleting...' : '🗑️ Delete'}
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={updateEvent}
                  disabled={isUpdating}
                  className="btn btn-success btn-small"
                  style={{ 
                    fontSize: '12px',
                    padding: '6px 12px',
                    backgroundColor: isUpdating ? '#ccc' : '#28a745'
                  }}
                >
                  {isUpdating ? '🔄 Saving...' : '💾 Save'}
                </button>
                <button 
                  onClick={cancelEditing}
                  className="btn btn-secondary btn-small"
                  style={{ 
                    fontSize: '12px',
                    padding: '6px 12px'
                  }}
                >
                  ❌ Cancel
                </button>
              </>
            )}
          </div>
        )}
      </div>
      
      {isEditing ? (
        <div className="card mb-2" style={{ backgroundColor: 'white', border: '1px solid #007bff' }}>
          <h4 style={{ marginBottom: '15px', color: '#007bff' }}>✏️ Edit Event Details</h4>
          
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="🎉 Event Title"
            className="form-input"
            style={{ fontSize: '16px', padding: '12px', marginBottom: '15px' }}
          />
          
          <input
            type="datetime-local"
            value={editDate}
            onChange={(e) => setEditDate(e.target.value)}
            className="form-input"
            style={{ fontSize: '16px', padding: '12px', marginBottom: '15px' }}
          />
          
          <input
            value={editLocation}
            onChange={(e) => setEditLocation(e.target.value)}
            placeholder="📍 Event Location"
            className="form-input"
            style={{ fontSize: '16px', padding: '12px', marginBottom: '15px' }}
          />
          
          <div>
            <h5 style={{ marginBottom: '10px', fontSize: '1rem', fontWeight: '600' }}>
              ⏰ Reminders (days before event):
            </h5>
            <div className="flex-start mb-1">
              <input
                type="number"
                value={newReminder}
                onChange={(e) => setNewReminder(e.target.value)}
                placeholder="Days before"
                min="1"
                className="form-input"
                style={{ 
                  flex: '1', 
                  minWidth: '120px', 
                  marginBottom: '10px', 
                  marginRight: '10px',
                  fontSize: '14px',
                  padding: '8px'
                }}
              />
              <button 
                type="button" 
                onClick={addEditReminder} 
                className="btn btn-primary btn-small"
                style={{ borderRadius: '6px', fontSize: '12px' }}
              >
                ➕ Add
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {editReminders.map(days => (
                <span key={days} style={{ 
                  padding: '6px 10px', 
                  backgroundColor: '#f8f9fa', 
                  border: '1px solid #dee2e6',
                  borderRadius: '6px',
                  fontSize: '12px',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  ⏰ {days} days
                  <button 
                    type="button" 
                    onClick={() => removeEditReminder(days)} 
                    style={{ 
                      marginLeft: '4px', 
                      color: '#dc3545', 
                      border: 'none', 
                      background: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >×</button>
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <p style={{ marginBottom: '8px' }}><strong>Date:</strong> {eventDate.toLocaleString()}</p>
          <p style={{ marginBottom: '8px' }}><strong>Location:</strong> {event.location}</p>
          <p style={{ marginBottom: '20px' }}><strong>Created by:</strong> {event.creator_email}</p>
        </>
      )}
      
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