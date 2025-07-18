
import React, { useState } from 'react';
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
  MenuProps
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
  HomeOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export default function BidManagement() {
  const [activeTab, setActiveTab] = useState('dashboard');

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
    },
  ];

  const tabItems = [
    {
      key: 'dashboard',
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

  const recentActivities = [
    {
      type: 'new',
      color: '#ff4d4f',
      title: 'New bid received: Economy to Business ($280)',
      time: '30 minutes ago'
    },
    {
      type: 'counter',
      color: '#1890ff',
      title: 'Bid BID001 - Counter offer sent ($280)',
      time: '2 hours ago'
    },
    {
      type: 'accepted',
      color: '#52c41a',
      title: 'Bid BID002 - Auto-accepted ($120)',
      time: '4 hours ago'
    },
    {
      type: 'rejected',
      color: '#ff4d4f',
      title: 'Bid BID005 - Rejected (below minimum)',
      time: '8 hours ago'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">GR</span>
                </div>
                <div>
                  <Text className="text-xs text-gray-500 block">GROUP RETAIL</Text>
                  <Text className="text-xs text-gray-500 block">ADMIN</Text>
                  <Text className="text-xs text-gray-500">PORTAL</Text>
                </div>
              </div>
              <Title level={4} className="!mb-0 !ml-8">
                Bid Management
              </Title>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge count={1} size="small">
                <BellOutlined className="text-xl text-gray-600" />
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
          
          <Text className="text-gray-600 text-sm">
            Welcome to Group Retail Administration Portal
          </Text>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <Breadcrumb.Item>
            <HomeOutlined />
            <span className="ml-1">Home</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Bid Management</Breadcrumb.Item>
        </Breadcrumb>

        {/* Page Title */}
        <div className="mb-6">
          <Title level={2} className="!mb-2">
            Bid Management
          </Title>
          <Text className="text-gray-600">
            Manage passenger upgrade bids and bidding configurations
          </Text>
        </div>

        {/* Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          className="mb-6"
        />

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Overview and Insights Row */}
            <Row gutter={[24, 24]}>
              <Col span={12}>
                <Title level={4} className="!mb-4">Overview</Title>
              </Col>
              <Col span={12}>
                <Title level={4} className="!mb-4">Insights</Title>
              </Col>
            </Row>

            {/* Statistics Cards */}
            <Row gutter={[24, 24]}>
              {/* Active Bids */}
              <Col xs={24} sm={12} lg={8}>
                <Card className="h-full">
                  <div className="flex items-center justify-between mb-2">
                    <Text className="text-gray-600">Active Bids</Text>
                    <ClockCircleOutlined className="text-blue-500" />
                  </div>
                  <div className="mb-1">
                    <span className="text-2xl font-bold">3</span>
                  </div>
                  <Text className="text-gray-500 text-sm">Awaiting response</Text>
                </Card>
              </Col>

              {/* Bid Types */}
              <Col xs={24} sm={12} lg={8}>
                <Card className="h-full">
                  <div className="flex items-center justify-between mb-2">
                    <Text className="text-gray-600">Bid Types</Text>
                    <SettingOutlined className="text-blue-500" />
                  </div>
                  <div className="mb-1">
                    <span className="text-2xl font-bold">1</span>
                  </div>
                  <Text className="text-gray-500 text-sm">Active configurations</Text>
                </Card>
              </Col>

              {/* Monthly Revenue */}
              <Col xs={24} sm={12} lg={8}>
                <Card className="h-full">
                  <div className="flex items-center justify-between mb-2">
                    <Text className="text-gray-600">Monthly Revenue</Text>
                    <RiseOutlined className="text-green-500" />
                  </div>
                  <div className="mb-1">
                    <span className="text-2xl font-bold">$47,250</span>
                  </div>
                  <div className="flex items-center">
                    <ArrowUpOutlined className="text-green-500 text-xs mr-1" />
                    <Text className="text-green-500 text-sm">15.3% this month</Text>
                  </div>
                </Card>
              </Col>

              {/* Acceptance Rate */}
              <Col xs={24} sm={12} lg={8}>
                <Card className="h-full">
                  <div className="flex items-center justify-between mb-2">
                    <Text className="text-gray-600">Acceptance Rate</Text>
                    <BarChartOutlined className="text-blue-500" />
                  </div>
                  <div className="mb-1">
                    <span className="text-2xl font-bold">72%</span>
                  </div>
                  <div className="flex items-center">
                    <ArrowUpOutlined className="text-green-500 text-xs mr-1" />
                    <Text className="text-green-500 text-sm">2.1% this month</Text>
                  </div>
                </Card>
              </Col>

              {/* Average Bid Value */}
              <Col xs={24} sm={12} lg={8}>
                <Card className="h-full">
                  <div className="flex items-center justify-between mb-2">
                    <Text className="text-gray-600">Avg Bid Value</Text>
                    <BarChartOutlined className="text-blue-500" />
                  </div>
                  <div className="mb-1">
                    <span className="text-2xl font-bold">$185</span>
                  </div>
                  <div className="flex items-center">
                    <ArrowUpOutlined className="text-green-500 text-xs mr-1" />
                    <Text className="text-green-500 text-sm">5.7% this month</Text>
                  </div>
                </Card>
              </Col>

              {/* Pending Review */}
              <Col xs={24} sm={12} lg={8}>
                <Card className="h-full">
                  <div className="flex items-center justify-between mb-2">
                    <Text className="text-gray-600">Pending Review</Text>
                    <ExclamationCircleOutlined className="text-orange-500" />
                  </div>
                  <div className="mb-1">
                    <span className="text-2xl font-bold text-red-500">1</span>
                  </div>
                  <Text className="text-gray-500 text-sm">Require attention</Text>
                </Card>
              </Col>
            </Row>

            {/* Quick Actions */}
            <Card>
              <Title level={4} className="!mb-2">Quick Actions</Title>
              <Text className="text-gray-600 mb-4 block">
                Frequently used bid management tasks
              </Text>
              
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                  <Button 
                    type="primary" 
                    size="large" 
                    icon={<PlusOutlined />}
                    className="w-full h-12"
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

            {/* Recent Bid Activity */}
            <Card>
              <Title level={4} className="!mb-2">Recent Bid Activity</Title>
              <Text className="text-gray-600 mb-4 block">
                Latest bid submissions and responses
              </Text>
              
              <Timeline>
                {recentActivities.map((activity, index) => (
                  <Timeline.Item
                    key={index}
                    dot={<div className="w-2 h-2 rounded-full" style={{ backgroundColor: activity.color }} />}
                  >
                    <div className="flex justify-between items-start">
                      <Text className="text-gray-900">{activity.title}</Text>
                      <Text className="text-gray-500 text-sm">{activity.time}</Text>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>
          </div>
        )}

        {/* Other tab contents would go here */}
        {activeTab !== 'dashboard' && (
          <Card>
            <div className="text-center py-12">
              <Title level={4} className="text-gray-500">
                {tabItems.find(item => item.key === activeTab)?.label} Content
              </Title>
              <Text className="text-gray-400">
                This section is under development
              </Text>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
