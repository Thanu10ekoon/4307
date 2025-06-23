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

  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px',
    backgroundColor: '#007bff',
    color: 'white'
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    marginRight: '20px'
  };

  const buttonStyle = {
    backgroundColor: 'transparent',
    border: '1px solid white',
    color: 'white',
    padding: '8px 16px',
    cursor: 'pointer'
  };

  return (
    <nav style={navStyle}>
      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>RSVP Event Manager</div>
      <div>
        {user ? (
          <>
            <Link to="/" style={linkStyle}>Home</Link>
            <Link to="/myevents" style={linkStyle}>My Events</Link>
            <Link to="/invitations" style={linkStyle}>Invitations</Link>
            <span style={{ marginRight: '10px' }}>Welcome, {user.email}</span>
            <button onClick={handleLogout} style={buttonStyle}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/signup" style={linkStyle}>Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}