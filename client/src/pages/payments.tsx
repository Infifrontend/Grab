
import { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Button, Input, Select, Table, Badge, Space, Tabs, Modal, Form, Radio, message, Spin } from 'antd';
import { ExportOutlined, SearchOutlined, EyeOutlined, FileTextOutlined, PlusOutlined } from '@ant-design/icons';
import { useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import Header from "@/components/layout/header";

const { Title, Text } = Typography;
const { Option } = Select;

export default function Payments() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("payment-history");
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [paymentForm] = Form.useForm();

  // Fetch payment statistics
  const { data: paymentStats, isLoading: statsLoading } = useQuery({
    queryKey: ['payment-statistics'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/payments/statistics');
      return response.json();
    },
  });

  // Fetch payment data
  const { data: paymentData = [], isLoading: paymentsLoading, refetch: refetchPayments } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/payments');
      return response.json();
    },
  });

  // Fetch payment schedule
  const { data: paymentSchedule = [], isLoading: scheduleLoading } = useQuery({
    queryKey: ['payment-schedule'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/payments/schedule');
      return response.json();
    },
  });

  // Fetch flight bookings for payment modal
  const { data: flightBookings = [] } = useQuery({
    queryKey: ['flight-bookings'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/flight-bookings');
      return response.json();
    },
  });

  // Create payment mutation
  const createPaymentMutation = useMutation({
    mutationFn: async (paymentData: any) => {
      const response = await apiRequest('POST', '/api/payments', paymentData);
      return response.json();
    },
    onSuccess: () => {
      message.success('Payment processed successfully!');
      setIsPaymentModalVisible(false);
      paymentForm.resetFields();
      refetchPayments();
    },
    onError: (error) => {
      console.error('Payment error:', error);
      message.error('Payment processing failed. Please try again.');
    },
  });

  const handleViewPayment = (paymentId: string) => {
    setLocation(`/payment-details/${paymentId}`);
  };

  // Filter payments based on search and status
  const filteredPayments = paymentData.filter((payment: any) => {
    const matchesSearch = !searchText || 
      payment.paymentReference?.toLowerCase().includes(searchText.toLowerCase()) ||
      payment.bookingId?.toString().includes(searchText.toLowerCase());
    
    const matchesStatus = statusFilter === "All Status" || 
      payment.paymentStatus === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: 'PAYMENT ID',
      dataIndex: 'paymentReference',
      key: 'paymentReference',
      render: (text: string) => <Text className="font-medium text-gray-900">{text}</Text>,
    },
    {
      title: 'BOOKING ID',
      dataIndex: 'bookingId',
      key: 'bookingId',
      render: (text: number) => <Text className="text-gray-600">#{text}</Text>,
    },
    {
      title: 'DATE',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <Text className="text-gray-600">
          {new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </Text>
      ),
    },
    {
      title: 'AMOUNT',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: string) => (
        <Text className="font-semibold text-gray-900">
          ${parseFloat(amount).toFixed(2)}
        </Text>
      ),
    },
    {
      title: 'METHOD',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (method: string) => (
        <Text className="text-gray-600">
          {method?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'N/A'}
        </Text>
      ),
    },
    {
      title: 'STATUS',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status: string) => {
        let color = 'blue';
        let text = status;
        if (status === 'completed') {
          color = 'green';
          text = 'Completed';
        } else if (status === 'pending') {
          color = 'orange';
          text = 'Pending';
        } else if (status === 'failed') {
          color = 'red';
          text = 'Failed';
        }

        return <Badge color={color} text={text} />;
      },
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button 
            type="link" 
            icon={<EyeOutlined />} 
            className="text-gray-500 p-0"
            onClick={() => handleViewPayment(record.paymentReference)}
          >
            View
          </Button>
          <Button type="link" icon={<FileTextOutlined />} className="text-gray-500 p-0">
            Receipt
          </Button>
        </Space>
      ),
    },
  ];

  const scheduleColumns = [
    {
      title: 'PAYMENT ID',
      dataIndex: 'paymentReference',
      key: 'paymentReference',
      render: (text: string) => <Text className="font-medium text-gray-900">{text || 'TBD'}</Text>,
    },
    {
      title: 'BOOKING ID',
      dataIndex: 'bookingId',
      key: 'bookingId',
      render: (text: number) => <Text className="text-gray-600">#{text}</Text>,
    },
    {
      title: 'DUE DATE',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date: string) => (
        <Text className="text-gray-600">
          {new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </Text>
      ),
    },
    {
      title: 'AMOUNT',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: string) => (
        <Text className="font-semibold text-gray-900">
          ${parseFloat(amount).toFixed(2)}
        </Text>
      ),
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'blue';
        let text = status;
        if (status === 'due') {
          color = 'red';
          text = 'Due';
        } else if (status === 'upcoming') {
          color = 'blue';
          text = 'Upcoming';
        } else if (status === 'overdue') {
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
          {(record.status === 'due' || record.status === 'overdue') ? (
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
  ];

  const handleMakePayment = () => {
    setIsPaymentModalVisible(true);
  };

  const handlePaymentModalCancel = () => {
    setIsPaymentModalVisible(false);
    paymentForm.resetFields();
  };

  const handlePaymentSubmit = (values: any) => {
    const paymentData = {
      bookingId: parseInt(values.bookingId.replace('#', '')),
      amount: values.amount || '0',
      paymentMethod: values.paymentMethod,
      currency: 'USD',
      paymentReference: `PAY-${Date.now()}`,
    };

    createPaymentMutation.mutate(paymentData);
  };

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

  const isLoading = statsLoading || paymentsLoading || scheduleLoading;

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
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={[24, 24]} className="mb-8">
            <Col xs={24} sm={12} lg={6}>
              <Card className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600 text-xl">💰</span>
                  </div>
                </div>
                <Text className="text-gray-600 block mb-2">Total Payments</Text>
                <Title level={3} className="!mb-1 text-gray-900">
                  ${paymentStats?.totalPayments?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
                </Title>
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
                <Title level={3} className="!mb-1 text-gray-900">
                  ${paymentStats?.pendingPayments?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
                </Title>
                <Text className="text-gray-500 text-sm">
                  {paymentData.filter((p: any) => p.paymentStatus === 'pending').length} bookings with pending payments
                </Text>
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
                <Title level={3} className="!mb-1 text-gray-900">
                  ${paymentStats?.upcomingPayments?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
                </Title>
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
                <Title level={3} className="!mb-1 text-gray-900">
                  ${paymentStats?.refundsProcessed?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
                </Title>
                <Text className="text-gray-500 text-sm">
                  {paymentData.filter((p: any) => p.paymentStatus === 'refunded').length} refunds this month
                </Text>
              </Card>
            </Col>
          </Row>
        )}

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
                <Button type="primary" icon={<PlusOutlined />} className="infiniti-btn-primary" onClick={handleMakePayment}>
                  Make Payment
                </Button>
              </div>
            </div>

            {/* Payment Table */}
            <Table
              columns={columns}
              dataSource={filteredPayments}
              loading={paymentsLoading}
              rowKey="id"
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
              columns={scheduleColumns}
              dataSource={paymentSchedule}
              loading={scheduleLoading}
              rowKey="id"
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

        {/* Payment Modal */}
        <Modal
          title="Make a Payment"
          open={isPaymentModalVisible}
          onCancel={handlePaymentModalCancel}
          footer={null}
          width={500}
        >
          <div className="mb-4">
            <Text className="text-gray-600">
              Enter the payment details below to complete your payment for the selected booking.
            </Text>
          </div>

          <Form
            form={paymentForm}
            layout="vertical"
            onFinish={handlePaymentSubmit}
            initialValues={{
              paymentMethod: "credit_card"
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Booking ID"
                  name="bookingId"
                  rules={[{ required: true, message: 'Please select a booking' }]}
                >
                  <Select placeholder="Select booking">
                    {flightBookings.map((booking: any) => (
                      <Select.Option key={booking.id} value={`#${booking.id}`}>
                        #{booking.id} - {booking.bookingReference}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Amount"
                  name="amount"
                  rules={[{ required: true, message: 'Please enter amount' }]}
                >
                  <Input placeholder="0.00" prefix="$" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Payment Method"
              name="paymentMethod"
              rules={[{ required: true, message: 'Please select payment method' }]}
            >
              <Radio.Group className="w-full">
                <div className="space-y-3">
                  <Radio value="credit_card" className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-blue-500">
                    <div className="flex items-center gap-3">
                      <span className="text-blue-600">💳</span>
                      <span>Credit Card</span>
                    </div>
                  </Radio>
                  <Radio value="bank_transfer" className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-blue-500">
                    <div className="flex items-center gap-3">
                      <span className="text-green-600">🏦</span>
                      <span>Bank Transfer</span>
                    </div>
                  </Radio>
                  <Radio value="paypal" className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-blue-500">
                    <div className="flex items-center gap-3">
                      <span className="text-blue-500">💰</span>
                      <span>PayPal</span>
                    </div>
                  </Radio>
                </div>
              </Radio.Group>
            </Form.Item>

            <div className="flex justify-end gap-3 mt-6">
              <Button onClick={handlePaymentModalCancel}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                className="infiniti-btn-primary"
                loading={createPaymentMutation.isPending}
              >
                {createPaymentMutation.isPending ? 'Processing...' : 'Make Payment'}
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
}
