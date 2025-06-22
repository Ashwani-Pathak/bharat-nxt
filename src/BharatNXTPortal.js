import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, CheckCircle, Star, Shield, TrendingUp, MapPin,
  DollarSign, BarChart3, Zap, ThumbsUp, ThumbsDown,
  Bell, X, ArrowUp, ArrowDown,
  User, ChevronLeft, Moon, Sun, UploadCloud, Loader2, Users as UsersIcon, LogOut
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, Area, Pie } from 'recharts';

const AuthForm = ({ onLogin, onRegister, authError, setAuthError, isLoginView, setIsLoginView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('jwtToken', data.token);
        onLogin(true);
      } else {
        setAuthError(data.message || 'Login failed.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setAuthError('Network error or server unavailable.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        alert('Registration successful! You can now log in.');
        setIsLoginView(true);
      } else {
        setAuthError(data.message || 'Registration failed.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setAuthError('Network error or server unavailable.');
    }
  };

  const handleSubmit = (e) => {
    if (isLoginView) {
      handleLogin(e);
    } else {
      handleRegister(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center text-blue-700 dark:text-blue-300 mb-6">
          {isLoginView ? 'Login to BharatNXT' : 'Register for BharatNXT'}
        </h2>
        {authError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            {authError}
          </motion.div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:text-gray-100"
              placeholder="your@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:text-gray-100"
              placeholder="********"
              required
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-2 transition-colors"
          >
            {isLoginView ? 'Login' : 'Register'}
          </motion.button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
          {isLoginView ? 'Don\'t have an account?' : 'Already have an account?'}{' '}
          <button
            onClick={() => { setIsLoginView(!isLoginView); setAuthError(''); }}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {isLoginView ? 'Register here' : 'Login here'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

const BharatNXTPortal = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [vendorData, setVendorData] = useState({
    name: '',
    gstin: '',
    pan: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    businessType: '',
    yearEstablished: '',
    turnover: '',
    employeeCount: '',
    documents: []
  });
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('7d');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [viewedVendor, setViewedVendor] = useState(null);
  const [ocrResult, setOcrResult] = useState('');
  const [ocrLoading, setOcrLoading] = useState(false);
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isLoginView, setIsLoginView] = useState(true);

  const [profileTab, setProfileTab] = useState('overview');
  const aiRiskLoading = false;
  const aiRisk = null;
  const timelineLoading = false;
  const timeline = [];
  const [endorseInput, setEndorseInput] = useState('');
  const [endorsementsLoading, setEndorsementsLoading] = useState(false);
  const [endorsements, setEndorsements] = useState([]);
  const [qaInput, setQaInput] = useState('');
  const [qaLoading, setQaLoading] = useState(false);
  const [qa, setQa] = useState([]);
  const [compareSelection, setCompareSelection] = useState([]);
  const comparisonLoading = false;
  const comparison = null;

  // Mock data for charts and analytics
  const [analyticsData] = useState({
    vendorGrowth: [
      { month: 'Jan', vendors: 45, verified: 38, revenue: 125000 },
      { month: 'Feb', vendors: 62, verified: 54, revenue: 167000 },
      { month: 'Mar', vendors: 78, verified: 69, revenue: 198000 },
      { month: 'Apr', vendors: 95, verified: 81, revenue: 234000 },
      { month: 'May', vendors: 112, verified: 98, revenue: 276000 },
      { month: 'Jun', vendors: 134, verified: 118, revenue: 312000 }
    ],
    riskDistribution: [
      { name: 'Low Risk', value: 68, color: '#10B981' },
      { name: 'Medium Risk', value: 24, color: '#F59E0B' },
      { name: 'High Risk', value: 8, color: '#EF4444' }
    ],
    industryBreakdown: [
      { industry: 'Manufacturing', count: 45, percentage: 33.6 },
      { industry: 'IT Services', count: 32, percentage: 23.9 },
      { industry: 'Trading', count: 28, percentage: 20.9 },
      { industry: 'Consulting', count: 18, percentage: 13.4 },
      { industry: 'Others', count: 11, percentage: 8.2 }
    ],
    complianceMetrics: [
      { metric: 'GST Compliance', score: 92, trend: 'up' },
      { metric: 'ROC Filings', score: 88, trend: 'up' },
      { metric: 'Tax Returns', score: 85, trend: 'down' },
      { metric: 'License Renewals', score: 91, trend: 'up' }
    ],
    geographicData: [
      { state: 'Maharashtra', vendors: 34, verified: 31 },
      { state: 'Karnataka', vendors: 28, verified: 25 },
      { state: 'Tamil Nadu', vendors: 22, verified: 19 },
      { state: 'Gujarat', vendors: 18, verified: 16 },
      { state: 'Delhi', vendors: 16, verified: 14 },
      { state: 'Others', vendors: 16, verified: 13 }
    ]
  });

  // Initialize with sample vendors
  useEffect(() => {
    const sampleVendors = [
      {
        id: 1,
        name: 'TechCorp Solutions Pvt Ltd',
        gstin: '29AABCT1332L1Z1',
        pan: 'AABCT1332L',
        email: 'contact@techcorp.com',
        phone: '+91 9876543210',
        website: 'https://techcorp.com',
        address: 'Electronic City, Bangalore',
        city: 'Bangalore',
        state: 'Karnataka',
        businessType: 'IT Services',
        yearEstablished: '2018',
        turnover: '5.2 Cr',
        employeeCount: '85',
        score: 92,
        verificationStatus: { gstin: 'verified', reputation: 'verified', compliance: 'verified' },
        createdAt: new Date('2024-01-15').toISOString(),
        lastUpdated: new Date('2024-06-10').toISOString(),
        riskLevel: 'Low',
        tags: ['IT', 'Software', 'Export'],
        rating: 4.7,
        reviewCount: 156,
        contractValue: '₹2.1 Cr',
        paymentHistory: 'Excellent',
        certifications: ['ISO 9001', 'CMMI Level 3', 'SOC 2']
      },
      {
        id: 2,
        name: 'Global Manufacturing Co',
        gstin: '27AACCA3149P1ZN',
        pan: 'AACCA3149P',
        email: 'info@globalmanuf.com',
        phone: '+91 9123456789',
        website: 'https://globalmanuf.com',
        address: 'Pimpri-Chinchwad, Pune',
        city: 'Pune',
        state: 'Maharashtra',
        businessType: 'Manufacturing',
        yearEstablished: '2010',
        turnover: '15.8 Cr',
        employeeCount: '245',
        score: 78,
        verificationStatus: { gstin: 'verified', reputation: 'warning', compliance: 'verified' },
        createdAt: new Date('2024-02-20').toISOString(),
        lastUpdated: new Date('2024-06-08').toISOString(),
        riskLevel: 'Medium',
        tags: ['Manufacturing', 'Export', 'Automotive'],
        rating: 4.2,
        reviewCount: 89,
        contractValue: '₹4.5 Cr',
        paymentHistory: 'Good',
        certifications: ['ISO 14001', 'IATF 16949']
      },
      {
        id: 3,
        name: 'Swift Logistics Ltd',
        gstin: '33AABCS1234L1Z5',
        pan: 'AABCS1234L',
        email: 'ops@swiftlogistics.com',
        phone: '+91 9876541230',
        website: 'https://swiftlogistics.com',
        address: 'Guindy, Chennai',
        city: 'Chennai',
        state: 'Tamil Nadu',
        businessType: 'Logistics',
        yearEstablished: '2015',
        turnover: '8.7 Cr',
        employeeCount: '120',
        score: 88,
        verificationStatus: { gstin: 'verified', reputation: 'verified', compliance: 'verified' },
        createdAt: new Date('2024-03-10').toISOString(),
        lastUpdated: new Date('2024-06-12').toISOString(),
        riskLevel: 'Low',
        tags: ['Logistics', 'Transportation', 'Warehousing'],
        rating: 4.5,
        reviewCount: 203,
        contractValue: '₹1.8 Cr',
        paymentHistory: 'Excellent',
        certifications: ['ISO 9001', 'AEO Certification']
      }
    ];
    setVendors(sampleVendors);
  }, []);

  // Fetch notifications (mock API)
  useEffect(() => {
    fetch('http://localhost:4006/api/notifications')
      .then(res => res.json())
      .then(setNotifications)
      .catch(() => setNotifications([
        { id: 1, message: 'Welcome to BharatNXT!', time: 'Just now' },
        { id: 2, message: 'Vendor verification completed.', time: '1 hour ago' }
      ]));
  }, []);

  // Check for token on app load
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const getStatusBadge = (score) => {
    if (score >= 80) return { text: 'Verified', color: 'bg-green-100 text-green-800', dotColor: 'bg-green-500' };
    if (score >= 60) return { text: 'At Risk', color: 'bg-yellow-100 text-yellow-800', dotColor: 'bg-yellow-500' };
    return { text: 'High Risk', color: 'bg-red-100 text-red-800', dotColor: 'bg-red-500' };
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.gstin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.businessType.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    
    const badge = getStatusBadge(vendor.score);
    const statusMatch = (filterStatus === 'verified' && badge.text === 'Verified') ||
                       (filterStatus === 'warning' && badge.text === 'At Risk') ||
                       (filterStatus === 'high-risk' && badge.text === 'High Risk');
    
    return matchesSearch && statusMatch;
  });

  const StatCard = ({ title, value, change, icon: Icon, color, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-2">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend === 'up' ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
              <span className="text-sm font-medium">{change}</span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: color + '20' }}>
          <Icon className="w-8 h-8" style={{ color }} />
        </div>
      </div>
    </motion.div>
  );

  const ComplianceMetric = ({ metric, score, trend }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{metric}</span>
        <div className={`flex items-center ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
          <div 
            className={`h-2 rounded-full ${score >= 90 ? 'bg-green-500' : score >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
            style={{ width: `${score}%` }}
          />
        </div>
        <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{score}%</span>
      </div>
    </motion.div>
  );

  const EnhancedDashboard = () => (
    <motion.div
      key="dashboard-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Vendors"
          value={vendors.length}
          change="+12% from last month"
          icon={Building2}
          color="#3B82F6"
          trend="up"
        />
        <StatCard
          title="Verified Vendors"
          value={vendors.filter(v => getStatusBadge(v.score).text === 'Verified').length}
          change="+8% from last month"
          icon={CheckCircle}
          color="#10B981"
          trend="up"
        />
        <StatCard
          title="Total Contract Value"
          value="₹47.2 Cr"
          change="+15% from last month"
          icon={DollarSign}
          color="#8B5CF6"
          trend="up"
        />
        <StatCard
          title="Risk Score"
          value="88.5"
          change="-2.1 from last week"
          icon={Shield}
          color="#F59E0B"
          trend="down"
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vendor Growth Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Vendor Growth & Revenue</h3>
            <div className="flex space-x-2">
              {['7d', '30d', '90d', '1y'].map(period => (
                <button
                  key={period}
                  onClick={() => setSelectedDateRange(period)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${selectedDateRange === period ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.vendorGrowth}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis dataKey="month" stroke="#888" tickLine={false} axisLine={false} className="text-xs text-gray-600 dark:text-gray-300" />
              <YAxis yAxisId="left" stroke="#888" tickLine={false} axisLine={false} className="text-xs text-gray-600 dark:text-gray-300" />
              <YAxis yAxisId="right" orientation="right" stroke="#888" tickLine={false} axisLine={false} className="text-xs text-gray-600 dark:text-gray-300" />
              <Tooltip contentStyle={{ backgroundColor: 'white', borderColor: '#ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Line yAxisId="left" type="monotone" dataKey="vendors" stroke="#3B82F6" strokeWidth={3} name="Total Vendors" />
              <Line yAxisId="left" type="monotone" dataKey="verified" stroke="#10B981" strokeWidth={3} name="Verified Vendors" />
              <Area yAxisId="right" type="monotone" dataKey="revenue" fill="#8B5CF6" fillOpacity={0.1} stroke="#8B5CF6" name="Revenue (₹)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Tooltip contentStyle={{ backgroundColor: 'white', borderColor: '#ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
              <Pie
                data={analyticsData.riskDistribution}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {analyticsData.riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {analyticsData.riskDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Industry & Geographic Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Industry Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6">Industry Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.industryBreakdown} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis type="number" stroke="#888" tickLine={false} axisLine={false} className="text-xs text-gray-600 dark:text-gray-300" />
              <YAxis dataKey="industry" type="category" width={100} stroke="#888" tickLine={false} axisLine={false} className="text-xs text-gray-600 dark:text-gray-300" />
              <Tooltip contentStyle={{ backgroundColor: 'white', borderColor: '#ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6">Geographic Distribution</h3>
          <div className="space-y-4">
            {analyticsData.geographicData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{item.state}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(item.verified / item.vendors) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{item.verified}/{item.vendors}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6">Compliance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {analyticsData.complianceMetrics.map((metric, index) => (
            <ComplianceMetric key={index} {...metric} />
          ))}
        </div>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { type: 'verification', vendor: 'TechCorp Solutions', action: 'completed verification', time: '2 hours ago', status: 'success' },
              { type: 'alert', vendor: 'Global Manufacturing', action: 'missed GST filing', time: '4 hours ago', status: 'warning' },
              { type: 'onboard', vendor: 'New Logistics Co', action: 'started onboarding', time: '6 hours ago', status: 'info' },
              { type: 'payment', vendor: 'Swift Logistics', action: 'payment received', time: '1 day ago', status: 'success' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className={`w-2 h-2 rounded-full ${activity.status === 'success' ? 'bg-green-500' : activity.status === 'warning' ? 'bg-yellow-500' : activity.status === 'info' ? 'bg-blue-500' : 'bg-gray-500'}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    <span className="text-blue-600 dark:text-blue-300">{activity.vendor}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6">Critical Alerts</h3>
          <div className="space-y-4">
            {[
              { type: 'warning', title: 'GST Filing Due', description: '5 vendors have GST filings due this week', priority: 'high' },
              { type: 'info', title: 'Renewal Reminder', description: '12 trade licenses expiring next month', priority: 'medium' },
              { type: 'success', title: 'Compliance Improved', description: 'Overall compliance score increased by 3.2%', priority: 'low' },
              { type: 'error', title: 'Payment Overdue', description: '2 vendors have overdue payments', priority: 'high' }
            ].map((alert, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${alert.priority === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-950' : alert.priority === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950' : 'border-green-500 bg-green-50 dark:bg-green-950'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-100">{alert.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{alert.description}</p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const OnboardingForm = ({ onOnboardingSubmit }) => (
    <motion.div
      key="onboarding-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Vendor Onboarding
        </h2>
        <p className="text-gray-600 dark:text-gray-300">Complete verification in under 5 minutes</p>
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-blue-500" />
                Basic Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Vendor Name *</label>
                  <input
                    type="text"
                    value={vendorData.name}
                    onChange={(e) => setVendorData({...vendorData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    placeholder="Enter business name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Business Type *</label>
                  <select
                    value={vendorData.businessType}
                    onChange={(e) => setVendorData({...vendorData, businessType: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">Select business type</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="IT Services">IT Services</option>
                    <option value="Trading">Trading</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Logistics">Logistics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Year Established</label>
                  <input
                    type="number"
                    value={vendorData.yearEstablished}
                    onChange={(e) => setVendorData({...vendorData, yearEstablished: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    placeholder="2020"
                  />
                </div>
              </div>
            </div>
            {/* Document Upload & OCR */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                <UploadCloud className="w-5 h-5 mr-2 text-blue-500" />
                Upload Documents (PAN, Udyam, Trade License)
              </h3>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleDocUpload}
                className="mb-2"
              />
              {uploadedDoc && (
                <div className="mt-2 text-sm text-gray-700 dark:text-gray-200">Selected: {uploadedDoc.name}</div>
              )}
              {ocrLoading && (
                <div className="flex items-center gap-2 mt-2 text-blue-600 dark:text-blue-300">
                  <Loader2 className="w-4 h-4 animate-spin" /> Extracting text...
                </div>
              )}
              {ocrResult && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded text-blue-800 dark:text-blue-200 text-sm">
                  <div className="font-semibold mb-1">Extracted Text Preview:</div>
                  <div>{ocrResult}</div>
                </div>
              )}
            </div>
            {/* Animated Progress Bar (mocked) */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                <Loader2 className="w-5 h-5 mr-2 text-blue-500 animate-spin" />
                Verification Progress
              </h3>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-700"
                  style={{ width: '60%' }}
                />
              </div>
              <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">60% Complete (Mocked)</div>
            </div>
            {/* Submit Button */}
            <div className="pt-4 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOnboardingSubmit} 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105"
              >
                Submit Onboarding Data
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const VendorDirectory = () => (
    <motion.div
      key="vendor-directory-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Vendor Directory</h2>
      <div className="flex flex-wrap items-center mb-4 gap-2">
        <input
          type="text"
          placeholder="Search vendors..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg w-full max-w-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
        />
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
        >
          <option value="all">All</option>
          <option value="verified">Verified</option>
          <option value="warning">At Risk</option>
          <option value="high-risk">High Risk</option>
        </select>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.map(vendor => (
          <motion.div
            key={vendor.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition cursor-pointer border border-gray-100 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600"
            onClick={() => { setViewedVendor(vendor); setProfileTab('overview'); }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-500" />
                <span className="font-semibold text-lg text-gray-800 dark:text-gray-100">{vendor.name}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusBadge(vendor.score).color}`}>{getStatusBadge(vendor.score).text}</span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-300 mb-2">{vendor.businessType} • {vendor.city}, {vendor.state}</div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Star className="w-4 h-4 text-yellow-400" /> {vendor.rating.toFixed(1)} ({vendor.reviewCount} reviews)
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const VendorProfile = ({ vendor }) => (
    <motion.div
      key="vendor-profile-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto">
      <button className="mb-4 text-blue-600 dark:text-blue-400 hover:underline flex items-center" onClick={() => setViewedVendor(null)}>
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Directory
      </button>
      <div className="flex items-center gap-4 mb-6">
        <Building2 className="w-10 h-10 text-blue-500" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{vendor.name}</h2>
          <div className="text-sm text-gray-500 dark:text-gray-300">{vendor.businessType} • {vendor.city}, {vendor.state}</div>
        </div>
        <span className={`ml-auto px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(vendor.score).color}`}>{getStatusBadge(vendor.score).text}</span>
      </div>
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        {['overview','timeline','endorsements','qa','comparison'].map(tab => (
          <button
            key={tab}
            className={`px-4 py-2 font-medium capitalize border-b-2 transition-colors ${profileTab===tab?'border-blue-600 text-blue-700 dark:text-blue-200':'border-transparent text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-300'}`}
            onClick={()=>setProfileTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={profileTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {profileTab==='overview' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-2 text-gray-800 dark:text-gray-200">
                  <div><span className="font-semibold">GSTIN:</span> {vendor.gstin}</div>
                  <div><span className="font-semibold">PAN:</span> {vendor.pan}</div>
                  <div><span className="font-semibold">Email:</span> {vendor.email}</div>
                  <div><span className="font-semibold">Phone:</span> {vendor.phone}</div>
                  <div><span className="font-semibold">Website:</span> <a href={vendor.website} className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">{vendor.website}</a></div>
                  <div><span className="font-semibold">Address:</span> {vendor.address}</div>
                  <div><span className="font-semibold">Certifications:</span> {vendor.certifications?.join(', ')}</div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="text-4xl font-bold text-blue-700 dark:text-blue-200">{vendor.score}</div>
                  <div className="text-xs text-gray-400">Compliance Score</div>
                  <div className={`px-2 py-1 rounded-full text-xs font-bold ${getRiskColor(vendor.riskLevel)}`}>{vendor.riskLevel} Risk</div>
                  <div className="mt-2 flex gap-2">
                    <ThumbsUp className="w-5 h-5 text-green-500" />
                    <ThumbsDown className="w-5 h-5 text-red-500" />
                  </div>
                </div>
              </div>
              {/* AI Risk Prediction Card */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-lg p-6 shadow flex items-center gap-6">
                <Zap className="w-8 h-8 text-purple-500" />
                <div>
                  <div className="font-semibold text-lg text-purple-700 dark:text-purple-300">AI Risk Prediction</div>
                  {aiRiskLoading ? (
                    <div className="text-blue-600 dark:text-blue-200 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div>
                  ) : aiRisk ? (
                    <div className="text-sm text-gray-600 dark:text-gray-200">Predicted Risk: <span className="font-bold text-blue-600 dark:text-blue-200">{aiRisk.riskLevel}</span></div>
                  ) : (
                    <div className="text-xs text-gray-400">No AI risk data available.</div>
                  )}
                </div>
              </div>
            </div>
          )}
          {profileTab==='timeline' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <div className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-4">Vendor Timeline</div>
              {timelineLoading ? (
                <div className="text-blue-600 dark:text-blue-200 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div>
              ) : (
                <div className="space-y-4">
                  {timeline.length === 0 ? <div className="text-gray-500 dark:text-gray-300">No events.</div> : timeline.map((event,idx)=>(
                    <div key={idx} className="flex items-start gap-3">
                      <div className={`w-3 h-3 rounded-full mt-1 ${event.type==='verified'?'bg-green-500':event.type==='warning'?'bg-yellow-500':'bg-blue-500'}`}></div>
                      <div>
                        <div className="font-semibold text-gray-800 dark:text-gray-100">{event.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-300">{event.description}</div>
                        <div className="text-xs text-gray-400">{event.timestamp}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {profileTab==='endorsements' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <div className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-4">Endorsements</div>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={endorseInput}
                  onChange={e => setEndorseInput(e.target.value)}
                  placeholder="Write an endorsement..."
                  className="px-3 py-2 border border-gray-300 rounded w-full dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition" onClick={handleEndorse} disabled={endorsementsLoading}>
                  {endorsementsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Endorse'}
                </motion.button>
              </div>
              {endorsementsLoading ? (
                <div className="text-blue-600 dark:text-blue-200 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div>
              ) : (
                <ul className="space-y-2">
                  {endorsements.length === 0 ? <li className="text-gray-500 dark:text-gray-300">No endorsements yet.</li> : endorsements.map((e, idx) => (
                    <li key={idx} className="bg-blue-50 dark:bg-blue-900 rounded p-2 text-blue-800 dark:text-blue-200">{e.text}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {profileTab==='qa' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <div className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-4">Q&A / Discussion</div>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={qaInput}
                  onChange={e => setQaInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="px-3 py-2 border border-gray-300 rounded w-full dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition" onClick={handleQa} disabled={qaLoading}>
                  {qaLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ask'}
                </motion.button>
              </div>
              {qaLoading ? (
                <div className="text-blue-600 dark:text-blue-200 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div>
              ) : (
                <ul className="space-y-2">
                  {qa.length === 0 ? <li className="text-gray-500 dark:text-gray-300">No questions yet.</li> : qa.map((q, idx) => (
                    <li key={idx} className="bg-gray-100 dark:bg-gray-900 rounded p-2 text-gray-800 dark:text-gray-200">{q.text}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {profileTab==='comparison' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <div className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-4">Compare Vendors</div>
              <div className="mb-4">
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Select up to 2 more vendors to compare:</div>
                <div className="flex flex-wrap gap-2">
                  {vendors.filter(v => v.id !== vendor.id).map(v => (
                    <motion.button
                      key={v.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-3 py-1 rounded-full border ${compareSelection.includes(v.id) ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-900 text-gray-700 dark:text-gray-200'}`}
                      onClick={() => {
                        if (compareSelection.includes(v.id)) {
                          setCompareSelection(compareSelection.filter(id => id !== v.id));
                        } else if (compareSelection.length < 2) {
                          setCompareSelection([...compareSelection, v.id]);
                        }
                      }}
                    >
                      {v.name}
                    </motion.button>
                  ))}
                </div>
              </div>
              {comparisonLoading ? (
                <div className="text-blue-600 dark:text-blue-200 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div>
              ) : comparison ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-900">
                        <th className="p-3 text-left text-gray-600 dark:text-gray-300">Field</th>
                        {comparison.vendors.map((v, idx) => (
                          <th key={idx} className="p-3 text-left text-gray-600 dark:text-gray-300">{v.name}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {comparison.fields.map((field, idx) => (
                        <tr key={idx} className="border-t border-gray-200 dark:border-gray-700">
                          <td className="p-3 font-semibold text-gray-800 dark:text-gray-100">{field}</td>
                          {comparison.vendors.map((v, vidx) => (
                            <td key={vidx} className="p-3 text-gray-700 dark:text-gray-200">{v[field]}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-gray-500 dark:text-gray-300">Select vendors to compare.</div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );

  const Topbar = () => (
    <header className={`flex items-center justify-between px-8 py-4 shadow bg-white dark:bg-gray-900 transition-colors sticky top-0 z-20`}>
      <div className="text-xl font-bold text-blue-700 dark:text-blue-300 tracking-wide">BharatNXT Portal</div>
      <div className="flex items-center gap-4">
        <button
          className="relative"
          onClick={() => setShowNotifications(v => !v)}
          aria-label="Show notifications"
        >
          <Bell className="w-6 h-6 text-gray-600 dark:text-gray-200" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">{notifications.length}</span>
          )}
        </button>
        <button
          className="ml-2 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          onClick={() => setIsDarkMode(d => !d)}
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
        </button>
      </div>
      {showNotifications && (
        <div className="absolute right-8 top-16 w-80 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 z-30">
          <div className="font-semibold mb-2 text-gray-800 dark:text-gray-100">Notifications</div>
          {notifications.length === 0 ? (
            <div className="text-gray-500 dark:text-gray-300">No notifications.</div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {notifications.map(n => (
                <li key={n.id} className="py-2 text-sm text-gray-700 dark:text-gray-200 flex justify-between items-center">
                  <span>{n.message}</span>
                  <span className="text-xs text-gray-400 ml-2">{n.time}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </header>
  );

  const handleDocUpload = async (e) => {
    const file = e.target.files[0];
    setUploadedDoc(file);
    setOcrResult('');
    if (!file) return;
    setOcrLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('http://localhost:4007/api/ocr', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setOcrResult(data.text || 'Sample extracted text from document.');
    } catch {
      setOcrResult('Sample extracted text from document.');
    }
    setOcrLoading(false);
  };

  const handleEndorse = async () => {
    if (!endorseInput) return;
    setEndorsementsLoading(true);
    await fetch(`http://localhost:4002/api/endorsements/${viewedVendor.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: endorseInput })
    });
    setEndorseInput('');
    fetch(`http://localhost:4002/api/endorsements/${viewedVendor.id}`)
      .then(res => res.json())
      .then(setEndorsements)
      .finally(() => setEndorsementsLoading(false));
  };

  const handleQa = async () => {
    if (!qaInput) return;
    setQaLoading(true);
    await fetch(`http://localhost:4003/api/qa/${viewedVendor.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: qaInput })
    });
    setQaInput('');
    fetch(`http://localhost:4003/api/qa/${viewedVendor.id}`)
      .then(res => res.json())
      .then(setQa)
      .finally(() => setQaLoading(false));
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setIsAuthenticated(false);
  };

  const handleOnboardingSubmit = async () => {
    try {
      const response = await fetch('/api/vendors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('jwtToken')
        },
        body: JSON.stringify(vendorData)
      });
      const data = await response.json();
      if (response.ok) {
        alert('Vendor data submitted successfully!');
        // Optionally, clear the form or switch tab
        setCurrentTab('dashboard');
      } else {
        alert(`Submission failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Onboarding submission error:', error);
      alert('Network error or server unavailable during submission.');
    }
  };

  if (!isAuthenticated) {
    return (
      <AuthForm 
        onLogin={setIsAuthenticated}
        onRegister={() => {}}
        authError={authError}
        setAuthError={setAuthError}
        isLoginView={isLoginView}
        setIsLoginView={setIsLoginView}
      />
    );
  }

  return (
    <div className={isDarkMode ? 'dark bg-gray-900 min-h-screen' : 'bg-gray-100 min-h-screen'}>
      <Topbar />
      <div className="flex">
        <aside className="w-64 bg-white dark:bg-gray-950 shadow-lg flex flex-col p-6 space-y-8 min-h-screen">
          <div className="flex items-center space-x-2 mb-8">
            <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-bold text-blue-700 dark:text-blue-200">BharatNXT</span>
          </div>
          <nav className="flex flex-col space-y-2">
            <button
              className={`flex items-center px-4 py-2 rounded-lg text-left font-medium transition-colors ${currentTab === 'dashboard' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              onClick={() => setCurrentTab('dashboard')}
            >
              <BarChart3 className="w-5 h-5 mr-3" /> Dashboard
            </button>
            <button
              className={`flex items-center px-4 py-2 rounded-lg text-left font-medium transition-colors ${currentTab === 'onboarding' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              onClick={() => setCurrentTab('onboarding')}
            >
              <User className="w-5 h-5 mr-3" /> Onboarding
            </button>
            <button
              className={`flex items-center px-4 py-2 rounded-lg text-left font-medium transition-colors ${currentTab === 'vendors' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              onClick={() => setCurrentTab('vendors')}
            >
              <UsersIcon className="w-5 h-5 mr-3" /> Vendors
            </button>
          </nav>
          <div className="mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 rounded-lg text-left font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" /> Logout
            </button>
            <div className="mt-4 text-xs text-gray-400 dark:text-gray-500">© {new Date().getFullYear()} BharatNXT</div>
          </div>
        </aside>
        <main className="flex-1 p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            {currentTab === 'dashboard' && <EnhancedDashboard key="dashboard" />}
            {currentTab === 'onboarding' && <OnboardingForm onOnboardingSubmit={handleOnboardingSubmit} />}
            {currentTab === 'vendors' && (
              viewedVendor ? <VendorProfile key="vendor-profile" vendor={viewedVendor} /> : <VendorDirectory key="vendor-directory" />
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default BharatNXTPortal;
