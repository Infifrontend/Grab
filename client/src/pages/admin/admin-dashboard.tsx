
import { useState, useEffect } from "react";
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Button, 
  Avatar, 
  Badge, 
  Select, 
  Space,
  Divider,
  Progress,
  Table,
  Statistic
} from "antd";
import { 
  DollarOutlined, 
  CalendarOutlined, 
  GiftOutlined, 
  UserOutlined,
  BellOutlined,
  ReloadOutlined,
  DownloadOutlined,
  RiseOutlined,
  FallOutlined,
  TrophyOutlined,
  LineChartOutlined
} from "@ant-design/icons";
import { useLocation } from "wouter";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';

const { Title, Text } = Typography;

// Mock data for charts
const revenueBookingsData = [
  { month: 'Jan', bookings: 98, revenue: 180000 },
  { month: 'Feb', bookings: 115, revenue: 210000 },
  { month: 'Mar', bookings: 128, revenue: 240000 },
  { month: 'Apr', bookings: 145, revenue: 280000 },
  { month: 'May', bookings: 168, revenue: 320000 },
  { month: 'Jun', bookings: 185, revenue: 360000 },
  { month: 'Jul', bookings: 205, revenue: 420000 },
  { month: 'Aug', bookings: 215, revenue: 450000 },
  { month: 'Sep', bookings: 198, revenue: 410000 },
  { month: 'Oct', bookings: 165, revenue: 380000 },
  { month: 'Nov', bookings: 142, revenue: 320000 },
  { month: 'Dec', bookings: 125, revenue: 280000 }
];

const bookingStatusData = [
  { name: 'Confirmed', value: 65, color: '#4F46E5' },
  { name: 'Pending', value: 25, color: '#F59E0B' },
  { name: 'Cancelled', value: 10, color: '#EF4444' }
];

const topRoutesData = [
  { route: 'LAX → JFK', bookings: 245, revenue: 551250, growth: 23.5 },
  { route: 'ORD → LAX', bookings: 189, revenue: 425970, growth: 18.2 },
  { route: 'MIA → SFO', bookings: 156, revenue: 389000, growth: -15.8 },
  { route: 'DEN → BOS', bookings: 143, revenue: 357500, growth: 12.4 },
  { route: 'ATL → SEA', bookings: 132, revenue: 316800, growth: 9.7 }
];

// Mock data for booking analytics
const bookingTrendData = [
  { month: 'Jan', domestic: 45, international: 53, corporate: 32 },
  { month: 'Feb', domestic: 52, international: 63, corporate: 38 },
  { month: 'Mar', domestic: 58, international: 70, corporate: 45 },
  { month: 'Apr', domestic: 65, international: 80, corporate: 52 },
  { month: 'May', domestic: 72, international: 96, corporate: 58 },
  { month: 'Jun', domestic: 78, international: 107, corporate: 65 }
];

// Mock data for offers analytics
const offerPerformanceData = [
  { name: 'Early Bird', conversions: 234, revenue: 450000, ctr: 12.5 },
  { name: 'Group Discount', conversions: 189, revenue: 380000, ctr: 8.9 },
  { name: 'Flash Sale', conversions: 156, revenue: 320000, ctr: 15.2 },
  { name: 'Loyalty Bonus', conversions: 98, revenue: 280000, ctr: 6.7 }
];

