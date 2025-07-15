import { useState, useEffect } from 'react';
import { Card, Row, Col, Input, Button, Typography, Space, Badge } from 'antd';
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
    // Navigate to manage-booking/1 after finding booking
    setLocation('/manage-booking/1');
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
                <Card className="h-full">
                  <div className="mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <Text className="font-bold text-lg text-gray-900">{booking.bookingId}</Text>
                      <Badge 
                        status={getStatusColor(booking.status)} 
                        text={getStatusText(booking.status)}
                        className="font-medium"
                      />
                    </div>
                    <Text className="text-gray-600 block mb-3">{booking.groupType} Trip</Text>
                  </div>

                  <Space direction="vertical" size="small" className="w-full mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <UserOutlined className="text-sm" />
                      <Text className="text-sm">{booking.route}</Text>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <CalendarOutlined className="text-sm" />
                      <Text className="text-sm">
                        {format(new Date(booking.date), 'MMM dd, yyyy')}
                      </Text>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <TeamOutlined className="text-sm" />
                      <Text className="text-sm">{booking.passengers} passengers</Text>
                    </div>
                  </Space>

                  <Button
                    type="default"
                    className="w-full"
                    onClick={() => handleManageBooking(booking)}
                  >
                    Manage Booking
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Placeholder for empty state */}
          {(!bookings || bookings.length === 0) && (
            <div className="text-center py-8">
              <Text className="text-gray-500">Manage bookings list placeholder.</Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}