
import { useState } from 'react';
import { Card, Row, Col, Tabs, Button, Typography, Space, Badge, Statistic, Table } from 'antd';
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { BookOpen, TrendingUp, Users, Plane } from 'lucide-react';
import Header from "@/components/layout/header";
import type { Booking } from '@shared/schema';

const { Title, Text } = Typography;

const chartData = [
  { month: 'Jan', value: 45 },
  { month: 'Feb', value: 65 },
  { month: 'Mar', value: 35 },
  { month: 'Apr', value: 55 },
  { month: 'May', value: 40 },
  { month: 'Jun', value: 75 },
  { month: 'Jul', value: 60 },
  { month: 'Aug', value: 85 },
  { month: 'Sep', value: 50 },
  { month: 'Oct', value: 45 },
  { month: 'Nov', value: 60 },
  { month: 'Dec', value: 55 },
];

const recentActivities = [
  {
    id: 1,
    title: 'New booking created',
    description: 'Booking #GR-2024-1005 for Chicago to Paris',
    time: 'Just now',
    type: 'booking'
  },
  {
    id: 2,
    title: 'Passenger added',
    description: 'Added 3 passengers to booking #GR-2024-1001',
    time: '2h ago',
    type: 'passenger'
  },
  {
    id: 3,
    title: 'Payment received',
    description: '$4,250.00 for booking #GR-2024-0987',
    time: '5h ago',
    type: 'payment'
  },
  {
    id: 4,
    title: 'Booking confirmed',
    description: 'Booking #GR-2024-0965 has been confirmed',
    time: '1d ago',
    type: 'confirmation'
  }
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [, setLocation] = useLocation();
  
  const { data: bookings } = useQuery<Booking[]>({
    queryKey: ['/api/bookings'],
  });

  const handleViewBooking = (bookingId: string) => {
    const id = bookingId === 'GR-2024-1001' ? '1' : 
               bookingId === 'GR-2024-1002' ? '2' : 
               bookingId === 'GR-2024-1003' ? '3' : '1';
    setLocation(`/booking-details/${id}`);
  };

  const handleNewBooking = () => {
    setLocation('/new-booking');
  };

  const totalBookings = bookings?.length || 0;
  const activeBookings = bookings?.filter(b => b.status === 'confirmed').length || 0;
  const totalPassengers = bookings?.reduce((sum, b) => sum + b.passengers, 0) || 0;
  const upcomingTrips = bookings?.filter(b => new Date(b.date) > new Date()).length || 0;

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

  const getStatusColor = (status: string) => {
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

  const mockBookingsData = [
    {
      key: 1,
      bookingId: 'GR-2024-1001',
      groupType: 'Corporate',
      route: 'New York to London',
      date: '2024-06-15',
      returnDate: '2024-06-22',
      passengers: 32,
      status: 'confirmed',
    },
    {
      key: 2,
      bookingId: 'GR-2024-1002',
      groupType: 'Leisure',
      route: 'Los Angeles to Tokyo',
      date: '2024-07-01',
      returnDate: '2024-07-10',
      passengers: 15,
      status: 'pending',
    },
    {
      key: 3,
      bookingId: 'GR-2024-1003',
      groupType: 'Educational',
      route: 'Chicago to Rome',
      date: '2024-08-10',
      returnDate: '2024-08-20',
      passengers: 45,
      status: 'confirmed',
    },
  ];

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
                      <BarChart data={chartData}>
                        <XAxis 
                          dataKey="month" 
                          axisLine={false}
                          tickLine={false}
                          className="text-xs text-gray-500"
                        />
                        <YAxis hide />
                        <Bar 
                          dataKey="value" 
                          fill="var(--infiniti-primary)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
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
                    {recentActivities.map((activity) => (
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
                    ))}
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
                    {mockBookingsData.map((booking) => (
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
                            {new Date(booking.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
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
                            onClick={() => handleViewBooking(booking.bookingId)}
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
              <div className="space-y-1">
                <div className="flex justify-between items-center p-6 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 font-semibold">✓</span>
                    </div>
                    <div>
                      <Text className="font-semibold text-gray-900 block">Payment PAY-2024-1001</Text>
                      <Text className="text-sm text-gray-500">For booking GR-2024-1001 • Completed</Text>
                    </div>
                  </div>
                  <div className="text-right">
                    <Text className="font-bold text-lg text-gray-900">$5,280.00</Text>
                    <Text className="text-sm text-gray-500 block">May 15, 2024</Text>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-6 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">⏳</span>
                    </div>
                    <div>
                      <Text className="font-semibold text-gray-900 block">Payment PAY-2024-1002</Text>
                      <Text className="text-sm text-gray-500">For booking GR-2024-1002 • Processing</Text>
                    </div>
                  </div>
                  <div className="text-right">
                    <Text className="font-bold text-lg text-gray-900">$3,750.00</Text>
                    <Text className="text-sm text-gray-500 block">Jun 01, 2024</Text>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 font-semibold">✓</span>
                    </div>
                    <div>
                      <Text className="font-semibold text-gray-900 block">Payment PAY-2024-1003</Text>
                      <Text className="text-sm text-gray-500">For booking GR-2024-1003 • Completed</Text>
                    </div>
                  </div>
                  <div className="text-right">
                    <Text className="font-bold text-lg text-gray-900">$11,250.00</Text>
                    <Text className="text-sm text-gray-500 block">Jul 10, 2024</Text>
                  </div>
                </div>
              </div>
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
                        Your group bookings increase by 40% during June-August. Consider booking early for better rates.
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
                        Early payments (45+ days before travel) save an average of 12% on total booking costs.
                      </Text>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Top Routes Section */}
            <Card className="border-0 shadow-sm mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Plane className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <Title level={4} className="!mb-0 text-gray-900">Top Routes</Title>
                  <Text className="text-gray-500 text-sm">Your most frequently booked destinations</Text>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Route</th>
                      <th className="text-center py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Bookings</th>
                      <th className="text-center py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Avg Cost</th>
                      <th className="text-center py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Savings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 text-gray-900 font-medium">New York → London</td>
                      <td className="py-4 text-center text-gray-600">4</td>
                      <td className="py-4 text-center text-gray-600">$1,250</td>
                      <td className="py-4 text-center text-green-600 font-semibold">$320</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 text-gray-900 font-medium">Los Angeles → Las Vegas</td>
                      <td className="py-4 text-center text-gray-600">3</td>
                      <td className="py-4 text-center text-gray-600">$450</td>
                      <td className="py-4 text-center text-green-600 font-semibold">$120</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 text-gray-900 font-medium">Chicago → Paris</td>
                      <td className="py-4 text-center text-gray-600">2</td>
                      <td className="py-4 text-center text-gray-600">$1,180</td>
                      <td className="py-4 text-center text-green-600 font-semibold">$240</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

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
                      <Text className="font-semibold text-gray-900 text-base">Las Vegas Package Deal</Text>
                      <Badge className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">
                        AVAILABLE NOW
                      </Badge>
                    </div>
                    <Text className="text-gray-600 text-sm mb-4 leading-relaxed">
                      Based on your searches, our Las Vegas weekend package offers 15% savings for groups of 10+.
                    </Text>
                    <div className="flex justify-between items-center">
                      <Text className="text-sm text-green-600 font-semibold">Potential savings: $200</Text>
                      <Button type="link" className="text-[var(--infiniti-primary)] p-0 text-sm font-medium">
                        View Package →
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
