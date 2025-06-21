const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const mockRiskData = {
  1: { riskLevel: 'Low', explanation: 'Consistent compliance history, positive reputation.' },
  2: { riskLevel: 'Medium', explanation: 'Recent missed filing, but otherwise good record.' },
  3: { riskLevel: 'Low', explanation: 'Excellent compliance, strong online presence.' },
};

app.get('/api/risk/:vendorId', (req, res) => {
  const vendorId = parseInt(req.params.vendorId);
  res.json(mockRiskData[vendorId] || { riskLevel: 'Unknown', explanation: 'No risk data available.' });
});

const PORT = process.env.PORT || 4005;
app.listen(PORT, () => console.log(`Risk AI service running on port ${PORT}`)); 