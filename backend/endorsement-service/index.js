const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const mockEndorsements = {
  1: [
    { id: 1, text: 'Reliable and efficient service!', author: 'Business A', timestamp: '2024-05-20T09:00:00Z' },
    { id: 2, text: 'Great partner for IT solutions.', author: 'Business B', timestamp: '2024-06-01T14:00:00Z' },
  ],
  2: [
    { id: 3, text: 'Delivers quality products on time.', author: 'Business C', timestamp: '2024-04-10T10:30:00Z' },
  ],
};

app.get('/api/endorsements/:vendorId', (req, res) => {
  const vendorId = parseInt(req.params.vendorId);
  res.json(mockEndorsements[vendorId] || []);
});

app.post('/api/endorsements/:vendorId', (req, res) => {
  const vendorId = parseInt(req.params.vendorId);
  const { text } = req.body;
  if (!mockEndorsements[vendorId]) {
    mockEndorsements[vendorId] = [];
  }
  const newEndorsement = { id: Date.now(), text, author: 'Anonymous', timestamp: new Date().toISOString() };
  mockEndorsements[vendorId].push(newEndorsement);
  console.log(`New endorsement for vendor ${vendorId}: ${text}`);
  res.status(201).json(newEndorsement);
});

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => console.log(`Endorsement service running on port ${PORT}`)); 