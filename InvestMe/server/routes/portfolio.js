// server/routes/portfolio.js
const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const authMiddleware = require('../middleware/authMiddleware');

/* 
   Add funds to the portfolio.
   If no portfolio exists, create one with the given amount.
   Endpoint: PUT /api/portfolio/add-funds
*/
router.put('/add-funds', authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: 'A valid amount is required.' });
    }

    let portfolio = await Portfolio.findOne({ userId: req.user.userId });
    const parsedAmount = parseFloat(amount);

    if (!portfolio) {
      // Create a new portfolio.
      portfolio = new Portfolio({
        userId: req.user.userId,
        balance: parsedAmount,
        positions: [],
      });
    } else {
      // Add funds.
      portfolio.balance += parsedAmount;
    }
    await portfolio.save();
    res.status(200).json({ portfolio });
  } catch (error) {
    console.error('Error adding funds:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/* 
   Add a new position to the portfolio.
   Expects in the request body:
     - tickerSymbol (String)
     - purchaseDate (Date string)
     - And optionally:
         - shares (Number)
         - dollarAmount (Number)
     
   At least one of shares or dollarAmount must be provided.
   For cost deduction, if dollarAmount is provided, it is used;
   otherwise, if only shares is provided, we simulate cost as shares * 1 (dummy logic).
   Endpoint: PUT /api/portfolio/add-position
*/
router.put('/add-position', authMiddleware, async (req, res) => {
  try {
    const { tickerSymbol, shares, dollarAmount, purchaseDate } = req.body;
    if (!tickerSymbol || !purchaseDate) {
      return res.status(400).json({ error: 'Ticker symbol and purchase date are required.' });
    }
    const hasShares = shares !== undefined && shares !== null;
    const hasDollarAmount = dollarAmount !== undefined && dollarAmount !== null;
    if (!hasShares && !hasDollarAmount) {
      return res.status(400).json({ error: 'Either shares or dollarAmount must be provided.' });
    }

    // Determine the total cost.
    let totalCost;
    if (hasDollarAmount) {
      totalCost = parseFloat(dollarAmount);
      if (isNaN(totalCost) || totalCost <= 0) {
        return res.status(400).json({ error: 'A valid dollar amount is required.' });
      }
    } else if (hasShares) {
      // Dummy logic: use shares * 1 as the cost.
      totalCost = parseFloat(shares);
      if (isNaN(totalCost) || totalCost <= 0) {
        return res.status(400).json({ error: 'A valid number of shares is required.' });
      }
    }

    let portfolio = await Portfolio.findOne({ userId: req.user.userId });
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found. Please add funds first to create a portfolio.' });
    }
    if (portfolio.balance < totalCost) {
      return res.status(400).json({ error: 'Insufficient balance to add this position.' });
    }

    // Add the new position.
    portfolio.positions.push({
      tickerSymbol: tickerSymbol.toUpperCase(),
      shares: hasShares ? parseFloat(shares) : undefined,
      dollarAmount: hasDollarAmount ? parseFloat(dollarAmount) : undefined,
      purchaseDate: new Date(purchaseDate),
    });
    // Deduct the cost.
    portfolio.balance -= totalCost;
    await portfolio.save();
    res.status(200).json({ portfolio });
  } catch (error) {
    console.error('Error adding position:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/*
   Sell a position from the portfolio.
   Expects in the request body:
     - tickerSymbol (String)
     - shares (Number)  // number of shares to sell (assumed to be the entire position for simplicity)
     - saleAmount (Number) // total sale proceeds (e.g., current price * shares)
     
   This endpoint removes the sold position and adds the sale proceeds to the portfolio balance.
   Endpoint: PUT /api/portfolio/sell-position
*/
router.put('/sell-position', authMiddleware, async (req, res) => {
  try {
    const { tickerSymbol, shares, saleAmount } = req.body;
    if (!tickerSymbol || !shares || !saleAmount) {
      return res.status(400).json({ error: 'tickerSymbol, shares, and saleAmount are required.' });
    }
    
    let portfolio = await Portfolio.findOne({ userId: req.user.userId });
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found.' });
    }
    
    // Find the position index by matching ticker and shares.
    // (For simplicity, we assume an exact match. For partial sales, adjust accordingly.)
    const posIndex = portfolio.positions.findIndex(pos => 
      pos.tickerSymbol === tickerSymbol.toUpperCase() &&
      Number(pos.shares) === Number(shares)
    );
    
    if (posIndex === -1) {
      return res.status(404).json({ error: 'Position not found for sale.' });
    }
    
    // Remove the position from the portfolio.
    portfolio.positions.splice(posIndex, 1);
    // Add the sale proceeds to the portfolio balance.
    portfolio.balance += parseFloat(saleAmount);
    
    await portfolio.save();
    res.status(200).json({ portfolio });
  } catch (error) {
    console.error('Error selling position:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/*
   (Optional) Get the current portfolio.
   Endpoint: GET /api/portfolio
*/
router.get('/', authMiddleware, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.user.userId });
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    res.status(200).json(portfolio);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
