import { useState } from 'react';
import { Card, Row, Col, Tabs, Button, Typography, Space, Badge, Statistic } from 'antd';
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
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
  
  const { data: bookings } = useQuery<Booking[]>({
    queryKey: ['/api/bookings'],
  });

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <Title level={2} className="!mb-0">Dashboard</Title>
          </div>
          <Space>
            <Button icon={<DownloadOutlined />} className="flex items-center">
              Download
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              className="infiniti-btn-primary flex items-center"
            >
              New Booking
            </Button>
          </Space>
        </div>

        {/* Dashboard Tabs */}
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          items={tabItems}
          className="mb-6"
        />

        {/* Stats Cards */}
        <Row gutter={[24, 24]} className="mb-6">
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-gray-500 text-sm">Total Bookings</Text>
                  <div className="flex items-center gap-2 mt-1">
                    <Text className="text-2xl font-bold">{totalBookings}</Text>
                    <Badge count={`+2 from last month`} className="text-xs text-green-600 bg-green-50" />
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-gray-500 text-sm">Active Bookings</Text>
                  <div className="flex items-center gap-2 mt-1">
                    <Text className="text-2xl font-bold">{activeBookings}</Text>
                    <Badge count={`+1 from last month`} className="text-xs text-green-600 bg-green-50" />
                  </div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-gray-500 text-sm">Total Passengers</Text>
                  <div className="flex items-center gap-2 mt-1">
                    <Text className="text-2xl font-bold">{totalPassengers}</Text>
                    <Badge count={`+24 from last month`} className="text-xs text-green-600 bg-green-50" />
                  </div>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-gray-500 text-sm">Upcoming Trips</Text>
                  <div className="flex items-center gap-2 mt-1">
                    <Text className="text-2xl font-bold">{upcomingTrips}</Text>
                    <Badge count={`+2 from last month`} className="text-xs text-green-600 bg-green-50" />
                  </div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Plane className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Main Content */}
        <Row gutter={[24, 24]}>
          {/* Overview Chart */}
          <Col xs={24} lg={14}>
            <Card>
              <Title level={4} className="!mb-4">Overview</Title>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis 
                      dataKey="month" 
                      axisLine={false}
                      tickLine={false}
                      className="text-xs"
                    />
                    <YAxis hide />
                    <Bar 
                      dataKey="value" 
                      fill="#FF6B47"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>

          {/* Recent Activity */}
          <Col xs={24} lg={10}>
            <Card>
              <Title level={4} className="!mb-2">Recent Activity</Title>
              <Text className="text-gray-500 text-sm mb-4 block">
                Your recent booking activity and updates.
              </Text>
              
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <Text className="font-medium text-sm">{activity.title}</Text>
                          <Text className="text-gray-500 text-xs block mt-1">
                            {activity.description}
                          </Text>
                        </div>
                        <Text className="text-gray-400 text-xs">{activity.time}</Text>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}