const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();

app.use(cors());
app.use(express.json());

// Mock database for users (in a real app, this would be a persistent database)
const users = [];

// JWT Secret Key (use a strong, environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

// Register User
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  // Check if user already exists
  if (users.find(user => user.email === email)) {
    return res.status(409).json({ message: 'User with this email already exists.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now(), email, password: hashedPassword };
    users.push(newUser);
    console.log(`User registered: ${email}`);
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// Login User
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  try {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    console.log(`User logged in: ${email}`);
    res.status(200).json({ message: 'Logged in successfully.', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user payload to request
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(403).json({ message: 'Access Denied: Invalid token.' });
  }
};

// Protected Route Example
app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ message: `Welcome, ${req.user.email}! This is a protected route.`, user: req.user });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Auth service running on port ${PORT}`)); 