const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config();

const User = require('./src/models/User.js');

const app = express();
const port = process.env.PORT || 3005;

const JWT_SECRET = process.env.JWT_SECRET;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access token missing' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || !user.activeTokens?.includes(token)) {
      return res.status(403).json({ message: 'Invalid or revoked token' });
    }

    req.user = decoded;
    req.token = token;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 🚨 Telegram alert
app.post('/api/alert', async (req, res) => {
  const { speed } = req.body;
  if (!speed) return res.status(400).json({ error: 'Speed is required' });

  const message = `🚨 Speed limit exceeded! Speed: ${speed.toFixed(2)} kph`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message }),
    });

    if (!response.ok) throw new Error('Telegram API error');
    res.status(200).json({ message: 'Alert sent to Telegram' });
  } catch (err) {
    console.error('Telegram alert error:', err);
    res.status(500).json({ message: 'Failed to send alert to Telegram' });
  }
});

// 📝 Register
app.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = new User({
      name,
      email,
      phone,
      password,
      verificationToken,
    });

    await user.save();

    await transporter.sendMail({
      from: '"Speedster" <noreplysp33dster@gmail.com>',
      to: email,
      subject: 'Confirm your email',
      html: `
        <h3>Hello, ${name}!</h3>
        <p>Click the link to confirm your email:</p>
        <a href="http://localhost:3005/confirm/${verificationToken}">Confirm Email</a>
      `,
    });

    res.status(201).json({ message: 'Registration successful. Check your email.' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Registration error' });
  }
});

// ✅ Confirm email
app.get('/confirm/:token', async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });
    if (!user) return res.redirect('http://localhost:3006/invalid-token');

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.redirect('http://localhost:3006/email-confirmed');
  } catch (err) {
    console.error(err);
    res.redirect('http://localhost:3006/error');
  }
});

// 🔐 Login
app.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body;

    const user = await User.findOne({ $or: [{ email: login }, { phone: login }] });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.isVerified) return res.status(403).json({ message: 'Email not verified' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Incorrect password' });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '2h' });

    user.activeTokens = user.activeTokens || [];
    user.activeTokens.push(token);
    await user.save();

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login error' });
  }
});

// 🚪 Logout
app.post('/logout', authenticateToken, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { activeTokens: req.token },
    });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Logout failed' });
  }
});

// 👤 Get profile
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// 🔄 Forgot password
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'No user with that email' });

  const token = crypto.randomBytes(32).toString('hex');
  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
  await user.save();

  const resetLink = `http://localhost:3005/reset-password/${token}`;

  try {
    await transporter.sendMail({
      from: '"Speedster" <noreplysp33dster@gmail.com>',
      to: user.email,
      subject: 'Reset your password',
      html: `<p>Hello ${user.name},</p><p>Reset link (valid 15 min): <a href="${resetLink}">${resetLink}</a></p>`,
    });

    res.status(200).json({ message: 'Reset link sent' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ message: 'Failed to send reset email' });
  }
});

// ✅ Redirect to frontend reset page
app.get('/reset-password/:token', (req, res) => {
  const { token } = req.params;
  res.redirect(`http://localhost:3006/reset-password/${token}`);
});

// ✅ Reset password logic
app.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Reset error:', err);
    res.status(500).json({ message: 'Error resetting password' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
