import { useState } from "react";
import { Card, Button, Typography, Space, Badge, Tabs, Row, Col } from "antd";
import {
  DownloadOutlined,
  EditOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import type { Booking } from "@shared/schema";
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export default function BookingDetails() {
  const [, params] = useRoute("/booking-details/:id");
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: bookings } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  const { data: flightBookings } = useQuery({
    queryKey: ["/api/flight-bookings"],
  });

  const handleManageBooking = () => {
    setLocation(`/manage-booking/${params?.id || booking.id}`);
  };

  // Find the booking by ID from legacy bookings or flight bookings
  let booking = bookings?.find((b) => b.id.toString() === params?.id || b.bookingId === params?.id);
  let flightBooking = null;
  
  // If not found in legacy bookings, check flight bookings by reference
  if (!booking && flightBookings) {
    flightBooking = flightBookings.find((fb: any) => fb.bookingReference === params?.id);
    if (flightBooking) {
      // Convert flight booking to legacy booking format for display
      booking = {
        id: flightBooking.id,
        bookingId: flightBooking.bookingReference,
        userId: flightBooking.userId,
        route: `${flightBooking.bookingData?.origin || 'Origin'} to ${flightBooking.bookingData?.destination || 'Destination'}`,
        date: flightBooking.bookedAt,
        passengers: flightBooking.passengerCount,
        status: flightBooking.bookingStatus,
        groupType: flightBooking.groupLeaderData?.groupType || 'Group',
        returnDate: flightBooking.bookingData?.returnDate || null,
      };
    }
  }
  
  // Fallback to mock data if nothing found
  if (!booking) {
    booking = {
      id: 1,
      bookingId: "GR-2024-1001",
      userId: 1,
      groupType: "Corporate",
      route: "New York to London",
      date: "2024-06-15",
      returnDate: "2024-06-22",
      passengers: 32,
      status: "confirmed",
    };
  }

  const tabItems = [
    {
      key: "overview",
      label: "Overview",
    },
    {
      key: "passengers",
      label: "Passengers",
    },
    {
      key: "payments",
      label: "Payments",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Page Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div>
              <Title level={2} className="!mb-1">
                Booking Details
              </Title>
              <Text className="text-gray-600">
                Booking ID: {booking.bookingId}
              </Text>
            </div>
          </div>
          <Space>
            <Button 
              icon={<DownloadOutlined />} 
              className="flex items-center"
              onClick={() => setLocation(`/download-itinerary/${params?.id || booking.id}`)}
            >
              Download Itinerary
            </Button>
            <Button
              type="primary"
              icon={<EditOutlined />}
              className="infiniti-btn-primary flex items-center"
              onClick={handleManageBooking}
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
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Outbound Flight */}
            <Card>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <polyline points="3.27,6.96 12,12.01 20.73,6.96" />
                      <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                  </div>
                  <Title level={4} className="!mb-0">
                    Outbound Flight
                  </Title>
                </div>
                <Badge
                  status="success"
                  text="Confirmed"
                  className="font-medium"
                />
              </div>

              <Row gutter={[24, 16]}>
                <Col xs={24} sm={6}>
                  <div>
                    <Text className="text-gray-500 text-sm block mb-1">
                      Airline
                    </Text>
                    <Text className="text-gray-900 font-medium">
                      ✈ {flightBooking?.flightData?.airline || 'British Airways'}
                    </Text>
                    <Text className="text-gray-600 text-sm block">
                      Duration: {flightBooking?.flightData?.duration || '7h 45m'}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} sm={6}>
                  <div>
                    <Text className="text-gray-500 text-sm block mb-1">
                      Flight
                    </Text>
                    <Text className="text-gray-900 font-medium">
                      {flightBooking?.flightData?.flightNumber || 'BA 178'}
                    </Text>
                    <Text className="text-gray-600 text-sm block">
                      Aircraft: {flightBooking?.flightData?.aircraft || 'Boeing 777-300ER'}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} sm={6}>
                  <div>
                    <Text className="text-gray-500 text-sm block mb-1">
                      Departure
                    </Text>
                    <Text className="text-gray-900 font-medium">
                      {flightBooking?.flightData?.departureTime 
                        ? dayjs(flightBooking.flightData.departureTime).format('DD MMM YYYY h:mm A')
                        : flightBooking?.bookingData?.departureDate
                        ? dayjs(flightBooking.bookingData.departureDate).format('DD MMM YYYY')
                        : 'Jun 15, 2024 10:30 AM'}
                    </Text>
                    <Text className="text-gray-600 text-sm block">
                      {flightBooking?.flightData?.origin || flightBooking?.bookingData?.origin || 'New York (JFK)'}
                    </Text>
                    <Text className="text-gray-600 text-sm block">
                      Class: {flightBooking?.bookingData?.cabin || 'Economy'}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} sm={6}>
                  <div>
                    <Text className="text-gray-500 text-sm block mb-1">
                      Arrival
                    </Text>
                    <Text className="text-gray-900 font-medium">
                      {flightBooking?.flightData?.arrivalTime 
                        ? dayjs(flightBooking.flightData.arrivalTime).format('DD MMM YYYY h:mm A')
                        : 'Jun 15, 2024 10:15 PM'}
                    </Text>
                    <Text className="text-gray-600 text-sm block">
                      {flightBooking?.flightData?.destination || flightBooking?.bookingData?.destination || 'London (LHR)'}
                    </Text>
                    <Text className="text-gray-600 text-sm block">
                      Meal: Standard
                    </Text>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Return Flight - Only show if it's a round trip */}
            {flightBooking?.bookingData?.tripType === 'roundTrip' && flightBooking?.bookingData?.returnDate && (
              <Card>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <polyline points="3.27,6.96 12,12.01 20.73,6.96" />
                        <line x1="12" y1="22.08" x2="12" y2="12" />
                      </svg>
                    </div>
                    <Title level={4} className="!mb-0">
                      Return Flight
                    </Title>
                  </div>
                  <Badge
                    status="success"
                    text="Confirmed"
                    className="font-medium"
                  />
                </div>

                <Row gutter={[24, 16]}>
                  <Col xs={24} sm={6}>
                    <div>
                      <Text className="text-gray-500 text-sm block mb-1">
                        Airline
                      </Text>
                      <Text className="text-gray-900 font-medium">
                        ✈ {flightBooking?.flightData?.airline || 'British Airways'}
                      </Text>
                      <Text className="text-gray-600 text-sm block">
                        Duration: {flightBooking?.flightData?.duration || '7h 45m'}
                      </Text>
                    </div>
                  </Col>
                  <Col xs={24} sm={6}>
                    <div>
                      <Text className="text-gray-500 text-sm block mb-1">
                        Flight
                      </Text>
                      <Text className="text-gray-900 font-medium">
                        {flightBooking?.flightData?.flightNumber || 'BA 179'}
                      </Text>
                      <Text className="text-gray-600 text-sm block">
                        Aircraft: {flightBooking?.flightData?.aircraft || 'Boeing 777-300ER'}
                      </Text>
                    </div>
                  </Col>
                  <Col xs={24} sm={6}>
                    <div>
                      <Text className="text-gray-500 text-sm block mb-1">
                        Departure
                      </Text>
                      <Text className="text-gray-900 font-medium">
                        {flightBooking?.bookingData?.returnDate 
                          ? dayjs(flightBooking.bookingData.returnDate).format('DD MMM YYYY')
                          : 'Jun 22, 2024 12:45 PM'}
                      </Text>
                      <Text className="text-gray-600 text-sm block">
                        {flightBooking?.bookingData?.destination || 'London (LHR)'}
                      </Text>
                      <Text className="text-gray-600 text-sm block">
                        Class: {flightBooking?.bookingData?.cabin || 'Economy'}
                      </Text>
                    </div>
                  </Col>
                  <Col xs={24} sm={6}>
                    <div>
                      <Text className="text-gray-500 text-sm block mb-1">
                        Arrival
                      </Text>
                      <Text className="text-gray-900 font-medium">
                        {flightBooking?.bookingData?.returnDate 
                          ? dayjs(flightBooking.bookingData.returnDate).format('DD MMM YYYY')
                          : 'Jun 22, 2024 4:30 PM'}
                      </Text>
                      <Text className="text-gray-600 text-sm block">
                        {flightBooking?.bookingData?.origin || 'New York (JFK)'}
                      </Text>
                      <Text className="text-gray-600 text-sm block">
                        Meal: Standard
                      </Text>
                    </div>
                  </Col>
                </Row>
              </Card>
            )}

            {/* Additional Information */}
            <Card>
              <Title level={4} className="!mb-6">
                Additional Information
              </Title>

              <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                  <div className="space-y-4">
                    <div>
                      <Text className="text-gray-500 text-sm block mb-1">
                        Group Leader
                      </Text>
                      <Text className="text-gray-900">
                        {flightBooking?.groupLeaderData 
                          ? `${flightBooking.groupLeaderData.firstName} ${flightBooking.groupLeaderData.lastName}`
                          : 'Not provided'}
                      </Text>
                      <Text className="text-gray-600 text-sm block">
                        {flightBooking?.groupLeaderData?.email || 'No email provided'}
                      </Text>
                    </div>
                    <div>
                      <Text className="text-gray-500 text-sm block mb-1">
                        Organization
                      </Text>
                      <Text className="text-gray-900">
                        {flightBooking?.groupLeaderData?.companyName || 
                         flightBooking?.groupLeaderData?.organizationName || 
                         'Not provided'}
                      </Text>
                    </div>
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div className="space-y-4">
                    <div>
                      <Text className="text-gray-500 text-sm block mb-1">
                        Booking Reference
                      </Text>
                      <Text className="text-gray-900">
                        {booking.bookingId}
                      </Text>
                    </div>
                    <div>
                      <Text className="text-gray-500 text-sm block mb-1">
                        Total Amount
                      </Text>
                      <Text className="text-gray-900">
                        ₹{flightBooking?.totalAmount || '5,280.00'}
                      </Text>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Selected Services */}
              {flightBooking?.selectedServices && flightBooking.selectedServices.length > 0 && (
                <div className="mt-6">
                  <Text className="text-gray-500 text-sm block mb-3">
                    Selected Services
                  </Text>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {flightBooking.selectedServices.map((service: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <Text className="text-gray-900">{service.name}</Text>
                        <Text className="text-gray-600 font-medium">₹{service.price}</Text>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === "passengers" && (
          <Card>
            <Title level={4} className="!mb-4">
              Passenger Information
            </Title>
            <Text className="text-gray-500 block mb-6">
              Manage passenger details and seat assignments
            </Text>

            <div className="space-y-4">
              {Array.from({ length: booking.passengers || 3 }, (_, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <Text className="font-semibold text-gray-900 block">
                        Passenger {index + 1}
                      </Text>
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

        {activeTab === "payments" && (
          <Card>
            <Title level={4} className="!mb-4">
              Payment Information
            </Title>
            <Text className="text-gray-500 block mb-6">
              View payment history and outstanding balances
            </Text>

            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <Text className="font-semibold text-gray-900 block">
                      Total Amount
                    </Text>
                    <Text className="text-gray-600 text-sm">
                      For {booking.passengers} passengers
                    </Text>
                  </div>
                  <Text className="text-2xl font-bold text-gray-900">
                    ₹{flightBooking?.totalAmount || '5,280.00'}
                  </Text>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <Text className="font-semibold text-gray-900 block">
                      Payment Status
                    </Text>
                    <Text className="text-gray-600 text-sm">
                      {flightBooking?.paymentData?.paymentMethod || 'To be determined'}
                    </Text>
                  </div>
                  <Text className="text-xl font-semibold text-orange-600">
                    {booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
