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
  Badge,
  Checkbox,
  Steps,
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
  TrophyOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AdminHeader from "./admin-header";
import AdminSidebar from "./admin-sidebar";
import CreateOfferModal from "../../components/admin/create-offer-modal";
import CreatePolicyModal from "../../components/admin/create-policy-modal";
import CreateAncillaryModal from "../../components/admin/create-ancillary-modal";
import CreateDiscountModal from "../../components/admin/create-discount-modal";
import CreatePromoCodeModal from "../../components/admin/create-promocode-modal";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export default function OfferManagement() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [policyModalStep, setPolicyModalStep] = useState(0);
  const loyaltyOptions = [
    {
      value: "bronze",
      label: "Bronze",
      bg: "bg-amber-50",
      border: "border-amber-200",
      hover: "hover:border-amber-300",
      text: "text-amber-800",
    },
    {
      value: "silver",
      label: "Silver",
      bg: "bg-gray-50",
      border: "border-gray-200",
      hover: "hover:border-gray-300",
      text: "text-gray-700",
    },
    {
      value: "gold",
      label: "Gold",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      hover: "hover:border-yellow-300",
      text: "text-yellow-800",
    },
    {
      value: "platinum",
      label: "Platinum",
      bg: "bg-slate-50",
      border: "border-slate-200",
      hover: "hover:border-slate-300",
      text: "text-slate-700",
    },
    {
      value: "diamond",
      label: "Diamond",
      bg: "bg-blue-50",
      border: "border-blue-200",
      hover: "hover:border-blue-300",
      text: "text-blue-800",
    },
  ];
  useEffect(() => {
    // Check if admin is logged in
    const isAdminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isAdminLoggedIn) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminUsername");
    navigate("/admin/login");
  };

  const renderDashboardContent = () => (
    <>
      {/* Overview/Insights/Recommendations Tabs */}
      <Card className="mb-6">
        <Tabs
          defaultActiveKey="overview"
          items={[
            {
              key: "overview",
              label: <span className="px-4 py-2">📊 Overview</span>,
              children: (
                <div>
                  {/* Stats Cards */}
                  <Row gutter={[24, 24]} className="mb-8">
                    <Col xs={24} sm={12} lg={4}>
                      <Card className="text-center">
                        <div className="mb-2">
                          <Text className="text-gray-500 text-sm">
                            Active Policies
                          </Text>
                        </div>
                        <Title level={3} className="!mb-0 text-blue-600">
                          12
                        </Title>
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={4}>
                      <Card className="text-center">
                        <div className="mb-2">
                          <Text className="text-gray-500 text-sm">
                            Ancillaries
                          </Text>
                        </div>
                        <Title level={3} className="!mb-0 text-green-600">
                          24
                        </Title>
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mx-auto mt-2">
                          <span className="text-green-600 text-xs">✓</span>
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={4}>
                      <Card className="text-center">
                        <div className="mb-2">
                          <Text className="text-gray-500 text-sm">
                            Active Discounts
                          </Text>
                        </div>
                        <Title level={3} className="!mb-0 text-purple-600">
                          8
                        </Title>
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mx-auto mt-2">
                          <PercentageOutlined className="text-purple-600 text-xs" />
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={4}>
                      <Card className="text-center">
                        <div className="mb-2">
                          <Text className="text-gray-500 text-sm">
                            Active Promo Codes
                          </Text>
                        </div>
                        <Title level={3} className="!mb-0 text-orange-600">
                          15
                        </Title>
                        <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mx-auto mt-2">
                          <span className="text-orange-600 text-xs">🎟️</span>
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={4}>
                      <Card className="text-center">
                        <div className="mb-2">
                          <Text className="text-gray-500 text-sm">
                            Active Offers
                          </Text>
                        </div>
                        <Title level={3} className="!mb-0 text-pink-600">
                          18
                        </Title>
                        <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center mx-auto mt-2">
                          <GiftOutlined className="text-pink-600 text-xs" />
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={4}>
                      <Card className="text-center">
                        <div className="mb-2">
                          <Text className="text-gray-500 text-sm">
                            Total Revenue
                          </Text>
                        </div>
                        <Title level={3} className="!mb-0 text-green-600">
                          $2450K
                        </Title>
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
                          <Title level={4} className="!mb-1">
                            Ancillary Performance & Usage
                          </Title>
                          <Text className="text-gray-500">
                            Detailed statistics based on customer usage and
                            revenue
                          </Text>
                        </div>

                        <div className="space-y-6">
                          <div className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                              <Title level={5} className="!mb-0">
                                Extra Leg Room Seat
                              </Title>
                              <div className="flex items-center text-green-600">
                                <RiseOutlined className="mr-1" />
                                <Text className="text-green-600">+22.7%</Text>
                              </div>
                            </div>
                            <Row gutter={[16, 16]}>
                              <Col span={12}>
                                <div>
                                  <Text className="text-gray-500 text-sm">
                                    Total Bookings
                                  </Text>
                                  <Text className="block font-semibold">
                                    15,420
                                  </Text>
                                </div>
                                <div className="mt-2">
                                  <Text className="text-gray-500 text-sm">
                                    Conversion Rate
                                  </Text>
                                  <Text className="block font-semibold">
                                    45.2%
                                  </Text>
                                  <Progress
                                    percent={45}
                                    strokeColor="#1890ff"
                                    showInfo={false}
                                    size="small"
                                  />
                                </div>
                              </Col>
                              <Col span={12}>
                                <div>
                                  <Text className="text-gray-500 text-sm">
                                    Revenue
                                  </Text>
                                  <Text className="block font-semibold text-green-600">
                                    $693,300
                                  </Text>
                                </div>
                                <div className="mt-2">
                                  <Text className="text-gray-500 text-sm">
                                    Satisfaction
                                  </Text>
                                  <Text className="block font-semibold">
                                    4.6/5
                                  </Text>
                                </div>
                              </Col>
                            </Row>
                          </div>

                          <div className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                              <Title level={5} className="!mb-0">
                                Premium Meal Service
                              </Title>
                              <div className="flex items-center text-green-600">
                                <RiseOutlined className="mr-1" />
                                <Text className="text-green-600">+18.3%</Text>
                              </div>
                            </div>
                            <Row gutter={[16, 16]}>
                              <Col span={12}>
                                <div>
                                  <Text className="text-gray-500 text-sm">
                                    Total Bookings
                                  </Text>
                                  <Text className="block font-semibold">
                                    23,450
                                  </Text>
                                </div>
                                <div className="mt-2">
                                  <Text className="text-gray-500 text-sm">
                                    Conversion Rate
                                  </Text>
                                  <Text className="block font-semibold">
                                    38.7%
                                  </Text>
                                  <Progress
                                    percent={39}
                                    strokeColor="#1890ff"
                                    showInfo={false}
                                    size="small"
                                  />
                                </div>
                              </Col>
                              <Col span={12}>
                                <div>
                                  <Text className="text-gray-500 text-sm">
                                    Revenue
                                  </Text>
                                  <Text className="block font-semibold text-green-600">
                                    $657,260
                                  </Text>
                                </div>
                                <div className="mt-2">
                                  <Text className="text-gray-500 text-sm">
                                    Satisfaction
                                  </Text>
                                  <Text className="block font-semibold">
                                    4.4/5
                                  </Text>
                                </div>
                              </Col>
                            </Row>
                          </div>

                          <div className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                              <Title level={5} className="!mb-0">
                                Priority Boarding
                              </Title>
                              <div className="flex items-center text-green-600">
                                <RiseOutlined className="mr-1" />
                                <Text className="text-green-600">+15.9%</Text>
                              </div>
                            </div>
                            <Row gutter={[16, 16]}>
                              <Col span={12}>
                                <div>
                                  <Text className="text-gray-500 text-sm">
                                    Total Bookings
                                  </Text>
                                  <Text className="block font-semibold">
                                    34,560
                                  </Text>
                                </div>
                                <div className="mt-2">
                                  <Text className="text-gray-500 text-sm">
                                    Conversion Rate
                                  </Text>
                                  <Text className="block font-semibold">
                                    42.8%
                                  </Text>
                                  <Progress
                                    percent={43}
                                    strokeColor="#1890ff"
                                    showInfo={false}
                                    size="small"
                                  />
                                </div>
                              </Col>
                              <Col span={12}>
                                <div>
                                  <Text className="text-gray-500 text-sm">
                                    Revenue
                                  </Text>
                                  <Text className="block font-semibold text-green-600">
                                    $518,400
                                  </Text>
                                </div>
                                <div className="mt-2">
                                  <Text className="text-gray-500 text-sm">
                                    Satisfaction
                                  </Text>
                                  <Text className="block font-semibold">
                                    4.7/5
                                  </Text>
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
                          <Title level={4} className="!mb-1">
                            Offer Performance & Usage
                          </Title>
                          <Text className="text-gray-500">
                            Comprehensive offer metrics and customer behavior
                          </Text>
                        </div>

                        <div className="space-y-6">
                          <div className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                              <Title level={5} className="!mb-0">
                                Business Traveler Offer
                              </Title>
                              <div className="flex items-center text-green-600">
                                <RiseOutlined className="mr-1" />
                                <Text className="text-green-600">+23.4%</Text>
                              </div>
                            </div>
                            <Text className="text-gray-500 text-sm">
                              BTO001
                            </Text>
                            <Row gutter={[16, 16]} className="mt-3">
                              <Col span={12}>
                                <div>
                                  <Text className="text-gray-500 text-sm">
                                    Adoption Rate
                                  </Text>
                                  <Text className="block font-semibold">
                                    34%
                                  </Text>
                                </div>
                                <div className="mt-2">
                                  <Text className="text-gray-500 text-sm">
                                    Total Orders
                                  </Text>
                                  <Text className="block font-semibold">
                                    2,450
                                  </Text>
                                </div>
                                <div className="mt-2">
                                  <Text className="text-gray-500 text-sm">
                                    Customer Satisfaction
                                  </Text>
                                  <Text className="block font-semibold">
                                    4.8/5
                                  </Text>
                                  <Progress
                                    percent={96}
                                    strokeColor="#52c41a"
                                    showInfo={false}
                                    size="small"
                                  />
                                </div>
                              </Col>
                              <Col span={12}>
                                <div>
                                  <Text className="text-gray-500 text-sm">
                                    Revenue
                                  </Text>
                                  <Text className="block font-semibold text-green-600">
                                    $134,000
                                  </Text>
                                </div>
                                <div className="mt-2">
                                  <Text className="text-gray-500 text-sm">
                                    Avg Value
                                  </Text>
                                  <Text className="block font-semibold">
                                    $547
                                  </Text>
                                </div>
                                <div className="mt-2">
                                  <Text className="text-gray-500 text-sm">
                                    Repeat Purchase
                                  </Text>
                                  <Text className="block font-semibold">
                                    67%
                                  </Text>
                                </div>
                              </Col>
                            </Row>
                          </div>

                          <div className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                              <Title level={5} className="!mb-0">
                                Family Fun Package
                              </Title>
                              <div className="flex items-center text-green-600">
                                <RiseOutlined className="mr-1" />
                                <Text className="text-green-600">+18.7%</Text>
                              </div>
                            </div>
                            <Text className="text-gray-500 text-sm">
                              FFP002
                            </Text>
                            <Row gutter={[16, 16]} className="mt-3">
                              <Col span={12}>
                                <div>
                                  <Text className="text-gray-500 text-sm">
                                    Adoption Rate
                                  </Text>
                                  <Text className="block font-semibold">
                                    28%
                                  </Text>
                                </div>
                                <div className="mt-2">
                                  <Text className="text-gray-500 text-sm">
                                    Total Orders
                                  </Text>
                                  <Text className="block font-semibold">
                                    1,890
                                  </Text>
                                </div>
                                <div className="mt-2">
                                  <Text className="text-gray-500 text-sm">
                                    Customer Satisfaction
                                  </Text>
                                  <Text className="block font-semibold">
                                    4.3/5
                                  </Text>
                                  <Progress
                                    percent={86}
                                    strokeColor="#52c41a"
                                    showInfo={false}
                                    size="small"
                                  />
                                </div>
                              </Col>
                              <Col span={12}>
                                <div>
                                  <Text className="text-gray-500 text-sm">
                                    Revenue
                                  </Text>
                                  <Text className="block font-semibold text-green-600">
                                    $98,000
                                  </Text>
                                </div>
                                <div className="mt-2">
                                  <Text className="text-gray-500 text-sm">
                                    Avg Value
                                  </Text>
                                  <Text className="block font-semibold">
                                    $519
                                  </Text>
                                </div>
                                <div className="mt-2">
                                  <Text className="text-gray-500 text-sm">
                                    Repeat Purchase
                                  </Text>
                                  <Text className="block font-semibold">
                                    45%
                                  </Text>
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
                        <Title level={4} className="!mb-1">
                          Top Converting Ancillary
                        </Title>
                        <Title level={3} className="!mb-1 text-green-600">
                          Extra Leg Room Seat
                        </Title>
                        <Text className="text-green-600">45.2%</Text>
                        <br />
                        <Text className="text-gray-500 text-sm">
                          Conversion Rate
                        </Text>
                      </Card>
                    </Col>
                    <Col xs={24} lg={8}>
                      <Card className="text-center">
                        <div className="mb-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                            <span className="text-blue-600 text-2xl">💰</span>
                          </div>
                        </div>
                        <Title level={4} className="!mb-1">
                          Highest Revenue Offer
                        </Title>
                        <Title level={3} className="!mb-1 text-blue-600">
                          Business Traveler Offer
                        </Title>
                        <Text className="text-blue-600">$134K</Text>
                        <br />
                        <Text className="text-gray-500 text-sm">
                          Total Revenue
                        </Text>
                      </Card>
                    </Col>
                    <Col xs={24} lg={8}>
                      <Card className="text-center">
                        <div className="mb-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                            <span className="text-purple-600 text-2xl">📈</span>
                          </div>
                        </div>
                        <Title level={4} className="!mb-1">
                          Fastest Growing
                        </Title>
                        <Title level={3} className="!mb-1 text-purple-600">
                          Extra Leg Room Seat
                        </Title>
                        <Text className="text-purple-600">+22.7%</Text>
                        <br />
                        <Text className="text-gray-500 text-sm">
                          Growth Rate
                        </Text>
                      </Card>
                    </Col>
                  </Row>
                </div>
              ),
            },
            {
              key: "insights",
              label: <span className="px-4 py-2">🔍 Insights</span>,
              children: (
                <div>
                  {/* Forecasting & Predictions Section */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-xs">🔮</span>
                      </div>
                      <Title level={4} className="!mb-0">
                        Forecasting & Predictions
                      </Title>
                    </div>
                    <Text className="text-gray-500 mb-6">
                      AI-powered forecasts and market trend analysis for
                      ancillaries and offers
                    </Text>

                    <Row gutter={[24, 24]} className="mb-8">
                      {/* Ancillary Revenue Forecasts */}
                      <Col xs={24} lg={12}>
                        <div>
                          <Title level={5} className="!mb-4">
                            Ancillary Revenue Forecasts
                          </Title>

                          {/* Premium Seat Upgrades */}
                          <Card className="mb-4" size="small">
                            <div className="flex justify-between items-center mb-3">
                              <Text className="font-semibold">
                                Premium Seat Upgrades
                              </Text>
                              <Text className="text-sm text-gray-500">
                                87% Confidence
                              </Text>
                            </div>
                            <Row gutter={16}>
                              <Col span={12}>
                                <div className="mb-2">
                                  <Text className="text-gray-500 text-sm">
                                    Current Revenue
                                  </Text>
                                  <Text className="block font-semibold">
                                    $45,000
                                  </Text>
                                </div>
                              </Col>
                              <Col span={12}>
                                <div className="mb-2">
                                  <Text className="text-gray-500 text-sm">
                                    Projected Revenue
                                  </Text>
                                  <Text className="block font-semibold">
                                    $298,000
                                  </Text>
                                </div>
                              </Col>
                            </Row>
                            <div className="flex items-center space-x-1 mt-2">
                              <RiseOutlined className="text-green-600 text-xs" />
                              <Text className="text-green-600 text-sm">
                                +216% Next Quarter
                              </Text>
                            </div>
                            <div className="mt-3">
                              <Text className="font-medium text-sm">
                                Key Factors:
                              </Text>
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
                              <Text className="font-semibold">
                                Extra Baggage
                              </Text>
                              <Text className="text-sm text-gray-500">
                                84% Confidence
                              </Text>
                            </div>
                            <Row gutter={16}>
                              <Col span={12}>
                                <div className="mb-2">
                                  <Text className="text-gray-500 text-sm">
                                    Current Revenue
                                  </Text>
                                  <Text className="block font-semibold">
                                    $185,000
                                  </Text>
                                </div>
                              </Col>
                              <Col span={12}>
                                <div className="mb-2">
                                  <Text className="text-gray-500 text-sm">
                                    Projected Revenue
                                  </Text>
                                  <Text className="block font-semibold">
                                    $215,000
                                  </Text>
                                </div>
                              </Col>
                            </Row>
                            <div className="flex items-center space-x-1 mt-2">
                              <RiseOutlined className="text-green-600 text-xs" />
                              <Text className="text-green-600 text-sm">
                                +16.2% Next Quarter
                              </Text>
                            </div>
                            <div className="mt-3">
                              <Text className="font-medium text-sm">
                                Key Factors:
                              </Text>
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
                              <Text className="font-semibold">
                                In-Flight Meals
                              </Text>
                              <Text className="text-sm text-gray-500">
                                81% Confidence
                              </Text>
                            </div>
                            <Row gutter={16}>
                              <Col span={12}>
                                <div className="mb-2">
                                  <Text className="text-gray-500 text-sm">
                                    Current Revenue
                                  </Text>
                                  <Text className="block font-semibold">
                                    $156,000
                                  </Text>
                                </div>
                              </Col>
                              <Col span={12}>
                                <div className="mb-2">
                                  <Text className="text-gray-500 text-sm">
                                    Projected Revenue
                                  </Text>
                                  <Text className="block font-semibold">
                                    $187,000
                                  </Text>
                                </div>
                              </Col>
                            </Row>
                            <div className="flex items-center space-x-1 mt-2">
                              <RiseOutlined className="text-green-600 text-xs" />
                              <Text className="text-green-600 text-sm">
                                +19.9% Next Quarter
                              </Text>
                            </div>
                            <div className="mt-3">
                              <Text className="font-medium text-sm">
                                Key Factors:
                              </Text>
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
                          <Title level={5} className="!mb-4">
                            Offer Performance Predictions
                          </Title>

                          {/* Business Traveler Package */}
                          <Card className="mb-4" size="small">
                            <div className="flex justify-between items-center mb-3">
                              <Text className="font-semibold">
                                Business Traveler Package
                              </Text>
                              <Text className="text-sm text-gray-500">
                                89% Confidence
                              </Text>
                            </div>
                            <Row gutter={16}>
                              <Col span={12}>
                                <div className="mb-2">
                                  <Text className="text-gray-500 text-sm">
                                    Current Adoption
                                  </Text>
                                  <Text className="block font-semibold">
                                    34%
                                  </Text>
                                </div>
                                <div>
                                  <Text className="text-gray-500 text-sm">
                                    Current Revenue
                                  </Text>
                                  <Text className="block font-semibold">
                                    $145,000
                                  </Text>
                                </div>
                              </Col>
                              <Col span={12}>
                                <div className="mb-2">
                                  <Text className="text-gray-500 text-sm">
                                    Projected Adoption
                                  </Text>
                                  <Text className="block font-semibold">
                                    42%
                                  </Text>
                                </div>
                                <div>
                                  <Text className="text-gray-500 text-sm">
                                    Projected Revenue
                                  </Text>
                                  <Text className="block font-semibold">
                                    $178,000
                                  </Text>
                                </div>
                              </Col>
                            </Row>
                            <div className="flex items-center space-x-1 mt-2">
                              <RiseOutlined className="text-green-600 text-xs" />
                              <Text className="text-green-600 text-sm">
                                +22.8% Growth Expected
                              </Text>
                            </div>
                            <div className="mt-3 p-2 bg-green-50 rounded">
                              <Text className="text-green-700 text-xs">
                                💡 Increase marketing spend during Q1 business
                                travel peak
                              </Text>
                            </div>
                          </Card>

                          {/* Family Fun Bundle */}
                          <Card size="small">
                            <div className="flex justify-between items-center mb-3">
                              <Text className="font-semibold">
                                Family Fun Bundle
                              </Text>
                              <Text className="text-sm text-gray-500">
                                82% Confidence
                              </Text>
                            </div>
                            <Row gutter={16}>
                              <Col span={12}>
                                <div className="mb-2">
                                  <Text className="text-gray-500 text-sm">
                                    Current Adoption
                                  </Text>
                                  <Text className="block font-semibold">
                                    28%
                                  </Text>
                                </div>
                                <div>
                                  <Text className="text-gray-500 text-sm">
                                    Current Revenue
                                  </Text>
                                  <Text className="block font-semibold">
                                    $98,000
                                  </Text>
                                </div>
                              </Col>
                              <Col span={12}>
                                <div className="mb-2">
                                  <Text className="text-gray-500 text-sm">
                                    Projected Adoption
                                  </Text>
                                  <Text className="block font-semibold">
                                    36%
                                  </Text>
                                </div>
                                <div>
                                  <Text className="text-gray-500 text-sm">
                                    Projected Revenue
                                  </Text>
                                  <Text className="block font-semibold">
                                    $127,000
                                  </Text>
                                </div>
                              </Col>
                            </Row>
                            <div className="flex items-center space-x-1 mt-2">
                              <RiseOutlined className="text-green-600 text-xs" />
                              <Text className="text-green-600 text-sm">
                                +29.6% Growth Expected
                              </Text>
                            </div>
                            <div className="mt-3 p-2 bg-yellow-50 rounded">
                              <Text className="text-yellow-700 text-xs">
                                🎯 Target summer vacation bookings with enhanced
                                family amenities
                              </Text>
                            </div>
                          </Card>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  {/* Market Trends Analysis */}
                  <div>
                    <Title level={5} className="!mb-4">
                      Market Trends Analysis
                    </Title>
                    <Row gutter={[24, 24]}>
                      <Col xs={24} lg={12}>
                        <Card size="small">
                          <div className="flex justify-between items-center mb-3">
                            <Text className="font-semibold">
                              {" "}
                              Sustainable Travel Preference
                            </Text>
                            <Badge className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                              High Impact
                            </Badge>
                          </div>
                          <Text className="text-gray-600 text-sm mb-3">
                            Increasing customer demand for eco-friendly travel
                            options and carbon offset programs
                          </Text>
                          <div className="mb-3">
                            <Text className="font-medium text-sm">
                              Affected Services:
                            </Text>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                                Carbon Offsets
                              </Badge>
                              <Badge className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                                Eco-Friendly Meals
                              </Badge>
                              <Badge className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                                Sustainable Amenities
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RiseOutlined className="text-green-600 text-xs" />
                            <Text className="text-green-600 text-sm">
                              +45% Expected Growth
                            </Text>
                          </div>
                        </Card>
                      </Col>
                      <Col xs={24} lg={12}>
                        <Card size="small">
                          <div className="flex justify-between items-center mb-3">
                            <Text className="font-semibold">
                              Premium Experience Demand
                            </Text>
                            <Badge className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">
                              Medium Impact
                            </Badge>
                          </div>
                          <Text className="text-gray-600 text-sm mb-3">
                            Post-pandemic shift towards premium services and
                            contactless experiences
                          </Text>
                          <div className="mb-3">
                            <Text className="font-medium text-sm">
                              Affected Services:
                            </Text>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                                Premium Seats
                              </Badge>
                              <Badge className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                                Priority Boarding
                              </Badge>
                              <Badge className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                                Lounge Access
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RiseOutlined className="text-green-600 text-xs" />
                            <Text className="text-green-600 text-sm">
                              +28% Expected Growth
                            </Text>
                          </div>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                </div>
              ),
            },
            {
              key: "recommendations",
              label: (
                <span className="px-4 py-2">💡 Offer Recommendations</span>
              ),
              children: (
                <div>
                  {/* AI-Generated Offer Recommendations */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-yellow-600 text-xs">💡</span>
                      </div>
                      <Title level={4} className="!mb-0">
                        AI-Generated Offer Recommendations
                      </Title>
                    </div>
                    <Text className="text-gray-500 mb-6">
                      Intelligent offer suggestions based on market analysis,
                      customer behavior, and revenue optimization
                    </Text>

                    <Row gutter={[24, 24]}>
                      {/* Executive Business Bundle */}
                      <Col xs={24} lg={12}>
                        <Card className="h-full">
                          <div className="flex justify-between items-center mb-4">
                            <Title level={5} className="!mb-0">
                              Executive Business Bundle
                            </Title>
                            <Text className="text-sm text-gray-500">
                              87% Confidence
                            </Text>
                          </div>
                          <div className="mb-4">
                            <Text className="text-blue-600 font-medium text-sm">
                              Target: Business Travelers
                            </Text>
                            <Text className="text-gray-600 text-sm mt-1">
                              Comprehensive package for frequent business
                              travelers seeking efficiency and comfort
                            </Text>
                          </div>

                          <div className="mb-4">
                            <Title level={6} className="!mb-3">
                              Package Components
                            </Title>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="text-green-600">✓</span>
                                  <Text className="text-sm">
                                    Priority Check-in
                                  </Text>
                                </div>
                                <Text className="text-sm font-medium">$25</Text>
                              </div>
                              <div className="flex justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="text-green-600">✓</span>
                                  <Text className="text-sm">
                                    Business Class Seat
                                  </Text>
                                </div>
                                <Text className="text-sm font-medium">
                                  $150
                                </Text>
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
                                  <Text className="text-sm">
                                    Fast Track Security
                                  </Text>
                                </div>
                                <Text className="text-sm font-medium">$20</Text>
                              </div>
                            </div>
                          </div>

                          <div className="border-t pt-4 mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <Text className="text-gray-500">
                                Individual Total
                              </Text>
                              <Text className="font-medium">$270</Text>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                              <Text className="text-gray-500">
                                Recommended Price
                              </Text>
                              <Text className="font-medium">$220</Text>
                            </div>
                            <div className="flex justify-between items-center mb-3">
                              <Text className="text-green-600 font-medium">
                                Customer Saves: $50
                              </Text>
                              <Text className="text-blue-600 font-medium">
                                Margin: 35%
                              </Text>
                            </div>

                            <Row gutter={16} className="mb-3">
                              <Col span={12}>
                                <div className="text-center">
                                  <Text className="text-blue-600 font-bold text-xl">
                                    32%
                                  </Text>
                                  <Text className="text-gray-500 text-sm block">
                                    Expected Adoption
                                  </Text>
                                </div>
                              </Col>
                              <Col span={12}>
                                <div className="text-center">
                                  <Text className="text-green-600 font-bold text-xl">
                                    $145K
                                  </Text>
                                  <Text className="text-gray-500 text-sm block">
                                    Revenue Projection
                                  </Text>
                                </div>
                              </Col>
                            </Row>

                            <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                              <span>Break-even: 850 bookings</span>
                              <span>Confidence: 87%</span>
                            </div>
                          </div>

                          <div className="mb-4">
                            <Title level={6} className="!mb-2">
                              Why this offer?
                            </Title>
                            <Text className="text-gray-600 text-sm">
                              Analysis shows business travelers value
                              time-saving services and are willing to pay
                              premium for bundled convenience. Current market
                              gap in comprehensive business travel packages.
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
                            <Title level={5} className="!mb-0">
                              Family Adventure Pack
                            </Title>
                            <Text className="text-sm text-gray-500">
                              82% Confidence
                            </Text>
                          </div>
                          <div className="mb-4">
                            <Text className="text-purple-600 font-medium text-sm">
                              Target: Family Travelers
                            </Text>
                            <Text className="text-gray-600 text-sm mt-1">
                              Value-focused package designed for families
                              traveling with children
                            </Text>
                          </div>

                          <div className="mb-4">
                            <Title level={6} className="!mb-3">
                              Package Components
                            </Title>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="text-green-600">✓</span>
                                  <Text className="text-sm">
                                    Family Seating
                                  </Text>
                                </div>
                                <Text className="text-sm font-medium">$40</Text>
                              </div>
                              <div className="flex justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="text-green-600">✓</span>
                                  <Text className="text-sm">
                                    Kids Entertainment
                                  </Text>
                                </div>
                                <Text className="text-sm font-medium">$15</Text>
                              </div>
                              <div className="flex justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="text-green-600">✓</span>
                                  <Text className="text-sm">
                                    Family Meal Deal
                                  </Text>
                                </div>
                                <Text className="text-sm font-medium">$60</Text>
                              </div>
                              <div className="flex justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="text-green-600">✓</span>
                                  <Text className="text-sm">
                                    Extra Baggage Allowance
                                  </Text>
                                </div>
                                <Text className="text-sm font-medium">$35</Text>
                              </div>
                              <div className="flex justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="text-green-600">✓</span>
                                  <Text className="text-sm">
                                    Priority Boarding
                                  </Text>
                                </div>
                                <Text className="text-sm font-medium">$20</Text>
                              </div>
                            </div>
                          </div>

                          <div className="border-t pt-4 mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <Text className="text-gray-500">
                                Individual Total
                              </Text>
                              <Text className="font-medium">$170</Text>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                              <Text className="text-gray-500">
                                Recommended Price
                              </Text>
                              <Text className="font-medium">$135</Text>
                            </div>
                            <div className="flex justify-between items-center mb-3">
                              <Text className="text-green-600 font-medium">
                                Customer Saves: $35
                              </Text>
                              <Text className="text-blue-600 font-medium">
                                Margin: 28%
                              </Text>
                            </div>

                            <Row gutter={16} className="mb-3">
                              <Col span={12}>
                                <div className="text-center">
                                  <Text className="text-blue-600 font-bold text-xl">
                                    28%
                                  </Text>
                                  <Text className="text-gray-500 text-sm block">
                                    Expected Adoption
                                  </Text>
                                </div>
                              </Col>
                              <Col span={12}>
                                <div className="text-center">
                                  <Text className="text-green-600 font-bold text-xl">
                                    $98K
                                  </Text>
                                  <Text className="text-gray-500 text-sm block">
                                    Revenue Projection
                                  </Text>
                                </div>
                              </Col>
                            </Row>

                            <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                              <span>Break-even: 1200 bookings</span>
                              <span>Confidence: 82%</span>
                            </div>
                          </div>

                          <div className="mb-4">
                            <Title level={6} className="!mb-2">
                              Why this offer?
                            </Title>
                            <Text className="text-gray-600 text-sm">
                              Family travelers prioritize value and convenience.
                              Bundling family-specific services at a discount
                              increases adoption while maintaining healthy
                              margins.
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
      <AdminHeader />

      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar activeMenu="Offer Management" />

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
                key: "dashboard",
                label: (
                  <span>
                    <BarChartOutlined />
                    Dashboard
                  </span>
                ),
              },
              {
                key: "policies",
                label: (
                  <span>
                    <span className="mr-2">🛡️</span>
                    Policies
                  </span>
                ),
              },
              {
                key: "ancillaries",
                label: (
                  <span>
                    <span className="mr-2">✈️</span>
                    Ancillaries
                  </span>
                ),
              },
              {
                key: "discounts",
                label: (
                  <span>
                    <PercentageOutlined />
                    Discounts
                  </span>
                ),
              },
              {
                key: "promocodes",
                label: (
                  <span>
                    <span className="mr-2">🎟️</span>
                    Promo Codes
                  </span>
                ),
              },
              {
                key: "offers",
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
          {activeTab === "dashboard" && renderDashboardContent()}
          {activeTab === "policies" && (
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
                  <Title level={4} className="!mb-1">
                    Pricing Policies
                  </Title>
                  <Text className="text-gray-500">
                    Manage pricing policies for ancillaries and offers
                  </Text>
                </div>

                <Table
                  dataSource={[
                    {
                      key: "1",
                      policyName: "Premium Member Refund Policy",
                      type: "Refund",
                      target: "Ancillary: Premium Seats",
                      priceEffect: "0%",
                      status: "Active",
                    },
                    {
                      key: "2",
                      policyName: "Holiday Surge Pricing",
                      type: "Pricing",
                      target: "Offer: All Offers\nRoutes: LAX-JFK, ORD-LHR",
                      priceEffect: "+25%",
                      status: "Active",
                    },
                  ]}
                  columns={[
                    {
                      title: "Policy Name",
                      dataIndex: "policyName",
                      key: "policyName",
                      render: (text) => (
                        <Text className="font-medium">{text}</Text>
                      ),
                    },
                    {
                      title: "Type",
                      dataIndex: "type",
                      key: "type",
                      render: (type) => (
                        <Tag
                          color={type === "Refund" ? "blue" : "green"}
                          className="rounded-md"
                        >
                          {type}
                        </Tag>
                      ),
                    },
                    {
                      title: "Target",
                      dataIndex: "target",
                      key: "target",
                      render: (text) => (
                        <div className="text-sm">
                          {text.split("\n").map((line, index) => (
                            <div key={index} className="text-gray-600">
                              {line}
                            </div>
                          ))}
                        </div>
                      ),
                    },
                    {
                      title: "Price Effect",
                      dataIndex: "priceEffect",
                      key: "priceEffect",
                      render: (effect) => (
                        <Text
                          className={
                            effect === "0%" ? "text-green-600" : "text-red-600"
                          }
                          strong
                        >
                          {effect}
                        </Text>
                      ),
                    },
                    {
                      title: "Status",
                      dataIndex: "status",
                      key: "status",
                      render: (status) => (
                        <Tag color="blue" className="rounded-md">
                          {status}
                        </Tag>
                      ),
                    },
                    {
                      title: "Actions",
                      key: "actions",
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
                      ),
                    },
                  ]}
                  pagination={false}
                  className="custom-table"
                />
              </Card>
            </div>
          )}
          {activeTab === "ancillaries" && (
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
                  <Title level={4} className="!mb-1">
                    Ancillary Services
                  </Title>
                  <Text className="text-gray-500">
                    Manage your ancillary services and pricing
                  </Text>
                </div>

                <div className="space-y-4">
                  {/* Extra Leg Room Seat */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Title level={4} className="!mb-0">
                            Extra Leg Room Seat
                          </Title>
                          <Tag color="blue" className="rounded-md">
                            Seat
                          </Tag>
                          <Tag color="default" className="rounded-md">
                            optional
                          </Tag>
                          <Tag color="blue" className="rounded-md">
                            Active
                          </Tag>
                        </div>
                        <Text className="text-gray-600 block mb-4">
                          Additional 6 inches of legroom for enhanced comfort
                          during your flight.
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
                          <Text className="text-gray-500 text-sm block">
                            Base Price
                          </Text>
                          <Text className="text-green-600 font-bold text-lg">
                            $45
                          </Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={6}>
                        <div>
                          <Text className="text-gray-500 text-sm block">
                            Availability
                          </Text>
                          <Text className="font-medium">Flight dependent</Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={6}>
                        <div>
                          <Text className="text-gray-500 text-sm block">
                            Bundle Compatible
                          </Text>
                          <Text className="font-medium">Yes</Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={6}>
                        <div>
                          <Text className="text-gray-500 text-sm block">
                            Conversion Rate
                          </Text>
                          <Text className="text-blue-600 font-bold">45.2%</Text>
                        </div>
                      </Col>
                    </Row>

                    <Row gutter={[32, 16]} className="mb-4">
                      <Col xs={24} sm={6}>
                        <div>
                          <Text className="text-gray-500 text-sm block">
                            Total Bookings
                          </Text>
                          <Text className="font-bold text-lg">15,420</Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={6}>
                        <div>
                          <Text className="text-gray-500 text-sm block">
                            Revenue
                          </Text>
                          <Text className="text-green-600 font-bold text-lg">
                            $693,900
                          </Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={12}>
                        <div>
                          <Text className="text-gray-500 text-sm block">
                            Growth
                          </Text>
                          <div className="flex items-center space-x-1">
                            <RiseOutlined className="text-green-600 text-sm" />
                            <Text className="text-green-600 font-bold">
                              +22.7%
                            </Text>
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
                          <Title level={4} className="!mb-0">
                            Premium Meal Service
                          </Title>
                          <Tag color="orange" className="rounded-md">
                            Food & Beverage
                          </Tag>
                          <Tag color="default" className="rounded-md">
                            optional
                          </Tag>
                          <Tag color="blue" className="rounded-md">
                            Active
                          </Tag>
                        </div>
                        <Text className="text-gray-600 block mb-4">
                          Gourmet meal prepared by renowned chefs with dietary
                          options available.
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
                          <Text className="text-gray-500 text-sm block">
                            Base Price
                          </Text>
                          <Text className="text-green-600 font-bold text-lg">
                            $28
                          </Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={6}>
                        <div>
                          <Text className="text-gray-500 text-sm block">
                            Availability
                          </Text>
                          <Text className="font-medium">All flights</Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={6}>
                        <div>
                          <Text className="text-gray-500 text-sm block">
                            Bundle Compatible
                          </Text>
                          <Text className="font-medium">Yes</Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={6}>
                        <div>
                          <Text className="text-gray-500 text-sm block">
                            Conversion Rate
                          </Text>
                          <Text className="text-blue-600 font-bold">38.7%</Text>
                        </div>
                      </Col>
                    </Row>

                    <Row gutter={[32, 16]} className="mb-4">
                      <Col xs={24} sm={6}>
                        <div>
                          <Text className="text-gray-500 text-sm block">
                            Total Bookings
                          </Text>
                          <Text className="font-bold text-lg">23,450</Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={6}>
                        <div>
                          <Text className="text-gray-500 text-sm block">
                            Revenue
                          </Text>
                          <Text className="text-green-600 font-bold text-lg">
                            $657,260
                          </Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={12}>
                        <div>
                          <Text className="text-gray-500 text-sm block">
                            Growth
                          </Text>
                          <div className="flex items-center space-x-1">
                            <RiseOutlined className="text-green-600 text-sm" />
                            <Text className="text-green-600 font-bold">
                              +18.3%
                            </Text>
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
                          <Title level={4} className="!mb-0">
                            Priority Boarding
                          </Title>
                          <Tag color="purple" className="rounded-md">
                            Service
                          </Tag>
                          <Tag color="default" className="rounded-md">
                            optional
                          </Tag>
                          <Tag color="blue" className="rounded-md">
                            Active
                          </Tag>
                        </div>
                        <Text className="text-gray-600 block mb-4">
                          Board the aircraft in the first group to secure
                          overhead bin space.
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
                          <Text className="text-gray-500 text-sm block">
                            Base Price
                          </Text>
                          <Text className="text-green-600 font-bold text-lg">
                            $15
                          </Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={6}>
                        <div>
                          <Text className="text-gray-500 text-sm block">
                            Availability
                          </Text>
                          <Text className="font-medium">All flights</Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={6}>
                        <div>
                          <Text className="text-gray-500 text-sm block">
                            Bundle Compatible
                          </Text>
                          <Text className="font-medium">Yes</Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={6}>
                        <div>
                          <Text className="text-gray-500 text-sm block">
                            Conversion Rate
                          </Text>
                          <Text className="text-blue-600 font-bold">42.8%</Text>
                        </div>
                      </Col>
                    </Row>

                    <Row gutter={[32, 16]} className="mb-4">
                      <Col xs={24} sm={6}>
                        <div>
                          <Text className="text-gray-500 text-sm block">
                            Total Bookings
                          </Text>
                          <Text className="font-bold text-lg">34,560</Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={6}>
                        <div>
                          <Text className="text-gray-500 text-sm block">
                            Revenue
                          </Text>
                          <Text className="text-green-600 font-bold text-lg">
                            $518,400
                          </Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={12}>
                        <div>
                          <Text className="text-gray-500 text-sm block">
                            Growth
                          </Text>
                          <div className="flex items-center space-x-1">
                            <RiseOutlined className="text-green-600 text-sm" />
                            <Text className="text-green-600 font-bold">
                              +15.9%
                            </Text>
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
          {activeTab === "discounts" && (
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
                  <Title level={4} className="!mb-1">
                    Discount Management
                  </Title>
                  <Text className="text-gray-500">
                    Manage discount rules with advanced targeting and
                    combinability options
                  </Text>
                </div>

                <Table
                  dataSource={[
                    {
                      key: "1",
                      discountName: "Early Bird Special",
                      code: "EARLY20",
                      description: "Book 30 days in advance and save 20%",
                      type: "Percentage",
                      value: "20%",
                      target: "Ancillaries",
                      targetDetails:
                        "Extra Leg Room Seat, Premium Meal Service",
                      usage: "1247/5000",
                      usagePercentage: 25,
                      validFrom: "Jan 01, 2024",
                      validTo: "Dec 31, 2024",
                      status: "Active",
                    },
                    {
                      key: "2",
                      discountName: "Loyalty Member Discount",
                      code: "LOYALTY15",
                      description: "Exclusive discount for premium members",
                      type: "Percentage",
                      value: "15%",
                      target: "Both",
                      targetDetails: "All Services",
                      usage: "892/3000",
                      usagePercentage: 30,
                      validFrom: "Jan 01, 2024",
                      validTo: "Dec 31, 2024",
                      status: "Active",
                    },
                  ]}
                  columns={[
                    {
                      title: "Discount Details",
                      dataIndex: "discountName",
                      key: "discountName",
                      width: "25%",
                      render: (text, record) => (
                        <div>
                          <Text className="font-semibold text-gray-900 block">
                            {text}
                          </Text>
                          <Text className="text-blue-600 text-sm font-medium block">
                            Code: {record.code}
                          </Text>
                          <Text className="text-gray-600 text-sm">
                            {record.description}
                          </Text>
                        </div>
                      ),
                    },
                    {
                      title: "Type & Value",
                      key: "typeValue",
                      width: "15%",
                      render: (_, record) => (
                        <div className="text-center">
                          <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg mb-2">
                            <Text className="font-bold text-lg">
                              {record.value}
                            </Text>
                          </div>
                          <Text className="text-gray-600 text-sm">
                            {record.type}
                          </Text>
                        </div>
                      ),
                    },
                    {
                      title: "Target",
                      key: "target",
                      width: "15%",
                      render: (_, record) => (
                        <div>
                          <Tag
                            color={
                              record.target === "Ancillaries"
                                ? "blue"
                                : record.target === "Both"
                                  ? "purple"
                                  : "green"
                            }
                            className="rounded-md mb-2"
                          >
                            {record.target}
                          </Tag>
                          <Text className="text-gray-600 text-xs block">
                            {record.targetDetails}
                          </Text>
                        </div>
                      ),
                    },
                    {
                      title: "Usage",
                      key: "usage",
                      width: "12%",
                      render: (_, record) => (
                        <div>
                          <Text className="font-semibold block">
                            {record.usage}
                          </Text>
                          <Progress
                            percent={record.usagePercentage}
                            strokeColor="#1890ff"
                            showInfo={false}
                            size="small"
                            className="mb-1"
                          />
                          <Text className="text-gray-500 text-xs">
                            {record.usagePercentage}% used
                          </Text>
                        </div>
                      ),
                    },
                    {
                      title: "Validity",
                      key: "validity",
                      width: "15%",
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
                      ),
                    },
                    {
                      title: "Status",
                      dataIndex: "status",
                      key: "status",
                      width: "8%",
                      render: (status) => (
                        <Tag color="blue" className="rounded-md">
                          {status}
                        </Tag>
                      ),
                    },
                    {
                      title: "Actions",
                      key: "actions",
                      width: "10%",
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
                      ),
                    },
                  ]}
                  pagination={false}
                  className="custom-table"
                />
              </Card>
            </div>
          )}
          {activeTab === "promocodes" && (
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
                  <Title level={4} className="!mb-1">
                    Promo Code Management
                  </Title>
                  <Text className="text-gray-500">
                    Manage promotional codes for marketing campaigns
                  </Text>
                </div>

                <Table
                  dataSource={[
                    {
                      key: "1",
                      code: "SUMMER2024",
                      name: "Summer Vacation Deal",
                      description:
                        "Special summer promotion for vacation packages",
                      type: "Percentage",
                      value: "25%",
                      maxValue: "$100",
                      usage: "456/2000",
                      usagePercentage: 23,
                      performance: "$89,400",
                      redemptionRate: "23% redemption",
                      status: "Active",
                    },
                    {
                      key: "2",
                      code: "BIZ15",
                      name: "Business Traveler Promo",
                      description: "Corporate discount for business travelers",
                      type: "Percentage",
                      value: "15%",
                      maxValue: "$75",
                      usage: "234/1500",
                      usagePercentage: 16,
                      performance: "$45,600",
                      redemptionRate: "16% redemption",
                      status: "Active",
                    },
                  ]}
                  columns={[
                    {
                      title: "Code",
                      dataIndex: "code",
                      key: "code",
                      width: "12%",
                      render: (text) => (
                        <div className="flex items-center space-x-2">
                          <Text className="font-mono bg-gray-100 px-2 py-1 rounded font-semibold">
                            {text}
                          </Text>
                          <Button
                            type="text"
                            size="small"
                            icon={<span className="text-gray-400">📋</span>}
                            className="hover:bg-gray-50"
                          />
                        </div>
                      ),
                    },
                    {
                      title: "Name",
                      key: "name",
                      width: "20%",
                      render: (_, record) => (
                        <div>
                          <Text className="font-semibold text-gray-900 block">
                            {record.name}
                          </Text>
                          <Text className="text-gray-600 text-sm">
                            {record.description}
                          </Text>
                        </div>
                      ),
                    },
                    {
                      title: "Type",
                      dataIndex: "type",
                      key: "type",
                      width: "10%",
                      render: (type) => (
                        <Tag color="blue" className="rounded-md">
                          {type}
                        </Tag>
                      ),
                    },
                    {
                      title: "Value",
                      key: "value",
                      width: "12%",
                      render: (_, record) => (
                        <div className="text-center">
                          <Text className="font-bold text-lg block">
                            {record.value}
                          </Text>
                          <Text className="text-gray-500 text-xs">
                            Max: {record.maxValue}
                          </Text>
                        </div>
                      ),
                    },
                    {
                      title: "Usage",
                      key: "usage",
                      width: "15%",
                      render: (_, record) => (
                        <div>
                          <Text className="font-semibold block">
                            {record.usage} used
                          </Text>
                          <Progress
                            percent={record.usagePercentage}
                            strokeColor="#1890ff"
                            showInfo={false}
                            size="small"
                            className="mb-1"
                          />
                        </div>
                      ),
                    },
                    {
                      title: "Performance",
                      key: "performance",
                      width: "15%",
                      render: (_, record) => (
                        <div>
                          <Text className="font-bold text-lg text-green-600 block">
                            {record.performance}
                          </Text>
                          <Text className="text-gray-500 text-sm">
                            {record.redemptionRate}
                          </Text>
                        </div>
                      ),
                    },
                    {
                      title: "Status",
                      dataIndex: "status",
                      key: "status",
                      width: "8%",
                      render: (status) => (
                        <Tag color="blue" className="rounded-md">
                          {status}
                        </Tag>
                      ),
                    },
                    {
                      title: "Actions",
                      key: "actions",
                      width: "8%",
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
                      ),
                    },
                  ]}
                  pagination={false}
                  className="custom-table"
                />
              </Card>
            </div>
          )}
          {activeTab === "offers" && (
            <div>
              {/* Header with Search and Create Button */}
              <div className="mb-6 flex justify-between items-center">
                <Input
                  placeholder="Search offers..."
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
                  Create Offers
                </Button>
              </div>

              <Card>
                <div className="mb-6">
                  <Title level={4} className="!mb-1">
                    Offers Management
                  </Title>
                  <Text className="text-gray-500">
                    Design comprehensive offer packages combining multiple
                    services.
                  </Text>
                </div>

                <Table
                  dataSource={[
                    {
                      key: "1",
                      offerName: "Business Traveler Package",
                      code: "BTP001",
                      description:
                        "Complete business travel solution with premium amenities",
                      services:
                        "Priority Boarding, Extra Legroom, Premium Meal",
                      price: "$220",
                      adoption: "34%",
                      revenue: "$134,000",
                      status: "Active",
                    },
                    {
                      key: "2",
                      offerName: "Family Fun Bundle",
                      code: "FFB002",
                      description:
                        "Value package designed for family travelers",
                      services:
                        "Family Seating, Kids Entertainment, Family Meal",
                      price: "$135",
                      adoption: "28%",
                      revenue: "$98,000",
                      status: "Active",
                    },
                  ]}
                  columns={[
                    {
                      title: "Offer Details",
                      dataIndex: "offerName",
                      key: "offerName",
                      width: "25%",
                      render: (text, record) => (
                        <div>
                          <Text className="font-semibold text-gray-900 block">
                            {text}
                          </Text>
                          <Text className="text-blue-600 text-sm font-medium block">
                            Code: {record.code}
                          </Text>
                          <Text className="text-gray-600 text-sm">
                            {record.description}
                          </Text>
                        </div>
                      ),
                    },
                    {
                      title: "Included Services",
                      dataIndex: "services",
                      key: "services",
                      width: "20%",
                      render: (services) => (
                        <div className="space-y-1">
                          {services.split(", ").map((service, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                              <Text className="text-sm text-gray-700">
                                {service}
                              </Text>
                            </div>
                          ))}
                        </div>
                      ),
                    },
                    {
                      title: "Price",
                      dataIndex: "price",
                      key: "price",
                      width: "10%",
                      render: (price) => (
                        <Text className="font-bold text-lg text-green-600">
                          {price}
                        </Text>
                      ),
                    },
                    {
                      title: "Adoption",
                      dataIndex: "adoption",
                      key: "adoption",
                      width: "12%",
                      render: (adoption) => (
                        <div>
                          <Text className="font-semibold block">
                            {adoption}
                          </Text>
                          <Progress
                            percent={parseInt(adoption)}
                            strokeColor="#1890ff"
                            showInfo={false}
                            size="small"
                          />
                        </div>
                      ),
                    },
                    {
                      title: "Revenue",
                      dataIndex: "revenue",
                      key: "revenue",
                      width: "12%",
                      render: (revenue) => (
                        <Text className="font-bold text-green-600">
                          {revenue}
                        </Text>
                      ),
                    },
                    {
                      title: "Status",
                      dataIndex: "status",
                      key: "status",
                      width: "8%",
                      render: (status) => (
                        <Tag color="blue" className="rounded-md">
                          {status}
                        </Tag>
                      ),
                    },
                    {
                      title: "Actions",
                      key: "actions",
                      width: "13%",
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
                      ),
                    },
                  ]}
                  pagination={false}
                  className="custom-table"
                />
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal (Dynamic based on active tab) */}
      <Modal
        title={
          <div className="border-b border-gray-200 pb-4 mb-6">
            <Title level={3} className="!mb-2 text-gray-900">
              {activeTab === "policies"
                ? "Create New Policy"
                : activeTab === "ancillaries"
                  ? "Add New Ancillary"
                  : activeTab === "discounts"
                    ? "Create New Discount"
                    : activeTab === "promocodes"
                      ? "Create New Promo Code"
                      : "Create New Item"}
            </Title>
            {activeTab === "policies" && (
              <Text className="text-gray-600 text-base">
                Configure comprehensive policy rules including refund/change
                policies, eligibility criteria, stacking rules, blackout dates,
                and compliance constraints
              </Text>
            )}
            {activeTab === "ancillaries" && (
              <Text className="text-gray-600 text-base">
                Configure comprehensive ancillary details including product
                definitions, pricing rules, availability logic, bundle options,
                and categories
              </Text>
            )}
          </div>
        }
        visible={isModalVisible && activeTab !== "offers"}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingOffer(null);
          setPolicyModalStep(0);
          form.resetFields();
        }}
        footer={null}
        width={
          activeTab === "policies" ||
          activeTab === "ancillaries"
            ? 1000
            : 600
        }
        className="custom-modal"
        bodyStyle={{ padding: "24px 32px 32px" }}
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
          {activeTab === "policies" ? (
            // Policy Form Fields - Multi-step
            <>
              {/* Steps Navigation */}

              {/* Step Content */}
              <div style={{ minHeight: "400px" }}>
                {/* Step 1: Basic Information */}
                {policyModalStep === 0 && (
                  <div>
                    <Title level={4} className="!mb-4 text-blue-600">
                      Basic Information
                    </Title>
                    <Text className="text-gray-600 block mb-6">
                      Configure the fundamental details of your policy including
                      name, priority, and description.
                    </Text>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="Policy Name"
                          name="policyName"
                          rules={[
                            {
                              required: true,
                              message: "Please enter policy name",
                            },
                          ]}
                        >
                          <Input
                            placeholder="e.g., Premium Member Refund Policy"
                            size="large"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Priority Level"
                          name="priorityLevel"
                          rules={[
                            {
                              required: true,
                              message: "Please select priority level",
                            },
                          ]}
                        >
                          <Select placeholder="Select priority" size="large">
                            <Select.Option value="high">High</Select.Option>
                            <Select.Option value="medium">Medium</Select.Option>
                            <Select.Option value="low">Low</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item
                      label="Policy Description"
                      name="policyDescription"
                    >
                      <Input.TextArea
                        rows={4}
                        placeholder="Describe the policy purpose and scope..."
                      />
                    </Form.Item>

                    <Form.Item
                      name="policyEnabled"
                      valuePropName="checked"
                      initialValue={true}
                    >
                      <Switch />
                      <span className="ml-2">Policy Enabled</span>
                    </Form.Item>
                  </div>
                )}

                {/* Step 2: Refund/Change Rules */}
                {policyModalStep === 1 && (
                  <div>
                    <Title level={4} className="!mb-4 text-green-600">
                      Refund/Change Rules
                    </Title>
                    <Text className="text-gray-600 block mb-6">
                      Define the refund and change policies including deadlines,
                      percentages, and fees.
                    </Text>

                    <Row gutter={24}>
                      <Col span={12}>
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <Text className="font-medium block mb-3 text-green-600">
                            <DollarOutlined className="mr-2" />
                            Refund Policy
                          </Text>
                          <Form.Item
                            name="allowRefunds"
                            valuePropName="checked"
                            className="!mb-3"
                          >
                            <Switch />
                            <span className="ml-2">Allow Refunds</span>
                          </Form.Item>

                          <Form.Item
                            label="Refund Deadline (hours before departure)"
                            name="refundDeadline"
                          >
                            <InputNumber placeholder="24" className="w-full" />
                          </Form.Item>

                          <Row gutter={12}>
                            <Col span={12}>
                              <Form.Item
                                label="Refund Percentage (%)"
                                name="refundPercentage"
                              >
                                <InputNumber
                                  placeholder="100"
                                  className="w-full"
                                  min={0}
                                  max={100}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                label="Refund Fee ($)"
                                name="refundFee"
                              >
                                <InputNumber
                                  placeholder="0"
                                  className="w-full"
                                  min={0}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        </div>
                      </Col>

                      <Col span={12}>
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <Text className="font-medium block mb-3 text-blue-600">
                            <span className="mr-2">🔄</span>
                            Change Policy
                          </Text>
                          <Form.Item
                            name="allowChanges"
                            valuePropName="checked"
                            className="!mb-3"
                          >
                            <Switch />
                            <span className="ml-2">Allow Changes</span>
                          </Form.Item>

                          <Form.Item
                            label="Change Deadline (hours before departure)"
                            name="changeDeadline"
                          >
                            <InputNumber placeholder="24" className="w-full" />
                          </Form.Item>

                          <Form.Item label="Change Fee ($)" name="changeFee">
                            <InputNumber
                              placeholder="0"
                              className="w-full"
                              min={0}
                            />
                          </Form.Item>
                        </div>
                      </Col>
                    </Row>
                  </div>
                )}

                {/* Step 3: Eligibility Rules */}
                {policyModalStep === 2 && (
                  <div className="max-w-6xl mx-auto">
                    {/* Modern Header Section */}
                    <div className="text-center mb-12">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                        <UserOutlined className="text-4xl text-white" />
                      </div>
                      <Title level={2} className="!mb-4 text-gray-900">
                        Eligibility Configuration
                      </Title>
                      <Text className="text-gray-600 text-lg max-w-4xl mx-auto leading-relaxed">
                        Define comprehensive criteria for policy eligibility
                        including loyalty status, passenger demographics, age
                        restrictions, and booking channel preferences.
                      </Text>
                    </div>

                    {/* Clean Grid Layout */}
                    <div className="space-y-12">
                      {/* Loyalty & Membership Section */}
                      <div className="bg-white rounded-3xl border border-gray-200 p-10 shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center mb-8">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                            <TrophyOutlined className="text-white text-2xl" />
                          </div>
                          <div>
                            <Title level={3} className="!mb-2 text-gray-900">
                              Loyalty & Membership
                            </Title>
                            <Text className="text-gray-600 text-base">
                              Configure tier-based access and corporate customer
                              restrictions
                            </Text>
                          </div>
                        </div>

                        {/* Loyalty Tiers */}
                        <div className="mb-10">
                          <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                                <TrophyOutlined className="text-white text-lg" />
                              </div>
                              <div>
                                <Text className="font-bold text-gray-900 text-xl">
                                  Loyalty Program Tiers
                                </Text>
                                <Text className="text-gray-600 text-sm">
                                  Select eligible membership levels for this
                                  discount
                                </Text>
                              </div>
                            </div>
                            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg border-0">
                              Multi-Select
                            </Badge>
                          </div>
                          <Form.Item
                            name="loyaltyTiers"
                            className="!mb-6"
                            label="Loyalty Program Tiers"
                          >
                            <Checkbox.Group className="w-full">
                              <div className="space-y-3">
                                {loyaltyOptions.map((item) => (
                                  <div
                                    key={item.value}
                                    className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                                  >
                                    <Checkbox
                                      value={item.value}
                                      className="scale-110"
                                    />
                                    <div
                                      className={`w-4 h-4 rounded-full ${
                                        item.value === "bronze"
                                          ? "bg-amber-600"
                                          : item.value === "silver"
                                            ? "bg-gray-400"
                                            : item.value === "gold"
                                              ? "bg-yellow-500"
                                              : item.value === "platinum"
                                                ? "bg-slate-400"
                                                : "bg-blue-500"
                                      }`}
                                    ></div>
                                    <Text className="font-medium text-gray-700">
                                      {item.label}
                                    </Text>
                                  </div>
                                ))}
                              </div>
                            </Checkbox.Group>
                          </Form.Item>
                        </div>

                        {/* Corporate Customers */}
                        <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                          <Form.Item
                            name="corporateCustomersOnly"
                            valuePropName="checked"
                            className="!mb-0"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                                  <span className="text-blue-600 text-2xl">
                                    🏢
                                  </span>
                                </div>
                                <div>
                                  <Text className="font-semibold text-gray-900 text-lg block">
                                    Corporate Customers Only
                                  </Text>
                                  <Text className="text-gray-600 text-base">
                                    Restrict access to business accounts and
                                    corporate travelers
                                  </Text>
                                </div>
                              </div>
                              <Switch size="large" className="ml-6" />
                            </div>
                          </Form.Item>
                        </div>
                      </div>

                      {/* Demographics & Age Section */}
                      <div className="bg-white rounded-3xl border border-gray-200 p-10 shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center mb-8">
                          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                            <span className="text-white text-2xl">👥</span>
                          </div>
                          <div>
                            <Title level={3} className="!mb-2 text-gray-900">
                              Demographics & Age
                            </Title>
                            <Text className="text-gray-600 text-base">
                              Define passenger categories and age-based
                              restrictions
                            </Text>
                          </div>
                        </div>

                        {/* Passenger Types */}
                        <div className="mb-10">
                          <div className="flex items-center justify-between mb-6">
                            <Text className="font-semibold text-gray-800 text-lg">
                              Passenger Categories
                            </Text>
                            <Badge className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium border border-green-200">
                              Select All That Apply
                            </Badge>
                          </div>
                          <Form.Item name="passengerTypes" className="!mb-0">
                            <Checkbox.Group className="w-full">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[
                                  {
                                    value: "adult",
                                    label: "Adult",
                                    icon: "👨",
                                    desc: "18+ years",
                                    bgColor: "bg-blue-50",
                                    borderColor: "border-blue-200",
                                  },
                                  {
                                    value: "child",
                                    label: "Child",
                                    icon: "👧",
                                    desc: "2-17 years",
                                    bgColor: "bg-purple-50",
                                    borderColor: "border-purple-200",
                                  },
                                  {
                                    value: "infant",
                                    label: "Infant",
                                    icon: "👶",
                                    desc: "0-2 years",
                                    bgColor: "bg-pink-50",
                                    borderColor: "border-pink-200",
                                  },
                                  {
                                    value: "senior",
                                    label: "Senior",
                                    icon: "👴",
                                    desc: "65+ years",
                                    bgColor: "bg-orange-50",
                                    borderColor: "border-orange-200",
                                  },
                                  {
                                    value: "student",
                                    label: "Student",
                                    icon: "🎓",
                                    desc: "With valid ID",
                                    bgColor: "bg-indigo-50",
                                    borderColor: "border-indigo-200",
                                  },
                                  {
                                    value: "military",
                                    label: "Military",
                                    icon: "🪖",
                                    desc: "Active/Veteran",
                                    bgColor: "bg-emerald-50",
                                    borderColor: "border-emerald-200",
                                  },
                                ].map((type) => (
                                  <div
                                    key={type.value}
                                    className={`group/passenger p-5 ${type.bgColor} rounded-xl border-2 ${type.borderColor} hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer`}
                                  >
                                    <div className="flex items-center space-x-4 mb-2">
                                      <Checkbox
                                        value={type.value}
                                        className="scale-125"
                                      />
                                      <span className="text-2xl">
                                        {type.icon}
                                      </span>
                                    </div>
                                    <div className="ml-8">
                                      <Text className="font-semibold text-gray-900 text-base">
                                        {type.label}
                                      </Text>
                                      <Text className="text-gray-500 text-sm">
                                        {type.desc}
                                      </Text>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </Checkbox.Group>
                          </Form.Item>
                        </div>

                        {/* Age Restrictions */}
                        <div className="p-6 bg-green-50 rounded-xl border border-green-200">
                          <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                              <span className="text-green-600 text-xl">📅</span>
                            </div>
                            <Text className="font-semibold text-gray-800 text-lg">
                              Age Restrictions
                            </Text>
                          </div>
                          <Row gutter={24} className="mb-6">
                            <Col span={12}>
                              <Form.Item
                                label={
                                  <span className="font-medium text-gray-700 text-base">
                                    Minimum Age
                                  </span>
                                }
                                name="minAge"
                                className="!mb-4"
                              >
                                <InputNumber
                                  placeholder="0"
                                  className="w-full rounded-lg"
                                  min={0}
                                  max={120}
                                  size="large"
                                  suffix="years"
                                />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                label={
                                  <span className="font-medium text-gray-700 text-base">
                                    Maximum Age
                                  </span>
                                }
                                name="maxAge"
                                className="!mb-4"
                              >
                                <InputNumber
                                  placeholder="100"
                                  className="w-full rounded-lg"
                                  min={0}
                                  max={120}
                                  size="large"
                                  suffix="years"
                                />
                              </Form.Item>
                            </Col>
                          </Row>

                          <Form.Item
                            name="requiresAdultSupervision"
                            valuePropName="checked"
                            className="!mb-0"
                          >
                            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-green-200">
                              <div className="flex items-center space-x-4">
                                <span className="text-2xl">👨‍👩‍👧‍👦</span>
                                <div>
                                  <Text className="font-medium text-gray-900 text-base">
                                    Requires Adult Supervision
                                  </Text>
                                  <Text className="text-gray-600 text-sm">
                                    Apply to minors traveling alone without
                                    adult supervision
                                  </Text>
                                </div>
                              </div>
                              <Checkbox className="ml-4 scale-125" />
                            </div>
                          </Form.Item>
                        </div>
                      </div>

                      {/* Booking Channels Section */}
                      <div className="bg-white rounded-3xl border border-gray-200 p-10 shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center mb-8">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                            <span className="text-white text-2xl">📱</span>
                          </div>
                          <div>
                            <Title level={3} className="!mb-2 text-gray-900">
                              Booking Channels
                            </Title>
                            <Text className="text-gray-600 text-base">
                              Control which booking channels can access this
                              policy
                            </Text>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-6">
                          <Text className="font-semibold text-gray-800 text-lg">
                            Allowed Channels
                          </Text>
                          <Badge className="bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-sm font-medium border border-purple-200">
                            Multi-Channel Support
                          </Badge>
                        </div>
                        <Form.Item name="bookingChannels" className="!mb-0">
                          <Checkbox.Group className="w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {[
                                {
                                  value: "website",
                                  label: "Website",
                                  icon: "🌐",
                                  desc: "Desktop & mobile web platforms",
                                  bgColor: "bg-blue-50",
                                  borderColor: "border-blue-200",
                                },
                                {
                                  value: "mobile",
                                  label: "Mobile App",
                                  icon: "📱",
                                  desc: "iOS & Android native applications",
                                  bgColor: "bg-green-50",
                                  borderColor: "border-green-200",
                                },
                                {
                                  value: "callcenter",
                                  label: "Call Center",
                                  icon: "☎️",
                                  desc: "Phone bookings and customer service",
                                  bgColor: "bg-orange-50",
                                  borderColor: "border-orange-200",
                                },
                                {
                                  value: "agent",
                                  label: "Travel Agent",
                                  icon: "🏢",
                                  desc: "Third-party travel agencies",
                                  bgColor: "bg-indigo-50",
                                  borderColor: "border-indigo-200",
                                },
                                {
                                  value: "airport",
                                  label: "Airport Counter",
                                  icon: "✈️",
                                  desc: "Airport check-in and kiosks",
                                  bgColor: "bg-red-50",
                                  borderColor: "border-red-200",
                                },
                              ].map((channel) => (
                                <div
                                  key={channel.value}
                                  className={`group/channel p-6 ${channel.bgColor} rounded-xl border-2 ${channel.borderColor} hover:border-purple-300 hover:shadow-md transition-all duration-200 cursor-pointer`}
                                >
                                  <div className="flex items-start space-x-4">
                                    <Checkbox
                                      value={channel.value}
                                      className="scale-125 mt-1"
                                    />
                                    <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                      <span className="text-2xl">
                                        {channel.icon}
                                      </span>
                                    </div>
                                    <div className="flex-1">
                                      <Text className="font-semibold text-gray-900 text-base block mb-1">
                                        {channel.label}
                                      </Text>
                                      <Text className="text-gray-600 text-sm leading-relaxed">
                                        {channel.desc}
                                      </Text>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </Checkbox.Group>
                        </Form.Item>
                      </div>

                      {/* Configuration Summary */}
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl border border-blue-200 p-8">
                        <div className="flex items-start space-x-6">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-white text-2xl">📋</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-4">
                              <Title level={4} className="!mb-0 text-gray-900">
                                Eligibility Configuration Summary
                              </Title>
                              <Badge className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-200">
                                Auto-Generated Rules
                              </Badge>
                            </div>
                            <Text className="text-gray-700 leading-relaxed text-base mb-6">
                              Configure the above criteria to define
                              comprehensive eligibility rules. All selected
                              conditions will be evaluated using{" "}
                              <span className="font-semibold text-blue-600">
                                AND logic
                              </span>{" "}
                              to determine final policy access.
                              <span className="font-semibold">
                                Real-time validation
                              </span>{" "}
                              ensures consistent policy enforcement across all
                              booking channels.
                            </Text>
                            <div className="flex flex-wrap gap-6">
                              <div className="flex items-center text-gray-600">
                                <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                                <Text className="font-medium">
                                  Auto-validation enabled
                                </Text>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                                <Text className="font-medium">
                                  Multi-criteria support
                                </Text>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <span className="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
                                <Text className="font-medium">
                                  Real-time enforcement
                                </Text>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Discount Stacking/Combinability Rules & Blackout Dates */}
                {policyModalStep === 3 && (
                  <div>
                    <Title level={4} className="!mb-4 text-orange-600">
                      Discount Stacking & Blackout Dates
                    </Title>
                    <Text className="text-gray-600 block mb-6">
                      Configure how this policy interacts with other offers and
                      define any blackout periods.
                    </Text>

                    {/* Discount Stacking Section */}
                    <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center mb-4">
                        <PercentageOutlined className="text-orange-600 mr-2" />
                        <Text className="font-medium text-orange-600">
                          Discount Stacking/Combinability Rules
                        </Text>
                      </div>

                      <Form.Item
                        name="allowDiscountStacking"
                        valuePropName="checked"
                        className="mb-4"
                      >
                        <Switch />
                        <span className="ml-2">Allow Discount Stacking</span>
                      </Form.Item>

                      <div>
                        <Text className="font-medium block mb-3">
                          Conflicting Offers (Cannot be combined)
                        </Text>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item name="conflictingOffers1">
                              <Checkbox.Group>
                                <Space direction="vertical" className="w-full">
                                  <Checkbox value="comfort-plus">
                                    Comfort Plus Offer
                                  </Checkbox>
                                  <Checkbox value="early-bird">
                                    Early Bird Discount
                                  </Checkbox>
                                  <Checkbox value="baggage-fixed">
                                    Baggage Fixed Discount
                                  </Checkbox>
                                </Space>
                              </Checkbox.Group>
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item name="conflictingOffers2">
                              <Checkbox.Group>
                                <Space direction="vertical" className="w-full">
                                  <Checkbox value="business-traveler">
                                    Business Traveler Offer
                                  </Checkbox>
                                  <Checkbox value="meal-service">
                                    Meal Service Discount
                                  </Checkbox>
                                  <Checkbox value="summer-travel">
                                    Summer Travel Promo
                                  </Checkbox>
                                </Space>
                              </Checkbox.Group>
                            </Form.Item>
                          </Col>
                        </Row>
                      </div>
                    </div>

                    {/* Blackout Dates Section */}
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center mb-4">
                        <CalendarOutlined className="text-red-600 mr-2" />
                        <Text className="font-medium text-red-600">
                          Blackout Dates
                        </Text>
                      </div>

                      <Form.Item
                        name="hasBlackoutDates"
                        valuePropName="checked"
                      >
                        <Switch />
                        <span className="ml-2">Has Blackout Dates</span>
                      </Form.Item>

                      <Row gutter={16} className="mt-4">
                        <Col span={12}>
                          <Form.Item
                            label="Blackout Start Date"
                            name="blackoutStartDate"
                          >
                            <DatePicker
                              size="large"
                              className="w-full"
                              placeholder="Select start date"
                              format="MMM DD, YYYY"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            label="Blackout End Date"
                            name="blackoutEndDate"
                          >
                            <DatePicker
                              size="large"
                              className="w-full"
                              placeholder="Select end date"
                              format="MMM DD, YYYY"
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  </div>
                )}

                {/* Step 5: Validity Period */}
                {policyModalStep === 4 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CalendarOutlined className="text-2xl text-purple-600" />
                      </div>
                      <Title level={3} className="!mb-2 text-gray-900">
                        Validity Period
                      </Title>
                      <Text className="text-gray-600 text-base">
                        Set the active period for this policy including start
                        date, end date, and timezone.
                      </Text>
                    </div>

                    <Row gutter={16} className="mb-6">
                      <Col span={12}>
                        <Form.Item
                          label="Valid From"
                          name="validFrom"
                          rules={[
                            {
                              required: true,
                              message: "Please select start date",
                            },
                          ]}
                        >
                          <DatePicker
                            size="large"
                            className="w-full"
                            placeholder="Pick start date"
                            format="MMM DD, YYYY"
                            disabledDate={(current) =>
                              current && current.isBefore(new Date(), "day")
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Valid To"
                          name="validTo"
                          rules={[
                            {
                              required: true,
                              message: "Please select end date",
                            },
                          ]}
                        >
                          <DatePicker
                            size="large"
                            className="w-full"
                            placeholder="Pick end date"
                            format="MMM DD, YYYY"
                            disabledDate={(current) =>
                              current && current.isBefore(new Date(), "day")
                            }
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    {/* Regulatory/Compliance Constraints */}
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center mb-4">
                        <span className="text-purple-600 mr-2">📋</span>
                        <Text className="font-medium text-purple-600">
                          Regulatory/Compliance Constraints
                        </Text>
                      </div>

                      <Row gutter={24}>
                        <Col span={12}>
                          <div className="mb-4">
                            <Text className="font-medium block mb-2">
                              Applicable Regions
                            </Text>
                            <Form.Item name="applicableRegions">
                              <Checkbox.Group>
                                <Row gutter={[12, 8]}>
                                  <Col span={12}>
                                    <Checkbox value="north-america">
                                      North America
                                    </Checkbox>
                                  </Col>
                                  <Col span={12}>
                                    <Checkbox value="europe">Europe</Checkbox>
                                  </Col>
                                  <Col span={12}>
                                    <Checkbox value="asia-pacific">
                                      Asia Pacific
                                    </Checkbox>
                                  </Col>
                                  <Col span={12}>
                                    <Checkbox value="latin-america">
                                      Latin America
                                    </Checkbox>
                                  </Col>
                                  <Col span={12}>
                                    <Checkbox value="middle-east">
                                      Middle East
                                    </Checkbox>
                                  </Col>
                                  <Col span={12}>
                                    <Checkbox value="africa">Africa</Checkbox>
                                  </Col>
                                </Row>
                              </Checkbox.Group>
                            </Form.Item>
                          </div>

                          <Space direction="vertical" className="w-full">
                            <div>
                              <Form.Item
                                name="gdprCompliant"
                                valuePropName="checked"
                              >
                                <Switch />
                                <span className="ml-2">
                                  GDPR/Data Protection Compliant
                                </span>
                              </Form.Item>
                            </div>

                            <div>
                              <Form.Item
                                name="adaCompliant"
                                valuePropName="checked"
                              >
                                <Switch />
                                <span className="ml-2">
                                  ADA/Accessibility Compliant
                                </span>
                              </Form.Item>
                            </div>

                            <div>
                              <Form.Item
                                name="enableAuditTrail"
                                valuePropName="checked"
                                initialValue={true}
                              >
                                <Switch />
                                <span className="ml-2">Enable Audit Trail</span>
                              </Form.Item>
                            </div>
                          </Space>
                        </Col>

                        <Col span={12}>
                          <div className="mb-4">
                            <Text className="font-medium block mb-2">
                              Tax Implications
                            </Text>
                            <Form.Item name="taxImplications">
                              <Input.TextArea
                                rows={3}
                                placeholder="Describe any tax implications or considerations..."
                              />
                            </Form.Item>
                          </div>

                          <div className="mb-4">
                            <Text className="font-medium block mb-2">
                              Regulatory Notes
                            </Text>
                            <Form.Item name="regulatoryNotes">
                              <Input.TextArea
                                rows={3}
                                placeholder="Additional regulatory notes and constraints..."
                              />
                            </Form.Item>

                            <Form.Item
                              name="requiresApproval"
                              valuePropName="checked"
                            >
                              <Switch />
                              <span className="ml-2">Requires Approval</span>
                            </Form.Item>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : activeTab === "discounts" ? (
            // Discount Form Fields - Multi-step
            <>
              {/* Steps Navigation */}

              {/* Step Content */}
              <div style={{ minHeight: "400px" }}>
                {/* Step 1: Basic Info */}
                {policyModalStep === 0 && (
                  <div>
                    <Title level={4} className="!mb-4 text-blue-600">
                      Basic Information
                    </Title>
                    <Text className="text-gray-600 block mb-6">
                      Configure the fundamental details of your discount
                      including name, code, and description.
                    </Text>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label={
                            <span className="font-medium">
                              Discount Name{" "}
                              <span className="text-red-500">*</span>
                            </span>
                          }
                          name="discountName"
                          rules={[
                            {
                              required: true,
                              message: "Please enter discount name",
                            },
                          ]}
                        >
                          <Input
                            placeholder="e.g., Early Bird Discount"
                            size="large"
                            className="rounded-lg"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={
                            <span className="font-medium">
                              Discount Code{" "}
                              <span className="text-red-500">*</span>
                            </span>
                          }
                          name="discountCode"
                          rules={[
                            {
                              required: true,
                              message: "Please enter discount code",
                            },
                          ]}
                        >
                          <Input
                            placeholder="e.g., EARLY20"
                            size="large"
                            className="rounded-lg"
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item
                      label={<span className="font-medium">Description</span>}
                      name="description"
                    >
                      <Input.TextArea
                        rows={4}
                        placeholder="Describe what this discount offers..."
                        className="rounded-lg"
                      />
                    </Form.Item>

                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          label={
                            <span className="font-medium">
                              Discount Type{" "}
                              <span className="text-red-500">*</span>
                            </span>
                          }
                          name="discountType"
                          rules={[
                            {
                              required: true,
                              message: "Please select discount type",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Percentage (%)"
                            size="large"
                            className="rounded-lg"
                          >
                            <Select.Option value="percentage">
                              Percentage (%)
                            </Select.Option>
                            <Select.Option value="fixed">
                              Fixed Amount
                            </Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          label={
                            <span className="font-medium">
                              Discount Value{" "}
                              <span className="text-red-500">*</span>
                            </span>
                          }
                          name="discountValue"
                          rules={[
                            {
                              required: true,
                              message: "Please enter discount value",
                            },
                          ]}
                        >
                          <InputNumber
                            placeholder="20"
                            size="large"
                            className="w-full rounded-lg"
                            min={0}
                            max={100}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          label={<span className="font-medium">Status</span>}
                          name="status"
                          initialValue="active"
                        >
                          <Select
                            placeholder="Active"
                            size="large"
                            className="rounded-lg"
                          >
                            <Select.Option value="active">Active</Select.Option>
                            <Select.Option value="inactive">
                              Inactive
                            </Select.Option>
                            <Select.Option value="draft">Draft</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                )}

                {/* Step 2: Discount Rules */}
                {policyModalStep === 1 && (
                  <div>
                    <Title level={4} className="!mb-4 text-green-600">
                      Target Application
                    </Title>
                    <Text className="text-gray-600 block mb-6">
                      Define how and where this discount should be applied.
                    </Text>

                    <div className="space-y-4 mb-6">
                      <Form.Item
                        name="targetApplication"
                        initialValue="baseFareOnly"
                      >
                        <div className="space-y-3">
                          <div className="p-4 border-2 border-blue-500 bg-blue-50 rounded-lg">
                            <div className="flex items-center">
                              <input
                                type="radio"
                                value="baseFareOnly"
                                className="mr-3"
                              />
                              <div>
                                <Text className="font-semibold text-blue-900">
                                  Base Fare Only
                                </Text>
                                <Text className="text-blue-700 text-sm block">
                                  Apply discount to base fare/ticket price
                                </Text>
                              </div>
                            </div>
                          </div>
                          <div className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                            <div className="flex items-center">
                              <input
                                type="radio"
                                value="ancillariesOnly"
                                className="mr-3"
                              />
                              <div>
                                <Text className="font-semibold">
                                  Ancillaries Only
                                </Text>
                                <Text className="text-gray-600 text-sm block">
                                  Apply discount to selected ancillary services
                                </Text>
                              </div>
                            </div>
                          </div>
                          <div className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                            <div className="flex items-center">
                              <input
                                type="radio"
                                value="both"
                                className="mr-3"
                              />
                              <div>
                                <Text className="font-semibold">
                                  Both Base Fare & Ancillaries
                                </Text>
                                <Text className="text-gray-600 text-sm block">
                                  Apply discount to both fare and selected
                                  services
                                </Text>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Form.Item>
                    </div>

                    <Row gutter={24}>
                      <Col span={8}>
                        <Form.Item
                          label={
                            <span className="font-medium">
                              Total Usage Limit
                            </span>
                          }
                          name="totalUsageLimit"
                        >
                          <InputNumber
                            placeholder="1000"
                            size="large"
                            className="w-full rounded-lg"
                            min={1}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          label={
                            <span className="font-medium">Per User Limit</span>
                          }
                          name="perUserLimit"
                        >
                          <InputNumber
                            placeholder="1"
                            size="large"
                            className="w-full rounded-lg"
                            min={1}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          label={
                            <span className="font-medium">
                              Maximum Discount Cap ($)
                            </span>
                          }
                          name="maxDiscountCap"
                        >
                          <InputNumber
                            placeholder="100"
                            size="large"
                            className="w-full rounded-lg"
                            min={0}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                )}

                {/* Step 3: Eligibility */}
                {policyModalStep === 2 && (
                  <div className="space-y-8">
                    <div className="text-center mb-8">
                      <Title level={4} className="!mb-4 text-blue-600">
                        Eligibility Criteria
                      </Title>
                      <Text className="text-gray-600 text-base">
                        Define who can access this discount based on loyalty
                        status, location, and spending requirements.
                      </Text>
                    </div>

                    {/* Loyalty Program Tiers */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                      <div className="mb-4">
                        <Title
                          level={5}
                          className="!mb-2 text-gray-900 font-semibold"
                        >
                          Loyalty Program Tiers
                        </Title>
                        <Text className="text-gray-600 text-sm">
                          Select which loyalty tiers are eligible for this
                          discount
                        </Text>
                      </div>
                      <Form.Item name="loyaltyTiers" className="!mb-0">
                        <Checkbox.Group className="block">
                          <div className="p-1 flex gap-2 items-center">
                            <Checkbox value="bronze" className="scale-110" />
                            <div className="w-4 h-4 bg-amber-600 rounded-full"></div>
                            <Text className="font-medium text-amber-800">
                              Bronze
                            </Text>
                          </div>
                          <div className="p-1 flex gap-2 items-center">
                            <Checkbox value="silver" className="scale-110" />
                            <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                            <Text className="font-medium text-gray-700">
                              Silver
                            </Text>
                          </div>
                          <div className="p-1 flex gap-2 items-center">
                            <Checkbox value="gold" className="scale-110" />
                            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                            <Text className="font-medium text-yellow-800">
                              Gold
                            </Text>
                          </div>
                          <div className="p-1 flex gap-2 items-center">
                            <Checkbox value="platinum" className="scale-110" />
                            <div className="w-4 h-4 bg-slate-400 rounded-full"></div>
                            <Text className="font-medium text-slate-700">
                              Platinum
                            </Text>
                          </div>
                          <div className="p-1 flex gap-2 items-center">
                            <Checkbox value="diamond" className="scale-110" />
                            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                            <Text className="font-medium text-blue-800">
                              Diamond
                            </Text>
                          </div>
                        </Checkbox.Group>
                      </Form.Item>
                    </div>

                    {/* Geographic Eligibility */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                      <div className="mb-6">
                        <Title
                          level={5}
                          className="!mb-2 text-gray-900 font-semibold"
                        >
                          Geographic Eligibility
                        </Title>
                        <Text className="text-gray-600 text-sm">
                          Select which countries/regions are eligible for this
                          discount
                        </Text>
                      </div>
                      <Form.Item name="geographicEligibility" className="!mb-0">
                        <Checkbox.Group className="w-full">
                          <div className="grid grid-cols-4 gap-4">
                            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors">
                              <Checkbox value="US" className="scale-110" />
                              <Text className="font-medium text-blue-800">
                                🇺🇸 US
                              </Text>
                            </div>
                            <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg border border-red-200 hover:border-red-300 transition-colors">
                              <Checkbox value="CA" className="scale-110" />
                              <Text className="font-medium text-red-800">
                                🇨🇦 CA
                              </Text>
                            </div>
                            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200 hover:border-green-300 transition-colors">
                              <Checkbox value="MX" className="scale-110" />
                              <Text className="font-medium text-green-800">
                                🇲🇽 MX
                              </Text>
                            </div>
                            <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg border border-purple-200 hover:border-purple-300 transition-colors">
                              <Checkbox value="UK" className="scale-110" />
                              <Text className="font-medium text-purple-800">
                                🇬🇧 UK
                              </Text>
                            </div>
                            <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg border border-orange-200 hover:border-orange-300 transition-colors">
                              <Checkbox value="AU" className="scale-110" />
                              <Text className="font-medium text-orange-800">
                                🇦🇺 AU
                              </Text>
                            </div>
                            <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200 hover:border-yellow-300 transition-colors">
                              <Checkbox value="DE" className="scale-110" />
                              <Text className="font-medium text-yellow-800">
                                🇩🇪 DE
                              </Text>
                            </div>
                            <div className="flex items-center space-x-3 p-4 bg-indigo-50 rounded-lg border border-indigo-200 hover:border-indigo-300 transition-colors">
                              <Checkbox value="FR" className="scale-110" />
                              <Text className="font-medium text-indigo-800">
                                🇫🇷 FR
                              </Text>
                            </div>
                            <div className="flex items-center space-x-3 p-4 bg-pink-50 rounded-lg border border-pink-200 hover:border-pink-300 transition-colors">
                              <Checkbox value="JP" className="scale-110" />
                              <Text className="font-medium text-pink-800">
                                🇯🇵 JP
                              </Text>
                            </div>
                          </div>
                        </Checkbox.Group>
                      </Form.Item>
                    </div>

                    {/* Route Restrictions */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                      <div className="mb-6">
                        <Title
                          level={5}
                          className="!mb-2 text-gray-900 font-semibold"
                        >
                          Route Restrictions
                        </Title>
                        <Text className="text-gray-600 text-sm">
                          Limit discount to specific flight routes (leave empty
                          for all routes)
                        </Text>
                      </div>
                      <Form.Item name="routeRestrictions" className="!mb-0">
                        <Checkbox.Group className="w-full">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                              <Checkbox value="LAX-JFK" className="scale-110" />
                              <Text className="font-medium text-gray-700">
                                LAX-JFK
                              </Text>
                            </div>
                            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                              <Checkbox value="ORD-SFO" className="scale-110" />
                              <Text className="font-medium text-gray-700">
                                ORD-SFO
                              </Text>
                            </div>
                            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                              <Checkbox value="MIA-DEN" className="scale-110" />
                              <Text className="font-medium text-gray-700">
                                MIA-DEN
                              </Text>
                            </div>
                            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                              <Checkbox value="ATL-SEA" className="scale-110" />
                              <Text className="font-medium text-gray-700">
                                ATL-SEA
                              </Text>
                            </div>
                            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                              <Checkbox value="DEN-BOS" className="scale-110" />
                              <Text className="font-medium text-gray-700">
                                DEN-BOS
                              </Text>
                            </div>
                            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                              <Checkbox value="LAX-ORD" className="scale-110" />
                              <Text className="font-medium text-gray-700">
                                LAX-ORD
                              </Text>
                            </div>
                          </div>
                        </Checkbox.Group>
                      </Form.Item>
                    </div>

                    {/* Minimum Spend Threshold */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                      <div className="mb-6">
                        <Title
                          level={5}
                          className="!mb-2 text-gray-900 font-semibold"
                        >
                          Minimum Spend Threshold ($)
                        </Title>
                        <Text className="text-gray-600 text-sm">
                          Set a minimum purchase amount required to use this
                          discount
                        </Text>
                      </div>
                      <Form.Item name="minSpendThreshold" className="!mb-0">
                        <InputNumber
                          placeholder="100"
                          size="large"
                          className="w-full rounded-lg"
                          min={0}
                          defaultValue={100}
                          formatter={(value) =>
                            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) =>
                            value?.replace(/\$\s?|(,*)/g, "") || ""
                          }
                          style={{
                            fontSize: "16px",
                            padding: "12px 16px",
                            borderRadius: "8px",
                          }}
                        />
                      </Form.Item>
                    </div>
                  </div>
                )}

                {/* Step 4: Date Windows */}
                {policyModalStep === 3 && (
                  <div>
                    <Title level={4} className="!mb-4 text-orange-600">
                      Date Windows & Validity
                    </Title>
                    <Text className="text-gray-600 block mb-6">
                      Set the validity period and any blackout dates for this
                      discount.
                    </Text>

                    <Row gutter={16} className="mb-8">
                      <Col span={12}>
                        <Form.Item
                          label={
                            <span className="font-medium">
                              Valid From <span className="text-red-500">*</span>
                            </span>
                          }
                          name="validFrom"
                          rules={[
                            {
                              required: true,
                              message: "Please select start date",
                            },
                          ]}
                        >
                          <DatePicker
                            placeholder="Pick start date"
                            size="large"
                            className="w-full rounded-lg"
                            format="MMM DD, YYYY"
                            disabledDate={(current) =>
                              current && current.isBefore(new Date(), "day")
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={
                            <span className="font-medium">
                              Valid Until{" "}
                              <span className="text-red-500">*</span>
                            </span>
                          }
                          name="validTo"
                          rules={[
                            {
                              required: true,
                              message: "Please select end date",
                            },
                          ]}
                        >
                          <DatePicker
                            placeholder="Pick end date"
                            size="large"
                            className="w-full rounded-lg"
                            format="MMM DD, YYYY"
                            disabledDate={(current) =>
                              current && current.isBefore(new Date(), "day")
                            }
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <div className="mb-6">
                      <Title level={5} className="!mb-4">
                        Blackout Dates
                      </Title>
                      <Form.Item name="blackoutDates">
                        <DatePicker
                          placeholder="dd-----yyyy"
                          size="large"
                          className="w-full rounded-lg"
                          format="MMM DD, YYYY"
                        />
                      </Form.Item>
                    </div>
                  </div>
                )}

                {/* Step 5: Combinability */}
                {policyModalStep === 4 && (
                  <div>
                    <Title level={4} className="!mb-4 text-pink-600">
                      Promo Code Combinability
                    </Title>
                    <Text className="text-gray-600 block mb-6">
                      Configure how this discount interacts with promotional
                      codes.
                    </Text>

                    <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
                      <Form.Item
                        name="allowPromoCodeCombination"
                        valuePropName="checked"
                        className="!mb-4"
                      >
                        <div className="flex items-start">
                          <Checkbox className="mr-4 mt-1" />
                          <div>
                            <Text className="font-semibold text-lg block mb-2">
                              Allow Combination with Promo Codes
                            </Text>
                            <Text className="text-gray-600">
                              This discount can be used together with
                              promotional codes
                            </Text>
                          </div>
                        </div>
                      </Form.Item>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : activeTab === "ancillaries" ? (
            // Ancillary Form Fields - Multi-step
            <>
              {/* Steps Navigation */}

              {/* Step Content */}
              <div style={{ minHeight: "400px" }}>
                {/* Step 1: Basic Information */}
                {policyModalStep === 0 && (
                  <div>
                    <Title level={4} className="!mb-4 text-blue-600">
                      Basic Information
                    </Title>
                    <Text className="text-gray-600 block mb-6">
                      Configure comprehensive ancillary details including
                      product definitions, pricing rules, availability logic,
                      bundle options, and categories.
                    </Text>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="Ancillary Name"
                          name="ancillaryName"
                          rules={[
                            {
                              required: true,
                              message: "Please enter ancillary name",
                            },
                          ]}
                        >
                          <Input
                            placeholder="e.g., Premium Meal Service"
                            size="large"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Category"
                          name="category"
                          rules={[
                            {
                              required: true,
                              message: "Please select category",
                            },
                          ]}
                        >
                          <Select placeholder="Select category" size="large">
                            <Select.Option value="seat">Seat</Select.Option>
                            <Select.Option value="food-beverage">
                              Food & Beverage
                            </Select.Option>
                            <Select.Option value="service">
                              Service
                            </Select.Option>
                            <Select.Option value="baggage">
                              Baggage
                            </Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="Ancillary Type"
                          name="ancillaryType"
                          rules={[
                            { required: true, message: "Please select type" },
                          ]}
                        >
                          <Select placeholder="Select type" size="large">
                            <Select.Option value="mandatory">
                              Mandatory
                            </Select.Option>
                            <Select.Option value="optional">
                              Optional
                            </Select.Option>
                            <Select.Option value="bundle">Bundle</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Status"
                          name="status"
                          initialValue="active"
                        >
                          <Select placeholder="Select status" size="large">
                            <Select.Option value="active">Active</Select.Option>
                            <Select.Option value="inactive">
                              Inactive
                            </Select.Option>
                            <Select.Option value="draft">Draft</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item label="Description" name="description">
                      <Input.TextArea
                        rows={4}
                        placeholder="Describe the ancillary service..."
                      />
                    </Form.Item>
                  </div>
                )}

                {/* Step 2: Terms and Conditions */}
                {policyModalStep === 1 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                        <span className="text-blue-600 text-xs">📋</span>
                      </div>
                      <Title level={4} className="!mb-0 text-blue-600">
                        Terms and Conditions
                      </Title>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <Form.Item
                          name="refundable"
                          valuePropName="checked"
                          className="!mb-0"
                        >
                          <div className="flex items-center">
                            <Switch className="mr-2" />
                            <Text>Refundable</Text>
                          </div>
                        </Form.Item>

                        <Form.Item
                          name="changeable"
                          valuePropName="checked"
                          className="!mb-0"
                        >
                          <div className="flex items-center">
                            <Switch className="mr-2" />
                            <Text>Changeable</Text>
                          </div>
                        </Form.Item>

                        <Form.Item
                          name="transferable"
                          valuePropName="checked"
                          className="!mb-0"
                        >
                          <div className="flex items-center">
                            <Switch className="mr-2" />
                            <Text>Transferable</Text>
                          </div>
                        </Form.Item>
                      </div>
                    </div>

                    <div className="mb-6">
                      <Text className="font-medium block mb-3">
                        Cancellation Policy
                      </Text>
                      <Form.Item name="cancellationPolicy">
                        <Input.TextArea
                          rows={4}
                          placeholder="Describe cancellation terms and conditions..."
                          className="bg-gray-50"
                        />
                      </Form.Item>
                    </div>

                    <div>
                      <Text className="font-medium block mb-3">
                        Special Conditions
                      </Text>
                      <Form.Item name="specialConditions">
                        <Input.TextArea
                          rows={4}
                          placeholder="Any special terms, restrictions, or conditions..."
                          className="bg-gray-50"
                        />
                      </Form.Item>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : activeTab === "promocodes" ? (
            // Promo Code Form Fields - Multi-step
            <>
              {/* Steps Navigation */}

              {/* Step Content */}
              <div style={{ minHeight: "400px" }}>
                {/* Step 1: Basic Information */}
                {policyModalStep === 0 && (
                  <div>
                    <Title level={4} className="!mb-4 text-blue-600">
                      Basic Information
                    </Title>
                    <Text className="text-gray-600 block mb-6">
                      Create a new promo in the system
                    </Text>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                      <Row gutter={16} className="mb-4">
                        <Col span={12}>
                          <Form.Item
                            label={
                              <span className="font-medium">Promo Name</span>
                            }
                            name="promoName"
                            rules={[
                              {
                                required: true,
                                message: "Please enter promo name",
                              },
                            ]}
                          >
                            <Input
                              placeholder="Enter promo name"
                              size="large"
                              className="rounded-lg"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            label={
                              <span className="font-medium">Promo Code</span>
                            }
                            name="promoCode"
                            rules={[
                              {
                                required: true,
                                message: "Please enter promo code",
                              },
                            ]}
                          >
                            <div className="flex">
                              <Input
                                placeholder="Enter promo code"
                                size="large"
                                className="rounded-lg flex-1"
                              />
                              <Button
                                type="text"
                                icon={<span className="text-gray-400">🎲</span>}
                                className="ml-2"
                                size="large"
                              />
                            </div>
                          </Form.Item>
                        </Col>
                      </Row>

                      <Form.Item
                        label={<span className="font-medium">Description</span>}
                        name="description"
                        className="mb-6"
                      >
                        <Input.TextArea
                          rows={3}
                          placeholder="Describe the promotional offer"
                          className="rounded-lg"
                        />
                      </Form.Item>

                      <Row gutter={16}>
                        <Col span={8}>
                          <Form.Item
                            label={
                              <span className="font-medium">Discount Type</span>
                            }
                            name="discountType"
                            initialValue="percentage"
                          >
                            <Select size="large" className="rounded-lg">
                              <Select.Option value="percentage">
                                Percentage
                              </Select.Option>
                              <Select.Option value="fixed">
                                Fixed Amount
                              </Select.Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            label={
                              <span className="font-medium">
                                Discount Value
                              </span>
                            }
                            name="discountValue"
                            initialValue={25}
                          >
                            <InputNumber
                              placeholder="25"
                              size="large"
                              className="w-full rounded-lg"
                              min={0}
                              max={100}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            label={<span className="font-medium">Status</span>}
                            name="status"
                            initialValue="active"
                          >
                            <Select size="large" className="rounded-lg">
                              <Select.Option value="active">
                                Active
                              </Select.Option>
                              <Select.Option value="inactive">
                                Inactive
                              </Select.Option>
                              <Select.Option value="draft">Draft</Select.Option>
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  </div>
                )}

                {/* Step 2: Code Generation */}
                {policyModalStep === 1 && (
                  <div>
                    <Title level={4} className="!mb-4 text-green-600">
                      Code Generation
                    </Title>
                    <Text className="text-gray-600 block mb-6">
                      Configure how promo codes are generated and managed
                    </Text>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">
                      <div className="mb-6">
                        <Text className="font-semibold text-lg block mb-4">
                          Generation Type
                        </Text>
                        <Form.Item name="generationType" initialValue="manual">
                          <div className="space-y-3">
                            <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                              <input
                                type="radio"
                                value="manual"
                                className="mr-3"
                              />
                              <Text className="font-medium">Manual Entry</Text>
                            </div>
                            <div className="flex items-center p-3 border-2 border-blue-500 bg-blue-50 rounded-lg">
                              <input
                                type="radio"
                                value="auto"
                                className="mr-3"
                                checked
                              />
                              <Text className="font-medium text-blue-900">
                                Auto Generator
                              </Text>
                            </div>
                          </div>
                        </Form.Item>
                      </div>

                      <Row gutter={16}>
                        <Col span={8}>
                          <Form.Item
                            label={<span className="font-medium">Prefix</span>}
                            name="prefix"
                            initialValue="PROMO"
                          >
                            <Input
                              placeholder="PROMO"
                              size="large"
                              className="rounded-lg bg-gray-50"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            label={
                              <span className="font-medium">Code Length</span>
                            }
                            name="codeLength"
                            initialValue={8}
                          >
                            <InputNumber
                              placeholder="8"
                              size="large"
                              className="w-full rounded-lg bg-gray-50"
                              min={4}
                              max={20}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            label={
                              <span className="font-medium">Quantity</span>
                            }
                            name="quantity"
                            initialValue={1}
                          >
                            <InputNumber
                              placeholder="1"
                              size="large"
                              className="w-full rounded-lg bg-gray-50"
                              min={1}
                              max={1000}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                      <Text className="font-semibold text-lg block mb-4">
                        Associated Discount Rule
                      </Text>
                      <Form.Item
                        label={
                          <span className="font-medium">Discount Rule</span>
                        }
                        name="discountRule"
                      >
                        <Select
                          placeholder="Select discount rule"
                          size="large"
                          className="w-full rounded-lg"
                          suffixIcon={<span className="text-gray-400">▼</span>}
                        >
                          <Select.Option value="percentage-15">
                            15% Off All Services
                          </Select.Option>
                          <Select.Option value="fixed-50">
                            $50 Off Bookings
                          </Select.Option>
                          <Select.Option value="bogo">
                            Buy One Get One
                          </Select.Option>
                        </Select>
                      </Form.Item>
                    </div>
                  </div>
                )}

                {/* Step 3: Usage Limits & Channel Restrictions */}
                {policyModalStep === 2 && (
                  <div>
                    <Title level={4} className="!mb-4 text-orange-600">
                      Usage Limits & Channel Restrictions
                    </Title>
                    <Text className="text-gray-600 block mb-6">
                      Configure usage constraints and channel availability
                    </Text>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">
                      <Text className="font-semibold text-lg block mb-4">
                        Usage Limits
                      </Text>
                      <Row gutter={16} className="mb-4">
                        <Col span={12}>
                          <Form.Item
                            label={
                              <span className="font-medium">
                                Minimum Purchase ($)
                              </span>
                            }
                            name="minPurchase"
                            initialValue={0}
                          >
                            <InputNumber
                              placeholder="0"
                              size="large"
                              className="w-full rounded-lg bg-gray-50"
                              min={0}
                              formatter={(value) =>
                                `$ ${value}`.replace(
                                  /\B(?=(\d{3})+(?!\d))/g,
                                  ",",
                                )
                              }
                              parser={(value) =>
                                value?.replace(/\$\s?|(,*)/g, "") || ""
                              }
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            label={
                              <span className="font-medium">
                                Maximum Discount ($)
                              </span>
                            }
                            name="maxDiscount"
                            initialValue={100}
                          >
                            <InputNumber
                              placeholder="100"
                              size="large"
                              className="w-full rounded-lg bg-gray-50"
                              min={0}
                              formatter={(value) =>
                                `$ ${value}`.replace(
                                  /\B(?=(\d{3})+(?!\d))/g,
                                  ",",
                                )
                              }
                              parser={(value) =>
                                value?.replace(/\$\s?|(,*)/g, "") || ""
                              }
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={16} className="mb-6">
                        <Col span={12}>
                          <Form.Item
                            label={
                              <span className="font-medium">
                                Total Usage Limit (Max Redemptions)
                              </span>
                            }
                            name="totalUsageLimit"
                            initialValue={1000}
                          >
                            <InputNumber
                              placeholder="1000"
                              size="large"
                              className="w-full rounded-lg bg-gray-50"
                              min={1}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            label={
                              <span className="font-medium">
                                Per User Limit
                              </span>
                            }
                            name="perUserLimit"
                            initialValue={1}
                          >
                            <InputNumber
                              placeholder="1"
                              size="large"
                              className="w-full rounded-lg bg-gray-50"
                              min={1}
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Form.Item
                        name="allowStacking"
                        valuePropName="checked"
                        className="!mb-0"
                      >
                        <div className="flex items-center">
                          <Switch className="mr-3" />
                          <Text className="font-medium">
                            Allow stacking with other discounts
                          </Text>
                        </div>
                      </Form.Item>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                      <Text className="font-semibold text-lg block mb-4">
                        Channel Restrictions
                      </Text>
                      <div className="mb-4">
                        <Text className="font-medium block mb-3">
                          Available Channels
                        </Text>
                        <Form.Item name="availableChannels" className="!mb-0">
                          <Checkbox.Group className="w-full">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors">
                                <Checkbox value="web" className="scale-110" />
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <span className="text-blue-600">🌐</span>
                                </div>
                                <Text className="font-medium text-blue-800">
                                  Web
                                </Text>
                              </div>
                              <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200 hover:border-green-300 transition-colors">
                                <Checkbox
                                  value="mobile"
                                  className="scale-110"
                                />
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                  <span className="text-green-600">📱</span>
                                </div>
                                <Text className="font-medium text-green-800">
                                  Mobile App
                                </Text>
                              </div>
                              <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg border border-purple-200 hover:border-purple-300 transition-colors">
                                <Checkbox value="ndc" className="scale-110" />
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                  <span className="text-purple-600">💬</span>
                                </div>
                                <Text className="font-medium text-purple-800">
                                  NDC
                                </Text>
                              </div>
                              <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg border border-orange-200 hover:border-orange-300 transition-colors">
                                <Checkbox value="phone" className="scale-110" />
                                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                  <span className="text-orange-600">📞</span>
                                </div>
                                <Text className="font-medium text-orange-800">
                                  Phone
                                </Text>
                              </div>
                            </div>
                          </Checkbox.Group>
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Target Segments & Validity Period */}
                {policyModalStep === 3 && (
                  <div>
                    <Title level={4} className="!mb-4 text-purple-600">
                      Target Segments & Validity Period
                    </Title>
                    <Text className="text-gray-600 block mb-6">
                      Define target customer segments and validity dates
                    </Text>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">
                      <Text className="font-semibold text-lg block mb-4">
                        Target Segments
                      </Text>
                      <div className="mb-4">
                        <Text className="font-medium block mb-3">
                          Customer Segments
                        </Text>
                        <Form.Item name="customerSegments" className="!mb-0">
                          <Checkbox.Group className="w-full">
                            <div className="grid grid-cols-3 gap-4">
                              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                                <Checkbox value="all" className="scale-110" />
                                <Text className="font-medium text-gray-700">
                                  All
                                </Text>
                              </div>
                              <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200 hover:border-green-300 transition-colors">
                                <Checkbox value="new" className="scale-110" />
                                <Text className="font-medium text-green-800">
                                  New Customers
                                </Text>
                              </div>
                              <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200 hover:border-yellow-300 transition-colors">
                                <Checkbox value="vip" className="scale-110" />
                                <Text className="font-medium text-yellow-800">
                                  VIP
                                </Text>
                              </div>
                              <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg border border-purple-200 hover:border-purple-300 transition-colors">
                                <Checkbox
                                  value="premium"
                                  className="scale-110"
                                />
                                <Text className="font-medium text-purple-800">
                                  Premium
                                </Text>
                              </div>
                              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors">
                                <Checkbox
                                  value="business"
                                  className="scale-110"
                                />
                                <Text className="font-medium text-blue-800">
                                  Business
                                </Text>
                              </div>
                              <div className="flex items-center space-x-3 p-4 bg-indigo-50 rounded-lg border border-indigo-200 hover:border-indigo-300 transition-colors">
                                <Checkbox
                                  value="family"
                                  className="scale-110"
                                />
                                <Text className="font-medium text-indigo-800">
                                  Family
                                </Text>
                              </div>
                              <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg border border-orange-200 hover:border-orange-300 transition-colors">
                                <Checkbox
                                  value="platinum"
                                  className="scale-110"
                                />
                                <Text className="font-medium text-orange-800">
                                  Platinum
                                </Text>
                              </div>
                            </div>
                          </Checkbox.Group>
                        </Form.Item>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                      <Text className="font-semibold text-lg block mb-4">
                        Validity Period (Start/End Date)
                      </Text>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            label={
                              <span className="font-medium">Start Date</span>
                            }
                            name="startDate"
                            rules={[
                              {
                                required: true,
                                message: "Please select start date",
                              },
                            ]}
                          >
                            <DatePicker
                              placeholder="Select start date"
                              size="large"
                              className="w-full rounded-lg"
                              format="MMM DD, YYYY"
                              suffixIcon={
                                <CalendarOutlined className="text-gray-400" />
                              }
                              disabledDate={(current) =>
                                current && current.isBefore(new Date(), "day")
                              }
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            label={
                              <span className="font-medium">End Date</span>
                            }
                            name="endDate"
                            rules={[
                              {
                                required: true,
                                message: "Please select end date",
                              },
                            ]}
                          >
                            <DatePicker
                              placeholder="Select end date"
                              size="large"
                              className="w-full rounded-lg"
                              format="MMM DD, YYYY"
                              suffixIcon={
                                <CalendarOutlined className="text-gray-400" />
                              }
                              disabledDate={(current) =>
                                current && current.isBefore(new Date(), "day")
                              }
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Default form for other tabs
            <div>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please enter name" }]}
              >
                <Input placeholder="Enter name" size="large" />
              </Form.Item>
            </div>
          )}

          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
            <Button
              onClick={() => {
                setIsModalVisible(false);
                setEditingOffer(null);
                setPolicyModalStep(0);
                form.resetFields();
              }}
              size="large"
            >
              Cancel
            </Button>

            <div className="flex space-x-3">
              {activeTab === "policies" && (
                <>
                  <Button
                    onClick={() =>
                      setPolicyModalStep(Math.max(0, policyModalStep - 1))
                    }
                    disabled={policyModalStep === 0}
                    size="large"
                  >
                    Previous
                  </Button>
                  {policyModalStep < 4 ? (
                    <Button
                      type="primary"
                      onClick={() =>
                        setPolicyModalStep(Math.min(4, policyModalStep + 1))
                      }
                      className="bg-blue-600 hover:bg-blue-700"
                      size="large"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="bg-green-600 hover:bg-green-700"
                      size="large"
                    >
                      Create Policy
                    </Button>
                  )}
                </>
              )}

              {activeTab === "ancillaries" && (
                <>
                  <Button
                    onClick={() =>
                      setPolicyModalStep(Math.max(0, policyModalStep - 1))
                    }
                    disabled={policyModalStep === 0}
                    size="large"
                  >
                    Previous
                  </Button>
                  {policyModalStep < 1 ? (
                    <Button
                      type="primary"
                      onClick={(e) => {
                        e.preventDefault();
                        setPolicyModalStep(Math.min(1, policyModalStep + 1));
                      }}
                      className="bg-blue-600 hover:bg-blue-700"
                      size="large"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="bg-blue-600 hover:bg-blue-700"
                      size="large"
                    >
                      Create Ancillary
                    </Button>
                  )}
                </>
              )}

              {activeTab === "discounts" && (
                <>
                  <Button
                    onClick={() =>
                      setPolicyModalStep(Math.max(0, policyModalStep - 1))
                    }
                    disabled={policyModalStep === 0}
                    size="large"
                  >
                    Previous
                  </Button>
                  {policyModalStep < 4 ? (
                    <Button
                      type="primary"
                      onClick={() =>
                        setPolicyModalStep(Math.min(4, policyModalStep + 1))
                      }
                      className="bg-blue-600 hover:bg-blue-700"
                      size="large"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="bg-green-600 hover:bg-green-700"
                      size="large"
                    >
                      Create Discount
                    </Button>
                  )}
                </>
              )}

              {activeTab === "promocodes" && (
                <>
                  <Button
                    onClick={() =>
                      setPolicyModalStep(Math.max(0, policyModalStep - 1))
                    }
                    disabled={policyModalStep === 0}
                    size="large"
                  >
                    Previous
                  </Button>
                  {policyModalStep < 3 ? (
                    <Button
                      type="primary"
                      onClick={() =>
                        setPolicyModalStep(Math.min(3, policyModalStep + 1))
                      }
                      className="bg-blue-600 hover:bg-blue-700"
                      size="large"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="bg-green-600 hover:bg-green-700"
                      size="large"
                    >
                      Create Promo Code
                    </Button>
                  )}
                </>
              )}

              {(
                // Other forms
                <>
                  {activeTab !== "policies" &&
                    activeTab !== "ancillaries" &&
                    activeTab !== "discounts" &&
                    activeTab !== "promocodes" &&
                    activeTab !== "offers" && (
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="bg-blue-600 hover:bg-blue-700"
                        size="large"
                      >
                        Create
                      </Button>
                    )}
                </>
              )}
            </div>
          </div>
        </Form>
      </Modal>

      {/* Create Offer Modal - Separate Component */}
      <CreateOfferModal
        visible={isModalVisible && activeTab === "offers"}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingOffer(null);
        }}
        onSubmit={(values) => {
          console.log("Offer values:", values);
          setIsModalVisible(false);
        }}
        editingOffer={editingOffer}
      />

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
      <style jsx>{`
        .custom-modal .ant-modal-header {
          border-bottom: none;
          padding: 24px 32px 0;
        }

        .custom-modal .ant-modal-title {
          font-size: 18px;
          font-weight: 600;
        }

        .custom-steps .ant-steps-item-title {
          font-weight: 500;
          font-size: 14px;
        }

        .custom-steps .ant-steps-item-description {
          font-size: 12px;
          color: #6b7280;
        }

        .custom-steps .ant-steps-item-finish .ant-steps-item-icon {
          background-color: #10b981;
          border-color: #10b981;
        }

        .custom-steps .ant-steps-item-process .ant-steps-item-icon {
          background-color: #3b82f6;
          border-color: #3b82f6;
        }

        .ant-form-item-label > label {
          font-weight: 500;
          color: #374151;
        }

        .ant-input,
        .ant-select-selector,
        .ant-input-number {
          border-radius: 6px;
          border-color: #d1d5db;
          transition: all 0.2s ease;
        }

        .ant-input:focus,
        .ant-select-focused .ant-select-selector,
        .ant-input-number:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }

        .ant-switch-checked {
          background-color: #10b981;
        }
      `}</style>
    </div>
  );
}