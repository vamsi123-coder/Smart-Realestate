const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { firebaseConfigured, getFirebaseAuth } = require('../config/firebaseAdmin');

// Generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ─── Email/Password Register ───────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields are required' });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User with this email already exists' });

    const user = await User.create({ name, email, password, authProvider: 'email' });
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Email/Password Login ──────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user || user.authProvider !== 'email')
      return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Google OAuth (Firebase) ───────────────────────────────────────────────
const googleAuth = async (req, res) => {
  try {
    if (!firebaseConfigured) {
      return res.status(503).json({ message: 'Google auth is not configured on this server. Please use email/password sign-up.' });
    }

    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ message: 'ID token required' });

    // Verify Firebase token using modular Admin SDK v14
    const decodedToken = await getFirebaseAuth().verifyIdToken(idToken);
    const { uid, name, email, picture } = decodedToken;

    // Find or create user in MongoDB
    let user = await User.findOne({ firebaseUID: uid });
    if (!user) {
      // Check if email exists (edge case: same email, different provider)
      user = await User.findOne({ email });
      if (user) {
        user.firebaseUID = uid;
        user.authProvider = 'google';
        if (picture && !user.profilePhoto) user.profilePhoto = picture;
        await user.save();
      } else {
        user = await User.create({
          firebaseUID: uid,
          name: name || 'Google User',
          email,
          profilePhoto: picture || '',
          authProvider: 'google',
        });
      }
    }

    // Issue our own JWT so frontend uses one token type
    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, googleAuth };
