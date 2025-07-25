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
    id: "flexpay-plus",
    name: "FlexPay Plus",
    description: "Pay your way with flexible payment options",
    originalPrice: 59,
    discountedPrice: 29,
    savings: 30,
    popular: false,
    icon: "💳",
    color: "blue",
    features: [
      "Convenience",
      "Pay 50% now, 50% later",
      "No interest charges",
      "Automatic payment reminders",
      "Secure payment processing"
    ],
  },
  {
    id: "booknow-complete-later",
    name: "BookNow Complete Later",
    description: "Secure your booking, add passenger details when ready",
    originalPrice: 39,
    discountedPrice: 19,
    savings: 20,
    icon: "📅",
    color: "green",
    features: [
      "Flexibility",
      "Reserve seats immediately",
      "Add passenger names up to 30 days before travel",
      "Email reminders for pending details",
      "No risk of price increases"
    ],
  },
  {
    id: "schedule-shield",
    name: "Schedule Shield",
    description: "Change your travel dates with confidence",
    originalPrice: 65,
    discountedPrice: 45,
    savings: 20,
    icon: "🛡️",
    color: "purple",
    features: [
      "Peace of Mind",
      "One free date change per booking",
      "Waived change fees",
      "Subject to fare difference only",
      "Valid for 12 months"
    ],
  },
  {
    id: "worry-free-cancellation",
    name: "Worry-Free Cancellation",
    description: "Full refund protection for unexpected changes",
    originalPrice: 85,
    discountedPrice: 65,
    savings: 20,
    icon: "✅",
    color: "red",
    features: [
      "Full Protection",
      "100% refund if cancelled 48+ hours before",
      "75% refund if cancelled 24-48 hours before",
      "No questions asked policy",
      "Instant refund processing"
    ],
  },
  {
    id: "splitpay-pro",
    name: "SplitPay Pro",
    description: "Divide payments among group members easily",
    originalPrice: 35,
    discountedPrice: 25,
    savings: 10,
    icon: "👥",
    color: "orange",
    features: [
      "Group Convenience",
      "Split payment among up to 10 people",
      "Individual payment links",
      "Automatic payment tracking",
      "Group payment dashboard"
    ],
  },
  {
    id: "premium-flexibility-bundle",
    name: "Premium Flexibility Bundle",
    description: "Ultimate booking flexibility and peace of mind",
    originalPrice: 119,
    discountedPrice: 89,
    savings: 30,
    icon: "⭐",
    color: "gold",
    features: [
      "Best Value",
      "Includes FlexPay Plus",
      "Includes Schedule Shield",
      "Includes Worry-Free Cancellation",
      "Priority customer support",
      "Save $50 vs individual purchases"
    ],
  },
];

const standardBundles: BundleOption[] = [
  {
    id: "comfort-plus-bundle",
    name: "Comfort Plus Bundle",
    description: "Enhanced comfort for your journey",
    originalPrice: 119,
    discountedPrice: 89,
    savings: 30,
    popular: true,
    icon: "🎯",
    color: "green",
    features: [
      "Priority boarding",
      "Extra legroom seat",
      "Premium meal",
      "1 additional checked bag",
      "Priority baggage handling"
    ],
  },
  {
    id: "business-essentials",
    name: "Business Essentials",
    description: "Everything you need for business travel",
    originalPrice: 200,
    discountedPrice: 149,
    savings: 51,
    icon: "💼",
    color: "blue",
    features: [
      "Lounge access",
      "Fast-track security",
      "Premium seat selection",
      "Wi-Fi access",
      "Flexible rebooking"
    ],
  },
  {
    id: "family-fun-package",
    name: "Family Fun Package",
    description: "Perfect for family travelers",
    originalPrice: 85,
    discountedPrice: 65,
    savings: 20,
    icon: "👨‍👩‍👧‍👦",
    color: "orange",
    features: [
      "Kids meal",
      "Entertainment package",
      "Priority family boarding",
      "Extra baggage allowance",
      "Travel insurance"
    ],
  },
];

const services: Record<string, IndividualService[]> = {
  comfort: [
    {
      id: "seat-selection",
      name: "Seat Selection",
      description: "Choose your preferred seat",
      price: 25,
      category: "comfort"
    },
    {
      id: "airport-lounge",
      name: "Airport Lounge Access",
      description: "Relax in premium lounges",
      price: 65,
      category: "comfort"
    },
    {
      id: "extra-legroom",
      name: "Extra Legroom Seat",
      description: "More space to stretch out",
      price: 40,
      category: "comfort"
    }
  ],
  baggage: [
    {
      id: "extra-baggage",
      name: "Extra Baggage (23kg)",
      description: "Additional checked baggage",
      price: 45,
      category: "baggage"
    },
    {
      id: "priority-baggage",
      name: "Priority Baggage",
      description: "First off the carousel",
      price: 20,
      category: "baggage"
    }
  ],
  convenience: [
    {
      id: "priority-boarding",
      name: "Priority Boarding",
      description: "Board the aircraft first",
      price: 15,
      category: "convenience"
    },
    {
      id: "fast-track-security",
      name: "Fast Track Security",
      description: "Skip the security queues",
      price: 25,
      category: "convenience"
    }
  ],
  dining: [
    {
      id: "premium-meal",
      name: "Premium Meal",
      description: "Upgrade your in-flight dining",
      price: 35,
      category: "dining"
    }
  ],
  connectivity: [
    {
      id: "inflight-wifi",
      name: "In-flight WiFi",
      description: "Stay connected during your flight",
      price: 20,
      category: "connectivity"
    }
  ],
  insurance: [
    {
      id: "travel-insurance",
      name: "Travel Insurance",
      description: "Comprehensive travel protection",
      price: 55,
      category: "insurance"
    }
  ]
};

