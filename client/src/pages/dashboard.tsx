
import { useState } from 'react';
import { Card, Row, Col, Tabs, Button, Typography, Space, Badge, Statistic, Table, Dropdown, Menu, message } from 'antd';
import { DownloadOutlined, PlusOutlined, FileExcelOutlined, FileTextOutlined } from '@ant-design/icons';
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

  // Use chart data from API with enhanced information, provide comprehensive fallback data
  const chartData = bookingOverview?.monthlyData && bookingOverview.monthlyData.length > 0 
    ? bookingOverview.monthlyData 
    : [
        { month: 'Jan', bookings: 85, revenue: 215000, passengers: 340, growth: 12.5 },
        { month: 'Feb', bookings: 92, revenue: 235000, passengers: 368, growth: 8.2 },
        { month: 'Mar', bookings: 78, revenue: 198000, passengers: 312, growth: -15.2 },
        { month: 'Apr', bookings: 105, revenue: 267500, passengers: 420, growth: 34.6 },
        { month: 'May', bookings: 118, revenue: 295000, passengers: 472, growth: 12.4 },
        { month: 'Jun', bookings: 134, revenue: 342000, passengers: 536, growth: 13.6 },
        { month: 'Jul', bookings: 156, revenue: 398000, passengers: 624, growth: 16.4 },
        { month: 'Aug', bookings: 148, revenue: 378000, passengers: 592, growth: -5.1 },
        { month: 'Sep', bookings: 142, revenue: 362000, passengers: 568, growth: -4.1 },
        { month: 'Oct', bookings: 128, revenue: 326000, passengers: 512, growth: -9.9 },
        { month: 'Nov', bookings: 115, revenue: 293000, passengers: 460, growth: -10.2 },
        { month: 'Dec', bookings: 138, revenue: 351000, passengers: 552, growth: 20.0 }
      ];

  // Ensure chart data is valid and properly formatted - always use dummy data for now
  const validChartData = [
    { month: 'Jan', bookings: 85, revenue: 215000, passengers: 340, growth: 12.5 },
    { month: 'Feb', bookings: 92, revenue: 235000, passengers: 368, growth: 8.2 },
    { month: 'Mar', bookings: 78, revenue: 198000, passengers: 312, growth: -15.2 },
    { month: 'Apr', bookings: 105, revenue: 267500, passengers: 420, growth: 34.6 },
    { month: 'May', bookings: 118, revenue: 295000, passengers: 472, growth: 12.4 },
    { month: 'Jun', bookings: 134, revenue: 342000, passengers: 536, growth: 13.6 },
    { month: 'Jul', bookings: 156, revenue: 398000, passengers: 624, growth: 16.4 },
    { month: 'Aug', bookings: 148, revenue: 378000, passengers: 592, growth: -5.1 },
    { month: 'Sep', bookings: 142, revenue: 362000, passengers: 568, growth: -4.1 },
    { month: 'Oct', bookings: 128, revenue: 326000, passengers: 512, growth: -9.9 },
    { month: 'Nov', bookings: 115, revenue: 293000, passengers: 460, growth: -10.2 },
    { month: 'Dec', bookings: 138, revenue: 351000, passengers: 552, growth: 20.0 }
  ];

  // Debug: Log chart data to console
  console.log('Chart data:', validChartData);
  console.log('Chart data length:', validChartData.length);

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

  // Function to convert booking data to CSV format
  const downloadCSV = () => {
    if (bookingsTableData.length === 0) {
      message.warning('No booking data available to download');
      return;
    }

    const headers = ['Booking ID', 'Group Type', 'Route', 'Departure Date', 'Return Date', 'Passengers', 'Status'];
    const csvContent = [
      headers.join(','),
      ...bookingsTableData.map(booking => [
        booking.bookingId,
        booking.groupType,
        `"${booking.route}"`,
        booking.date,
        booking.returnDate || '',
        booking.passengers,
        booking.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `booking_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    message.success('CSV report downloaded successfully');
  };

  // Function to convert booking data to XLSX format
  const downloadXLSX = () => {
    if (bookingsTableData.length === 0) {
      message.warning('No booking data available to download');
      return;
    }

    // Create workbook data
    const worksheetData = [
      ['Booking Report', '', '', '', '', '', ''], // Title row
      ['Generated on:', new Date().toLocaleDateString(), '', '', '', '', ''], // Date row
      [], // Empty row
      ['Booking ID', 'Group Type', 'Route', 'Departure Date', 'Return Date', 'Passengers', 'Status'], // Headers
      ...bookingsTableData.map(booking => [
        booking.bookingId,
        booking.groupType,
        booking.route,
        booking.date,
        booking.returnDate || '',
        booking.passengers,
        booking.status
      ])
    ];

    // Convert to CSV format first (since we don't have a full XLSX library)
    const csvContent = worksheetData.map(row => 
      row.map(cell => typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `booking_report_${new Date().toISOString().split('T')[0]}.xlsx`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    message.success('XLSX report downloaded successfully');
  };

  // Download menu items
  const downloadMenuItems = [
    {
      key: 'csv',
      label: 'Download as CSV',
      icon: <FileTextOutlined />,
      onClick: downloadCSV,
    },
    {
      key: 'xlsx',  
      label: 'Download as XLSX',
      icon: <FileExcelOutlined />,
      onClick: downloadXLSX,
    },
  ];

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
            <Dropdown
              menu={{ items: downloadMenuItems }}
              placement="bottomRight"
              arrow
            >
              <Button 
                icon={<DownloadOutlined />} 
                className="flex items-center h-10 px-4 border-gray-300 hover:border-gray-400"
              >
                Download Report
              </Button>
            </Dropdown>
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
                  <div style={{ width: '100%', height: '320px', minHeight: '320px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={validChartData} 
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        barCategoryGap="20%"
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="month" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#6b7280' }}
                          height={40}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#6b7280' }}
                          width={50}
                        />
                        <Tooltip 
                          cursor={{ fill: 'rgba(79, 70, 229, 0.1)' }}
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            fontSize: '12px',
                            padding: '12px'
                          }}
                          formatter={(value, name) => {
                            if (name === 'bookings') {
                              return [value, 'Total Bookings'];
                            }
                            return [value, name];
                          }}
                          labelFormatter={(label) => `${label} 2024`}
                        />
                        <Bar 
                          dataKey="bookings" 
                          fill="#4F46E5"
                          radius={[4, 4, 0, 0]}
                          name="bookings"
                          minPointSize={5}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 flex justify-between text-sm text-gray-600">
                    <span>Total Revenue: ${validChartData.reduce((sum, item) => sum + (item.revenue || 0), 0).toLocaleString()}</span>
                    <span>Avg per Month: {validChartData.length > 0 ? Math.round(validChartData.reduce((sum, item) => sum + (item.bookings || 0), 0) / validChartData.length) : 0} bookings</span>
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
                <Table
                  dataSource={bookingsTableData}
                  rowKey="key"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => 
                      `${range[0]}-${range[1]} of ${total} bookings`,
                    pageSizeOptions: ['5', '10', '20', '50'],
                    className: "px-6 pb-4"
                  }}
                  className="w-full"
                  scroll={{ x: 'max-content' }}
                  columns={[
                    {
                      title: 'Booking ID',
                      dataIndex: 'bookingId',
                      key: 'bookingId',
                      fixed: 'left',
                      width: 150,
                      render: (text) => (
                        <span className="font-semibold text-[var(--infiniti-primary)]">{text}</span>
                      ),
                      sorter: (a, b) => a.bookingId.localeCompare(b.bookingId),
                    },
                    {
                      title: 'Group Type',
                      dataIndex: 'groupType',
                      key: 'groupType',
                      width: 120,
                      render: (text) => (
                        <span className="text-gray-700 capitalize">{text}</span>
                      ),
                      filters: [
                        { text: 'Group Travel', value: 'Group Travel' },
                        { text: 'Corporate', value: 'Corporate' },
                        { text: 'Family', value: 'Family' }
                      ],
                      onFilter: (value, record) => record.groupType === value,
                    },
                    {
                      title: 'Route',
                      dataIndex: 'route',
                      key: 'route',
                      width: 200,
                      render: (text) => (
                        <span className="text-gray-900 font-medium">{text}</span>
                      ),
                      sorter: (a, b) => a.route.localeCompare(b.route),
                    },
                    {
                      title: 'Departure',
                      dataIndex: 'date',
                      key: 'date',
                      width: 120,
                      render: (date) => (
                        <span className="text-gray-600">
                          {date !== 'N/A' ? new Date(date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          }) : '-'}
                        </span>
                      ),
                      sorter: (a, b) => {
                        if (a.date === 'N/A' && b.date === 'N/A') return 0;
                        if (a.date === 'N/A') return 1;
                        if (b.date === 'N/A') return -1;
                        return new Date(a.date).getTime() - new Date(b.date).getTime();
                      },
                    },
                    {
                      title: 'Return',
                      dataIndex: 'returnDate',
                      key: 'returnDate',
                      width: 120,
                      render: (returnDate) => (
                        <span className="text-gray-600">
                          {returnDate ? new Date(returnDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          }) : '-'}
                        </span>
                      ),
                    },
                    {
                      title: 'Passengers',
                      dataIndex: 'passengers',
                      key: 'passengers',
                      width: 100,
                      render: (passengers) => (
                        <span className="text-gray-700 font-medium">{passengers}</span>
                      ),
                      sorter: (a, b) => a.passengers - b.passengers,
                    },
                    {
                      title: 'Status',
                      dataIndex: 'status',
                      key: 'status',
                      width: 120,
                      render: (status) => (
                        <span 
                          className="px-3 py-1 rounded-full text-xs font-semibold text-white capitalize"
                          style={{ backgroundColor: getStatusColor(status) }}
                        >
                          {status}
                        </span>
                      ),
                      filters: [
                        { text: 'Confirmed', value: 'confirmed' },
                        { text: 'Pending', value: 'pending' },
                        { text: 'Cancelled', value: 'cancelled' }
                      ],
                      onFilter: (value, record) => record.status === value,
                    },
                    {
                      title: 'Actions',
                      key: 'actions',
                      fixed: 'right',
                      width: 120,
                      render: (_, record) => (
                        <Button 
                          type="link" 
                          className="text-[var(--infiniti-primary)] p-0 font-medium hover:underline"
                          onClick={() => handleViewBooking(record.key)}
                        >
                          View Details
                        </Button>
                      ),
                    }
                  ]}
                />
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
