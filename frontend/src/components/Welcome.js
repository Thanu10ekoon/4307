import { Link } from 'react-router-dom';

export default function Welcome() {
  return (
    <div style={{ 
      padding: '60px 20px', 
      textAlign: 'center', 
      maxWidth: '800px', 
      margin: '0 auto' 
    }}>
      <h1 style={{ 
        fontSize: '3rem', 
        color: '#007bff', 
        marginBottom: '20px' 
      }}>
        Welcome to RSVP Event Manager
      </h1>
      
      <p style={{ 
        fontSize: '1.2rem', 
        color: '#666', 
        marginBottom: '40px',
        lineHeight: '1.6' 
      }}>
        Create events, send invitations, track RSVPs, set reminders, and collect feedback - all in one place!
      </p>
      
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        justifyContent: 'center', 
        flexWrap: 'wrap' 
      }}>
        <Link 
          to="/login"
          style={{
            padding: '15px 30px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: 'bold'
          }}
        >
          Login
        </Link>
        
        <Link 
          to="/signup"
          style={{
            padding: '15px 30px',
            backgroundColor: '#28a745',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: 'bold'
          }}
        >
          Sign Up
        </Link>
      </div>
      
      <div style={{ 
        marginTop: '60px', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '30px' 
      }}>
        <div style={{ 
          padding: '30px', 
          border: '1px solid #dee2e6', 
          borderRadius: '8px', 
          backgroundColor: 'white' 
        }}>
          <h3 style={{ color: '#007bff' }}>📅 Create Events</h3>
          <p>Easily create events with date, time, location, and custom reminder settings.</p>
        </div>
        
        <div style={{ 
          padding: '30px', 
          border: '1px solid #dee2e6', 
          borderRadius: '8px', 
          backgroundColor: 'white' 
        }}>
          <h3 style={{ color: '#007bff' }}>📧 Send Invitations</h3>
          <p>Invite multiple users to your events and track their RSVP responses in real-time.</p>
        </div>
        
        <div style={{ 
          padding: '30px', 
          border: '1px solid #dee2e6', 
          borderRadius: '8px', 
          backgroundColor: 'white' 
        }}>
          <h3 style={{ color: '#007bff' }}>⏰ Smart Reminders</h3>
          <p>Set custom reminders for your events to ensure attendees don't forget.</p>
        </div>
        
        <div style={{ 
          padding: '30px', 
          border: '1px solid #dee2e6', 
          borderRadius: '8px', 
          backgroundColor: 'white' 
        }}>
          <h3 style={{ color: '#007bff' }}>💬 Collect Feedback</h3>
          <p>Gather valuable feedback from attendees after your events conclude.</p>
        </div>
      </div>
    </div>
  );
}
