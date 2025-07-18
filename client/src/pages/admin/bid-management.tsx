import React, { useState, useEffect } from 'react';
import {
  Card,
  Tabs,
  Row,
  Col,
  Statistic,
  Button,
  Typography,
  Space,
  Badge,
  Timeline,
  Progress,
  Breadcrumb,
  Avatar,
  Dropdown,
  MenuProps,
  Table,
  Tag,
  Input,
  Select,
  DatePicker,
  Modal,
  Form,
  InputNumber,
  Switch,
  Steps,
  TimePicker,
  Radio,
  Checkbox,
  Divider
} from 'antd';
import {
  DashboardOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  HistoryOutlined,
  CreditCardOutlined,
  PlusOutlined,
  EyeOutlined,
  BarChartOutlined,
  RiseOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  BellOutlined,
  HomeOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  InfoCircleOutlined,
  DollarOutlined,
  AlertOutlined
} from '@ant-design/icons';
import { useLocation } from "wouter";

const { Title, Text } = Typography;

export default function BidManagement() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [createBidModalVisible, setCreateBidModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();

  useEffect(() => {
    // Check if admin is logged in
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isAdminLoggedIn) {
      setLocation('/admin/login');
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUsername');
    setLocation('/admin/login');
  };

  // User dropdown menu
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />,
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <SettingOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  const recentActivities = [
    {
      type: 'new',
      color: '#ff7875',
      title: 'New bid received: Economy to Business ($280)',
      time: '30 minutes ago'
    },
    {
      type: 'counter',
      color: '#40a9ff',
      title: 'Bid BID001 - Counter offer sent ($280)',
      time: '2 hours ago'
    },
    {
      type: 'accepted',
      color: '#73d13d',
      title: 'Bid BID002 - Auto-accepted ($120)',
      time: '4 hours ago'
    },
    {
      type: 'rejected',
      color: '#ff7875',
      title: 'Bid BID005 - Rejected (below minimum)',
      time: '8 hours ago'
    }
  ];

  const handleCreateBid = () => {
    setCreateBidModalVisible(true);
    setCurrentStep(0);
    form.resetFields();
  };

  const handleModalCancel = () => {
    setCreateBidModalVisible(false);
    setCurrentStep(0);
    form.resetFields();
  };

  const handleNext = () => {
    form.validateFields().then(() => {
      setCurrentStep(currentStep + 1);
    });
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFinish = (values: any) => {
    console.log('Form values:', values);
    setCreateBidModalVisible(false);
    setCurrentStep(0);
    form.resetFields();
  };

  const steps = [
    {
      title: 'Flight & Route Details',
      content: 'flight-details',
    },
    {
      title: 'Seat Configurations & Limits',
      content: 'seat-config',
    },
    {
      title: 'Bid Pricing & Currency',
      content: 'pricing',
    },
    {
      title: 'Bidding Schedule & Rules',
      content: 'schedule',
    },
    {
      title: 'Fleet, Terms & Conditions',
      content: 'terms',
    },
  ];

  const renderActiveBidsContent = () => (
    <div>
      {/* Active Bids Header */}
      <div className="mb-6">
        <Title level={4} className="!mb-1">Active Bids Requiring Attention</Title>
        <Text className="text-gray-500">Monitor and respond to passenger upgrade bids</Text>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Input 
            placeholder="Search by passenger name or flight number..."
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
          />
        </div>
        <Select placeholder="Filter by status" style={{ width: 150 }}>
          <Select.Option value="pending">Pending</Select.Option>
          <Select.Option value="reviewed">Reviewed</Select.Option>
          <Select.Option value="counter">Counter Offer</Select.Option>
        </Select>
      </div>

      {/* Active Bids Table */}
      <Table
        dataSource={[
          {
            key: '1',
            bidId: 'BID001',
            passenger: { name: 'John Smith', email: 'john.smith@email.com' },
            flight: { number: 'GR-4521', route: 'LAX → JFK', date: '2024-06-23' },
            upgrade: 'Economy → Business',
            bidAmount: '$250',
            maxBid: '$280',
            successRate: '75%',
            timeLeft: '18h 49m',
            status: 'pending'
          },
          {
            key: '2',
            bidId: 'BID002',
            passenger: { name: 'Sarah Johnson', email: 'sarah.johnson@email.com' },
            flight: { number: 'GR-7834', route: 'ORD → SFO', date: '2024-06-26' },
            upgrade: 'Economy → Premium Economy',
            bidAmount: '$120',
            maxBid: '$150',
            successRate: '65%',
            timeLeft: '42h 20m',
            status: 'pending'
          },
          {
            key: '3',
            bidId: 'BID003',
            passenger: { name: 'Mike Davis', email: 'mike.davis@email.com' },
            flight: { number: 'GR-2156', route: 'JFK → LHR', date: '2024-06-27' },
            upgrade: 'Premium Economy → Business',
            bidAmount: '$450',
            maxBid: '$500',
            successRate: '60%',
            timeLeft: '68h 10m',
            status: 'pending'
          }
        ]}
        columns={[
          {
            title: 'Bid Details',
            dataIndex: 'bidId',
            key: 'bidDetails',
            render: (bidId, record) => (
              <div>
                <Text strong>{bidId}</Text>
                <br />
                <Text className="text-gray-500 text-sm">{record.upgrade}</Text>
              </div>
            ),
          },
          {
            title: 'Passenger',
            dataIndex: 'passenger',
            key: 'passenger',
            render: (passenger) => (
              <div>
                <Text strong>{passenger.name}</Text>
                <br />
                <Text className="text-gray-500 text-sm">{passenger.email}</Text>
              </div>
            ),
          },
          {
            title: 'Flight Info',
            dataIndex: 'flight',
            key: 'flightInfo',
            render: (flight) => (
              <div>
                <Text strong>{flight.number}</Text>
                <br />
                <Text className="text-gray-500 text-sm">{flight.route}</Text>
                <br />
                <Text className="text-gray-500 text-sm">{flight.date}</Text>
              </div>
            ),
          },
          {
            title: 'Upgrade',
            dataIndex: 'upgrade',
            key: 'upgrade',
          },
          {
            title: 'Bid Amount',
            dataIndex: 'bidAmount',
            key: 'bidAmount',
            render: (amount, record) => (
              <div>
                <Text strong>{amount}</Text>
                <br />
                <Text className="text-gray-500 text-sm">Max {record.maxBid}</Text>
              </div>
            ),
          },
          {
            title: 'Success Rate',
            dataIndex: 'successRate',
            key: 'successRate',
            render: (rate) => (
              <div>
                <Text>{rate}</Text>
                <Progress percent={parseInt(rate)} size="small" showInfo={false} />
              </div>
            ),
          },
          {
            title: 'Time Left',
            dataIndex: 'timeLeft',
            key: 'timeLeft',
            render: (time, record) => (
              <Tag color={record.timeLeft.includes('18h') ? 'red' : 'blue'}>{time}</Tag>
            ),
          },
          {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
              <Button type="link" icon={<EyeOutlined />}>
                Details
              </Button>
            ),
          },
        ]}
        pagination={false}
      />
    </div>
  );

  const renderBidSetupContent = () => (
    <div>
      {/* Bid Setup Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Title level={4} className="!mb-1">Bid Configurations</Title>
          <Text className="text-gray-500">Set up and manage different types of upgrade bids</Text>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          className="bg-blue-600 hover:bg-blue-700"
          onClick={handleCreateBid}
        >
          Create New Bid
        </Button>
      </div>

      {/* Bid Configuration Cards */}
      <div className="space-y-4">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <Title level={5} className="!mb-0 !mr-3">LAX→JFK Business Upgrade</Title>
                <Tag color="green" className="text-xs">Active</Tag>
              </div>
              
              <Row gutter={[32, 16]}>
                <Col span={6}>
                  <div>
                    <Text className="text-gray-500 text-sm block mb-1">Route:</Text>
                    <Text className="font-medium">LAX → JFK</Text>
                  </div>
                </Col>
                <Col span={6}>
                  <div>
                    <Text className="text-gray-500 text-sm block mb-1">Total Seats:</Text>
                    <Text className="font-medium">40</Text>
                  </div>
                </Col>
                <Col span={6}>
                  <div>
                    <Text className="text-gray-500 text-sm block mb-1">Bid Range:</Text>
                    <Text className="font-medium">$190 - $200</Text>
                  </div>
                </Col>
                <Col span={6}>
                  <div>
                    <Text className="text-gray-500 text-sm block mb-1">Currency:</Text>
                    <Text className="font-medium">USD</Text>
                  </div>
                </Col>
              </Row>
              
              <div className="mt-4">
                <Text className="text-gray-400 text-xs">Created: 2024-09-15</Text>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-6">
              <Button type="text" icon={<EyeOutlined />} size="small">
                View
              </Button>
              <Button type="text" icon={<EditOutlined />} size="small">
                Edit
              </Button>
              <Switch 
                defaultChecked 
                size="small"
                checkedChildren="ON"
                unCheckedChildren="OFF"
              />
            </div>
          </div>
        </Card>

        {/* Additional bid configurations can be added here */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <Title level={5} className="!mb-0 !mr-3">ORD→SFO Premium Economy Upgrade</Title>
                <Tag color="orange" className="text-xs">Draft</Tag>
              </div>
              
              <Row gutter={[32, 16]}>
                <Col span={6}>
                  <div>
                    <Text className="text-gray-500 text-sm block mb-1">Route:</Text>
                    <Text className="font-medium">ORD → SFO</Text>
                  </div>
                </Col>
                <Col span={6}>
                  <div>
                    <Text className="text-gray-500 text-sm block mb-1">Total Seats:</Text>
                    <Text className="font-medium">24</Text>
                  </div>
                </Col>
                <Col span={6}>
                  <div>
                    <Text className="text-gray-500 text-sm block mb-1">Bid Range:</Text>
                    <Text className="font-medium">$85 - $120</Text>
                  </div>
                </Col>
                <Col span={6}>
                  <div>
                    <Text className="text-gray-500 text-sm block mb-1">Currency:</Text>
                    <Text className="font-medium">USD</Text>
                  </div>
                </Col>
              </Row>
              
              <div className="mt-4">
                <Text className="text-gray-400 text-xs">Created: 2024-09-14</Text>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-6">
              <Button type="text" icon={<EyeOutlined />} size="small">
                View
              </Button>
              <Button type="text" icon={<EditOutlined />} size="small">
                Edit
              </Button>
              <Switch 
                defaultChecked={false}
                size="small"
                checkedChildren="ON"
                unCheckedChildren="OFF"
              />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <Title level={5} className="!mb-0 !mr-3">JFK→LHR First Class Upgrade</Title>
                <Tag color="red" className="text-xs">Inactive</Tag>
              </div>
              
              <Row gutter={[32, 16]}>
                <Col span={6}>
                  <div>
                    <Text className="text-gray-500 text-sm block mb-1">Route:</Text>
                    <Text className="font-medium">JFK → LHR</Text>
                  </div>
                </Col>
                <Col span={6}>
                  <div>
                    <Text className="text-gray-500 text-sm block mb-1">Total Seats:</Text>
                    <Text className="font-medium">8</Text>
                  </div>
                </Col>
                <Col span={6}>
                  <div>
                    <Text className="text-gray-500 text-sm block mb-1">Bid Range:</Text>
                    <Text className="font-medium">$800 - $1200</Text>
                  </div>
                </Col>
                <Col span={6}>
                  <div>
                    <Text className="text-gray-500 text-sm block mb-1">Currency:</Text>
                    <Text className="font-medium">USD</Text>
                  </div>
                </Col>
              </Row>
              
              <div className="mt-4">
                <Text className="text-gray-400 text-xs">Created: 2024-09-10</Text>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-6">
              <Button type="text" icon={<EyeOutlined />} size="small">
                View
              </Button>
              <Button type="text" icon={<EditOutlined />} size="small">
                Edit
              </Button>
              <Switch 
                defaultChecked={false}
                size="small"
                checkedChildren="ON"
                unCheckedChildren="OFF"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderPaymentsContent = () => (
    <div>
      {/* Payment Stats */}
      <Row gutter={[24, 24]} className="mb-6">
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Total Transactions"
              value={6}
              suffix="This month"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={678.30}
              prefix="$"
              suffix="Net amount"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Pending Refunds"
              value={1}
              suffix="Require processing"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Failed Payments"
              value={1}
              suffix="Need attention"
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Payment Transactions Table */}
      <Card className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <Title level={4} className="!mb-1">Payment & Refund Transactions</Title>
            <Text className="text-gray-500">View and manage all payment transactions and refund requests</Text>
          </div>
          <div className="flex space-x-2">
            <Select placeholder="Filter by type" style={{ width: 120 }}>
              <Select.Option value="payment">Payment</Select.Option>
              <Select.Option value="refund">Refund</Select.Option>
            </Select>
            <Select placeholder="Status" style={{ width: 120 }}>
              <Select.Option value="completed">Completed</Select.Option>
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="failed">Failed</Select.Option>
            </Select>
          </div>
        </div>

        <Table
          dataSource={[
            {
              key: '1',
              transactionId: 'TXN-001234567',
              passenger: { name: 'John Smith', email: 'john.smith@email.com' },
              flight: { number: 'GR-4521', route: 'LAX → JFK' },
              type: 'Payment',
              amount: '$250 USD',
              method: 'Credit Card ****4532',
              status: 'Completed',
              date: '2024-06-23 16:30'
            },
            {
              key: '2',
              transactionId: 'REF-001234566',
              passenger: { name: 'Sarah Johnson', email: 'sarah.johnson@email.com' },
              flight: { number: 'GR-7834', route: 'ORD → SFO' },
              type: 'Refund',
              amount: '$120 USD',
              method: 'Credit Card ****6876',
              status: 'Pending',
              date: '2024-06-24 09:15'
            }
          ]}
          columns={[
            {
              title: 'Transaction ID',
              dataIndex: 'transactionId',
              key: 'transactionId',
              render: (id, record) => (
                <div>
                  <Text strong>{id}</Text>
                  <br />
                  <Text className="text-gray-500 text-sm">Bid {record.flight.number}</Text>
                </div>
              ),
            },
            {
              title: 'Passenger',
              dataIndex: 'passenger',
              key: 'passenger',
              render: (passenger) => (
                <div>
                  <Text>{passenger.name}</Text>
                  <br />
                  <Text className="text-gray-500 text-sm">{passenger.email}</Text>
                </div>
              ),
            },
            {
              title: 'Flight Details',
              dataIndex: 'flight',
              key: 'flight',
              render: (flight) => (
                <div>
                  <Text>{flight.number}</Text>
                  <br />
                  <Text className="text-gray-500 text-sm">{flight.route}</Text>
                </div>
              ),
            },
            {
              title: 'Type',
              dataIndex: 'type',
              key: 'type',
              render: (type) => (
                <Tag color={type === 'Payment' ? 'blue' : 'orange'}>{type}</Tag>
              ),
            },
            {
              title: 'Amount',
              dataIndex: 'amount',
              key: 'amount',
            },
            {
              title: 'Payment Method',
              dataIndex: 'method',
              key: 'method',
            },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status',
              render: (status) => (
                <Tag color={status === 'Completed' ? 'green' : status === 'Pending' ? 'orange' : 'red'}>
                  {status}
                </Tag>
              ),
            },
            {
              title: 'Date',
              dataIndex: 'date',
              key: 'date',
            },
            {
              title: 'Actions',
              key: 'actions',
              render: () => (
                <Button type="link" icon={<EyeOutlined />} size="small">
                  View
                </Button>
              ),
            },
          ]}
          pagination={false}
        />
      </Card>

      {/* Pending Refund Requests */}
      <Card>
        <div className="mb-4">
          <Title level={4} className="!mb-1">Pending Refund Requests</Title>
          <Text className="text-gray-500">Refund requests that require manual processing</Text>
        </div>

        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <Text strong>Sarah Johnson</Text>
                <br />
                <Text className="text-gray-500">GR-7834 • ORD → SFO</Text>
              </div>
              <Tag color="orange">Pending</Tag>
            </div>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Text className="text-gray-500 block">Refund Amount</Text>
                <Text strong>$120</Text>
              </Col>
              <Col span={8}>
                <Text className="text-gray-500 block">Payment Method</Text>
                <Text>Credit Card ****6876</Text>
              </Col>
              <Col span={8}>
                <Text className="text-gray-500 block">Request Date</Text>
                <Text>2024-06-24 09:15</Text>
              </Col>
            </Row>
            <div className="mt-3">
              <Text className="text-gray-500 block mb-1">Reason</Text>
              <Text>Refund for cancelled bid</Text>
            </div>
            <div className="mt-4 flex space-x-2">
              <Button type="primary" size="small">Approve Refund</Button>
              <Button size="small">Review Details</Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderHistoryContent = () => (
    <div>
      <div className="mb-6">
        <Title level={4} className="!mb-1">Bid History</Title>
        <Text className="text-gray-500">View completed and closed bids</Text>
      </div>

      <Table
        dataSource={[
          {
            key: '1',
            bidId: 'BID004',
            passenger: 'Emily Chen',
            flight: { number: 'GR-9876', route: 'SEA → BOS' },
            originalBid: '$200',
            finalAmount: '$200',
            status: 'Accepted',
            completedDate: '2024-06-22',
            revenue: '$200'
          },
          {
            key: '2',
            bidId: 'BID005',
            passenger: 'Robert Wilson',
            flight: { number: 'GR-5432', route: 'ATL → PHX' },
            originalBid: '$75',
            finalAmount: '$0',
            status: 'Rejected',
            completedDate: '2024-06-21',
            revenue: '$0'
          }
        ]}
        columns={[
          {
            title: 'Bid ID',
            dataIndex: 'bidId',
            key: 'bidId',
          },
          {
            title: 'Passenger',
            dataIndex: 'passenger',
            key: 'passenger',
          },
          {
            title: 'Flight',
            dataIndex: 'flight',
            key: 'flight',
            render: (flight) => (
              <div>
                <Text>{flight.number}</Text>
                <br />
                <Text className="text-gray-500 text-sm">{flight.route}</Text>
              </div>
            ),
          },
          {
            title: 'Original Bid',
            dataIndex: 'originalBid',
            key: 'originalBid',
          },
          {
            title: 'Final Amount',
            dataIndex: 'finalAmount',
            key: 'finalAmount',
          },
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
              <Tag color={status === 'Accepted' ? 'green' : 'red'}>{status}</Tag>
            ),
          },
          {
            title: 'Completed Date',
            dataIndex: 'completedDate',
            key: 'completedDate',
          },
          {
            title: 'Revenue',
            dataIndex: 'revenue',
            key: 'revenue',
          },
        ]}
        pagination={false}
      />
    </div>
  );

  const renderDashboardContent = () => (
    <div>
      {/* Overview and Insights Tabs */}
      <div className="mb-6">
        <Tabs
          defaultActiveKey="overview"
          items={[
            {
              key: 'overview',
              label: 'Overview',
              children: (
                <div>
                  {/* Stats Cards Row */}
                  <Row gutter={[24, 24]} className="mb-6">
                    <Col xs={24} sm={12} lg={8}>
                      <Card className="h-full">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <Text className="text-gray-500 text-sm">Active Bids</Text>
                            <div className="flex items-center mt-1">
                              <Title level={2} className="!mb-0 !mt-0 text-2xl font-semibold">3</Title>
                              <InfoCircleOutlined className="text-blue-500 ml-2" />
                            </div>
                            <Text className="text-gray-500 text-xs">Awaiting response</Text>
                          </div>
                        </div>
                      </Card>
                    </Col>

                    <Col xs={24} sm={12} lg={8}>
                      <Card className="h-full">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <Text className="text-gray-500 text-sm">Bid Types</Text>
                            <div className="flex items-center mt-1">
                              <Title level={2} className="!mb-0 !mt-0 text-2xl font-semibold">1</Title>
                              <SettingOutlined className="text-blue-500 ml-2" />
                            </div>
                            <Text className="text-gray-500 text-xs">Active configurations</Text>
                          </div>
                        </div>
                      </Card>
                    </Col>

                    <Col xs={24} sm={12} lg={8}>
                      <Card className="h-full">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <Text className="text-gray-500 text-sm">Monthly Revenue</Text>
                            <div className="flex items-center mt-1">
                              <Title level={2} className="!mb-0 !mt-0 text-2xl font-semibold">$47,250</Title>
                              <DollarOutlined className="text-blue-500 ml-2" />
                            </div>
                            <Text className="text-green-500 text-xs">+19.3% this month</Text>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  </Row>

                  {/* Second Row Stats */}
                  <Row gutter={[24, 24]} className="mb-6">
                    <Col xs={24} sm={12} lg={8}>
                      <Card className="h-full">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <Text className="text-gray-500 text-sm">Acceptance Rate</Text>
                            <div className="flex items-center mt-1">
                              <Title level={2} className="!mb-0 !mt-0 text-2xl font-semibold">72%</Title>
                              <RiseOutlined className="text-blue-500 ml-2" />
                            </div>
                            <Text className="text-green-500 text-xs">+2.1% this month</Text>
                          </div>
                        </div>
                      </Card>
                    </Col>

                    <Col xs={24} sm={12} lg={8}>
                      <Card className="h-full">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <Text className="text-gray-500 text-sm">Avg Bid Value</Text>
                            <div className="flex items-center mt-1">
                              <Title level={2} className="!mb-0 !mt-0 text-2xl font-semibold">$185</Title>
                              <BarChartOutlined className="text-blue-500 ml-2" />
                            </div>
                            <Text className="text-green-500 text-xs">+5.7% this month</Text>
                          </div>
                        </div>
                      </Card>
                    </Col>

                    <Col xs={24} sm={12} lg={8}>
                      <Card className="h-full">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <Text className="text-gray-500 text-sm">Pending Review</Text>
                            <div className="flex items-center mt-1">
                              <Title level={2} className="!mb-0 !mt-0 text-2xl font-semibold text-red-500">1</Title>
                              <AlertOutlined className="text-red-500 ml-2" />
                            </div>
                            <Text className="text-gray-500 text-xs">Require attention</Text>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  </Row>

                  {/* Action Buttons Row */}
                  <Row gutter={[24, 24]} className="mb-6">
                    <Col xs={24}>
                      <Card>
                        <div className="mb-4">
                          <Title level={4} className="!mb-1">Quick Actions</Title>
                          <Text className="text-gray-500">Frequently used bid management tasks</Text>
                        </div>
                        <Row gutter={[16, 16]}>
                          <Col xs={24} sm={8}>
                            <Button 
                              type="primary" 
                              size="large" 
                              icon={<PlusOutlined />} 
                              className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                              onClick={handleCreateBid}
                            >
                              Create New Bid
                            </Button>
                          </Col>
                          <Col xs={24} sm={8}>
                            <Button 
                              size="large" 
                              icon={<EyeOutlined />} 
                              className="w-full h-12"
                            >
                              Review Pending Bids
                            </Button>
                          </Col>
                          <Col xs={24} sm={8}>
                            <Button 
                              size="large" 
                              icon={<BarChartOutlined />} 
                              className="w-full h-12"
                            >
                              Generate Report
                            </Button>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  </Row>

                  {/* Recent Activity */}
                  <Row gutter={[24, 24]}>
                    <Col xs={24}>
                      <Card>
                        <div className="mb-4">
                          <Title level={4} className="!mb-1">Recent Bid Activity</Title>
                          <Text className="text-gray-500">Latest bid submissions and responses</Text>
                        </div>
                        <div className="space-y-4">
                          {recentActivities.map((activity, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div 
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: activity.color }}
                                />
                                <Text className="font-medium">{activity.title}</Text>
                              </div>
                              <Text className="text-gray-500 text-sm">{activity.time}</Text>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </div>
              ),
            },
            {
              key: 'insights',
              label: 'Insights',
              children: (
                <div>
                  {/* Insights Alert Cards */}
                  <Row gutter={[24, 24]} className="mb-6">
                    <Col xs={24} lg={8}>
                      <Card className="border-l-4 border-l-green-500">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <Text strong className="text-green-700">International Route Premium</Text>
                              <Tag color="red" size="small" className="ml-2">High</Tag>
                            </div>
                            <Text className="text-gray-600 text-sm mb-3">
                              JFK-LHR route shows 85% bid acceptance rate with avg bid of $420. Consider raising minimum thresholds.
                            </Text>
                            <div className="mb-2">
                              <Text className="text-gray-500 text-xs">Action:</Text>
                              <br />
                              <Text className="text-sm">Increase minimum bid by 15%</Text>
                            </div>
                            <div>
                              <Text className="text-gray-500 text-xs">Potential:</Text>
                              <br />
                              <Text className="text-green-600 font-medium">$16,000/month</Text>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Col>

                    <Col xs={24} lg={8}>
                      <Card className="border-l-4 border-l-orange-500">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                              <Text strong className="text-orange-700">Short-haul Bid Decline</Text>
                              <Tag color="orange" size="small" className="ml-2">Medium</Tag>
                            </div>
                            <Text className="text-gray-600 text-sm mb-3">
                              Domestic routes under 3 hours show declining bid participation (-12% this month).
                            </Text>
                            <div className="mb-2">
                              <Text className="text-gray-500 text-xs">Action:</Text>
                              <br />
                              <Text className="text-sm">Reduce minimum bid amounts for short routes</Text>
                            </div>
                            <div>
                              <Text className="text-gray-500 text-xs">Potential:</Text>
                              <br />
                              <Text className="text-orange-600 font-medium">$8,500/month</Text>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Col>

                    <Col xs={24} lg={8}>
                      <Card className="border-l-4 border-l-blue-500">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                              <Text strong className="text-blue-700">Dynamic Bid Windows</Text>
                              <Tag color="blue" size="small" className="ml-2">Medium</Tag>
                            </div>
                            <Text className="text-gray-600 text-sm mb-3">
                              High-demand flights could benefit from shorter bid windows to create urgency.
                            </Text>
                            <div className="mb-2">
                              <Text className="text-gray-500 text-xs">Action:</Text>
                              <br />
                              <Text className="text-sm">Implement 12-hour windows for 90%+ load factor</Text>
                            </div>
                            <div>
                              <Text className="text-gray-500 text-xs">Potential:</Text>
                              <br />
                              <Text className="text-blue-600 font-medium">$12,200/month</Text>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  </Row>

                  {/* Route-Level Bid Performance */}
                  <Row gutter={[24, 24]} className="mb-6">
                    <Col xs={24}>
                      <Card>
                        <div className="mb-4">
                          <Title level={4} className="!mb-1 flex items-center">
                            <BarChartOutlined className="mr-2" />
                            Route-Level Bid Performance
                          </Title>
                          <Text className="text-gray-500">Bidding success rates and revenue by route</Text>
                        </div>
                        
                        <Table
                          dataSource={[
                            {
                              key: '1',
                              route: 'LAX-JFK',
                              totalBids: 145,
                              accepted: 89,
                              successRate: '61.4%',
                              avgBid: '$285',
                              revenue: '$25,365',
                              demand: 'High'
                            },
                            {
                              key: '2',
                              route: 'JFK-LHR',
                              totalBids: 89,
                              accepted: 76,
                              successRate: '85.4%',
                              avgBid: '$420',
                              revenue: '$31,920',
                              demand: 'Very High'
                            },
                            {
                              key: '3',
                              route: 'ORD-SFO',
                              totalBids: 124,
                              accepted: 78,
                              successRate: '62.9%',
                              avgBid: '$195',
                              revenue: '$15,210',
                              demand: 'High'
                            },
                            {
                              key: '4',
                              route: 'MIA-DEN',
                              totalBids: 76,
                              accepted: 42,
                              successRate: '55.3%',
                              avgBid: '$165',
                              revenue: '$6,930',
                              demand: 'Medium'
                            },
                            {
                              key: '5',
                              route: 'ATL-SEA',
                              totalBids: 98,
                              accepted: 67,
                              successRate: '68.4%',
                              avgBid: '$225',
                              revenue: '$15,075',
                              demand: 'High'
                            }
                          ]}
                          columns={[
                            {
                              title: 'Route',
                              dataIndex: 'route',
                              key: 'route',
                            },
                            {
                              title: 'Total Bids',
                              dataIndex: 'totalBids',
                              key: 'totalBids',
                            },
                            {
                              title: 'Accepted',
                              dataIndex: 'accepted',
                              key: 'accepted',
                            },
                            {
                              title: 'Success Rate',
                              dataIndex: 'successRate',
                              key: 'successRate',
                            },
                            {
                              title: 'Avg Bid',
                              dataIndex: 'avgBid',
                              key: 'avgBid',
                            },
                            {
                              title: 'Revenue',
                              dataIndex: 'revenue',
                              key: 'revenue',
                            },
                            {
                              title: 'Demand',
                              dataIndex: 'demand',
                              key: 'demand',
                              render: (demand) => (
                                <Tag 
                                  color={
                                    demand === 'Very High' ? 'red' : 
                                    demand === 'High' ? 'blue' : 
                                    'orange'
                                  }
                                >
                                  {demand}
                                </Tag>
                              ),
                            },
                          ]}
                          pagination={false}
                        />
                      </Card>
                    </Col>
                  </Row>

                  {/* Demand & Supply Analysis */}
                  <Row gutter={[24, 24]}>
                    <Col xs={24}>
                      <Card>
                        <div className="mb-4">
                          <Title level={4} className="!mb-1 flex items-center">
                            <RiseOutlined className="mr-2" />
                            Demand & Supply Analysis
                          </Title>
                          <Text className="text-gray-500">Upgrade class demand vs available inventory</Text>
                        </div>

                        <div className="space-y-6">
                          {/* Economy to Premium */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Text strong>Economy to Premium</Text>
                              <Tag color="green">increasing</Tag>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex space-x-8">
                                <div className="text-center">
                                  <Text className="text-2xl font-bold text-blue-600">78</Text>
                                  <br />
                                  <Text className="text-xs text-gray-500">Demand</Text>
                                </div>
                                <div className="text-center">
                                  <Text className="text-2xl font-bold text-green-600">45</Text>
                                  <br />
                                  <Text className="text-xs text-gray-500">Supply</Text>
                                </div>
                                <div className="text-center">
                                  <Text className="text-2xl font-bold text-purple-600">1.73</Text>
                                  <br />
                                  <Text className="text-xs text-gray-500">D/S Ratio</Text>
                                </div>
                                <div className="text-center">
                                  <Text className="text-2xl font-bold text-red-600">$125</Text>
                                  <br />
                                  <Text className="text-xs text-gray-500">Avg Bid</Text>
                                </div>
                              </div>
                              <Text className="text-gray-500">63.4%</Text>
                            </div>
                            <Progress percent={63.4} strokeColor="#3b82f6" />
                            <Text className="text-gray-500 text-sm">Demand Pressure</Text>
                          </div>

                          {/* Economy to Business */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Text strong>Economy to Business</Text>
                              <Tag color="blue">stable</Tag>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex space-x-8">
                                <div className="text-center">
                                  <Text className="text-2xl font-bold text-blue-600">85</Text>
                                  <br />
                                  <Text className="text-xs text-gray-500">Demand</Text>
                                </div>
                                <div className="text-center">
                                  <Text className="text-2xl font-bold text-green-600">25</Text>
                                  <br />
                                  <Text className="text-xs text-gray-500">Supply</Text>
                                </div>
                                <div className="text-center">
                                  <Text className="text-2xl font-bold text-purple-600">2.6</Text>
                                  <br />
                                  <Text className="text-xs text-gray-500">D/S Ratio</Text>
                                </div>
                                <div className="text-center">
                                  <Text className="text-2xl font-bold text-red-600">$285</Text>
                                  <br />
                                  <Text className="text-xs text-gray-500">Avg Bid</Text>
                                </div>
                              </div>
                              <Text className="text-gray-500">72.2%</Text>
                            </div>
                            <Progress percent={72.2} strokeColor="#1890ff" />
                            <Text className="text-gray-500 text-sm">Demand Pressure</Text>
                          </div>

                          {/* Premium to Business */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Text strong>Premium to Business</Text>
                              <Tag color="red">decreasing</Tag>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex space-x-8">
                                <div className="text-center">
                                  <Text className="text-2xl font-bold text-blue-600">45</Text>
                                  <br />
                                  <Text className="text-xs text-gray-500">Demand</Text>
                                </div>
                                <div className="text-center">
                                  <Text className="text-2xl font-bold text-green-600">35</Text>
                                  <br />
                                  <Text className="text-xs text-gray-500">Supply</Text>
                                </div>
                                <div className="text-center">
                                  <Text className="text-2xl font-bold text-purple-600">1.29</Text>
                                  <br />
                                  <Text className="text-xs text-gray-500">D/S Ratio</Text>
                                </div>
                                <div className="text-center">
                                  <Text className="text-2xl font-bold text-red-600">$180</Text>
                                  <br />
                                  <Text className="text-xs text-gray-500">Avg Bid</Text>
                                </div>
                              </div>
                              <Text className="text-gray-500">56.3%</Text>
                            </div>
                            <Progress percent={56.3} strokeColor="#f5222d" />
                            <Text className="text-gray-500 text-sm">Demand Pressure</Text>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );

  const tabItems = [
    {
      key: '1',
      label: (
        <span className="flex items-center">
          <BarChartOutlined className="mr-2" />
          Dashboard
        </span>
      ),
      children: renderDashboardContent(),
    },
    {
      key: '2',
      label: (
        <span className="flex items-center">
          <ClockCircleOutlined className="mr-2" />
          Active Bids
        </span>
      ),
      children: renderActiveBidsContent(),
    },
    {
      key: '3',
      label: (
        <span className="flex items-center">
          <SettingOutlined className="mr-2" />
          Bid Setup
        </span>
      ),
      children: renderBidSetupContent(),
    },
    {
      key: '4',
      label: (
        <span className="flex items-center">
          <CreditCardOutlined className="mr-2" />
          Payments
        </span>
      ),
      children: renderPaymentsContent(),
    },
    {
      key: '5',
      label: (
        <span className="flex items-center">
          <HistoryOutlined className="mr-2" />
          History
        </span>
      ),
      children: renderHistoryContent(),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">GR</span>
                </div>
                <div>
                  <Text className="text-gray-600 text-sm font-medium">GROUP RETAIL</Text>
                  <br />
                  <Text className="text-gray-500 text-xs">ADMIN PORTAL</Text>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge count={1} size="small">
                <BellOutlined className="text-gray-500 text-lg" />
              </Badge>
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <div className="flex items-center space-x-2 cursor-pointer">
                  <Avatar size="small" className="bg-blue-600">
                    JD
                  </Avatar>
                  <div className="text-right">
                    <Text className="text-sm font-medium block">John Doe</Text>
                    <Text className="text-xs text-gray-500">System Administrator</Text>
                  </div>
                </div>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 min-h-screen sticky top-[73px] shadow-xl">
          <div className="p-6">
            <nav className="space-y-2">
              <div 
                className="flex items-center space-x-3 text-slate-300 hover:text-white px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 cursor-pointer transition-all duration-200"
                onClick={() => setLocation('/admin/dashboard')}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-current text-xs">📊</span>
                </div>
                <Text className="text-current">Dashboard</Text>
              </div>
              <div 
                className="flex items-center space-x-3 text-slate-300 hover:text-white px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 cursor-pointer transition-all duration-200"
                onClick={() => setLocation('/admin/offer-management')}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-current text-xs">🎯</span>
                </div>
                <Text className="text-current">Offers Management</Text>
              </div>
              <div className="flex items-center space-x-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg px-4 py-3 shadow-md">
                <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                  <span className="text-blue-600 text-xs">📋</span>
                </div>
                <Text className="text-white font-medium">Bid Management</Text>
              </div>
              <div 
                className="flex items-center space-x-3 text-slate-300 hover:text-white px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 cursor-pointer transition-all duration-200"
                onClick={() => setLocation('/admin/bookings')}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-current text-xs">📅</span>
                </div>
                <Text className="text-current">Bookings Management</Text>
              </div>
              <div 
                className="flex items-center space-x-3 text-slate-300 hover:text-white px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 cursor-pointer transition-all duration-200"
                onClick={() => setLocation('/admin/cms')}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-current text-xs">⚙️</span>
                </div>
                <Text className="text-current">CMS Management</Text>
              </div>
              <div 
                className="flex items-center space-x-3 text-slate-300 hover:text-white px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 cursor-pointer transition-all duration-200"
                onClick={() => setLocation('/admin/reports')}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-current text-xs">📊</span>
                </div>
                <Text className="text-current">Reports & Analytics</Text>
              </div>
              <div 
                className="flex items-center space-x-3 text-slate-300 hover:text-white px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 cursor-pointer transition-all duration-200"
                onClick={() => setLocation('/admin/admin-settings')}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-current text-xs">🔧</span>
                </div>
                <Text className="text-current">System Settings</Text>
              </div>
            </nav>
          </div>

          {/* User Info at bottom */}
          <div className="absolute bottom-0 left-0 right-0 w-64 p-6 border-t border-slate-700">
            <div className="flex items-center space-x-3">
              <Avatar size="small" className="bg-gradient-to-r from-blue-600 to-purple-600">
                <span className="text-white font-medium">JD</span>
              </Avatar>
              <div className="flex-1">
                <Text className="text-white font-medium block">John Doe</Text>
                <Text className="text-slate-300 text-sm">System Admin</Text>
              </div>
            </div>
            <Button 
              type="text" 
              onClick={handleLogout}
              className="w-full mt-4 text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
              size="small"
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-4">
            <Breadcrumb.Item>
              <HomeOutlined />
              <span className="ml-1">Home</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Bid Management</Breadcrumb.Item>
          </Breadcrumb>

          {/* Page Header */}
          <div className="mb-6">
            <Title level={2} className="!mb-1 text-gray-900">
              Bid Management
            </Title>
            <Text className="text-gray-600">
              Manage passenger upgrade bids and bidding configurations
            </Text>
          </div>

          {/* Main Content Area */}
          <div className="bg-white rounded-lg shadow-sm">
            {/* Navigation Tabs */}
            <Tabs 
              activeKey={activeTab} 
              onChange={setActiveTab}
              className="px-6"
              items={tabItems}
            />
          </div>
        </div>
      </div>

      {/* Create New Bid Modal */}
      <Modal
        title={null}
        visible={createBidModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={900}
        centered
        destroyOnClose
        className="modern-modal"
      >
        {/* Custom Modal Header */}
        <div className="bg-white -m-6 mb-0 px-6 py-4 rounded-t-lg border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <PlusOutlined className="text-blue-600 text-lg" />
              </div>
              <div>
                <Title level={4} className="!mb-1 text-gray-800 font-bold">
                  Create New Bid Configuration
                </Title>
                <Text className="text-gray-600 text-sm">
                  Set up a new bidding configuration for your airline route
                </Text>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
          >
            {/* Simple Steps Display */}
            <div className="mb-6">
              <div className="relative">
                {/* Progress Bar Background */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0"></div>
                {/* Active Progress Bar */}
                <div 
                  className="absolute top-5 left-0 h-0.5 bg-blue-500 z-10"
                  style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                ></div>
                
                {/* Steps */}
                <div className="relative flex justify-between z-20">
                  {steps.map((step, index) => (
                    <div key={step.title} className="flex flex-col items-center">
                      {/* Step Circle */}
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-3
                        ${index < currentStep 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : index === currentStep 
                          ? 'bg-blue-500 border-blue-500 text-white' 
                          : 'bg-white border-gray-300 text-gray-500'
                        }
                      `}>
                        {index < currentStep ? (
                          <span className="text-sm">✓</span>
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>
                      
                      {/* Step Title */}
                      <div className="mt-2 text-center max-w-[120px]">
                        <Text className={`
                          text-xs font-medium
                          ${index <= currentStep ? 'text-gray-800' : 'text-gray-500'}
                        `}>
                          {step.title}
                        </Text>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step Content */}
            <div className="min-h-[380px] bg-gray-50 rounded-lg p-4">
              {/* Step 1: Flight & Route Details */}
              {currentStep === 0 && (
                <div>
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-1 h-5 bg-blue-500 rounded"></div>
                      <Title level={5} className="!mb-0 text-blue-600">Flight & Route Details</Title>
                    </div>
                    <Text className="text-gray-500 text-sm">Configure the basic flight information for bidding</Text>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Form.Item
                          label={<span className="font-semibold text-gray-700">Bid Title</span>}
                          name="bidTitle"
                          rules={[{ required: true, message: 'Please enter bid title' }]}
                        >
                          <Input 
                            placeholder="Enter bid configuration title" 
                            size="large"
                            className="rounded-md"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={<span className="font-semibold text-gray-700">Flight Type</span>}
                          name="flightType"
                          rules={[{ required: true, message: 'Please select flight type' }]}
                        >
                          <Select 
                            placeholder="Select flight type" 
                            size="large"
                            className="w-full"
                          >
                            <Select.Option value="Domestic">Domestic</Select.Option>
                            <Select.Option value="International">International</Select.Option>
                            <Select.Option value="Regional">Regional</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={<span className="font-semibold text-gray-700">Origin Airport (IATA Code)</span>}
                          name="origin"
                          rules={[{ required: true, message: 'Please select origin airport' }]}
                        >
                          <Select 
                            placeholder="Select origin airport" 
                            size="large"
                            showSearch
                            optionFilterProp="children"
                          >
                            <Select.Option value="LAX">Los Angeles (LAX)</Select.Option>
                            <Select.Option value="JFK">New York JFK (JFK)</Select.Option>
                            <Select.Option value="ORD">Chicago O'Hare (ORD)</Select.Option>
                            <Select.Option value="SFO">San Francisco (SFO)</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={<span className="font-semibold text-gray-700">Destination Airport (IATA Code)</span>}
                          name="destination"
                          rules={[{ required: true, message: 'Please select destination airport' }]}
                        >
                          <Select 
                            placeholder="Select destination airport" 
                            size="large"
                            showSearch
                            optionFilterProp="children"
                          >
                            <Select.Option value="LAX">Los Angeles (LAX)</Select.Option>
                            <Select.Option value="JFK">New York JFK (JFK)</Select.Option>
                            <Select.Option value="ORD">Chicago O'Hare (ORD)</Select.Option>
                            <Select.Option value="SFO">San Francisco (SFO)</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={<span className="font-semibold text-gray-700">Travel Date</span>}
                          name="travelDate"
                          rules={[{ required: true, message: 'Please select travel date' }]}
                        >
                          <DatePicker className="w-full" size="large" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={<span className="font-semibold text-gray-700">Preferred Departure Time Range</span>}
                          name="departureTimeRange"
                          rules={[{ required: true, message: 'Please select departure time range' }]}
                        >
                          <TimePicker.RangePicker className="w-full" format="HH:mm" size="large" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                </div>
              )}

              {/* Step 2: Seat Configurations & Limits */}
              {currentStep === 1 && (
                <div>
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-1 h-5 bg-green-500 rounded"></div>
                      <Title level={5} className="!mb-0 text-green-600">Seat Configurations & Limits</Title>
                    </div>
                    <Text className="text-gray-500 text-sm">Set up seating classes and availability limits</Text>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Form.Item
                          label={<span className="font-semibold text-gray-700">From Class</span>}
                          name="fromClass"
                          rules={[{ required: true, message: 'Please select from class' }]}
                        >
                          <Select placeholder="Select class" size="large">
                            <Select.Option value="Economy">Economy</Select.Option>
                            <Select.Option value="Premium Economy">Premium Economy</Select.Option>
                            <Select.Option value="Business">Business</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={<span className="font-semibold text-gray-700">To Class</span>}
                          name="toClass"
                          rules={[{ required: true, message: 'Please select to class' }]}
                        >
                          <Select placeholder="Select class" size="large">
                            <Select.Option value="Premium Economy">Premium Economy</Select.Option>
                            <Select.Option value="Business">Business</Select.Option>
                            <Select.Option value="First">First</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={<span className="font-semibold text-gray-700">Maximum Bids</span>}
                          name="maxBids"
                          rules={[{ required: true, message: 'Please enter maximum bids' }]}
                        >
                          <InputNumber min={1} className="w-full" placeholder="50" size="large" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={<span className="font-semibold text-gray-700">Available Seats</span>}
                          name="availableSeats"
                          rules={[{ required: true, message: 'Please enter available seats' }]}
                        >
                          <InputNumber min={1} className="w-full" placeholder="25" size="large" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                </div>
              )}

              {/* Step 3: Bid Pricing & Currency */}
              {currentStep === 2 && (
                <div>
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-1 h-5 bg-purple-500 rounded"></div>
                      <Title level={5} className="!mb-0 text-purple-600">Bid Pricing & Currency</Title>
                    </div>
                    <Text className="text-gray-500 text-sm">Configure pricing parameters and currency settings</Text>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Form.Item
                          label={<span className="font-semibold text-gray-700">Minimum Bid Amount</span>}
                          name="minBidAmount"
                          rules={[{ required: true, message: 'Please enter minimum bid amount' }]}
                        >
                          <InputNumber 
                            min={0} 
                            className="w-full" 
                            placeholder="100"
                            size="large"
                            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={<span className="font-semibold text-gray-700">Maximum Bid Amount</span>}
                          name="maxBidAmount"
                          rules={[{ required: true, message: 'Please enter maximum bid amount' }]}
                        >
                          <InputNumber 
                            min={0} 
                            className="w-full" 
                            placeholder="500"
                            size="large"
                            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          label={<span className="font-semibold text-gray-700">Currency</span>}
                          name="currency"
                          rules={[{ required: true, message: 'Please select currency' }]}
                        >
                          <Radio.Group className="w-full">
                            <Space direction="vertical" className="w-full">
                              <Radio value="USD" className="w-full p-3 border rounded-lg hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">USD - US Dollar</span>
                                  <span className="text-gray-500">$</span>
                                </div>
                              </Radio>
                              <Radio value="EUR" className="w-full p-3 border rounded-lg hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">EUR - Euro</span>
                                  <span className="text-gray-500">€</span>
                                </div>
                              </Radio>
                              <Radio value="GBP" className="w-full p-3 border rounded-lg hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">GBP - British Pound</span>
                                  <span className="text-gray-500">£</span>
                                </div>
                              </Radio>
                            </Space>
                          </Radio.Group>
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                </div>
              )}

              {/* Step 4: Bidding Schedule & Rules */}
              {currentStep === 3 && (
                <div>
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-1 h-5 bg-orange-500 rounded"></div>
                      <Title level={5} className="!mb-0 text-orange-600">Bidding Schedule & Rules</Title>
                    </div>
                    <Text className="text-gray-500 text-sm">Set up timing and automated bidding rules</Text>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Form.Item
                          label={<span className="font-semibold text-gray-700">Bidding Start Time</span>}
                          name="biddingStartTime"
                          rules={[{ required: true, message: 'Please select start time' }]}
                        >
                          <DatePicker showTime className="w-full" size="large" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={<span className="font-semibold text-gray-700">Bidding End Time</span>}
                          name="biddingEndTime"
                          rules={[{ required: true, message: 'Please select end time' }]}
                        >
                          <DatePicker showTime className="w-full" size="large" />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          label={<span className="font-semibold text-gray-700">Auto Accept Rules</span>}
                          name="autoAcceptRules"
                        >
                          <div className="space-y-3">
                            <Checkbox.Group className="w-full">
                              <div className="space-y-3">
                                <div className="p-4 border rounded-lg hover:bg-gray-50">
                                  <Checkbox value="highestBid" className="w-full">
                                    <div>
                                      <span className="font-medium">Auto-accept highest valid bid</span>
                                      <p className="text-sm text-gray-500 mt-1">Automatically accept the highest bid that meets minimum requirements</p>
                                    </div>
                                  </Checkbox>
                                </div>
                                <div className="p-4 border rounded-lg hover:bg-gray-50">
                                  <Checkbox value="minimumThreshold" className="w-full">
                                    <div>
                                      <span className="font-medium">Auto-accept bids above minimum threshold</span>
                                      <p className="text-sm text-gray-500 mt-1">Accept any bid that exceeds the minimum threshold amount</p>
                                    </div>
                                  </Checkbox>
                                </div>
                                <div className="p-4 border rounded-lg hover:bg-gray-50">
                                  <Checkbox value="firstComeFirstServe" className="w-full">
                                    <div>
                                      <span className="font-medium">First come, first serve basis</span>
                                      <p className="text-sm text-gray-500 mt-1">Accept bids in the order they are received</p>
                                    </div>
                                  </Checkbox>
                                </div>
                              </div>
                            </Checkbox.Group>
                          </div>
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                </div>
              )}

              {/* Step 5: Fleet, Terms & Conditions */}
              {currentStep === 4 && (
                <div>
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-1 h-5 bg-red-500 rounded"></div>
                      <Title level={5} className="!mb-0 text-red-600">Fleet, Terms & Conditions</Title>
                    </div>
                    <Text className="text-gray-500 text-sm">Final configuration and terms setup</Text>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Form.Item
                          label={<span className="font-semibold text-gray-700">Fleet Type</span>}
                          name="fleetType"
                          rules={[{ required: true, message: 'Please select fleet type' }]}
                        >
                          <Select placeholder="Select fleet type" size="large">
                            <Select.Option value="Boeing 737">Boeing 737</Select.Option>
                            <Select.Option value="Airbus A320">Airbus A320</Select.Option>
                            <Select.Option value="Boeing 777">Boeing 777</Select.Option>
                            <Select.Option value="Airbus A350">Airbus A350</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={<span className="font-semibold text-gray-700">Cancellation Policy</span>}
                          name="cancellationPolicy"
                          rules={[{ required: true, message: 'Please select cancellation policy' }]}
                        >
                          <Select placeholder="Select policy" size="large">
                            <Select.Option value="flexible">Flexible - Full refund</Select.Option>
                            <Select.Option value="standard">Standard - 50% refund</Select.Option>
                            <Select.Option value="strict">Strict - No refund</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          label={<span className="font-semibold text-gray-700">Special Notes</span>}
                          name="specialNotes"
                        >
                          <Input.TextArea 
                            rows={6} 
                            placeholder="Enter any special terms, conditions, or notes for this bid..."
                            className="rounded-lg"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Footer */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <div>
                {currentStep > 0 && (
                  <Button onClick={handlePrev} className="px-4">
                    <span className="mr-1">←</span>
                    Previous
                  </Button>
                )}
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleModalCancel} className="px-4">
                  Cancel
                </Button>
                {currentStep < steps.length - 1 ? (
                  <Button type="primary" onClick={handleNext} className="px-4 bg-blue-600 hover:bg-blue-700">
                    Next
                    <span className="ml-1">→</span>
                  </Button>
                ) : (
                  <Button 
                    type="primary" 
                    onClick={() => form.submit()}
                    className="px-6 bg-green-600 hover:bg-green-700"
                  >
                    <PlusOutlined className="mr-1" />
                    Create Bid
                  </Button>
                )}
              </div>
            </div>
          </Form>
        </div>
      </Modal>

      <style>{`
        .ant-tabs-nav {
          margin-bottom: 0;
        }

        .ant-tabs-tab {
          padding: 12px 20px;
          font-weight: 500;
        }

        .ant-tabs-tab-active {
          background-color: #f8fafc;
          border-bottom: 2px solid #3b82f6;
        }

        .ant-card {
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          border: 1px solid #f1f5f9;
        }

        .ant-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .ant-statistic-title {
          font-size: 14px;
          color: #6b7280;
        }

        .ant-statistic-content {
          color: #1f2937;
        }

        .ant-steps-item-process .ant-steps-item-icon {
          background-color: #3b82f6;
          border-color: #3b82f6;
        }

        .modern-modal .ant-modal-content {
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .modern-modal .ant-modal-body {
          padding: 0;
        }

        .modern-modal .ant-modal-close {
          top: 24px;
          right: 24px;
          color: #000000;
          font-size: 20px;
          width: 40px;
          height: 40px;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .modern-modal .ant-modal-close:hover {
          background: rgba(0, 0, 0, 0.1);
          color: #000000;
          transform: scale(1.1);
        }

        .modern-modal .ant-modal-close-x {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }

        .ant-radio-wrapper {
          border: 1px solid transparent;
          border-radius: 8px;
          padding: 12px;
          margin: 0;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .ant-radio-wrapper:hover {
          background-color: #f8fafc;
          border-color: #e2e8f0;
        }

        .ant-radio-wrapper-checked {
          background-color: #eff6ff;
          border-color: #3b82f6;
        }

        .ant-checkbox-wrapper {
          border: 1px solid transparent;
          border-radius: 8px;
          padding: 12px;
          margin: 0;
          display: flex;
          align-items: flex-start;
          width: 100%;
        }

        .ant-checkbox-wrapper:hover {
          background-color: #f8fafc;
          border-color: #e2e8f0;
        }

        .ant-checkbox-wrapper-checked {
          background-color: #eff6ff;
          border-color: #3b82f6;
        }

        .ant-form-item-label > label {
          font-weight: 600;
          color: #374151;
        }

        .ant-select-selector,
        .ant-picker,
        .ant-input-number,
        .ant-input {
          border-radius: 8px !important;
          border: 2px solid #e5e7eb !important;
        }

        .ant-select-selector:hover,
        .ant-picker:hover,
        .ant-input-number:hover,
        .ant-input:hover {
          border-color: #3b82f6 !important;
        }

        .ant-select-focused .ant-select-selector,
        .ant-picker-focused,
        .ant-input-number-focused,
        .ant-input-focused {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }
      `}</style>
    </div>
  );
}