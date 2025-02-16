import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../Styling/Logo.png';


function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // User is considered logged in if a token exists

  const handleLogout = () => {
    // Clear stored user authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    // Redirect to the landing page
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand" to="/">
          <img
            src={Logo}
            alt="Brand Logo"
            style={{ height: '55px', marginLeft:'-75px' }}
          />
        </Link>
        <h1 style={{fontSize:'20px', marginTop:'10px', marginLeft:'-25px'}}>InvestMe</h1>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {/* Navigation Links */}
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Trading Tips
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Support
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/charts">
                Charts
              </Link>
            </li>
            {/* Conditional rendering for Login/Logout */}
            {token ? (
              <li className="nav-item">
        
                <button className="btn btn-link nav-link" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/registration">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
