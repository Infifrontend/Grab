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
  Table,
  Tag,
} from "antd";
import {
  SearchOutlined,
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import type { Booking } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { BookOpen } from "lucide-react";
const { Title, Text } = Typography;

export default function ManageBooking() {
  const [bookingId, setBookingId] = useState("");
  const navigate = useNavigate();
  const adminMode = JSON.parse(
    localStorage.getItem("adminLoggedIn") || "false",
  );
  const userMode = JSON.parse(localStorage.getItem("userLoggedIn") || "false");
  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  // Fetch real data from API
  const { data: flightBookingsData = [] } = useQuery({
    queryKey: ["flight-bookings"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/flight-bookings");
      return response.json();
    },
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
      message.error("Please enter a PNR.");
      return;
    }

    try {
      // Fetch booking details from the API using the booking ID
      const response = await fetch(`/api/booking-details/${bookingId}`);

      if (!response.ok) {
        if (response.status === 404) {
          message.error("Booking not found. Please check your PNR.");
        } else {
          message.error("Error fetching booking details. Please try again.");
        }
        return;
      }

      const bookingDetails = await response.json();

      // Show success message with passenger count
      const passengerCount =
        bookingDetails.booking?.passengerCount ||
        bookingDetails.passengers?.length ||
        1;
      message.success(`Booking found! ${passengerCount} confirmed passengers`);

      // Navigate to the booking details page with the retrieved data
      navigate(
        adminMode
          ? `/admin/manage-booking/${bookingId}`
          : `/manage-booking/${bookingId}`,
      );
    } catch (error) {
      console.error("Error fetching booking:", error);
      message.error("Error fetching booking details. Please try again.");
    }
  };

  const handleEditBooking = async (bookingId: any) => {
    console.log("Finding booking:", { bookingId });

    if (!bookingId) {
      message.error("Please enter a PNR.");
      return;
    }

    try {
      // Fetch booking details from the API using the booking ID
      const response = await fetch(`/api/booking-details/${bookingId}`);

      if (!response.ok) {
        if (response.status === 404) {
          message.error("Booking not found. Please check your PNR.");
        } else {
          message.error("Error fetching booking details. Please try again.");
        }
        return;
      }

      const bookingDetails = await response.json();

      // Show success message with passenger count
      const passengerCount =
        bookingDetails.booking?.passengerCount ||
        bookingDetails.passengers?.length ||
        1;
      message.success(`Booking found! ${passengerCount} confirmed passengers`);

      // Navigate to the booking details page with the retrieved data
      navigate(
        adminMode
          ? `/admin/manage-booking/${bookingId}`
          : `/manage-booking/${bookingId}`,
      );
    } catch (error) {
      console.error("Error fetching booking:", error);
      message.error("Error fetching booking details. Please try again.");
    }
  };

  const handleManageBooking = (booking: Booking) => {
    navigate(
      adminMode
        ? `/admin/manage-booking/${bookingId}`
        : `/manage-booking/${bookingId}`,
    );
  };

  const getStatusColor = (status: string) => {
    console.log(status);

    switch (status.toLowerCase()) {
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

  const handleNewBooking = () => {
    navigate(adminMode ? "/admin/bookings" : "/new-booking");
  };

  const handleViewBooking = (bookingId: any) => {
    navigate(
      adminMode
        ? `/admin/booking-details/${bookingId}`
        : `/booking-details/${bookingId}`,
    );
  };

  // Transform real booking data for table and sort by creation date (latest first)
  const bookingsTableData = flightBookingsData
    .sort((a, b) => {
      const dateA = new Date(a.bookedAt || a.createdAt || 0);
      const dateB = new Date(b.bookedAt || b.createdAt || 0);
      return dateB.getTime() - dateA.getTime(); // Descending order (latest first)
    })
    .map((booking, index) => {
      // Extract route information from flight data or comprehensive data
      let route = "Route not available";
      let departureDate = "Date not available";
      let returnDate = null;

      if (booking.flight) {
        // Use flight data if available
        route = `${booking.flight.origin} → ${booking.flight.destination}`;
        departureDate = new Date(booking.flight.departureTime)
          .toISOString()
          .split("T")[0];
        returnDate = booking.flight.arrivalTime
          ? new Date(booking.flight.arrivalTime).toISOString().split("T")[0]
          : null;
      } else if (booking.specialRequests) {
        // Try to parse comprehensive data from specialRequests
        try {
          const comprehensiveData = JSON.parse(booking.specialRequests);

          // Check for trip details
          if (comprehensiveData.tripDetails) {
            const tripDetails = comprehensiveData.tripDetails;
            if (tripDetails.origin && tripDetails.destination) {
              route = `${tripDetails.origin} → ${tripDetails.destination}`;
            }
            if (tripDetails.departureDate) {
              departureDate = new Date(tripDetails.departureDate)
                .toISOString()
                .split("T")[0];
            }
            if (tripDetails.returnDate) {
              returnDate = new Date(tripDetails.returnDate)
                .toISOString()
                .split("T")[0];
            }
          }

          // Check for flight details
          if (comprehensiveData.flightDetails) {
            const flightDetails = comprehensiveData.flightDetails;
            if (flightDetails.outbound) {
              if (
                flightDetails.outbound.origin &&
                flightDetails.outbound.destination
              ) {
                route = `${flightDetails.outbound.origin} → ${flightDetails.outbound.destination}`;
              }
              if (flightDetails.outbound.departureTime) {
                departureDate = new Date(flightDetails.outbound.departureTime)
                  .toISOString()
                  .split("T")[0];
              }
            }
            if (flightDetails.return && flightDetails.return.arrivalTime) {
              returnDate = new Date(flightDetails.return.arrivalTime)
                .toISOString()
                .split("T")[0];
            }
          }
        } catch (e) {
          // If parsing fails, keep default values
          console.warn("Could not parse comprehensive booking data:", e);
        }
      }

      return {
        key: booking.id,
        pnr: booking.pnr,
        groupType: "Group Travel", // Default since we don't have this field
        route: route,
        date: departureDate,
        returnDate: returnDate,
        passengers: booking.passengerCount,
        status: booking.bookingStatus,
        booking: booking, // Keep reference to original booking for debugging
      };
    });

  return (
    <div className={`${adminMode ? "flex-1" : "max-w-7xl p-6"} mx-auto`}>
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
                Enter your booking details to access and manage your reservation
              </Text>
            </div>

            <Space direction="vertical" size="large" className="w-full">
              <div>
                <Text className="block mb-2 text-gray-700 font-medium">
                  PNR
                </Text>
                <Input
                  size="large"
                  placeholder="Enter booking reference, PNR, or email"
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
                Can't find your booking or need assistance? Check your booking
                to view confirmed passenger counts and manage your reservation.
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
      {(userMode || adminMode) && (
        <div>
          {/* Bookings Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <Title level={3} className="!mb-1 text-gray-900">
                Your Bookings
              </Title>
              <Text className="text-gray-600">
                Manage and track all your group bookings
              </Text>
            </div>
          </div>

          {/* Bookings Table */}
          <Card className="border-0 shadow-sm">
            {bookingsTableData.length > 0 ? (
              <Table
                dataSource={bookingsTableData}
                rowKey="key"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} bookings`,
                  pageSizeOptions: ["5", "10", "20", "50"],
                  className: "px-6 pb-4",
                }}
                className="w-full"
                scroll={{ x: "max-content" }}
                columns={[
                  {
                    title: "PNR",
                    dataIndex: "pnr",
                    key: "pnr",
                    fixed: "left",
                    width: 150,
                    render: (text) => (
                      <span className="font-semibold text-[var(--infiniti-primary)]">
                        {text}
                      </span>
                    ),
                    sorter: (a, b) => a.pnr.localeCompare(b.pnr),
                  },
                  // {
                  //   title: "Group Type",
                  //   dataIndex: "groupType",
                  //   key: "groupType",
                  //   width: 120,
                  //   render: (text) => (
                  //     <span className="text-gray-700 capitalize">{text}</span>
                  //   ),
                  //   filters: [
                  //     { text: "Group Travel", value: "Group Travel" },
                  //     { text: "Corporate", value: "Corporate" },
                  //     { text: "Family", value: "Family" },
                  //   ],
                  //   onFilter: (value, record) => record.groupType === value,
                  // },
                  {
                    title: "Route",
                    dataIndex: "route",
                    key: "route",
                    width: 200,
                    render: (text) => (
                      <span className="text-gray-900 font-medium">{text}</span>
                    ),
                    sorter: (a, b) => a.route.localeCompare(b.route),
                  },
                  {
                    title: "Departure",
                    dataIndex: "date",
                    key: "date",
                    width: 120,
                    render: (date) => {
                      if (!date || date === "Date not available")
                        return (
                          <span className="text-gray-500">Not available</span>
                        );
                      try {
                        return (
                          <span className="text-gray-600">
                            {new Date(date).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        );
                      } catch (e) {
                        return (
                          <span className="text-gray-500">Invalid date</span>
                        );
                      }
                    },
                    sorter: (a, b) => {
                      if (
                        a.date === "Date not available" &&
                        b.date === "Date not available"
                      )
                        return 0;
                      if (a.date === "Date not available") return 1;
                      if (b.date === "Date not available") return -1;
                      try {
                        return (
                          new Date(a.date).getTime() -
                          new Date(b.date).getTime()
                        );
                      } catch (e) {
                        return 0;
                      }
                    },
                  },
                  {
                    title: "Return",
                    dataIndex: "returnDate",
                    key: "returnDate",
                    width: 120,
                    render: (returnDate) => {
                      if (!returnDate)
                        return <span className="text-gray-500">One-way</span>;
                      try {
                        return (
                          <span className="text-gray-600">
                            {new Date(returnDate).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        );
                      } catch (e) {
                        return (
                          <span className="text-gray-500">Invalid date</span>
                        );
                      }
                    },
                  },
                  {
                    title: "Passengers",
                    dataIndex: "passengers",
                    key: "passengers",
                    width: 100,
                    render: (passengers) => (
                      <span className="text-gray-700 font-medium">
                        {passengers}
                      </span>
                    ),
                    sorter: (a, b) => a.passengers - b.passengers,
                  },
                  {
                    title: "Status",
                    dataIndex: "status",
                    key: "status",
                    width: 120,
                    render: (status) => (
                      <Tag
                        className="px-3 py-1 text-xs font-semibold capitalize"
                        color={getStatusColor(status)}
                      >
                        {status}
                      </Tag>
                    ),
                    filters: [
                      { text: "Confirmed", value: "confirmed" },
                      { text: "Pending", value: "pending" },
                      { text: "Cancelled", value: "cancelled" },
                    ],
                    onFilter: (value, record) => record.status === value,
                  },
                  {
                    title: "Actions",
                    key: "actions",
                    fixed: "right",
                    width: 120,
                    render: (value, record) => {
                      console.log(record, "recordrecord");

                      return (
                        <>
                          <Button
                            type="link"
                            className="text-[var(--infiniti-primary)] p-0 font-medium hover:underline mr-3"
                            onClick={() => handleViewBooking(record.pnr)}
                            title="view"
                          >
                            <EyeOutlined />
                          </Button>
                          <Button
                            type="link"
                            className="text-[var(--infiniti-primary)] p-0 font-medium hover:underline mr-3"
                            onClick={() => handleEditBooking(record.pnr)}
                            title="edit"
                          >
                            <EditOutlined />
                          </Button>
                        </>
                      );
                    },
                  },
                ]}
              />
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <Title level={4} className="text-gray-500 !mb-2">
                  No bookings yet
                </Title>
                <Text className="block text-gray-400 mb-6">
                  Start by creating your first group booking
                </Text>
                <Button
                  type="primary"
                  className="infiniti-btn-primary"
                  onClick={handleNewBooking}
                >
                  Create New Booking
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
