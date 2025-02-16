import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// Import the Lottie player component
import { Player } from '@lottiefiles/react-lottie-player';
import animationData from '../Styling/Lottie1.json';


function RegistrationPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // If the user is already logged in, redirect to the landing page.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      if (isLogin) {
        // LOGIN
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          username,
          password,
        });
        const { token } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        setMessage('Logged in successfully!');
        // Redirect to the landing page after successful login
        navigate('/');
      } else {
        // REGISTER
        const response = await axios.post('http://localhost:5000/api/auth/register', {
          username,
          email,
          password,
        });
        setMessage(response.data.message || 'Registration successful! Please log in.');
        // Switch to login mode after registration
        setIsLogin(true);
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.error || 'Error occurred!');
      } else {
        setMessage('Network error or server not responding.');
      }
    }
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
      {/* Lottie Animation Section */}
      <div className="mb-4" style={{ maxWidth: '300px', color:'white'}}>
        <h1 style={{fontFamily:'Lora'}}>INVEST ME</h1>
      </div>

      <div className="mb-4" style={{ maxWidth: '300px' }}>
        <Player
          autoplay
          loop
          src={animationData} // Ensure this path points to your Lottie JSON file in the public folder.
          style={{ height: '200px', width: '200px' }}
        />
      </div>

      <div className="card shadow" style={{ width: '400px' }}>
        <div className="card-body">
          <h3 className="card-title text-center mb-4">{isLogin ? 'Login' : 'Register'}</h3>
          <form onSubmit={handleSubmit}>
            {/* Username Input */}
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Email Input (only for Registration) */}
            {!isLogin && (
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}

            {/* Password Input */}
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-100">
              {isLogin ? 'Log In' : 'Register'}
            </button>
          </form>

          {/* Toggle Login/Register Link */}
          <p className="text-center mt-3">
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

          {/* Message Display */}
          {message && (
            <div className="alert alert-info mt-3" role="alert">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;
