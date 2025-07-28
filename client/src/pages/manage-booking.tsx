import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Input,
  Button,
  Badge,
  Spin,
  message,
} from "antd";
import {
  SearchOutlined,
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import Header from "@/components/layout/header";
import type { Booking } from "@shared/schema";

const { Title, Text } = Typography;

export default function ManageBooking() {
  const [bookingId, setBookingId] = useState("");
  const navigate = useNavigate();

  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  const {
    data: flightBookings,
    refetch: refetchFlightBookings,
    isLoading: isFlightBookingsLoading,
  } = useQuery({
    queryKey: ["/api/flight-bookings"],
  });

  // Refresh data when component mounts
  useEffect(() => {
    refetchFlightBookings();
  }, [refetchFlightBookings]);

  // Get recent flight bookings sorted by created_at/bookedAt
  const recentBookings =
    flightBookings
      ?.slice()
      .sort((a: any, b: any) => {
        const dateA = new Date(a.bookedAt || a.createdAt || 0);
        const dateB = new Date(b.bookedAt || b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 3) || [];

  const handleFindBooking = async () => {
    console.log("Finding booking:", { bookingId });

    if (!bookingId) {
      message.error("Please enter a booking ID.");
      return;
    }

    try {
      // Fetch booking details from the API using the booking ID
      const response = await fetch(`/api/booking-details/${bookingId}`);

      if (!response.ok) {
        if (response.status === 404) {
          message.error(
            "Booking not found. Please check your booking ID.",
          );
        } else {
          message.error("Error fetching booking details. Please try again.");
        }
        return;
      }

      const bookingDetails = await response.json();

      // Show success message with passenger count
      const passengerCount = bookingDetails.booking?.passengerCount || bookingDetails.passengers?.length || 1;
      message.success(`Booking found! ${passengerCount} confirmed passengers`);

      // Navigate to the booking details page with the retrieved data
      navigate(`/manage-booking/${bookingId}`);
    } catch (error) {
      console.error("Error fetching booking:", error);
      message.error("Error fetching booking details. Please try again.");
    }
  };

  const handleManageBooking = (booking: Booking) => {
    navigate(`/manage-booking/${booking.id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
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
          <Title level={2} className="!mb-2 text-gray-900">
            Manage Your Booking
          </Title>
          <Text className="text-gray-600 text-base">
            Access and modify your existing group bookings, add passengers, or
            update travel details
          </Text>
        </div>

        {/* Main Content */}
        <Row gutter={[24, 24]}>
          {/* Find Booking Form */}
          <Col xs={24} lg={14}>
            <Card className="mb-6">
              <div className="mb-6">
                <Title level={4} className="!mb-2 text-gray-900">
                  Find Your Booking
                </Title>
                <Text className="text-gray-600">
                  Enter your booking details to access and manage your
                  reservation
                </Text>
              </div>

              <Space direction="vertical" size="large" className="w-full">
                <div>
                  <Text className="block mb-2 text-gray-700 font-medium">
                    Booking ID
                  </Text>
                  <Input
                    size="large"
                    placeholder="Enter booking ID (e.g., GR-2024-1001)"
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
                    className="w-full"
                  />
                </div>

                <Button
                  type="primary"
                  size="large"
                  icon={<SearchOutlined />}
                  onClick={handleFindBooking}
                  disabled={!bookingId.trim()}
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
                <Title level={4} className="!mb-2 text-gray-900">
                  Need Help?
                </Title>
                <Text className="text-gray-600">
                  Can't find your booking or need assistance? Check your booking to view confirmed passenger counts and manage your reservation.
                </Text>
              </div>

              <Space direction="vertical" size="middle" className="w-full">
                <Button
                  size="large"
                  className="w-full text-left flex items-center justify-start"
                  style={{ height: "auto", padding: "12px 16px" }}
                >
                  <div>
                    <div className="font-medium text-gray-900">
                      Contact Support
                    </div>
                  </div>
                </Button>

                <Button
                  size="large"
                  className="w-full text-left flex items-center justify-start"
                  style={{ height: "auto", padding: "12px 16px" }}
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
          <Title level={4} className="!mb-6 text-gray-900">
            Recent Bookings
          </Title>

          <Row gutter={[24, 24]}>
            {recentBookings.map((booking: any) => (
              <Col xs={24} lg={8} key={booking.id}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <div className="mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <Text className="font-bold text-lg text-[var(--infiniti-primary)]">
                        {booking.bookingReference}
                      </Text>
                      <Badge
                        status={getStatusColor(booking.bookingStatus)}
                        text={getStatusText(booking.bookingStatus)}
                        className="font-medium"
                      />
                    </div>
                    <Text className="text-gray-600 block mb-3 capitalize">
                      Flight Booking
                    </Text>
                  </div>

                  <Space
                    direction="vertical"
                    size="small"
                    className="w-full mb-4"
                  >
                    <div className="flex items-center gap-2 text-gray-600">
                      <UserOutlined className="text-sm" />
                      <Text className="text-sm font-medium">
                        Flight ID: {booking.flightId}
                      </Text>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <CalendarOutlined className="text-sm" />
                      <Text className="text-sm">
                        Booked:{" "}
                        {booking.bookedAt
                          ? format(new Date(booking.bookedAt), "dd MMM yyyy")
                          : "N/A"}
                      </Text>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <TeamOutlined className="text-sm" />
                      <Text className="text-sm">
                        {booking.passengerCount} confirmed passengers
                      </Text>
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
                    onClick={() =>
                      navigate(
                        `/booking-details/${booking.bookingReference}`,
                      )
                    }
                  >
                    View Details
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Empty state */}
          {(!flightBookings || flightBookings.length === 0) &&
            !isFlightBookingsLoading && (
              <Card className="text-center py-12">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <CalendarOutlined className="text-2xl text-gray-400" />
                  </div>
                  <div>
                    <Title level={4} className="!mb-2 text-gray-600">
                      No Recent Bookings
                    </Title>
                    <Text className="text-gray-500">
                      You haven't made any bookings yet. Start by creating your
                      first group booking and managing passenger information.
                    </Text>
                  </div>
                  <Button
                    type="primary"
                    className="infiniti-btn-primary mt-4"
                    onClick={() => navigate("/new-booking")}
                  >
                    Create New Booking
                  </Button>
                </div>
              </Card>
            )}

          {/* Loading state */}
          {isFlightBookingsLoading && (
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