export default function AddServicesBundles() {
  const [, setLocation] = useLocation();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedBundles, setSelectedBundles] = useState<string[]>([]);
  const [individualServiceCounts, setIndividualServiceCounts] = useState<
    Record<string, number>
  >({});
  const [bookingData, setBookingData] = useState<any>(null);
  const [isAdminBooking, setIsAdminBooking] = useState<boolean>(false);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Load booking data from localStorage on component mount
  useEffect(() => {
    // Check if this is an admin booking
    const adminBooking = localStorage.getItem("isAdminBooking");
    setIsAdminBooking(adminBooking === "true");

    const storedBookingData = localStorage.getItem("bookingFormData");
    if (storedBookingData) {
      setBookingData(JSON.parse(storedBookingData));
    }

    // Load previously saved selections if available
    const tempSelections = localStorage.getItem("currentServiceSelections");
    if (tempSelections) {
      try {
        const selections = JSON.parse(tempSelections);
        if (selections.selectedBundles) setSelectedBundles(selections.selectedBundles);
        if (selections.individualServiceCounts) setIndividualServiceCounts(selections.individualServiceCounts);
        if (selections.selectedServices) setSelectedServices(selections.selectedServices);
      } catch (error) {
        console.warn("Could not restore service selections:", error);
      }
    }
  }, []);

  const handleBack = () => {
    // Save current selections before navigating back
    const currentSelections = {
      selectedBundles,
      individualServiceCounts,
      selectedServices
    };
    localStorage.setItem("selectedServices", JSON.stringify(currentSelections.selectedServices));
    localStorage.setItem("tempServiceSelections", JSON.stringify(currentSelections));

    if (isAdminBooking) {
      setLocation("/flight-search-bundle?admin=true");
    } else {
      setLocation("/flight-search-bundle");
    }
  };

  const handleContinue = () => {
    // Calculate selected services data
    const selectedServices = [];

    // Combine all bundles
    const allBundles = [...premiumBundles, ...standardBundles];

    // Add selected bundles
    selectedBundles.forEach((bundleId) => {
      const bundle = allBundles.find((b) => b.id === bundleId);
      if (bundle) {
        selectedServices.push({
          id: bundle.id,
          name: bundle.name,
          price: bundle.discountedPrice,
          type: "bundle",
        });
      }
    });

    // Add individual services
    Object.entries(individualServiceCounts).forEach(([serviceId, count]) => {
      if (count > 0) {
        const category = [
          "insurance",
          "connectivity",
          "comfort",
          "baggage",
          "dining",
        ].find((cat) =>
          services[cat].some((service) => service.id === serviceId),
        );
        if (category) {
          const service = services[category].find((s) => s.id === serviceId);
          if (service) {
            selectedServices.push({
              id: service.id,
              name: service.name,
              price: service.price * count,
              count: count,
              type: "individual",
            });
          }
        }
      }
    });

    // Store selected services
    localStorage.setItem("selectedServices", JSON.stringify(selectedServices));
    let nextLocation = "/group-leader";

      if (isAdminBooking) {
          nextLocation += "?admin=true";
      }

    console.log("Continue to Group Leader", { selectedServices });
    setLocation(nextLocation);
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
              ${bundle.discountedPrice}
            </Text>
            <Text className="text-gray-500 line-through text-sm">
              ${bundle.originalPrice}
            </Text>
            <Text className="text-green-600 font-medium text-sm">
              Save ${bundle.savings}
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
        <Text className="font-bold">$${service.price}</Text>
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <Title level={2} className="!mb-2 text-gray-900">
              Add Services & Bundles
            </Title>
            {isAdminBooking && (
              <div className="flex items-center gap-2">
                <Badge color="blue" text="Admin Booking" />
                <Text className="text-gray-600">
                  Creating booking through admin panel
                </Text>
              </div>
            )}
          </div>
          {isAdminBooking && (
            <Button
              type="text"
              onClick={() => setLocation("/admin/bookings")}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back to Admin Panel
            </Button>
          )}
        </div>
        <Text className="text-gray-600">
          Choose from our curated bundles or select individual services to
          enhance your group travel experience.
        </Text>
      </div>

      {/* Premium Bundles */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Title level={3} className="!mb-0 text-gray-800">
            Special Bundles
          </Title>
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
          Popular Bundles
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
                            <Text className="font-bold text-lg">$25</Text>
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
                            <Text className="font-bold text-lg">$65</Text>
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
                            <Text className="font-bold text-lg">$40</Text>
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
                            <Text className="font-bold text-lg">$45</Text>
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
                            <Text className="font-bold text-lg">$20</Text>
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
                            <Text className="font-bold text-lg">$15</Text>
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
                            <Text className="font-bold text-lg">$25</Text>
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
                            <Text className="font-bold text-lg">$35</Text>
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
                            <Text className="font-bold text-lg">$20</Text>
                          </div>
                          <div className="flex items-center gap-2"><Button
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
                            <Text className="font-bold text-lg">$55</Text>
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
  );
}