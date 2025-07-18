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
  Switch
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
  TrendingUpOutlined,
  DollarOutlined,
  AlertOutlined
} from '@ant-design/icons';
import { useLocation } from "wouter";

const { Title, Text } = Typography;

export default function BidManagement() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('1');

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

  const renderDashboardContent = () => (
    <div>
      {/* Stats Cards Row */}
      <Row gutter={[24, 24]} className="mb-6">
        <Col xs={24} sm={12} lg={8}>
          <Card className="h-full">
            <div className="flex items-center justify-between">
              <div>
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
              <div>
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
              <div>
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
              <div>
                <Text className="text-gray-500 text-sm">Acceptance Rate</Text>
                <div className="flex items-center mt-1">
                  <Title level={2} className="!mb-0 !mt-0 text-2xl font-semibold">72%</Title>
                  <TrendingUpOutlined className="text-blue-500 ml-2" />
                </div>
                <Text className="text-green-500 text-xs">+2.1% this month</Text>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card className="h-full">
            <div className="flex items-center justify-between">
              <div>
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
              <div>
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
      children: (
        <Card>
          <Title level={4}>Active Bids Management</Title>
          <Text>Monitor and manage currently active passenger bidding requests.</Text>
        </Card>
      ),
    },
    {
      key: '3',
      label: (
        <span className="flex items-center">
          <SettingOutlined className="mr-2" />
          Bid Setup
        </span>
      ),
      children: (
        <Card>
          <Title level={4}>Bid Configuration</Title>
          <Text>Configure bidding rules, minimum amounts, and acceptance criteria.</Text>
        </Card>
      ),
    },
    {
      key: '4',
      label: (
        <span className="flex items-center">
          <CreditCardOutlined className="mr-2" />
          Payments
        </span>
      ),
      children: (
        <Card>
          <Title level={4}>Bid Payments</Title>
          <Text>Track and manage payments for accepted bids.</Text>
        </Card>
      ),
    },
    {
      key: '5',
      label: (
        <span className="flex items-center">
          <HistoryOutlined className="mr-2" />
          History
        </span>
      ),
      children: (
        <Card>
          <Title level={4}>Bid History</Title>
          <Text>View historical bid data and performance analytics.</Text>
        </Card>
      ),
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
              Welcome to Group Retail Administration Portal
            </Text>
          </div>

          {/* Main Content Area */}
          <div className="bg-white rounded-lg shadow-sm">
            {/* Section Headers */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <Title level={3} className="!mb-1">Bid Management</Title>
                  <Text className="text-gray-500">Manage passenger upgrade bids and bidding configurations</Text>
                </div>
              </div>
            </div>

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

      <style jsx global>{`
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
      `}</style>
    </div>
  );
}