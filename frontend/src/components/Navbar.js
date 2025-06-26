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
  }, [location]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    window.addEventListener('resize', handleResize);
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsMobileMenuOpen(false);
    navigate("/");
    window.location.reload();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleMobileMenuClick = (e) => {
    e.stopPropagation();
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
        position: 'relative',
        zIndex: 100
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
          gap: '8px',
          flexWrap: 'nowrap',
          justifyContent: 'flex-end'
        }}>
          {user ? (
            <>
              <Link 
                to="/" 
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  marginRight: '10px',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s ease',
                  whiteSpace: 'nowrap',
                  fontSize: '14px'
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
                  marginRight: '10px',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s ease',
                  whiteSpace: 'nowrap',
                  fontSize: '14px'
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
                  marginRight: '10px',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s ease',
                  whiteSpace: 'nowrap',
                  fontSize: '14px'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Invitations
              </Link>
              <span style={{ 
                marginRight: '8px', 
                fontSize: '13px',
                whiteSpace: 'nowrap',
                maxWidth: '150px',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                Welcome, {user.email}
              </span>
              <button 
                onClick={handleLogout} 
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid white',
                  color: 'white',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  fontSize: '13px',
                  minWidth: '70px',
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
                  marginRight: '10px',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s ease',
                  whiteSpace: 'nowrap',
                  fontSize: '14px'
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
                  marginRight: '5px',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s ease',
                  whiteSpace: 'nowrap',
                  fontSize: '14px'
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
          className="hamburger-btn"
          onClick={toggleMobileMenu}
          style={{
            display: 'none',
            backgroundColor: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '5px',
            outline: 'none'
          }}
        >
          ☰
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1000,
            display: 'none'
          }}
          className="mobile-overlay"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '280px',
            height: '100vh',
            backgroundColor: '#007bff',
            background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
            zIndex: 1001,
            display: 'none',
            flexDirection: 'column',
            padding: '20px',
            boxShadow: '-2px 0 10px rgba(0,0,0,0.3)'
          }}
          className="mobile-menu"
          onClick={handleMobileMenuClick}
        >
          {/* Close Button */}
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
              fontSize: '18px',
              fontWeight: '600'
            }}>
              Menu
            </h3>
            <button 
              onClick={closeMobileMenu}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                fontSize: '24px',
                cursor: 'pointer',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
          </div>

          {/* User Info */}
          {user && (
            <div style={{ 
              marginBottom: '25px', 
              padding: '15px', 
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <small style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
                Logged in as:
              </small>
              <div style={{ 
                color: 'white', 
                fontWeight: 'bold', 
                fontSize: '14px',
                marginTop: '5px',
                wordBreak: 'break-word'
              }}>
                {user.email}
              </div>
            </div>
          )}

          {/* Menu Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {user ? (
              <>
                <Link 
                  to="/" 
                  onClick={closeMobileMenu}
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    padding: '15px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    textAlign: 'center',
                    fontSize: '16px'
                  }}
                >
                  🏠 Home
                </Link>
                <Link 
                  to="/myevents" 
                  onClick={closeMobileMenu}
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    padding: '15px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    textAlign: 'center',
                    fontSize: '16px'
                  }}
                >
                  📋 My Events
                </Link>
                <Link 
                  to="/invitations" 
                  onClick={closeMobileMenu}
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    padding: '15px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    textAlign: 'center',
                    fontSize: '16px'
                  }}
                >
                  📧 Invitations
                </Link>
                <button 
                  onClick={handleLogout}
                  style={{
                    backgroundColor: 'rgba(220, 53, 69, 0.8)',
                    border: 'none',
                    color: 'white',
                    padding: '15px',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    fontSize: '16px',
                    marginTop: '20px'
                  }}
                >
                  🚪 Logout
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
                    padding: '15px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    textAlign: 'center',
                    fontSize: '16px'
                  }}
                >
                  🔑 Login
                </Link>
                <Link 
                  to="/signup" 
                  onClick={closeMobileMenu}
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    padding: '15px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(40, 167, 69, 0.8)',
                    textAlign: 'center',
                    fontSize: '16px'
                  }}
                >
                  📝 Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}