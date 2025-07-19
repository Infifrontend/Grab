import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Table,
  Tag,
  Space,
  Input,
  Select,
  DatePicker,
  Modal,
  Form,
  InputNumber,
  Switch,
  Dropdown,
  Statistic,
  Progress,
  Tabs,
  Breadcrumb,
  Avatar,
  Badge
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  GiftOutlined,
  DollarOutlined,
  PercentageOutlined,
  CalendarOutlined,
  HomeOutlined,
  BellOutlined,
  UserOutlined,
  RiseOutlined,
  FallOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  TrophyOutlined
} from "@ant-design/icons";
import { useLocation } from "wouter";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export default function OfferManagement() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [form] = Form.useForm();
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

  const renderDashboardContent = () => (
    <>
      {/* Overview/Insights/Recommendations Tabs */}
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
                          <Text className="text-gray-500 text-sm">Active Policies</Text>
                        </div>
                        <Title level={3} className="!mb-0 text-blue-600">12</Title>
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={4}>
                      <Card className="text-center">
                        <div className="mb-2">
                          <Text className="text-gray-500 text-sm">Ancillaries</Text>
                        </div>
                        <Title level={3} className="!mb-0 text-green-600">24</Title>
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mx-auto mt-2">
                          <span className="text-green-600 text-xs">✓</span>
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={4}>
                      <Card className="text-center">
                        <div className="mb-2">
                          <Text className="text-gray-500 text-sm">Active Discounts</Text>
                        </div>
                        <Title level={3} className="!mb-0 text-purple-600">8</Title>
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mx-auto mt-2">
                          <PercentageOutlined className="text-purple-600 text-xs" />
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={4}>
                      <Card className="text-center">
                        <div className="mb-2">
                          <Text className="text-gray-500 text-sm">Active Promo Codes</Text>
                        </div>
                        <Title level={3} className="!mb-0 text-orange-600">15</Title>
                        <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mx-auto mt-2">
                          <span className="text-orange-600 text-xs">🎟️</span>
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={4}>
                      <Card className="text-center">
                        <div className="mb-2">
                          <Text className="text-gray-500 text-sm">Active Offers</Text>
                        </div>
                        <Title level={3} className="!mb-0 text-pink-600">18</Title>
                        <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center mx-auto mt-2">
                          <GiftOutlined className="text-pink-600 text-xs" />
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={4}>
                      <Card className="text-center">
                        <div className="mb-2">
                          <Text className="text-gray-500 text-sm">Total Revenue</Text>
                        </div>
                        <Title level={3} className="!mb-0 text-green-600">$2450K</Title>
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mx-auto mt-2">
                          <DollarOutlined className="text-green-600 text-xs" />
                        </div>
                      </Card>
                    </Col>
                  </Row>

                  {/* Performance Sections */}
                  <Row gutter={[24, 24]} className="mb-8">
                    {/* Ancillary Performance */}
                    <Col xs={24} lg={12}>
                      <Card>
                        <div className="mb-6">
                          <Title level={4} className="!mb-1">Ancillary Performance & Usage</Title>
                          <Text className="text-gray-500">Detailed statistics based on customer usage and revenue</Text>
                        </div>

                        <div className="space-y-6">
                          <div className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                              <Title level={5} className="!mb-0">Extra Leg Room Seat</Title>
                              <div className="flex items-center text-green-600">
                                <RiseOutlined className="mr-1" />
                                <Text className="text-green-600">+22.7%</Text>
                              </div>
                            </div>
                            <Row gutter={[16, 16]}>
                              <Col span={12}>
                                <div>
                                  <Text className="text-gray-500 text-sm">Total Bookings</Text>
                                  <Text className="block font-semibold">15,420</Text>
                                </div>
                                <div className="mt-2">
                                  <Text className="text-gray-500 text-sm">Conversion Rate</Text>
                                  <Text className="block font-semibold">45.2%</Text>
                                  <Progress percent={45} strokeColor="#1890ff" showInfo={false} size="small" />
                                </div>
                              </Col>
                              <Col span={12}>
                                <div>
                                  <Text className="text-gray-500 text-sm">Revenue</Text>
                                  <Text className="block font-semibold text-green-600">$693,300</Text>
                                </div>
                                <div className="mt-2">
                                  <Text className="text-gray-500 text-sm">Satisfaction</Text>
                                  <Text className="block font-semibold">4.6/5</Text>
                                </div>
                              </Col>
                            </Row>
                          </div>

                          <div className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                              <Title level={5} className="!mb-0">Premium Meal Service</Title>
                              <div className="flex items-center text-green-600">
                                <RiseOutlined className="mr-1" />
                                <Text className="text-green-600">+18.3%</Text>
                              </div>
                            </div>
                            <Row gutter={[16, 16]}>
                              <Col span={12}>
                                <div>
                                  <Text className="text-gray-500 text-sm">Total Bookings</Text>
                                  <Text className="block font-semibold">23,450</Text>
                                </div>
                                <div className="mt-2">
                                  <Text className="text-gray-500 text-sm">Conversion Rate</Text>
                                  <Text className="block font-semibold">38.7%</Text>
                                  <Progress percent={39} strokeColor="#1890ff" showInfo={false} size="small" />
                                </div>
                              </Col>
                              <Col span={12}>
                                <div>
                                  <Text className="text-gray-500 text-sm">Revenue</Text>
                                  <Text className="block font-semibold text-green-600">$657,260</Text>
                                </div>
                                <div className="mt-2">
                                  <Text className="text-gray-500 text-sm">Satisfaction</Text>
                                  <Text className="block font-semibold">4.4/5</Text>
                                </div>
                              </Col>
                            </Row>
                          </div>

                          <div className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                              <Title level={5} className="!mb-0">Priority Boarding</Title>
                              <div className="flex items-center text-green-600">
                                <RiseOutlined className="mr-1" />
                                <Text className="text-green-600">+15.9%</Text>
                              </div>
                            </div>
                            <Row gutter={[16, 16]}>
                              <Col span={12}>
                                <div>
                                  <Text className="text-gray-500 text-sm">Total Bookings</Text>
                                  <Text className="block font-semibold">34,560</Text>
                                </div>
                                <div className="mt-2">
                                  <Text className="text-gray-500 text-sm">Conversion Rate</Text>
                                  <Text className="block font-semibold">42.8%</Text>
                                  <Progress percent={43} strokeColor="#1890ff" showInfo={false} size="small" />
                                </div>
                              </Col>
                              <Col span={12}>
                                <div>
                                  <Text className="text-gray-500 text-sm">Revenue</Text>
                                  <Text className="block font-semibold text-green-600">$518,400</Text>
                                </div>
                                <div className="mt-2">
                                  <Text className="text-gray-500 text-sm">Satisfaction</Text>
                                  <Text className="block font-semibold">4.7/5</Text>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </Card>
                    </Col>

                    {/* Offer Performance */}
                    <Col xs={24} lg={12}>
                      <Card>
                        <div className="mb-6">
                          <Title level={4} className="!mb-1">Offer Performance & Usage</Title>
                          <Text className="text-gray-500">Comprehensive offer metrics and customer behavior</Text>
                        </div>

                        <div className="space-y-6">
                          <div className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                              <Title level={5} className="!mb-0">Business Traveler Offer</Title>
                              <div className="flex items-center text-green-600">
                                <RiseOutlined className="mr-1" />
                                <Text className="text-green-600">+23.4%</Text>
                              </div>
                            </div>
                            <Text className="text-gray-500 text-sm">BTO001</Text>
                            <Row gutter={[16, 16]} className="mt-3">
                              <Col span={12}>
                                <div>
                                  <Text className="text-gray-500 text-sm">Adoption Rate</Text>
                                  <Text className="block font-semibold">34%</Text>
                                </div>
                                <div className="mt-2">
                                  <Text className="text-gray-500 text-sm">Total Orders</Text>
                                  <Text className="block font-semibold">2,450</Text>
                                </div>
                                <div className="mt-2">
                                  <Text className="text-gray-500 text-sm">Customer Satisfaction</Text>
                                  <Text className="block font-semibold">4.8/5</Text>
                                  <Progress percent={96} strokeColor="#52c41a" showInfo={false} size="small" />
                                </div>
                              </Col>
                              <Col span={12}>
                                <div>
                                  <Text className="text-gray-500 text-sm">Revenue</Text>
                                  <Text className="block font-semibold text-green-600">$134,000</Text>
                                </div>
                                <div className="mt-2">
                                  <Text className="text-gray-500 text-sm">Avg Value</Text>
                                  <Text className="block font-semibold">$547</Text>
                                </div>
                                <div className="mt-2">
                                  <Text className="text-gray-500 text-sm">Repeat Purchase</Text>
                                  <Text className="block font-semibold">67%</Text>
                                </div>
                              </Col>
                            </Row>
                          </div>

                          <div className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                              <Title level={5} className="!mb-0">Family Fun Package</Title>
                              <div className="flex items-center text-green-600">
                                <RiseOutlined className="mr-1" />
                                <Text className="text-green-600">+18.7%</Text>
                              </div>
                            </div>
                            <Text className="text-gray-500 text-sm">FFP002</Text>
                            <Row gutter={[16, 16]} className="mt-3">
                              <Col span={12}>
                                <div>
                                  <Text className="text-gray-500 text-sm">Adoption Rate</Text>
                                  <Text className="block font-semibold">28%</Text>
                                </div>
                                <div className="mt-2">
                                  <Text className="text-gray-500 text-sm">Total Orders</Text>
                                  <Text className="block font-semibold">1,890</Text>
                                </div>
                                <div className="mt-2">
                                  <Text className="text-gray-500 text-sm">Customer Satisfaction</Text>
                                  <Text className="block font-semibold">4.3/5</Text>
                                  <Progress percent={86} strokeColor="#52c41a" showInfo={false} size="small" />
                                </div>
                              </Col>
                              <Col span={12}>
                                <div>
                                  <Text className="text-gray-500 text-sm">Revenue</Text>
                                  <Text className="block font-semibold text-green-600">$98,000</Text>
                                </div>
                                <div className="mt-2">
                                  <Text className="text-gray-500 text-sm">Avg Value</Text>
                                  <Text className="block font-semibold">$519</Text>
                                </div>
                                <div className="mt-2">
                                  <Text className="text-gray-500 text-sm">Repeat Purchase</Text>
                                  <Text className="block font-semibold">45%</Text>
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
                        <Title level={4} className="!mb-1">Top Converting Ancillary</Title>
                        <Title level={3} className="!mb-1 text-green-600">Extra Leg Room Seat</Title>
                        <Text className="text-green-600">45.2%</Text>
                        <br />
                        <Text className="text-gray-500 text-sm">Conversion Rate</Text>
                      </Card>
                    </Col>
                    <Col xs={24} lg={8}>
                      <Card className="text-center">
                        <div className="mb-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                            <span className="text-blue-600 text-2xl">💰</span>
                          </div>
                        </div>
                        <Title level={4} className="!mb-1">Highest Revenue Offer</Title>
                        <Title level={3} className="!mb-1 text-blue-600">Business Traveler Offer</Title>
                        <Text className="text-blue-600">$134K</Text>
                        <br />
                        <Text className="text-gray-500 text-sm">Total Revenue</Text>
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
                        <Title level={3} className="!mb-1 text-purple-600">Extra Leg Room Seat</Title>
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
                  {/* Forecasting & Predictions Section */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-xs">🔮</span>
                      </div>
                      <Title level={4} className="!mb-0">Forecasting & Predictions</Title>
                    </div>
                    <Text className="text-gray-500 mb-6">AI-powered forecasts and market trend analysis for ancillaries and offers</Text>
                    
                    <Row gutter={[24, 24]} className="mb-8">
                      {/* Ancillary Revenue Forecasts */}
                      <Col xs={24} lg={12}>
                        <div>
                          <Title level={5} className="!mb-4">Ancillary Revenue Forecasts</Title>
                          
                          {/* Premium Seat Upgrades */}
                          <Card className="mb-4" size="small">
                            <div className="flex justify-between items-center mb-3">
                              <Text className="font-semibold">Premium Seat Upgrades</Text>
                              <Text className="text-sm text-gray-500">87% Confidence</Text>
                            </div>
                            <Row gutter={16}>
                              <Col span={12}>
                                <div className="mb-2">
                                  <Text className="text-gray-500 text-sm">Current Revenue</Text>
                                  <Text className="block font-semibold">$45,000</Text>
                                </div>
                              </Col>
                              <Col span={12}>
                                <div className="mb-2">
                                  <Text className="text-gray-500 text-sm">Projected Revenue</Text>
                                  <Text className="block font-semibold">$298,000</Text>
                                </div>
                              </Col>
                            </Row>
                            <div className="flex items-center space-x-1 mt-2">
                              <RiseOutlined className="text-green-600 text-xs" />
                              <Text className="text-green-600 text-sm">+216% Next Quarter</Text>
                            </div>
                            <div className="mt-3">
                              <Text className="font-medium text-sm">Key Factors:</Text>
                              <ul className="text-xs text-gray-600 mt-1">
                                <li>• Seasonal increase in business travel</li>
                                <li>• New route launches</li>
                                <li>• Competitor pricing analysis</li>
                              </ul>
                            </div>
                          </Card>

                          {/* Extra Baggage */}
                          <Card className="mb-4" size="small">
                            <div className="flex justify-between items-center mb-3">
                              <Text className="font-semibold">Extra Baggage</Text>
                              <Text className="text-sm text-gray-500">84% Confidence</Text>
                            </div>
                            <Row gutter={16}>
                              <Col span={12}>
                                <div className="mb-2">
                                  <Text className="text-gray-500 text-sm">Current Revenue</Text>
                                  <Text className="block font-semibold">$185,000</Text>
                                </div>
                              </Col>
                              <Col span={12}>
                                <div className="mb-2">
                                  <Text className="text-gray-500 text-sm">Projected Revenue</Text>
                                  <Text className="block font-semibold">$215,000</Text>
                                </div>
                              </Col>
                            </Row>
                            <div className="flex items-center space-x-1 mt-2">
                              <RiseOutlined className="text-green-600 text-xs" />
                              <Text className="text-green-600 text-sm">+16.2% Next Quarter</Text>
                            </div>
                            <div className="mt-3">
                              <Text className="font-medium text-sm">Key Factors:</Text>
                              <ul className="text-xs text-gray-600 mt-1">
                                <li>• Holiday travel season</li>
                                <li>• Family travel increase</li>
                                <li>• Pricing optimization</li>
                              </ul>
                            </div>
                          </Card>

                          {/* In-Flight Meals */}
                          <Card size="small">
                            <div className="flex justify-between items-center mb-3">
                              <Text className="font-semibold">In-Flight Meals</Text>
                              <Text className="text-sm text-gray-500">81% Confidence</Text>
                            </div>
                            <Row gutter={16}>
                              <Col span={12}>
                                <div className="mb-2">
                                  <Text className="text-gray-500 text-sm">Current Revenue</Text>
                                  <Text className="block font-semibold">$156,000</Text>
                                </div>
                              </Col>
                              <Col span={12}>
                                <div className="mb-2">
                                  <Text className="text-gray-500 text-sm">Projected Revenue</Text>
                                  <Text className="block font-semibold">$187,000</Text>
                                </div>
                              </Col>
                            </Row>
                            <div className="flex items-center space-x-1 mt-2">
                              <RiseOutlined className="text-green-600 text-xs" />
                              <Text className="text-green-600 text-sm">+19.9% Next Quarter</Text>
                            </div>
                            <div className="mt-3">
                              <Text className="font-medium text-sm">Key Factors:</Text>
                              <ul className="text-xs text-gray-600 mt-1">
                                <li>• Menu refresh campaign</li>
                                <li>• Extended flight routes</li>
                                <li>• Premium meal options</li>
                              </ul>
                            </div>
                          </Card>
                        </div>
                      </Col>

                      {/* Offer Performance Predictions */}
                      <Col xs={24} lg={12}>
                        <div>
                          <Title level={5} className="!mb-4">Offer Performance Predictions</Title>
                          
                          {/* Business Traveler Package */}
                          <Card className="mb-4" size="small">
                            <div className="flex justify-between items-center mb-3">
                              <Text className="font-semibold">Business Traveler Package</Text>
                              <Text className="text-sm text-gray-500">89% Confidence</Text>
                            </div>
                            <Row gutter={16}>
                              <Col span={12}>
                                <div className="mb-2">
                                  <Text className="text-gray-500 text-sm">Current Adoption</Text>
                                  <Text className="block font-semibold">34%</Text>
                                </div>
                                <div>
                                  <Text className="text-gray-500 text-sm">Current Revenue</Text>
                                  <Text className="block font-semibold">$145,000</Text>
                                </div>
                              </Col>
                              <Col span={12}>
                                <div className="mb-2">
                                  <Text className="text-gray-500 text-sm">Projected Adoption</Text>
                                  <Text className="block font-semibold">42%</Text>
                                </div>
                                <div>
                                  <Text className="text-gray-500 text-sm">Projected Revenue</Text>
                                  <Text className="block font-semibold">$178,000</Text>
                                </div>
                              </Col>
                            </Row>
                            <div className="flex items-center space-x-1 mt-2">
                              <RiseOutlined className="text-green-600 text-xs" />
                              <Text className="text-green-600 text-sm">+22.8% Growth Expected</Text>
                            </div>
                            <div className="mt-3 p-2 bg-green-50 rounded">
                              <Text className="text-green-700 text-xs">💡 Increase marketing spend during Q1 business travel peak</Text>
                            </div>
                          </Card>

                          {/* Family Fun Bundle */}
                          <Card size="small">
                            <div className="flex justify-between items-center mb-3">
                              <Text className="font-semibold">Family Fun Bundle</Text>
                              <Text className="text-sm text-gray-500">82% Confidence</Text>
                            </div>
                            <Row gutter={16}>
                              <Col span={12}>
                                <div className="mb-2">
                                  <Text className="text-gray-500 text-sm">Current Adoption</Text>
                                  <Text className="block font-semibold">28%</Text>
                                </div>
                                <div>
                                  <Text className="text-gray-500 text-sm">Current Revenue</Text>
                                  <Text className="block font-semibold">$98,000</Text>
                                </div>
                              </Col>
                              <Col span={12}>
                                <div className="mb-2">
                                  <Text className="text-gray-500 text-sm">Projected Adoption</Text>
                                  <Text className="block font-semibold">36%</Text>
                                </div>
                                <div>
                                  <Text className="text-gray-500 text-sm">Projected Revenue</Text>
                                  <Text className="block font-semibold">$127,000</Text>
                                </div>
                              </Col>
                            </Row>
                            <div className="flex items-center space-x-1 mt-2">
                              <RiseOutlined className="text-green-600 text-xs" />
                              <Text className="text-green-600 text-sm">+29.6% Growth Expected</Text>
                            </div>
                            <div className="mt-3 p-2 bg-yellow-50 rounded">
                              <Text className="text-yellow-700 text-xs">🎯 Target summer vacation bookings with enhanced family amenities</Text>
                            </div>
                          </Card>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  {/* Market Trends Analysis */}
                  <div>
                    <Title level={5} className="!mb-4">Market Trends Analysis</Title>
                    <Row gutter={[24, 24]}>
                      <Col xs={24} lg={12}>
                        <Card size="small">
                          <div className="flex justify-between items-center mb-3">
                            <Text className="font-semibold">Sustainable Travel Preference</Text>
                            <Badge className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">High Impact</Badge>
                          </div>
                          <Text className="text-gray-600 text-sm mb-3">
                            Increasing customer demand for eco-friendly travel options and carbon offset programs
                          </Text>
                          <div className="mb-3">
                            <Text className="font-medium text-sm">Affected Services:</Text>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Carbon Offsets</Badge>
                              <Badge className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Eco-Friendly Meals</Badge>
                              <Badge className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Sustainable Amenities</Badge>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RiseOutlined className="text-green-600 text-xs" />
                            <Text className="text-green-600 text-sm">+45% Expected Growth</Text>
                          </div>
                        </Card>
                      </Col>
                      <Col xs={24} lg={12}>
                        <Card size="small">
                          <div className="flex justify-between items-center mb-3">
                            <Text className="font-semibold">Premium Experience Demand</Text>
                            <Badge className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">Medium Impact</Badge>
                          </div>
                          <Text className="text-gray-600 text-sm mb-3">
                            Post-pandemic shift towards premium services and contactless experiences
                          </Text>
                          <div className="mb-3">
                            <Text className="font-medium text-sm">Affected Services:</Text>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">Premium Seats</Badge>
                              <Badge className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">Priority Boarding</Badge>
                              <Badge className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">Lounge Access</Badge>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RiseOutlined className="text-green-600 text-xs" />
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
              key: 'recommendations',
              label: (
                <span className="px-4 py-2">
                  💡 Offer Recommendations
                </span>
              ),
              children: (
                <div>
                  {/* AI-Generated Offer Recommendations */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-yellow-600 text-xs">💡</span>
                      </div>
                      <Title level={4} className="!mb-0">AI-Generated Offer Recommendations</Title>
                    </div>
                    <Text className="text-gray-500 mb-6">Intelligent offer suggestions based on market analysis, customer behavior, and revenue optimization</Text>
                    
                    <Row gutter={[24, 24]}>
                      {/* Executive Business Bundle */}
                      <Col xs={24} lg={12}>
                        <Card className="h-full">
                          <div className="flex justify-between items-center mb-4">
                            <Title level={5} className="!mb-0">Executive Business Bundle</Title>
                            <Text className="text-sm text-gray-500">87% Confidence</Text>
                          </div>
                          <div className="mb-4">
                            <Text className="text-blue-600 font-medium text-sm">Target: Business Travelers</Text>
                            <Text className="text-gray-600 text-sm mt-1">
                              Comprehensive package for frequent business travelers seeking efficiency and comfort
                            </Text>
                          </div>

                          <div className="mb-4">
                            <Title level={6} className="!mb-3">Package Components</Title>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="text-green-600">✓</span>
                                  <Text className="text-sm">Priority Check-in</Text>
                                </div>
                                <Text className="text-sm font-medium">$25</Text>
                              </div>
                              <div className="flex justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="text-green-600">✓</span>
                                  <Text className="text-sm">Business Class Seat</Text>
                                </div>
                                <Text className="text-sm font-medium">$150</Text>
                              </div>
                              <div className="flex justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="text-green-600">✓</span>
                                  <Text className="text-sm">Extra Legroom</Text>
                                </div>
                                <Text className="text-sm font-medium">$45</Text>
                              </div>
                              <div className="flex justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="text-green-600">✓</span>
                                  <Text className="text-sm">Premium Meal</Text>
                                </div>
                                <Text className="text-sm font-medium">$30</Text>
                              </div>
                              <div className="flex justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="text-green-600">✓</span>
                                  <Text className="text-sm">Fast Track Security</Text>
                                </div>
                                <Text className="text-sm font-medium">$20</Text>
                              </div>
                            </div>
                          </div>

                          <div className="border-t pt-4 mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <Text className="text-gray-500">Individual Total</Text>
                              <Text className="font-medium">$270</Text>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                              <Text className="text-gray-500">Recommended Price</Text>
                              <Text className="font-medium">$220</Text>
                            </div>
                            <div className="flex justify-between items-center mb-3">
                              <Text className="text-green-600 font-medium">Customer Saves: $50</Text>
                              <Text className="text-blue-600 font-medium">Margin: 35%</Text>
                            </div>
                            
                            <Row gutter={16} className="mb-3">
                              <Col span={12}>
                                <div className="text-center">
                                  <Text className="text-blue-600 font-bold text-xl">32%</Text>
                                  <Text className="text-gray-500 text-sm block">Expected Adoption</Text>
                                </div>
                              </Col>
                              <Col span={12}>
                                <div className="text-center">
                                  <Text className="text-green-600 font-bold text-xl">$145K</Text>
                                  <Text className="text-gray-500 text-sm block">Revenue Projection</Text>
                                </div>
                              </Col>
                            </Row>

                            <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                              <span>Break-even: 850 bookings</span>
                              <span>Confidence: 87%</span>
                            </div>
                          </div>

                          <div className="mb-4">
                            <Title level={6} className="!mb-2">Why this offer?</Title>
                            <Text className="text-gray-600 text-sm">
                              Analysis shows business travelers value time-saving services and are willing to pay premium for bundled convenience. Current market gap in comprehensive business travel packages.
                            </Text>
                          </div>

                          <Button 
                            type="primary" 
                            block 
                            className="bg-green-600 hover:bg-green-700 border-green-600"
                            icon={<PlusOutlined />}
                          >
                            Create This Offer
                          </Button>
                        </Card>
                      </Col>

                      {/* Family Adventure Pack */}
                      <Col xs={24} lg={12}>
                        <Card className="h-full">
                          <div className="flex justify-between items-center mb-4">
                            <Title level={5} className="!mb-0">Family Adventure Pack</Title>
                            <Text className="text-sm text-gray-500">82% Confidence</Text>
                          </div>
                          <div className="mb-4">
                            <Text className="text-purple-600 font-medium text-sm">Target: Family Travelers</Text>
                            <Text className="text-gray-600 text-sm mt-1">
                              Value-focused package designed for families traveling with children
                            </Text>
                          </div>

                          <div className="mb-4">
                            <Title level={6} className="!mb-3">Package Components</Title>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="text-green-600">✓</span>
                                  <Text className="text-sm">Family Seating</Text>
                                </div>
                                <Text className="text-sm font-medium">$40</Text>
                              </div>
                              <div className="flex justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="text-green-600">✓</span>
                                  <Text className="text-sm">Kids Entertainment</Text>
                                </div>
                                <Text className="text-sm font-medium">$15</Text>
                              </div>
                              <div className="flex justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="text-green-600">✓</span>
                                  <Text className="text-sm">Family Meal Deal</Text>
                                </div>
                                <Text className="text-sm font-medium">$60</Text>
                              </div>
                              <div className="flex justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="text-green-600">✓</span>
                                  <Text className="text-sm">Extra Baggage Allowance</Text>
                                </div>
                                <Text className="text-sm font-medium">$35</Text>
                              </div>
                              <div className="flex justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="text-green-600">✓</span>
                                  <Text className="text-sm">Priority Boarding</Text>
                                </div>
                                <Text className="text-sm font-medium">$20</Text>
                              </div>
                            </div>
                          </div>

                          <div className="border-t pt-4 mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <Text className="text-gray-500">Individual Total</Text>
                              <Text className="font-medium">$170</Text>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                              <Text className="text-gray-500">Recommended Price</Text>
                              <Text className="font-medium">$135</Text>
                            </div>
                            <div className="flex justify-between items-center mb-3">
                              <Text className="text-green-600 font-medium">Customer Saves: $35</Text>
                              <Text className="text-blue-600 font-medium">Margin: 28%</Text>
                            </div>
                            
                            <Row gutter={16} className="mb-3">
                              <Col span={12}>
                                <div className="text-center">
                                  <Text className="text-blue-600 font-bold text-xl">28%</Text>
                                  <Text className="text-gray-500 text-sm block">Expected Adoption</Text>
                                </div>
                              </Col>
                              <Col span={12}>
                                <div className="text-center">
                                  <Text className="text-green-600 font-bold text-xl">$98K</Text>
                                  <Text className="text-gray-500 text-sm block">Revenue Projection</Text>
                                </div>
                              </Col>
                            </Row>

                            <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                              <span>Break-even: 1200 bookings</span>
                              <span>Confidence: 82%</span>
                            </div>
                          </div>

                          <div className="mb-4">
                            <Title level={6} className="!mb-2">Why this offer?</Title>
                            <Text className="text-gray-600 text-sm">
                              Family travelers prioritize value and convenience. Bundling family-specific services at a discount increases adoption while maintaining healthy margins.
                            </Text>
                          </div>

                          <Button 
                            type="primary" 
                            block 
                            className="bg-green-600 hover:bg-green-700 border-green-600"
                            icon={<PlusOutlined />}
                          >
                            Create This Offer
                          </Button>
                        </Card>
                      </Col>
                    </Row>
                  </div>
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
              <Badge count={5} size="small">
                <BellOutlined className="text-gray-500 text-lg" />
              </Badge>
              <Avatar size="small" className="bg-blue-600">
                <span className="text-white font-medium">JD</span>
              </Avatar>
              <div className="text-right">
                <Text className="font-medium text-gray-900 block">John Doe</Text>
                <Text className="text-gray-500 text-sm">System Administrator</Text>
              </div>
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
              <div className="flex items-center space-x-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg px-4 py-3 shadow-md">
                <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                  <span className="text-blue-600 text-xs">🎯</span>
                </div>
                <Text className="text-white font-medium">Offers Management</Text>
              </div>
              <div 
                className="flex items-center space-x-3 text-slate-300 hover:text-white px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 cursor-pointer transition-all duration-200"
                onClick={() => setLocation('/admin/bid-management')}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-current text-xs">📋</span>
                </div>
                <Text className="text-current">Bid Management</Text>
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
            <Breadcrumb.Item>Offers Management</Breadcrumb.Item>
          </Breadcrumb>

          {/* Page Header */}
          <div className="mb-6">
            <Title level={2} className="!mb-1 text-gray-900">
              Offer Management
            </Title>
            <Text className="text-gray-600">
              Create and manage airline offers and ancillary services
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
                key: 'policies',
                label: (
                  <span>
                    <span className="mr-2">🛡️</span>
                    Policies
                  </span>
                ),
              },
              {
                key: 'ancillaries',
                label: (
                  <span>
                    <span className="mr-2">✈️</span>
                    Ancillaries
                  </span>
                ),
              },
              {
                key: 'discounts',
                label: (
                  <span>
                    <PercentageOutlined />
                    Discounts
                  </span>
                ),
              },
              {
                key: 'promocodes',
                label: (
                  <span>
                    <span className="mr-2">🎟️</span>
                    Promo Codes
                  </span>
                ),
              },
              {
                key: 'offers',
                label: (
                  <span>
                    <GiftOutlined />
                    Offers
                  </span>
                ),
              },
            ]}
          />

          {/* Tab Content */}
          {activeTab === 'dashboard' && renderDashboardContent()}
          {activeTab === 'policies' && (
            <div>
              {/* Header with Search and Create Button */}
              <div className="mb-6 flex justify-between items-center">
                <Input
                  placeholder="Search policies..."
                  prefix={<SearchOutlined className="text-gray-400" />}
                  className="max-w-md"
                  size="large"
                />
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  size="large"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setIsModalVisible(true)}
                >
                  Create Policy
                </Button>
              </div>

              {/* Pricing Policies Section */}
              <Card className="mb-6">
                <div className="mb-6">
                  <Title level={4} className="!mb-1">Pricing Policies</Title>
                  <Text className="text-gray-500">Manage pricing policies for ancillaries and offers</Text>
                </div>

                <Table
                  dataSource={[
                    {
                      key: '1',
                      policyName: 'Premium Member Refund Policy',
                      type: 'Refund',
                      target: 'Ancillary: Premium Seats',
                      priceEffect: '0%',
                      status: 'Active'
                    },
                    {
                      key: '2',
                      policyName: 'Holiday Surge Pricing',
                      type: 'Pricing',
                      target: 'Offer: All Offers\nRoutes: LAX-JFK, ORD-LHR',
                      priceEffect: '+25%',
                      status: 'Active'
                    }
                  ]}
                  columns={[
                    {
                      title: 'Policy Name',
                      dataIndex: 'policyName',
                      key: 'policyName',
                      render: (text) => <Text className="font-medium">{text}</Text>
                    },
                    {
                      title: 'Type',
                      dataIndex: 'type',
                      key: 'type',
                      render: (type) => (
                        <Tag color={type === 'Refund' ? 'blue' : 'green'} className="rounded-md">
                          {type}
                        </Tag>
                      )
                    },
                    {
                      title: 'Target',
                      dataIndex: 'target',
                      key: 'target',
                      render: (text) => (
                        <div className="text-sm">
                          {text.split('\n').map((line, index) => (
                            <div key={index} className="text-gray-600">{line}</div>
                          ))}
                        </div>
                      )
                    },
                    {
                      title: 'Price Effect',
                      dataIndex: 'priceEffect',
                      key: 'priceEffect',
                      render: (effect) => (
                        <Text className={effect === '0%' ? 'text-green-600' : 'text-red-600'} strong>
                          {effect}
                        </Text>
                      )
                    },
                    {
                      title: 'Status',
                      dataIndex: 'status',
                      key: 'status',
                      render: (status) => (
                        <Tag color="blue" className="rounded-md">
                          {status}
                        </Tag>
                      )
                    },
                    {
                      title: 'Actions',
                      key: 'actions',
                      render: (_, record) => (
                        <Space>
                          <Button
                            type="text"
                            icon={<EditOutlined />}
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() => {
                              setEditingOffer(record);
                              setIsModalVisible(true);
                            }}
                          />
                          <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            className="text-red-600 hover:text-red-700"
                          />
                        </Space>
                      )
                    }
                  ]}
                  pagination={false}
                  className="custom-table"
                />
              </Card>
            </div>
          )}
          {activeTab === 'ancillaries' && (
            <div>
              {/* Header with Search and Add Button */}
              <div className="mb-6 flex justify-between items-center">
                <Input
                  placeholder="Search ancillaries..."
                  prefix={<SearchOutlined className="text-gray-400" />}
                  className="max-w-md"
                  size="large"
                />
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  size="large"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setIsModalVisible(true)}
                >
                  Add Ancillary
                </Button>
              </div>

              {/* Ancillary Services Section */}
              <Card className="mb-6">
                <div className="mb-6">
                  <Title level={4} className="!mb-1">Ancillary Services</Title>
                  <Text className="text-gray-500">Manage your ancillary services and pricing</Text>
                </div>

                <div className="space-y-4">
                  {/* Extra Leg Room Seat */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Title level={4} className="!mb-0">Extra Leg Room Seat</Title>
                          <Tag color="blue" className="rounded-md">Seat</Tag>
                          <Tag color="default" className="rounded-md">optional</Tag>
                          <Tag color="blue" className="rounded-md">Active</Tag>
                        </div>
                        <Text className="text-gray-600 block mb-4">
                          Additional 6 inches of legroom for enhanced comfort during your flight.
                        </Text>
                      </div>
                      <Space>
                        <Button
                          type="text"
                          icon={<EditOutlined />}
                          className="text-blue-600 hover:text-blue-700"
                        />
                        <Button
                          type="text"
                          icon={<EyeOutlined />}
                          className="text-gray-600 hover:text-gray-700"
                        />
                        <Button
                          type="text"
                          icon={<DeleteOutlined />}
                          className="text-red-600 hover:text-red-700"
                        />
                      </Space>
                    </div>

                    <Row gutter={[32, 16]} className="mb-4">
                      <Col xs={24} sm={6}>
                        <div>
                          <Text className="text-gray-500 text-sm block">Base Price</Text>
                          <Text className="text-green-600 font-bold text-lg">$45</Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={6}>
                        <div>
                          <Text className="text-gray-500 text-sm block">Availability</Text>
                          <Text className="font-medium">Flight dependent</Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={6}>
                        <div>
                          <Text className="text-gray-500 text-sm block">Bundle Compatible</Text>
                          <Text className="font-medium">Yes</Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={6}>
                        <div>
                          <Text className="text-gray-500 text-sm block">Conversion Rate</Text>
                          <Text className="text-blue-600 font-bold">45.2%</Text>
                        </div>
                      </Col>
                    </Row>

                    <Row gutter={[32, 16]} className="mb-4">
                      <Col xs={24} sm={6}>
                        <div>
                          <Text className="text-gray-500 text-sm block">Total Bookings</Text>
                          <Text className="font-bold text-lg">15,420</Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={6}>
                        <div>
                          <Text className="text-gray-500 text-sm block">Revenue</Text>
                          <Text className="text-green-600 font-bold text-lg">$693,900</Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={12}>
                        <div>
                          <Text className="text-gray-500 text-sm block">Growth</Text>
                          <div className="flex items-center space-x-1">
                            <RiseOutlined className="text-green-600 text-sm" />
                            <Text className="text-green-600 font-bold">+22.7%</Text>
                          </div>
                        </div>
                      </Col>
                    </Row>

                    <div className="text-sm text-gray-500">
                      <Text>Created: Jan 15, 2024</Text>
                      <Text className="ml-6">Last Modified: Feb 28, 2024</Text>
                    </div>
                  </div>

                  {/* Premium Meal Service */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Title level={4} className="!mb-0">Premium Meal Service</Title>
                          <Tag color="orange" className="rounded-md">Food & Beverage</Tag>
                          <Tag color="default" className="rounded-md">optional</Tag>
                          <Tag color="blue" className="rounded-md">Active</Tag>
                        </div>
                        <Text className="text-gray-600 block mb-4">
                          Gourmet meal prepared by renowned chefs with dietary options available.
                        </Text>
                      </div>
                      <Space>
                        <Button
                          type="text"
                          icon={<EditOutlined />}
                          className="text-blue-600 hover:text-blue-700"
                        />
                        <Button
                          type="text"
                          icon={<EyeOutlined />}
                          className="text-gray-600 hover:text-gray-700"
                        />
                        <Button
                          type="text"
                          icon={<DeleteOutlined />}
                          className="text-red-600 hover:text-red-700"
                        />
                      </Space>
                    </div>

                    <Row gutter={[32, 16]} className="mb-4">
                      <Col xs={24} sm={6}>
                        <div>
                          <Text className="text-gray-500 text-sm block">Base Price</Text>
                          <Text className="text-green-600 font-bold text-lg">$28</Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={6}>
                        <div>
                          <Text className="text-gray-500 text-sm block">Availability</Text>
                          <Text className="font-medium">All flights</Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={6}>
                        <div>
                          <Text className="text-gray-500 text-sm block">Bundle Compatible</Text>
                          <Text className="font-medium">Yes</Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={6}>
                        <div>
                          <Text className="text-gray-500 text-sm block">Conversion Rate</Text>
                          <Text className="text-blue-600 font-bold">38.7%</Text>
                        </div>
                      </Col>
                    </Row>

                    <Row gutter={[32, 16]} className="mb-4">
                      <Col xs={24} sm={6}>
                        <div>
                          <Text className="text-gray-500 text-sm block">Total Bookings</Text>
                          <Text className="font-bold text-lg">23,450</Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={6}>
                        <div>
                          <Text className="text-gray-500 text-sm block">Revenue</Text>
                          <Text className="text-green-600 font-bold text-lg">$657,260</Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={12}>
                        <div>
                          <Text className="text-gray-500 text-sm block">Growth</Text>
                          <div className="flex items-center space-x-1">
                            <RiseOutlined className="text-green-600 text-sm" />
                            <Text className="text-green-600 font-bold">+18.3%</Text>
                          </div>
                        </div>
                      </Col>
                    </Row>

                    <div className="text-sm text-gray-500">
                      <Text>Created: Jan 10, 2024</Text>
                      <Text className="ml-6">Last Modified: Mar 01, 2024</Text>
                    </div>
                  </div>

                  {/* Priority Boarding */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Title level={4} className="!mb-0">Priority Boarding</Title>
                          <Tag color="purple" className="rounded-md">Service</Tag>
                          <Tag color="default" className="rounded-md">optional</Tag>
                          <Tag color="blue" className="rounded-md">Active</Tag>
                        </div>
                        <Text className="text-gray-600 block mb-4">
                          Board the aircraft in the first group to secure overhead bin space.
                        </Text>
                      </div>
                      <Space>
                        <Button
                          type="text"
                          icon={<EditOutlined />}
                          className="text-blue-600 hover:text-blue-700"
                        />
                        <Button
                          type="text"
                          icon={<EyeOutlined />}
                          className="text-gray-600 hover:text-gray-700"
                        />
                        <Button
                          type="text"
                          icon={<DeleteOutlined />}
                          className="text-red-600 hover:text-red-700"
                        />
                      </Space>
                    </div>

                    <Row gutter={[32, 16]} className="mb-4">
                      <Col xs={24} sm={6}>
                        <div>
                          <Text className="text-gray-500 text-sm block">Base Price</Text>
                          <Text className="text-green-600 font-bold text-lg">$15</Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={6}>
                        <div>
                          <Text className="text-gray-500 text-sm block">Availability</Text>
                          <Text className="font-medium">All flights</Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={6}>
                        <div>
                          <Text className="text-gray-500 text-sm block">Bundle Compatible</Text>
                          <Text className="font-medium">Yes</Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={6}>
                        <div>
                          <Text className="text-gray-500 text-sm block">Conversion Rate</Text>
                          <Text className="text-blue-600 font-bold">42.8%</Text>
                        </div>
                      </Col>
                    </Row>

                    <Row gutter={[32, 16]} className="mb-4">
                      <Col xs={24} sm={6}>
                        <div>
                          <Text className="text-gray-500 text-sm block">Total Bookings</Text>
                          <Text className="font-bold text-lg">34,560</Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={6}>
                        <div>
                          <Text className="text-gray-500 text-sm block">Revenue</Text>
                          <Text className="text-green-600 font-bold text-lg">$518,400</Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={12}>
                        <div>
                          <Text className="text-gray-500 text-sm block">Growth</Text>
                          <div className="flex items-center space-x-1">
                            <RiseOutlined className="text-green-600 text-sm" />
                            <Text className="text-green-600 font-bold">+15.9%</Text>
                          </div>
                        </div>
                      </Col>
                    </Row>

                    <div className="text-sm text-gray-500">
                      <Text>Created: Jan 08, 2024</Text>
                      <Text className="ml-6">Last Modified: Feb 15, 2024</Text>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
          {activeTab === 'discounts' && (
            <div>
              {/* Header with Search and Create Button */}
              <div className="mb-6 flex justify-between items-center">
                <Input
                  placeholder="Search discounts..."
                  prefix={<SearchOutlined className="text-gray-400" />}
                  className="max-w-md"
                  size="large"
                />
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  size="large"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setIsModalVisible(true)}
                >
                  Create Discount
                </Button>
              </div>

              {/* Discount Management Section */}
              <Card className="mb-6">
                <div className="mb-6">
                  <Title level={4} className="!mb-1">Discount Management</Title>
                  <Text className="text-gray-500">Manage discount rules with advanced targeting and combinability options</Text>
                </div>

                <Table
                  dataSource={[
                    {
                      key: '1',
                      discountName: 'Early Bird Special',
                      code: 'EARLY20',
                      description: 'Book 30 days in advance and save 20%',
                      type: 'Percentage',
                      value: '20%',
                      target: 'Ancillaries',
                      targetDetails: 'Extra Leg Room Seat, Premium Meal Service',
                      usage: '1247/5000',
                      usagePercentage: 25,
                      validFrom: 'Jan 01, 2024',
                      validTo: 'Dec 31, 2024',
                      status: 'Active'
                    },
                    {
                      key: '2',
                      discountName: 'Loyalty Member Discount',
                      code: 'LOYALTY15',
                      description: 'Exclusive discount for premium members',
                      type: 'Percentage',
                      value: '15%',
                      target: 'Both',
                      targetDetails: 'All Services',
                      usage: '892/3000',
                      usagePercentage: 30,
                      validFrom: 'Jan 01, 2024',
                      validTo: 'Dec 31, 2024',
                      status: 'Active'
                    }
                  ]}
                  columns={[
                    {
                      title: 'Discount Details',
                      dataIndex: 'discountName',
                      key: 'discountName',
                      width: '25%',
                      render: (text, record) => (
                        <div>
                          <Text className="font-semibold text-gray-900 block">{text}</Text>
                          <Text className="text-blue-600 text-sm font-medium block">Code: {record.code}</Text>
                          <Text className="text-gray-600 text-sm">{record.description}</Text>
                        </div>
                      )
                    },
                    {
                      title: 'Type & Value',
                      key: 'typeValue',
                      width: '15%',
                      render: (_, record) => (
                        <div className="text-center">
                          <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg mb-2">
                            <Text className="font-bold text-lg">{record.value}</Text>
                          </div>
                          <Text className="text-gray-600 text-sm">{record.type}</Text>
                        </div>
                      )
                    },
                    {
                      title: 'Target',
                      key: 'target',
                      width: '15%',
                      render: (_, record) => (
                        <div>
                          <Tag 
                            color={record.target === 'Ancillaries' ? 'blue' : record.target === 'Both' ? 'purple' : 'green'} 
                            className="rounded-md mb-2"
                          >
                            {record.target}
                          </Tag>
                          <Text className="text-gray-600 text-xs block">{record.targetDetails}</Text>
                        </div>
                      )
                    },
                    {
                      title: 'Usage',
                      key: 'usage',
                      width: '12%',
                      render: (_, record) => (
                        <div>
                          <Text className="font-semibold block">{record.usage}</Text>
                          <Progress 
                            percent={record.usagePercentage} 
                            strokeColor="#1890ff" 
                            showInfo={false} 
                            size="small" 
                            className="mb-1"
                          />
                          <Text className="text-gray-500 text-xs">{record.usagePercentage}% used</Text>
                        </div>
                      )
                    },
                    {
                      title: 'Validity',
                      key: 'validity',
                      width: '15%',
                      render: (_, record) => (
                        <div className="text-sm">
                          <div className="mb-1">
                            <Text className="text-gray-500 text-xs">From:</Text>
                            <Text className="block">{record.validFrom}</Text>
                          </div>
                          <div>
                            <Text className="text-gray-500 text-xs">To:</Text>
                            <Text className="block">{record.validTo}</Text>
                          </div>
                        </div>
                      )
                    },
                    {
                      title: 'Status',
                      dataIndex: 'status',
                      key: 'status',
                      width: '8%',
                      render: (status) => (
                        <Tag color="blue" className="rounded-md">
                          {status}
                        </Tag>
                      )
                    },
                    {
                      title: 'Actions',
                      key: 'actions',
                      width: '10%',
                      render: (_, record) => (
                        <Space>
                          <Button
                            type="text"
                            icon={<EditOutlined />}
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() => {
                              setEditingOffer(record);
                              setIsModalVisible(true);
                            }}
                          />
                          <Button
                            type="text"
                            icon={<EyeOutlined />}
                            className="text-gray-600 hover:text-gray-700"
                          />
                          <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            className="text-red-600 hover:text-red-700"
                          />
                        </Space>
                      )
                    }
                  ]}
                  pagination={false}
                  className="custom-table"
                />
              </Card>
            </div>
          )}
          {activeTab === 'promocodes' && (
            <div>
              {/* Header with Search and Create Button */}
              <div className="mb-6 flex justify-between items-center">
                <Input
                  placeholder="Search promo codes..."
                  prefix={<SearchOutlined className="text-gray-400" />}
                  className="max-w-md"
                  size="large"
                />
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  size="large"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setIsModalVisible(true)}
                >
                  Create Promo Code
                </Button>
              </div>

              {/* Promo Code Management Section */}
              <Card className="mb-6">
                <div className="mb-6">
                  <Title level={4} className="!mb-1">Promo Code Management</Title>
                  <Text className="text-gray-500">Manage promotional codes for marketing campaigns</Text>
                </div>

                <Table
                  dataSource={[
                    {
                      key: '1',
                      code: 'SUMMER2024',
                      name: 'Summer Vacation Deal',
                      description: 'Special summer promotion for vacation packages',
                      type: 'Percentage',
                      value: '25%',
                      maxValue: '$100',
                      usage: '456/2000',
                      usagePercentage: 23,
                      performance: '$89,400',
                      redemptionRate: '23% redemption',
                      status: 'Active'
                    },
                    {
                      key: '2',
                      code: 'BIZ15',
                      name: 'Business Traveler Promo',
                      description: 'Corporate discount for business travelers',
                      type: 'Percentage',
                      value: '15%',
                      maxValue: '$75',
                      usage: '234/1500',
                      usagePercentage: 16,
                      performance: '$45,600',
                      redemptionRate: '16% redemption',
                      status: 'Active'
                    }
                  ]}
                  columns={[
                    {
                      title: 'Code',
                      dataIndex: 'code',
                      key: 'code',
                      width: '12%',
                      render: (text) => (
                        <div className="flex items-center space-x-2">
                          <Text className="font-mono bg-gray-100 px-2 py-1 rounded font-semibold">{text}</Text>
                          <Button 
                            type="text" 
                            size="small" 
                            icon={<span className="text-gray-400">📋</span>}
                            className="hover:bg-gray-50"
                          />
                        </div>
                      )
                    },
                    {
                      title: 'Name',
                      key: 'name',
                      width: '20%',
                      render: (_, record) => (
                        <div>
                          <Text className="font-semibold text-gray-900 block">{record.name}</Text>
                          <Text className="text-gray-600 text-sm">{record.description}</Text>
                        </div>
                      )
                    },
                    {
                      title: 'Type',
                      dataIndex: 'type',
                      key: 'type',
                      width: '10%',
                      render: (type) => (
                        <Tag color="blue" className="rounded-md">
                          {type}
                        </Tag>
                      )
                    },
                    {
                      title: 'Value',
                      key: 'value',
                      width: '12%',
                      render: (_, record) => (
                        <div className="text-center">
                          <Text className="font-bold text-lg block">{record.value}</Text>
                          <Text className="text-gray-500 text-xs">Max: {record.maxValue}</Text>
                        </div>
                      )
                    },
                    {
                      title: 'Usage',
                      key: 'usage',
                      width: '15%',
                      render: (_, record) => (
                        <div>
                          <Text className="font-semibold block">{record.usage} used</Text>
                          <Progress 
                            percent={record.usagePercentage} 
                            strokeColor="#1890ff" 
                            showInfo={false} 
                            size="small" 
                            className="mb-1"
                          />
                        </div>
                      )
                    },
                    {
                      title: 'Performance',
                      key: 'performance',
                      width: '15%',
                      render: (_, record) => (
                        <div>
                          <Text className="font-bold text-lg text-green-600 block">{record.performance}</Text>
                          <Text className="text-gray-500 text-sm">{record.redemptionRate}</Text>
                        </div>
                      )
                    },
                    {
                      title: 'Status',
                      dataIndex: 'status',
                      key: 'status',
                      width: '8%',
                      render: (status) => (
                        <Tag color="blue" className="rounded-md">
                          {status}
                        </Tag>
                      )
                    },
                    {
                      title: 'Actions',
                      key: 'actions',
                      width: '8%',
                      render: (_, record) => (
                        <Space>
                          <Button
                            type="text"
                            icon={<EditOutlined />}
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() => {
                              setEditingOffer(record);
                              setIsModalVisible(true);
                            }}
                          />
                          <Button
                            type="text"
                            icon={<EyeOutlined />}
                            className="text-gray-600 hover:text-gray-700"
                          />
                          <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            className="text-red-600 hover:text-red-700"
                          />
                        </Space>
                      )
                    }
                  ]}
                  pagination={false}
                  className="custom-table"
                />
              </Card>
            </div>
          )}
          {activeTab === 'offers' && (
            <Card>
              <Title level={4}>Offers Management</Title>
              <Text>Design comprehensive offer packages combining multiple services.</Text>
            </Card>
          )}
        </div>
      </div>

      {/* Create Modal (Dynamic based on active tab) */}
      <Modal
        title={activeTab === 'policies' ? "Create New Policy" : activeTab === 'ancillaries' ? "Add New Ancillary" : activeTab === 'discounts' ? "Create New Discount" : activeTab === 'promocodes' ? "Create New Promo Code" : "Create New Item"}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingOffer(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
        className="custom-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            console.log(`${activeTab} values:`, values);
            setIsModalVisible(false);
            form.resetFields();
          }}
        >
          {activeTab === 'policies' ? (
            // Policy Form Fields
            <>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="Policy Name"
                    name="policyName"
                    rules={[{ required: true, message: 'Please enter policy name' }]}
                  >
                    <Input placeholder="Enter policy name" size="large" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Policy Type"
                    name="type"
                    rules={[{ required: true, message: 'Please select policy type' }]}
                  >
                    <Select placeholder="Select type" size="large">
                      <Select.Option value="refund">Refund</Select.Option>
                      <Select.Option value="pricing">Pricing</Select.Option>
                      <Select.Option value="cancellation">Cancellation</Select.Option>
                      <Select.Option value="modification">Modification</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Target"
                    name="target"
                    rules={[{ required: true, message: 'Please select target' }]}
                  >
                    <Select placeholder="Select target" size="large">
                      <Select.Option value="all-offers">All Offers</Select.Option>
                      <Select.Option value="premium-seats">Ancillary: Premium Seats</Select.Option>
                      <Select.Option value="meals">Ancillary: Meals</Select.Option>
                      <Select.Option value="baggage">Ancillary: Baggage</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Price Effect (%)"
                    name="priceEffect"
                    rules={[{ required: true, message: 'Please enter price effect' }]}
                  >
                    <InputNumber
                      placeholder="0"
                      size="large"
                      className="w-full"
                      min={-100}
                      max={100}
                      formatter={(value) => `${value}%`}
                      parser={(value) => value.replace('%', '')}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Status"
                    name="status"
                    initialValue="active"
                  >
                    <Select size="large">
                      <Select.Option value="active">Active</Select.Option>
                      <Select.Option value="inactive">Inactive</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Description"
                name="description"
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Enter policy description..."
                />
              </Form.Item>
            </>
          ) : activeTab === 'discounts' ? (
            // Discount Form Fields
            <>
              <Row gutter={16}>
                <Col span={16}>
                  <Form.Item
                    label="Discount Name"
                    name="discountName"
                    rules={[{ required: true, message: 'Please enter discount name' }]}
                  >
                    <Input placeholder="Enter discount name" size="large" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Discount Code"
                    name="discountCode"
                    rules={[{ required: true, message: 'Please enter discount code' }]}
                  >
                    <Input placeholder="e.g. SAVE20" size="large" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Discount Type"
                    name="discountType"
                    rules={[{ required: true, message: 'Please select discount type' }]}
                  >
                    <Select placeholder="Select type" size="large">
                      <Select.Option value="percentage">Percentage</Select.Option>
                      <Select.Option value="fixed">Fixed Amount</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Discount Value"
                    name="discountValue"
                    rules={[{ required: true, message: 'Please enter discount value' }]}
                  >
                    <InputNumber
                      placeholder="0"
                      size="large"
                      className="w-full"
                      min={0}
                      max={100}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Target"
                    name="target"
                    rules={[{ required: true, message: 'Please select target' }]}
                  >
                    <Select placeholder="Select target" size="large">
                      <Select.Option value="ancillaries">Ancillaries</Select.Option>
                      <Select.Option value="offers">Offers</Select.Option>
                      <Select.Option value="both">Both</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Usage Limit"
                    name="usageLimit"
                    rules={[{ required: true, message: 'Please enter usage limit' }]}
                  >
                    <InputNumber
                      placeholder="e.g. 5000"
                      size="large"
                      className="w-full"
                      min={1}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Valid From"
                    name="validFrom"
                    rules={[{ required: true, message: 'Please select start date' }]}
                  >
                    <DatePicker
                      size="large"
                      className="w-full"
                      format="MMM DD, YYYY"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Valid To"
                    name="validTo"
                    rules={[{ required: true, message: 'Please select end date' }]}
                  >
                    <DatePicker
                      size="large"
                      className="w-full"
                      format="MMM DD, YYYY"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: 'Please enter description' }]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Enter discount description..."
                />
              </Form.Item>
            </>
          ) : activeTab === 'ancillaries' ? (
            // Ancillary Form Fields
            <>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="Service Name"
                    name="serviceName"
                    rules={[{ required: true, message: 'Please enter service name' }]}
                  >
                    <Input placeholder="Enter service name" size="large" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Category"
                    name="category"
                    rules={[{ required: true, message: 'Please select category' }]}
                  >
                    <Select placeholder="Select category" size="large">
                      <Select.Option value="seat">Seat</Select.Option>
                      <Select.Option value="food-beverage">Food & Beverage</Select.Option>
                      <Select.Option value="service">Service</Select.Option>
                      <Select.Option value="baggage">Baggage</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Base Price ($)"
                    name="basePrice"
                    rules={[{ required: true, message: 'Please enter base price' }]}
                  >
                    <InputNumber
                      placeholder="0"
                      size="large"
                      className="w-full"
                      min={0}
                      formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Availability"
                    name="availability"
                    rules={[{ required: true, message: 'Please select availability' }]}
                  >
                    <Select placeholder="Select availability" size="large">
                      <Select.Option value="all-flights">All flights</Select.Option>
                      <Select.Option value="flight-dependent">Flight dependent</Select.Option>
                      <Select.Option value="route-specific">Route specific</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Bundle Compatible"
                    name="bundleCompatible"
                    valuePropName="checked"
                    initialValue={true}
                  >
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: 'Please enter description' }]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Enter service description..."
                />
              </Form.Item>
            </>
          ) : activeTab === 'promocodes' ? (
            // Promo Code Form Fields
            <>
              <Row gutter={16}>
                <Col span={16}>
                  <Form.Item
                    label="Promo Code Name"
                    name="promoCodeName"
                    rules={[{ required: true, message: 'Please enter promo code name' }]}
                  >
                    <Input placeholder="Enter promo code name" size="large" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Code"
                    name="promoCode"
                    rules={[{ required: true, message: 'Please enter promo code' }]}
                  >
                    <Input placeholder="e.g. SUMMER2024" size="large" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Type"
                    name="promoType"
                    rules={[{ required: true, message: 'Please select promo type' }]}
                  >
                    <Select placeholder="Select type" size="large">
                      <Select.Option value="percentage">Percentage</Select.Option>
                      <Select.Option value="fixed">Fixed Amount</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Value"
                    name="promoValue"
                    rules={[{ required: true, message: 'Please enter promo value' }]}
                  >
                    <InputNumber
                      placeholder="0"
                      size="large"
                      className="w-full"
                      min={0}
                      max={100}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Max Value ($)"
                    name="maxValue"
                    rules={[{ required: true, message: 'Please enter max value' }]}
                  >
                    <InputNumber
                      placeholder="e.g. 100"
                      size="large"
                      className="w-full"
                      min={0}
                      formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Usage Limit"
                    name="usageLimit"
                    rules={[{ required: true, message: 'Please enter usage limit' }]}
                  >
                    <InputNumber
                      placeholder="e.g. 2000"
                      size="large"
                      className="w-full"
                      min={1}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Valid From"
                    name="validFrom"
                    rules={[{ required: true, message: 'Please select start date' }]}
                  >
                    <DatePicker
                      size="large"
                      className="w-full"
                      format="MMM DD, YYYY"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Valid To"
                    name="validTo"
                    rules={[{ required: true, message: 'Please select end date' }]}
                  >
                    <DatePicker
                      size="large"
                      className="w-full"
                      format="MMM DD, YYYY"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: 'Please enter description' }]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Enter promo code description..."
                />
              </Form.Item>
            </>
          ) : (
            // Default form for other tabs
            <div>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please enter name' }]}
              >
                <Input placeholder="Enter name" size="large" />
              </Form.Item>
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
              }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" className="bg-blue-600">
              {activeTab === 'policies' ? 'Create Policy' : activeTab === 'ancillaries' ? 'Add Ancillary' : activeTab === 'discounts' ? 'Create Discount' : activeTab === 'promocodes' ? 'Create Promo Code' : 'Create'}
            </Button>
          </div>
        </Form>
      </Modal>

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

        .custom-table .ant-table-thead > tr > th {
          background-color: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          font-weight: 600;
        }

        .custom-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid #f1f5f9;
        }

        .custom-table .ant-table-tbody > tr:hover > td {
          background-color: #f8fafc;
        }
      `}</style>
    </div>
  );
}