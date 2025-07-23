
import { useState } from 'react';
import { Card, Row, Col, Tabs, Button, Typography, Space, Badge, Statistic, Table } from 'antd';
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts';
import { BookOpen, TrendingUp, Users, Plane } from 'lucide-react';
import Header from "@/components/layout/header";
import { apiRequest } from "@/lib/queryClient";

const { Title, Text } = Typography;

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [, setLocation] = useLocation();

  // Fetch booking overview data for charts
  const { data: bookingOverview } = useQuery({
    queryKey: ['booking-overview'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/booking-overview');
      return response.json();
    },
  });

  // Fetch real data from API
  const { data: flightBookings = [] } = useQuery({
    queryKey: ['flight-bookings'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/flight-bookings');
      return response.json();
    },
  });

  const { data: recentBookings = [] } = useQuery({
    queryKey: ['recent-flight-bookings'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/recent-flight-bookings');
      return response.json();
    },
  });

  const { data: payments = [] } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/payments');
      return response.json();
    },
  });

  // Calculate statistics from booking overview API or fallback to direct calculation
  const totalBookings = bookingOverview?.totalBookings || flightBookings.length;
  const activeBookings = bookingOverview?.statusData?.confirmed || flightBookings.filter(b => b.bookingStatus === 'confirmed').length;
  const totalPassengers = bookingOverview?.totalPassengers || flightBookings.reduce((sum, b) => sum + b.passengerCount, 0);
  const upcomingTrips = flightBookings.filter(b => 
    b.bookingStatus === 'confirmed' && 
    b.flight && 
    new Date(b.flight.departureTime) > new Date()
  ).length;

  // Use chart data from API with enhanced information, provide fallback data
  const chartData = bookingOverview?.monthlyData && bookingOverview.monthlyData.length > 0 
    ? bookingOverview.monthlyData 
    : [
        { month: 'Jan', bookings: 0, revenue: 0, passengers: 0 },
        { month: 'Feb', bookings: 0, revenue: 0, passengers: 0 },
        { month: 'Mar', bookings: 0, revenue: 0, passengers: 0 },
        { month: 'Apr', bookings: 0, revenue: 0, passengers: 0 },
        { month: 'May', bookings: 0, revenue: 0, passengers: 0 },
        { month: 'Jun', bookings: 0, revenue: 0, passengers: 0 },
        { month: 'Jul', bookings: 0, revenue: 0, passengers: 0 },
        { month: 'Aug', bookings: 0, revenue: 0, passengers: 0 },
        { month: 'Sep', bookings: 0, revenue: 0, passengers: 0 },
        { month: 'Oct', bookings: 0, revenue: 0, passengers: 0 },
        { month: 'Nov', bookings: 0, revenue: 0, passengers: 0 },
        { month: 'Dec', bookings: 0, revenue: 0, passengers: 0 }
      ];

  // Generate recent activities from real data
  const recentActivities = recentBookings.slice(0, 4).map((booking, index) => ({
    id: booking.id,
    title: 'New booking created',
    description: `Booking #${booking.bookingReference} ${booking.flight ? `for ${booking.flight.origin} to ${booking.flight.destination}` : ''}`,
    time: booking.createdAt ? getRelativeTime(new Date(booking.createdAt)) : 'Recently',
    type: 'booking'
  }));

  function getRelativeTime(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return diffMins <= 1 ? 'Just now' : `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  }

  const handleViewBooking = (bookingId) => {
    setLocation(`/booking-details/${bookingId}`);
  };

  const handleNewBooking = () => {
    setLocation('/new-booking');
  };

  const tabItems = [
    {
      key: 'overview',
      label: 'Overview',
    },
    {
      key: 'bookings',
      label: 'Bookings',
    },
    {
      key: 'payments',
      label: 'Payments',
    },
    {
      key: 'insights',
      label: 'Insights',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'var(--infiniti-success)';
      case 'pending':
        return '#faad14';
      case 'cancelled':
        return '#ff4d4f';
      default:
        return '#d9d9d9';
    }
  };

  // Transform real booking data for table
  const bookingsTableData = flightBookings.map((booking, index) => ({
    key: booking.id,
    bookingId: booking.bookingReference,
    groupType: 'Group Travel', // Default since we don't have this field
    route: booking.flight ? `${booking.flight.origin} to ${booking.flight.destination}` : 'N/A',
    date: booking.flight ? new Date(booking.flight.departureTime).toISOString().split('T')[0] : 'N/A',
    returnDate: booking.flight ? new Date(booking.flight.arrivalTime).toISOString().split('T')[0] : null,
    passengers: booking.passengerCount,
    status: booking.bookingStatus,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Title level={2} className="!mb-1 text-gray-900">Dashboard</Title>
            <Text className="text-gray-600">Manage your group travel bookings and view insights</Text>
          </div>
          <Space size="middle">
            <Button 
              icon={<DownloadOutlined />} 
              className="flex items-center h-10 px-4 border-gray-300 hover:border-gray-400"
            >
              Download Report
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              className="infiniti-btn-primary flex items-center h-10 px-6"
              onClick={handleNewBooking}
            >
              New Booking
            </Button>
          </Space>
        </div>

        {/* Dashboard Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            items={tabItems}
            className="px-6"
            size="large"
          />
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Cards */}
            <Row gutter={[24, 24]} className="mb-8">
              <Col xs={24} sm={12} lg={6}>
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Text className="text-gray-500 text-sm font-medium block mb-2">Total Bookings</Text>
                      <div className="flex items-baseline gap-3">
                        <Text className="text-3xl font-bold text-gray-900">{totalBookings}</Text>
                        <Badge 
                          count="+12%" 
                          className="text-xs bg-green-100 text-green-700 border-green-200"
                        />
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </Card>
              </Col>
              
              <Col xs={24} sm={12} lg={6}>
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Text className="text-gray-500 text-sm font-medium block mb-2">Active Bookings</Text>
                      <div className="flex items-baseline gap-3">
                        <Text className="text-3xl font-bold text-gray-900">{activeBookings}</Text>
                        <Badge 
                          count="+8%" 
                          className="text-xs bg-green-100 text-green-700 border-green-200"
                        />
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </Card>
              </Col>
              
              <Col xs={24} sm={12} lg={6}>
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Text className="text-gray-500 text-sm font-medium block mb-2">Total Passengers</Text>
                      <div className="flex items-baseline gap-3">
                        <Text className="text-3xl font-bold text-gray-900">{totalPassengers}</Text>
                        <Badge 
                          count="+24%" 
                          className="text-xs bg-green-100 text-green-700 border-green-200"
                        />
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </Card>
              </Col>
              
              <Col xs={24} sm={12} lg={6}>
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Text className="text-gray-500 text-sm font-medium block mb-2">Upcoming Trips</Text>
                      <div className="flex items-baseline gap-3">
                        <Text className="text-3xl font-bold text-gray-900">{upcomingTrips}</Text>
                        <Badge 
                          count="+5%" 
                          className="text-xs bg-green-100 text-green-700 border-green-200"
                        />
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                      <Plane className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            <Row gutter={[24, 24]}>
              {/* Overview Chart */}
              <Col xs={24} lg={16}>
                <Card className="border-0 shadow-sm">
                  <div className="mb-6">
                    <Title level={4} className="!mb-1 text-gray-900">Booking Overview</Title>
                    <Text className="text-gray-500">Monthly booking trends and performance</Text>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="month" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#6b7280' }}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#6b7280' }}
                        />
                        <Tooltip 
                          cursor={{ fill: 'rgba(79, 70, 229, 0.1)' }}
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Bar 
                          dataKey="bookings" 
                          fill="#4F46E5"
                          radius={[4, 4, 0, 0]}
                          name="Bookings"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  {bookingOverview && (
                    <div className="mt-4 flex justify-between text-sm text-gray-600">
                      <span>Total Revenue: ${bookingOverview.totalRevenue.toLocaleString()}</span>
                      <span>Avg per Month: {Math.round(totalBookings / 12)} bookings</span>
                    </div>
                  )}
                </Card>
              </Col>

              {/* Recent Activity */}
              <Col xs={24} lg={8}>
                <Card className="border-0 shadow-sm h-full">
                  <div className="mb-6">
                    <Title level={4} className="!mb-1 text-gray-900">Recent Activity</Title>
                    <Text className="text-gray-500">Your latest booking updates</Text>
                  </div>
                  
                  <div className="space-y-4">
                    {recentActivities.length > 0 ? recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="w-2 h-2 bg-[var(--infiniti-primary)] rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <Text className="font-medium text-sm text-gray-900">{activity.title}</Text>
                            <Text className="text-gray-400 text-xs flex-shrink-0">{activity.time}</Text>
                          </div>
                          <Text className="text-gray-600 text-xs">
                            {activity.description}
                          </Text>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-8">
                        <Text className="text-gray-500">No recent activity</Text>
                      </div>
                    )}
                  </div>
                </Card>
              </Col>
            </Row>
          </>
        )}

        {activeTab === 'bookings' && (
          <div>
            {/* Bookings Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <Title level={3} className="!mb-1 text-gray-900">Your Bookings</Title>
                <Text className="text-gray-600">Manage and track all your group bookings</Text>
              </div>
              <Button 
                type="primary" 
                className="infiniti-btn-primary h-10 px-6"
                onClick={handleNewBooking}
              >
                New Booking
              </Button>
            </div>

            {/* Bookings Table */}
            <Card className="border-0 shadow-sm">
              {bookingsTableData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Booking ID
                        </th>
                        <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Group Type
                        </th>
                        <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Route
                        </th>
                        <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Departure
                        </th>
                        <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Return
                        </th>
                        <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Passengers
                        </th>
                        <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {bookingsTableData.map((booking) => (
                        <tr key={booking.key} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-4">
                            <span className="font-semibold text-[var(--infiniti-primary)]">{booking.bookingId}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-gray-700 capitalize">{booking.groupType}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-gray-900 font-medium">{booking.route}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-gray-600">
                              {booking.date !== 'N/A' ? new Date(booking.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              }) : '-'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-gray-600">
                              {booking.returnDate ? new Date(booking.returnDate).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              }) : '-'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-gray-700 font-medium">{booking.passengers}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span 
                              className="px-3 py-1 rounded-full text-xs font-semibold text-white capitalize"
                              style={{ backgroundColor: getStatusColor(booking.status) }}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <Button 
                              type="link" 
                              className="text-[var(--infiniti-primary)] p-0 font-medium hover:underline"
                              onClick={() => handleViewBooking(booking.key)}
                            >
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <Title level={4} className="text-gray-500 !mb-2">No bookings yet</Title>
                  <Text className="text-gray-400 mb-6">Start by creating your first group booking</Text>
                  <Button 
                    type="primary" 
                    className="infiniti-btn-primary"
                    onClick={handleNewBooking}
                  >
                    Create New Booking
                  </Button>
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'payments' && (
          <div>
            {/* Payment History Header */}
            <div className="mb-6">
              <Title level={3} className="!mb-1 text-gray-900">Payment History</Title>
              <Text className="text-gray-600">Track and manage your payment transactions</Text>
            </div>

            {/* Payment History List */}
            <Card className="border-0 shadow-sm">
              {payments.length > 0 ? (
                <div className="space-y-1">
                  {payments.map((payment) => (
                    <div key={payment.id} className="flex justify-between items-center p-6 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          payment.status === 'completed' ? 'bg-green-100' : 
                          payment.status === 'pending' ? 'bg-yellow-100' : 'bg-gray-100'
                        }`}>
                          <span className={`font-semibold ${
                            payment.status === 'completed' ? 'text-green-600' : 
                            payment.status === 'pending' ? 'text-yellow-600' : 'text-gray-600'
                          }`}>
                            {payment.status === 'completed' ? '✓' : 
                             payment.status === 'pending' ? '⏳' : '✗'}
                          </span>
                        </div>
                        <div>
                          <Text className="font-semibold text-gray-900 block">Payment #{payment.id}</Text>
                          <Text className="text-sm text-gray-500">
                            For booking {payment.bookingId ? `#${payment.bookingId}` : 'N/A'} • {payment.status}
                          </Text>
                        </div>
                      </div>
                      <div className="text-right">
                        <Text className="font-bold text-lg text-gray-900">${payment.amount}</Text>
                        <Text className="text-sm text-gray-500 block">
                          {new Date(payment.dueDate).toLocaleDateString()}
                        </Text>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-gray-400 text-xl">💳</span>
                  </div>
                  <Title level={4} className="text-gray-500 !mb-2">No payment history</Title>
                  <Text className="text-gray-400">Your payment transactions will appear here</Text>
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'insights' && (
          <div>
            {/* Travel Insights Header */}
            <div className="mb-6">
              <Title level={3} className="!mb-1 text-gray-900">Travel Insights</Title>
              <Text className="text-gray-600">Data-driven insights to optimize your group travel</Text>
            </div>

            {/* Insights Grid */}
            <Row gutter={[24, 24]} className="mb-8">
              <Col xs={24} lg={12}>
                <Card className="border-0 shadow-sm h-full">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <Text className="font-semibold text-gray-900 text-base">Booking Patterns</Text>
                        <Badge className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">
                          MEDIUM IMPACT
                        </Badge>
                      </div>
                      <Text className="text-gray-600 text-sm leading-relaxed">
                        {totalBookings > 0 ? 
                          `You have ${totalBookings} total bookings with ${totalPassengers} passengers. Consider booking early for better rates.` :
                          'Start creating bookings to see your patterns and get personalized insights.'
                        }
                      </Text>
                    </div>
                  </div>
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card className="border-0 shadow-sm h-full">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                      <span className="text-green-600 text-xl font-bold">$</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <Text className="font-semibold text-gray-900 text-base">Payment Insights</Text>
                        <Badge className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                          HIGH IMPACT
                        </Badge>
                      </div>
                      <Text className="text-gray-600 text-sm leading-relaxed">
                        {activeBookings > 0 ? 
                          `You have ${activeBookings} confirmed bookings. Early payments typically save 12% on average.` :
                          'Track your payment patterns here once you start making bookings.'
                        }
                      </Text>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Recommendations Section */}
            <Card className="border-0 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <Title level={4} className="!mb-0 text-gray-900">Smart Recommendations</Title>
                  <Text className="text-gray-500 text-sm">Personalized suggestions based on your booking patterns</Text>
                </div>
              </div>
              
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                  <div className="border border-gray-100 rounded-lg p-6 hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <Text className="font-semibold text-gray-900 text-base">Optimize Booking Timing</Text>
                      <Badge className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                        HIGH PRIORITY
                      </Badge>
                    </div>
                    <Text className="text-gray-600 text-sm mb-4 leading-relaxed">
                      Book your next group trip 60 days in advance to save an estimated $450 per booking.
                    </Text>
                    <div className="flex justify-between items-center">
                      <Text className="text-sm text-green-600 font-semibold">Potential savings: $450</Text>
                      <Button type="link" className="text-[var(--infiniti-primary)] p-0 text-sm font-medium">
                        Learn More →
                      </Button>
                    </div>
                  </div>
                </Col>
                
                <Col xs={24} lg={12}>
                  <div className="border border-gray-100 rounded-lg p-6 hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <Text className="font-semibold text-gray-900 text-base">Group Travel Packages</Text>
                      <Badge className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">
                        AVAILABLE NOW
                      </Badge>
                    </div>
                    <Text className="text-gray-600 text-sm mb-4 leading-relaxed">
                      Explore our group packages that offer up to 15% savings for groups of 10 or more passengers.
                    </Text>
                    <div className="flex justify-between items-center">
                      <Text className="text-sm text-green-600 font-semibold">Potential savings: 15%</Text>
                      <Button type="link" className="text-[var(--infiniti-primary)] p-0 text-sm font-medium">
                        View Packages →
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
