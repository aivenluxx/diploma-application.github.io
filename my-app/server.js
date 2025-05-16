const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('./src/models/User.js'); 

const app = express();
const port = 3005;

// === MongoDB ===
mongoose.connect('mongodb://localhost:27017/Speedster', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// === Middleware ===
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// === Nodemailer Transporter ===
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'noreplysp33dster@gmail.com',
    pass: 'kuuk jhpd lgcf lrcr', // Приложенческий пароль
  },
});

// === Register ===
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
        <p>Click below to confirm your email:</p>
        <a href="http://localhost:3005/confirm/${verificationToken}">Confirm Email</a>
      `,
    });

    res.status(201).json({ message: 'Registration successful. Please check your email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// === Confirm Email ===
app.get('/confirm/:token', async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });
    if (!user) return res.status(400).send('Invalid or expired token.');

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.send(`
      <html>
        <head>
          <meta http-equiv="refresh" content="5;url=http://localhost:3000/login" />
          <style>
            body { display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif; background: #f0f0f0; text-align: center; }
            .spinner { margin-top: 20px; border: 4px solid #ccc; border-top-color: #2e86de; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; }
            @keyframes spin { to { transform: rotate(360deg); } }
          </style>
        </head>
        <body>
          <div>
            <h2>Email confirmed successfully ✅</h2>
            <p>Redirecting to login...</p>
            <div class="spinner"></div>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error.');
  }
});

// === Login ===
app.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body;

    const user = await User.findOne({ $or: [{ email: login }, { phone: login }] });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.isVerified) return res.status(403).json({ message: 'Email not confirmed' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Incorrect password' });

    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// === Forgot Password ===
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: 'No user with that email.' });

  const token = crypto.randomBytes(32).toString('hex');
  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 1000 * 60 * 15;
  await user.save();

  const resetLink = `http://localhost:3000/reset-password/${token}`;

  try {
    await transporter.sendMail({
      from: '"Speedster" <noreplysp33dster@gmail.com>',
      to: user.email,
      subject: 'Reset your password',
      html: `
        <p>Hello ${user.name},</p>
        <p>Click the link to reset your password (valid for 15 minutes):</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    });

    res.status(200).json({ message: 'Password reset link sent to your email.' });
  } catch (err) {
    console.error('Reset email error:', err);
    res.status(500).json({ message: 'Failed to send reset email.' });
  }
});

// === Handle Password Reset (JSON API) ===
app.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: '❌ Invalid or expired token' });
    }

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: '✅ Password updated successfully. You can now login.' });
  } catch (err) {
    console.error('Reset error:', err);
    res.status(500).json({ message: 'Server error while resetting password.' });
  }
});

// === Start Server ===
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
