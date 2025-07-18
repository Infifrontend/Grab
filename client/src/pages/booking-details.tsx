import { useState } from "react";
import { Card, Button, Typography, Space, Badge, Tabs, Row, Col, Spin, Alert } from "antd";
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

  // Get booking ID from URL params or query string
  const urlParams = new URLSearchParams(window.location.search);
  const bookingId = params?.id || urlParams.get('ref') || urlParams.get('id');

  const { data: bookingDetails, isLoading, error } = useQuery({
    queryKey: ["/api/booking-details", bookingId],
    queryFn: async () => {
      if (!bookingId) throw new Error("No booking ID provided");
      const response = await fetch(`/api/booking-details/${bookingId}`);
      if (!response.ok) throw new Error("Failed to fetch booking details");
      return response.json();
    },
    enabled: !!bookingId,
  });

  const handleManageBooking = () => {
    setLocation(`/manage-booking/${bookingId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-center items-center">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (error || !bookingDetails) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Alert
            message="Booking Not Found"
            description="The booking you're looking for could not be found."
            type="error"
            showIcon
          />
        </div>
      </div>
    );
  }

  const { booking, passengers, flightData, comprehensiveData } = bookingDetails;

  // Parse comprehensive data for detailed information
  const bookingData = comprehensiveData?.tripDetails;
  const groupLeaderData = comprehensiveData?.groupLeaderInfo;
  const selectedServices = comprehensiveData?.selectedServices || [];
  const totalAmount = comprehensiveData?.pricingSummary?.totalAmount || booking.totalAmount;

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
                Booking ID: {booking.bookingReference || booking.bookingId}
              </Text>
            </div>
          </div>
          <Space>
            <Button 
              icon={<DownloadOutlined />} 
              className="flex items-center"
              onClick={() => setLocation(`/download-itinerary/${bookingId}`)}
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
                      ✈ {comprehensiveData?.flightDetails?.outbound?.airline || 
                          flightData?.airline || 
                          'British Airways'}
                    </Text>
                    <Text className="text-gray-600 text-sm block">
                      Duration: {comprehensiveData?.flightDetails?.outbound?.duration || 
                               flightData?.duration || 
                               '7h 45m'}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} sm={6}>
                  <div>
                    <Text className="text-gray-500 text-sm block mb-1">
                      Flight
                    </Text>
                    <Text className="text-gray-900 font-medium">
                      {comprehensiveData?.flightDetails?.outbound?.flightNumber || 
                       flightData?.flightNumber || 
                       'BA 178'}
                    </Text>
                    <Text className="text-gray-600 text-sm block">
                      Aircraft: {comprehensiveData?.flightDetails?.outbound?.aircraft || 
                               flightData?.aircraft || 
                               'Boeing 777-300ER'}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} sm={6}>
                  <div>
                    <Text className="text-gray-500 text-sm block mb-1">
                      Departure
                    </Text>
                    <Text className="text-gray-900 font-medium">
                      {comprehensiveData?.flightDetails?.outbound?.departureTime 
                        ? dayjs(comprehensiveData.flightDetails.outbound.departureTime).format('DD MMM YYYY h:mm A')
                        : flightData?.departureTime
                        ? dayjs(flightData.departureTime).format('DD MMM YYYY h:mm A')
                        : bookingData?.departureDate
                        ? dayjs(bookingData.departureDate).format('DD MMM YYYY')
                        : 'Jun 15, 2024 10:30 AM'}
                    </Text>
                    <Text className="text-gray-600 text-sm block">
                      {comprehensiveData?.flightDetails?.outbound?.origin || 
                       flightData?.origin || 
                       bookingData?.origin || 
                       comprehensiveData?.tripDetails?.origin || 
                       'New York (JFK)'}
                    </Text>
                    <Text className="text-gray-600 text-sm block">
                      Class: {bookingData?.cabin || 
                             comprehensiveData?.tripDetails?.cabin || 
                             'Economy'}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} sm={6}>
                  <div>
                    <Text className="text-gray-500 text-sm block mb-1">
                      Arrival
                    </Text>
                    <Text className="text-gray-900 font-medium">
                      {comprehensiveData?.flightDetails?.outbound?.arrivalTime 
                        ? dayjs(comprehensiveData.flightDetails.outbound.arrivalTime).format('DD MMM YYYY h:mm A')
                        : flightData?.arrivalTime
                        ? dayjs(flightData.arrivalTime).format('DD MMM YYYY h:mm A')
                        : '15 Jun 2024'}
                    </Text>
                    <Text className="text-gray-600 text-sm block">
                      {comprehensiveData?.flightDetails?.outbound?.destination || 
                       flightData?.destination || 
                       bookingData?.destination || 
                       comprehensiveData?.tripDetails?.destination || 
                       'London (LHR)'}
                    </Text>
                    <Text className="text-gray-600 text-sm block">
                      Meal: Standard
                    </Text>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Return Flight - Only show if it's a round trip */}
            {bookingData?.tripType === 'roundTrip' && bookingData?.returnDate && (
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
                        ✈ {comprehensiveData?.flightDetails?.return?.airline || 
                          flightData?.return?.airline || 
                          comprehensiveData?.selectedFlights?.return?.airline || 
                          flightData?.airline || 
                          'British Airways'}
                      </Text>
                      <Text className="text-gray-600 text-sm block">
                        Duration: {comprehensiveData?.flightDetails?.return?.duration || 
                               flightData?.return?.duration || 
                               comprehensiveData?.selectedFlights?.return?.duration || 
                               flightData?.duration || 
                               '7h 45m'}
                      </Text>
                    </div>
                  </Col>
                  <Col xs={24} sm={6}>
                    <div>
                      <Text className="text-gray-500 text-sm block mb-1">
                        Flight
                      </Text>
                      <Text className="text-gray-900 font-medium">
                        {comprehensiveData?.flightDetails?.return?.flightNumber || 
                       flightData?.return?.flightNumber || 
                       comprehensiveData?.selectedFlights?.return?.flightNumber || 
                       flightData?.flightNumber || 
                       'BA 179'}
                    </Text>
                    <Text className="text-gray-600 text-sm block">
                      Aircraft: {comprehensiveData?.flightDetails?.return?.aircraft || 
                               flightData?.return?.aircraft || 
                               comprehensiveData?.selectedFlights?.return?.aircraft || 
                               flightData?.aircraft || 
                               'Boeing 777-300ER'}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} sm={6}>
                  <div>
                    <Text className="text-gray-500 text-sm block mb-1">
                      Departure
                    </Text>
                    <Text className="text-gray-900 font-medium">
                      {comprehensiveData?.flightDetails?.return?.departureTime 
                        ? dayjs(comprehensiveData.flightDetails.return.departureTime).format('DD MMM YYYY h:mm A')
                        : flightData?.return?.departureTime 
                        ? dayjs(flightData.return.departureTime).format('DD MMM YYYY h:mm A')
                        : bookingData?.returnDate
                        ? dayjs(bookingData.returnDate).format('DD MMM YYYY')
                        : 'Jun 22, 2024 12:45 PM'}
                    </Text>
                    <Text className="text-gray-600 text-sm block">
                      {comprehensiveData?.flightDetails?.return?.origin || 
                       flightData?.return?.origin || 
                       bookingData?.destination || 
                       comprehensiveData?.tripDetails?.destination || 
                       'London (LHR)'}
                    </Text>
                    <Text className="text-gray-600 text-sm block">
                      Class: {bookingData?.cabin || 
                             comprehensiveData?.tripDetails?.cabin || 
                             'Economy'}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} sm={6}>
                  <div>
                    <Text className="text-gray-500 text-sm block mb-1">
                      Arrival
                    </Text>
                    <Text className="text-gray-900 font-medium">
                      {comprehensiveData?.flightDetails?.return?.arrivalTime 
                        ? dayjs(comprehensiveData.flightDetails.return.arrivalTime).format('DD MMM YYYY h:mm A')
                        : flightData?.return?.arrivalTime 
                        ? dayjs(flightData.return.arrivalTime).format('DD MMM YYYY h:mm A')
                        : bookingData?.returnDate
                        ? dayjs(bookingData.returnDate).format('DD MMM YYYY')
                        : '22 Jun 2024'}
                    </Text>
                    <Text className="text-gray-600 text-sm block">
                      {comprehensiveData?.flightDetails?.return?.destination || 
                       flightData?.return?.destination || 
                       bookingData?.origin || 
                       comprehensiveData?.tripDetails?.origin || 
                       'New York (JFK)'}
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
                        {groupLeaderData 
                          ? `${groupLeaderData.firstName} ${groupLeaderData.lastName}`
                          : 'Not provided'}
                      </Text>
                      <Text className="text-gray-600 text-sm block">
                        {groupLeaderData?.email || 'No email provided'}
                      </Text>
                    </div>
                    <div>
                      <Text className="text-gray-500 text-sm block mb-1">
                        Organization
                      </Text>
                      <Text className="text-gray-900">
                        {groupLeaderData?.companyName || 
                         groupLeaderData?.organizationName || 
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
                        {booking.bookingReference || booking.bookingId}
                      </Text>
                    </div>
                    <div>
                      <Text className="text-gray-500 text-sm block mb-1">
                        Total Amount
                      </Text>
                      <Text className="text-gray-900">
                        ${totalAmount || '5,280.00'}
                      </Text>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Selected Services */}
              {selectedServices && selectedServices.length > 0 && (
                <div className="mt-6">
                  <Text className="text-gray-500 text-sm block mb-3">
                    Selected Services
                  </Text>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedServices.map((service: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <Text className="text-gray-900">{service.name}</Text>
                        <Text className="text-gray-600 font-medium">${service.price}</Text>
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
              {passengers && passengers.length > 0 ? (
                passengers.map((passenger: any, index: number) => (
                  <div
                    key={passenger.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <Text className="font-semibold text-gray-900 block">
                          {passenger.title} {passenger.firstName} {passenger.lastName}
                        </Text>
                        <Text className="text-gray-600 text-sm">
                          {passenger.nationality} • DOB: {dayjs(passenger.dateOfBirth).format('DD MMM YYYY')}
                        </Text>
                        {passenger.seatPreference && (
                          <Text className="text-gray-600 text-sm">
                            Seat Preference: {passenger.seatPreference}
                          </Text>
                        )}
                        {passenger.mealPreference && (
                          <Text className="text-gray-600 text-sm">
                            Meal: {passenger.mealPreference}
                          </Text>
                        )}
                      </div>
                      <Button type="link" className="text-blue-600 p-0">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                Array.from({ length: booking.passengerCount || 1 }, (_, index) => (
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
                ))
              )}
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
                      For {booking.passengerCount} passengers
                    </Text>
                  </div>
                  <Text className="text-2xl font-bold text-gray-900">
                    ${totalAmount || '5,280.00'}
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
                      {comprehensiveData?.paymentInfo?.paymentMethod || 'To be determined'}
                    </Text>
                  </div>
                  <Text className={`text-xl font-semibold ${booking.bookingStatus === 'confirmed' ? 'text-green-600' : 'text-orange-600'}`}>
                    {booking.bookingStatus === 'confirmed' ? 'Confirmed' : 'Pending'}
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