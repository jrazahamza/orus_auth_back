const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middlewares/authMiddleware');
const transporter = require('../routes/nodemailer'); // Import the transporter

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Generate email verification token
const generateVerificationToken = () => {
  return Math.random().toString(36).substring(2, 15);
};

// Register User and Send Verification Email
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const verificationToken = generateVerificationToken();

    const user = await User.create({
      name,
      email,
      password,
      isVerified: false, // Add `isVerified` to the user model if not already present
      verificationToken, // Save the token in the database
    });

    // Send verification email
    const verificationUrl = `${process.env.BASE_URL}/api/auth/verify-email?token=${verificationToken}&email=${email}`;
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Email Verification',
      html: `
        <h1>Email Verification</h1>
        <p>Please click the link below to verify your email:</p>
        <a href="${verificationUrl}" target="_blank">Verify Email</a>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: 'Registration successful! Please verify your email.',
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify Email Endpoint
router.get('/verify-email', async (req, res) => {
  const { token, email } = req.query;

  try {
    const user = await User.findOne({ email, verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.isVerified = true;
    user.verificationToken = null; // Clear the token after verification
    await user.save();

    res.json({ message: 'Email verified successfully!' });
  } catch (error) {
    console.error('Error during email verification:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login User
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (!user.isVerified) {
        return res.status(401).json({ message: 'Please verify your email before logging in.' });
      }

      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Profile Route
router.get('/profile', protect, (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  });
});

module.exports = router;
