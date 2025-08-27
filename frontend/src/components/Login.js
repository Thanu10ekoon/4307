import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();  const handleLogin = async () => {
    try {
      const res = await axios.post('/auth/login', { email, password });
      // alert(res.data.msg || 'Login successful');
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
    <div className="container" style={{ maxWidth: '400px', margin: '20px auto', padding: '15px' }}>
      <div className="card" style={{ borderRadius: '12px', padding: '25px' }}>
        <h2 className="text-center mb-3" style={{ color: '#007bff', fontSize: '1.75rem', fontWeight: '700' }}>
          🔐 Login
        </h2>
        <p className="text-center" style={{ color: '#666', marginBottom: '25px', fontSize: '14px' }}>
          Sign in to manage your events
        </p>
        
        <input
          type="email"
          placeholder="📧 Email Address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="form-input"
          style={{ fontSize: '16px', padding: '16px' }}
        />
        
        <input
          type="password"
          placeholder="🔒 Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="form-input"
          style={{ fontSize: '16px', padding: '16px' }}
        />
        
        <button 
          onClick={handleLogin} 
          className="btn btn-primary btn-full mb-2"
          style={{ 
            padding: '16px',
            fontSize: '16px',
            fontWeight: '600',
            borderRadius: '8px'
          }}
        >
          Login
        </button>
        
        <p className="text-center" style={{ fontSize: '14px' }}>
          New here? <Link to="/signup" style={{ color: '#007bff', fontWeight: '600' }}>Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
