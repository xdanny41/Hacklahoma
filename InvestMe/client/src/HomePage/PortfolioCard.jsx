import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function PortfolioCard() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Assume the username is stored in localStorage (adjust if you use a different auth method)
  const username = localStorage.getItem('username') || 'User';

  useEffect(() => {
    async function fetchPortfolio() {
      const token = localStorage.getItem('token');
      if (!token) {
        // If there's no token, then the user is not logged in
        setError('Please Log In');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/portfolio', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // If the API returns data, use it. Otherwise, default to a $0 balance.
        if (response.data) {
          setPortfolio(response.data);
        } else {
          setPortfolio({ balance: 0 });
        }
      } catch (err) {
        console.error('Error fetching portfolio:', err);
        // If an error occurs but the user is logged in, default to a $0 portfolio.
        setPortfolio({ balance: 0 });
      } finally {
        setLoading(false);
      }
    }
    fetchPortfolio();
  }, []);

  if (loading)
    return <div className="text-center mt-5">Loading portfolio...</div>;
  if (error)
    return (
      <div className="alert alert-danger mt-5 text-center">{error}</div>
    );
  if (!portfolio)
    return (
      <div className="text-center mt-5">No portfolio data available.</div>
    );

  return (
    <div className="container mt-5">
      <div className="card shadow-sm mx-auto" style={{ maxWidth: '350px' }}>
        <div className="card-header bg-primary text-white text-center">
          <h5 className="mb-0">Portfolio</h5>
        </div>
        <div className="card-body text-center">
          <h6 className="card-title">{username}</h6>
          <p className="card-text">
            Balance: <strong>${portfolio.balance.toFixed(2)}</strong>
          </p>
          <Link to="/user-portfolio" className="btn btn-outline-primary btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PortfolioCard;
