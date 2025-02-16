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
    purchaseDate: '',
  });

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

  const fetchStockPrice = async (ticker) => {
    try {
      const response = await axios.get(`https://finnhub.io/api/v1/quote`, {
        params: {
          symbol: ticker,
          token: process.env.REACT_APP_FINNHUB_API_KEY,
        },
      });
      return response.data.c || 0; // Ensure a valid number
    } catch (error) {
      console.error('Error fetching stock price:', error);
      return 0;
    }
  };

  const handleAddPosition = async () => {
    try {
      const token = localStorage.getItem('token');
      const { tickerSymbol, shares, purchaseDate } = positionData;

      if (!tickerSymbol || !purchaseDate) {
        setError('Ticker symbol and purchase date are required.');
        return;
      }
      if (!shares) {
        setError('Please provide the number of shares.');
        return;
      }
      
      const stockPrice = await fetchStockPrice(tickerSymbol);
      if (!stockPrice) {
        setError('Could not fetch stock price. Try again later.');
        return;
      }
      
      const totalCost = stockPrice * parseFloat(shares);
      if (portfolio.balance < totalCost) {
        setError('Insufficient funds to purchase these shares.');
        return;
      }
      
      const res = await axios.put(
        'http://localhost:5000/api/portfolio/add-position',
        {
          tickerSymbol,
          shares: parseFloat(shares),
          purchaseDate,
          dollarAmount: totalCost,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPortfolio(res.data.portfolio);
      setPositionData({ tickerSymbol: '', shares: '', purchaseDate: '' });
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
                      {position.tickerSymbol}: {position.shares} shares - ${position.dollarAmount ? position.dollarAmount.toFixed(2) : 'N/A'} (Purchased: {new Date(position.purchaseDate).toLocaleDateString()})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No positions yet.</p>
              )}
              <div className="mb-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter amount to add"
                  value={balanceInput}
                  onChange={(e) => setBalanceInput(e.target.value)}
                />
              </div>
              <button className="btn btn-primary mb-4">Add Funds</button>
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
                      onChange={(e) => setPositionData({ ...positionData, tickerSymbol: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="number"
                      name="shares"
                      className="form-control"
                      placeholder="Number of Shares"
                      value={positionData.shares}
                      onChange={(e) => setPositionData({ ...positionData, shares: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="date"
                      name="purchaseDate"
                      className="form-control"
                      value={positionData.purchaseDate}
                      onChange={(e) => setPositionData({ ...positionData, purchaseDate: e.target.value })}
                    />
                  </div>
                  <button className="btn btn-success" onClick={handleAddPosition}>
                    Add Position
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p>No portfolio exists yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Portfolio;
