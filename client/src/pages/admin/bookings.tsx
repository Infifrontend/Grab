import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Table,
  Tag,
  Space,
  Input,
  Select,
  DatePicker,
  Avatar,
  Dropdown,
  Statistic,
  Modal,
  Descriptions,
  Badge,
  message,
  Tabs,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  MoreOutlined,
  ExportOutlined,
  CalendarOutlined,
  UserOutlined,
  DollarOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import QuickBookingForm from "@/components/booking/quick-booking-form";
import ManageBooking from "../manage-booking";
import BreadcrumbNav from "@/components/breadcrumb/breadcrumb";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function Bookings() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [airlineFilter, setAirlineFilter] = useState("all");
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || "dashboard");

  useEffect(() => {
    // Check if admin is logged in
    const isAdminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isAdminLoggedIn) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/admin/login");
  };

  // Fetch flight bookings from API
  const {
    data: flightBookings = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/flight-bookings"],
    queryFn: async () => {
      const response = await fetch("/api/flight-bookings");
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }
      return response.json();
    },
  });

  // Process bookings data for display
  let sortedFlightBookings = flightBookings?.sort((a: any, b: any) => {
    const dateA: any = new Date(a.bookedAt);
    const dateB: any = new Date(b.bookedAt);
    return dateB - dateA; // For descending order (newest first)
  });

  const processedBookings = sortedFlightBookings.map((booking: any) => {
    // Parse comprehensive data if available
    let comprehensiveData = {};
    let groupLeaderName = "N/A";
    let groupLeaderEmail = "N/A";

    if (booking.specialRequests) {
      try {
        comprehensiveData = JSON.parse(booking.specialRequests);
        if (comprehensiveData.groupLeaderInfo) {
          groupLeaderName =
            comprehensiveData.groupLeaderInfo.name ||
            comprehensiveData.groupLeaderInfo.groupLeaderName ||
            "N/A";
          groupLeaderEmail =
            comprehensiveData.groupLeaderInfo.email ||
            comprehensiveData.groupLeaderInfo.groupLeaderEmail ||
            "N/A";
        }
      } catch (e) {
        // If parsing fails, use default values
      }
    }

    return {
      id: booking.id,
      bookingId: booking.bookingReference,
      pnr: booking.pnr, // Added PNR
      groupLeader: groupLeaderName,
      email: groupLeaderEmail,
      route: booking.flight
        ? `${booking.flight.origin} → ${booking.flight.destination}`
        : "N/A",
      departureDate: booking.flight
        ? new Date(booking.flight.departureTime).toISOString().split("T")[0]
        : "N/A",
      passengers: booking.passengerCount || 0,
      totalAmount: parseFloat(booking.totalAmount || "0"),
      status: booking.bookingStatus || "pending",
      bookingDate: booking.bookedAt
        ? new Date(booking.bookedAt).toISOString().split("T")[0]
        : "N/A",
      airline: booking.flight ? booking.flight.airline : "N/A",
      paymentStatus: booking.paymentStatus || "pending",
      flightNumber: booking.flight ? booking.flight.flightNumber : "N/A",
      comprehensiveData,
    };
  });

  // Filter bookings based on search and filters
  const filteredBookings = processedBookings.filter((booking) => {
    const matchesSearch =
      searchText === "" ||
      booking.bookingId.toLowerCase().includes(searchText.toLowerCase()) ||
      booking.groupLeader.toLowerCase().includes(searchText.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchText.toLowerCase()) ||
      booking.pnr.toLowerCase().includes(searchText.toLowerCase()); // Added PNR to search

    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;
    const matchesAirline =
      airlineFilter === "all" ||
      booking.airline.toLowerCase().includes(airlineFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesAirline;
  });

  // Calculate statistics
  const totalBookings = processedBookings.length;
  const totalPassengers = processedBookings.reduce(
    (sum, booking) => sum + booking.passengers,
    0
  );
  const totalRevenue = processedBookings.reduce(
    (sum, booking) => sum + booking.totalAmount,
    0
  );
  const confirmedBookings = processedBookings.filter(
    (booking) => booking.status === "confirmed"
  ).length;

  const columns = [
    {
      title: "Booking ID / PNR",
      dataIndex: "bookingId",
      key: "bookingId",
      sorter: (a, b) => a.bookingId.localeCompare(b.bookingId),
      render: (bookingId, record) => (
        <div>
          <Text strong className="text-blue-600">
            {record.pnr} {/* Display PNR */}
          </Text>
          <br />
          <Text type="secondary" className="text-sm">
            {record.bookingDate !== "N/A"
              ? new Date(record.bookingDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "N/A"}
          </Text>
          <br />
          <Text type="secondary" className="text-xs">
            {record.flightNumber}
          </Text>
        </div>
      ),
    },
    {
      title: "Group Leader",
      key: "groupLeader",
      sorter: (a, b) => a.groupLeader.localeCompare(b.groupLeader),
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <div>
            <Text strong>{record.groupLeader}</Text>
            <br />
            <Text type="secondary" className="text-sm">
              {record.email}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Route & Date",
      key: "route",
      sorter: (a, b) => {
        if (a.departureDate === "N/A" && b.departureDate === "N/A") return 0;
        if (a.departureDate === "N/A") return 1;
        if (b.departureDate === "N/A") return -1;
        return (
          new Date(a.departureDate).getTime() -
          new Date(b.departureDate).getTime()
        );
      },
      render: (text, record) => {
        const origin = record?.comprehensiveData?.tripDetails?.origin;
        const destination = record?.comprehensiveData?.tripDetails?.destination;
        const departureDate =
          record?.comprehensiveData?.tripDetails?.departureDate;

        // Formatting departureDate in DD MMM YYYY format
        const formattedDate = departureDate
          ? new Date(departureDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "N/A";

        return (
          <>
            {origin} - {destination}
            <br />
            {formattedDate}
          </>
        );
      },
    },
    {
      title: "Passengers",
      dataIndex: "passengers",
      key: "passengers",
      sorter: (a, b) => a.passengers - b.passengers,
      render: (passengers) => (
        <div className="text-center">
          <Text strong className="text-lg">
            {passengers}
          </Text>
          <br />
          <Text type="secondary" className="text-sm">
            passengers
          </Text>
        </div>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      render: (amount) => (
        <div>
          <Text strong className="text-green-600 text-lg">
            ${amount.toLocaleString()}
          </Text>
          <br />
          <Text type="secondary" className="text-xs">
            Payment:{" "}
            {filteredBookings.find((b) => b.totalAmount === amount)
              ?.paymentStatus || "pending"}
          </Text>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      filters: [
        { text: "Confirmed", value: "confirmed" },
        { text: "Pending", value: "pending" },
        { text: "Cancelled", value: "cancelled" },
        { text: "Processing", value: "processing" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        const colors = {
          confirmed: "green",
          pending: "orange",
          cancelled: "red",
          processing: "blue",
        };
        return (
          <Tag color={colors[status] || "default"}>
            {status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown"}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewBooking(record)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditBooking(record)}
          />
          <Dropdown
            menu={{
              items: [
                {
                  key: "1",
                  label: "Send Confirmation",
                  icon: <CheckCircleOutlined />,
                  onClick: () => handleSendConfirmation(record),
                },
                {
                  key: "2",
                  label: "Cancel Booking",
                  icon: <MoreOutlined />,
                  onClick: () => handleCancelBooking(record),
                },
                {
                  key: "3",
                  label: "Download Invoice",
                  icon: <ExportOutlined />,
                  onClick: () => handleDownloadInvoice(record),
                },
              ],
            }}
            trigger={["click"]}
          >
            <Button type="text" icon={<MoreOutlined />} size="small" />
          </Dropdown>
        </Space>
      ),
    },
  ];

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setIsModalVisible(true);
  };

  const handleEditBooking = (booking) => {
    navigate(`/booking-details/${booking.bookingId}`);
  };

  const handleSendConfirmation = (booking) => {
    message.success(`Confirmation email sent to ${booking.email}`);
  };

  const handleCancelBooking = (booking) => {
    Modal.confirm({
      title: "Cancel Booking",
      content: `Are you sure you want to cancel booking ${booking.bookingId}?`,
      onOk() {
        message.success(`Booking ${booking.bookingId} has been cancelled`);
        // Here you would typically call an API to update the booking status
      },
    });
  };

  const handleDownloadInvoice = (booking) => {
    message.success(
      `Invoice for booking ${booking.bookingId} is being prepared`
    );
  };

  // Handle manage booking - navigate to existing manage booking flow
  const handleManageBooking = (bookingId) => {
    navigate(`/manage-booking/${bookingId}`);
  };

  if (error) {
    message.error("Failed to fetch booking data");
  }

  // Tab items for the main content
  const tabItems = [
    {
      key: "dashboard",
      label: "Dashboard",
    },
    {
      key: "create-booking",
      label: "Create Group Booking",
    },
    {
      key: "manage-bookings",
      label: "Manage Bookings",
    },
  ];

  return (
    <div className="flex-1 p-6">
      {/* Breadcrumb */}
      <BreadcrumbNav currentMenu="Booking Management" />

      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <Title level={2} className="!mb-1 text-gray-900">
            Booking Management
          </Title>
          <Text className="text-gray-600">
            Manage and track all group travel bookings
          </Text>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        className="mb-2"
      />

      {/* Dashboard Tab Content */}
      {activeTab === "dashboard" && (
        <>
          {/* Stats Cards */}
          <Row gutter={[24, 24]} className="mb-8">
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Bookings"
                  value={totalBookings}
                  prefix={<CalendarOutlined />}
                  valueStyle={{ color: "var(--infiniti-lighter-blue)" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Passengers"
                  value={totalPassengers}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: "var(--ant-color-success)" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Revenue"
                  value={totalRevenue}
                  prefix={<DollarOutlined />}
                  precision={0}
                  valueStyle={{ color: "var(--ant-color-warning)" }}
                  formatter={(value) => `$${value.toLocaleString()}`}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Confirmed Bookings"
                  value={confirmedBookings}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: "var(--textPurple500)" }}
                />
              </Card>
            </Col>
          </Row>

          {/* Filters */}
          <Card className="mb-6">
            <Space className="w-full" direction="horizontal" wrap>
              <Input
                placeholder="Search bookings..."
                prefix={<SearchOutlined />}
                style={{ width: 250 }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Select
                placeholder="Status"
                style={{ width: 120 }}
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { value: "all", label: "All Status" },
                  { value: "confirmed", label: "Confirmed" },
                  { value: "pending", label: "Pending" },
                  { value: "cancelled", label: "Cancelled" },
                ]}
              />
              <Select
                placeholder="Airline"
                style={{ width: 150 }}
                value={airlineFilter}
                onChange={setAirlineFilter}
                options={[
                  { value: "all", label: "All Airlines" },
                  ...Array.from(
                    new Set(processedBookings.map((b) => b.airline))
                  )
                    .filter((airline) => airline !== "N/A")
                    .map((airline) => ({
                      value: airline,
                      label: airline,
                    })),
                ]}
              />
              <RangePicker placeholder={["Start Date", "End Date"]} />
              <Button icon={<ExportOutlined />}>Export Data</Button>
            </Space>
          </Card>

          {/* Bookings Table */}
          <Card>
            <Table
              columns={columns}
              dataSource={filteredBookings}
              loading={isLoading}
              rowKey="id"
              pagination={{
                total: filteredBookings.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} bookings`,
              }}
            />
          </Card>
        </>
      )}

      {/* Create Group Booking Tab Content */}
      {activeTab === "create-booking" && (
        <div className="">
          <div className="mb-6">
            <Title level={3} className="!mb-2 text-gray-900">
              Create New Group Booking
            </Title>
            <Text className="text-gray-600">
              Start a new group travel booking for your organization
            </Text>
          </div>

          <Row gutter={24}>
            <Col xs={24} lg={14}>
              <Card className="h-fit">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Admin Quick Booking
                  </h2>
                  <p className="text-sm text-gray-600">
                    Create a new group booking and navigate through the complete
                    booking flow
                  </p>
                </div>
                {/* Booking form */}
                <QuickBookingForm />
              </Card>
            </Col>
            <Col xs={24} lg={10}>
              <Card>
                <div className="mb-4">
                  <Title level={4} className="!mb-2 text-gray-900">
                    Admin Booking Tools
                  </Title>
                  <Text className="text-gray-600">
                    Additional tools for managing group bookings
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
                        Bulk Passenger Import
                      </div>
                      <div className="text-sm text-gray-600">
                        Upload CSV file with passenger details
                      </div>
                    </div>
                  </Button>

                  <Button
                    size="large"
                    className="w-full text-left flex items-center justify-start"
                    style={{ height: "auto", padding: "12px 16px" }}
                  >
                    <div>
                      <div className="font-medium text-gray-900">
                        Corporate Discount
                      </div>
                      <div className="text-sm text-gray-600">
                        Apply special pricing for corporate clients
                      </div>
                    </div>
                  </Button>

                  <Button
                    size="large"
                    className="w-full text-left flex items-center justify-start"
                    style={{ height: "auto", padding: "12px 16px" }}
                  >
                    <div>
                      <div className="font-medium text-gray-900">
                        Payment Options
                      </div>
                      <div className="text-sm text-gray-600">
                        Configure payment schedules and methods
                      </div>
                    </div>
                  </Button>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      )}

      {/* Manage Bookings Tab Content */}
      {activeTab === "manage-bookings" && <ManageBooking />}

      {/* Booking Details Modal */}
      <Modal
        title="Booking Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
          <Button
            key="edit"
            type="primary"
            onClick={() => {
              setIsModalVisible(false);
              handleEditBooking(selectedBooking);
            }}
          >
            Edit Booking
          </Button>,
        ]}
        width={800}
      >
        {selectedBooking && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="PNR"> {/* Updated Label */}
              {selectedBooking.pnr} {/* Display PNR */}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag
                color={
                  selectedBooking.status === "confirmed"
                    ? "green"
                    : selectedBooking.status === "pending"
                    ? "orange"
                    : "red"
                }
              >
                {selectedBooking.status?.charAt(0).toUpperCase() +
                  selectedBooking.status?.slice(1)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Group Leader">
              {selectedBooking.groupLeader}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedBooking.email}
            </Descriptions.Item>
            <Descriptions.Item label="Route">
              {selectedBooking.comprehensiveData?.tripDetails?.origin || "N/A"}{" "}
              {" - "}
              {selectedBooking.comprehensiveData?.tripDetails?.destination ||
                "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Departure Date">
              {selectedBooking.comprehensiveData?.tripDetails?.departureDate !==
              "N/A"
                ? new Date(
                    selectedBooking.comprehensiveData?.tripDetails?.departureDate
                  ).toLocaleDateString()
                : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Passengers">
              {selectedBooking.passengers}
            </Descriptions.Item>
            <Descriptions.Item label="Total Amount">
              ${selectedBooking.totalAmount.toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Airline">
              {selectedBooking.comprehensiveData?.flightDetails?.outbound
                ?.airline || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Flight Number">
              {selectedBooking.comprehensiveData?.flightDetails?.outbound
                ?.flightNumber || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Payment Status">
              <Tag
                color={
                  selectedBooking.paymentStatus === "paid" ? "green" : "orange"
                }
              >
                {selectedBooking.paymentStatus?.charAt(0).toUpperCase() +
                  selectedBooking.paymentStatus?.slice(1)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Booking Date">
              {selectedBooking.bookingDate !== "N/A"
                ? new Date(selectedBooking.bookingDate).toLocaleDateString()
                : "N/A"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}