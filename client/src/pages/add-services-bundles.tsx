import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Checkbox,
  Badge,
  Tabs,
  Collapse
} from "antd";
import {
  ArrowLeftOutlined,
  CheckOutlined,
  DownOutlined,
  MinusOutlined,
  PlusOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import BookingSteps from "@/components/booking/booking-steps";
import BookingSummary from "@/components/booking-summary/booking-summary";
import { Color } from "antd/es/color-picker";

const { Title, Text } = Typography;

interface BundleOption {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  offerPercentage:number;
  discountedPrice: number;
  savings: number;
  features: string[];
  popular?: boolean;
  color: string;
  highLight: string;
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
    offerPercentage:20,
    popular: false,
    color: "blue",
    highLight:"Convenience",
    features: [
      "Pay 50% now, 50% later",
      "No interest charges",
      "Automatic payment reminders",
      "Secure payment processing",
    ],
  },
  {
    id: "booknow-complete-later",
    name: "BookNow Complete Later",
    description: "Secure your booking, add passenger details when ready",
    originalPrice: 39,
    discountedPrice: 19,
    savings: 20,
    offerPercentage:20,
    color: "green",
    highLight: "Flexibility",
    features: [
      "Reserve seats immediately",
      "Add passenger names up to 30 days before travel",
      "Email reminders for pending details",
      "No risk of price increases",
    ],
  },
  {
    id: "schedule-shield",
    name: "Schedule Shield",
    description: "Change your travel dates with confidence",
    originalPrice: 65,
    discountedPrice: 45,
    savings: 20,
    offerPercentage:20,
    color: "purple",
    highLight:"Peace of Mind",
    features: [
      "One free date change per booking",
      "Waived change fees",
      "Subject to fare difference only",
      "Valid for 12 months",
    ],
  },
  {
    id: "worry-free-cancellation",
    name: "Worry-Free Cancellation",
    description: "Full refund protection for unexpected changes",
    originalPrice: 85,
    discountedPrice: 65,
    savings: 20,
    offerPercentage:20,
    color: "red",
    highLight:"Full Protection",
    features: [
      "100% refund if cancelled 48+ hours before",
      "75% refund if cancelled 24-48 hours before",
      "No questions asked policy",
      "Instant refund processing",
    ],
  },
  {
    id: "splitpay-pro",
    name: "SplitPay Pro",
    description: "Divide payments among group members easily",
    originalPrice: 35,
    discountedPrice: 25,
    savings: 10,
    offerPercentage:20,
    color: "orange",
    highLight:"Group Convenience",
    features: [
      "Split payment among up to 10 people",
      "Individual payment links",
      "Automatic payment tracking",
      "Group payment dashboard",
    ],
  },
  {
    id: "premium-flexibility-bundle",
    name: "Premium Flexibility Bundle",
    description: "Ultimate booking flexibility and peace of mind",
    originalPrice: 119,
    discountedPrice: 89,
    savings: 30,
    offerPercentage:20,
    color: "gold",
    highLight: "Best Value",
    features: [
      "Includes FlexPay Plus",
      "Includes Schedule Shield",
      "Includes Worry-Free Cancellation",
      "Priority customer support",
      "Save $50 vs individual purchases",
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
    offerPercentage:20,
    color: "green",
    highLight:"Priority boarding",
    features: [
      "Extra legroom seat",
      "Premium meal",
      "1 additional checked bag",
      "Priority baggage handling",
    ],
  },
  {
    id: "business-essentials",
    name: "Business Essentials",
    description: "Everything you need for business travel",
    originalPrice: 200,
    discountedPrice: 149,
    savings: 51,
    offerPercentage:20,
    color: "blue",
    highLight:"Lounge access",
    features: [
      "Fast-track security",
      "Premium seat selection",
      "Wi-Fi access",
      "Flexible rebooking",
    ],
  },
  {
    id: "family-fun-package",
    name: "Family Fun Package",
    description: "Perfect for family travelers",
    originalPrice: 85,
    discountedPrice: 65,
    savings: 20,
    offerPercentage:20,    
    color: "orange",
    highLight:"Kids meal",
    features: [
      "Entertainment package",
      "Priority family boarding",
      "Extra baggage allowance",
      "Travel insurance",
    ],
  },
];
const servicesForm = [
  {
    id: "seat-selection",
    title: "Seat Selection",
    description: "Choose your preferred seat",
    price: 25,
    highLight: "Comfort",
    color: "blue",
  },
  {
    id: "airport-lounge",
    title: "Airport Lounge Access",
    description: "Relax in premium lounges",
    price: 40,
    highLight: "VIP Access",
    color: "purple",
  },
  {
    id: "extra-legroom",
    title: "Extra Legroom Seat",
    description: "More space to stretch out",
    price: 40,
    highLight: "More Space",
    color: "teal",
  },
  {
    id: "extra-baggage",
    title: "Extra Baggage (23kg)",
    description: "Additional checked baggage",
    price: 45,
    highLight: "Extra Capacity",
    color: "orange",
  },
  {
    id: "priority-baggage",
    title: "Priority Baggage",
    description: "First off the carousel",
    price: 20,
    highLight: "First Pick",
    color: "red",
  },
  {
    id: "priority-boarding",
    title: "Priority Boarding",
    description: "Board the aircraft first",
    price: 15,
    highLight: "Skip the Line",
    color: "green",
  },
  {
    id: "fast-track-security",
    title: "Fast Track Security",
    description: "Skip the security queues",
    price: 25,
    highLight: "Speed Pass",
    color: "yellow",
  },
  {
    id: "premium-meal",
    title: "Premium Meal",
    description: "Upgrade your in-flight dining",
    price: 35,
    highLight: "Gourmet",
    color: "pink",
  },
  {
    id: "inflight-wifi",
    title: "In-flight WiFi",
    description: "Stay connected during your flight",
    price: 20,
    highLight: "Stay Online",
    color: "cyan",
  },
  {
    id: "travel-insurance",
    title: "Travel Insurance",
    description: "Comprehensive travel protection",
    price: 55,
    highLight: "Peace of Mind",
    color: "indigo",
  },
];

const bundleSections = [
  {
    key: "premium",
    title: "Special Bundles",
    description: "Ultimate flexibility and peace of mind packages",
    data: premiumBundles,
    type: "bundle", // to decide rendering style
  },
  {
    key: "standard",
    title: "Popular Bundles",
    description: "Ultimate flexibility and peace of mind packages",
    data: standardBundles,
    type: "bundle",
  },
  {
    key: "services",
    title: "Individual Services",
    description: "Ultimate flexibility and peace of mind packages",
    data: servicesForm,
    type: "service",
  },
];


const services: Record<string, IndividualService[]> = {
  comfort: [
    {
      id: "seat-selection",
      name: "Seat Selection",
      description: "Choose your preferred seat",
      price: 25,
      category: "comfort",
    },
    {
      id: "airport-lounge",
      name: "Airport Lounge Access",
      description: "Relax in premium lounges",
      price: 65,
      category: "comfort",
    },
    {
      id: "extra-legroom",
      name: "Extra Legroom Seat",
      description: "More space to stretch out",
      price: 40,
      category: "comfort",
    },
  ],
  baggage: [
    {
      id: "extra-baggage",
      name: "Extra Baggage (23kg)",
      description: "Additional checked baggage",
      price: 45,
      category: "baggage",
    },
    {
      id: "priority-baggage",
      name: "Priority Baggage",
      description: "First off the carousel",
      price: 20,
      category: "baggage",
    },
  ],
  convenience: [
    {
      id: "priority-boarding",
      name: "Priority Boarding",
      description: "Board the aircraft first",
      price: 15,
      category: "convenience",
    },
    {
      id: "fast-track-security",
      name: "Fast Track Security",
      description: "Skip the security queues",
      price: 25,
      category: "convenience",
    },
  ],
  dining: [
    {
      id: "premium-meal",
      name: "Premium Meal",
      description: "Upgrade your in-flight dining",
      price: 35,
      category: "dining",
    },
  ],
  connectivity: [
    {
      id: "inflight-wifi",
      name: "In-flight WiFi",
      description: "Stay connected during your flight",
      price: 20,
      category: "connectivity",
    },
  ],
  insurance: [
    {
      id: "travel-insurance",
      name: "Travel Insurance",
      description: "Comprehensive travel protection",
      price: 55,
      category: "insurance",
    },
  ],
};

export default function AddServicesBundles() {
  const navigate = useNavigate();
  // Check if this is an admin booking
  const adminMode = JSON.parse(localStorage.getItem("adminLoggedIn") || "false");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedBundles, setSelectedBundles] = useState<string[]>([]);
  const [individualServiceCounts, setIndividualServiceCounts] = useState<
    Record<string, number>
  >({});
  const [bookingData, setBookingData] = useState<any>(null);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Load booking data from localStorage on component mount
  useEffect(() => {
    const storedBookingData = localStorage.getItem("bookingFormData");
    if (storedBookingData) {
      setBookingData(JSON.parse(storedBookingData));
    }

    // Load previously saved selections if available
    const tempSelections = localStorage.getItem("currentServiceSelections");
    if (tempSelections) {
      try {
        const selections = JSON.parse(tempSelections);
        if (selections.selectedBundles)
          setSelectedBundles(selections.selectedBundles);
        if (selections.individualServiceCounts)
          setIndividualServiceCounts(selections.individualServiceCounts);
        if (selections.selectedServices)
          setSelectedServices(selections.selectedServices);
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
      selectedServices,
    };
    localStorage.setItem(
      "selectedServices",
      JSON.stringify(currentSelections.selectedServices)
    );
    localStorage.setItem(
      "tempServiceSelections",
      JSON.stringify(currentSelections)
    );

    if (adminMode) {
      navigate("/admin/flight-search-bundle");
    } else {
      navigate("/flight-search-bundle");
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
          services[cat].some((service) => service.id === serviceId)
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
    let nextLocation = adminMode ? "/admin/group-leader" : "/group-leader";

    if (adminMode) {
      nextLocation += "?admin=true";
    }

    console.log("Continue to Group Leader", { selectedServices });
    navigate(nextLocation);
  };

  const toggleBundle = (bundleId: string) => {
    setSelectedBundles((prev) =>
      prev.includes(bundleId)
        ? prev.filter((id) => id !== bundleId)
        : [...prev, bundleId]
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
    <div className="relative h-full">
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
            <div>
              <Title level={5} className="!mb-1">
                {bundle.name}
              </Title>
              <Text className="text-gray-600 text-sm">
                {bundle.description}
              </Text>
            </div>
          <Checkbox checked={isSelected} />
        </div>
        <div className="space-y-2 bg-gray-100 p-3 rounded-md">
          {bundle.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckOutlined className="text-green-500 text-xs" />
              <Text className="text-sm text-gray-700">{feature}</Text>
            </div>
          ))}
        </div>

        <div className="my-4 py-2 border-t border-gray-200">
          <div className="flex items-baseline gap-2">
            <Text className="text-2xl font-bold">
              ${bundle.discountedPrice}
            </Text>
            <Text className="text-gray-500 line-through text-sm">
              ${bundle.originalPrice}
            </Text>
            <div className="bg-green-200 rounded-lg py-1 px-2">
                <Text className="font-bold text  text-green-700 text-sm">{bundle.offerPercentage}% OFF</Text>            
            </div>
            
          </div>
            <Text className="ont-bold  text-green-600 font-medium text-sm block">
              Save ${bundle.savings}
            </Text>
        </div>
        <div className="rounded-lg py-1 px-2 absolute -top-2.5 -right-2.5" style={{ backgroundColor: bundle.color }}>
          <Text className="font-bold text-white text-sm">{bundle.highLight}</Text>
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
    <div className="py-4  bg-white rounded-xl ">
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
    <div className={`${adminMode ? "flex-1" : "max-w-7xl"} mx-auto p-6`}>
      {/* Booking Steps */}
      <div className="mb-8">
        <BookingSteps currentStep={2} size="small" className="mb-6" />
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <Title level={2} className="!mb-2 text-gray-900">
              Add Services & Bundles
            </Title>
            {/* {adminMode && (
              <div className="flex items-center gap-2">
                <Badge color="blue" text="Admin Booking" />
                <Text className="text-gray-600">
                  Creating booking through admin panel
                </Text>
              </div>
            )} */}
          </div>
          {/* {adminMode && (
            <Button
              type="text"
              onClick={() => navigate("/admin/bookings")}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back to Admin Panel
            </Button>
          )} */}
        </div>
        <Text className="text-gray-600">
          Choose from our curated bundles or select individual services to
          enhance your group travel experience.
        </Text>
      </div>

      {/* Booking Summary */}
      <div className="mb-8">
        <BookingSummary showModifySearch={false} />
      </div>

      {/* Premium Bundles */}
      {/* <div className="mb-8">
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
      </div> */}

       {/* Premium Bundles */}
      {/* <div className="mb-8">
        <Collapse
          size="large"
          expandIconPosition="end"
          expandIcon={({ isActive }) =>
            isActive ? <UpOutlined /> : <DownOutlined />
          }
          className="custom-collapse rounded-lg"
          items={[
            {
              key: "1",
              label: (
                <><Title level={3} className="!mb-1 text-black text-md">
                  Special Bundles
                </Title><Text className="text-gray-600 ">Ultimate flexibility and peace of mind packages</Text></>
              ),
              children: (
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
              ),
            },
          ]}
        />
      </div> */}

        {/* Premium Bundles */}
      {/* <div className="mb-8">
        <Collapse
          size="large"
          expandIconPosition="end"
          expandIcon={({ isActive }) =>
            isActive ? <UpOutlined /> : <DownOutlined />
          }
          className="custom-collapse"
          items={[
            {
              key: "1",
              label: (
                <><Title level={3} className="!mb-1 text-black">
                  Popular Bundles
                </Title><Text className="text-gray-600 ">Ultimate flexibility and peace of mind packages</Text></>
              ),
              children: (
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
              ),
            },
          ]}
        />
      </div> */}

      {/* Standard Bundles */}

{/* 
      <div className="mb-8">
        <Collapse
          size="large"
          expandIconPosition="end"
          expandIcon={({ isActive }) =>
            isActive ? <UpOutlined /> : <DownOutlined />
          }
          className="custom-collapse"
          items={[
            {
              key: "1",
              label: (
                <><Title level={3} className="!mb-1 text-black">
                  Individual Services
                </Title><Text className="text-gray-600 ">Ultimate flexibility and peace of mind packages</Text></>
              ),
              children: (
                <Row gutter={[24, 24]}>
                {servicesForm.map((service:any) => (
                  <Col xs={24} md={12} lg={6} key={service.id} className="items-stretch">
                    <Card className="py-4 bg-white rounded-xl shadow-md">
                      <div className="flex-1">
                        <Title level={5} className="!mb-1">
                          {service.title}
                        </Title>
                        <Text className="text-gray-600 text-sm">
                          {service.description}
                        </Text>
                      </div>
                      <div className="flex justify-between border-t pt-3 mt-3">
                        <Text className="font-bold text-lg">${service.price}</Text>
                        <div className="flex items-center gap-2">
                          <Button
                            icon={<MinusOutlined />}
                            size="small"
                            className="border"
                            onClick={() =>
                              updateServiceCount(
                                service.id,
                                (individualServiceCounts[service.id] || 0) - 1
                              )
                            }
                            disabled={(individualServiceCounts[service.id] || 0) === 0}
                          />
                          <span className="mx-3 min-w-[2rem] text-center">
                            {individualServiceCounts[service.id] || 0}
                          </span>
                          <Button
                            icon={<PlusOutlined />}
                            size="small"
                            className="border"
                            onClick={() =>
                              updateServiceCount(
                                service.id,
                                (individualServiceCounts[service.id] || 0) + 1
                              )
                            }
                          />
                        </div>
                      </div>
                      <div className="rounded-lg py-1 px-2 absolute -top-2.5 -right-2.5" style={{ backgroundColor: service.color }}>
                        <Text className="font-bold text-white text-sm">{service.highLight}</Text>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
              ),
            },
          ]}
        />
      </div> */}

      {/* Premium Bundles */}
      {bundleSections.map((section) => (
        <div className="mb-8" key={section.key}>
          <Collapse
            size="large"
            expandIconPosition="end"
            expandIcon={({ isActive }) =>
              isActive ? <UpOutlined /> : <DownOutlined />
            }
            className="custom-collapse"
            items={[
              {
                key: section.key,
                label: (
                  <>
                    <Title level={3} className="!mb-1 text-black">
                      {section.title}
                    </Title>
                    <Text className="text-gray-600">{section.description}</Text>
                  </>
                ),
                children: (
                  <Row gutter={[24, 24]}>
                    {section.type === "bundle"
                      ? section.data.map((bundle: any) => (
                          <Col xs={24} md={8} lg={8} key={bundle.id}>
                            <BundleCard
                              bundle={bundle}
                              isSelected={selectedBundles.includes(bundle.id)}
                              onToggle={() => toggleBundle(bundle.id)}
                            />
                          </Col>
                        ))
                      : section.data.map((service: any) => (
                          <Col
                            xs={24}
                            md={12}
                            lg={6}
                            key={service.id}
                            className="items-stretch"
                          >
                            <Card className="py-4 bg-white rounded-xl shadow-md relative h-full">
                              <div className="flex-1">
                                <Title level={5} className="!mb-1">
                                  {service.title}
                                </Title>
                                <Text className="text-gray-600 text-sm">
                                  {service.description}
                                </Text>
                              </div>
                              <div className="flex justify-between border-t pt-3 mt-3">
                                <Text className="font-bold text-lg">
                                  ${service.price}
                                </Text>
                                <div className="flex items-center gap-2">
                                  <Button
                                    icon={<MinusOutlined />}
                                    size="small"
                                    className="border"
                                    onClick={() =>
                                      updateServiceCount(
                                        service.id,
                                        (individualServiceCounts[service.id] || 0) - 1
                                      )
                                    }
                                    disabled={
                                      (individualServiceCounts[service.id] || 0) === 0
                                    }
                                  />
                                  <span className="mx-3 min-w-[2rem] text-center">
                                    {individualServiceCounts[service.id] || 0}
                                  </span>
                                  <Button
                                    icon={<PlusOutlined />}
                                    size="small"
                                    className="border"
                                    onClick={() =>
                                      updateServiceCount(
                                        service.id,
                                        (individualServiceCounts[service.id] || 0) + 1
                                      )
                                    }
                                  />
                                </div>
                              </div>
                              <div
                                className="rounded-lg py-1 px-2 absolute -top-2.5 -right-2.5"
                                style={{ backgroundColor: service.color }}
                              >
                                <Text className="font-bold text-white text-sm">
                                  {service.highLight}
                                </Text>
                              </div>
                            </Card>
                          </Col>
                        ))}
                  </Row>
                ),
              },
            ]}
          />
        </div>
      ))}    
      

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
