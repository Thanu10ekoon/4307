import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();  const handleLogin = async () => {
    try {
      const res = await axios.post('/auth/login', { email, password });
      alert(res.data.msg || 'Login successful');
      // Store user data with email as the identifier since backend uses email as primary key
      const userData = { email, username: email.split('@')[0] }; // temporary username
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/');
      window.location.reload(); // Force page refresh to update navbar state
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };
  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Login</h2>
      
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
        onClick={handleLogin} 
        style={{ 
          padding: '12px 24px', 
          width: '100%',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        Login
      </button>
      
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        Don't have an account? <Link to="/signup" style={{ color: '#007bff' }}>Sign up here</Link>
      </p>
    </div>
  );
};

export default Login;
