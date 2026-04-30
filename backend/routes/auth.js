const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator'); // FIX: [Server-side Input Validation]
const rateLimit = require('express-rate-limit'); // FIX: [Rate Limiting]
const User = require('../models/User');

const router = express.Router();

// FIX: [JWT Secret Fallback]
const JWT_SECRET = process.env.JWT_SECRET;

// FIX: [Rate Limiting] 10 requests per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Password Validation Helper (Frontend parity)
function validatePassword(password) {
  const rules = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[@#$%&!]/.test(password),
    noSpaces: !/\s/.test(password)
  };
  const allRulesMet = Object.values(rules).every(rule => rule === true);
  return { isValid: allRulesMet, rules };
}

// FIX: [Server-side Input Validation]
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
];

router.post('/register', authLimiter, registerValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password } = req.body;

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        success: false,
        message: 'Password does not meet security requirements',
        passwordRules: passwordValidation.rules
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    // FIX: [Token Storage] Set httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    next(error); // FIX: [Global Error Handler]
  }
});

router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    // FIX: [Token Storage] Set httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      success: true,
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    next(error); // FIX: [Global Error Handler]
  }
});

// FIX: [Token Storage] Logout route to clear cookie
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;