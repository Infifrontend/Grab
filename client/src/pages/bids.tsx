import { useState } from 'react';
import { Card, Row, Col, Typography, Button, Space, Badge, Tabs, Table, Tag, Input, Select, DatePicker } from 'antd';
import { SearchOutlined, FilterOutlined, InfoCircleOutlined, CheckCircleOutlined, DollarOutlined, CreditCardOutlined, UndoOutlined } from '@ant-design/icons';
import { useLocation } from 'wouter';
import Header from "@/components/layout/header";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function Bids() {
  const [activeTab, setActiveTab] = useState("management");
  const [, setLocation] = useLocation();

  // Mock data for bids
  const bidsData = [
    {
      bidId: 'BID-2024-001',
      route: 'New York → London',
      passengers: 25,
      travelDate: '2024-07-22',
      bidAmount: '₹850',
      deposit: '₹7125.00',
      status: 'Pending',
      payment: 'Paid',
      submitted: '2024-06-15',
      actions: 'View Details'
    },
    {
      bidId: 'BID-2024-002',
      route: 'Los Angeles → Tokyo',
      passengers: 18,
      travelDate: '2024-08-10',
      bidAmount: '₹1200',
      deposit: '₹2160.00',
      status: 'Under Review',
      payment: 'Paid',
      submitted: '2024-06-18',
      actions: 'View Details'
    },
    {
      bidId: 'BID-2024-003',
      route: 'Chicago → Paris',
      passengers: 32,
      travelDate: '2024-08-15',
      bidAmount: '₹950',
      deposit: '₹3040.00',
      status: 'Accepted',
      payment: 'Converted to Booking',
      submitted: '2024-05-15',
      actions: 'View Details'
    },
    {
      bidId: 'BID-2024-004',
      route: 'Miami → Barcelona',
      passengers: 15,
      travelDate: '2024-07-28',
      bidAmount: '₹780',
      deposit: '₹1170.00',
      status: 'Declined',
      payment: 'Refunded',
      submitted: '2024-04-20',
      actions: 'View Details'
    },
    {
      bidId: 'BID-2024-005',
      route: 'Seattle → Amsterdam',
      passengers: 22,
      travelDate: '2024-08-05',
      bidAmount: '₹890',
      deposit: '₹1958.00',
      status: 'Expired',
      payment: 'Refunded',
      submitted: '2024-03-25',
      actions: 'View Details'
    },
    {
      bidId: 'BID-2024-006',
      route: 'Denver → London',
      passengers: 28,
      travelDate: '2024-09-12',
      bidAmount: '₹825',
      deposit: '₹2310.00',
      status: 'Counter Offer',
      payment: 'Refunded',
      submitted: '2024-02-20',
      actions: 'View Details'
    },
    {
      bidId: 'BID-2024-007',
      route: 'Boston → Rome',
      passengers: 20,
      travelDate: '2024-09-25',
      bidAmount: '₹920',
      deposit: '₹0.00',
      status: 'Payment Pending',
      payment: 'Pending',
      submitted: '2024-06-25',
      actions: 'View Details'
    }
  ];

  // Mock data for payment history
  const paymentHistoryData = [
    {
      paymentId: 'PAY-2024-001',
      bidId: 'BID-2024-001',
      route: 'New York → London',
      amount: '₹2125.00',
      type: 'Deposit',
      status: 'Completed',
      paymentMethod: 'Credit Card',
      transactionId: 'TXN-789456123',
      date: '2024-06-20'
    },
    {
      paymentId: 'PAY-2024-002',
      bidId: 'BID-2024-002',
      route: 'Los Angeles → Tokyo',
      amount: '₹2160.00',
      type: 'Deposit',
      status: 'Completed',
      paymentMethod: 'Bank Transfer',
      transactionId: 'TXN-789456124',
      date: '2024-06-18'
    },
    {
      paymentId: 'PAY-2024-003',
      bidId: 'BID-2024-003',
      route: 'Chicago → Paris',
      amount: '₹3040.00',
      type: 'Deposit',
      status: 'Converted',
      paymentMethod: 'Credit Card',
      transactionId: 'TXN-789456125',
      date: '2024-05-15'
    },
    {
      paymentId: 'REF-2024-001',
      bidId: 'BID-2024-004',
      route: 'Miami → Barcelona',
      amount: '₹1170.00',
      type: 'Refund',
      status: 'Completed',
      paymentMethod: 'Credit Card',
      transactionId: 'REF-789456126',
      date: '2024-05-10'
    },
    {
      paymentId: 'REF-2024-002',
      bidId: 'BID-2024-005',
      route: 'Seattle → Amsterdam',
      amount: '₹1958.00',
      type: 'Refund',
      status: 'Completed',
      paymentMethod: 'Bank Transfer',
      transactionId: 'REF-789456127',
      date: '2024-04-15'
    },
    {
      paymentId: 'REF-2024-003',
      bidId: 'BID-2024-006',
      route: 'Denver → London',
      amount: '₹2310.00',
      type: 'Refund',
      status: 'Completed',
      paymentMethod: 'Credit Card',
      transactionId: 'REF-789456128',
      date: '2024-03-05'
    },
    {
      paymentId: 'PAY-2024-007',
      bidId: 'BID-2024-007',
      route: 'Boston → Rome',
      amount: '₹1840.00',
      type: 'Deposit',
      status: 'Pending',
      paymentMethod: 'Pending',
      transactionId: '',
      date: '2024-06-25'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'orange';
      case 'Under Review': return 'blue';
      case 'Accepted': return 'green';
      case 'Declined': return 'red';
      case 'Expired': return 'default';
      case 'Counter Offer': return 'purple';
      case 'Payment Pending': return 'orange';
      case 'Completed': return 'green';
      case 'Converted': return 'blue';
      default: return 'default';
    }
  };

  const getPaymentColor = (payment: string) => {
    switch (payment) {
      case 'Paid': return 'blue';
      case 'Converted to Booking': return 'green';
      case 'Refunded': return 'orange';
      case 'Pending': return 'orange';
      default: return 'default';
    }
  };

  const bidsColumns = [
    {
      title: 'Bid ID',
      dataIndex: 'bidId',
      key: 'bidId',
    },
    {
      title: 'Route',
      dataIndex: 'route',
      key: 'route',
    },
    {
      title: 'Passengers',
      dataIndex: 'passengers',
      key: 'passengers',
    },
    {
      title: 'Travel Dates',
      dataIndex: 'travelDate',
      key: 'travelDate',
    },
    {
      title: 'Bid Amount',
      dataIndex: 'bidAmount',
      key: 'bidAmount',
    },
    {
      title: 'Deposit',
      dataIndex: 'deposit',
      key: 'deposit',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: 'Payment',
      dataIndex: 'payment',
      key: 'payment',
      render: (payment: string) => (
        <Tag color={getPaymentColor(payment)}>{payment}</Tag>
      ),
    },
    {
      title: 'Submitted',
      dataIndex: 'submitted',
      key: 'submitted',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) => (
        <Button 
          type="link" 
          size="small"
          onClick={() => setLocation(`/bid-details/${record.bidId}`)}
        >
          View Details
        </Button>
      ),
    },
  ];

  const paymentColumns = [
    {
      title: 'Payment ID',
      dataIndex: 'paymentId',
      key: 'paymentId',
    },
    {
      title: 'Bid ID',
      dataIndex: 'bidId',
      key: 'bidId',
      render: (bidId: string) => (
        <Button type="link" size="small">{bidId}</Button>
      ),
    },
    {
      title: 'Route',
      dataIndex: 'route',
      key: 'route',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'Deposit' ? 'blue' : 'orange'}>{type}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
  ];

  const tabItems = [
    {
      key: 'management',
      label: 'Bids Management',
    },
    {
      key: 'payment-history',
      label: 'Payment History',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <Title level={2} className="!mb-2">Group Bidding</Title>
          <Text className="text-gray-600">Submit bids for group travel and get competitive rates</Text>
        </div>

        {/* Stats Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} md={6} lg={4}>
            <Card className="text-center">
              <div className="flex items-center justify-center mb-2">
                <InfoCircleOutlined className="text-blue-500 text-lg mr-2" />
                <Text className="text-gray-600 text-sm">Active Bids</Text>
              </div>
              <Title level={2} className="!mb-0 text-blue-600">3</Title>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6} lg={4}>
            <Card className="text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircleOutlined className="text-green-500 text-lg mr-2" />
                <Text className="text-gray-600 text-sm">Accepted Bids</Text>
              </div>
              <Title level={2} className="!mb-0 text-green-600">1</Title>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6} lg={4}>
            <Card className="text-center">
              <div className="flex items-center justify-center mb-2">
                <DollarOutlined className="text-orange-500 text-lg mr-2" />
                <Text className="text-gray-600 text-sm">Total Savings</Text>
              </div>
              <Title level={2} className="!mb-0 text-orange-600">₹30</Title>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6} lg={4}>
            <Card className="text-center">
              <div className="flex items-center justify-center mb-2">
                <CreditCardOutlined className="text-purple-500 text-lg mr-2" />
                <Text className="text-gray-600 text-sm">Deposits Paid</Text>
              </div>
              <Title level={2} className="!mb-0 text-purple-600">₹6,445</Title>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6} lg={4}>
            <Card className="text-center">
              <div className="flex items-center justify-center mb-2">
                <UndoOutlined className="text-orange-500 text-lg mr-2" />
                <Text className="text-gray-600 text-sm">Refunds Received</Text>
              </div>
              <Title level={2} className="!mb-0 text-orange-600">₹5,438</Title>
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

        {/* Tab Content */}
        {activeTab === 'management' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <Title level={4} className="!mb-4 flex items-center">
                <FilterOutlined className="mr-2" />
                Search & Filter Bids
              </Title>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={6}>
                  <Text className="text-gray-600 text-sm block mb-1">Bid ID</Text>
                  <Input placeholder="BID-2024-001" />
                </Col>
                <Col xs={24} md={6}>
                  <Text className="text-gray-600 text-sm block mb-1">Route</Text>
                  <Select
                    placeholder="New York → London"
                    style={{ width: '100%' }}
                    options={[
                      { value: 'nyc-lon', label: 'New York → London' },
                      { value: 'la-tokyo', label: 'Los Angeles → Tokyo' },
                      { value: 'chi-paris', label: 'Chicago → Paris' },
                    ]}
                  />
                </Col>
                <Col xs={24} md={6}>
                  <Text className="text-gray-600 text-sm block mb-1">Status</Text>
                  <Select
                    placeholder="All Status"
                    style={{ width: '100%' }}
                    options={[
                      { value: 'all', label: 'All Status' },
                      { value: 'pending', label: 'Pending' },
                      { value: 'accepted', label: 'Accepted' },
                      { value: 'declined', label: 'Declined' },
                    ]}
                  />
                </Col>
                <Col xs={24} md={6}>
                  <Text className="text-gray-600 text-sm block mb-1">Date From</Text>
                  <DatePicker 
                    style={{ width: '100%' }} 
                    placeholder="dd/mm/yyyy" 
                    disabledDate={(current) => current && current.isBefore(new Date(), 'day')}
                  />
                </Col>
              </Row>

              <Row gutter={[16, 16]} className="mt-4">
                <Col xs={24} md={6}>
                  <Text className="text-gray-600 text-sm block mb-1">Date To</Text>
                  <DatePicker style={{ width: '100%' }} placeholder="dd/mm/yyyy" />
                </Col>
                <Col xs={24} md={6}>
                  <Text className="text-gray-600 text-sm block mb-1">Min Amount (₹)</Text>
                  <Input placeholder="500" />
                </Col>
                <Col xs={24} md={6}>
                  <Text className="text-gray-600 text-sm block mb-1">Max Amount (₹)</Text>
                  <Input placeholder="2000" />
                </Col>
                <Col xs={24} md={6} className="flex items-end">
                  <Button type="link" className="text-blue-600">Reset Filters</Button>
                </Col>
              </Row>
            </Card>

            {/* All Bids Table */}
            <Card>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <Title level={4} className="!mb-1">All Bids (7)</Title>
                  <Text className="text-gray-600">Manage and track all your group bidding requests</Text>
                </div>
              </div>

              <Table
                columns={bidsColumns}
                dataSource={bidsData}
                rowKey="bidId"
                pagination={{ pageSize: 10 }}
                scroll={{ x: 1200 }}
              />
            </Card>

            {/* How Group Bidding Works */}
            <Card>
              <Title level={4} className="!mb-2">How Group Bidding Works</Title>
              <Text className="text-gray-600 block mb-6">Get the best rates through our competitive bidding process</Text>

              <Row gutter={[24, 24]}>
                <Col xs={24} md={6}>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-600 font-semibold">1</span>
                    </div>
                    <Title level={5} className="!mb-2">Submit Your Bid</Title>
                    <Text className="text-gray-600 text-sm">Enter your travel details and desired price for your group booking</Text>
                  </div>
                </Col>
                <Col xs={24} md={6}>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-600 font-semibold">2</span>
                    </div>
                    <Title level={5} className="!mb-2">Pay Deposit</Title>
                    <Text className="text-gray-600 text-sm">Pay 10% deposit to secure your bid. Full refund if not accepted by airlines</Text>
                  </div>
                </Col>
                <Col xs={24} md={6}>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-600 font-semibold">3</span>
                    </div>
                    <Title level={5} className="!mb-2">Airlines Review</Title>
                    <Text className="text-gray-600 text-sm">Airlines review your bid and may accept, counter, or decline based on availability</Text>
                  </div>
                </Col>
                <Col xs={24} md={6}>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-600 font-semibold">4</span>
                    </div>
                    <Title level={5} className="!mb-2">Book & Save</Title>
                    <Text className="text-gray-600 text-sm">If accepted, proceed with booking at your negotiated rate and save money</Text>
                  </div>
                </Col>
              </Row>
            </Card>
          </div>
        )}

        {activeTab === 'payment-history' && (
          <div className="space-y-6">
            {/* Payment History Header */}
            <Card>
              <Title level={4} className="!mb-2">Payment History</Title>
              <Text className="text-gray-600">Track all deposits, refunds, and payment transactions</Text>
            </Card>

            {/* Payment History Table */}
            <Card>
              <Table
                columns={paymentColumns}
                dataSource={paymentHistoryData}
                rowKey="paymentId"
                pagination={{ pageSize: 10 }}
                scroll={{ x: 1200 }}
              />
            </Card>

            {/* Payment Summary Cards */}
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Card className="bg-green-50 border-green-200">
                  <Text className="text-green-600 text-sm block mb-1">Total Deposits</Text>
                  <Title level={3} className="!mb-0 text-green-600">₹7,165.00</Title>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card className="bg-purple-50 border-purple-200">
                  <Text className="text-purple-600 text-sm block mb-1">Total Refunds</Text>
                  <Title level={3} className="!mb-0 text-purple-600">₹5,438.00</Title>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card className="bg-blue-50 border-blue-200">
                  <Text className="text-blue-600 text-sm block mb-1">Net Amount</Text>
                  <Title level={3} className="!mb-0 text-blue-600">₹1,727.00</Title>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card className="bg-orange-50 border-orange-200">
                  <Text className="text-orange-600 text-sm block mb-1">Pending Payments</Text>
                  <Title level={3} className="!mb-0 text-orange-600">₹1,840.00</Title>
                </Card>
              </Col>
            </Row>

            {/* How Group Bidding Works - Same section */}
            <Card>
              <Title level={4} className="!mb-2">How Group Bidding Works</Title>
              <Text className="text-gray-600 block mb-6">Get the best rates through our competitive bidding process</Text>

              <Row gutter={[24, 24]}>
                <Col xs={24} md={6}>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-600 font-semibold">1</span>
                    </div>
                    <Title level={5} className="!mb-2">Submit Your Bid</Title>
                    <Text className="text-gray-600 text-sm">Enter your travel details and desired price for your group booking</Text>
                  </div>
                </Col>
                <Col xs={24} md={6}>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-600 font-semibold">2</span>
                    </div>
                    <Title level={5} className="!mb-2">Pay Deposit</Title>
                    <Text className="text-gray-600 text-sm">Pay 10% deposit to secure your bid. Full refund if not accepted by airlines</Text>
                  </div>
                </Col>
                <Col xs={24} md={6}>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-600 font-semibold">3</span>
                    </div>
                    <Title level={5} className="!mb-2">Airlines Review</Title>
                    <Text className="text-gray-600 text-sm">Airlines review your bid and may accept, counter, or decline based on availability</Text>
                  </div>
                </Col>
                <Col xs={24} md={6}>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-600 font-semibold">4</span>
                    </div>
                    <Title level={5} className="!mb-2">Book & Save</Title>
                    <Text className="text-gray-600 text-sm">If accepted, proceed with booking at your negotiated rate and save money</Text>
                  </div>
                </Col>
              </Row>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}