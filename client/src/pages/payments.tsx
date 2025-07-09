
import { useState } from 'react';
import { Card, Row, Col, Typography, Button, Input, Select, Table, Badge, Space, Tabs } from 'antd';
import { ExportOutlined, SearchOutlined, EyeOutlined, FileTextOutlined, PlusOutlined } from '@ant-design/icons';
import Header from "@/components/layout/header";

const { Title, Text } = Typography;
const { Option } = Select;

export default function Payments() {
  const [activeTab, setActiveTab] = useState("payment-history");
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  // Mock payment data
  const paymentData = [
    {
      key: '1',
      paymentId: 'PAY-1234',
      bookingId: 'GR-2024-1001',
      date: '2024-05-15',
      amount: '$2,500.00',
      type: 'Partial Payment',
      status: 'Completed',
      method: 'Credit Card',
    },
    {
      key: '2',
      paymentId: 'PAY-1235',
      bookingId: 'GR-2024-1001',
      date: '2024-04-01',
      amount: '$1,500.00',
      type: 'Deposit',
      status: 'Completed',
      method: 'Bank Transfer',
    },
    {
      key: '3',
      paymentId: 'PAY-1236',
      bookingId: 'GR-2024-0987',
      date: '2024-05-20',
      amount: '$3,200.00',
      type: 'Full Payment',
      status: 'Pending',
      method: 'Credit Card',
    },
    {
      key: '4',
      paymentId: 'PAY-1237',
      bookingId: 'GR-2024-0965',
      date: '2024-05-18',
      amount: '$1,800.00',
      type: 'Split Payment',
      status: 'Completed',
      method: 'PayPal',
    },
    {
      key: '5',
      paymentId: 'PAY-1238',
      bookingId: 'GR-2024-0932',
      date: '2024-05-10',
      amount: '$950.00',
      type: 'Partial Payment',
      status: 'Failed',
      method: 'Credit Card',
    },
  ];

  const columns = [
    {
      title: 'PAYMENT ID',
      dataIndex: 'paymentId',
      key: 'paymentId',
      render: (text: string) => <Text className="font-medium text-gray-900">{text}</Text>,
    },
    {
      title: 'BOOKING ID',
      dataIndex: 'bookingId',
      key: 'bookingId',
      render: (text: string) => <Text className="text-gray-600">{text}</Text>,
    },
    {
      title: 'DATE',
      dataIndex: 'date',
      key: 'date',
      render: (text: string) => <Text className="text-gray-600">{text}</Text>,
    },
    {
      title: 'AMOUNT',
      dataIndex: 'amount',
      key: 'amount',
      render: (text: string) => <Text className="font-semibold text-gray-900">{text}</Text>,
    },
    {
      title: 'TYPE',
      dataIndex: 'type',
      key: 'type',
      render: (text: string) => <Text className="text-gray-600">{text}</Text>,
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'blue';
        if (status === 'Completed') color = 'blue';
        if (status === 'Pending') color = 'orange';
        if (status === 'Failed') color = 'red';
        
        return <Badge color={color} text={status} />;
      },
    },
    {
      title: 'METHOD',
      dataIndex: 'method',
      key: 'method',
      render: (text: string) => <Text className="text-gray-600">{text}</Text>,
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} className="text-gray-500 p-0">
            View
          </Button>
          <Button type="link" icon={<FileTextOutlined />} className="text-gray-500 p-0">
            Receipt
          </Button>
        </Space>
      ),
    },
  ];

  const tabItems = [
    {
      key: "payment-history",
      label: "Payment History",
    },
    {
      key: "payment-schedule",
      label: "Payment Schedule",
    },
    {
      key: "payment-methods",
      label: "Payment Methods",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <Title level={2} className="!mb-0 text-gray-900">Payment Management</Title>
          <Button icon={<ExportOutlined />} className="flex items-center">
            Export
          </Button>
        </div>

        {/* Summary Cards */}
        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center">
              <div className="flex justify-center mb-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-orange-600 text-xl">💰</span>
                </div>
              </div>
              <Text className="text-gray-600 block mb-2">Total Payments</Text>
              <Title level={3} className="!mb-1 text-gray-900">$128,420</Title>
              <Text className="text-green-600 text-sm">+12% from last month</Text>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center">
              <div className="flex justify-center mb-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600 text-xl">⏳</span>
                </div>
              </div>
              <Text className="text-gray-600 block mb-2">Pending Payments</Text>
              <Title level={3} className="!mb-1 text-gray-900">$42,560</Title>
              <Text className="text-gray-500 text-sm">3 bookings with pending payments</Text>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center">
              <div className="flex justify-center mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-xl">📅</span>
                </div>
              </div>
              <Text className="text-gray-600 block mb-2">Upcoming Payments</Text>
              <Title level={3} className="!mb-1 text-gray-900">$18,750</Title>
              <Text className="text-gray-500 text-sm">Due in the next 30 days</Text>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center">
              <div className="flex justify-center mb-3">
                <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <span className="text-cyan-600 text-xl">💳</span>
                </div>
              </div>
              <Text className="text-gray-600 block mb-2">Refunds Processed</Text>
              <Title level={3} className="!mb-1 text-gray-900">$3,240</Title>
              <Text className="text-gray-500 text-sm">2 refunds this month</Text>
            </Card>
          </Col>
        </Row>

        {/* Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          className="mb-6"
        />

        {/* Payment History Tab */}
        {activeTab === "payment-history" && (
          <Card>
            <div className="mb-6">
              <Title level={4} className="!mb-2 text-gray-900">Payment History</Title>
              <Text className="text-gray-600">View and manage all payments for your group bookings.</Text>
            </div>

            {/* Search and Filter Row */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <Input
                  placeholder="Search payments..."
                  prefix={<SearchOutlined className="text-gray-400" />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full sm:w-64"
                />
                <Select
                  value={statusFilter}
                  onChange={setStatusFilter}
                  className="w-full sm:w-40"
                >
                  <Option value="All Status">All Status</Option>
                  <Option value="Completed">Completed</Option>
                  <Option value="Pending">Pending</Option>
                  <Option value="Failed">Failed</Option>
                </Select>
              </div>
              
              <div className="flex gap-3">
                <Button icon={<ExportOutlined />}>Export</Button>
                <Button type="primary" icon={<PlusOutlined />} className="infiniti-btn-primary">
                  Make Payment
                </Button>
              </div>
            </div>

            {/* Payment Table */}
            <Table
              columns={columns}
              dataSource={paymentData}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              }}
              scroll={{ x: 1000 }}
            />
          </Card>
        )}

        {/* Payment Schedule Tab */}
        {activeTab === "payment-schedule" && (
          <Card>
            <div className="mb-6">
              <Title level={4} className="!mb-2 text-gray-900">Payment Schedule</Title>
              <Text className="text-gray-600">Manage scheduled payments for your bookings.</Text>
            </div>

            {/* Payment Schedule Table */}
            <Table
              columns={[
                {
                  title: 'PAYMENT ID',
                  dataIndex: 'paymentId',
                  key: 'paymentId',
                  render: (text: string) => <Text className="font-medium text-gray-900">{text}</Text>,
                },
                {
                  title: 'BOOKING ID',
                  dataIndex: 'bookingId',
                  key: 'bookingId',
                  render: (text: string) => <Text className="text-gray-600">{text}</Text>,
                },
                {
                  title: 'DUE DATE',
                  dataIndex: 'dueDate',
                  key: 'dueDate',
                  render: (text: string) => <Text className="text-gray-600">{text}</Text>,
                },
                {
                  title: 'AMOUNT',
                  dataIndex: 'amount',
                  key: 'amount',
                  render: (text: string) => <Text className="font-semibold text-gray-900">{text}</Text>,
                },
                {
                  title: 'STATUS',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status: string) => {
                    let color = 'blue';
                    let text = status;
                    if (status === 'Due') {
                      color = 'red';
                      text = 'Due';
                    } else if (status === 'Upcoming') {
                      color = 'blue';
                      text = 'Upcoming';
                    } else if (status === 'Overdue') {
                      color = 'red';
                      text = 'Overdue';
                    }
                    
                    return <Badge color={color} text={text} />;
                  },
                },
                {
                  title: 'ACTIONS',
                  key: 'actions',
                  render: (record: any) => (
                    <Space>
                      {(record.status === 'Due' || record.status === 'Overdue') ? (
                        <Button type="primary" size="small" className="infiniti-btn-primary">
                          Pay Now
                        </Button>
                      ) : (
                        <Button type="link" size="small" className="text-gray-500">
                          Pay Early
                        </Button>
                      )}
                    </Space>
                  ),
                },
              ]}
              dataSource={[
                {
                  key: '1',
                  paymentId: 'SCH-1001',
                  bookingId: 'GR-5678',
                  dueDate: '2023-06-15',
                  amount: '$1,800.00',
                  status: 'Due',
                },
                {
                  key: '2',
                  paymentId: 'SCH-1002',
                  bookingId: 'GR-5678',
                  dueDate: '2023-07-15',
                  amount: '$1,800.00',
                  status: 'Upcoming',
                },
                {
                  key: '3',
                  paymentId: 'SCH-1003',
                  bookingId: 'GR-5679',
                  dueDate: '2023-06-01',
                  amount: '$2,500.00',
                  status: 'Overdue',
                },
                {
                  key: '4',
                  paymentId: 'SCH-1004',
                  bookingId: 'GR-5680',
                  dueDate: '2023-08-01',
                  amount: '$3,200.00',
                  status: 'Upcoming',
                },
              ]}
              pagination={false}
              scroll={{ x: 800 }}
            />
          </Card>
        )}

        {/* Payment Methods Tab */}
        {activeTab === "payment-methods" && (
          <Card>
            <div className="mb-6">
              <Title level={4} className="!mb-2 text-gray-900">Payment Methods</Title>
              <Text className="text-gray-600">Manage your saved payment methods.</Text>
            </div>

            <Row gutter={[24, 24]}>
              {/* Existing Payment Method 1 */}
              <Col xs={24} md={12} lg={8}>
                <Card className="border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">💳</span>
                      </div>
                      <div>
                        <Text className="font-semibold text-gray-900 block">Credit Card</Text>
                        <Text className="text-gray-600 text-sm">Visa ending in 4242</Text>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <Text className="text-gray-900 font-medium">John Doe</Text>
                    <Text className="text-gray-600 text-sm block">Expires 05/2025</Text>
                  </div>
                  <Button type="link" className="text-blue-600 p-0" icon={<EyeOutlined />}>
                    Edit
                  </Button>
                </Card>
              </Col>

              {/* Existing Payment Method 2 */}
              <Col xs={24} md={12} lg={8}>
                <Card className="border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 bg-orange-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">💳</span>
                      </div>
                      <div>
                        <Text className="font-semibold text-gray-900 block">Credit Card</Text>
                        <Text className="text-gray-600 text-sm">Mastercard ending in 5555</Text>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <Text className="text-gray-900 font-medium">John Doe</Text>
                    <Text className="text-gray-600 text-sm block">Expires 08/2026</Text>
                  </div>
                  <Button type="link" className="text-blue-600 p-0" icon={<EyeOutlined />}>
                    Edit
                  </Button>
                </Card>
              </Col>

              {/* Add New Payment Method */}
              <Col xs={24} md={12} lg={8}>
                <Card className="border-2 border-dashed border-gray-300 h-full">
                  <div className="flex flex-col items-center justify-center text-center h-32">
                    <div className="w-12 h-12 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center mb-3">
                      <PlusOutlined className="text-gray-400 text-xl" />
                    </div>
                    <Text className="font-semibold text-gray-700 block mb-1">Add Payment Method</Text>
                    <Text className="text-gray-500 text-sm mb-3">Add a new payment method to your account</Text>
                    <Button type="primary" icon={<PlusOutlined />} size="small" className="infiniti-btn-primary">
                      Add Method
                    </Button>
                  </div>
                </Card>
              </Col>
            </Row>
          </Card>
        )}
      </div>
    </div>
  );
}
