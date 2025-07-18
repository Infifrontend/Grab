
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
import { useLocation } from "wouter";

const { Title, Text } = Typography;

export default function BidManagement() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

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

  const renderDashboardContent = () => (
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
  );

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

          {/* Navigation Tabs */}
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            className="mb-6"
            items={tabItems}
          />

          {/* Tab Content */}
          {activeTab === 'dashboard' && renderDashboardContent()}
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

      <style jsx global>{`
        .ant-tabs-nav-list {
          display: flex;
          width: 100%;
        }

        .ant-tabs-tab {
          padding: 12px 20px;
          font-weight: 500;
          flex: 1;
          display: flex;
          justify-content: center;
          text-align: center;
        }

        .ant-tabs-tab .ant-tabs-tab-btn {
          width: 100%;
          text-align: center;
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

        .ant-progress-bg {
          border-radius: 4px;
        }

        .ant-progress-inner {
          border-radius: 4px;
          background-color: #f1f5f9;
        }
      `}</style>
    </div>
  );
}
