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
    <div className="container" style={{ maxWidth: '400px', margin: '20px auto', padding: '15px' }}>
      <div className="card" style={{ borderRadius: '12px', padding: '25px' }}>
        <h2 className="text-center mb-3" style={{ color: '#28a745', fontSize: '1.75rem', fontWeight: '700' }}>
          📝 Sign Up
        </h2>
        <p className="text-center" style={{ color: '#666', marginBottom: '25px', fontSize: '14px' }}>
          Create your account to start organizing events
        </p>
        
        <input
          placeholder="👤 Full Name"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="form-input"
          style={{ fontSize: '16px', padding: '16px' }}
        />
        
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
          placeholder="🔒 Create Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="form-input"
          style={{ fontSize: '16px', padding: '16px' }}
        />
        
        <button 
          onClick={handleSignup} 
          className="btn btn-success btn-full mb-2"
          style={{ 
            padding: '16px',
            fontSize: '16px',
            fontWeight: '600',
            borderRadius: '8px'
          }}
        >
          🎉 Create Account
        </button>
        
        <p className="text-center" style={{ fontSize: '14px' }}>
          Already have an account? <Link to="/login" style={{ color: '#007bff', fontWeight: '600' }}>Sign in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
