const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  gstin: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  pan: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  businessType: {
    type: String,
    required: true
  },
  yearEstablished: {
    type: Number
  },
  turnover: {
    type: Number
  },
  employeeCount: {
    type: Number
  },
  documents: [{
    type: {
      type: String,
      enum: ['PAN', 'GST', 'UDYAM', 'TRADE_LICENSE', 'OTHER']
    },
    url: String,
    verified: {
      type: Boolean,
      default: false
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  verificationStatus: {
    gstin: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    },
    reputation: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    },
    compliance: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    }
  },
  score: {
    type: Number,
    default: 0
  },
  riskLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  rating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  contractValue: {
    type: Number,
    default: 0
  },
  paymentHistory: {
    type: String,
    enum: ['Excellent', 'Good', 'Fair', 'Poor'],
    default: 'Fair'
  },
  certifications: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Update lastUpdated timestamp before saving
vendorSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('Vendor', vendorSchema); 