// Mock data for insights
const forecastData = [
  { month: 'Jul', actual: 205, predicted: 210 },
  { month: 'Aug', actual: 215, predicted: 225 },
  { month: 'Sep', actual: null, predicted: 240 },
  { month: 'Oct', actual: null, predicted: 255 },
  { month: 'Nov', actual: null, predicted: 270 },
  { month: 'Dec', actual: null, predicted: 285 }
];

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [timeRange, setTimeRange] = useState('12months');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Check if admin is logged in
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isAdminLoggedIn) {
      setLocation('/admin/login');
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUsername');
    setLocation('/admin/login');
  };

  const renderOverviewContent = () => (
    <>
      {/* Stats Cards */}
      <Row gutter={[24, 24]} className="mb-8">
        <Col xs={24} sm={12} lg={6}>
          <Card className="stats-card">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Text className="text-gray-500 text-sm block mb-2">Total Revenue</Text>
                <div className="flex items-center space-x-2">
                  <Title level={3} className="!mb-0 text-gray-900">$2.85M</Title>
                  <div className="flex items-center space-x-1 text-green-600">
                    <RiseOutlined className="text-xs" />
                    <Text className="text-green-600 text-sm font-medium">+12.3%</Text>
                  </div>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <DollarOutlined className="text-blue-600 text-xl" />
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card className="stats-card">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Text className="text-gray-500 text-sm block mb-2">Total Bookings</Text>
                <div className="flex items-center space-x-2">
                  <Title level={3} className="!mb-0 text-gray-900">1,247</Title>
                  <div className="flex items-center space-x-1 text-green-600">
                    <RiseOutlined className="text-xs" />
                    <Text className="text-green-600 text-sm font-medium">+18.5%</Text>
                  </div>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <CalendarOutlined className="text-green-600 text-xl" />
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card className="stats-card">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Text className="text-gray-500 text-sm block mb-2">Active Offers</Text>
                <div className="flex items-center space-x-2">
                  <Title level={3} className="!mb-0 text-gray-900">234</Title>
                  <Text className="text-purple-600 text-sm font-medium">34.5% conversion</Text>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <GiftOutlined className="text-purple-600 text-xl" />
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card className="stats-card">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Text className="text-gray-500 text-sm block mb-2">Total Passengers</Text>
                <div className="flex items-center space-x-2">
                  <Title level={3} className="!mb-0 text-gray-900">15,634</Title>
                  <Text className="text-yellow-600 text-sm font-medium">across all routes</Text>
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                <UserOutlined className="text-yellow-600 text-xl" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} className="mb-8">
        {/* Revenue & Bookings Trend */}
        <Col xs={24} lg={14}>
          <Card className="chart-card">
            <div className="mb-6">
              <Title level={4} className="!mb-1 text-gray-900">Revenue & Bookings Trend</Title>
              <Text className="text-gray-500">Monthly performance over the past year</Text>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueBookingsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    className="text-xs text-gray-500"
                  />
                  <YAxis hide />
                  <Bar dataKey="bookings" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Booking Status Distribution */}
        <Col xs={24} lg={10}>
          <Card className="chart-card">
            <div className="mb-6">
              <Title level={4} className="!mb-1 text-gray-900">Booking Status Distribution</Title>
              <Text className="text-gray-500">Current status breakdown</Text>
            </div>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookingStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {bookingStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              {bookingStatusData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <Text className="text-sm text-gray-600">{item.name} ({item.value}%)</Text>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Top Performing Routes */}
      <Card className="routes-card">
        <div className="mb-6">
          <Title level={4} className="!mb-1 text-gray-900">Top Performing Routes</Title>
          <Text className="text-gray-500">Revenue and booking performance by route</Text>
        </div>
        
        <div className="space-y-4">
          {topRoutesData.map((route, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-blue-600 text-lg">✈️</span>
                </div>
                <div>
                  <Text className="font-semibold text-gray-900 text-base">{route.route}</Text>
                  <Text className="text-gray-500 text-sm">{route.bookings} bookings</Text>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <Text className="font-bold text-green-600 text-lg">
                    ${route.revenue.toLocaleString()}
                  </Text>
                  <Text className="text-gray-500 text-sm">Revenue</Text>
                </div>
                <div className="flex items-center space-x-1 min-w-[60px] justify-end">
                  {route.growth > 0 ? (
                    <RiseOutlined className="text-green-600 text-xs" />
                  ) : (
                    <FallOutlined className="text-red-600 text-xs" />
                  )}
                  <Text className={`text-sm font-medium ${route.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {route.growth > 0 ? '+' : ''}{route.growth}%
                  </Text>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );

  const renderBookingAnalyticsContent = () => (
    <>
      {/* Stats Cards */}
      <Row gutter={[24, 24]} className="mb-8">
        <Col xs={24} sm={12} lg={8}>
          <Card className="stats-card">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Text className="text-gray-500 text-sm block mb-2">Avg Booking Value</Text>
                <Title level={3} className="!mb-0 text-gray-900">$2284</Title>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <DollarOutlined className="text-blue-600 text-xl" />
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={8}>
          <Card className="stats-card">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Text className="text-gray-500 text-sm block mb-2">Confirmation Rate</Text>
                <Title level={3} className="!mb-0 text-gray-900">78.7%</Title>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <span className="text-green-600 text-xl">✓</span>
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={8}>
          <Card className="stats-card">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Text className="text-gray-500 text-sm block mb-2">Cancellation Rate</Text>
                <Title level={3} className="!mb-0 text-gray-900">6.6%</Title>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                <span className="text-red-600 text-xl">⚠</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Booking Volume Trends */}
      <Row gutter={[24, 24]} className="mb-8">
        <Col xs={24}>
          <Card className="chart-card">
            <div className="mb-6">
              <Title level={4} className="!mb-1 text-gray-900">Booking Volume Trends</Title>
              <Text className="text-gray-500">Daily booking patterns and seasonal trends</Text>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueBookingsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    className="text-xs text-gray-500"
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    className="text-xs text-gray-500"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="bookings" 
                    stroke="#4F46E5" 
                    fill="#A5B4FC" 
                    fillOpacity={0.6}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Route Performance */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card className="chart-card">
            <div className="mb-6">
              <Title level={4} className="!mb-1 text-gray-900">Route Performance</Title>
              <Text className="text-gray-500">Bookings by route</Text>
            </div>
            <div className="space-y-4">
              {[
                { route: 'ATL → SEA', bookings: 4.0 },
                { route: 'DEN → BOS', bookings: 3.5 },
                { route: 'MIA → SFO', bookings: 3.0 },
                { route: 'ORD → LAX', bookings: 2.5 },
                { route: 'LAX → JFK', bookings: 2.0 }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <Text className="text-gray-700 font-medium">{item.route}</Text>
                  <div className="flex items-center space-x-3 w-40">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(item.bookings / 4.0) * 100}%` }}
                      ></div>
                    </div>
                    <Text className="text-gray-600 text-sm w-8">{item.bookings}</Text>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card className="chart-card">
            <div className="mb-6">
              <Title level={4} className="!mb-1 text-gray-900">Revenue by Route</Title>
              <Text className="text-gray-500">Revenue distribution</Text>
            </div>
            <div className="space-y-4">
              {[
                { route: 'ATL → SEA', revenue: 4.0 },
                { route: 'DEN → BOS', revenue: 3.5 },
                { route: 'MIA → SFO', revenue: 3.0 },
                { route: 'ORD → LAX', revenue: 2.5 },
                { route: 'LAX → JFK', revenue: 2.0 }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <Text className="text-gray-700 font-medium">{item.route}</Text>
                  <div className="flex items-center space-x-3 w-40">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(item.revenue / 4.0) * 100}%` }}
                      ></div>
                    </div>
                    <Text className="text-gray-600 text-sm w-8">{item.revenue}</Text>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );

  const renderOfferAnalyticsContent = () => (
    <>
      {/* Stats Cards */}
      <Row gutter={[24, 24]} className="mb-8">
        <Col xs={24} sm={12} lg={6}>
          <Card className="stats-card">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Text className="text-gray-500 text-sm block mb-2">Total Offers</Text>
                <Title level={3} className="!mb-0 text-gray-900">847</Title>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <GiftOutlined className="text-purple-600 text-xl" />
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card className="stats-card">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Text className="text-gray-500 text-sm block mb-2">Offer Revenue</Text>
                <Title level={3} className="!mb-0 text-gray-900">$1.2M</Title>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <DollarOutlined className="text-green-600 text-xl" />
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card className="stats-card">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Text className="text-gray-500 text-sm block mb-2">Avg Conversion</Text>
                <Title level={3} className="!mb-0 text-gray-900">34.5%</Title>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <span className="text-blue-600 text-xl">🎯</span>
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card className="stats-card">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Text className="text-gray-500 text-sm block mb-2">Active Offers</Text>
                <Title level={3} className="!mb-0 text-gray-900">234</Title>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                <LineChartOutlined className="text-orange-600 text-xl" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Top Performing Offers */}
      <Row gutter={[24, 24]} className="mb-8">
        <Col xs={24}>
          <Card className="chart-card">
            <div className="mb-6">
              <Title level={4} className="!mb-1 text-gray-900">Top Performing Offers</Title>
              <Text className="text-gray-500">Best converting offers by revenue and booking volume</Text>
            </div>
            <div className="space-y-6">
              {[
                { name: 'Premium Meal Bundle', category: 'Food & Beverage', bookings: 543, revenue: 271500, conversion: 42.3 },
                { name: 'Extra Baggage Deal', category: 'Baggage', bookings: 467, revenue: 219150, conversion: 38.9 },
                { name: 'Seat Upgrade Package', category: 'Seating', bookings: 412, revenue: 206000, conversion: 35.2 },
                { name: 'Wi-Fi & Entertainment', category: 'Connectivity', bookings: 389, revenue: 155600, conversion: 31.8 },
                { name: 'Travel Insurance Plus', category: 'Insurance', bookings: 356, revenue: 142400, conversion: 29.4 }
              ].map((offer, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <GiftOutlined className="text-purple-600" />
                    </div>
                    <div>
                      <Text className="font-semibold text-gray-900 text-base block">{offer.name}</Text>
                      <Text className="text-gray-500 text-sm">{offer.category}</Text>
                    </div>
                    <div>
                      <Text className="text-gray-600 text-sm">{offer.bookings} bookings</Text>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <Text className="font-bold text-green-600 text-lg">
                        ${offer.revenue.toLocaleString()}
                      </Text>
                      <Text className="text-gray-500 text-sm">Revenue</Text>
                    </div>
                    <div className="text-right">
                      <Text className="font-bold text-blue-600 text-lg">
                        {offer.conversion}%
                      </Text>
                      <Text className="text-gray-500 text-sm">Conversion</Text>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card className="chart-card">
            <div className="mb-6">
              <Title level={4} className="!mb-1 text-gray-900">Offer Category Performance</Title>
              <Text className="text-gray-500">Revenue by category</Text>
            </div>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Food & Beverage', value: 35, color: '#4F46E5' },
                      { name: 'Baggage', value: 25, color: '#10B981' },
                      { name: 'Seating', value: 20, color: '#F59E0B' },
                      { name: 'Connectivity', value: 12, color: '#EF4444' },
                      { name: 'Insurance', value: 8, color: '#8B5CF6' }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {[
                      { name: 'Food & Beverage', value: 35, color: '#4F46E5' },
                      { name: 'Baggage', value: 25, color: '#10B981' },
                      { name: 'Seating', value: 20, color: '#F59E0B' },
                      { name: 'Connectivity', value: 12, color: '#EF4444' },
                      { name: 'Insurance', value: 8, color: '#8B5CF6' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card className="chart-card">
            <div className="mb-6">
              <Title level={4} className="!mb-1 text-gray-900">Monthly Offer Performance</Title>
              <Text className="text-gray-500">Offers created vs performance</Text>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { month: 'Jan', performance: 45 },
                  { month: 'Feb', performance: 52 },
                  { month: 'Mar', performance: 48 },
                  { month: 'Apr', performance: 61 },
                  { month: 'May', performance: 58 },
                  { month: 'Jun', performance: 68 },
                  { month: 'Jul', performance: 74 },
                  { month: 'Aug', performance: 71 },
                  { month: 'Sep', performance: 76 },
                  { month: 'Oct', performance: 73 },
                  { month: 'Nov', performance: 68 },
                  { month: 'Dec', performance: 71 }
                ]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    className="text-xs text-gray-500"
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    className="text-xs text-gray-500"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="performance" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    dot={{ fill: '#8B5CF6', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );

  const renderInsightsForecastsContent = () => (
    <>
      <Row gutter={[24, 24]} className="mb-8">
        <Col xs={24} lg={16}>
          <Card className="chart-card">
            <div className="mb-6">
              <Title level={4} className="!mb-1 text-gray-900">Booking Forecast</Title>
              <Text className="text-gray-500">Predicted vs actual booking trends</Text>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Line type="monotone" dataKey="actual" stroke="#4F46E5" strokeWidth={3} dot={{ fill: '#4F46E5', r: 6 }} />
                  <Line type="monotone" dataKey="predicted" stroke="#10B981" strokeWidth={3} strokeDasharray="5 5" dot={{ fill: '#10B981', r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className="stats-card">
            <div className="space-y-6">
              <div className="text-center">
                <TrophyOutlined className="text-4xl text-yellow-500 mb-2" />
                <Title level={4} className="!mb-1">Performance Score</Title>
                <Text className="text-3xl font-bold text-green-600">94.2</Text>
                <Text className="text-gray-500 block">Out of 100</Text>
              </div>
              <Divider />
              <div>
                <Text className="text-gray-600 block mb-2">Next Month Prediction</Text>
                <Text className="text-2xl font-bold text-blue-600">+15.3%</Text>
                <Text className="text-gray-500 block">Growth expected</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">GR</span>
                </div>
                <div>
                  <Text className="text-gray-600 text-sm font-medium">GROUP RETAIL</Text>
                  <br />
                  <Text className="text-gray-500 text-xs">ADMIN PORTAL</Text>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge count={5} size="small">
                <BellOutlined className="text-gray-500 text-lg" />
              </Badge>
              <Avatar size="small" className="bg-blue-600">
                <span className="text-white font-medium">JD</span>
              </Avatar>
              <div className="text-right">
                <Text className="font-medium text-gray-900 block">John Doe</Text>
                <Text className="text-gray-500 text-sm">System Admin</Text>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Made sticky */}
        <div className="w-64 bg-blue-600 min-h-screen sticky top-[73px]">
          <div className="p-6">
            <nav className="space-y-2">
              <div className="flex items-center space-x-3 text-white bg-blue-700 rounded-lg px-4 py-3">
                <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                  <span className="text-blue-600 text-xs">📊</span>
                </div>
                <Text className="text-white font-medium">Dashboard</Text>
              </div>
              <div className="flex items-center space-x-3 text-blue-200 hover:text-white px-4 py-3 rounded-lg hover:bg-blue-700 cursor-pointer">
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-current text-xs">🎯</span>
                </div>
                <Text className="text-current">Offer Management</Text>
              </div>
              <div className="flex items-center space-x-3 text-blue-200 hover:text-white px-4 py-3 rounded-lg hover:bg-blue-700 cursor-pointer">
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-current text-xs">📋</span>
                </div>
                <Text className="text-current">Bid Management</Text>
              </div>
              <div className="flex items-center space-x-3 text-blue-200 hover:text-white px-4 py-3 rounded-lg hover:bg-blue-700 cursor-pointer">
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-current text-xs">📅</span>
                </div>
                <Text className="text-current">Bookings</Text>
              </div>
              <div className="flex items-center space-x-3 text-blue-200 hover:text-white px-4 py-3 rounded-lg hover:bg-blue-700 cursor-pointer">
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-current text-xs">⚙️</span>
                </div>
                <Text className="text-current">CMS</Text>
              </div>
              <div className="flex items-center space-x-3 text-blue-200 hover:text-white px-4 py-3 rounded-lg hover:bg-blue-700 cursor-pointer">
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-current text-xs">🔧</span>
                </div>
                <Text className="text-current">Admin Settings</Text>
              </div>
              <div className="flex items-center space-x-3 text-blue-200 hover:text-white px-4 py-3 rounded-lg hover:bg-blue-700 cursor-pointer">
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-current text-xs">📊</span>
                </div>
                <Text className="text-current">Reports</Text>
              </div>
            </nav>
          </div>
          
          {/* User Info at bottom */}
          <div className="absolute bottom-0 left-0 right-0 w-64 p-6 border-t border-blue-500">
            <div className="flex items-center space-x-3">
              <Avatar size="small" className="bg-blue-800">
                <span className="text-white font-medium">JD</span>
              </Avatar>
              <div className="flex-1">
                <Text className="text-white font-medium block">John Doe</Text>
                <Text className="text-blue-200 text-sm">System Admin</Text>
              </div>
            </div>
            <Button 
              type="text" 
              onClick={handleLogout}
              className="w-full mt-4 text-blue-200 hover:text-white hover:bg-blue-700"
              size="small"
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Dashboard Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Title level={2} className="!mb-1 text-gray-900">Dashboard</Title>
                <Text className="text-gray-600">
                  Comprehensive insights into bookings, offers, and business performance
                </Text>
              </div>
              <div className="flex items-center space-x-3">
                <Select 
                  value={timeRange} 
                  onChange={setTimeRange}
                  className="w-40"
                  options={[
                    { value: '12months', label: 'Last 12 months' },
                    { value: '6months', label: 'Last 6 months' },
                    { value: '3months', label: 'Last 3 months' }
                  ]}
                />
                <Button icon={<ReloadOutlined />}>Refresh</Button>
                <Button icon={<DownloadOutlined />}>Export</Button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-8 border-b border-gray-200">
              <div 
                className={`pb-3 cursor-pointer ${activeTab === 'overview' ? 'border-b-2 border-blue-600' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <Text className={`font-medium ${activeTab === 'overview' ? 'text-blue-600' : 'text-gray-500'}`}>
                  📊 Overview
                </Text>
              </div>
              <div 
                className={`pb-3 cursor-pointer ${activeTab === 'bookings' ? 'border-b-2 border-blue-600' : ''}`}
                onClick={() => setActiveTab('bookings')}
              >
                <Text className={`font-medium ${activeTab === 'bookings' ? 'text-blue-600' : 'text-gray-500'}`}>
                  📅 Bookings Analytics
                </Text>
              </div>
              <div 
                className={`pb-3 cursor-pointer ${activeTab === 'offers' ? 'border-b-2 border-blue-600' : ''}`}
                onClick={() => setActiveTab('offers')}
              >
                <Text className={`font-medium ${activeTab === 'offers' ? 'text-blue-600' : 'text-gray-500'}`}>
                  💰 Offers Analytics
                </Text>
              </div>
              <div 
                className={`pb-3 cursor-pointer ${activeTab === 'insights' ? 'border-b-2 border-blue-600' : ''}`}
                onClick={() => setActiveTab('insights')}
              >
                <Text className={`font-medium ${activeTab === 'insights' ? 'text-blue-600' : 'text-gray-500'}`}>
                  📈 Insights & Forecasts
                </Text>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && renderOverviewContent()}
          {activeTab === 'bookings' && renderBookingAnalyticsContent()}
          {activeTab === 'offers' && renderOfferAnalyticsContent()}
          {activeTab === 'insights' && renderInsightsForecastsContent()}
        </div>
      </div>

      <style jsx global>{`
        .stats-card {
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          border: 1px solid #f1f5f9;
          transition: all 0.3s ease;
        }

        .stats-card:hover {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .chart-card {
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          border: 1px solid #f1f5f9;
        }

        .routes-card {
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          border: 1px solid #f1f5f9;
        }

        .ant-table-thead > tr > th {
          background-color: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          font-weight: 600;
          color: #374151;
        }

        .ant-table-tbody > tr > td {
          border-bottom: 1px solid #f1f5f9;
        }

        .ant-table-tbody > tr:hover > td {
          background-color: #f8fafc;
        }

        .ant-progress-bg {
          border-radius: 4px;
        }

        .ant-progress-inner {
          border-radius: 4px;
          background-color: #f1f5f9;
        }
      `}</style>
    </div>
  );
}
