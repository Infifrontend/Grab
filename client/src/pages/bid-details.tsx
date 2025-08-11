import { useState, useEffect, useMemo } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Input,
  Alert,
  Divider,
  Spin,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  InfoCircleOutlined,
  UserOutlined,
  DollarOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useQuery } from '@tanstack/react-query';

// Helper functions (assuming these are defined elsewhere or need to be included if not globally available)
const formatDateToDDMMMYYYY = (dateString)bid-details/ => {
  return dayjs(dateString).format("DD MMM YYYY");
};

const formatCurrency = (amount) => {
  return amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

const { Title, Text } = Typography;

export default function BidDetails() {
  const navigate = useNavigate();
  const params = useParams();
  const bidId = params?.id; // Ensure bidId is correctly extracted

  const [passengers, setPassengers] = useState<any>(0);
  const [bidAmount, setBidAmount] = useState(0);
  const [originalBidAmount, setOriginalBidAmount] = useState(0);
  const [error, setError] = useState(null);
  const [submittingBid, setSubmittingBid] = useState(false);

  // Fetch bid details from database using React Query
  const { data: bidData, isLoading: isBidLoading, error: bidError, refetch: refetchBid } = useQuery({
    queryKey: ["bid", bidId],
    queryFn: async () => {
      console.log(`Fetching bid details for ID: ${bidId}`);
      const response = await fetch(`/api/bids/${bidId}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Raw bid data received:", data);
      return data;
    },
    enabled: !!bidId,
    retry: 1,
  });

  // Fetch dynamic status for this user
  const { data: bidStatus, isLoading: isBidStatusLoading, error: bidStatusError } = useQuery({
    queryKey: ["bid-status", bidId],
    queryFn: async () => {
      const userId = localStorage.getItem("userId");
      const response = await fetch(`/api/bid-status/${bidId}?userId=${userId || ''}`);
      if (response.ok) {
        return await response.json();
      }
      console.warn(`Failed to fetch bid status for bid ${bidId}, userId ${userId}`);
      return null;
    },
    enabled: !!bidId,
    refetchInterval: 30000, // Refetch every 30 seconds to keep status current
  });

  // Effect to set initial form values and handle bid data transformation
  useEffect(() => {
    if (bidData?.success && bidData.bid) {
      setPassengers(bidData.bid.passengerCount);
      setOriginalBidAmount(parseFloat(bidData.bid.bidAmount));
      setBidAmount(parseFloat(bidData.bid.bidAmount));
    }
    if (bidError) {
      setError(bidError.message || "Failed to load bid details");
    }
  }, [bidData, bidError]);

  // Transform bid data for display, incorporating bidStatus
  const transformedBidData = useMemo(() => {
    if (!bidData?.success || !bidData.bid) {
      console.log("No valid bid data to transform");
      return null;
    }

    const bid = bidData.bid;
    let configData = {};

    try {
      configData = bid.notes ? JSON.parse(bid.notes) : {};
      console.log("Parsed configuration data:", configData);
    } catch (e) {
      console.warn("Could not parse bid notes:", e);
      configData = {};
    }

    const origin = configData.origin || bid.flight?.origin || "Unknown";
    const destination = configData.destination || bid.flight?.destination || "Unknown";

    // Use dynamic status from bid status endpoint if available
    let status = "Open";
    let seatAvailabilityInfo = null;

    if (bidStatus?.success) {
      status = bidStatus.bidStatus || "Open";
      seatAvailabilityInfo = {
        totalSeatsAvailable: bidStatus.totalSeatsAvailable,
        seatsRemaining: bidStatus.availableSeats,
        isClosed: bidStatus.isClosed,
        hasUserPaid: bidStatus.hasUserPaid,
        userRetailBidStatus: bidStatus.userRetailBidStatus
      };
      console.log(`Using dynamic status: ${status}`, seatAvailabilityInfo);
    } else {
      // Fallback to static status determination if bidStatus fetch fails or is not successful
      console.warn("Could not fetch dynamic bid status, falling back to static status.");
      let isPaymentCompleted = false;
      try {
        const paymentInfo = configData.paymentInfo;
        isPaymentCompleted = paymentInfo?.paymentCompleted === true;
        const paymentStatus = paymentInfo?.paymentStatus;

        if (isPaymentCompleted) {
          if (paymentStatus === "Payment Completed") {
            status = "Under Review";
          } else if (paymentStatus === "Accepted for Booking") {
            status = "Accepted";
          } else if (paymentStatus === "Open") {
            status = "Open";
          } else {
            status = "Under Review";
          }
        } else {
          switch (bid.bidStatus?.toLowerCase()) {
            case 'active':
              status = "Open";
              break;
            case 'accepted':
            case 'approved':
              status = "Approved";
              break;
            case 'rejected':
              status = "Rejected";
              break;
            case 'completed':
              status = "Completed";
              break;
            case 'expired':
              status = "Expired";
              break;
            default:
              status = "Open";
          }
        }
      } catch (e) {
        console.warn("Error determining bid status:", e);
        status = "Open";
      }
    }

    console.log(`Final status for bid ${bid.id}:`, status);

    // Create comprehensive bid data
    const transformedData = {
      id: bid.id,
      title: configData.title || `Bid ${bid.id}`,
      route: `${origin} → ${destination}`,
      origin: origin,
      destination: destination,
      travelDate: configData.travelDate ? formatDateToDDMMMYYYY(configData.travelDate) : "N/A",
      departureTime: configData.departureTimeRange || "Flexible",
      bidAmount: `₹${formatCurrency(parseFloat(bid.bidAmount))}`,
      totalPassengers: bid.passengerCount || configData.minSeatsPerBid || 1,
      status: status,
      seatAvailability: seatAvailabilityInfo,
      isPaymentCompleted: seatAvailabilityInfo?.hasUserPaid || false,

      // Flight & Booking Details
      flightType: configData.flightType || "Domestic",
      fareType: configData.fareType || "Economy",
      baggageAllowance: `${configData.baggageAllowance || 20} kg`,
      cancellationTerms: configData.cancellationTerms || "Standard",
      mealIncluded: configData.mealIncluded || false,

      // Bid Configuration Details
      totalSeatsAvailable: configData.totalSeatsAvailable || bid.totalSeatsAvailable || 50,
      minSeatsPerBid: configData.minSeatsPerBid || bid.minSeatsPerBid || 1,
      maxSeatsPerBid: configData.maxSeatsPerBid || bid.maxSeatsPerBid || 10,
      maxSeatsPerUser: configData.maxSeatsPerUser || 5,

      // Timeline Information
      bidStartTime: configData.bidStartTime ? formatDateToDDMMMYYYY(configData.bidStartTime) : "Active",
      bidEndTime: configData.bidEndTime ? formatDateToDDMMMYYYY(configData.bidEndTime) : formatDateToDDMMMYYYY(bid.validUntil),

      // Settings & Rules
      autoAwardTopBidder: configData.autoAwardTopBidder || false,
      manualReviewOption: configData.manualReviewOption || false,
      autoRefundNonWinners: configData.autoRefundNonWinners || false,

      // Additional Information
      otherNotes: configData.otherNotes || "",
      createdAt: bid.createdAt || new Date().toISOString(),

      // Flight Information (if available)
      flight: bidData.flight || null,

      // Raw data for debugging
      rawBidData: bid,
      configData: configData,
    };

    console.log("Transformed bid data:", transformedData);
    return transformedData;
  }, [bidData, bidStatus]); // Re-calculate when bidData or bidStatus changes

  // Show loading state
  if (isBidLoading || isBidStatusLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-6 flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  // Show error state
  if (error || bidError || bidStatusError || !transformedBidData) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Alert
          message="Error"
          description={error?.message || bidError?.message || bidStatusError?.message || "Bid details could not be loaded."}
          type="error"
          showIcon
        />
      </div>
    );
  }

  // Calculate derived values
  const formatDate = (dateString) => {
    return dayjs(dateString).format("DD/MM/YYYY");
  };

  const getStatusDisplay = (status, seatAvailabilityData) => {
    // Use dynamic status from seat availability if available
    if (seatAvailabilityData && seatAvailabilityData.userRetailBidStatus) {
      return seatAvailabilityData.userRetailBidStatus;
    }
    if (seatAvailabilityData && seatAvailabilityData.isClosed && !seatAvailabilityData.hasUserPaid) {
        return "Closed";
    }
    if (seatAvailabilityData && seatAvailabilityData.hasUserPaid && !seatAvailabilityData.isClosed) {
        return "Under Review";
    }


    // Fallback to original status mapping if dynamic status is not applicable
    switch (status) {
      case "active":
        return "Open";
      case "accepted":
      case "approved":
        return "Accepted";
      case "rejected":
        return "Declined";
      case "expired":
        return "Expired";
      case "completed":
        return "Under Review"; // Mapping 'completed' to 'Under Review' as per logic
      default:
        return "Draft";
    }
  };

  const getTimeLeft = (validUntil) => {
    const now = dayjs();
    const expiry = dayjs(validUntil);
    const diffInHours = expiry.diff(now, "hour");

    if (diffInHours <= 0) return "Expired";
    if (diffInHours < 24) return `${diffInHours} hours`;
    return `${Math.ceil(diffInHours / 24)} days`;
  };

  const handleBack = () => {
    navigate("/bids");
  };

  const handleBidAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBidAmount(value === "" ? 0 : parseFloat(value) || 0);
  };

  const handleBidAmountBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const newAmount = parseFloat(e.target.value) || 0;
    if (newAmount < originalBidAmount) {
      setBidAmount(originalBidAmount);
      message.warning(`Bid amount cannot be less than the original bid amount ($${originalBidAmount}).`);
    } else {
      setBidAmount(newAmount);
    }
  };

  const handlePassengersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newPassengers = value === "" ? null : parseInt(value);
    if (newPassengers === null || newPassengers >= (bidData?.bid?.passengerCount || 0)) {
      setPassengers(newPassengers);
    }
  };

  const handleBlurPassengerChange = (e: React.FocusEvent<HTMLInputElement>) => {
    const newPaxCount = parseInt(e.target.value) || 0;
    if (newPaxCount < (bidData?.bid?.passengerCount || 0)) {
      setPassengers(bidData?.bid?.passengerCount);
      message.warning(`Passenger count cannot be less than the original passenger count (${bidData?.bid?.passengerCount}).`);
    } else {
      setPassengers(newPaxCount);
    }
  };

  const handleContinueToPayment = () => {
    const bidParticipationData = {
      bidId: bidId,
      totalBid: bidAmount * passengers,
      bidAmount: bidAmount,
      passengerCount: passengers,
      groupName: transformedBidData.title,
      route: transformedBidData.route,
      travelDate: transformedBidData.travelDate,
    };

    console.log("Storing bid participation data:", bidParticipationData);
    localStorage.setItem(
      "bidParticipationData",
      JSON.stringify(bidParticipationData)
    );
    navigate(`/payment-details/${bidId}`);
  };

  const currentStatus = getStatusDisplay(transformedBidData.status, transformedBidData.seatAvailability);
  const isBidClosed = transformedBidData.seatAvailability?.isClosed || false;
  const hasUserPaid = transformedBidData.seatAvailability?.hasUserPaid || false;

  return (
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
                  <strong>Bid ID:</strong> {transformedBidData.id}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  {currentStatus}
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
            <strong>$750 per person</strong>. Your bid must meet or exceed this
            amount to be considered.
          </span>
        }
        type="info"
        icon={<InfoCircleOutlined />}
        showIcon
        className="mb-6 border-l-4 border-blue-500"
        style={{
          backgroundColor: "var(--ant-color-warning-bg)",
          borderColor: "#e0f2fe",
        }}
      />

      {/* Seat Availability Alert */}
      {transformedBidData.seatAvailability && (
        <Alert
          message="Seat Availability"
          description={
            <span>
              <strong>{transformedBidData.seatAvailability.seatsRemaining}</strong> seats remaining out of{" "}
              <strong>{transformedBidData.seatAvailability.totalSeatsAvailable}</strong> total seats.
              {transformedBidData.seatAvailability.isClosed ? (
                <span className="text-red-600 font-semibold"> This bid is now closed.</span>
              ) : transformedBidData.seatAvailability.hasUserPaid ? (
                <span className="text-blue-600 font-semibold"> Your payment is being processed.</span>
              ) : (
                <span className="text-green-600"> Bid is still open for submissions.</span>
              )}
            </span>
          }
          type={transformedBidData.seatAvailability.isClosed ? "warning" :
                transformedBidData.seatAvailability.hasUserPaid ? "info" : "success"}
          icon={<InfoCircleOutlined />}
          showIcon
          className="mb-6"
        />
      )}

      {/* User Payment Status Alert */}
      {transformedBidData.seatAvailability?.hasUserPaid && !transformedBidData.seatAvailability.isClosed && (
        <Alert
          message="Payment Status"
          description="You have successfully submitted payment for this bid. Your booking is under review and you will be notified once confirmed."
          type="info"
          icon={<InfoCircleOutlined />}
          showIcon
          className="mb-6"
        />
      )}

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
                    value={transformedBidData.title}
                    placeholder="Group name not specified"
                    size="large"
                    className="rounded-md"
                    readOnly
                    style={{
                      backgroundColor: "var(--ant-color-warning-bg)",
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
                    value={transformedBidData.flightType}
                    placeholder="Flight type not specified"
                    size="large"
                    className="rounded-md"
                    readOnly
                    style={{
                      backgroundColor: "var(--ant-color-warning-bg)",
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
                      backgroundColor: "var(--ant-color-warning-bg)",
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
                      backgroundColor: "var(--ant-color-warning-bg)",
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
                    value={transformedBidData.fareType}
                    placeholder="Cabin class"
                    size="large"
                    className="rounded-md"
                    readOnly
                    style={{
                      backgroundColor: "var(--ant-color-warning-bg)",
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
                    value={transformedBidData.travelDate}
                    placeholder="Travel date"
                    size="large"
                    className="rounded-md"
                    readOnly
                    style={{
                      backgroundColor: "var(--ant-color-warning-bg)",
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
                      backgroundColor: "var(--ant-color-warning-bg)",
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
                    value={transformedBidData.mealIncluded ? "Yes" : "No"}
                    placeholder="Meal information"
                    size="large"
                    className="rounded-md"
                    readOnly
                    style={{
                      backgroundColor: "var(--ant-color-warning-bg)",
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
                    onBlur={handleBlurPassengerChange}
                    onChange={handlePassengersChange}
                    placeholder="25"
                    size="large"
                    type="number"
                    prefix={<UserOutlined className="text-gray-400" />}
                    className="rounded-md"
                  />
                  <Text className="text-gray-500 text-sm mt-1">
                    Minimum passenger count: {bidData?.bid?.passengerCount} (can
                    only increase)
                  </Text>
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
                    prefix={<span className="text-gray-400">₹</span>}
                    className="rounded-md"
                  />
                  <Text className="text-gray-500 text-sm mt-1">
                    Minimum bid amount: ₹{originalBidAmount} (can only increase)
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
                      backgroundColor: "var(--ant-color-warning-bg)",
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
                    value={localStorage.getItem("userName") || "Not provided"}
                    placeholder="Name not provided"
                    size="large"
                    className="rounded-md"
                    readOnly
                    style={{
                      backgroundColor: "var(--ant-color-warning-bg)",
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
                    value={localStorage.getItem("userEmail") || "Not provided"}
                    placeholder="Email not provided"
                    size="large"
                    className="rounded-md"
                    readOnly
                    style={{
                      backgroundColor: "var(--ant-color-warning-bg)",
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
                    value={"+1 (555) 123-4567"} // Placeholder as phone isn't stored
                    placeholder="Phone not provided"
                    size="large"
                    className="rounded-md"
                    readOnly
                    style={{
                      backgroundColor: "var(--ant-color-warning-bg)",
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
                    value={currentStatus}
                    placeholder="Status"
                    size="large"
                    className="rounded-md"
                    readOnly
                    style={{
                      backgroundColor: "var(--ant-color-warning-bg)",
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
        <Title level={3} className="!mb-6 text-xl font-semibold text-gray-900">
          Bid Summary
        </Title>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <Row gutter={[24, 20]}>
            <Col xs={24} sm={12} md={6}>
              <div className="text-center">
                <Text className="text-gray-500 text-sm block mb-1">Route</Text>
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
                  {transformedBidData.bidAmount}
                </Text>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="text-center">
                <Text className="text-gray-500 text-sm block mb-1">
                  Total Bid
                </Text>
                <Text className="text-blue-600 font-bold text-2xl">
                  ₹{formatCurrency(passengers * bidAmount)}
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
                ₹{formatCurrency(passengers * bidAmount * 0.1)}
              </Text>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
              <Text className="text-gray-700 font-medium">Refund Policy</Text>
              <Text className="text-green-600 font-semibold">
                {transformedBidData.cancellationTerms}
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

          {!isBidClosed && !hasUserPaid && currentStatus === "Open" && (
              <Button
                type="primary"
                size="large"
                onClick={handleContinueToPayment}
                className="bg-blue-600 hover:bg-blue-700 rounded-md px-8 font-semibold"
              >
                Continue to Payment
              </Button>
            )}

          {hasUserPaid && !isBidClosed && currentStatus === "Under Review" && (
            <div className="flex justify-end">
              <Button
                size="large"
                disabled
                className="px-8 py-2 h-auto font-semibold bg-blue-100 text-blue-700"
              >
                Payment Submitted - Under Review
              </Button>
            </div>
          )}

          {isBidClosed && (
            <div className="flex justify-end">
              <Button
                size="large"
                disabled
                className="px-8 py-2 h-auto font-semibold"
              >
                Bid Closed - Seats Full
              </Button>
            </div>
          )}

          {/* This case might need refinement based on exact 'completed' status meaning */}
          {currentStatus === "Completed" && (
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
  );
}