import React, { useState } from 'react';
import axios from 'axios';

function AuthTest() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      if (isLogin) {
        // LOGIN
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          username,
          password
        });
        // If successful, store token (or do whatever you need with it)
        const { token } = response.data;
        localStorage.setItem('token', token);

        setMessage('Logged in successfully!');
      } else {
        // REGISTER
        const response = await axios.post('http://localhost:5000/api/auth/register', {
          username,
          email,
          password
        });
        setMessage(response.data.message || 'Registration successful!');
      }
    } catch (error) {
      // Handle errors (e.g., 400, 500 from the server)
      if (error.response) {
        setMessage(error.response.data.error || 'Error occurred!');
      } else {
        setMessage('Network error or server not responding.');
      }
    }
  };

  return (
    <div style={{ width: '300px', margin: '50px auto', textAlign: 'center' }}>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        {/* USERNAME */}
        <div style={{ marginBottom: '10px' }}>
          <label>Username:</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        {/* EMAIL (Visible only in Register mode) */}
        {!isLogin && (
          <div style={{ marginBottom: '10px' }}>
            <label>Email:</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
        )}

        {/* PASSWORD */}
        <div style={{ marginBottom: '10px' }}>
          <label>Password:</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button type="submit">
          {isLogin ? 'Log In' : 'Register'}
        </button>
      </form>

      {/* TOGGLE LINK */}
      <p style={{ marginTop: '10px' }}>
        {isLogin ? 'Need an account?' : 'Already have an account?'}{' '}
        <span
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage('');
          }}
          style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
        >
          {isLogin ? 'Register' : 'Login'}
        </span>
      </p>

      {/* MESSAGE */}
      {message && <p style={{ marginTop: '10px', color: 'green' }}>{message}</p>}
    </div>
  );
}

export default AuthTest;
