
import { useState } from 'react';
import { Card, Button, Typography, Space, Badge, Tabs, Row, Col } from 'antd';
import { DownloadOutlined, EditOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useRoute, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Header from "@/components/layout/header";
import type { Booking } from '@shared/schema';

const { Title, Text } = Typography;

export default function BookingDetails() {
  const [, params] = useRoute('/booking-details/:id');
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: bookings } = useQuery<Booking[]>({
    queryKey: ['/api/bookings'],
  });

  // Find the booking by ID or use mock data
  const booking = bookings?.find(b => b.id.toString() === params?.id) || {
    id: 1,
    bookingId: 'GR-2024-1001',
    userId: 1,
    groupType: 'Corporate',
    route: 'New York to London',
    date: '2024-06-15',
    returnDate: '2024-06-22',
    passengers: 32,
    status: 'confirmed'
  };

  const tabItems = [
    {
      key: 'overview',
      label: 'Overview',
    },
    {
      key: 'passengers',
      label: 'Passengers',
    },
    {
      key: 'payments',
      label: 'Payments',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Page Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => setLocation('/dashboard')}
              className="flex items-center"
            >
              Back
            </Button>
            <div>
              <Title level={2} className="!mb-1">Booking Details</Title>
              <Text className="text-gray-600">Booking ID: {booking.bookingId}</Text>
            </div>
          </div>
          <Space>
            <Button 
              icon={<DownloadOutlined />} 
              className="flex items-center"
            >
              Download Itinerary
            </Button>
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              className="infiniti-btn-primary flex items-center"
            >
              Manage Booking
            </Button>
          </Space>
        </div>

        {/* Tabs */}
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          items={tabItems}
          className="mb-6"
        />

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Outbound Flight */}
            <Card>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <polyline points="3.27,6.96 12,12.01 20.73,6.96" />
                      <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                  </div>
                  <Title level={4} className="!mb-0">Outbound Flight</Title>
                </div>
                <Badge status="success" text="Confirmed" className="font-medium" />
              </div>

              <Row gutter={[24, 16]}>
                <Col xs={24} sm={6}>
                  <div>
                    <Text className="text-gray-500 text-sm block mb-1">Airline</Text>
                    <Text className="text-gray-900 font-medium">✈ British Airways</Text>
                    <Text className="text-gray-600 text-sm block">Duration: 7h 45m</Text>
                  </div>
                </Col>
                <Col xs={24} sm={6}>
                  <div>
                    <Text className="text-gray-500 text-sm block mb-1">Flight</Text>
                    <Text className="text-gray-900 font-medium">BA 178</Text>
                    <Text className="text-gray-600 text-sm block">Aircraft: Boeing 777-300ER</Text>
                  </div>
                </Col>
                <Col xs={24} sm={6}>
                  <div>
                    <Text className="text-gray-500 text-sm block mb-1">Departure</Text>
                    <Text className="text-gray-900 font-medium">Jun 15, 2024 10:30 AM</Text>
                    <Text className="text-gray-600 text-sm block">New York (JFK)</Text>
                    <Text className="text-gray-600 text-sm block">Class: Economy</Text>
                  </div>
                </Col>
                <Col xs={24} sm={6}>
                  <div>
                    <Text className="text-gray-500 text-sm block mb-1">Arrival</Text>
                    <Text className="text-gray-900 font-medium">Jun 15, 2024 10:15 PM</Text>
                    <Text className="text-gray-600 text-sm block">London (LHR)</Text>
                    <Text className="text-gray-600 text-sm block">Meal: Standard</Text>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Return Flight */}
            <Card>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <polyline points="3.27,6.96 12,12.01 20.73,6.96" />
                      <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                  </div>
                  <Title level={4} className="!mb-0">Return Flight</Title>
                </div>
                <Badge status="success" text="Confirmed" className="font-medium" />
              </div>

              <Row gutter={[24, 16]}>
                <Col xs={24} sm={6}>
                  <div>
                    <Text className="text-gray-500 text-sm block mb-1">Airline</Text>
                    <Text className="text-gray-900 font-medium">✈ British Airways</Text>
                    <Text className="text-gray-600 text-sm block">Duration: 7h 45m</Text>
                  </div>
                </Col>
                <Col xs={24} sm={6}>
                  <div>
                    <Text className="text-gray-500 text-sm block mb-1">Flight</Text>
                    <Text className="text-gray-900 font-medium">BA 179</Text>
                    <Text className="text-gray-600 text-sm block">Aircraft: Boeing 777-300ER</Text>
                  </div>
                </Col>
                <Col xs={24} sm={6}>
                  <div>
                    <Text className="text-gray-500 text-sm block mb-1">Departure</Text>
                    <Text className="text-gray-900 font-medium">Jun 22, 2024 12:45 PM</Text>
                    <Text className="text-gray-600 text-sm block">London (LHR)</Text>
                    <Text className="text-gray-600 text-sm block">Class: Economy</Text>
                  </div>
                </Col>
                <Col xs={24} sm={6}>
                  <div>
                    <Text className="text-gray-500 text-sm block mb-1">Arrival</Text>
                    <Text className="text-gray-900 font-medium">Jun 22, 2024 4:30 PM</Text>
                    <Text className="text-gray-600 text-sm block">New York (JFK)</Text>
                    <Text className="text-gray-600 text-sm block">Meal: Standard</Text>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Additional Information */}
            <Card>
              <Title level={4} className="!mb-6">Additional Information</Title>
              
              <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                  <div className="space-y-4">
                    <div>
                      <Text className="text-gray-500 text-sm block mb-1">Baggage Allowance</Text>
                      <Text className="text-gray-900">1 checked bag (23kg) per passenger</Text>
                    </div>
                    <div>
                      <Text className="text-gray-500 text-sm block mb-1">Special Requests</Text>
                      <Text className="text-gray-900">Group seating, vegetarian meals for 5 passengers</Text>
                    </div>
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div className="space-y-4">
                    <div>
                      <Text className="text-gray-500 text-sm block mb-1">Check-in</Text>
                      <Text className="text-gray-900">Online check-in available 24 hours before departure</Text>
                    </div>
                    <div>
                      <Text className="text-gray-500 text-sm block mb-1">Booking Reference</Text>
                      <Text className="text-gray-900">BA123456</Text>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </div>
        )}

        {activeTab === 'passengers' && (
          <Card>
            <Title level={4} className="!mb-4">Passenger Information</Title>
            <Text className="text-gray-500 block mb-6">Manage passenger details and seat assignments</Text>
            
            <div className="space-y-4">
              {Array.from({ length: booking.passengers || 3 }, (_, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <Text className="font-semibold text-gray-900 block">Passenger {index + 1}</Text>
                      <Text className="text-gray-600 text-sm">Adult</Text>
                    </div>
                    <Button type="link" className="text-blue-600 p-0">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'payments' && (
          <Card>
            <Title level={4} className="!mb-4">Payment Information</Title>
            <Text className="text-gray-500 block mb-6">View payment history and outstanding balances</Text>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <Text className="font-semibold text-gray-900 block">Total Amount</Text>
                    <Text className="text-gray-600 text-sm">For {booking.passengers || 32} passengers</Text>
                  </div>
                  <Text className="text-2xl font-bold text-gray-900">$5,280.00</Text>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <Text className="font-semibold text-gray-900 block">Amount Paid</Text>
                    <Text className="text-green-600 text-sm">Payment completed</Text>
                  </div>
                  <Text className="text-xl font-semibold text-green-600">$5,280.00</Text>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
