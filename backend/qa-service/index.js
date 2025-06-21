const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const mockQa = {
  1: [
    { id: 1, question: 'What is your primary service area?', answer: 'We primarily serve the Bangalore metropolitan area.', author: 'User X', timestamp: '2024-05-18T10:00:00Z' },
    { id: 2, question: 'Do you offer international shipping?', answer: 'Yes, we provide international shipping to select countries.', author: 'User Y', timestamp: '2024-05-22T15:30:00Z' },
  ],
  2: [
    { id: 3, question: 'What are your production lead times?', answer: 'Our standard lead time is 4-6 weeks depending on order size.', author: 'User Z', timestamp: '2024-04-15T11:00:00Z' },
  ],
};

app.get('/api/qa/:vendorId', (req, res) => {
  const vendorId = parseInt(req.params.vendorId);
  res.json(mockQa[vendorId] || []);
});

app.post('/api/qa/:vendorId', (req, res) => {
  const vendorId = parseInt(req.params.vendorId);
  const { text } = req.body;
  if (!mockQa[vendorId]) {
    mockQa[vendorId] = [];
  }
  const newQuestion = { id: Date.now(), question: text, answer: 'Pending', author: 'Anonymous', timestamp: new Date().toISOString() };
  mockQa[vendorId].push(newQuestion);
  console.log(`New question for vendor ${vendorId}: ${text}`);
  res.status(201).json(newQuestion);
});

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => console.log(`QA service running on port ${PORT}`)); 