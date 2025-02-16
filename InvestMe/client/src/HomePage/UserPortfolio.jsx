import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Portfolio() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [balanceInput, setBalanceInput] = useState('');
  const [positionData, setPositionData] = useState({
    tickerSymbol: '',
    shares: '',
    dollarAmount: '',
    purchaseDate: '',
  });

  // Fetch portfolio data on mount.
  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/portfolio', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPortfolio(res.data);
    } catch (err) {
      console.error('Error fetching portfolio:', err);
      setPortfolio(null);
    } finally {
      setLoading(false);
    }
  };

  // Create or add funds to the portfolio.
  const handleAddFunds = async () => {
    try {
      const token = localStorage.getItem('token');
      const additionalFunds = parseFloat(balanceInput) || 0;
      const res = await axios.put(
        'http://localhost:5000/api/portfolio/add-funds',
        { amount: additionalFunds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPortfolio(res.data.portfolio);
    } catch (err) {
      console.error('Error adding funds:', err);
      setError('Error adding funds.');
    }
  };

  // Handle input changes for position form.
  const handlePositionInputChange = (e) => {
    setPositionData({ ...positionData, [e.target.name]: e.target.value });
  };

  // Add a new position.
  const handleAddPosition = async () => {
    try {
      const token = localStorage.getItem('token');
      const { tickerSymbol, shares, dollarAmount, purchaseDate } = positionData;
      if (!tickerSymbol || !purchaseDate) {
        setError('Ticker symbol and purchase date are required.');
        return;
      }
      if (!shares && !dollarAmount) {
        setError('Please provide either the number of shares or a dollar amount.');
        return;
      }
      const res = await axios.put(
        'http://localhost:5000/api/portfolio/add-position',
        {
          tickerSymbol,
          // Send shares only if provided.
          ...(shares && { shares: parseFloat(shares) }),
          // Send dollarAmount only if provided.
          ...(dollarAmount && { dollarAmount: parseFloat(dollarAmount) }),
          purchaseDate, // expects an ISO date string
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPortfolio(res.data.portfolio);
      // Clear the form.
      setPositionData({
        tickerSymbol: '',
        shares: '',
        dollarAmount: '',
        purchaseDate: '',
      });
    } catch (err) {
      console.error('Error adding position:', err);
      setError('Error adding position.');
    }
  };

  if (loading) return <div>Loading portfolio...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container py-4">
      <div className="card mb-4">
        <div className="card-header">
          <h4>Your Portfolio</h4>
        </div>
        <div className="card-body">
          {portfolio ? (
            <>
              <h5 className="card-title">Balance: ${portfolio.balance.toFixed(2)}</h5>
              <p className="card-text">Your positions:</p>
              {portfolio.positions && portfolio.positions.length > 0 ? (
                <ul className="list-group mb-3">
                  {portfolio.positions.map((position, idx) => (
                    <li key={idx} className="list-group-item">
                      {position.tickerSymbol}:{" "}
                      {position.dollarAmount !== undefined
                        ? `$${position.dollarAmount.toFixed(2)}`
                        : 'N/A'}
                      {position.shares !== undefined && (
                        <> ({position.shares} shares)</>
                      )}{" "}
                      invested (Purchased: {new Date(position.purchaseDate).toLocaleDateString()})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No positions yet.</p>
              )}
              {/* Add Funds Section */}
              <div className="mb-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter amount to add"
                  value={balanceInput}
                  onChange={(e) => setBalanceInput(e.target.value)}
                />
              </div>
              <button className="btn btn-primary mb-4" onClick={handleAddFunds}>
                Add Funds
              </button>
              {/* Add Position Section */}
              <div className="card">
                <div className="card-header">
                  <h5>Add New Position</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <input
                      type="text"
                      name="tickerSymbol"
                      className="form-control"
                      placeholder="Ticker Symbol (e.g. AAPL)"
                      value={positionData.tickerSymbol}
                      onChange={handlePositionInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="number"
                      name="shares"
                      className="form-control"
                      placeholder="Number of Shares (optional)"
                      value={positionData.shares}
                      onChange={handlePositionInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="number"
                      name="dollarAmount"
                      className="form-control"
                      placeholder="Dollar Amount to Invest (optional)"
                      value={positionData.dollarAmount}
                      onChange={handlePositionInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="date"
                      name="purchaseDate"
                      className="form-control"
                      value={positionData.purchaseDate}
                      onChange={handlePositionInputChange}
                    />
                  </div>
                  <button className="btn btn-success" onClick={handleAddPosition}>
                    Add Position
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <p>No portfolio exists yet.</p>
              <div className="mb-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter initial balance"
                  value={balanceInput}
                  onChange={(e) => setBalanceInput(e.target.value)}
                />
              </div>
              <button className="btn btn-success" onClick={handleAddFunds}>
                Create Portfolio &amp; Add Funds
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Portfolio;
