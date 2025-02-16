import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import mockData from './mockData.json'; // Adjust the path as needed
//import './CompanyPage.css'; // Optional for custom styles

// Define the stock symbols and their names
const STOCK_NAMES = {
  AAPL: "Apple",
  MSFT: "Microsoft",
  NVDA: "NVIDIA",
  AMZN: "Amazon",
  TSLA: "Tesla",
  META: "Meta Platforms",
  GOOGL: "Alphabet"
};

const MAGNIFICENT_7 = Object.keys(STOCK_NAMES);

// Updated CompanyChart component that uses mock data
const CompanyChart = ({ symbol }) => {
  // Transform the mock data into the series format for ApexCharts
  const series = [
    {
      data: mockData.t.map((timestamp, index) => ({
        x: new Date(timestamp * 1000), // Convert Unix timestamp (seconds) to Date
        y: [
          mockData.o[index],
          mockData.h[index],
          mockData.l[index],
          mockData.c[index]
        ]
      }))
    }
  ];

  const options = {
    chart: { type: 'candlestick', height: 350 },
    title: { text: `Candlestick Chart for ${symbol}`, align: 'left' },
    xaxis: { type: 'datetime' },
    yaxis: {
      tooltip: {
        enabled: true
      }
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">Stock Performance: {STOCK_NAMES[symbol]} ({symbol})</h5>
        <Chart options={options} series={series} type="candlestick" height={350} />
      </div>
    </div>
  );
};

// Component to display company information
const CompanyInfo = ({ symbol, name, price, change }) => {
  return (
    <div className="card">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <h5 className="card-title">{name} ({symbol})</h5>
          <p className="card-text">
            <strong>Price:</strong> ${price ? price.toFixed(2) : 'Loading...'} <br />
            <strong>Change:</strong> <span style={{ color: change >= 0 ? 'green' : 'red' }}>
              {price ? (change >= 0 ? `+${change.toFixed(2)}` : change.toFixed(2)) : 'Loading...'}
            </span>
          </p>
          <p className="card-text">
            <a href={`https://finance.yahoo.com/quote/${symbol}`}>Additional Statistics</a>
          </p>
        </div>
        <div>
          <button className="btn btn-success me-2">Buy</button>
          <button className="btn btn-danger">Sell</button>
        </div>
      </div>
    </div>
  );
};

const CompanyPage = () => {
  const [stockData, setStockData] = useState({});
  const API_KEY = process.env.REACT_APP_FINNHUB_API_KEY;

  // Fetch stock prices using the provided API function
  const fetchStockPrices = useCallback(async () => {
    try {
      const responses = await Promise.all(
        MAGNIFICENT_7.map(symbol =>
          axios.get(`https://finnhub.io/api/v1/quote`, {
            params: {
              symbol: symbol,
              token: API_KEY,
            },
          })
        )
      );

      const prices = {};
      responses.forEach((response, index) => {
        prices[MAGNIFICENT_7[index]] = response.data;
      });

      setStockData(prices);
    } catch (error) {
      console.error("Error fetching stock prices:", error);
    }
  }, [API_KEY]);

  // Fetch data on component mount and set up a refresh interval
  useEffect(() => {
    fetchStockPrices();
    const interval = setInterval(fetchStockPrices, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [fetchStockPrices]);

  // Example: Display data for the first stock (AAPL) or any selected stock
  const selectedSymbol = 'AAPL'; // You can make this dynamic
  const stock = stockData[selectedSymbol];

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', minWidth:'1800px' }}>
      <div className="row w-100">
        <div className="col-md-8 col-lg-6 mx-auto">
          {stock ? (
            <>
              {/* Render the candlestick chart using mock data */}
              <CompanyChart symbol={selectedSymbol} />
              <CompanyInfo
                symbol={selectedSymbol}
                name={STOCK_NAMES[selectedSymbol]}
                price={stock.c}
                change={stock.d}
              />
            </>
          ) : (
            <p>Loading stock data...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;
