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
    <div className="container" style={{ maxWidth: '400px', margin: '40px auto' }}>
      <div className="card">
        <h2 className="text-center mb-3" style={{ color: '#007bff' }}>Login</h2>
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="form-input"
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="form-input"
        />
        
        <button 
          onClick={handleLogin} 
          className="btn btn-primary btn-full mb-2"
        >
          Login
        </button>
        
        <p className="text-center">
          Don't have an account? <Link to="/signup" style={{ color: '#007bff' }}>Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
