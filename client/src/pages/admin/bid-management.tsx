import { useState } from "react";
import {
  Card,
  Table,
  Button,
  Input,
  Space,
  Tag,
  Avatar,
  Typography,
  Tabs,
  Badge,
  Dropdown,
  Modal,
  Form,
  InputNumber,
  DatePicker,
  Select,
  Row,
  Col,
  Statistic,
  Progress,
  Timeline,
  Divider,
  List,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  DownloadOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  DollarOutlined,
  UserOutlined,
  RiseOutlined,
  FallOutlined,
  BellOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;
const { Option } = Select;

interface BidData {
  key: string;
  id: string;
  groupName: string;
  route: string;
  passengers: number;
  departureDate: string;
  currentBid: number;
  status: string;
  timeRemaining: string;
  leader: {
    name: string;
    avatar?: string;
  };
  bidsCount: number;
  savings: number;
}

const mockBidData: BidData[] = [
  {
    key: "1",
    id: "BID-2024-001",
    groupName: "Corporate Travel Group",
    route: "NYC → LAX",
    passengers: 25,
    departureDate: "2024-02-15",
    currentBid: 4250,
    status: "active",
    timeRemaining: "2d 14h",
    leader: { name: "John Smith" },
    bidsCount: 12,
    savings: 850,
  },
  {
    key: "2",
    id: "BID-2024-002",
    groupName: "Family Reunion",
    route: "CHI → MIA",
    passengers: 18,
    departureDate: "2024-02-20",
    currentBid: 3200,
    status: "active",
    timeRemaining: "5d 8h",
    leader: { name: "Sarah Johnson" },
    bidsCount: 8,
    savings: 600,
  },
  {
    key: "3",
    id: "BID-2024-003",
    groupName: "Conference Attendees",
    route: "SEA → BOS",
    passengers: 35,
    departureDate: "2024-02-12",
    currentBid: 5800,
    status: "closed",
    timeRemaining: "Ended",
    leader: { name: "Mike Davis" },
    bidsCount: 15,
    savings: 1200,
  },
];

export default function BidManagement() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBid, setSelectedBid] = useState<BidData | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "green";
      case "pending":
        return "orange";
      case "closed":
        return "red";
      default:
        return "default";
    }
  };

  const columns: ColumnsType<BidData> = [
    {
      title: "Bid ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <Text className="font-mono text-blue-600">{text}</Text>,
    },
    {
      title: "Group Details",
      key: "group",
      render: (_, record) => (
        <div>
          <Text strong className="block">
            {record.groupName}
          </Text>
          <Text className="text-gray-500 text-sm">
            {record.passengers} passengers • {record.route}
          </Text>
        </div>
      ),
    },
    {
      title: "Current Bid",
      dataIndex: "currentBid",
      key: "currentBid",
      render: (amount, record) => (
        <div>
          <Text strong className="text-lg">
            ${amount.toLocaleString()}
          </Text>
          <div className="flex items-center gap-1 mt-1">
            <RiseOutlined className="text-green-500 text-xs" />
            <Text className="text-green-600 text-sm">
              ${record.savings} saved
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <div>
          <Tag color={getStatusColor(status)} className="mb-1">
            {status.toUpperCase()}
          </Tag>
          <Text className="text-gray-500 text-sm block">
            {record.timeRemaining}
          </Text>
        </div>
      ),
    },
    {
      title: "Bids Received",
      dataIndex: "bidsCount",
      key: "bidsCount",
      render: (count) => (
        <Badge count={count} showZero color="blue" className="font-semibold" />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedBid(record);
              setIsModalVisible(true);
            }}
          />
          <Button type="text" icon={<EditOutlined />} />
          <Button type="text" icon={<DeleteOutlined />} danger />
        </Space>
      ),
    },
  ];

  const tabItems = [
    {
      key: "overview",
      label: "📊 Overview",
      children: (
        <div className="space-y-6">
          {/* Stats Cards */}
          <Row gutter={16}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Active Bids"
                  value={145}
                  prefix={<RiseOutlined />}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Savings"
                  value={284500}
                  prefix="$"
                  valueStyle={{ color: "#cf1322" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Success Rate"
                  value={87.5}
                  suffix="%"
                  valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Avg. Bid Time"
                  value={4.2}
                  suffix="days"
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
          </Row>

          {/* Main Table */}
          <Card
            title="Active Bids"
            extra={
              <Space>
                <Input.Search
                  placeholder="Search bids..."
                  style={{ width: 200 }}
                  allowClear
                />
                <Button icon={<FilterOutlined />}>Filter</Button>
                <Button icon={<DownloadOutlined />}>Export</Button>
                <Button type="primary" icon={<PlusOutlined />}>
                  Create Bid
                </Button>
              </Space>
            }
          >
            <Table
              columns={columns}
              dataSource={mockBidData}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `Total ${total} bids`,
              }}
            />
          </Card>
        </div>
      ),
    },
    {
      key: "analytics",
      label: "📈 Analytics",
      children: (
        <Row gutter={16}>
          <Col span={12}>
            <Card title="Bid Performance">
              <Progress percent={75} status="active" />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Savings Trend">
              <Progress percent={82} strokeColor="#52c41a" />
            </Card>
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} className="!mb-1 text-gray-900">
            Bid Management
          </Title>
          <Text className="text-gray-600">
            Manage group travel bids and monitor performance
          </Text>
        </div>
        <Space>
          <Button icon={<BellOutlined />}>Notifications</Button>
          <Button type="primary" icon={<PlusOutlined />}>
            New Bid
          </Button>
        </Space>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

      {/* Bid Details Modal */}
      <Modal
        title="Bid Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedBid && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text className="text-gray-500">Bid ID:</Text>
                <Text strong className="block">
                  {selectedBid.id}
                </Text>
              </div>
              <div>
                <Text className="text-gray-500">Group Name:</Text>
                <Text strong className="block">
                  {selectedBid.groupName}
                </Text>
              </div>
              <div>
                <Text className="text-gray-500">Route:</Text>
                <Text strong className="block">
                  {selectedBid.route}
                </Text>
              </div>
              <div>
                <Text className="text-gray-500">Passengers:</Text>
                <Text strong className="block">
                  {selectedBid.passengers}
                </Text>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}