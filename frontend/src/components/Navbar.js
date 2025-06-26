import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
  }, [location]); // Re-check user data when route changes

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    window.location.reload(); // Force page refresh to update state
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 20px',
      backgroundColor: '#007bff',
      color: 'white',
      flexWrap: 'wrap',
      gap: '10px'
    }}>
      <div style={{ 
        fontSize: '20px', 
        fontWeight: 'bold', 
        minWidth: '200px',
        marginBottom: '5px'
      }}>
        RSVP Event Manager
      </div>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '10px',
        justifyContent: 'center'
      }}>
        {user ? (
          <>
            <Link to="/" style={{
              color: 'white',
              textDecoration: 'none',
              marginRight: '15px',
              padding: '8px 12px',
              borderRadius: '4px',
              transition: 'background-color 0.2s ease',
              whiteSpace: 'nowrap'
            }}>Home</Link>
            <Link to="/myevents" style={{
              color: 'white',
              textDecoration: 'none',
              marginRight: '15px',
              padding: '8px 12px',
              borderRadius: '4px',
              transition: 'background-color 0.2s ease',
              whiteSpace: 'nowrap'
            }}>My Events</Link>
            <Link to="/invitations" style={{
              color: 'white',
              textDecoration: 'none',
              marginRight: '15px',
              padding: '8px 12px',
              borderRadius: '4px',
              transition: 'background-color 0.2s ease',
              whiteSpace: 'nowrap'
            }}>Invitations</Link>
            <span style={{ 
              marginRight: '10px', 
              fontSize: '14px',
              whiteSpace: 'nowrap',
              textAlign: 'center',
              width: '100%',
              order: window.innerWidth <= 768 ? -1 : 0
            }}>
              Welcome, {user.email}
            </span>
            <button 
              onClick={handleLogout} 
              style={{
                backgroundColor: 'transparent',
                border: '1px solid white',
                color: 'white',
                padding: '8px 16px',
                cursor: 'pointer',
                borderRadius: '4px',
                fontSize: '14px',
                minWidth: '80px',
                whiteSpace: 'nowrap'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{
              color: 'white',
              textDecoration: 'none',
              marginRight: '15px',
              padding: '8px 12px',
              borderRadius: '4px',
              transition: 'background-color 0.2s ease',
              whiteSpace: 'nowrap'
            }}>Login</Link>
            <Link to="/signup" style={{
              color: 'white',
              textDecoration: 'none',
              marginRight: '15px',
              padding: '8px 12px',
              borderRadius: '4px',
              transition: 'background-color 0.2s ease',
              whiteSpace: 'nowrap'
            }}>Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}