
import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Tabs,
  Button,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Switch,
  Row,
  Col,
  Typography,
  Space,
  message,
  Spin,
  Alert,
  Divider,
  Statistic,
  Progress,
  Avatar,
  List,
  Tooltip,
  Dropdown
} from 'antd';
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  DollarOutlined,
  UserOutlined,
  CalendarOutlined,
  SettingOutlined,
  DownOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FilterOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { apiRequest } from '../../lib/queryClient';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface BidRecord {
  id: number;
  bidId: string;
  route: string;
  passengers: number;
  bidAmount: number;
  status: string;
  validUntil: string;
  createdAt: string;
  notes?: string;
}

interface BidConfiguration {
  id: number;
  route: string;
  minBidAmount: number;
  maxBidAmount: number;
  validityHours: number;
  autoAcceptThreshold?: number;
  isActive: boolean;
  createdAt: string;
}

export default function BidManagement() {
  const [activeTab, setActiveTab] = useState("recent-bids");
  const [reviewBidModalVisible, setReviewBidModalVisible] = useState(false);
  const [createBidModalVisible, setCreateBidModalVisible] = useState(false);
  const [viewBidModalVisible, setViewBidModalVisible] = useState(false);
  const [selectedBidForReview, setSelectedBidForReview] = useState<any>(null);
  const [selectedBid, setSelectedBid] = useState<any>(null);
  const [form] = Form.useForm();
  const [reviewForm] = Form.useForm();
  const queryClient = useQueryClient();

  // Fetch recent bids data
  const { data: recentBidsData, isLoading: bidsLoading } = useQuery({
    queryKey: ["recent-bids"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/bids");
      return response.data || [];
    }
  });

  // Fetch bid configurations
  const { data: configurationsData, isLoading: configsLoading } = useQuery({
    queryKey: ["bid-configurations"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/bid-configurations");
      return response.data || [];
    }
  });

  const handleViewBid = (record: any) => {
    setSelectedBid(record);
    setViewBidModalVisible(true);
  };

  const handleReviewBid = (record: any) => {
    const bidData = (recentBidsData || []).find(bid => 
      `BID${bid.id.toString().padStart(3, "0")}` === record.bidId
    );

    if (bidData) {
      setSelectedBidForReview({
        ...bidData,
        bidId: record.bidId,
        route: record.route,
        passengers: record.passengers,
        bidAmount: record.bidAmount,
        status: record.status,
        validUntil: record.validUntil,
        createdAt: record.createdAt
      });
      setReviewBidModalVisible(true);
    }
  };

  const handleBidAction = async (action: 'accept' | 'reject') => {
    try {
      const bidId = selectedBidForReview.id;
      const newStatus = action === 'accept' ? 'accepted' : 'rejected';

      const response = await apiRequest(
        "PUT",
        `/api/bids/${bidId}/status`,
        { status: newStatus }
      );

      if (response.success) {
        message.success(
          `Bid ${action === 'accept' ? 'accepted' : 'rejected'} successfully`
        );

        // Refresh data
        queryClient.invalidateQueries(["recent-bids"]);
        queryClient.invalidateQueries(["bid-configurations"]);

        // Close modal
        setReviewBidModalVisible(false);
        setSelectedBidForReview(null);
      }
    } catch (error) {
      message.error(`Failed to ${action} bid`);
    }
  };

  const recentBidsColumns = [
    {
      title: 'Bid ID',
      dataIndex: 'bidId',
      key: 'bidId',
      render: (text: string) => (
        <Text strong className="text-blue-600">{text}</Text>
      ),
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
      align: 'center' as const,
    },
    {
      title: 'Bid Amount',
      dataIndex: 'bidAmount',
      key: 'bidAmount',
      render: (amount: number) => `$${amount?.toLocaleString() || 0}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          pending: { color: 'orange', icon: <ClockCircleOutlined /> },
          accepted: { color: 'green', icon: <CheckCircleOutlined /> },
          rejected: { color: 'red', icon: <CloseCircleOutlined /> },
          expired: { color: 'gray', icon: <InfoCircleOutlined /> },
        };
        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
        return (
          <Tag color={config.color} icon={config.icon}>
            {status?.toUpperCase() || 'PENDING'}
          </Tag>
        );
      },
    },
    {
      title: 'Valid Until',
      dataIndex: 'validUntil',
      key: 'validUntil',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewBid(record)}
            />
          </Tooltip>
          {record.status === 'pending' && (
            <Tooltip title="Review Bid">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => handleReviewBid(record)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const bidConfigColumns = [
    {
      title: 'Route',
      dataIndex: 'route',
      key: 'route',
    },
    {
      title: 'Min Bid Amount',
      dataIndex: 'minBidAmount',
      key: 'minBidAmount',
      render: (amount: number) => `$${amount?.toLocaleString() || 0}`,
    },
    {
      title: 'Max Bid Amount',
      dataIndex: 'maxBidAmount',
      key: 'maxBidAmount',
      render: (amount: number) => `$${amount?.toLocaleString() || 0}`,
    },
    {
      title: 'Validity (Hours)',
      dataIndex: 'validityHours',
      key: 'validityHours',
    },
    {
      title: 'Auto Accept',
      dataIndex: 'autoAcceptThreshold',
      key: 'autoAcceptThreshold',
      render: (threshold: number) => threshold ? `$${threshold.toLocaleString()}` : 'Disabled',
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="text" icon={<EditOutlined />} />
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ];

  const renderRecentBids = () => {
    const mockBidsData = [
      {
        key: '1',
        bidId: 'BID001',
        route: 'NYC → LAX',
        passengers: 25,
        bidAmount: 12500,
        status: 'pending',
        validUntil: '2024-01-20T18:00:00Z',
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        key: '2',
        bidId: 'BID002',
        route: 'LAX → MIA',
        passengers: 15,
        bidAmount: 8750,
        status: 'accepted',
        validUntil: '2024-01-19T15:00:00Z',
        createdAt: '2024-01-14T14:20:00Z'
      },
      {
        key: '3',
        bidId: 'BID003',
        route: 'CHI → SEA',
        passengers: 30,
        bidAmount: 15000,
        status: 'rejected',
        validUntil: '2024-01-18T12:00:00Z',
        createdAt: '2024-01-13T09:15:00Z'
      }
    ];

    return (
      <div className="space-y-6">
        <Row gutter={[24, 16]}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Bids"
                value={mockBidsData.length}
                prefix={<DollarOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Pending Review"
                value={mockBidsData.filter(bid => bid.status === 'pending').length}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Accepted"
                value={mockBidsData.filter(bid => bid.status === 'accepted').length}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Value"
                value={mockBidsData.reduce((sum, bid) => sum + bid.bidAmount, 0)}
                precision={0}
                prefix="$"
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        <Card>
          <div className="flex justify-between items-center mb-4">
            <div>
              <Title level={4} className="!mb-1">Recent Bids</Title>
              <Text className="text-gray-600">Review and manage incoming bid requests</Text>
            </div>
            <Space>
              <Button icon={<FilterOutlined />}>Filter</Button>
              <Button icon={<FileExcelOutlined />}>Export</Button>
            </Space>
          </div>

          <Table
            columns={recentBidsColumns}
            dataSource={mockBidsData}
            loading={bidsLoading}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </div>
    );
  };

  const renderBidSetupContent = () => {
    const mockConfigData = [
      {
        key: '1',
        route: 'NYC → LAX',
        minBidAmount: 10000,
        maxBidAmount: 25000,
        validityHours: 48,
        autoAcceptThreshold: 20000,
        isActive: true,
        createdAt: '2024-01-10T10:00:00Z'
      },
      {
        key: '2',
        route: 'LAX → MIA',
        minBidAmount: 8000,
        maxBidAmount: 18000,
        validityHours: 24,
        autoAcceptThreshold: null,
        isActive: true,
        createdAt: '2024-01-09T15:30:00Z'
      }
    ];

    return (
      <div className="space-y-6">
        <Card>
          <div className="flex justify-between items-center mb-6">
            <div>
              <Title level={4} className="!mb-1 text-gray-800 font-bold">
                Create New Bid Configuration
              </Title>
              <Text className="text-gray-600 text-sm">
                Set up a new bidding configuration for your airline route
              </Text>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateBidModalVisible(true)}
            >
              Create Configuration
            </Button>
          </div>

          <Form form={form} layout="vertical">
            <Row gutter={[24, 0]}>
              <Col span={8}>
                <Form.Item label="Route" name="route" required>
                  <Select placeholder="Select route">
                    <Option value="NYC-LAX">NYC → LAX</Option>
                    <Option value="LAX-MIA">LAX → MIA</Option>
                    <Option value="CHI-SEA">CHI → SEA</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Min Bid Amount ($)" name="minBidAmount" required>
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="10000"
                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Max Bid Amount ($)" name="maxBidAmount" required>
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="25000"
                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 0]}>
              <Col span={8}>
                <Form.Item label="Validity Period (Hours)" name="validityHours" required>
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="48"
                    min={1}
                    max={168}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Auto Accept Threshold ($)" name="autoAcceptThreshold">
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="Optional"
                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Active" name="isActive" valuePropName="checked">
                  <Switch defaultChecked />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Space>
                <Button type="primary" size="large">
                  Create Configuration
                </Button>
                <Button size="large">Reset</Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-4">
            <div>
              <Title level={4} className="!mb-1">Active Configurations</Title>
              <Text className="text-gray-600">Manage existing bid configurations</Text>
            </div>
          </div>

          <Table
            columns={bidConfigColumns}
            dataSource={mockConfigData}
            loading={configsLoading}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Title level={2} className="!mb-2 text-gray-900">
            Bid Management
          </Title>
          <Text className="text-gray-600 text-lg">
            Manage bid requests and configure bidding parameters
          </Text>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          size="large"
          className="bg-white rounded-lg"
        >
          <TabPane tab="Recent Bids" key="recent-bids">
            {renderRecentBids()}
          </TabPane>
          <TabPane tab="Bid Setup" key="bid-setup">
            {renderBidSetupContent()}
          </TabPane>
        </Tabs>

        {/* Review Bid Modal */}
        <Modal
          title="Review Bid"
          open={reviewBidModalVisible}
          onCancel={() => setReviewBidModalVisible(false)}
          width={800}
          footer={[
            <Button
              key="cancel"
              onClick={() => setReviewBidModalVisible(false)}
            >
              Cancel
            </Button>,

            <div className="flex space-x-3">
              <Button
                danger
                onClick={() => handleBidAction('reject')}
              >
                Reject Bid
              </Button>
              <Button
                type="primary"
                onClick={() => handleBidAction('accept')}
              >
                Accept Bid
              </Button>
            </div>
          ]}
        >
          {selectedBidForReview && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Title level={4}>Bid Details</Title>
                <Tag color="blue" className="text-sm px-3 py-1">
                  {selectedBidForReview.bidStatus?.toUpperCase() || 'PENDING'}
                </Tag>
              </div>

              <Row gutter={[24, 16]}>
                <Col span={8}>
                  <div>
                    <Text strong className="text-gray-600">Bid ID</Text>
                    <div className="text-lg font-semibold text-gray-900">
                      {selectedBidForReview.bidId}
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div>
                    <Text strong className="text-gray-600">Route</Text>
                    <div className="text-lg font-semibold text-gray-900">
                      {selectedBidForReview.route}
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div>
                    <Text strong className="text-gray-600">Passengers</Text>
                    <div className="text-lg font-semibold text-gray-900">
                      {selectedBidForReview.passengers || selectedBidForReview.passengerCount}
                    </div>
                  </div>
                </Col>
              </Row>

              <Row gutter={[24, 16]}>
                <Col span={8}>
                  <div>
                    <Text strong className="text-gray-600">Bid Amount</Text>
                    <div className="text-lg font-semibold text-green-600">
                      ${selectedBidForReview.bidAmount?.toLocaleString() || '0'}
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div>
                    <Text strong className="text-gray-600">Valid Until</Text>
                    <div className="text-lg font-semibold text-gray-900">
                      {dayjs(selectedBidForReview.validUntil).format('DD/MM/YYYY HH:mm')}
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div>
                    <Text strong className="text-gray-600">Time Remaining</Text>
                    <div className="flex items-center">
                      <ClockCircleOutlined className="text-orange-500 mr-2" />
                      <Text className="text-lg font-semibold">
                        {dayjs(selectedBidForReview.validUntil).fromNow()}
                      </Text>
                    </div>
                  </div>
                </Col>
              </Row>

              {selectedBidForReview.notes && (
                <div>
                  <Text strong className="text-gray-600">Notes</Text>
                  <div className="bg-gray-50 p-3 rounded mt-2">
                    <Text>{selectedBidForReview.notes}</Text>
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>

        {/* View Bid Modal */}
        <Modal
          title="Bid Details"
          open={viewBidModalVisible}
          onCancel={() => setViewBidModalVisible(false)}
          width={600}
          footer={[
            <Button key="close" onClick={() => setViewBidModalVisible(false)}>
              Close
            </Button>,
          ]}
        >
          {selectedBid && (
            <div className="space-y-4">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text strong>Bid ID:</Text> {selectedBid.bidId}
                </Col>
                <Col span={12}>
                  <Text strong>Route:</Text> {selectedBid.route}
                </Col>
                <Col span={12}>
                  <Text strong>Passengers:</Text> {selectedBid.passengers}
                </Col>
                <Col span={12}>
                  <Text strong>Amount:</Text> ${selectedBid.bidAmount?.toLocaleString()}
                </Col>
                <Col span={12}>
                  <Text strong>Status:</Text> 
                  <Tag color="blue" className="ml-2">
                    {selectedBid.status?.toUpperCase()}
                  </Tag>
                </Col>
                <Col span={12}>
                  <Text strong>Valid Until:</Text> {dayjs(selectedBid.validUntil).format('DD/MM/YYYY HH:mm')}
                </Col>
              </Row>
            </div>
          )}
        </Modal>

        {/* Create Bid Configuration Modal */}
        <Modal
          title="Create Bid Configuration"
          open={createBidModalVisible}
          onCancel={() => setCreateBidModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setCreateBidModalVisible(false)}>
              Cancel
            </Button>,
            <Button key="create" type="primary">
              Create Configuration
            </Button>
          ]}
        >
          <Form layout="vertical">
            <Form.Item label="Route" required>
              <Select placeholder="Select route">
                <Option value="NYC-LAX">NYC → LAX</Option>
                <Option value="LAX-MIA">LAX → MIA</Option>
              </Select>
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Min Bid Amount" required>
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="10000"
                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Max Bid Amount" required>
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="25000"
                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    </div>
  );
}
