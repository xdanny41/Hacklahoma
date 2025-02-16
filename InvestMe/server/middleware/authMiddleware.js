// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  // "Bearer <token>"
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }

  try {
    // Verify token against your JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Explicitly attach userId and username to req.user
    req.user = { userId: decoded.userId, username: decoded.username };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
