const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const mockNotifications = [
  { id: 1, message: 'Welcome to BharatNXT! Explore new features.', time: 'Just now' },
  { id: 2, message: 'TechCorp Solutions verification completed successfully.', time: '1 hour ago' },
  { id: 3, message: 'Action required: Global Manufacturing has missed a GST filing.', time: '4 hours ago' },
  { id: 4, message: 'New vendor Swift Logistics Ltd onboarded.', time: '1 day ago' },
];

app.get('/api/notifications', (req, res) => {
  res.json(mockNotifications);
});

const PORT = process.env.PORT || 4006;
app.listen(PORT, () => console.log(`Notification service running on port ${PORT}`)); 