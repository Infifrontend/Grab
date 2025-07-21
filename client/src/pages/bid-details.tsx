import { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Button, Input, Select, DatePicker, Alert, Space, Divider, Spin, Tag } from 'antd';
import { ArrowLeftOutlined, InfoCircleOutlined, UserOutlined, DollarOutlined, CalendarOutlined } from '@ant-design/icons';
import { useLocation, useRoute } from 'wouter';
import Header from "@/components/layout/header";
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function BidDetails() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/bid-details/:id");
  const [loading, setLoading] = useState(true);
  const [bidData, setBidData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch bid details from database
  useEffect(() => {
    const fetchBidDetails = async () => {
      if (!params?.id) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/bids/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch bid details');
        }

        const data = await response.json();
        setBidData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBidDetails();
  }, [params?.id]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-center items-center">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !bidData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Alert
            message="Error"
            description={error || "Bid not found"}
            type="error"
            showIcon
          />
        </div>
      </div>
    );
  }

  // Parse bid configuration data
  let configData = {};
  try {
    configData = bidData.bid.notes ? JSON.parse(bidData.bid.notes) : {};
  } catch (e) {
    console.error("Error parsing bid notes:", e);
  }

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return dayjs(dateString).format('DD MMM YYYY');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'accepted': return 'blue';
      case 'rejected': return 'red';
      case 'expired': return 'orange';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Active';
      case 'accepted': return 'Accepted';
      case 'rejected': return 'Rejected';
      case 'expired': return 'Expired';
      default: return 'Pending';
    }
  };

  const calculateTimeLeft = (validUntil) => {
    if (!validUntil) return 'N/A';
    const now = dayjs();
    const expiry = dayjs(validUntil);
    const diff = expiry.diff(now, 'hour');

    if (diff <= 0) return 'Expired';
    if (diff < 24) return `${diff} hours`;
    return `${Math.ceil(diff / 24)} days`;
  };

  const handleBack = () => {
    setLocation('/bids');
  };

  // Extract data for display
  const bidInfo = {
    bidId: `BID-${bidData.bid.id}`,
    status: getStatusText(bidData.bid.bidStatus),
    timeLeft: calculateTimeLeft(bidData.bid.validUntil),
    bidAmount: parseFloat(bidData.bid.bidAmount || 0),
    passengerCount: bidData.bid.passengerCount || 1,
    submittedDate: formatDate(bidData.bid.createdAt),
    validUntil: formatDate(bidData.bid.validUntil),
    origin: configData.origin || bidData.flight?.origin || 'Unknown',
    destination: configData.destination || bidData.flight?.destination || 'Unknown',
    travelDate: configData.travelDate ? formatDate(configData.travelDate) : formatDate(bidData.flight?.departureTime),
    flightType: configData.flightType || 'Domestic',
    fareType: configData.fareType || 'Economy',
    baggageAllowance: configData.baggageAllowance || 20,
    mealIncluded: configData.mealIncluded || false,
    groupName: configData.title || configData.bidTitle || 'Group Travel',
    contactName: bidData.user?.name || 'Unknown',
    contactEmail: bidData.user?.username || 'Unknown',
    specialRequests: bidData.bid.notes || configData.otherNotes || 'No special requests',
    totalBid: (parseFloat(bidData.bid.bidAmount || 0) * (bidData.bid.passengerCount || 1)),
    depositRequired: (parseFloat(bidData.bid.bidAmount || 0) * (bidData.bid.passengerCount || 1)) * 0.1
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
                    <strong>Bid ID:</strong> {bidInfo.bidId}
                  </span>
                  <Tag color={getStatusColor(bidData.bid.bidStatus)}>
                    {bidInfo.status}
                  </Tag>
                  <span className="text-gray-600">
                    <strong>Time left:</strong> {bidInfo.timeLeft}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Group Information Section */}
          <Card className="shadow-sm">
            <Title level={3} className="!mb-4 text-xl font-semibold text-gray-900 flex items-center gap-2">
              <UserOutlined className="text-blue-600" />
              Group Information
            </Title>
            <Row gutter={[24, 20]}>
              <Col xs={24} md={12}>
                <div>
                  <Text className="text-gray-700 font-medium block mb-2">Group Name</Text>
                  <Text className="text-gray-900 text-base">{bidInfo.groupName}</Text>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <Text className="text-gray-700 font-medium block mb-2">Flight Type</Text>
                  <Text className="text-gray-900 text-base">{bidInfo.flightType}</Text>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <Text className="text-gray-700 font-medium block mb-2">Fare Type</Text>
                  <Text className="text-gray-900 text-base">{bidInfo.fareType}</Text>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <Text className="text-gray-700 font-medium block mb-2">Baggage Allowance</Text>
                  <Text className="text-gray-900 text-base">{bidInfo.baggageAllowance} kg</Text>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Travel Details Section */}
          <Card className="shadow-sm">
            <Title level={3} className="!mb-4 text-xl font-semibold text-gray-900 flex items-center gap-2">
              <CalendarOutlined className="text-blue-600" />
              Travel Details
            </Title>
            <Row gutter={[24, 20]}>
              <Col xs={24} md={12}>
                <div>
                  <Text className="text-gray-700 font-medium block mb-2">Origin</Text>
                  <Text className="text-gray-900 text-base">{bidInfo.origin}</Text>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <Text className="text-gray-700 font-medium block mb-2">Destination</Text>
                  <Text className="text-gray-900 text-base">{bidInfo.destination}</Text>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <Text className="text-gray-700 font-medium block mb-2">Travel Date</Text>
                  <Text className="text-gray-900 text-base">{bidInfo.travelDate}</Text>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <Text className="text-gray-700 font-medium block mb-2">Route</Text>
                  <Text className="text-gray-900 text-base">{bidInfo.origin} → {bidInfo.destination}</Text>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <Text className="text-gray-700 font-medium block mb-2">Meal Included</Text>
                  <Text className="text-gray-900 text-base">{bidInfo.mealIncluded ? 'Yes' : 'No'}</Text>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Passenger & Pricing Details Section */}
          <Card className="shadow-sm">
            <Title level={3} className="!mb-4 text-xl font-semibold text-gray-900 flex items-center gap-2">
              <DollarOutlined className="text-blue-600" />
              Passenger & Pricing Details
            </Title>
            <Row gutter={[24, 20]}>
              <Col xs={24} md={8}>
                <div>
                  <Text className="text-gray-700 font-medium block mb-2">Number of Passengers</Text>
                  <Text className="text-gray-900 text-base font-semibold">{bidInfo.passengerCount} passenger{bidInfo.passengerCount > 1 ? 's' : ''}</Text>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div>
                  <Text className="text-gray-700 font-medium block mb-2">Bid Amount (per person)</Text>
                  <Text className="text-blue-600 text-lg font-bold">₹{bidInfo.bidAmount.toLocaleString()}</Text>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div>
                  <Text className="text-gray-700 font-medium block mb-2">Total Bid Amount</Text>
                  <Text className="text-green-600 text-xl font-bold">₹{bidInfo.totalBid.toLocaleString()}</Text>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <Text className="text-gray-700 font-medium block mb-2">Deposit Required (10%)</Text>
                  <Text className="text-orange-600 text-lg font-semibold">₹{bidInfo.depositRequired.toLocaleString()}</Text>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Contact Information Section */}
          <Card className="shadow-sm">
            <Title level={3} className="!mb-4 text-xl font-semibold text-gray-900">
              Contact Information
            </Title>
            <Row gutter={[24, 20]}>
              <Col xs={24} md={12}>
                <div>
                  <Text className="text-gray-700 font-medium block mb-2">Contact Name</Text>
                  <Text className="text-gray-900 text-base">{bidInfo.contactName}</Text>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <Text className="text-gray-700 font-medium block mb-2">Email</Text>
                  <Text className="text-gray-900 text-base">{bidInfo.contactEmail}</Text>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Special Requests Section */}
          {bidInfo.specialRequests && bidInfo.specialRequests !== 'No special requests' && (
            <Card className="shadow-sm">
              <Title level={3} className="!mb-4 text-xl font-semibold text-gray-900">
                Special Requests
              </Title>
              <div className="bg-gray-50 p-4 rounded-md">
                <Text className="text-gray-700">{bidInfo.specialRequests}</Text>
              </div>
            </Card>
          )}

          {/* Bid Timeline Section */}
          <Card className="shadow-sm">
            <Title level={3} className="!mb-4 text-xl font-semibold text-gray-900">
              Bid Timeline
            </Title>
            <Row gutter={[24, 20]}>
              <Col xs={24} md={8}>
                <div>
                  <Text className="text-gray-700 font-medium block mb-2">Submitted Date</Text>
                  <Text className="text-gray-900 text-base">{bidInfo.submittedDate}</Text>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div>
                  <Text className="text-gray-700 font-medium block mb-2">Valid Until</Text>
                  <Text className="text-gray-900 text-base">{bidInfo.validUntil}</Text>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div>
                  <Text className="text-gray-700 font-medium block mb-2">Current Status</Text>
                  <Tag color={getStatusColor(bidData.bid.bidStatus)} className="text-base">
                    {bidInfo.status}
                  </Tag>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <Button 
              size="large" 
              onClick={handleBack}
              className="px-8"
            >
              Back to Bids
            </Button>
            {bidData.bid.bidStatus === 'active' && (
              <Button 
                type="primary" 
                size="large"
                className="bg-blue-600 hover:bg-blue-700 px-8"
              >
                Modify Bid
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}