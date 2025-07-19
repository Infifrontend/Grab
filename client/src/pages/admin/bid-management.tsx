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
  Divider,
  message
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
  AlertOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const { Title, Text } = Typography;

export default function BidManagement() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [createBidModalVisible, setCreateBidModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [originOptions, setOriginOptions] = useState<string[]>([]);
  const [destinationOptions, setDestinationOptions] = useState<string[]>([]);
  const [bidConfigurations, setBidConfigurations] = useState([]);

  // Fetch unique flight locations for autocomplete
  const { data: locationsData } = useQuery({
    queryKey: ["flight-locations"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/flight-locations");
      return response.json();
    },
  });

  // Fetch bid configurations
  const { data: bidsData, refetch: refetchBids } = useQuery({
    queryKey: ["bid-configurations"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/bid-configurations-list");
      return response.json();
    },
  });

  useEffect(() => {
    // Check if admin is logged in
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isAdminLoggedIn) {
      setLocation('/admin/login');
    }
  }, [setLocation]);

  useEffect(() => {
    if (locationsData?.locations) {
      setOriginOptions(locationsData.locations);
      setDestinationOptions(locationsData.locations);
    }
  }, [locationsData]);

  useEffect(() => {
    if (bidsData) {
      setBidConfigurations(bidsData);
    }
  }, [bidsData]);

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

  // Generate recent activities from actual bid configurations
  const recentActivities = bidConfigurations.slice(0, 5).map((bid, index) => {
    let configData = {};
    try {
      configData = bid.notes ? JSON.parse(bid.notes) : {};
    } catch (e) {
      configData = {};
    }

    const timeAgo = bid.createdAt ? getTimeAgo(new Date(bid.createdAt)) : 'Recently';
    const title = configData.title || `Bid Configuration #${bid.id}`;
    const route = configData.origin && configData.destination ? 
      `${configData.origin} → ${configData.destination}` : 'Route not specified';

    return {
      type: bid.bidStatus === 'active' ? 'active' : 'created',
      color: bid.bidStatus === 'active' ? '#52c41a' : '#1890ff',
      title: `New bid configuration created: ${title} (${route})`,
      time: timeAgo
    };
  });

  // Helper function to calculate time ago
  function getTimeAgo(date) {
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      return `${diffInDays} days ago`;
    }
  }

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
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      console.log('Form values before submission:', values);

      // Allow submission without required field validation

      // Format the data properly
      const formattedData = {
        ...values,
        travelDate: values.travelDate ? values.travelDate.format('YYYY-MM-DD') : null,
        bidStartTime: values.bidStartTime ? values.bidStartTime.toISOString() : null,
        bidEndTime: values.bidEndTime ? values.bidEndTime.toISOString() : null,
        departureTimeRange: values.departureTimeRange ? values.departureTimeRange.map(time => time.format('HH:mm')).join(' - ') : null
      };

      console.log('Formatted data for submission:', formattedData);
      
      const response = await apiRequest('POST', '/api/bid-configurations', formattedData);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API response error:', errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('API response result:', result);
      
      if (result.success) {
        // Show success message
        message.success(result.message || `Bid configuration "${values.bidTitle || 'New Bid'}" created successfully!`);
        
        // Refetch bid configurations to update the Recent Bid Activity
        refetchBids();
        
        // Close modal and reset form
        setCreateBidModalVisible(false);
        setCurrentStep(0);
        form.resetFields();
      } else {
        console.error('API returned error:', result);
        message.error(result.message || 'Failed to create bid configuration');
      }
    } catch (error) {
      console.error('Error creating bid configuration:', error);
      
      // Show more specific error message
      let errorMessage = 'Failed to create bid configuration. Please try again.';
      if (error.message) {
        if (error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('API Error')) {
          errorMessage = 'Server error. Please try again or contact support.';
        } else {
          errorMessage = error.message;
        }
      }
      
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
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
      title: 'Fare Terms & Ancillaries',
      content: 'fare-terms',
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
        {bidConfigurations.length === 0 ? (
          <div className="text-center py-8">
            <Text className="text-gray-500">No bid configurations found. Create your first bid configuration to get started.</Text>
          </div>
        ) : (
          bidConfigurations.map((bid) => {
            let configData = {};
            try {
              configData = bid.notes ? JSON.parse(bid.notes) : {};
            } catch (e) {
              configData = {};
            }

            const title = configData.title || `Bid Configuration #${bid.id}`;
            const route = configData.origin && configData.destination ? 
              `${configData.origin} → ${configData.destination}` : 'Route not specified';
            const totalSeats = configData.totalSeatsAvailable || 'N/A';
            const fareType = configData.fareType || 'Economy';
            const createdDate = bid.createdAt ? new Date(bid.createdAt).toLocaleDateString() : 'Unknown';
            
            const statusColor = bid.bidStatus === 'active' ? 'green' : 
                               bid.bidStatus === 'pending' ? 'orange' : 'red';
            const statusText = bid.bidStatus === 'active' ? 'Active' : 
                              bid.bidStatus === 'pending' ? 'Pending' : 'Inactive';

            return (
              <Card key={bid.id} className="hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <Title level={5} className="!mb-0 !mr-3">{title}</Title>
                      <Tag color={statusColor} className="text-xs">{statusText}</Tag>
                    </div>

                    <Row gutter={[32, 16]}>
                      <Col span={6}>
                        <div>
                          <Text className="text-gray-500 text-sm block mb-1">Route:</Text>
                          <Text className="font-medium">{route}</Text>
                        </div>
                      </Col>
                      <Col span={6}>
                        <div>
                          <Text className="text-gray-500 text-sm block mb-1">Total Seats:</Text>
                          <Text className="font-medium">{totalSeats}</Text>
                        </div>
                      </Col>
                      <Col span={6}>
                        <div>
                          <Text className="text-gray-500 text-sm block mb-1">Fare Type:</Text>
                          <Text className="font-medium">{fareType}</Text>
                        </div>
                      </Col>
                      <Col span={6}>
                        <div>
                          <Text className="text-gray-500 text-sm block mb-1">Bid Amount:</Text>
                          <Text className="font-medium">₹{bid.bidAmount}</Text>
                        </div>
                      </Col>
                    </Row>

                    <div className="mt-4">
                      <Text className="text-gray-400 text-xs">Created: {createdDate}</Text>
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
                      defaultChecked={bid.bidStatus === 'active'}
                      size="small"
                      checkedChildren="ON"
                      unCheckedChildren="OFF"
                    />
                  </div>
                </div>
              </Card>
            );
          })
        )}
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
                          label={<span className="font-semibold text-gray-700">Bid Title *</span>}
                          name="bidTitle"
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
                          label={<span className="font-semibold text-gray-700">Origin Airport (IATA Code) *</span>}
                          name="origin"
                        >
                          <Select 
                            mode="combobox"
                            placeholder="Search city / airport" 
                            size="large"
                            showSearch
                            filterOption={(input, option) =>
                              (option?.value ?? "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            suffixIcon={<EnvironmentOutlined className="text-gray-400" />}
                            notFoundContent="No locations found"
                          >
                            {originOptions.map((location) => (
                              <Select.Option key={location} value={location}>
                                {location}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={<span className="font-semibold text-gray-700">Destination Airport (IATA Code) *</span>}
                          name="destination"
                        >
                          <Select 
                            mode="combobox"
                            placeholder="Search city / airport" 
                            size="large"
                            showSearch
                            filterOption={(input, option) =>
                              (option?.value ?? "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            suffixIcon={<EnvironmentOutlined className="text-gray-400" />}
                            notFoundContent="No locations found"
                          >
                            {destinationOptions.map((location) => (
                              <Select.Option key={location} value={location}>
                                {location}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={<span className="font-semibold text-gray-700">Travel Date *</span>}
                          name="travelDate"
                        >
                          <DatePicker className="w-full" size="large" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={<span className="font-semibold text-gray-700">Preferred Departure Time Range</span>}
                          name="departureTimeRange"
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
                          label={<span className="font-semibold text-gray-700">Total Seats Available</span>}
                          name="totalSeatsAvailable"
                        >
                          <InputNumber min={1} className="w-full" placeholder="50" size="large" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={<span className="font-semibold text-gray-700">Min Seats per Bid</span>}
                          name="minSeatsPerBid"
                        >
                          <InputNumber min={1} className="w-full" placeholder="5" size="large" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Form.Item
                          label={<span className="font-semibold text-gray-700">Max Seats per Bid</span>}
                          name="maxSeatsPerBid"
                        >
                          <InputNumber min={1} className="w-full" placeholder="20" size="large" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={<span className="font-semibold text-gray-700">Max Seats per User</span>}
                          name="maxSeatsPerUser"
                        >
                          <InputNumber min={1} className="w-full" placeholder="10" size="large" />
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
                    <Text className="text-gray-500 text-sm">Configure bidding schedule and automation settings</Text>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Form.Item
                          label={<span className="font-semibold text-gray-700">Bid Start Time *</span>}
                          name="bidStartTime"
                        >
                          <DatePicker 
                            showTime={{ format: 'HH:mm' }}
                            format="DD/MM/YYYY HH:mm"
                            placeholder="Select start time"
                            className="w-full" 
                            size="large"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={<span className="font-semibold text-gray-700">Bid End Time *</span>}
                          name="bidEndTime"
                        >
                          <DatePicker 
                            showTime={{ format: 'HH:mm' }}
                            format="DD/MM/YYYY HH:mm"
                            placeholder="Select end time"
                            className="w-full" 
                            size="large"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <div className="space-y-4">
                          <div className="p-4 border rounded-lg">
                            <Form.Item
                              label={<span className="font-semibold text-gray-700">Auto-Award Top Bidder</span>}
                              name="autoAwardTopBidder"
                              valuePropName="checked"
                              className="!mb-2"
                            >
                              <Switch 
                                size="default"
                                checkedChildren="ON"
                                unCheckedChildren="OFF"
                              />
                            </Form.Item>
                            <Text className="text-gray-500 text-sm">
                              Automatically accept the highest valid bid when bidding ends
                            </Text>
                          </div>
                          
                          <div className="p-4 border rounded-lg">
                            <Form.Item
                              label={<span className="font-semibold text-gray-700">Manual Review Option</span>}
                              name="manualReviewOption"
                              valuePropName="checked"
                              className="!mb-2"
                            >
                              <Switch 
                                size="default"
                                checkedChildren="ON"
                                unCheckedChildren="OFF"
                              />
                            </Form.Item>
                            <Text className="text-gray-500 text-sm">
                              Allow manual review and approval before awarding bids
                            </Text>
                          </div>
                          
                          <div className="p-4 border rounded-lg">
                            <Form.Item
                              label={<span className="font-semibold text-gray-700">Auto Refund Non-Winners</span>}
                              name="autoRefundNonWinners"
                              valuePropName="checked"
                              className="!mb-2"
                            >
                              <Switch 
                                size="default"
                                checkedChildren="ON"
                                unCheckedChildren="OFF"
                              />
                            </Form.Item>
                            <Text className="text-gray-500 text-sm">
                              Automatically refund unsuccessful bidders when bids are awarded
                            </Text>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              )}

              {/* Step 4: Fare Terms & Ancillaries */}
              {currentStep === 3 && (
                <div>
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-1 h-5 bg-orange-500 rounded"></div>
                      <Title level={5} className="!mb-0 text-orange-600">Fare Terms & Ancillaries</Title>
                    </div>
                    <Text className="text-gray-500 text-sm">Configure fare type, baggage allowance, and additional services</Text>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Form.Item
                          label={<span className="font-semibold text-gray-700">Fare Type</span>}
                          name="fareType"
                        >
                          <Select placeholder="Select fare type" size="large">
                            <Select.Option value="Economy">Economy</Select.Option>
                            <Select.Option value="Premium Economy">Premium Economy</Select.Option>
                            <Select.Option value="Business Class">Business Class</Select.Option>
                            <Select.Option value="First Class">First Class</Select.Option>
                            <Select.Option value="Flexible Fare">Flexible Fare</Select.Option>
                            <Select.Option value="Restricted Fare">Restricted Fare</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={<span className="font-semibold text-gray-700">Baggage Allowance (kg)</span>}
                          name="baggageAllowance"
                        >
                          <InputNumber min={0} max={100} className="w-full" placeholder="20" size="large" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={<span className="font-semibold text-gray-700">Cancellation Terms</span>}
                          name="cancellationTerms"
                        >
                          <Select placeholder="Select cancellation terms" size="large">
                            <Select.Option value="Flexible - Free cancellation">Flexible - Free cancellation</Select.Option>
                            <Select.Option value="Standard - 24h free cancellation">Standard - 24h free cancellation</Select.Option>
                            <Select.Option value="Restricted - Cancellation fee applies">Restricted - Cancellation fee applies</Select.Option>
                            <Select.Option value="Non-refundable">Non-refundable</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <div className="pt-8">
                          <Form.Item
                            name="mealIncluded"
                            valuePropName="checked"
                            className="!mb-2"
                          >
                            <Checkbox className="text-base font-semibold text-gray-700">
                              Meal Included
                            </Checkbox>
                          </Form.Item>
                          <Text className="text-gray-500 text-sm">
                            Check if meal service is included with this fare
                          </Text>
                        </div>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          label={<span className="font-semibold text-gray-700">Other Notes</span>}
                          name="otherNotes"
                        >
                          <Input.TextArea 
                            rows={4} 
                            placeholder="Optional: Add any additional notes about fare terms, targeting specific groups (weddings, students, events), special conditions, or other relevant information..."
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
                    loading={loading}
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