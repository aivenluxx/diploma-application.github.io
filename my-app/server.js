
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const User = require('./src/models/User.js');

const app = express();
const port = 3005;


mongoose.connect('mongodb://localhost:27017/Speedster', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ Error of connection:', err));

app.use(cors());
app.use(express.json());

app.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this e-mail already exists. Please authorize!' });
    }

    const user = new User({ name, email, phone, password });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error of the server.' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server is launched at http://localhost:${port}`);
});
