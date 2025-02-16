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
  const [currentPrice, setCurrentPrice] = useState(null); // New state for current stock price

  useEffect(() => {
    fetchPortfolio();
  }, []);

  // Fetch the user's portfolio from the back end
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

  // Fetch the current stock price from Finnhub
  const fetchStockPrice = async (ticker) => {
    try {
      const response = await axios.get(`https://finnhub.io/api/v1/quote`, {
        params: {
          symbol: ticker,
          token: process.env.REACT_APP_FINNHUB_API_KEY,
        },
      });
      return response.data.c || 0; // Use the current price or 0 if not available
    } catch (error) {
      console.error('Error fetching stock price:', error);
      return 0;
    }
  };

  // Update current price whenever the tickerSymbol changes (if not empty)
  useEffect(() => {
    async function updatePrice() {
      if (positionData.tickerSymbol.trim() !== '') {
        const price = await fetchStockPrice(positionData.tickerSymbol);
        setCurrentPrice(price);
      } else {
        setCurrentPrice(null);
      }
    }
    updatePrice();
  }, [positionData.tickerSymbol]);

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
      setCurrentPrice(null);
      setError('');
    } catch (err) {
      console.error('Error adding position:', err);
      setError('Error adding position.');
    }
  };

  // New function to sell a position
  const handleSellPosition = async (positionIndex) => {
    try {
      const token = localStorage.getItem('token');
      const position = portfolio.positions[positionIndex];
      if (!position) return;
      
      const currentPrice = await fetchStockPrice(position.tickerSymbol);
      if (!currentPrice) {
        setError('Could not fetch stock price. Try again later.');
        return;
      }
      
      const saleProceeds = currentPrice * position.shares;
      
      const res = await axios.put(
        'http://localhost:5000/api/portfolio/sell-position',
        {
          tickerSymbol: position.tickerSymbol,
          shares: position.shares,
          saleAmount: saleProceeds,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setPortfolio(res.data.portfolio);
      setError('');
    } catch (err) {
      console.error('Error selling position:', err);
      setError('Error selling position.');
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
                    <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        {position.tickerSymbol}: {position.shares} shares - $
                        {position.dollarAmount ? position.dollarAmount.toFixed(2) : 'N/A'} (Purchased: {new Date(position.purchaseDate).toLocaleDateString()})
                      </div>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleSellPosition(idx)}
                      >
                        Sell
                      </button>
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
                    {/* Display current price if available */}
                    {currentPrice !== null && (
                      <small className="text-muted">
                        Current Price: ${currentPrice.toFixed(2)}
                      </small>
                    )}
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
                    {/* Optionally, display the total cost if both price and shares are provided */}
                    {currentPrice !== null && positionData.shares && (
                      <small className="text-muted">
                        Total Cost: ${(currentPrice * parseFloat(positionData.shares)).toFixed(2)}
                      </small>
                    )}
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
