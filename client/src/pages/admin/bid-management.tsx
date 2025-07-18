
import React, { useState, useEffect } from 'react';
import {
  Card,
  Tabs,
  Row,
  Col,
  Button,
  Typography,
  Space,
  Badge,
  Timeline,
  Breadcrumb,
  Avatar,
  Dropdown,
  MenuProps,
  Input,
  Layout,
  Drawer,
  Grid
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
  MenuOutlined,
  LogoutOutlined,
  NotificationOutlined
} from '@ant-design/icons';
import { useLocation } from "wouter";

const { Title, Text } = Typography;
const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

export default function BidManagement() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
  const screens = useBreakpoint();

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
      label: 'Profile Settings',
      icon: <UserOutlined />,
    },
    {
      key: 'preferences',
      label: 'Preferences',
      icon: <SettingOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Sign Out',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  const tabItems = [
    {
      key: 'dashboard',
      label: (
        <span className="flex items-center gap-2">
          <DashboardOutlined />
          Dashboard
        </span>
      ),
    },
    {
      key: 'active-bids',
      label: (
        <span className="flex items-center gap-2">
          <ClockCircleOutlined />
          Active Bids
        </span>
      ),
    },
    {
      key: 'bid-setup',
      label: (
        <span className="flex items-center gap-2">
          <SettingOutlined />
          Bid Setup
        </span>
      ),
    },
    {
      key: 'payments',
      label: (
        <span className="flex items-center gap-2">
          <CreditCardOutlined />
          Payments
        </span>
      ),
    },
    {
      key: 'history',
      label: (
        <span className="flex items-center gap-2">
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

  const sidebarItems = [
    {
      key: 'dashboard',
      icon: '📊',
      label: 'Dashboard',
      path: '/admin/dashboard'
    },
    {
      key: 'offers',
      icon: '🎯',
      label: 'Offers Management',
      path: '/admin/offer-management'
    },
    {
      key: 'bids',
      icon: '📋',
      label: 'Bid Management',
      path: '/admin/bid-management',
      active: true
    },
    {
      key: 'bookings',
      icon: '📅',
      label: 'Bookings Management',
      path: '/admin/bookings'
    },
    {
      key: 'cms',
      icon: '⚙️',
      label: 'CMS Management',
      path: '/admin/cms'
    },
    {
      key: 'reports',
      icon: '📈',
      label: 'Reports & Analytics',
      path: '/admin/reports'
    },
    {
      key: 'settings',
      icon: '🔧',
      label: 'System Settings',
      path: '/admin/admin-settings'
    }
  ];

  const renderSidebarContent = () => (
    <div className="h-full flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">GR</span>
          </div>
          {!sidebarCollapsed && (
            <div>
              <Text className="text-white font-semibold text-base block leading-tight">GROUP RETAIL</Text>
              <Text className="text-slate-300 text-xs">ADMIN PORTAL</Text>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 overflow-y-auto">
        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <div
              key={item.key}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group ${
                item.active
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
              onClick={() => item.path && setLocation(item.path)}
            >
              <div className={`w-5 h-5 flex items-center justify-center ${
                item.active ? 'text-white' : 'text-current'
              }`}>
                <span className="text-sm">{item.icon}</span>
              </div>
              {!sidebarCollapsed && (
                <Text className={`font-medium ${
                  item.active ? 'text-white' : 'text-current'
                }`}>
                  {item.label}
                </Text>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* User Info */}
      {!sidebarCollapsed && (
        <div className="p-4 border-t border-slate-700/50">
          <div className="flex items-center space-x-3 mb-3">
            <Avatar size={32} className="bg-gradient-to-r from-blue-500 to-purple-600">
              JD
            </Avatar>
            <div className="flex-1">
              <Text className="text-white font-medium text-sm block">John Doe</Text>
              <Text className="text-slate-300 text-xs">System Admin</Text>
            </div>
          </div>
          <Button 
            type="text" 
            onClick={handleLogout}
            className="w-full text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 rounded-lg"
            size="small"
            icon={<LogoutOutlined />}
          >
            Sign Out
          </Button>
        </div>
      )}
    </div>
  );

  const renderDashboardContent = () => (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Title level={3} className="!mb-2 text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">📋</span>
              </div>
              Dashboard Overview
            </Title>
            <Text className="text-gray-600">Monitor bid performance and manage configurations</Text>
          </div>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} className="shadow-lg">
              Create New Bid
            </Button>
            <Button icon={<BarChartOutlined />}>
              Generate Report
            </Button>
          </Space>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[24, 24]}>
        {[
          {
            title: 'Active Bids',
            value: '3',
            subtitle: 'Awaiting response',
            icon: <ClockCircleOutlined className="text-blue-500" />,
            color: 'blue',
            gradient: 'from-blue-500 to-blue-600'
          },
          {
            title: 'Bid Types',
            value: '1',
            subtitle: 'Active configurations',
            icon: <SettingOutlined className="text-purple-500" />,
            color: 'purple',
            gradient: 'from-purple-500 to-purple-600'
          },
          {
            title: 'Monthly Revenue',
            value: '$47,250',
            subtitle: '+15.3% this month',
            icon: <RiseOutlined className="text-green-500" />,
            color: 'green',
            gradient: 'from-green-500 to-green-600',
            trend: '+15.3%'
          },
          {
            title: 'Acceptance Rate',
            value: '72%',
            subtitle: '+2.1% this month',
            icon: <BarChartOutlined className="text-orange-500" />,
            color: 'orange',
            gradient: 'from-orange-500 to-orange-600',
            trend: '+2.1%'
          },
          {
            title: 'Avg Bid Value',
            value: '$185',
            subtitle: '+5.7% this month',
            icon: <BarChartOutlined className="text-cyan-500" />,
            color: 'cyan',
            gradient: 'from-cyan-500 to-cyan-600',
            trend: '+5.7%'
          },
          {
            title: 'Pending Review',
            value: '1',
            subtitle: 'Require attention',
            icon: <ExclamationCircleOutlined className="text-red-500" />,
            color: 'red',
            gradient: 'from-red-500 to-red-600',
            urgent: true
          }
        ].map((stat, index) => (
          <Col xs={24} sm={12} lg={8} xl={4} key={index}>
            <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                  {stat.icon}
                </div>
                {stat.trend && (
                  <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                    <ArrowUpOutlined className="text-xs mr-1" />
                    <Text className="text-xs font-medium">{stat.trend}</Text>
                  </div>
                )}
              </div>
              <div>
                <Text className="text-gray-500 text-sm block mb-1">{stat.title}</Text>
                <Title level={3} className={`!mb-1 ${stat.urgent ? 'text-red-500' : 'text-gray-900'}`}>
                  {stat.value}
                </Title>
                <Text className="text-gray-500 text-xs">{stat.subtitle}</Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Quick Actions & Recent Activity */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card className="h-full shadow-lg border-0">
            <Title level={4} className="!mb-4 flex items-center gap-2">
              <span className="text-lg">⚡</span>
              Quick Actions
            </Title>
            <Text className="text-gray-600 mb-6 block">
              Frequently used bid management tasks
            </Text>
            
            <div className="grid grid-cols-1 gap-4">
              {[
                { icon: <PlusOutlined />, title: 'Create New Bid', color: 'bg-blue-500', desc: 'Start a new bidding process' },
                { icon: <EyeOutlined />, title: 'Review Pending Bids', color: 'bg-orange-500', desc: 'Check bids awaiting approval' },
                { icon: <BarChartOutlined />, title: 'Generate Report', color: 'bg-green-500', desc: 'Export performance analytics' }
              ].map((action, index) => (
                <Button
                  key={index}
                  size="large"
                  className="h-auto p-4 text-left border-2 border-gray-100 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center text-white`}>
                      {action.icon}
                    </div>
                    <div>
                      <Text className="font-medium text-gray-900 block">{action.title}</Text>
                      <Text className="text-gray-500 text-sm">{action.desc}</Text>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card className="h-full shadow-lg border-0">
            <Title level={4} className="!mb-4 flex items-center gap-2">
              <span className="text-lg">🕐</span>
              Recent Bid Activity
            </Title>
            <Text className="text-gray-600 mb-6 block">
              Latest bid submissions and responses
            </Text>
            
            <Timeline className="mt-4">
              {recentActivities.map((activity, index) => (
                <Timeline.Item
                  key={index}
                  dot={
                    <div 
                      className="w-3 h-3 rounded-full shadow-sm" 
                      style={{ backgroundColor: activity.color }}
                    />
                  }
                >
                  <div className="pb-4">
                    <Text className="text-gray-900 font-medium block mb-1">{activity.title}</Text>
                    <Text className="text-gray-500 text-sm">{activity.time}</Text>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>
      </Row>
    </div>
  );

  return (
    <Layout className="min-h-screen bg-gray-50">
      {/* Mobile Drawer */}
      <Drawer
        title={null}
        placement="left"
        onClose={() => setMobileDrawerVisible(false)}
        open={mobileDrawerVisible}
        bodyStyle={{ padding: 0 }}
        width={280}
        className="lg:hidden"
      >
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 h-full">
          {renderSidebarContent()}
        </div>
      </Drawer>

      {/* Desktop Sidebar */}
      <Sider
        width={280}
        collapsedWidth={80}
        collapsed={sidebarCollapsed}
        className="hidden lg:block bg-gradient-to-b from-slate-900 to-slate-800 shadow-2xl"
        style={{ position: 'fixed', height: '100vh', left: 0, top: 0, zIndex: 100 }}
      >
        {renderSidebarContent()}
      </Sider>

      <Layout style={{ marginLeft: screens.lg ? (sidebarCollapsed ? 80 : 280) : 0 }}>
        {/* Header */}
        <Header className="bg-white shadow-lg border-b border-gray-100 px-6 h-16 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => {
                if (screens.lg) {
                  setSidebarCollapsed(!sidebarCollapsed);
                } else {
                  setMobileDrawerVisible(true);
                }
              }}
              className="hover:bg-gray-100 rounded-lg"
            />
            
            <Input
              placeholder="Search bids, configurations..."
              prefix={<SearchOutlined className="text-gray-400" />}
              className="w-64 hidden sm:block rounded-lg border-gray-200"
              size="middle"
            />
          </div>

          <div className="flex items-center gap-4">
            <Badge count={3} size="small">
              <Button
                type="text"
                icon={<NotificationOutlined />}
                className="hover:bg-gray-100 rounded-lg"
                size="middle"
              />
            </Badge>

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
              <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors">
                <Avatar size={32} className="bg-gradient-to-r from-blue-500 to-purple-600">
                  JD
                </Avatar>
                <div className="text-right hidden sm:block">
                  <Text className="text-sm font-medium text-gray-900 block">John Doe</Text>
                  <Text className="text-xs text-gray-500">System Administrator</Text>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* Content */}
        <Content className="p-6">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <Breadcrumb.Item>
              <HomeOutlined />
              <span className="ml-1">Home</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Bid Management</Breadcrumb.Item>
          </Breadcrumb>

          {/* Navigation Tabs */}
          <Card className="mb-6 shadow-sm border-0">
            <Tabs 
              activeKey={activeTab} 
              onChange={setActiveTab}
              items={tabItems}
              className="bid-management-tabs"
            />
          </Card>

          {/* Tab Content */}
          {activeTab === 'dashboard' && renderDashboardContent()}
          {activeTab !== 'dashboard' && (
            <Card className="shadow-lg border-0">
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🚧</span>
                </div>
                <Title level={4} className="text-gray-500 !mb-2">
                  {tabItems.find(item => item.key === activeTab)?.label} Content
                </Title>
                <Text className="text-gray-400">
                  This section is under development
                </Text>
              </div>
            </Card>
          )}
        </Content>
      </Layout>

      <style jsx global>{`
        .bid-management-tabs .ant-tabs-nav {
          margin-bottom: 0;
        }

        .bid-management-tabs .ant-tabs-tab {
          padding: 12px 20px;
          font-weight: 500;
          border-radius: 8px 8px 0 0;
          margin-right: 4px;
        }

        .bid-management-tabs .ant-tabs-tab-active {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: white;
        }

        .bid-management-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: white;
        }

        .ant-card {
          border-radius: 16px;
          border: none;
        }

        .ant-card-body {
          padding: 24px;
        }

        .ant-timeline-item-tail {
          border-left: 2px solid #f0f0f0;
        }

        .ant-timeline-item-content {
          margin-left: 20px;
        }

        .ant-btn {
          border-radius: 8px;
          font-weight: 500;
        }

        .ant-btn-primary {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          border: none;
        }

        .ant-input {
          border-radius: 8px;
        }

        .ant-breadcrumb {
          padding: 0;
        }

        .ant-breadcrumb-link {
          color: #6b7280;
        }

        .ant-layout-sider-trigger {
          display: none;
        }
      `}</style>
    </Layout>
  );
}
