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
  Progress,
  Tabs,
  Breadcrumb,
  Badge,
  message,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  GiftOutlined,
  DollarOutlined,
  PercentageOutlined,
  HomeOutlined,
  RiseOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AdminHeader from "./admin-header";
import AdminSidebar from "./admin-sidebar";
import CreateOfferModal from "../../components/admin/create-offer-modal";
import CreatePolicyModal from "../../components/admin/create-policy-modal";
import CreateAncillaryModal from "../../components/admin/create-ancillary-modal";
import CreateDiscountModal from "../../components/admin/create-discount-modal";
import CreatePromoCodeModal from "../../components/admin/create-promocode-modal";
import dayjs from "dayjs";
const { Title, Text } = Typography;

export default function OfferManagement() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);
  const [policyTableData, setPolicyTableData] = useState([
    {
      policyName: "check",
      policyEnabled: true,
      allowRefunds: true,
      allowChanges: true,
      priorityLevel: "high",
      policyDescription: "check",
      refundDeadline: 24,
      refundPercentage: 100,
      refundFee: 10,
      changeDeadline: 24,
      changeFee: 10,
      corporateCustomersOnly: true,
      loyaltyTiers: ["gold"],
      passengerTypes: ["child", "adult"],
      minAge: 18,
      maxAge: 62,
      requiresAdultSupervision: true,
      bookingChannels: ["website", "mobile"],
      allowDiscountStacking: true,
      hasBlackoutDates: true,
      conflictingOffers1: ["comfort-plus"],
      blackoutStartDate: "2025-07-31T18:30:00.000Z",
      blackoutEndDate: "2025-08-06T18:30:00.000Z",
      validFrom: "2025-07-31T18:30:00.000Z",
      validTo: "2025-08-10T18:30:00.000Z",
    },
  ]);
  const [ancillaryTableData, setAncillaryTableData] = useState<any>([
    {
      ancillaryName: "check",
      category: "food-beverage",
      ancillaryType: "optional",
      status: "active",
      refundable: true,
      changeable: true,
      transferable: true,
    },
  ]);
  const [discountTableData, setDiscountTableData] = useState<any>([
    {
      discountName: "Loyalty Member Discount",
      discountCode: "LOYALTY15",
      description: "Exclusive discount for premium members",
      discountType: "percentage",
      discountValue: 10,
      status: "active",
      targetApplication: "ancillariesOnly",
      totalUsageLimit: 1000,
      perUserLimit: 1,
      maxDiscountCap: 1,
      loyaltyTiers: ["gold"],
      geographicEligibility: ["US"],
      routeRestrictions: ["LAX-JFK"],
      validFrom: "2025-07-31T18:30:00.000Z",
      validTo: "2025-07-31T18:30:00.000Z",
      blackoutDates: "2025-07-31T18:30:00.000Z",
      allowPromoCodeCombination: true,
    },
  ]);
  const [promoCodeTableData, setPromoCodeTableData] = useState<any>([
    {
      promoName: "Promo",
      promoCode: "PROMO10",
      description: "Get discounts",
      discountType: "percentage",
      discountValue: 25,
      status: "active",
      generationType: "manual",
      prefix: "PROMO",
      codeLength: 8,
      quantity: 1,
      discountRule: "fixed-50",
      allowStacking: true,
      minPurchase: 0,
      maxDiscount: 100,
      totalUsageLimit: 1000,
      perUserLimit: 1,
      availableChannels: ["web", "mobile"],
      customerSegments: ["all"],
      startDate: "2025-07-31T18:30:00.000Z",
      endDate: "2025-08-30T18:30:00.000Z",
    },
  ]);
  const [offersTableData, setOffersTableData] = useState<any>([
    {
      offerName: "Offer",
      offerCode: "OFFER10",
      description: "offer 10%",
      status: "draft",
      basePrice: 0,
      startDate: "2025-07-31T18:30:00.000Z",
      endDate: "2025-08-08T18:30:00.000Z",
      ancillaryServices: [
        "extra-legroom",
        "premium-meal",
        "extra-baggage",
        "priority-boarding",
      ],
      customerSegments: ["business"],
      behaviorTriggers: ["previous-premium"],
      contextFactors: ["flight-duration"],
      enableDynamicPricing: true,
      promoCodes: ["BUSINESS25", "PREMIUM15"],
      loyaltyDiscount: 10,
      bundleDiscount: 10,
      allowDiscountStacking: true,
      enableWebsite: true,
      enableMobile: true,
      mobileOptimized: true,
      enableAPI: true,
      enableDNC: true,
    },
  ]);

  console.log(
    policyTableData,
    ancillaryTableData,
    discountTableData,
    promoCodeTableData,
    offersTableData
  );

  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    // Check if admin is logged in
    const isAdminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isAdminLoggedIn) {
      navigate("/admin/login");
    }
  }, [navigate]);

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
                                    strokeColor="var(--infiniti-lighter-blue)"
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
                                    strokeColor="var(--infiniti-lighter-blue)"
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
                                    strokeColor="var(--infiniti-lighter-blue)"
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
                                    strokeColor="var(--ant-color-success)"
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
                                    strokeColor="var(--ant-color-success)"
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
            className="mb-3"
            items={[
              {
                key: "dashboard",
                label: (
                  <span>
                    <BarChartOutlined className="pr-1"/>
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
                    <PercentageOutlined className="pr-1" />
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
                    <span className="mr-2">
                      <GiftOutlined />
                    </span>
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
                  dataSource={policyTableData}
                  columns={[
                    {
                      title: "Policy Name",
                      dataIndex: "policyName",
                      key: "policyName",
                      render: (text) => (
                        <Text className="font-medium">
                          {text?.replace(/^./, (char: any) =>
                            char.toUpperCase()
                          )}
                        </Text>
                      ),
                    },
                    {
                      title: "Priority level",
                      dataIndex: "priorityLevel",
                      key: "priorityLevel",
                      render: (priorityLevel) => (
                        <Tag
                          color={
                            priorityLevel === "high"
                              ? "red"
                              : priorityLevel === "medium"
                              ? "blue"
                              : "green"
                          }
                          className="rounded-md"
                        >
                          {priorityLevel?.replace(/^./, (char: any) =>
                            char.toUpperCase()
                          )}
                        </Tag>
                      ),
                    },
                    {
                      title: "Booking channels",
                      dataIndex: "bookingChannels",
                      key: "bookingChannels",
                      render: (bookingChannels) =>
                        bookingChannels
                          ?.map((item: string) =>
                            item
                              .trim()
                              .replace(/^./, (char) => char.toUpperCase())
                          )
                          .join(" | "),
                    },
                    {
                      title: "Effective Date",
                      dataIndex: "validFrom",
                      key: "validFrom",
                      render: (validFrom) =>
                        dayjs(validFrom).format("DD MMM, YYYY"),
                    },
                    {
                      title: "Discontinue Date",
                      dataIndex: "validTo",
                      key: "validTo",
                      render: (validTo) =>
                        dayjs(validTo).format("DD MMM, YYYY"),
                    },
                    {
                      title: "Status",
                      dataIndex: "policyEnabled",
                      key: "policyEnabled",
                      render: (policyEnabled) => {
                        return (
                          <Tag color={policyEnabled ? "green" : "red"} className="rounded-md">
                            {policyEnabled ? "Active" : "In-active"}
                          </Tag>
                        );
                      },
                    },
                    {
                      title: "Actions",
                      key: "actions",
                      render: (_, record: any, index) => (
                        <Space>
                          <Button
                            type="text"
                            icon={<EditOutlined />}
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() => {
                              record.id = index;
                              setEditingData(record);
                              setIsModalVisible(true);
                            }}
                          />
                          <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            className="text-red-600 hover:text-red-700"
                            onClick={() => setPolicyTableData(prev => prev.filter((_, i) => i !== index))}
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

                <Table
                  dataSource={ancillaryTableData}
                  columns={[
                    {
                      title: "Ancillary Name",
                      dataIndex: "ancillaryName",
                      key: "ancillaryName",
                      render: (ancillaryName) => (
                        <Text className="font-medium">
                          {ancillaryName?.replace(/^./, (char: any) =>
                            char.toUpperCase()
                          )}
                        </Text>
                      ),
                    },
                    {
                      title: "Ancillary type",
                      dataIndex: "ancillaryType",
                      key: "ancillaryType",
                      render: (ancillaryType) =>
                        ancillaryType?.replace(/^./, (char: any) =>
                          char.toUpperCase()
                        ), // capitalize the first character
                    },
                    {
                      title: "Category",
                      dataIndex: "category",
                      key: "category",
                      render: (category) =>
                        category
                          ?.split("-")
                          ?.join(" ")
                          ?.replace(/([A-Z])/g, " $1") // insert space before capital letters
                          ?.replace(/^./, (char: any) => char.toUpperCase()), // capitalize the first character
                    },
                    {
                      title: "Terms and conditions",
                      dataIndex: "refundable",
                      key: "refundable",
                      render: (refundable, data: any) =>
                        `${refundable && "Refundable"}${
                          data?.transferable ? " | Transferable" : ""
                        }${data?.changeable ? " | Changeable" : ""}`,
                    },
                    {
                      title: "Status",
                      dataIndex: "policyEnabled",
                      key: "policyEnabled",
                      render: (policyEnabled) => {
                        return (
                          <Tag color={policyEnabled ? "green" : "red"} className="rounded-md">
                            {policyEnabled ? "Active" : "In-active"}
                          </Tag>
                        );
                      },
                    },
                    {
                      title: "Actions",
                      key: "actions",
                      render: (_, record, index) => (
                        <Space>
                          <Button
                            type="text"
                            icon={<EditOutlined />}
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() => {
                              record.id = index;
                              setEditingData(record);
                              setIsModalVisible(true);
                            }}
                          />
                          <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            className="text-red-600 hover:text-red-700"
                            onClick={() => setAncillaryTableData((prev:any) => prev.filter((_:any, i:number) => i !== index))}
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
                  dataSource={discountTableData}
                  columns={[
                    {
                      title: "Discount Details",
                      dataIndex: "discountName",
                      key: "discountName",
                      width: "25%",
                      render: (text, record: any) => (
                        <div>
                          <Text className="font-semibold text-gray-900 block">
                            {text?.replace(/^./, (char: any) =>
                              char.toUpperCase()
                            )}
                          </Text>
                          <Text className="text-blue-600 text-sm font-medium block">
                            Code: {record.discountCode}
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
                              {record.discountValue}
                            </Text>
                          </div>
                          <Text className="text-gray-600 text-sm">
                            {record.discountType}
                          </Text>
                        </div>
                      ),
                    },
                    {
                      title: "Target",
                      key: "target",
                      width: "15%",
                      render: (_, record) => (
                        <Text className="text-gray-600 text-sm block">
                          {
                            record?.targetApplication
                              ?.replace(/([A-Z])/g, " $1") // insert space before capital letters
                              ?.replace(/^./, (char: any) => char.toUpperCase()) // capitalize the first character
                          }
                        </Text>
                      ),
                    },
                    {
                      title: "Usage",
                      key: "usage",
                      width: "12%",
                      render: (_, record) => (
                        <div>
                          <Text className="font-semibold block">
                            10/{record.totalUsageLimit}
                          </Text>
                          <Progress
                            percent={10}
                            strokeColor="var(--infiniti-lighter-blue)"
                            showInfo={false}
                            size="small"
                            className="mb-1"
                          />
                          <Text className="text-gray-500 text-xs">
                            {`${(10/(record.totalUsageLimit || 100)).toFixed(2)}`} % used
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
                            <Text className="block">
                              {dayjs(record.validFrom).format("DD MMM, YYYY")}
                            </Text>
                          </div>
                          <div>
                            <Text className="text-gray-500 text-xs">To:</Text>
                            <Text className="block">
                              {dayjs(record.validTo).format("DD MMM, YYYY")}
                            </Text>
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
                        <Tag color={status === "active" ? "green" : "red"} className="rounded-md">
                          {status?.replace(/^./, (char: any) =>
                            char.toUpperCase()
                          )}
                        </Tag>
                      ),
                    },
                    {
                      title: "Actions",
                      key: "actions",
                      width: "10%",
                      render: (_, record, index) => (
                        <Space>
                          <Button
                            type="text"
                            icon={<EditOutlined />}
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() => {
                              record.id = index;
                              setEditingData(record);
                              setIsModalVisible(true);
                            }}
                          />
                          <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            className="text-red-600 hover:text-red-700"
                            onClick={() => setDiscountTableData((prev:any) => prev.filter((_:any, i:number) => i !== index))}
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
                  dataSource={promoCodeTableData}
                  columns={[
                    {
                      title: "Code",
                      dataIndex: "promoCode",
                      key: "promoCode",
                      width: 130,
                      render: (promoCode) => (
                        <div className="flex items-center space-x-2">
                          <Text className="font-mono text-xs bg-gray-100 px-2 py-1 rounded font-semibold">
                            {promoCode}
                          </Text>
                        </div>
                      ),
                    },
                    {
                      title: "Name",
                      key: "promoName",
                      width: 150,
                      render: (_, record: any) => (
                        <div>
                          <Text className="font-semibold text-gray-900 block">
                            {record.promoName}
                          </Text>
                          <Text className="text-gray-600 text-sm">
                            {record.description}
                          </Text>
                        </div>
                      ),
                    },
                    {
                      title: "Type",
                      dataIndex: "discountType",
                      key: "discountType",
                      width: "10%",
                      render: (discountType) => (
                        <Tag color="orange" className="rounded-md">
                          {discountType?.replace(/^./, (char: any) =>
                            char.toUpperCase()
                          )}
                        </Tag>
                      ),
                    },
                    {
                      title: "Value",
                      key: "discountValue",
                      width: "12%",
                      render: (_, record) => (
                        <div>
                          <Text className="font-bold text-lg block">
                            {record.discountValue}
                          </Text>
                          <Text className="text-gray-500 text-xs">
                            Max: {record.maxDiscount}
                          </Text>
                        </div>
                      ),
                    },
                    {
                      title: "Effective Date",
                      dataIndex: "startDate",
                      key: "startDate",
                      width: 130,
                      render: (startDate) =>
                        dayjs(startDate).format("DD MMM, YYYY"),
                    },
                    {
                      title: "Discontinue Date",
                      dataIndex: "endDate",
                      key: "endDate",
                      width: 137,
                      render: (endDate) =>
                        dayjs(endDate).format("DD MMM, YYYY"),
                    },
                    {
                      title: "Status",
                      dataIndex: "status",
                      key: "status",
                      render: (status) => (
                        <Tag color={status === "active" ? "green" : "red"} className="rounded-md">
                          {status?.replace(/^./, (char: any) =>
                            char.toUpperCase()
                          )}
                        </Tag>
                      ),
                    },
                    {
                      title: "Actions",
                      key: "actions",
                      width: "6%",
                      render: (_, record, index) => (
                        <Space>
                          <Button
                            type="text"
                            icon={<EditOutlined />}
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() => {
                              record.id = index;
                              setEditingData(record);
                              setIsModalVisible(true);
                            }}
                          />
                          <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            className="text-red-600 hover:text-red-700"
                            onClick={() => setPromoCodeTableData((prev:any) => prev.filter((_:any, i:number) => i !== index))}
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
                  dataSource={offersTableData}
                  columns={[
                    {
                      title: "Offer Details",
                      dataIndex: "offerName",
                      key: "offerName",
                      width: 210,
                      render: (text, record:any) => (
                        <div>
                          <Text className="font-semibold text-gray-900 block">
                            {text}
                          </Text>
                          <Text className="text-blue-600 text-sm font-medium block">
                            Code: {record.offerCode}
                          </Text>
                          <Text className="text-gray-600 text-sm">
                            {record.description}
                          </Text>
                        </div>
                      ),
                    },
                    {
                      title: "Ancillary Services",
                      dataIndex: "ancillaryServices",
                      key: "ancillaryServices",
                      width: 220,
                      render: (ancillaryServices) => (
                        <div className="space-y-1">
                          {ancillaryServices?.map(
                            (service: any, index: number) => (
                              <div
                                key={index}
                                className="flex items-center space-x-2"
                              >
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                <Text className="text-sm text-gray-700">
                                  {service
                                    .split("-")
                                    .map(
                                      (word: any) =>
                                        word.charAt(0).toUpperCase() +
                                        word.slice(1)
                                    )
                                    .join(" ")}
                                </Text>
                              </div>
                            )
                          )}
                        </div>
                      ),
                    },
                    {
                      title: "Effective Date",
                      dataIndex: "startDate",
                      key: "startDate",
                      width: 175,
                      render: (startDate) =>
                        dayjs(startDate).format("DD MMM, YYYY"),
                    },
                    {
                      title: "Discontinue Date",
                      dataIndex: "endDate",
                      key: "endDate",
                      width: 175,
                      render: (endDate) =>
                        dayjs(endDate).format("DD MMM, YYYY"),
                    },
                    {
                      title: "Status",
                      dataIndex: "status",
                      key: "status",
                      width: "8%",
                      render: (status) => (
                        <Tag color={status === "active" ? "green" : status === "draft" ? "orange" : "red"} className="rounded-md">
                          {status?.replace(/^./, (char: any) =>
                            char.toUpperCase()
                          )}
                        </Tag>
                      ),
                    },
                    {
                      title: "Actions",
                      key: "actions",
                      render: (_, record: any, index) => (
                        <Space>
                          <Button
                            type="text"
                            icon={<EditOutlined />}
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() => {
                              record.id = index;
                              setEditingData(record);
                              setIsModalVisible(true);
                            }}
                          />
                          <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            className="text-red-600 hover:text-red-700"
                            onClick={() => setOffersTableData((prev:any) => prev.filter((_:any, i:number) => i !== index))}
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

      {activeTab === "policies" && (
        /* Create policy Modal */
        <CreatePolicyModal
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          editingData={editingData}
          setEditingData={setEditingData}
          setPolicyTableData={(values) => {
            setPolicyTableData((prev:any) => {
              if(editingData && Object.keys(editingData)?.length) {
                let temp = JSON.parse(JSON.stringify(prev));
                temp[editingData?.id] = values;
                return temp;
              } else {
                return ( 
                  prev?.length ? [...prev, values] : [values]
                )
              }
            });
            message.success(`Policy ${(editingData && Object.keys(editingData)?.length) ? " updated" : "created"} successfully`);
          }}
        />
      )}

      {activeTab === "ancillaries" && (
        /* Create ancillary Modal */
        <CreateAncillaryModal
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          editingData={editingData}
          setEditingData={setEditingData}
          setAncillaryTableData={(values) => {
            setAncillaryTableData((prev:any) => {
              if(editingData && Object.keys(editingData)?.length) {
                let temp = JSON.parse(JSON.stringify(prev));
                temp[editingData?.id] = values;
                return temp;
              } else {
                return ( 
                  prev?.length ? [...prev, values] : [values]
                )
              }
            });
            message.success(`Ancillaries ${(editingData && Object.keys(editingData)?.length) ? " updated" : "created"} successfully`);
          }}
        />
      )}

      {activeTab === "discounts" && (
        /* Create ancillary Modal */
        <CreateDiscountModal
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          editingData={editingData}
          setEditingData={setEditingData}
          setDiscountTableData={(values) => {
            setDiscountTableData((prev:any) => {
              if(editingData && Object.keys(editingData)?.length) {
                let temp = JSON.parse(JSON.stringify(prev));
                temp[editingData?.id] = values;
                return temp;
              } else {
                return ( 
                  prev?.length ? [...prev, values] : [values]
                )
              }
            });
            message.success(`Discounts ${(editingData && Object.keys(editingData)?.length) ? " updated" : "created"} successfully`);
          }}
        />
      )}

      {activeTab === "promocodes" && (
        /* Create ancillary Modal */
        <CreatePromoCodeModal
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          editingData={editingData}
          setEditingData={setEditingData}
          setPromoCodeTableData={(values) => {
            setPromoCodeTableData((prev:any) => {
              if(editingData && Object.keys(editingData)?.length) {
                let temp = JSON.parse(JSON.stringify(prev));
                temp[editingData?.id] = values;
                return temp;
              } else {
                return ( 
                  prev?.length ? [...prev, values] : [values]
                )
              }
            });
            message.success(`Promo code ${(editingData && Object.keys(editingData)?.length) ? " updated" : "created"} successfully`);
          }}
        />
      )}

      {activeTab === "offers" && (
        /* Create Offer Modal - Separate Component */
        <CreateOfferModal
          visible={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setEditingData(null);
          }}
          setIsModalVisible={setIsModalVisible}
          editingData={editingData}
          setOffersTableData={(values) => {
            setEditingData(null);
            setOffersTableData((prev:any) => {
              if(editingData && Object.keys(editingData)?.length) {
                let temp = JSON.parse(JSON.stringify(prev));
                temp[editingData?.id] = values;
                return temp;
              } else {
                return ( 
                  prev?.length ? [...prev, values] : [values]
                )
              }
            });
            message.success(`Offer ${(editingData && Object.keys(editingData)?.length) ? " updated" : "created"} successfully`);
          }}
        />
      )}



      <style jsx global>
        {`
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
            border-bottom: 2px solid var(--textBlue500);
          }

          .ant-card {
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
            border: 1px solid var(--ant-border-color);
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
            // background-color: #f8fafc;
            border-bottom: 1px solid #e2e8f0;
            font-weight: 600;
          }

          .custom-table .ant-table-tbody > tr > td {
            border-bottom: 1px solid #f1f5f9;
          }

          .custom-table .ant-table-tbody > tr:hover > td {
            background-color: #f8fafc;
          }
        `}
      </style>

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