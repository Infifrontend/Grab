
import { useState } from "react";
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Button, 
  Space,
  Tabs,
  Divider,
  Progress
} from "antd";
import { 
  DashboardOutlined,
  SettingOutlined,
  CreditCardOutlined,
  HistoryOutlined,
  PlusOutlined,
  EyeOutlined,
  BarChartOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function BidManagement() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabItems = [
    {
      key: 'overview',
      label: (
        <span>
          <DashboardOutlined />
          Dashboard
        </span>
      ),
    },
    {
      key: 'active-bids',
      label: (
        <span>
          <ClockCircleOutlined />
          Active Bids
        </span>
      ),
    },
    {
      key: 'bid-setup',
      label: (
        <span>
          <SettingOutlined />
          Bid Setup
        </span>
      ),
    },
    {
      key: 'payments',
      label: (
        <span>
          <CreditCardOutlined />
          Payments
        </span>
      ),
    },
    {
      key: 'history',
      label: (
        <span>
          <HistoryOutlined />
          History
        </span>
      ),
    },
  ];

  const metricsData = [
    {
      title: 'Active Bids',
      value: '3',
      description: 'Awaiting response',
      icon: <InfoCircleOutlined className="text-blue-500" />,
      trend: null
    },
    {
      title: 'Bid Types',
      value: '1',
      description: 'Active configurations',
      icon: <SettingOutlined className="text-blue-500" />,
      trend: null
    },
    {
      title: 'Monthly Revenue',
      value: '$47,250',
      description: '+13.3% this month',
      icon: <span className="text-green-500">$</span>,
      trend: 'positive'
    },
    {
      title: 'Acceptance Rate',
      value: '72%',
      description: '+2.1% this month',
      icon: <span className="text-blue-500">📈</span>,
      trend: 'positive'
    },
    {
      title: 'Avg Bid Value',
      value: '$185',
      description: '+3.7% this month',
      icon: <span className="text-blue-500">💰</span>,
      trend: 'positive'
    },
    {
      title: 'Pending Review',
      value: '1',
      description: 'Require attention',
      icon: <WarningOutlined className="text-orange-500" />,
      trend: null
    }
  ];

  const recentActivities = [
    {
      title: 'New bid received: Economy to Business ($280)',
      time: '30 minutes ago',
      type: 'new',
      icon: <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
    },
    {
      title: 'Bid BID001 - Counter offer sent ($280)',
      time: '2 hours ago',
      type: 'counter',
      icon: <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
    },
    {
      title: 'Bid BID002 - Auto-accepted ($120)',
      time: '4 hours ago',
      type: 'accepted',
      icon: <span className="w-2 h-2 bg-green-500 rounded-full"></span>
    },
    {
      title: 'Bid BID005 - Rejected (below minimum)',
      time: '6 hours ago',
      type: 'rejected',
      icon: <span className="w-2 h-2 bg-red-500 rounded-full"></span>
    }
  ];

  const renderOverviewContent = () => (
    <div className="space-y-6">
      {/* Sub-navigation */}
      <div className="flex space-x-8 border-b border-gray-200 pb-3">
        <div className="cursor-pointer border-b-2 border-blue-600 pb-3">
          <Text className="font-medium text-blue-600">Overview</Text>
        </div>
        <div className="cursor-pointer pb-3">
          <Text className="font-medium text-gray-500">Insights</Text>
        </div>
      </div>

      {/* Metrics Cards */}
      <Row gutter={[16, 16]}>
        {metricsData.map((metric, index) => (
          <Col xs={24} sm={12} lg={8} key={index}>
            <Card className="h-full">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Text className="text-gray-600 text-sm">{metric.title}</Text>
                  {metric.icon}
                </div>
                <div>
                  <Title level={2} className="!mb-1 text-gray-900">{metric.value}</Title>
                  <Text className={`text-sm ${
                    metric.trend === 'positive' ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {metric.description}
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Quick Actions */}
      <Card>
        <div className="mb-4">
          <Title level={4} className="!mb-1 text-gray-900">Quick Actions</Title>
          <Text className="text-gray-600">Frequently used bid management tasks</Text>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Button 
              type="primary" 
              size="large" 
              block 
              className="h-16 bg-gray-900 border-gray-900 hover:bg-gray-800"
              icon={<PlusOutlined />}
            >
              <div className="text-left">
                <div className="font-medium">Create New Bid</div>
              </div>
            </Button>
          </Col>
          <Col xs={24} md={8}>
            <Button 
              size="large" 
              block 
              className="h-16 border-gray-300"
              icon={<EyeOutlined />}
            >
              <div className="text-left">
                <div className="font-medium text-gray-700">Review Pending Bids</div>
              </div>
            </Button>
          </Col>
          <Col xs={24} md={8}>
            <Button 
              size="large" 
              block 
              className="h-16 border-gray-300"
              icon={<BarChartOutlined />}
            >
              <div className="text-left">
                <div className="font-medium text-gray-700">Generate Report</div>
              </div>
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Recent Bid Activity */}
      <Card>
        <div className="mb-4">
          <Title level={4} className="!mb-1 text-gray-900">Recent Bid Activity</Title>
          <Text className="text-gray-600">Latest bid submissions and responses</Text>
        </div>

        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 py-3">
              <div className="mt-2">
                {activity.icon}
              </div>
              <div className="flex-1">
                <Text className="text-gray-900 font-medium block">{activity.title}</Text>
              </div>
              <div>
                <Text className="text-gray-500 text-sm">{activity.time}</Text>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-8">
        <Title level={2} className="!mb-2 text-gray-900">Bid Management</Title>
        <Text className="text-gray-600">Manage passenger upgrade bids and bidding configurations</Text>
      </div>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        className="mb-6"
        size="large"
      />

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverviewContent()}
      
      {activeTab === 'active-bids' && (
        <Card>
          <Title level={4} className="!mb-4">Active Bids</Title>
          <Text className="text-gray-600">Manage currently active bidding requests</Text>
        </Card>
      )}
      
      {activeTab === 'bid-setup' && (
        <Card>
          <Title level={4} className="!mb-4">Bid Setup</Title>
          <Text className="text-gray-600">Configure bidding rules and parameters</Text>
        </Card>
      )}
      
      {activeTab === 'payments' && (
        <Card>
          <Title level={4} className="!mb-4">Payments</Title>
          <Text className="text-gray-600">Manage bid-related payments and transactions</Text>
        </Card>
      )}
      
      {activeTab === 'history' && (
        <Card>
          <Title level={4} className="!mb-4">History</Title>
          <Text className="text-gray-600">View historical bid data and analytics</Text>
        </Card>
      )}

      <style jsx global>{`
        .ant-card {
          border-radius: 8px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .ant-tabs .ant-tabs-tab {
          padding: 12px 16px;
          margin-right: 24px;
        }

        .ant-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #1f2937;
          font-weight: 500;
        }

        .ant-tabs .ant-tabs-ink-bar {
          background: #3b82f6;
        }
      `}</style>
    </div>
  );
}
