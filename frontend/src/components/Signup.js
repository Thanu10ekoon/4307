import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const res = await axios.post('/auth/signup', { username, email, password });
      alert(res.data.msg || 'Signup successful');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Create Account</h2>
      
      <input
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        style={{ 
          display: 'block', 
          marginBottom: '15px', 
          padding: '12px', 
          width: '100%', 
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '16px'
        }}
      />
      
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ 
          display: 'block', 
          marginBottom: '15px', 
          padding: '12px', 
          width: '100%', 
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '16px'
        }}
      />
      
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ 
          display: 'block', 
          marginBottom: '20px', 
          padding: '12px', 
          width: '100%', 
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '16px'
        }}
      />
      
      <button 
        onClick={handleSignup} 
        style={{ 
          padding: '12px 24px', 
          width: '100%',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        Sign Up
      </button>
      
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        Already have an account? <Link to="/login" style={{ color: '#007bff' }}>Login here</Link>
      </p>
    </div>
  );
};

export default Signup;
