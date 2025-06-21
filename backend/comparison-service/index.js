const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const mockVendorsData = {
  1: { id: 1, name: 'TechCorp Solutions Pvt Ltd', businessType: 'IT Services', score: 92, riskLevel: 'Low', rating: 4.7, email: 'contact@techcorp.com', phone: '+91 9876543210' },
  2: { id: 2, name: 'Global Manufacturing Co', businessType: 'Manufacturing', score: 78, riskLevel: 'Medium', rating: 4.2, email: 'info@globalmanuf.com', phone: '+91 9123456789' },
  3: { id: 3, name: 'Swift Logistics Ltd', businessType: 'Logistics', score: 88, riskLevel: 'Low', rating: 4.5, email: 'ops@swiftlogistics.com', phone: '+91 9876541230' },
};

app.get('/api/comparison', (req, res) => {
  const vendorIds = req.query.vendorIds ? req.query.vendorIds.split(',').map(id => parseInt(id.trim())) : [];
  const selectedVendors = vendorIds.map(id => mockVendorsData[id]).filter(Boolean);

  if (selectedVendors.length === 0) {
    return res.json({ vendors: [], fields: [] });
  }

  const fieldsToCompare = [
    'name',
    'businessType',
    'score',
    'riskLevel',
    'rating',
    'email',
    'phone',
  ];

  res.json({
    vendors: selectedVendors,
    fields: fieldsToCompare,
  });
});

const PORT = process.env.PORT || 4004;
app.listen(PORT, () => console.log(`Comparison service running on port ${PORT}`)); 