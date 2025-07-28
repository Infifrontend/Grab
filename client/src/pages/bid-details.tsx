import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Input,
  Select,
  DatePicker,
  Alert,
  Space,
  Divider,
  Spin,
} from "antd";
import {
  ArrowLeftOutlined,
  InfoCircleOutlined,
  UserOutlined,
  DollarOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useLocation, useRoute } from "wouter";
import Header from "@/components/layout/header";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function BidDetails() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/bid-details/:id");
  const [passengers, setPassengers] = useState(0);
  const [bidAmount, setBidAmount] = useState(0);
  const [originalBidAmount, setOriginalBidAmount] = useState(0);
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
          throw new Error("Failed to fetch bid details");
        }

        const data = await response.json();

        // Set the fetched data
        setBidData(data);
        setPassengers(data.bid.passengerCount);
        setBidAmount(parseFloat(data.bid.bidAmount));
        setOriginalBidAmount(parseFloat(data.bid.bidAmount));
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

  // Calculate derived values
  const formatDate = (dateString) => {
    return dayjs(dateString).format("DD/MM/YYYY");
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case "active":
        return "Open";
      case "accepted":
        return "Accepted";
      case "approved":
        return "Accepted";
      case "rejected":
        return "Declined";
      case "expired":
        return "Expired";
      case "completed":
        return "Under Review";
      default:
        return "Draft";
    }
  };

  const getTimeLeft = (validUntil) => {
    const now = dayjs();
    const expiry = dayjs(validUntil);
    const diff = expiry.diff(now, "hour");

    if (diff <= 0) return "Expired";
    if (diff < 24) return `${diff} hours`;
    return `${Math.ceil(diff / 24)} days`;
  };

  // Parse bid configuration data if available
  let configData = {};
  try {
    configData = bidData.bid.notes ? JSON.parse(bidData.bid.notes) : {};
  } catch (e) {
    console.warn("Could not parse bid notes:", e);
  }

  // Transform the fetched data from database records
  const transformedBidData = {
    bidId: bidData.bid.id.toString(),
    status: getStatusDisplay(bidData.bid.bidStatus),
    timeLeft: getTimeLeft(bidData.bid.validUntil),

    // Group Information from database
    groupName:
      configData.title ||
      configData.bidTitle ||
      bidData.bid.notes ||
      "Group Travel",
    groupCategory: configData.flightType || "Domestic",

    // Travel Details from database
    origin: bidData.flight?.origin || configData.origin || "Unknown",
    destination:
      bidData.flight?.destination || configData.destination || "Unknown",
    departureDate: bidData.flight?.departureTime
      ? formatDate(bidData.flight.departureTime)
      : configData.travelDate
        ? formatDate(configData.travelDate)
        : "Unknown",
    returnDate: bidData.flight?.arrivalTime
      ? formatDate(bidData.flight.arrivalTime)
      : "N/A",
    passengers: passengers,
    cabinClass: configData.fareType || bidData.flight?.cabin || "Economy",

    // Pricing Information
    bidAmount: bidAmount,

    // Contact Information from database
    contactName: bidData.user?.name || "Unknown",
    email: bidData.user?.username || "Unknown",
    phone: bidData.user?.phone || "Contact via email",

    // Additional Information from database
    specialRequests:
      configData.otherNotes || bidData.bid.notes || "No special requests",
    baggageAllowance: configData.baggageAllowance || "20 kg",
    mealIncluded: configData.mealIncluded ? "Yes" : "No",
    cancellationTerms:
      configData.cancellationTerms || "Standard cancellation policy",

    // Calculated fields
    route: `${bidData.flight?.origin || configData.origin || "Unknown"} → ${bidData.flight?.destination || configData.destination || "Unknown"}`,
    totalBid: passengers * bidAmount,
    depositRequired: passengers * bidAmount * 0.1,
    refundPolicy: "Full refund if bid not accepted",
  };

  const handleBack = () => {
    setLocation("/bids");
  };

  const handleBidAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow any input during typing
    setBidAmount(e.target.value === "" ? 0 : parseInt(e.target.value) || 0);
  };

  const handleBidAmountBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const newAmount = parseInt(e.target.value) || 0;
    // Apply validation on blur
    if (newAmount < originalBidAmount) {
      setBidAmount(originalBidAmount);
    } else {
      setBidAmount(newAmount);
    }
  };

  const handlePassengersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassengers = parseInt(e.target.value);
    if (newPassengers > 0) {
      setPassengers(newPassengers);
    }
  };

  const handleContinueToPayment = () => {
    // Store bid participation data for payment
    const bidParticipationData = {
      bidId: transformedBidData.bidId,
      passengerCount: passengers,
      bidAmount: bidAmount,
      totalBid: passengers * bidAmount,
      depositRequired: passengers * bidAmount * 0.1,
      configData: {
        title: transformedBidData.groupName,
        route: transformedBidData.route,
        travelDate: transformedBidData.departureDate,
      },
    };

    // Store in localStorage for payment page
    localStorage.setItem(
      "bidParticipationData",
      JSON.stringify(bidParticipationData),
    );

    // Navigate to payment page
    setLocation(`/payment-details/${transformedBidData.bidId}`);
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
                <Title
                  level={1}
                  className="!mb-2 text-2xl font-bold text-gray-900"
                >
                  Bid Details
                </Title>
                <div className="flex items-center gap-6 text-sm">
                  <span className="text-gray-600">
                    <strong>Bid ID:</strong> {transformedBidData.bidId}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    {transformedBidData.status}
                  </span>
                  <span className="text-gray-600">
                    <strong>Time left:</strong> {transformedBidData.timeLeft}
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
              The minimum bid amount set by the airline for this route is{" "}
              <strong>$750 per person</strong>. Your bid must meet or exceed
              this amount to be considered.
            </span>
          }
          type="info"
          icon={<InfoCircleOutlined />}
          showIcon
          className="mb-6 border-l-4 border-blue-500"
          style={{
            backgroundColor: "#f0f9ff",
            borderColor: "#e0f2fe",
          }}
        />

        {/* Main Form Card */}
        <Card className="mb-6 shadow-sm">
          <div className="mb-6">
            <Title
              level={2}
              className="!mb-2 text-xl font-semibold text-gray-900"
            >
              Submit Your Group Travel Bid
            </Title>
            <Text className="text-gray-600 text-base">
              Enter your travel details and desired price. Airlines will review
              and respond within 48 hours.
            </Text>
          </div>

          <div className="space-y-8">
            {/* Group Information Section */}
            <div>
              <Title
                level={4}
                className="!mb-4 text-lg font-medium text-gray-800 flex items-center gap-2"
              >
                <UserOutlined className="text-blue-600" />
                Group Information
              </Title>
              <Row gutter={[24, 20]}>
                <Col xs={24} md={12}>
                  <div>
                    <Text className="text-gray-700 font-medium block mb-2">
                      Group Name / Bid Title
                    </Text>
                    <Input
                      value={transformedBidData.groupName}
                      placeholder="Group name not specified"
                      size="large"
                      className="rounded-md"
                      readOnly
                      style={{
                        backgroundColor: "#f5f5f5",
                        cursor: "not-allowed",
                      }}
                    />
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div>
                    <Text className="text-gray-700 font-medium block mb-2">
                      Flight Type
                    </Text>
                    <Input
                      value={transformedBidData.groupCategory}
                      placeholder="Flight type not specified"
                      size="large"
                      className="rounded-md"
                      readOnly
                      style={{
                        backgroundColor: "#f5f5f5",
                        cursor: "not-allowed",
                      }}
                    />
                  </div>
                </Col>
              </Row>
            </div>

            <Divider />

            {/* Travel Details Section */}
            <div>
              <Title
                level={4}
                className="!mb-4 text-lg font-medium text-gray-800 flex items-center gap-2"
              >
                <CalendarOutlined className="text-blue-600" />
                Travel Details
              </Title>
              <Row gutter={[24, 20]}>
                <Col xs={24} md={8}>
                  <div>
                    <Text className="text-gray-700 font-medium block mb-2">
                      Origin
                    </Text>
                    <Input
                      value={transformedBidData.origin}
                      placeholder="Departure city"
                      size="large"
                      className="rounded-md"
                      readOnly
                      style={{
                        backgroundColor: "#f5f5f5",
                        cursor: "not-allowed",
                      }}
                    />
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div>
                    <Text className="text-gray-700 font-medium block mb-2">
                      Destination
                    </Text>
                    <Input
                      value={transformedBidData.destination}
                      placeholder="Arrival city"
                      size="large"
                      className="rounded-md"
                      readOnly
                      style={{
                        backgroundColor: "#f5f5f5",
                        cursor: "not-allowed",
                      }}
                    />
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div>
                    <Text className="text-gray-700 font-medium block mb-2">
                      Cabin Class
                    </Text>
                    <Input
                      value={transformedBidData.cabinClass}
                      placeholder="Cabin class"
                      size="large"
                      className="rounded-md"
                      readOnly
                      style={{
                        backgroundColor: "#f5f5f5",
                        cursor: "not-allowed",
                      }}
                    />
                  </div>
                </Col>
              </Row>

              <Row gutter={[24, 20]} className="mt-5">
                <Col xs={24} md={8}>
                  <div>
                    <Text className="text-gray-700 font-medium block mb-2">
                      Travel Date
                    </Text>
                    <Input
                      value={transformedBidData.departureDate}
                      placeholder="Travel date"
                      size="large"
                      className="rounded-md"
                      readOnly
                      style={{
                        backgroundColor: "#f5f5f5",
                        cursor: "not-allowed",
                      }}
                    />
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div>
                    <Text className="text-gray-700 font-medium block mb-2">
                      Baggage Allowance
                    </Text>
                    <Input
                      value={transformedBidData.baggageAllowance}
                      placeholder="Baggage allowance"
                      size="large"
                      className="rounded-md"
                      readOnly
                      style={{
                        backgroundColor: "#f5f5f5",
                        cursor: "not-allowed",
                      }}
                    />
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div>
                    <Text className="text-gray-700 font-medium block mb-2">
                      Meal Included
                    </Text>
                    <Input
                      value={transformedBidData.mealIncluded}
                      placeholder="Meal information"
                      size="large"
                      className="rounded-md"
                      readOnly
                      style={{
                        backgroundColor: "#f5f5f5",
                        cursor: "not-allowed",
                      }}
                    />
                  </div>
                </Col>
              </Row>
            </div>

            <Divider />

            {/* Passenger and Pricing Section */}
            <div>
              <Title
                level={4}
                className="!mb-4 text-lg font-medium text-gray-800 flex items-center gap-2"
              >
                <DollarOutlined className="text-blue-600" />
                Passenger & Pricing Details
              </Title>
              <Row gutter={[24, 20]}>
                <Col xs={24} md={12}>
                  <div>
                    <Text className="text-gray-700 font-medium block mb-2">
                      Number of Passengers
                    </Text>
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
                <Col xs={24} md={12}>
                  <div>
                    <Text className="text-gray-700 font-medium block mb-2">
                      Bid Amount (per person)
                    </Text>
                    <Input
                      value={bidAmount}
                      onChange={handleBidAmountChange}
                      onBlur={handleBidAmountBlur}
                      placeholder="850"
                      size="large"
                      prefix={<span className="text-gray-400">$</span>}
                      className="rounded-md"
                    />
                    <Text className="text-gray-500 text-sm mt-1">
                      Minimum bid amount: ${originalBidAmount} (can only
                      increase)
                    </Text>
                  </div>
                </Col>
              </Row>

              <Row gutter={[24, 20]} className="mt-5">
                <Col xs={24}>
                  <div>
                    <Text className="text-gray-700 font-medium block mb-2">
                      Cancellation Terms
                    </Text>
                    <Input
                      value={transformedBidData.cancellationTerms}
                      placeholder="Cancellation policy"
                      size="large"
                      className="rounded-md"
                      readOnly
                      style={{
                        backgroundColor: "#f5f5f5",
                        cursor: "not-allowed",
                      }}
                    />
                  </div>
                </Col>
              </Row>
            </div>

            <Divider />

            {/* Contact Information Section */}
            <div>
              <Title
                level={4}
                className="!mb-4 text-lg font-medium text-gray-800"
              >
                Contact Information
              </Title>
              <Row gutter={[24, 20]}>
                <Col xs={24} md={12}>
                  <div>
                    <Text className="text-gray-700 font-medium block mb-2">
                      Contact Name
                    </Text>
                    <Input
                      value={transformedBidData.contactName}
                      placeholder="Name not provided"
                      size="large"
                      className="rounded-md"
                      readOnly
                      style={{
                        backgroundColor: "#f5f5f5",
                        cursor: "not-allowed",
                      }}
                    />
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div>
                    <Text className="text-gray-700 font-medium block mb-2">
                      Email
                    </Text>
                    <Input
                      value={transformedBidData.email}
                      placeholder="Email not provided"
                      size="large"
                      className="rounded-md"
                      readOnly
                      style={{
                        backgroundColor: "#f5f5f5",
                        cursor: "not-allowed",
                      }}
                    />
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div>
                    <Text className="text-gray-700 font-medium block mb-2">
                      Phone
                    </Text>
                    <Input
                      value={transformedBidData.phone}
                      placeholder="Phone not provided"
                      size="large"
                      className="rounded-md"
                      readOnly
                      style={{
                        backgroundColor: "#f5f5f5",
                        cursor: "not-allowed",
                      }}
                    />
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div>
                    <Text className="text-gray-700 font-medium block mb-2">
                      Bid Status
                    </Text>
                    <Input
                      value={transformedBidData.status}
                      placeholder="Status"
                      size="large"
                      className="rounded-md"
                      readOnly
                      style={{
                        backgroundColor: "#f5f5f5",
                        cursor: "not-allowed",
                      }}
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Card>

        {/* Bid Summary Card */}
        <Card className="shadow-sm">
          <Title
            level={3}
            className="!mb-6 text-xl font-semibold text-gray-900"
          >
            Bid Summary
          </Title>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <Row gutter={[24, 20]}>
              <Col xs={24} sm={12} md={6}>
                <div className="text-center">
                  <Text className="text-gray-500 text-sm block mb-1">
                    Route
                  </Text>
                  <Text className="text-gray-900 font-semibold text-base">
                    {transformedBidData.route}
                  </Text>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div className="text-center">
                  <Text className="text-gray-500 text-sm block mb-1">
                    Passengers
                  </Text>
                  <Text className="text-gray-900 font-semibold text-base">
                    {passengers} passengers
                  </Text>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div className="text-center">
                  <Text className="text-gray-500 text-sm block mb-1">
                    Bid per person
                  </Text>
                  <Text className="text-blue-600 font-bold text-lg">
                    ${bidAmount}
                  </Text>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div className="text-center">
                  <Text className="text-gray-500 text-sm block mb-1">
                    Total Bid
                  </Text>
                  <Text className="text-blue-600 font-bold text-2xl">
                    ${(passengers * bidAmount).toLocaleString()}
                  </Text>
                </div>
              </Col>
            </Row>
          </div>

          <Row gutter={[24, 20]} className="mb-8">
            <Col xs={24} md={12}>
              <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                <Text className="text-gray-700 font-medium">
                  Deposit Required (10%)
                </Text>
                <Text className="text-orange-600 font-bold text-lg">
                  ${(passengers * bidAmount * 0.1).toLocaleString()}
                </Text>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                <Text className="text-gray-700 font-medium">Refund Policy</Text>
                <Text className="text-green-600 font-semibold">
                  {transformedBidData.refundPolicy}
                </Text>
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
            {(transformedBidData.status === "Active" ||
              transformedBidData.status === "active") &&
              transformedBidData.status !== "completed" && (
                <div className="flex justify-end">
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleContinueToPayment}
                    className="bg-blue-600 hover:bg-blue-700 rounded-md px-8 font-semibold"
                  >
                    Continue to Payment
                  </Button>
                </div>
              )}

            {transformedBidData.status === "completed" && (
              <div className="flex justify-end">
                <Button
                  size="large"
                  disabled
                  className="px-8 py-2 h-auto font-semibold"
                >
                  Payment Completed
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
