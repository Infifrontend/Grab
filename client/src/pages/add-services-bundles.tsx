import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Checkbox,
  Badge,
  InputNumber,
  Space,
  Divider,
  Tabs,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import BookingSteps from "@/components/booking/booking-steps";

const { Title, Text } = Typography;

interface BundleOption {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  savings: number;
  features: string[];
  popular?: boolean;
  icon: string;
  color: string;
}

interface IndividualService {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

const premiumBundles: BundleOption[] = [
  {
    id: "ultimate-comfort",
    name: "Ultimate Comfort Bundle",
    description: "Complete premium experience for your group",
    originalPrice: 399,
    discountedPrice: 299,
    savings: 100,
    popular: true,
    icon: "✈️",
    color: "purple",
    features: [
      "Business class upgrade",
      "Airport lounge access",
      "Priority boarding & check-in",
      "Extra baggage (2×23kg)",
      "Premium meal selection",
      "Fast track security",
      "Complimentary WiFi",
      "Travel insurance",
    ],
  },
  {
    id: "group-explorer",
    name: "Group Explorer Bundle",
    description: "Perfect for leisure groups and families",
    originalPrice: 249,
    discountedPrice: 189,
    savings: 60,
    icon: "🗺️",
    color: "blue",
    features: [
      "Seat selection for all",
      "Extra legroom seats",
      "Priority boarding",
      "1 checked bag (23kg)",
      "In-flight entertainment",
      "Group meal coordination",
      "Travel assistance",
    ],
  },
  {
    id: "business-traveler-pro",
    name: "Business Traveler Pro",
    description: "Designed for corporate groups",
    originalPrice: 269,
    discountedPrice: 229,
    savings: 40,
    icon: "💼",
    color: "gray",
    features: [
      "Premium economy upgrade",
      "Airport lounge access",
      "Fast track security",
      "Priority baggage handling",
      "Business meal options",
      "Meeting room access",
      "Corporate travel insurance",
    ],
  },
];

const standardBundles: BundleOption[] = [
  {
    id: "comfort-plus",
    name: "Comfort Plus Bundle",
    description: "Extra comfort for your journey",
    originalPrice: 119,
    discountedPrice: 89,
    savings: 30,
    popular: true,
    icon: "🎯",
    color: "green",
    features: [
      "Extra legroom seats",
      "Priority boarding",
      "1 checked bag (23kg)",
      "Priority check-in",
    ],
  },
  {
    id: "family-package",
    name: "Family Package",
    description: "Great value for families",
    originalPrice: 164,
    discountedPrice: 129,
    savings: 35,
    icon: "👨‍👩‍👧‍👦",
    color: "orange",
    features: [
      "Seat selection for all",
      "Extra baggage allowance",
      "Kids meal options",
      "Family check-in",
    ],
  },
  {
    id: "travel-essentials",
    name: "Travel Essentials",
    description: "Basic add-ons for budget-conscious travelers",
    originalPrice: 79,
    discountedPrice: 59,
    savings: 20,
    icon: "✅",
    color: "teal",
    features: [
      "Seat selection",
      "1 checked bag (20kg)",
      "Standard meal",
      "Online check-in",
    ],
  },
];

export default function AddServicesBundles() {
  const [, setLocation] = useLocation();
  const [selectedBundles, setSelectedBundles] = useState<string[]>([]);
  const [individualServiceCounts, setIndividualServiceCounts] = useState<
    Record<string, number>
  >({});
  const [bookingData, setBookingData] = useState<any>(null);

  // Load booking data from localStorage
  useEffect(() => {
    const storedBookingData = localStorage.getItem('bookingFormData');
    if (storedBookingData) {
      setBookingData(JSON.parse(storedBookingData));
    }
  }, []);

  const handleBack = () => {
    setLocation("/flight-search-bundle");
  };

  const handleContinue = () => {
    console.log("Continue to Group Leader");
    setLocation("/group-leader");
  };

  const toggleBundle = (bundleId: string) => {
    setSelectedBundles((prev) =>
      prev.includes(bundleId)
        ? prev.filter((id) => id !== bundleId)
        : [...prev, bundleId],
    );
  };

  const updateServiceCount = (serviceId: string, count: number) => {
    setIndividualServiceCounts((prev) => ({
      ...prev,
      [serviceId]: Math.max(0, count),
    }));
  };

  const BundleCard = ({
    bundle,
    isSelected,
    onToggle,
  }: {
    bundle: BundleOption;
    isSelected: boolean;
    onToggle: () => void;
  }) => (
    <div className="relative">
      {bundle.popular && (
        <div className="absolute -top-3 left-4 z-10">
          <Badge
            color="purple"
            text="Best Value"
            className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium"
          />
        </div>
      )}
      <Card
        className={`h-full cursor-pointer transition-all border-2 ${
          isSelected
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200 hover:border-gray-300"
        }`}
        onClick={onToggle}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl bg-${bundle.color}-100`}
            >
              {bundle.icon}
            </div>
            <div>
              <Title level={5} className="!mb-1">
                {bundle.name}
              </Title>
              <Text className="text-gray-600 text-sm">
                {bundle.description}
              </Text>
            </div>
          </div>
          <Checkbox checked={isSelected} />
        </div>

        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <Text className="text-2xl font-bold">
              ₹{bundle.discountedPrice}
            </Text>
            <Text className="text-gray-500 line-through">
              ₹{bundle.originalPrice}
            </Text>
            <Text className="text-green-600 font-medium text-sm">
              Save ₹{bundle.savings}
            </Text>
          </div>
        </div>

        <div className="space-y-2">
          {bundle.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckOutlined className="text-green-500 text-xs" />
              <Text className="text-sm text-gray-700">{feature}</Text>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const ServiceCounter = ({
    service,
    count,
    onUpdate,
  }: {
    service: IndividualService;
    count: number;
    onUpdate: (count: number) => void;
  }) => (
    <div className="flex justify-between items-center py-4">
      <div className="flex-1">
        <Title level={5} className="!mb-1">
          {service.name}
        </Title>
        <Text className="text-gray-600 text-sm">{service.description}</Text>
        <Text className="font-bold">₹{service.price}</Text>
      </div>
      <div className="flex items-center gap-2">
        <Button
          icon={<MinusOutlined />}
          size="small"
          onClick={() => onUpdate(count - 1)}
          disabled={count === 0}
        />
        <span className="mx-3 min-w-[2rem] text-center">{count}</span>
        <Button
          icon={<PlusOutlined />}
          size="small"
          onClick={() => onUpdate(count + 1)}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Booking Steps */}
        <div className="mb-8">
          <BookingSteps currentStep={2} size="small" className="mb-6" />
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <Title level={2} className="!mb-2 text-gray-900">
            Add Services & Bundles
          </Title>
          <Text className="text-gray-600">
            Choose from our curated bundles or select individual services to
            enhance your group travel experience.
          </Text>
        </div>

        {/* Premium Bundles */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Title level={3} className="!mb-0 text-gray-800">
              Premium Bundles
            </Title>
            <Badge
              color="purple"
              text="Best Value"
              className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium"
            />
          </div>

          <Row gutter={[24, 24]}>
            {premiumBundles.map((bundle) => (
              <Col xs={24} lg={8} key={bundle.id}>
                <BundleCard
                  bundle={bundle}
                  isSelected={selectedBundles.includes(bundle.id)}
                  onToggle={() => toggleBundle(bundle.id)}
                />
              </Col>
            ))}
          </Row>
        </div>

        {/* Standard Bundles */}
        <div className="mb-8">
          <Title level={3} className="!mb-6 text-gray-800">
            Standard Bundles
          </Title>

          <Row gutter={[24, 24]}>
            {standardBundles.map((bundle) => (
              <Col xs={24} lg={8} key={bundle.id}>
                <BundleCard
                  bundle={bundle}
                  isSelected={selectedBundles.includes(bundle.id)}
                  onToggle={() => toggleBundle(bundle.id)}
                />
              </Col>
            ))}
          </Row>
        </div>

        {/* Individual Services */}
        <div className="mb-8">
          <Title level={3} className="!mb-6 text-gray-800">
            Individual Services
          </Title>

          <Card>
            <Tabs
              defaultActiveKey="comfort"
              type="card"
              className="individual-services-tabs"
              items={[
                {
                  key: "comfort",
                  label: (
                    <span className="flex items-center gap-2">
                      <span>🛋️</span>
                      Comfort
                    </span>
                  ),
                  children: (
                    <div className="space-y-4">
                      <Row gutter={[24, 24]}>
                        <Col xs={24} md={12}>
                          <div className="flex justify-between items-center py-4">
                            <div className="flex-1">
                              <Title level={5} className="!mb-1">
                                Seat Selection
                              </Title>
                              <Text className="text-gray-600 text-sm">
                                Choose your preferred seat
                              </Text>
                              <Text className="font-bold text-lg">₹25</Text>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                icon={<MinusOutlined />}
                                size="small"
                                onClick={() =>
                                  updateServiceCount(
                                    "seat-selection",
                                    (individualServiceCounts[
                                      "seat-selection"
                                    ] || 0) - 1,
                                  )
                                }
                                disabled={
                                  (individualServiceCounts["seat-selection"] ||
                                    0) === 0
                                }
                              />
                              <span className="mx-3 min-w-[2rem] text-center">
                                {individualServiceCounts["seat-selection"] || 0}
                              </span>
                              <Button
                                icon={<PlusOutlined />}
                                size="small"
                                onClick={() =>
                                  updateServiceCount(
                                    "seat-selection",
                                    (individualServiceCounts[
                                      "seat-selection"
                                    ] || 0) + 1,
                                  )
                                }
                              />
                            </div>
                          </div>
                        </Col>
                        <Col xs={24} md={12}>
                          <div className="flex justify-between items-center py-4">
                            <div className="flex-1">
                              <Title level={5} className="!mb-1">
                                Airport Lounge Access
                              </Title>
                              <Text className="text-gray-600 text-sm">
                                Relax in premium lounges
                              </Text>
                              <Text className="font-bold text-lg">₹65</Text>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                icon={<MinusOutlined />}
                                size="small"
                                onClick={() =>
                                  updateServiceCount(
                                    "airport-lounge",
                                    (individualServiceCounts[
                                      "airport-lounge"
                                    ] || 0) - 1,
                                  )
                                }
                                disabled={
                                  (individualServiceCounts["airport-lounge"] ||
                                    0) === 0
                                }
                              />
                              <span className="mx-3 min-w-[2rem] text-center">
                                {individualServiceCounts["airport-lounge"] || 0}
                              </span>
                              <Button
                                icon={<PlusOutlined />}
                                size="small"
                                onClick={() =>
                                  updateServiceCount(
                                    "airport-lounge",
                                    (individualServiceCounts[
                                      "airport-lounge"
                                    ] || 0) + 1,
                                  )
                                }
                              />
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row gutter={[24, 24]}>
                        <Col xs={24} md={12}>
                          <div className="flex justify-between items-center py-4">
                            <div className="flex-1">
                              <Title level={5} className="!mb-1">
                                Extra Legroom Seat
                              </Title>
                              <Text className="text-gray-600 text-sm">
                                More space to stretch out
                              </Text>
                              <Text className="font-bold text-lg">₹40</Text>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                icon={<MinusOutlined />}
                                size="small"
                                onClick={() =>
                                  updateServiceCount(
                                    "extra-legroom",
                                    (individualServiceCounts["extra-legroom"] ||
                                      0) - 1,
                                  )
                                }
                                disabled={
                                  (individualServiceCounts["extra-legroom"] ||
                                    0) === 0
                                }
                              />
                              <span className="mx-3 min-w-[2rem] text-center">
                                {individualServiceCounts["extra-legroom"] || 0}
                              </span>
                              <Button
                                icon={<PlusOutlined />}
                                size="small"
                                onClick={() =>
                                  updateServiceCount(
                                    "extra-legroom",
                                    (individualServiceCounts["extra-legroom"] ||
                                      0) + 1,
                                  )
                                }
                              />
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  ),
                },
                {
                  key: "baggage",
                  label: (
                    <span className="flex items-center gap-2">
                      <span>🧳</span>
                      Baggage
                    </span>
                  ),
                  children: (
                    <div className="space-y-4">
                      <Row gutter={[24, 24]}>
                        <Col xs={24} md={12}>
                          <div className="flex justify-between items-center py-4">
                            <div className="flex-1">
                              <Title level={5} className="!mb-1">
                                Extra Baggage (23kg)
                              </Title>
                              <Text className="text-gray-600 text-sm">
                                Additional checked baggage
                              </Text>
                              <Text className="font-bold text-lg">₹45</Text>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                icon={<MinusOutlined />}
                                size="small"
                                onClick={() =>
                                  updateServiceCount(
                                    "extra-baggage",
                                    (individualServiceCounts["extra-baggage"] ||
                                      0) - 1,
                                  )
                                }
                                disabled={
                                  (individualServiceCounts["extra-baggage"] ||
                                    0) === 0
                                }
                              />
                              <span className="mx-3 min-w-[2rem] text-center">
                                {individualServiceCounts["extra-baggage"] || 0}
                              </span>
                              <Button
                                icon={<PlusOutlined />}
                                size="small"
                                onClick={() =>
                                  updateServiceCount(
                                    "extra-baggage",
                                    (individualServiceCounts["extra-baggage"] ||
                                      0) + 1,
                                  )
                                }
                              />
                            </div>
                          </div>
                        </Col>
                        <Col xs={24} md={12}>
                          <div className="flex justify-between items-center py-4">
                            <div className="flex-1">
                              <Title level={5} className="!mb-1">
                                Priority Baggage
                              </Title>
                              <Text className="text-gray-600 text-sm">
                                First off the carousel
                              </Text>
                              <Text className="font-bold text-lg">₹20</Text>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                icon={<MinusOutlined />}
                                size="small"
                                onClick={() =>
                                  updateServiceCount(
                                    "priority-baggage",
                                    (individualServiceCounts[
                                      "priority-baggage"
                                    ] || 0) - 1,
                                  )
                                }
                                disabled={
                                  (individualServiceCounts[
                                    "priority-baggage"
                                  ] || 0) === 0
                                }
                              />
                              <span className="mx-3 min-w-[2rem] text-center">
                                {individualServiceCounts["priority-baggage"] ||
                                  0}
                              </span>
                              <Button
                                icon={<PlusOutlined />}
                                size="small"
                                onClick={() =>
                                  updateServiceCount(
                                    "priority-baggage",
                                    (individualServiceCounts[
                                      "priority-baggage"
                                    ] || 0) + 1,
                                  )
                                }
                              />
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  ),
                },
                {
                  key: "convenience",
                  label: (
                    <span className="flex items-center gap-2">
                      <span>⚡</span>
                      Convenience
                    </span>
                  ),
                  children: (
                    <div className="space-y-4">
                      <Row gutter={[24, 24]}>
                        <Col xs={24} md={12}>
                          <div className="flex justify-between items-center py-4">
                            <div className="flex-1">
                              <Title level={5} className="!mb-1">
                                Priority Boarding
                              </Title>
                              <Text className="text-gray-600 text-sm">
                                Board the aircraft first
                              </Text>
                              <Text className="font-bold text-lg">₹15</Text>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                icon={<MinusOutlined />}
                                size="small"
                                onClick={() =>
                                  updateServiceCount(
                                    "priority-boarding",
                                    (individualServiceCounts[
                                      "priority-boarding"
                                    ] || 0) - 1,
                                  )
                                }
                                disabled={
                                  (individualServiceCounts[
                                    "priority-boarding"
                                  ] || 0) === 0
                                }
                              />
                              <span className="mx-3 min-w-[2rem] text-center">
                                {individualServiceCounts["priority-boarding"] ||
                                  0}
                              </span>
                              <Button
                                icon={<PlusOutlined />}
                                size="small"
                                onClick={() =>
                                  updateServiceCount(
                                    "priority-boarding",
                                    (individualServiceCounts[
                                      "priority-boarding"
                                    ] || 0) + 1,
                                  )
                                }
                              />
                            </div>
                          </div>
                        </Col>
                        <Col xs={24} md={12}>
                          <div className="flex justify-between items-center py-4">
                            <div className="flex-1">
                              <Title level={5} className="!mb-1">
                                Fast Track Security
                              </Title>
                              <Text className="text-gray-600 text-sm">
                                Skip the security queues
                              </Text>
                              <Text className="font-bold text-lg">₹25</Text>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                icon={<MinusOutlined />}
                                size="small"
                                onClick={() =>
                                  updateServiceCount(
                                    "fast-track-security",
                                    (individualServiceCounts[
                                      "fast-track-security"
                                    ] || 0) - 1,
                                  )
                                }
                                disabled={
                                  (individualServiceCounts[
                                    "fast-track-security"
                                  ] || 0) === 0
                                }
                              />
                              <span className="mx-3 min-w-[2rem] text-center">
                                {individualServiceCounts[
                                  "fast-track-security"
                                ] || 0}
                              </span>
                              <Button
                                icon={<PlusOutlined />}
                                size="small"
                                onClick={() =>
                                  updateServiceCount(
                                    "fast-track-security",
                                    (individualServiceCounts[
                                      "fast-track-security"
                                    ] || 0) + 1,
                                  )
                                }
                              />
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  ),
                },
                {
                  key: "dining",
                  label: (
                    <span className="flex items-center gap-2">
                      <span>🍽️</span>
                      Dining
                    </span>
                  ),
                  children: (
                    <div className="space-y-4">
                      <Row gutter={[24, 24]}>
                        <Col xs={24} md={12}>
                          <div className="flex justify-between items-center py-4">
                            <div className="flex-1">
                              <Title level={5} className="!mb-1">
                                Premium Meal
                              </Title>
                              <Text className="text-gray-600 text-sm">
                                Upgrade your in-flight dining
                              </Text>
                              <Text className="font-bold text-lg">₹35</Text>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                icon={<MinusOutlined />}
                                size="small"
                                onClick={() =>
                                  updateServiceCount(
                                    "premium-meal",
                                    (individualServiceCounts["premium-meal"] ||
                                      0) - 1,
                                  )
                                }
                                disabled={
                                  (individualServiceCounts["premium-meal"] ||
                                    0) === 0
                                }
                              />
                              <span className="mx-3 min-w-[2rem] text-center">
                                {individualServiceCounts["premium-meal"] || 0}
                              </span>
                              <Button
                                icon={<PlusOutlined />}
                                size="small"
                                onClick={() =>
                                  updateServiceCount(
                                    "premium-meal",
                                    (individualServiceCounts["premium-meal"] ||
                                      0) + 1,
                                  )
                                }
                              />
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  ),
                },
                {
                  key: "connectivity",
                  label: (
                    <span className="flex items-center gap-2">
                      <span>📶</span>
                      Connectivity
                    </span>
                  ),
                  children: (
                    <div className="space-y-4">
                      <Row gutter={[24, 24]}>
                        <Col xs={24} md={12}>
                          <div className="flex justify-between items-center py-4">
                            <div className="flex-1">
                              <Title level={5} className="!mb-1">
                                In-flight WiFi
                              </Title>
                              <Text className="text-gray-600 text-sm">
                                Stay connected during your flight
                              </Text>
                              <Text className="font-bold text-lg">₹20</Text>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                icon={<MinusOutlined />}
                                size="small"
                                onClick={() =>
                                  updateServiceCount(
                                    "inflight-wifi",
                                    (individualServiceCounts["inflight-wifi"] ||
                                      0) - 1,
                                  )
                                }
                                disabled={
                                  (individualServiceCounts["inflight-wifi"] ||
                                    0) === 0
                                }
                              />
                              <span className="mx-3 min-w-[2rem] text-center">
                                {individualServiceCounts["inflight-wifi"] || 0}
                              </span>
                              <Button
                                icon={<PlusOutlined />}
                                size="small"
                                onClick={() =>
                                  updateServiceCount(
                                    "inflight-wifi",
                                    (individualServiceCounts["inflight-wifi"] ||
                                      0) + 1,
                                  )
                                }
                              />
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  ),
                },
                {
                  key: "insurance",
                  label: (
                    <span className="flex items-center gap-2">
                      <span>🛡️</span>
                      Insurance
                    </span>
                  ),
                  children: (
                    <div className="space-y-4">
                      <Row gutter={[24, 24]}>
                        <Col xs={24} md={12}>
                          <div className="flex justify-between items-center py-4">
                            <div className="flex-1">
                              <Title level={5} className="!mb-1">
                                Travel Insurance
                              </Title>
                              <Text className="text-gray-600 text-sm">
                                Comprehensive travel protection
                              </Text>
                              <Text className="font-bold text-lg">₹55</Text>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                icon={<MinusOutlined />}
                                size="small"
                                onClick={() =>
                                  updateServiceCount(
                                    "travel-insurance",
                                    (individualServiceCounts[
                                      "travel-insurance"
                                    ] || 0) - 1,
                                  )
                                }
                                disabled={
                                  (individualServiceCounts[
                                    "travel-insurance"
                                  ] || 0) === 0
                                }
                              />
                              <span className="mx-3 min-w-[2rem] text-center">
                                {individualServiceCounts["travel-insurance"] ||
                                  0}
                              </span>
                              <Button
                                icon={<PlusOutlined />}
                                size="small"
                                onClick={() =>
                                  updateServiceCount(
                                    "travel-insurance",
                                    (individualServiceCounts[
                                      "travel-insurance"
                                    ] || 0) + 1,
                                  )
                                }
                              />
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-800"
          >
            Back
          </Button>

          <Button
            type="primary"
            size="large"
            onClick={handleContinue}
            className="px-8"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}