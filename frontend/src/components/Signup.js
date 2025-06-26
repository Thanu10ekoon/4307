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
    <div className="container" style={{ maxWidth: '400px', margin: '40px auto' }}>
      <div className="card">
        <h2 className="text-center mb-3" style={{ color: '#28a745' }}>Create Account</h2>
        
        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="form-input"
        />
        
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
          onClick={handleSignup} 
          className="btn btn-success btn-full mb-2"
        >
          Sign Up
        </button>
        
        <p className="text-center">
          Already have an account? <Link to="/login" style={{ color: '#007bff' }}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
