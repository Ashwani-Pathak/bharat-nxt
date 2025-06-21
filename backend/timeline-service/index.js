const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const mockTimeline = [
  { id: 1, title: 'Vendor Onboarded', description: 'Initial registration completed', timestamp: '2024-01-15T10:00:00Z', type: 'info' },
  { id: 2, title: 'GSTIN Verified', description: 'GSTIN successfully validated against public records', timestamp: '2024-01-16T11:30:00Z', type: 'verified' },
  { id: 3, title: 'PAN Uploaded', description: 'PAN document received and awaiting verification', timestamp: '2024-01-17T09:15:00Z', type: 'pending' },
  { id: 4, title: 'Compliance Warning', description: 'A recent GST filing was missed', timestamp: '2024-03-01T14:00:00Z', type: 'warning' },
  { id: 5, title: 'Trade License Verified', description: 'Trade license validated and approved', timestamp: '2024-04-05T16:45:00Z', type: 'verified' },
  { id: 6, title: 'Reputation Check Initiated', description: 'Google and LinkedIn checks started', timestamp: '2024-05-10T09:00:00Z', type: 'info' },
];

app.get('/api/timeline/:vendorId', (req, res) => {
  // In a real app, you'd fetch timeline data for req.params.vendorId from a database
  res.json(mockTimeline);
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`Timeline service running on port ${PORT}`)); 