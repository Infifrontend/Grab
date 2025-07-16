import { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Space, Input, Button, Badge, Spin, message } from 'antd';
import { SearchOutlined, UserOutlined, CalendarOutlined, TeamOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { format } from 'date-fns';
import Header from "@/components/layout/header";
import type { Booking } from '@shared/schema';

const { Title, Text } = Typography;

export default function ManageBooking() {
  const [bookingId, setBookingId] = useState('');
  const [email, setEmail] = useState('');
  const [, setLocation] = useLocation();

  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  const { data: flightBookings, refetch: refetchFlightBookings } = useQuery({
    queryKey: ["/api/flight-bookings"],
  });

  // Refresh data when component mounts
  useEffect(() => {
    refetchFlightBookings();
  }, [refetchFlightBookings]);

  const handleFindBooking = () => {
    console.log('Finding booking:', { bookingId, email });

    if (!bookingId) {
      message.error('Please enter a booking ID.');
      return;
    }

    // Find the booking that matches the entered booking ID
    const foundBooking = bookings?.find(booking => booking.bookingId === bookingId);

    if (foundBooking) {
      // Navigate to the manage booking page for the found booking
      setLocation(`/manage-booking/${foundBooking.id}`);
    } else {
      // Display an error message if the booking is not found
      message.error('Booking not found. Please check your booking ID and email.');
    }
  };

  const handleManageBooking = (booking: Booking) => {
    setLocation(`/manage-booking/${booking.id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <Title level={2} className="!mb-2 text-gray-900">Manage Your Booking</Title>
          <Text className="text-gray-600 text-base">
            Access and modify your existing group bookings, add passengers, or update travel details
          </Text>
        </div>

        {/* Main Content */}
        <Row gutter={[24, 24]}>
          {/* Find Booking Form */}
          <Col xs={24} lg={14}>
            <Card className="mb-6">
              <div className="mb-6">
                <Title level={4} className="!mb-2 text-gray-900">Find Your Booking</Title>
                <Text className="text-gray-600">
                  Enter your booking details to access and manage your reservation
                </Text>
              </div>

              <Space direction="vertical" size="large" className="w-full">
                <div>
                  <Text className="block mb-2 text-gray-700 font-medium">Booking ID</Text>
                  <Input
                    size="large"
                    placeholder="Enter booking ID (e.g., GR-2024-1001)"
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <Text className="block mb-2 text-gray-700 font-medium">Email Address</Text>
                  <Input
                    size="large"
                    placeholder="Enter email used for booking"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full"
                  />
                </div>

                <Button
                  type="primary"
                  size="large"
                  icon={<SearchOutlined />}
                  onClick={handleFindBooking}
                  className="w-full infiniti-btn-primary"
                >
                  Find Booking
                </Button>
              </Space>
            </Card>
          </Col>

          {/* Help Section */}
          <Col xs={24} lg={10}>
            <Card>
              <div className="mb-4">
                <Title level={4} className="!mb-2 text-gray-900">Need Help?</Title>
                <Text className="text-gray-600">
                  Can't find your booking or need assistance? Our support team is here to help.
                </Text>
              </div>

              <Space direction="vertical" size="middle" className="w-full">
                <Button
                  size="large"
                  className="w-full text-left flex items-center justify-start"
                  style={{ height: 'auto', padding: '12px 16px' }}
                >
                  <div>
                    <div className="font-medium text-gray-900">Contact Support</div>
                  </div>
                </Button>

                <Button
                  size="large"
                  className="w-full text-left flex items-center justify-start"
                  style={{ height: 'auto', padding: '12px 16px' }}
                >
                  <div>
                    <div className="font-medium text-gray-900">FAQ</div>
                  </div>
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Recent Bookings */}
        <div className="mt-8">
          <Title level={4} className="!mb-6 text-gray-900">Recent Bookings</Title>

          <Row gutter={[24, 24]}>
            {bookings?.slice(0, 3).map((booking) => (
              <Col xs={24} lg={8} key={booking.id}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <div className="mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <Text className="font-bold text-lg text-[var(--infiniti-primary)]">{booking.bookingId}</Text>
                      <Badge 
                        status={getStatusColor(booking.status)} 
                        text={getStatusText(booking.status)}
                        className="font-medium"
                      />
                    </div>
                    <Text className="text-gray-600 block mb-3 capitalize">{booking.groupType} Trip</Text>
                  </div>

                  <Space direction="vertical" size="small" className="w-full mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <UserOutlined className="text-sm" />
                      <Text className="text-sm font-medium">{booking.route}</Text>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <CalendarOutlined className="text-sm" />
                      <Text className="text-sm">
                        Departure: {booking.date ? format(new Date(booking.date), 'dd MMM yyyy') : 'N/A'}
                      </Text>
                    </div>

                    {booking.returnDate && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <CalendarOutlined className="text-sm" />
                        <Text className="text-sm">
                          Return: {booking.returnDate ? format(new Date(booking.returnDate), 'dd MMM yyyy') : 'N/A'}
                        </Text>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-gray-600">
                      <TeamOutlined className="text-sm" />
                      <Text className="text-sm">{booking.passengers} passengers</Text>
                    </div>

                    {booking.totalAmount && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="text-sm">💰</span>
                        <Text className="text-sm font-semibold text-green-600">
                          ₹{parseFloat(booking.totalAmount).toLocaleString()}
                        </Text>
                      </div>
                    )}
                  </Space>

                  <Button
                    type="primary"
                    className="w-full infiniti-btn-primary"
                    onClick={() => handleManageBooking(booking)}
                  >
                    View Details
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Empty state */}
          {(!bookings || bookings.length === 0) && !isLoading && (
            <Card className="text-center py-12">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <CalendarOutlined className="text-2xl text-gray-400" />
                </div>
                <div>
                  <Title level={4} className="!mb-2 text-gray-600">No Recent Bookings</Title>
                  <Text className="text-gray-500">
                    You haven't made any bookings yet. Start by creating your first group booking.
                  </Text>
                </div>
                <Button 
                  type="primary" 
                  className="infiniti-btn-primary mt-4"
                  onClick={() => setLocation('/new-booking')}
                >
                  Create New Booking
                </Button>
              </div>
            </Card>
          )}

          {/* Loading state */}
          {isLoading && (
            <Row gutter={[24, 24]}>
              {[1, 2, 3].map((i) => (
                <Col xs={24} lg={8} key={i}>
                  <Card className="h-full">
                    <div className="animate-pulse">
                      <div className="h-6 bg-gray-200 rounded mb-4"></div>
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                      <div className="h-10 bg-gray-200 rounded mt-6"></div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </div>
    </div>
  );
}