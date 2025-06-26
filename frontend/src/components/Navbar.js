import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
  }, [location]); // Re-check user data when route changes

  useEffect(() => {
    // Handle body scroll when mobile menu is open
    if (isMobileMenuOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    // Close mobile menu when clicking outside
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.mobile-menu-button')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsMobileMenuOpen(false);
    navigate("/");
    window.location.reload(); // Force page refresh to update state
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        position: 'relative'
      }}>
        <div style={{ 
          fontSize: '20px', 
          fontWeight: 'bold'
        }}>
          RSVP Event Manager
        </div>

        {/* Desktop Menu */}
        <div className="desktop-menu" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px'
        }}>
          {user ? (
            <>
              <Link 
                to="/" 
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  marginRight: '15px',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Home
              </Link>
              <Link 
                to="/myevents" 
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  marginRight: '15px',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                My Events
              </Link>
              <Link 
                to="/invitations" 
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  marginRight: '15px',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Invitations
              </Link>
              <span style={{ 
                marginRight: '10px', 
                fontSize: '14px',
                whiteSpace: 'nowrap'
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
              <Link 
                to="/login" 
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  marginRight: '15px',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  marginRight: '15px',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Signup
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          className="mobile-menu-button"
          onClick={toggleMobileMenu}
          style={{
            display: 'none',
            backgroundColor: 'transparent',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'white',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '8px 10px',
            borderRadius: '4px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
            e.target.style.borderColor = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.borderColor = 'rgba(255,255,255,0.3)';
          }}
        >
          ☰
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-menu-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999,
            display: 'none'
          }}
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      <div 
        className="mobile-menu"
        style={{
          position: 'fixed',
          top: 0,
          right: isMobileMenuOpen ? '0' : '-100%',
          width: '100%',
          height: '100vh',
          backgroundColor: '#007bff',
          zIndex: 1000,
          transition: 'right 0.3s ease',
          display: 'none',
          flexDirection: 'column',
          padding: '20px 15px',
          background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
          overflowY: 'auto'
        }}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '30px',
          borderBottom: '1px solid rgba(255,255,255,0.2)',
          paddingBottom: '20px'
        }}>
          <h3 style={{ 
            color: 'white', 
            margin: 0, 
            fontSize: '20px',
            fontWeight: '700'
          }}>
            📱 Menu
          </h3>
          <button 
            onClick={closeMobileMenu}
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
          >
            ×
          </button>
        </div>

        {user && (
          <div style={{ 
            marginBottom: '25px', 
            padding: '15px', 
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <small style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px' }}>Logged in as:</small>
            <div style={{ 
              color: 'white', 
              fontWeight: 'bold', 
              fontSize: '15px',
              marginTop: '5px',
              wordBreak: 'break-word'
            }}>
              {user.email}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {user ? (
            <>
              <Link 
                to="/" 
                onClick={closeMobileMenu}
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  fontSize: '16px',
                  fontWeight: '500',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                <span style={{ fontSize: '20px' }}>🏠</span> Home
              </Link>
              <Link 
                to="/myevents" 
                onClick={closeMobileMenu}
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  fontSize: '16px',
                  fontWeight: '500',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                <span style={{ fontSize: '20px' }}>📋</span> My Events
              </Link>
              <Link 
                to="/invitations" 
                onClick={closeMobileMenu}
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  fontSize: '16px',
                  fontWeight: '500',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                <span style={{ fontSize: '20px' }}>📧</span> Invitations
              </Link>
              <button 
                onClick={handleLogout}
                style={{
                  backgroundColor: 'rgba(220, 53, 69, 0.9)',
                  border: '1px solid rgba(220, 53, 69, 1)',
                  color: 'white',
                  padding: '16px 20px',
                  cursor: 'pointer',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginTop: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  transition: 'all 0.3s ease'
                }}
              >
                <span style={{ fontSize: '20px' }}>🚪</span> Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                onClick={closeMobileMenu}
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  textAlign: 'center',
                  fontSize: '16px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                <span style={{ fontSize: '20px' }}>🔑</span> Login
              </Link>
              <Link 
                to="/signup" 
                onClick={closeMobileMenu}
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  backgroundColor: 'rgba(40, 167, 69, 0.9)',
                  border: '1px solid rgba(40, 167, 69, 1)',
                  textAlign: 'center',
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                <span style={{ fontSize: '20px' }}>📝</span> Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}