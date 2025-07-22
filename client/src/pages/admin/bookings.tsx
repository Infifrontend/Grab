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
  LogoutOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function Bookings() {
  const [, setLocation] = useLocation();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [airlineFilter, setAirlineFilter] = useState("all");

  useEffect(() => {
    // Check if admin is logged in
    const isAdminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isAdminLoggedIn) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    setLocation("/admin/login");
  };

  // Fetch flight bookings from API
  const { data: flightBookings = [], isLoading, error } = useQuery({
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
  const processedBookings = flightBookings.map((booking) => {
    // Parse comprehensive data if available
    let comprehensiveData = {};
    let groupLeaderName = "N/A";
    let groupLeaderEmail = "N/A";

    if (booking.specialRequests) {
      try {
        comprehensiveData = JSON.parse(booking.specialRequests);
        if (comprehensiveData.groupLeaderInfo) {
          groupLeaderName = comprehensiveData.groupLeaderInfo.name || comprehensiveData.groupLeaderInfo.groupLeaderName || "N/A";
          groupLeaderEmail = comprehensiveData.groupLeaderInfo.email || comprehensiveData.groupLeaderInfo.groupLeaderEmail || "N/A";
        }
      } catch (e) {
        // If parsing fails, use default values
      }
    }

    return {
      id: booking.id,
      bookingId: booking.bookingReference,
      groupLeader: groupLeaderName,
      email: groupLeaderEmail,
      route: booking.flight ? `${booking.flight.origin} → ${booking.flight.destination}` : "N/A",
      departureDate: booking.flight ? new Date(booking.flight.departureTime).toISOString().split('T')[0] : "N/A",
      passengers: booking.passengerCount || 0,
      totalAmount: parseFloat(booking.totalAmount || "0"),
      status: booking.bookingStatus || "pending",
      bookingDate: booking.bookedAt ? new Date(booking.bookedAt).toISOString().split('T')[0] : "N/A",
      airline: booking.flight ? booking.flight.airline : "N/A",
      paymentStatus: booking.paymentStatus || "pending",
      flightNumber: booking.flight ? booking.flight.flightNumber : "N/A",
      comprehensiveData
    };
  });

  // Filter bookings based on search and filters
  const filteredBookings = processedBookings.filter((booking) => {
    const matchesSearch = searchText === "" || 
      booking.bookingId.toLowerCase().includes(searchText.toLowerCase()) ||
      booking.groupLeader.toLowerCase().includes(searchText.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    const matchesAirline = airlineFilter === "all" || booking.airline.toLowerCase().includes(airlineFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesAirline;
  });

  // Calculate statistics
  const totalBookings = processedBookings.length;
  const totalPassengers = processedBookings.reduce((sum, booking) => sum + booking.passengers, 0);
  const totalRevenue = processedBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
  const confirmedBookings = processedBookings.filter(booking => booking.status === "confirmed").length;

  const columns = [
    {
      title: "Booking ID",
      dataIndex: "bookingId",
      key: "bookingId",
      sorter: (a, b) => a.bookingId.localeCompare(b.bookingId),
      render: (bookingId, record) => (
        <div>
          <Text strong className="text-blue-600">
            {bookingId}
          </Text>
          <br />
          <Text type="secondary" className="text-sm">
            {record.bookingDate !== "N/A" ? new Date(record.bookingDate).toLocaleDateString() : "N/A"}
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
          <Avatar size="small" icon={<UserOutlined />} />
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
        return new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime();
      },
      render: (_, record) => (
        <div>
          <Text strong>{record.route}</Text>
          <br />
          <Text type="secondary" className="text-sm">
            {record.departureDate !== "N/A" ? new Date(record.departureDate).toLocaleDateString() : "N/A"}
          </Text>
          <br />
          <Text type="secondary" className="text-xs">
            {record.airline}
          </Text>
        </div>
      ),
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
            ₹{amount.toLocaleString()}
          </Text>
          <br />
          <Text type="secondary" className="text-xs">
            Payment: {filteredBookings.find(b => b.totalAmount === amount)?.paymentStatus || "pending"}
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
        return <Tag color={colors[status] || "default"}>{status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown"}</Tag>;
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
    setLocation(`/booking-details/${booking.bookingId}`);
  };

  const handleSendConfirmation = (booking) => {
    message.success(`Confirmation email sent to ${booking.email}`);
  };

  const handleCancelBooking = (booking) => {
    Modal.confirm({
      title: 'Cancel Booking',
      content: `Are you sure you want to cancel booking ${booking.bookingId}?`,
      onOk() {
        message.success(`Booking ${booking.bookingId} has been cancelled`);
        // Here you would typically call an API to update the booking status
      },
    });
  };

  const handleDownloadInvoice = (booking) => {
    message.success(`Invoice for booking ${booking.bookingId} is being prepared`);
  };

  if (error) {
    message.error("Failed to fetch booking data");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">GR</span>
                </div>
                <div>
                  <Text className="text-gray-600 text-sm font-medium">
                    GROUP RETAIL
                  </Text>
                  <br />
                  <Text className="text-gray-500 text-xs">ADMIN PORTAL</Text>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge count={5} size="small">
                <BellOutlined className="text-gray-500 text-lg" />
              </Badge>
              <Avatar size="small" className="bg-blue-600">
                <span className="text-white font-medium">JD</span>
              </Avatar>
              <div className="text-right">
                <Text className="font-medium text-gray-900 block">
                  John Doe
                </Text>
                <Text className="text-gray-500 text-sm">System Admin</Text>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 sticky top-[73px] shadow-xl" style={{ height: 'calc(100vh - 73px)' }}>
          <div className="h-full overflow-y-auto">
            <div className="p-6">
              <nav className="space-y-2">
              <div
                className="flex items-center space-x-3 text-slate-300 hover:text-white px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 cursor-pointer transition-all duration-200"
                onClick={() => setLocation("/admin/dashboard")}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-current text-xs">📊</span>
                </div>
                <Text className="text-current">Dashboard</Text>
              </div>
              <div
                className="flex items-center space-x-3 text-slate-300 hover:text-white px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 cursor-pointer transition-all duration-200"
                onClick={() => setLocation("/admin/offer-management")}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-current text-xs">🎯</span>
                </div>
                <Text className="text-current">Offer Management</Text>
              </div>
              <div
                className="flex items-center space-x-3 text-slate-300 hover:text-white px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 cursor-pointer transition-all duration-200"
                onClick={() => setLocation("/admin/bid-management")}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-current text-xs">🏆</span>
                </div>
                <Text className="text-current">Bid Management</Text>
              </div>
              <div className="flex items-center space-x-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg px-4 py-3 shadow-md">
                <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                  <span className="text-blue-600 text-xs">📅</span>
                </div>
                <Text className="text-white font-medium">
                  Booking Management
                </Text>
              </div>
              <div
                className="flex items-center space-x-3 text-slate-300 hover:text-white px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 cursor-pointer transition-all duration-200"
                onClick={() => setLocation("/admin/cms")}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-current text-xs">📝</span>
                </div>
                <Text className="text-current">CMS Management</Text>
              </div>
              <div
                className="flex items-center space-x-3 text-slate-300 hover:text-white px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 cursor-pointer transition-all duration-200"
                onClick={() => setLocation("/admin/reports")}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-current text-xs">📊</span>
                </div>
                <Text className="text-current">Reports & Analytics</Text>
              </div>
              <div
                className="flex items-center space-x-3 text-slate-300 hover:text-white px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 cursor-pointer transition-all duration-200"
                onClick={() => setLocation("/admin/admin-settings")}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-current text-xs">🔧</span>
                </div>
                <Text className="text-current">System Settings</Text>
              </div>
            </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <Title level={2} className="!mb-1 text-gray-900">
                Booking Management
              </Title>
              <Text className="text-gray-600">
                Manage and track all group travel bookings
              </Text>
            </div>
            <Space>
              <Button icon={<ExportOutlined />}>Export Data</Button>
            </Space>
          </div>

          {/* Stats Cards */}
          <Row gutter={[24, 24]} className="mb-8">
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Bookings"
                  value={totalBookings}
                  prefix={<CalendarOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Passengers"
                  value={totalPassengers}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: "#52c41a" }}
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
                  valueStyle={{ color: "#faad14" }}
                  formatter={(value) => `₹${value.toLocaleString()}`}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Confirmed Bookings"
                  value={confirmedBookings}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: "#722ed1" }}
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
                  ...Array.from(new Set(processedBookings.map(b => b.airline)))
                    .filter(airline => airline !== "N/A")
                    .map(airline => ({
                      value: airline,
                      label: airline
                    }))
                ]}
              />
              <RangePicker placeholder={["Start Date", "End Date"]} />
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
                <Descriptions.Item label="Booking ID">
                  {selectedBooking.bookingId}
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
                    {selectedBooking.status?.charAt(0).toUpperCase() + selectedBooking.status?.slice(1)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Group Leader">
                  {selectedBooking.groupLeader}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {selectedBooking.email}
                </Descriptions.Item>
                <Descriptions.Item label="Route">
                  {selectedBooking.route}
                </Descriptions.Item>
                <Descriptions.Item label="Departure Date">
                  {selectedBooking.departureDate !== "N/A" ? 
                    new Date(selectedBooking.departureDate).toLocaleDateString() : 
                    "N/A"
                  }
                </Descriptions.Item>
                <Descriptions.Item label="Passengers">
                  {selectedBooking.passengers}
                </Descriptions.Item>
                <Descriptions.Item label="Total Amount">
                  ₹{selectedBooking.totalAmount.toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Airline">
                  {selectedBooking.airline}
                </Descriptions.Item>
                <Descriptions.Item label="Flight Number">
                  {selectedBooking.flightNumber}
                </Descriptions.Item>
                <Descriptions.Item label="Payment Status">
                  <Tag color={selectedBooking.paymentStatus === "paid" ? "green" : "orange"}>
                    {selectedBooking.paymentStatus?.charAt(0).toUpperCase() + selectedBooking.paymentStatus?.slice(1)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Booking Date">
                  {selectedBooking.bookingDate !== "N/A" ? 
                    new Date(selectedBooking.bookingDate).toLocaleDateString() : 
                    "N/A"
                  }
                </Descriptions.Item>
              </Descriptions>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
}
