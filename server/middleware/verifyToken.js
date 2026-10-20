const { firebaseConfigured, getFirebaseAuth } = require('../config/firebaseAdmin');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ── Firebase token middleware ──────────────────────────────────────────────
const verifyFirebaseToken = async (req, res, next) => {
  if (!firebaseConfigured) {
    return res.status(503).json({ message: 'Firebase auth not configured on server' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await getFirebaseAuth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token', error: error.message });
  }
};

// ── JWT middleware ─────────────────────────────────────────────────────────
const verifyJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// ── Combined: accepts either JWT or Firebase token ─────────────────────────
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  // Try JWT first (issued by our server — shorter, faster)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    return next();
  } catch (_) {
    // Not a valid JWT — try Firebase
  }

  // Try Firebase token (only if Firebase is configured)
  if (firebaseConfigured) {
    try {
      const decodedToken = await getFirebaseAuth().verifyIdToken(token);
      const user = await User.findOne({ firebaseUID: decodedToken.uid });
      if (!user) return res.status(401).json({ message: 'User not found in database' });
      req.userId = user._id;
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token', error: error.message });
    }
  }

  return res.status(401).json({ message: 'Invalid or expired token' });
};

module.exports = { verifyToken, verifyFirebaseToken, verifyJWT };
