import { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Button, Space, Badge, Tabs, Table, Tag, Input, Select, DatePicker, Spin } from 'antd';
import { SearchOutlined, FilterOutlined, InfoCircleOutlined, CheckCircleOutlined, DollarOutlined, CreditCardOutlined, UndoOutlined } from '@ant-design/icons';
import { useLocation } from 'wouter';
import Header from "@/components/layout/header";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function Bids() {
  const [activeTab, setActiveTab] = useState("management");
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    activeBids: 0,
    acceptedBids: 0,
    totalSavings: 0,
    depositsPaid: 0,
    refundsReceived: 0
  });
  const [bidsData, setBidsData] = useState([]);
  const [paymentHistoryData, setPaymentHistoryData] = useState([]);
  const [searchParams, setSearchParams] = useState({
    bidId: '',
    route: '',
    status: '',
    dateFrom: null,
    dateTo: null,
    minAmount: '',
    maxAmount: ''
  });
  const [filteredBidsData, setFilteredBidsData] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch bid statistics
        const statsResponse = await fetch('/api/bids/statistics');
        const stats = await statsResponse.json();
        setStatistics(stats);

        // Fetch bids data
        const bidsResponse = await fetch('/api/bids');
        const bids = await bidsResponse.json();
        
        // Transform bids data to match table format
        const transformedBids = bids.map((bid: any) => {
          // Parse configuration data from notes to get flight information
          let configData = {};
          try {
            configData = bid.notes ? JSON.parse(bid.notes) : {};
          } catch (e) {
            console.error("Error parsing bid notes:", e);
            configData = {};
          }

          // Get origin and destination from bid configuration data
          const origin = configData.origin || bid.flight?.origin || "Unknown";
          const destination = configData.destination || bid.flight?.destination || "Unknown";
          const flightRoute = `${origin} → ${destination}`;

          // Helper function to format date as DD MMM YYYY
          const formatDateToDDMMMYYYY = (date) => {
            const d = new Date(date);
            const day = String(d.getDate()).padStart(2, '0');
            const month = d.toLocaleString('en-US', { month: 'short' });
            const year = d.getFullYear();
            return `${day} ${month} ${year}`;
          };

          // Get travel date from configuration or flight data
          const travelDate = configData.travelDate 
            ? formatDateToDDMMMYYYY(configData.travelDate)
            : bid.flight?.departureTime
            ? formatDateToDDMMMYYYY(bid.flight.departureTime)
            : bid.createdAt
            ? formatDateToDDMMMYYYY(bid.createdAt)
            : "N/A";

          return {
            bidId: `BID-${bid.id}`,
            route: flightRoute,
            passengers: bid.passengerCount,
            travelDate: travelDate,
            bidAmount: `$${bid.bidAmount}`,
            deposit: `$${(parseFloat(bid.bidAmount.toString()) * bid.passengerCount * 0.1).toFixed(2)}`,
            status: bid.bidStatus === 'active' ? 'Pending' : 
                    bid.bidStatus === 'accepted' ? 'Accepted' :
                    bid.bidStatus === 'rejected' ? 'Declined' :
                    bid.bidStatus === 'expired' ? 'Expired' : 'Under Review',
            payment: bid.bidStatus === 'accepted' ? 'Converted to Booking' :
                     bid.bidStatus === 'rejected' || bid.bidStatus === 'expired' ? 'Refunded' : 'Paid',
            submitted: formatDateToDDMMMYYYY(bid.createdAt),
            actions: 'View Details'
          };
        });
        
        setBidsData(transformedBids);
        setFilteredBidsData(transformedBids);

        // For now, use empty payment history until we have actual payment data
        setPaymentHistoryData([]);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-apply filters when search parameters change
  useEffect(() => {
    handleSearch();
  }, [searchParams, bidsData]);

  const handleSearch = () => {
    let filtered = [...bidsData];

    // Filter by bid ID
    if (searchParams.bidId.trim()) {
      filtered = filtered.filter(bid => 
        bid.bidId.toLowerCase().includes(searchParams.bidId.toLowerCase())
      );
    }

    // Filter by route
    if (searchParams.route.trim()) {
      filtered = filtered.filter(bid => 
        bid.route.toLowerCase().includes(searchParams.route.toLowerCase())
      );
    }

    // Filter by status
    if (searchParams.status && searchParams.status !== 'all' && searchParams.status !== '') {
      filtered = filtered.filter(bid => 
        bid.status.toLowerCase() === searchParams.status.toLowerCase()
      );
    }

    // Filter by date range - convert DD MMM YYYY format back to Date for comparison
    if (searchParams.dateFrom) {
      filtered = filtered.filter(bid => {
        // Parse DD MMM YYYY format back to Date object
        const bidDate = new Date(bid.submitted);
        const fromDate = new Date(searchParams.dateFrom);
        return bidDate >= fromDate;
      });
    }

    if (searchParams.dateTo) {
      filtered = filtered.filter(bid => {
        // Parse DD MMM YYYY format back to Date object
        const bidDate = new Date(bid.submitted);
        const toDate = new Date(searchParams.dateTo);
        return bidDate <= toDate;
      });
    }

    // Filter by amount range
    if (searchParams.minAmount.trim()) {
      const minAmount = parseFloat(searchParams.minAmount);
      if (!isNaN(minAmount)) {
        filtered = filtered.filter(bid => {
          const bidAmount = parseFloat(bid.bidAmount.replace('$', '').replace(/,/g, ''));
          return bidAmount >= minAmount;
        });
      }
    }

    if (searchParams.maxAmount.trim()) {
      const maxAmount = parseFloat(searchParams.maxAmount);
      if (!isNaN(maxAmount)) {
        filtered = filtered.filter(bid => {
          const bidAmount = parseFloat(bid.bidAmount.replace('$', '').replace(/,/g, ''));
          return bidAmount <= maxAmount;
        });
      }
    }

    setFilteredBidsData(filtered);
  };

  const handleResetFilters = () => {
    setSearchParams({
      bidId: '',
      route: '',
      status: '',
      dateFrom: null,
      dateTo: null,
      minAmount: '',
      maxAmount: ''
    });
    setFilteredBidsData(bidsData);
  };

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
      sorter: (a: any, b: any) => {
        const aNum = parseInt(a.bidId.replace('BID-', ''));
        const bNum = parseInt(b.bidId.replace('BID-', ''));
        return aNum - bNum;
      },
      sortDirections: ['descend', 'ascend'],
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
          onClick={() => setLocation(`/bid-details/${record.bidId.replace('BID-', '')}`)}
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
              {loading ? (
                <Spin size="small" />
              ) : (
                <Title level={2} className="!mb-0 text-blue-600">{statistics.activeBids}</Title>
              )}
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6} lg={4}>
            <Card className="text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircleOutlined className="text-green-500 text-lg mr-2" />
                <Text className="text-gray-600 text-sm">Accepted Bids</Text>
              </div>
              {loading ? (
                <Spin size="small" />
              ) : (
                <Title level={2} className="!mb-0 text-green-600">{statistics.acceptedBids}</Title>
              )}
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6} lg={4}>
            <Card className="text-center">
              <div className="flex items-center justify-center mb-2">
                <DollarOutlined className="text-orange-500 text-lg mr-2" />
                <Text className="text-gray-600 text-sm">Total Savings</Text>
              </div>
              {loading ? (
                <Spin size="small" />
              ) : (
                <Title level={2} className="!mb-0 text-orange-600">${statistics.totalSavings}</Title>
              )}
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6} lg={4}>
            <Card className="text-center">
              <div className="flex items-center justify-center mb-2">
                <CreditCardOutlined className="text-purple-500 text-lg mr-2" />
                <Text className="text-gray-600 text-sm">Deposits Paid</Text>
              </div>
              {loading ? (
                <Spin size="small" />
              ) : (
                <Title level={2} className="!mb-0 text-purple-600">${statistics.depositsPaid.toFixed(2)}</Title>
              )}
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6} lg={4}>
            <Card className="text-center">
              <div className="flex items-center justify-center mb-2">
                <UndoOutlined className="text-orange-500 text-lg mr-2" />
                <Text className="text-gray-600 text-sm">Refunds Received</Text>
              </div>
              {loading ? (
                <Spin size="small" />
              ) : (
                <Title level={2} className="!mb-0 text-orange-600">${statistics.refundsReceived.toFixed(2)}</Title>
              )}
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
                  <Input 
                    placeholder="BID-2024-001" 
                    value={searchParams.bidId}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, bidId: e.target.value }))}
                  />
                </Col>
                <Col xs={24} md={6}>
                  <Text className="text-gray-600 text-sm block mb-1">Route</Text>
                  <Input
                    placeholder="New York → London"
                    value={searchParams.route}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, route: e.target.value }))}
                  />
                </Col>
                <Col xs={24} md={6}>
                  <Text className="text-gray-600 text-sm block mb-1">Status</Text>
                  <Select
                    placeholder="All Status"
                    style={{ width: '100%' }}
                    value={searchParams.status || undefined}
                    onChange={(value) => setSearchParams(prev => ({ ...prev, status: value }))}
                    options={[
                      { value: 'all', label: 'All Status' },
                      { value: 'pending', label: 'Pending' },
                      { value: 'accepted', label: 'Accepted' },
                      { value: 'declined', label: 'Declined' },
                      { value: 'expired', label: 'Expired' },
                      { value: 'under review', label: 'Under Review' },
                    ]}
                  />
                </Col>
                <Col xs={24} md={6}>
                  <Text className="text-gray-600 text-sm block mb-1">Date From</Text>
                  <DatePicker 
                    style={{ width: '100%' }} 
                    placeholder="DD MMM YYYY" 
                    format="DD MMM YYYY"
                    value={searchParams.dateFrom}
                    onChange={(date) => setSearchParams(prev => ({ ...prev, dateFrom: date }))}
                  />
                </Col>
              </Row>

              <Row gutter={[16, 16]} className="mt-4">
                <Col xs={24} md={6}>
                  <Text className="text-gray-600 text-sm block mb-1">Date To</Text>
                  <DatePicker 
                    style={{ width: '100%' }} 
                    placeholder="DD MMM YYYY"
                    format="DD MMM YYYY"
                    value={searchParams.dateTo}
                    onChange={(date) => setSearchParams(prev => ({ ...prev, dateTo: date }))}
                  />
                </Col>
                <Col xs={24} md={6}>
                  <Text className="text-gray-600 text-sm block mb-1">Min Amount ($)</Text>
                  <Input 
                    placeholder="500" 
                    value={searchParams.minAmount}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, minAmount: e.target.value }))}
                    type="number"
                  />
                </Col>
                <Col xs={24} md={6}>
                  <Text className="text-gray-600 text-sm block mb-1">Max Amount ($)</Text>
                  <Input 
                    placeholder="2000" 
                    value={searchParams.maxAmount}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, maxAmount: e.target.value }))}
                    type="number"
                  />
                </Col>
                <Col xs={24} md={6} className="flex items-end">
                  <Button 
                    type="link" 
                    className="text-blue-600"
                    onClick={handleResetFilters}
                  >
                    Reset Filters
                  </Button>
                </Col>
              </Row>
            </Card>

            {/* All Bids Table */}
            <Card>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <Title level={4} className="!mb-1">All Bids ({filteredBidsData.length})</Title>
                  <Text className="text-gray-600">Manage and track all your group bidding requests</Text>
                </div>
              </div>

              <Table
                columns={bidsColumns}
                dataSource={filteredBidsData}
                rowKey="bidId"
                pagination={{ pageSize: 10 }}
                loading={loading}
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
                loading={loading}
              />
            </Card>

            {/* Payment Summary Cards */}
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Card className="bg-green-50 border-green-200">
                  <Text className="text-green-600 text-sm block mb-1">Total Deposits</Text>
                  <Title level={3} className="!mb-0 text-green-600">$7,165.00</Title>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card className="bg-purple-50 border-purple-200">
                  <Text className="text-purple-600 text-sm block mb-1">Total Refunds</Text>
                  <Title level={3} className="!mb-0 text-purple-600">$5,438.00</Title>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card className="bg-blue-50 border-blue-200">
                  <Text className="text-blue-600 text-sm block mb-1">Net Amount</Text>
                  <Title level={3} className="!mb-0 text-blue-600">$1,727.00</Title>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card className="bg-orange-50 border-orange-200">
                  <Text className="text-orange-600 text-sm block mb-1">Pending Payments</Text>
                  <Title level={3} className="!mb-0 text-orange-600">$1,840.00</Title>
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