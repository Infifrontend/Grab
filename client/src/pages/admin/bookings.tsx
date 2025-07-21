
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
  Descriptions
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
  CheckCircleOutlined
} from "@ant-design/icons";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function Bookings() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    // Check if admin is logged in
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isAdminLoggedIn) {
      setLocation('/admin/login');
    }
  }, [setLocation]);

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
      airline: "American Airlines"
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
      airline: "United Airlines"
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
      airline: "Delta Airlines"
    }
  ];

  const columns = [
    {
      title: 'Booking ID',
      dataIndex: 'bookingId',
      key: 'bookingId',
      render: (bookingId, record) => (
        <div>
          <Text strong className="text-blue-600">{bookingId}</Text>
          <br />
          <Text type="secondary" className="text-sm">{record.bookingDate}</Text>
        </div>
      ),
    },
    {
      title: 'Group Leader',
      key: 'groupLeader',
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <Avatar size="small" icon={<UserOutlined />} />
          <div>
            <Text strong>{record.groupLeader}</Text>
            <br />
            <Text type="secondary" className="text-sm">{record.email}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Route & Date',
      key: 'route',
      render: (_, record) => (
        <div>
          <Text strong>{record.route}</Text>
          <br />
          <Text type="secondary" className="text-sm">{record.departureDate}</Text>
          <br />
          <Text type="secondary" className="text-xs">{record.airline}</Text>
        </div>
      ),
    },
    {
      title: 'Passengers',
      dataIndex: 'passengers',
      key: 'passengers',
      render: (passengers) => (
        <div className="text-center">
          <Text strong className="text-lg">{passengers}</Text>
          <br />
          <Text type="secondary" className="text-sm">passengers</Text>
        </div>
      ),
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => (
        <Text strong className="text-green-600 text-lg">
          ${amount.toLocaleString()}
        </Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = {
          'Confirmed': 'green',
          'Pending': 'orange',
          'Cancelled': 'red',
          'Processing': 'blue'
        };
        return <Tag color={colors[status]}>{status}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} size="small" onClick={() => handleViewBooking(record)} />
          <Button type="text" icon={<EditOutlined />} size="small" />
          <Dropdown
            menu={{
              items: [
                { key: '1', label: 'Send Confirmation', icon: <CheckCircleOutlined /> },
                { key: '2', label: 'Cancel Booking', icon: <MoreOutlined /> },
                { key: '3', label: 'Download Invoice', icon: <ExportOutlined /> },
              ],
            }}
            trigger={['click']}
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
      <Header />
      <div className="p-6">
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
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Passengers"
                value={15634}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#52c41a' }}
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
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Confirmed Bookings"
                value={967}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#722ed1' }}
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
                { value: 'all', label: 'All Status' },
                { value: 'confirmed', label: 'Confirmed' },
                { value: 'pending', label: 'Pending' },
                { value: 'cancelled', label: 'Cancelled' },
              ]}
            />
            <Select
              placeholder="Airline"
              style={{ width: 150 }}
              options={[
                { value: 'all', label: 'All Airlines' },
                { value: 'american', label: 'American Airlines' },
                { value: 'united', label: 'United Airlines' },
                { value: 'delta', label: 'Delta Airlines' },
              ]}
            />
            <RangePicker placeholder={['Start Date', 'End Date']} />
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
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} bookings`,
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
              <Descriptions.Item label="Booking ID">{selectedBooking.bookingId}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={selectedBooking.status === 'Confirmed' ? 'green' : 'orange'}>
                  {selectedBooking.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Group Leader">{selectedBooking.groupLeader}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedBooking.email}</Descriptions.Item>
              <Descriptions.Item label="Route">{selectedBooking.route}</Descriptions.Item>
              <Descriptions.Item label="Departure Date">{selectedBooking.departureDate}</Descriptions.Item>
              <Descriptions.Item label="Passengers">{selectedBooking.passengers}</Descriptions.Item>
              <Descriptions.Item label="Total Amount">${selectedBooking.totalAmount.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Airline">{selectedBooking.airline}</Descriptions.Item>
              <Descriptions.Item label="Booking Date">{selectedBooking.bookingDate}</Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </div>
    </div>
  );
}
