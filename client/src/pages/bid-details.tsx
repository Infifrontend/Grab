import { useState } from 'react';
import { Card, Row, Col, Typography, Button, Input, Select, DatePicker, Alert, Space, Divider } from 'antd';
import { ArrowLeftOutlined, InfoCircleOutlined, UserOutlined, DollarOutlined, CalendarOutlined } from '@ant-design/icons';
import { useLocation, useRoute } from 'wouter';
import Header from "@/components/layout/header";
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function BidDetails() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/bid-details/:id");
  const [passengers, setPassengers] = useState(25);
  const [bidAmount, setBidAmount] = useState(850);
  const [originalBidAmount] = useState(850); // Store original bid amount for validation

  // Mock bid data - in real app this would come from API based on ID
  const bidData = {
    bidId: '12345',
    status: 'Draft',
    timeLeft: '2 days',
    groupName: 'Corporate Team Building',
    groupCategory: 'Corporate',
    origin: 'New York (JFK)',
    destination: 'London (LHR)',
    departureDate: '15/07/2024',
    returnDate: '22/07/2024',
    passengers: passengers,
    cabinClass: 'Economy',
    bidAmount: bidAmount,
    contactName: 'John Smith',
    email: 'john.smith@company.com',
    phone: '+1 (555) 123-4567',
    specialRequests: 'Any special requirements, meal preferences, seating requests, etc.',
    route: 'New York (JFK) → London (LHR)',
    totalBid: passengers * bidAmount,
    depositRequired: (passengers * bidAmount) * 0.1,
    refundPolicy: 'Full refund if bid not accepted'
  };

  const handleBack = () => {
    setLocation('/bids');
  };

  const handleBidAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = parseInt(e.target.value);
    if (newAmount >= originalBidAmount) {
      setBidAmount(newAmount);
    }
  };

  const handlePassengersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassengers = parseInt(e.target.value);
    if (newPassengers > 0) {
      setPassengers(newPassengers);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            className="mb-4 p-0 h-auto text-gray-600 hover:text-blue-600 font-medium"
          >
            Back to Bids
          </Button>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex justify-between items-start">
              <div>
                <Title level={1} className="!mb-2 text-2xl font-bold text-gray-900">
                  Bid Details
                </Title>
                <div className="flex items-center gap-6 text-sm">
                  <span className="text-gray-600">
                    <strong>Bid ID:</strong> {bidData.bidId}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    {bidData.status}
                  </span>
                  <span className="text-gray-600">
                    <strong>Time left:</strong> {bidData.timeLeft}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Airline Minimum Bid Alert */}
        <Alert
          message="Airline Minimum Bid"
          description={
            <span>
              The minimum bid amount set by the airline for this route is <strong>$750 per person</strong>. 
              Your bid must meet or exceed this amount to be considered.
            </span>
          }
          type="info"
          icon={<InfoCircleOutlined />}
          showIcon
          className="mb-6 border-l-4 border-blue-500"
          style={{ 
            backgroundColor: '#f0f9ff',
            borderColor: '#e0f2fe'
          }}
        />

        {/* Main Form Card */}
        <Card className="mb-6 shadow-sm">
          <div className="mb-6">
            <Title level={2} className="!mb-2 text-xl font-semibold text-gray-900">
              Submit Your Group Travel Bid
            </Title>
            <Text className="text-gray-600 text-base">
              Enter your travel details and desired price. Airlines will review and respond within 48 hours.
            </Text>
          </div>

          <div className="space-y-8">
            {/* Group Information Section */}
            <div>
              <Title level={4} className="!mb-4 text-lg font-medium text-gray-800 flex items-center gap-2">
                <UserOutlined className="text-blue-600" />
                Group Information
              </Title>
              <Row gutter={[24, 20]}>
                <Col xs={24} md={12}>
                  <div>
                    <Text className="text-gray-700 font-medium block mb-2">Group Name</Text>
                    <Input 
                      value={bidData.groupName}
                      placeholder="Corporate Team Building"
                      size="large"
                      className="rounded-md"
                      readOnly
                      style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                    />
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div>
                    <Text className="text-gray-700 font-medium block mb-2">Group Category</Text>
                    <Select 
                      value={bidData.groupCategory}
                      placeholder="Select category"
                      size="large"
                      className="w-full rounded-md"
                      disabled
                      style={{ backgroundColor: '#f5f5f5' }}
                    >
                      <Select.Option value="Corporate">Corporate</Select.Option>
                      <Select.Option value="Leisure">Leisure</Select.Option>
                      <Select.Option value="Educational">Educational</Select.Option>
                    </Select>
                  </div>
                </Col>
              </Row>
            </div>

            <Divider />

            {/* Travel Details Section */}
            <div>
              <Title level={4} className="!mb-4 text-lg font-medium text-gray-800 flex items-center gap-2">
                <CalendarOutlined className="text-blue-600" />
                Travel Details
              </Title>
              <Row gutter={[24, 20]}>
                <Col xs={24} md={12}>
                  <div>
                    <Text className="text-gray-700 font-medium block mb-2">Origin</Text>
                    <Input 
                      value={bidData.origin}
                      placeholder="Departure city"
                      size="large"
                      className="rounded-md"
                      readOnly
                      style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                    />
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div>
                    <Text className="text-gray-700 font-medium block mb-2">Destination</Text>
                    <Input 
                      value={bidData.destination}
                      placeholder="Arrival city"
                      size="large"
                      className="rounded-md"
                      readOnly
                      style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                    />
                  </div>
                </Col>
              </Row>

              <Row gutter={[24, 20]} className="mt-5">
                <Col xs={24} md={12}>
                  <div>
                    <Text className="text-gray-700 font-medium block mb-2">Departure Date</Text>
                    <DatePicker 
                      value={dayjs(bidData.departureDate, 'DD/MM/YYYY')}
                      format="DD MMM YYYY"
                      placeholder="Select departure date"
                      size="large"
                      className="w-full rounded-md"
                      disabled
                      style={{ backgroundColor: '#f5f5f5' }}
                    />
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div>
                    <Text className="text-gray-700 font-medium block mb-2">Return Date</Text>
                    <DatePicker 
                      value={dayjs(bidData.returnDate, 'DD/MM/YYYY')}
                      format="DD MMM YYYY"
                      placeholder="Select return date"
                      size="large"
                      className="w-full rounded-md"
                      disabled
                      style={{ backgroundColor: '#f5f5f5' }}
                    />
                  </div>
                </Col>
              </Row>
            </div>

            <Divider />

            {/* Passenger and Pricing Section */}
            <div>
              <Title level={4} className="!mb-4 text-lg font-medium text-gray-800 flex items-center gap-2">
                <DollarOutlined className="text-blue-600" />
                Passenger & Pricing Details
              </Title>
              <Row gutter={[24, 20]}>
                <Col xs={24} md={8}>
                  <div>
                    <Text className="text-gray-700 font-medium block mb-2">Number of Passengers</Text>
                    <Input 
                      value={passengers}
                      onChange={handlePassengersChange}
                      placeholder="25"
                      size="large"
                      type="number"
                      min="1"
                      prefix={<UserOutlined className="text-gray-400" />}
                      className="rounded-md"
                    />
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div>
                    <Text className="text-gray-700 font-medium block mb-2">Cabin Class</Text>
                    <Select 
                      value={bidData.cabinClass}
                      placeholder="Select class"
                      size="large"
                      className="w-full rounded-md"
                      disabled
                      style={{ backgroundColor: '#f5f5f5' }}
                    >
                      <Select.Option value="Economy">Economy</Select.Option>
                      <Select.Option value="Business">Business</Select.Option>
                      <Select.Option value="First">First</Select.Option>
                    </Select>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div>
                    <Text className="text-gray-700 font-medium block mb-2">Bid Amount (per person)</Text>
                    <Input 
                      value={bidAmount}
                      onChange={handleBidAmountChange}
                      placeholder="850"
                      size="large"
                      type="number"
                      min={originalBidAmount}
                      prefix={<span className="text-gray-400">₹</span>}
                      className="rounded-md"
                    />
                    <Text className="text-gray-500 text-sm mt-1">
                      Minimum bid amount: ₹{originalBidAmount} (can only increase)
                    </Text>
                  </div>
                </Col>
              </Row>
            </div>

            <Divider />

            {/* Contact Information Section */}
            <div>
              <Title level={4} className="!mb-4 text-lg font-medium text-gray-800">
                Contact Information
              </Title>
              <Row gutter={[24, 20]}>
                <Col xs={24} md={8}>
                  <div>
                    <Text className="text-gray-700 font-medium block mb-2">Contact Name</Text>
                    <Input 
                      value={bidData.contactName}
                      placeholder="John Smith"
                      size="large"
                      className="rounded-md"
                      readOnly
                      style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                    />
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div>
                    <Text className="text-gray-700 font-medium block mb-2">Email</Text>
                    <Input 
                      value={bidData.email}
                      placeholder="john.smith@company.com"
                      size="large"
                      className="rounded-md"
                      readOnly
                      style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                    />
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div>
                    <Text className="text-gray-700 font-medium block mb-2">Phone</Text>
                    <Input 
                      value={bidData.phone}
                      placeholder="+1 (555) 123-4567"
                      size="large"
                      className="rounded-md"
                      readOnly
                      style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                    />
                  </div>
                </Col>
              </Row>
            </div>

            {/* Special Requests Section */}
            <div>
              <Text className="text-gray-700 font-medium block mb-2">Special Requests (Optional)</Text>
              <TextArea 
                value={bidData.specialRequests}
                placeholder="Any special requirements, meal preferences, seating requests, etc."
                rows={4}
                className="rounded-md"
                readOnly
                style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
              />
            </div>
          </div>
        </Card>

        {/* Bid Summary Card */}
        <Card className="shadow-sm">
          <Title level={3} className="!mb-6 text-xl font-semibold text-gray-900">
            Bid Summary
          </Title>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <Row gutter={[24, 20]}>
              <Col xs={24} sm={12} md={6}>
                <div className="text-center">
                  <Text className="text-gray-500 text-sm block mb-1">Route</Text>
                  <Text className="text-gray-900 font-semibold text-base">{bidData.route}</Text>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div className="text-center">
                  <Text className="text-gray-500 text-sm block mb-1">Passengers</Text>
                  <Text className="text-gray-900 font-semibold text-base">{passengers} passengers</Text>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div className="text-center">
                  <Text className="text-gray-500 text-sm block mb-1">Bid per person</Text>
                  <Text className="text-blue-600 font-bold text-lg">₹{bidAmount}</Text>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div className="text-center">
                  <Text className="text-gray-500 text-sm block mb-1">Total Bid</Text>
                  <Text className="text-blue-600 font-bold text-2xl">₹{(passengers * bidAmount).toLocaleString()}</Text>
                </div>
              </Col>
            </Row>
          </div>

          <Row gutter={[24, 20]} className="mb-8">
            <Col xs={24} md={12}>
              <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                <Text className="text-gray-700 font-medium">Deposit Required (10%)</Text>
                <Text className="text-orange-600 font-bold text-lg">₹{((passengers * bidAmount) * 0.1).toLocaleString()}</Text>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                <Text className="text-gray-700 font-medium">Refund Policy</Text>
                <Text className="text-green-600 font-semibold">{bidData.refundPolicy}</Text>
              </div>
            </Col>
          </Row>

          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
            <Button 
              size="large" 
              onClick={handleBack}
              className="order-2 sm:order-1 rounded-md px-8"
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              size="large"
              className="order-1 sm:order-2 bg-blue-600 hover:bg-blue-700 rounded-md px-8 font-semibold"
            >
              Continue to Payment
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}