const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('./src/models/User.js');

const app = express();
const port = 3005;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/Speedster', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'noreplysp33dster@gmail.com',
    pass: 'kuuk jhpd lgcf lrcr', // Use an app password
  },
});

// Registration
app.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists. Please login.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      isVerified: false,
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
        <a href="http://localhost:3005/confirm/${verificationToken}">
          Confirm Email
        </a>
      `,
    });

    res.status(201).json({ message: 'Registration successful. Please check your email.' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Email confirmation
app.get('/confirm/:token', async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });

    if (!user) {
      return res.status(400).send('Invalid or expired token.');
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="refresh" content="5;url=http://localhost:3000/login" />
          <title>Email Confirmed</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              font-family: 'Segoe UI', sans-serif;
              background-color: #f4f8fc;
              color: #333;
              text-align: center;
            }
            h2 {
              color: #2e86de;
            }
            .spinner {
              margin-top: 20px;
              width: 40px;
              height: 40px;
              border: 4px solid #ccc;
              border-top-color: #2e86de;
              border-radius: 50%;
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          </style>
        </head>
        <body>
          <h2>✅ Email confirmed successfully!</h2>
          <p>You will be redirected to the login page in 5 seconds...</p>
          <div class="spinner"></div>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('Confirmation error:', err);
    res.status(500).send('Server error.');
  }
});

// Login
app.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: login }, { phone: login }]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please confirm your email first.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password.' });
    }

    res.status(200).json({ message: 'Login successful.' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
