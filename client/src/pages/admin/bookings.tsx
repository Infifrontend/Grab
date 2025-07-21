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

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function Bookings() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const mockBookings = [
    {
      id: 1,
      bookingId: "GR-2024-1001",
      groupLeader: "John Smith",
      email: "john.smith@company.com",
      route: "LAX → JFK",
      departureDate: "2024-02-15",
      passengers: 15,
      totalAmount: 18750,
      status: "Confirmed",
      bookingDate: "2024-01-10",
      airline: "American Airlines",
    },
    {
      id: 2,
      bookingId: "GR-2024-1002",
      groupLeader: "Sarah Johnson",
      email: "sarah.j@corp.com",
      route: "ORD → LAX",
      departureDate: "2024-02-20",
      passengers: 12,
      totalAmount: 14400,
      status: "Pending",
      bookingDate: "2024-01-12",
      airline: "United Airlines",
    },
    {
      id: 3,
      bookingId: "GR-2024-1003",
      groupLeader: "Mike Wilson",
      email: "mike.wilson@org.com",
      route: "MIA → SFO",
      departureDate: "2024-02-25",
      passengers: 8,
      totalAmount: 9600,
      status: "Cancelled",
      bookingDate: "2024-01-15",
      airline: "Delta Airlines",
    },
  ];

  const columns = [
    {
      title: "Booking ID",
      dataIndex: "bookingId",
      key: "bookingId",
      render: (bookingId, record) => (
        <div>
          <Text strong className="text-blue-600">
            {bookingId}
          </Text>
          <br />
          <Text type="secondary" className="text-sm">
            {record.bookingDate}
          </Text>
        </div>
      ),
    },
    {
      title: "Group Leader",
      key: "groupLeader",
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
      render: (_, record) => (
        <div>
          <Text strong>{record.route}</Text>
          <br />
          <Text type="secondary" className="text-sm">
            {record.departureDate}
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
      render: (amount) => (
        <Text strong className="text-green-600 text-lg">
          ${amount.toLocaleString()}
        </Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colors = {
          Confirmed: "green",
          Pending: "orange",
          Cancelled: "red",
          Processing: "blue",
        };
        return <Tag color={colors[status]}>{status}</Tag>;
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
          <Button type="text" icon={<EditOutlined />} size="small" />
          <Dropdown
            menu={{
              items: [
                {
                  key: "1",
                  label: "Send Confirmation",
                  icon: <CheckCircleOutlined />,
                },
                { key: "2", label: "Cancel Booking", icon: <MoreOutlined /> },
                {
                  key: "3",
                  label: "Download Invoice",
                  icon: <ExportOutlined />,
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
                  value={1247}
                  prefix={<CalendarOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Passengers"
                  value={15634}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Revenue"
                  value={2850000}
                  prefix={<DollarOutlined />}
                  precision={0}
                  valueStyle={{ color: "#faad14" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Confirmed Bookings"
                  value={967}
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
              />
              <Select
                placeholder="Status"
                style={{ width: 120 }}
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
                options={[
                  { value: "all", label: "All Airlines" },
                  { value: "american", label: "American Airlines" },
                  { value: "united", label: "United Airlines" },
                  { value: "delta", label: "Delta Airlines" },
                ]}
              />
              <RangePicker placeholder={["Start Date", "End Date"]} />
            </Space>
          </Card>

          {/* Bookings Table */}
          <Card>
            <Table
              columns={columns}
              dataSource={mockBookings}
              loading={loading}
              rowKey="id"
              pagination={{
                total: mockBookings.length,
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
              <Button key="edit" type="primary">
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
                      selectedBooking.status === "Confirmed"
                        ? "green"
                        : "orange"
                    }
                  >
                    {selectedBooking.status}
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
                  {selectedBooking.departureDate}
                </Descriptions.Item>
                <Descriptions.Item label="Passengers">
                  {selectedBooking.passengers}
                </Descriptions.Item>
                <Descriptions.Item label="Total Amount">
                  ${selectedBooking.totalAmount.toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Airline">
                  {selectedBooking.airline}
                </Descriptions.Item>
                <Descriptions.Item label="Booking Date">
                  {selectedBooking.bookingDate}
                </Descriptions.Item>
              </Descriptions>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
}
