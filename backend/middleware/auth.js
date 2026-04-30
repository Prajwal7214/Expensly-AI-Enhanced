// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

// FIX: [JWT Secret Fallback] Remove hardcoded fallback
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('❌ FATAL ERROR: JWT_SECRET is not defined.');
  process.exit(1);
}

const authMiddleware = (req, res, next) => {
  try {
    // FIX: [Token Storage] Get token from cookies instead of headers
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Authorization denied. No token provided.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = authMiddleware;