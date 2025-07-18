
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
  MoreOutlined
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
    <>
      {/* Overview/Insights/Analytics Tabs */}
      <Card className="mb-6">
        <Tabs
          defaultActiveKey="overview"
          items={[
            {
              key: 'overview',
              label: (
                <span className="px-4 py-2">
                  📊 Overview
                </span>
              ),
              children: (
                <div>
                  {/* Stats Cards */}
                  <Row gutter={[24, 24]} className="mb-8">
                    <Col xs={24} sm={12} lg={4}>
                      <Card className="text-center">
                        <div className="mb-2">
                          <Text className="text-gray-500 text-sm">Active Bids</Text>
                        </div>
                        <Title level={3} className="!mb-0 text-blue-600">3</Title>
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mx-auto mt-2">
                          <ClockCircleOutlined className="text-blue-600 text-xs" />
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={4}>
                      <Card className="text-center">
                        <div className="mb-2">
                          <Text className="text-gray-500 text-sm">Bid Types</Text>
                        </div>
                        <Title level={3} className="!mb-0 text-green-600">1</Title>
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mx-auto mt-2">
                          <SettingOutlined className="text-green-600 text-xs" />
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={4}>
                      <Card className="text-center">
                        <div className="mb-2">
                          <Text className="text-gray-500 text-sm">Monthly Revenue</Text>
                        </div>
                        <Title level={3} className="!mb-0 text-purple-600">$47K</Title>
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mx-auto mt-2">
                          <RiseOutlined className="text-purple-600 text-xs" />
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={4}>
                      <Card className="text-center">
                        <div className="mb-2">
                          <Text className="text-gray-500 text-sm">Acceptance Rate</Text>
                        </div>
                        <Title level={3} className="!mb-0 text-orange-600">72%</Title>
                        <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mx-auto mt-2">
                          <BarChartOutlined className="text-orange-600 text-xs" />
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={4}>
                      <Card className="text-center">
                        <div className="mb-2">
                          <Text className="text-gray-500 text-sm">Avg Bid Value</Text>
                        </div>
                        <Title level={3} className="!mb-0 text-pink-600">$185</Title>
                        <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center mx-auto mt-2">
                          <span className="text-pink-600 text-xs">💰</span>
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={4}>
                      <Card className="text-center">
                        <div className="mb-2">
                          <Text className="text-gray-500 text-sm">Pending Review</Text>
                        </div>
                        <Title level={3} className="!mb-0 text-red-600">1</Title>
                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mx-auto mt-2">
                          <ExclamationCircleOutlined className="text-red-600 text-xs" />
                        </div>
                      </Card>
                    </Col>
                  </Row>

                  {/* Performance Sections */}
                  <Row gutter={[24, 24]} className="mb-8">
                    {/* Bid Performance */}
                    <Col xs={24} lg={12}>
                      <Card>
                        <div className="mb-6">
                          <Title level={4} className="!mb-1">Bid Performance & Analysis</Title>
                          <Text className="text-gray-500">Detailed statistics based on bid submissions and acceptance rates</Text>
                        </div>

                        <div className="space-y-6">
                          <div className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                              <Title level={5} className="!mb-0">Economy to Business Class</Title>
                              <div className="flex items-center text-green-600">
                                <ArrowUpOutlined className="mr-1" />
                                <Text className="text-green-600">+22.7%</Text>
                              </div>
                            </div>
                            <Row gutter={[16, 16]}>
                              <Col span={12}>
                                <div>
                                  <Text className="text-gray-500 text-sm">Total Bids</Text>
                                  <Text className="block font-semibold">124</Text>
                                </div>
                                <div className="mt-2">
                                  <Text className="text-gray-500 text-sm">Acceptance Rate</Text>
                                  <Text className="block font-semibold">68%</Text>
                                  <Progress percent={68} strokeColor="#1890ff" showInfo={false} size="small" />
                                </div>
                              </Col>
                              <Col span={12}>
                                <div>
                                  <Text className="text-gray-500 text-sm">Avg Bid Amount</Text>
                                  <Text className="block font-semibold text-green-600">$280</Text>
                                </div>
                                <div className="mt-2">
                                  <Text className="text-gray-500 text-sm">Success Score</Text>
                                  <Text className="block font-semibold">8.4/10</Text>
                                </div>
                              </Col>
                            </Row>
                          </div>

                          <div className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                              <Title level={5} className="!mb-0">Economy to First Class</Title>
                              <div className="flex items-center text-green-600">
                                <ArrowUpOutlined className="mr-1" />
                                <Text className="text-green-600">+15.3%</Text>
                              </div>
                            </div>
                            <Row gutter={[16, 16]}>
                              <Col span={12}>
                                <div>
                                  <Text className="text-gray-500 text-sm">Total Bids</Text>
                                  <Text className="block font-semibold">89</Text>
                                </div>
                                <div className="mt-2">
                                  <Text className="text-gray-500 text-sm">Acceptance Rate</Text>
                                  <Text className="block font-semibold">45%</Text>
                                  <Progress percent={45} strokeColor="#1890ff" showInfo={false} size="small" />
                                </div>
                              </Col>
                              <Col span={12}>
                                <div>
                                  <Text className="text-gray-500 text-sm">Avg Bid Amount</Text>
                                  <Text className="block font-semibold text-green-600">$520</Text>
                                </div>
                                <div className="mt-2">
                                  <Text className="text-gray-500 text-sm">Success Score</Text>
                                  <Text className="block font-semibold">7.8/10</Text>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </Card>
                    </Col>

                    {/* Revenue Analysis */}
                    <Col xs={24} lg={12}>
                      <Card>
                        <div className="mb-6">
                          <Title level={4} className="!mb-1">Revenue Analysis & Trends</Title>
                          <Text className="text-gray-500">Financial metrics and revenue optimization insights</Text>
                        </div>

                        <div className="space-y-6">
                          <div className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                              <Title level={5} className="!mb-0">Monthly Bid Revenue</Title>
                              <div className="flex items-center text-green-600">
                                <ArrowUpOutlined className="mr-1" />
                                <Text className="text-green-600">+18.5%</Text>
                              </div>
                            </div>
                            <Row gutter={[16, 16]} className="mt-3">
                              <Col span={12}>
                                <div>
                                  <Text className="text-gray-500 text-sm">Current Month</Text>
                                  <Text className="block font-semibold">$47,250</Text>
                                </div>
                                <div className="mt-2">
                                  <Text className="text-gray-500 text-sm">Previous Month</Text>
                                  <Text className="block font-semibold">$39,850</Text>
                                </div>
                              </Col>
                              <Col span={12}>
                                <div>
                                  <Text className="text-gray-500 text-sm">Growth Rate</Text>
                                  <Text className="block font-semibold text-green-600">+18.5%</Text>
                                </div>
                                <div className="mt-2">
                                  <Text className="text-gray-500 text-sm">Projected Next</Text>
                                  <Text className="block font-semibold">$52,000</Text>
                                </div>
                              </Col>
                            </Row>
                          </div>

                          <div className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                              <Title level={5} className="!mb-0">Customer Satisfaction</Title>
                              <div className="flex items-center text-green-600">
                                <ArrowUpOutlined className="mr-1" />
                                <Text className="text-green-600">+5.2%</Text>
                              </div>
                            </div>
                            <Row gutter={[16, 16]} className="mt-3">
                              <Col span={12}>
                                <div>
                                  <Text className="text-gray-500 text-sm">Overall Rating</Text>
                                  <Text className="block font-semibold">4.6/5</Text>
                                </div>
                                <div className="mt-2">
                                  <Text className="text-gray-500 text-sm">Response Time</Text>
                                  <Text className="block font-semibold">2.3 hours</Text>
                                </div>
                              </Col>
                              <Col span={12}>
                                <div>
                                  <Text className="text-gray-500 text-sm">Repeat Customers</Text>
                                  <Text className="block font-semibold">73%</Text>
                                </div>
                                <div className="mt-2">
                                  <Text className="text-gray-500 text-sm">Recommendations</Text>
                                  <Text className="block font-semibold">89%</Text>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  </Row>

                  {/* Top Performing Cards */}
                  <Row gutter={[24, 24]}>
                    <Col xs={24} lg={8}>
                      <Card className="text-center">
                        <div className="mb-4">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <span className="text-green-600 text-2xl">🏆</span>
                          </div>
                        </div>
                        <Title level={4} className="!mb-1">Highest Acceptance Rate</Title>
                        <Title level={3} className="!mb-1 text-green-600">Economy to Business</Title>
                        <Text className="text-green-600">68%</Text>
                        <br />
                        <Text className="text-gray-500 text-sm">Acceptance Rate</Text>
                      </Card>
                    </Col>
                    <Col xs={24} lg={8}>
                      <Card className="text-center">
                        <div className="mb-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                            <span className="text-blue-600 text-2xl">💰</span>
                          </div>
                        </div>
                        <Title level={4} className="!mb-1">Highest Revenue Bid</Title>
                        <Title level={3} className="!mb-1 text-blue-600">First Class Upgrades</Title>
                        <Text className="text-blue-600">$25K</Text>
                        <br />
                        <Text className="text-gray-500 text-sm">Monthly Revenue</Text>
                      </Card>
                    </Col>
                    <Col xs={24} lg={8}>
                      <Card className="text-center">
                        <div className="mb-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                            <span className="text-purple-600 text-2xl">📈</span>
                          </div>
                        </div>
                        <Title level={4} className="!mb-1">Fastest Growing</Title>
                        <Title level={3} className="!mb-1 text-purple-600">Economy to Business</Title>
                        <Text className="text-purple-600">+22.7%</Text>
                        <br />
                        <Text className="text-gray-500 text-sm">Growth Rate</Text>
                      </Card>
                    </Col>
                  </Row>
                </div>
              ),
            },
            {
              key: 'insights',
              label: (
                <span className="px-4 py-2">
                  🔍 Insights
                </span>
              ),
              children: (
                <div>
                  {/* Bid Trends & Predictions Section */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-xs">📊</span>
                      </div>
                      <Title level={4} className="!mb-0">Bid Trends & Market Analysis</Title>
                    </div>
                    <Text className="text-gray-500 mb-6">Advanced analytics and predictive insights for bid optimization</Text>
                    
                    <Row gutter={[24, 24]} className="mb-8">
                      {/* Bid Volume Trends */}
                      <Col xs={24} lg={12}>
                        <div>
                          <Title level={5} className="!mb-4">Bid Volume Forecasts</Title>
                          
                          <Card className="mb-4" size="small">
                            <div className="flex justify-between items-center mb-3">
                              <Text className="font-semibold">Peak Season Predictions</Text>
                              <Text className="text-sm text-gray-500">92% Confidence</Text>
                            </div>
                            <Row gutter={16}>
                              <Col span={12}>
                                <div className="mb-2">
                                  <Text className="text-gray-500 text-sm">Current Volume</Text>
                                  <Text className="block font-semibold">245 bids/month</Text>
                                </div>
                              </Col>
                              <Col span={12}>
                                <div className="mb-2">
                                  <Text className="text-gray-500 text-sm">Projected Volume</Text>
                                  <Text className="block font-semibold">420 bids/month</Text>
                                </div>
                              </Col>
                            </Row>
                            <div className="flex items-center space-x-1 mt-2">
                              <ArrowUpOutlined className="text-green-600 text-xs" />
                              <Text className="text-green-600 text-sm">+71% Expected Growth</Text>
                            </div>
                            <div className="mt-3">
                              <Text className="font-medium text-sm">Key Factors:</Text>
                              <ul className="text-xs text-gray-600 mt-1">
                                <li>• Holiday travel surge anticipated</li>
                                <li>• Business travel recovery</li>
                                <li>• Premium service demand increase</li>
                              </ul>
                            </div>
                          </Card>

                          <Card size="small">
                            <div className="flex justify-between items-center mb-3">
                              <Text className="font-semibold">Route Popularity Trends</Text>
                              <Text className="text-sm text-gray-500">88% Confidence</Text>
                            </div>
                            <Row gutter={16}>
                              <Col span={12}>
                                <div className="mb-2">
                                  <Text className="text-gray-500 text-sm">Top Route</Text>
                                  <Text className="block font-semibold">NYC → LAX</Text>
                                </div>
                              </Col>
                              <Col span={12}>
                                <div className="mb-2">
                                  <Text className="text-gray-500 text-sm">Bid Success Rate</Text>
                                  <Text className="block font-semibold">74%</Text>
                                </div>
                              </Col>
                            </Row>
                            <div className="flex items-center space-x-1 mt-2">
                              <ArrowUpOutlined className="text-green-600 text-xs" />
                              <Text className="text-green-600 text-sm">+12% Monthly Growth</Text>
                            </div>
                          </Card>
                        </div>
                      </Col>

                      {/* Price Optimization */}
                      <Col xs={24} lg={12}>
                        <div>
                          <Title level={5} className="!mb-4">Price Optimization Insights</Title>
                          
                          <Card className="mb-4" size="small">
                            <div className="flex justify-between items-center mb-3">
                              <Text className="font-semibold">Optimal Bid Ranges</Text>
                              <Text className="text-sm text-gray-500">Economic Analysis</Text>
                            </div>
                            <div className="mb-3">
                              <Text className="font-medium text-sm">Business Class Upgrades:</Text>
                              <div className="mt-2 p-2 bg-green-50 rounded">
                                <Text className="text-green-700 text-sm">Sweet Spot: $250-$320</Text>
                                <br />
                                <Text className="text-green-600 text-xs">85% acceptance rate in this range</Text>
                              </div>
                            </div>
                            <div className="mb-3">
                              <Text className="font-medium text-sm">First Class Upgrades:</Text>
                              <div className="mt-2 p-2 bg-blue-50 rounded">
                                <Text className="text-blue-700 text-sm">Sweet Spot: $480-$650</Text>
                                <br />
                                <Text className="text-blue-600 text-xs">72% acceptance rate in this range</Text>
                              </div>
                            </div>
                          </Card>

                          <Card size="small">
                            <div className="flex justify-between items-center mb-3">
                              <Text className="font-semibold">Revenue Optimization</Text>
                              <Badge className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">High Impact</Badge>
                            </div>
                            <Text className="text-gray-600 text-sm mb-3">
                              Dynamic pricing model suggests 15% revenue increase potential
                            </Text>
                            <div className="flex items-center space-x-1">
                              <ArrowUpOutlined className="text-green-600 text-xs" />
                              <Text className="text-green-600 text-sm">Projected: +$8.2K monthly</Text>
                            </div>
                          </Card>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  {/* Market Analysis */}
                  <div>
                    <Title level={5} className="!mb-4">Market Trends Analysis</Title>
                    <Row gutter={[24, 24]}>
                      <Col xs={24} lg={12}>
                        <Card size="small">
                          <div className="flex justify-between items-center mb-3">
                            <Text className="font-semibold">Premium Travel Demand</Text>
                            <Badge className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">High Impact</Badge>
                          </div>
                          <Text className="text-gray-600 text-sm mb-3">
                            Post-pandemic shift toward premium experiences driving bid volume increases
                          </Text>
                          <div className="flex items-center space-x-1">
                            <ArrowUpOutlined className="text-green-600 text-xs" />
                            <Text className="text-green-600 text-sm">+35% Year-over-Year Growth</Text>
                          </div>
                        </Card>
                      </Col>
                      <Col xs={24} lg={12}>
                        <Card size="small">
                          <div className="flex justify-between items-center mb-3">
                            <Text className="font-semibold">Business Travel Recovery</Text>
                            <Badge className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">Medium Impact</Badge>
                          </div>
                          <Text className="text-gray-600 text-sm mb-3">
                            Corporate travel budgets expanding, creating upgrade bid opportunities
                          </Text>
                          <div className="flex items-center space-x-1">
                            <ArrowUpOutlined className="text-green-600 text-xs" />
                            <Text className="text-green-600 text-sm">+28% Expected Growth</Text>
                          </div>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                </div>
              ),
            },
            {
              key: 'analytics',
              label: (
                <span className="px-4 py-2">
                  📈 Analytics
                </span>
              ),
              children: (
                <div>
                  <Title level={4} className="!mb-4">Advanced Bid Analytics</Title>
                  <Text className="text-gray-600 block mb-6">
                    Comprehensive analytics dashboard for bid performance monitoring
                  </Text>
                  
                  <Row gutter={[24, 24]}>
                    <Col xs={24} lg={12}>
                      <Card>
                        <Title level={5} className="!mb-4">Conversion Funnel Analysis</Title>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <Text>Bid Submissions</Text>
                            <Text className="font-semibold">1,245</Text>
                          </div>
                          <Progress percent={100} strokeColor="#1890ff" />
                          
                          <div className="flex justify-between items-center">
                            <Text>Under Review</Text>
                            <Text className="font-semibold">982</Text>
                          </div>
                          <Progress percent={79} strokeColor="#52c41a" />
                          
                          <div className="flex justify-between items-center">
                            <Text>Accepted</Text>
                            <Text className="font-semibold">673</Text>
                          </div>
                          <Progress percent={54} strokeColor="#722ed1" />
                          
                          <div className="flex justify-between items-center">
                            <Text>Completed</Text>
                            <Text className="font-semibold">634</Text>
                          </div>
                          <Progress percent={51} strokeColor="#13c2c2" />
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24} lg={12}>
                      <Card>
                        <Title level={5} className="!mb-4">Performance Metrics</Title>
                        <div className="space-y-4">
                          <Row gutter={16}>
                            <Col span={12}>
                              <Statistic 
                                title="Average Response Time" 
                                value={2.3} 
                                suffix="hours"
                                valueStyle={{ color: '#3f8600' }}
                              />
                            </Col>
                            <Col span={12}>
                              <Statistic 
                                title="Customer Satisfaction" 
                                value={4.6} 
                                suffix="/ 5"
                                valueStyle={{ color: '#cf1322' }}
                              />
                            </Col>
                          </Row>
                          <Row gutter={16}>
                            <Col span={12}>
                              <Statistic 
                                title="Repeat Bid Rate" 
                                value={73} 
                                suffix="%"
                                valueStyle={{ color: '#1890ff' }}
                              />
                            </Col>
                            <Col span={12}>
                              <Statistic 
                                title="Revenue Per Bid" 
                                value={185} 
                                prefix="$"
                                valueStyle={{ color: '#722ed1' }}
                              />
                            </Col>
                          </Row>
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </div>
              ),
            },
          ]}
        />
      </Card>
    </>
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
            items={[
              {
                key: 'dashboard',
                label: (
                  <span>
                    <BarChartOutlined />
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
            ]}
          />

          {/* Tab Content */}
          {activeTab === 'dashboard' && renderDashboardContent()}
          {activeTab === 'active-bids' && (
            <Card>
              <Title level={4}>Active Bids Management</Title>
              <Text>Monitor and manage currently active passenger bidding requests.</Text>
            </Card>
          )}
          {activeTab === 'bid-setup' && (
            <Card>
              <Title level={4}>Bid Configuration</Title>
              <Text>Configure bidding rules, minimum amounts, and acceptance criteria.</Text>
            </Card>
          )}
          {activeTab === 'payments' && (
            <Card>
              <Title level={4}>Bid Payments</Title>
              <Text>Track and manage payments for accepted bids.</Text>
            </Card>
          )}
          {activeTab === 'history' && (
            <Card>
              <Title level={4}>Bid History</Title>
              <Text>View historical bid data and performance analytics.</Text>
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
