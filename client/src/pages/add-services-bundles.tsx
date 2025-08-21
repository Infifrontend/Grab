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
  offerPercentage?: number;
  discountedPrice?: number;
  savings?: number;
  features: string[];
  popular?: boolean;
  color: string;
  highLight: string;
}
interface ServiceOption {
    id: string;
    name: string;
    description: string;
    price: number;
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

const InflightBundles: BundleOption[] = [
  {
    id: "inflight-comfort-plus",
    name: "Comfort Plus Bundle",
    description: "Enhanced comfort for your journey",
    originalPrice: 120,
    discountedPrice: 89,
    savings: 31,
    offerPercentage: 26,
    color: "darkgreen",
    highLight: "Comfort",
    features: ["Extra legroom seat", "Premium meal", "Priority baggage handling"]
  },
  {
    id: "inflight-business-essentials",
    name: "Business Essentials",
    description: "Everything you need for business travel",
    originalPrice: 200,
    discountedPrice: 149,
    savings: 51,
    offerPercentage: 26,
    color: "darkblue",
    highLight: "Business",
    features: ["Fast track security", "Premium seat selection", "Wi-Fi access", "Flexible rebooking"]
  },
  {
    id: "inflight-family-fun",
    name: "Family Fun Package",
    description: "Perfect for family travelers",
    originalPrice: 85,
    discountedPrice: 65,
    savings: 20,
    offerPercentage: 24,
    color: "darkmagenta",
    highLight: "Family",
    features: ["Entertainment package", "Priority family boarding", "Extra baggage allowance", "Travel insurance"]
  },
  {
    id: "inflight-luxury-experience",
    name: "Luxury Experience Bundle",
    description: "Ultimate premium travel experience",
    originalPrice: 399,
    discountedPrice: 299,
    savings: 100,
    offerPercentage: 25,
    color: "darkgoldenrod",
    highLight: "Luxury",
    features: ["Chauffeur service", "Premium champagne service", "Luxury amenity kit", "Personal concierge"]
  },
  {
    id: "inflight-eco-traveler",
    name: "Eco-Traveler Bundle",
    description: "Sustainable travel options",
    originalPrice: 60,
    discountedPrice: 45,
    savings: 15,
    offerPercentage: 25,
    color: "darkcyan",
    highLight: "Eco",
    features: ["Organic meal options", "Sustainable amenity kit", "Tree planting contribution"]
  },
  {
    id: "inflight-weekend-getaway",
    name: "Weekend Getaway Bundle",
    description: "Perfect for short trips",
    originalPrice: 75,
    discountedPrice: 55,
    savings: 20,
    offerPercentage: 27,
    color: "darkorchid",
    highLight: "Weekend",
    features: ["Compact travel kit", "City guide included", "Local experience voucher"]
  }
];

const SpecialServicesBundles: BundleOption[] = [
  {
    id: "flexible-date-change",
    name: "Flexible Date Change",
    description: "Change dates without penalties",
    originalPrice: 45,
    highLight: "Flexible",
    features: ["24/7 online", "Valid for 12 months"],
    color: "darkslategray"
  },
  {
    id: "full-refund-protection",
    name: "Full Refund Protection",
    description: "100% refund for any reason",
    originalPrice: 65,
    highLight: "Refund",
    features: ["24–48 hours before", "No questions asked policy"],
    color: "darkred"
  },
  {
    id: "group-payment-split",
    name: "Group Payment Split",
    description: "Divide costs among travelers",
    originalPrice: 25,
    highLight: "Split",
    features: ["Individual payment links", "Automatic payment tracking"],
    color: "darkgreen"
  },
  {
    id: "name-change-service",
    name: "Name Change Service",
    description: "Modify passenger names after booking",
    originalPrice: 35,
    highLight: "Correction",
    features: ["Valid until departure", "Instant confirmation"],
    color: "darkslateblue"
  },
  {
    id: "seat-together-guarantee",
    name: "Seat Together Guarantee",
    description: "Ensure your group sits together",
    originalPrice: 20,
    highLight: "Family",
    features: ["Group seating priority", "Free if not available"],
    color: "darkorange"
  },
  {
    id: "upgrade-protection",
    name: "Upgrade Protection",
    description: "Lock in upgrade prices",
    originalPrice: 40,
    highLight: "Upgrade",
    features: ["24-hour upgrade window", "Automatic upgrade alerts"],
    color: "darkviolet"
  },
  {
    id: "comprehensive-travel-insurance",
    name: "Comprehensive Travel Insurance",
    description: "Full trip protection coverage",
    originalPrice: 85,
    highLight: "Coverage",
    features: ["Trip interruption", "Baggage protection", "24/7 assistance"],
    color: "darkcyan"
  }
];

const SpecialBundles: BundleOption[] = [
  {
    id: "special-bundle-flexpay-plus",
    name: "FlexPay Plus",
    description: "Pay your way with flexible payment options",
    originalPrice: 29,
    color: "darkmagenta",
    highLight: "Payment",
    features: ["No interest charges", "Automatic payment reminders", "Secure payment processing"]
  },
  {
    id: "special-bundle-booknow-later",
    name: "BookNow Complete Later",
    description: "Secure your booking, add details when ready",
    originalPrice: 19,
    color: "darkblue",
    highLight: "Reserve",
    features: ["Add passenger names up to 35 days before travel", "Email reminders for pending details"]
  },
  {
    id: "special-bundle-schedule-shield",
    name: "Schedule Shield",
    description: "Change your travel dates with confidence",
    originalPrice: 45,
    color: "darkgreen",
    highLight: "Flexible",
    features: ["Change dates without penalties", "Valid up to departure", "Instant confirmation"]
  },
  {
    id: "special-bundle-cancellation",
    name: "Worry-Free Cancellation",
    description: "Full refund protection for unexpected changes",
    originalPrice: 65,
    color: "darkred",
    highLight: "Refund",
    features: ["100% refund if cancelled", "No questions asked policy", "Valid up to 24 hours before flight"]
  },
  {
    id: "special-bundle-splitpay-pro",
    name: "SplitPay Pro",
    description: "Divide payments among group members easily",
    originalPrice: 25,
    color: "darkorange",
    highLight: "Group",
    features: ["Split payment among group", "Individual payment links", "Automatic payment tracking"]
  },
  {
    id: "special-bundle-premium-flexibility",
    name: "Premium Flexibility Bundle",
    description: "Ultimate booking flexibility and peace of mind",
    originalPrice: 139,
    discountedPrice: 89,
    savings: 50,
    offerPercentage: 36,
    color: "darkcyan",
    highLight: "Flexible",
    features: ["Includes Schedule Shield", "Worry-Free Cancellation", "Priority customer support", "Save $50 on individual purchases"]
  },
  {
    id: "special-bundle-last-minute-saver",
    name: "Last Minute Saver Bundle",
    description: "Perfect for spontaneous travelers",
    originalPrice: 55,
    discountedPrice: 39,
    savings: 16,
    offerPercentage: 29,
    color: "darkgoldenrod",
    highLight: "Saver",
    features: ["Express check-in", "Priority standby", "Mobile boarding pass"]
  },
  {
    id: "special-bundle-frequent-flyer",
    name: "Frequent Flyer Plus",
    description: "Enhanced benefits for regular travelers",
    originalPrice: 100,
    discountedPrice: 75,
    savings: 25,
    offerPercentage: 25,
    color: "darkviolet",
    highLight: "Loyalty",
    features: ["Priority everything", "Complimentary upgrades", "Exclusive lounge access"]
  },
  {
    id: "special-bundle-digital-nomad",
    name: "Digital Nomad Package",
    description: "Everything remote workers need",
    originalPrice: 125,
    discountedPrice: 95,
    savings: 30,
    offerPercentage: 24,
    color: "darkslategray",
    highLight: "Remote",
    features: ["Power outlet guarantee", "Quiet zone seating", "Mobile office kit"]
  }
];

const servicesForm: ServiceOption[]=[
  {
    id: "service-extra-checked-bag",
    name: "Extra Checked Bag",
    description: "Additional 23kg checked baggage",
    price: 45,
    color: "darkslateblue",
    highLight: "Baggage"
  },
  {
    id: "service-premium-seat",
    name: "Premium Seat Selection",
    description: "Choose your preferred seat",
    price: 25,
    color: "darkblue",
    highLight: "Seat"
  },
  {
    id: "service-premium-meal",
    name: "Premium Meal",
    description: "Upgrade to premium dining experience",
    price: 35,
    color: "darkorange",
    highLight: "Meal"
  },
  {
    id: "service-lounge-access",
    name: "Airport Lounge Access",
    description: "Access to premium airport lounges",
    price: 55,
    color: "darkgoldenrod",
    highLight: "Lounge"
  },
  {
    id: "service-premium-wifi",
    name: "Premium Wi-Fi",
    description: "High-speed internet throughout flight",
    price: 15,
    color: "darkcyan",
    highLight: "WiFi"
  },
  {
    id: "service-priority-boarding",
    name: "Priority Boarding",
    description: "Board first and settle in early",
    price: 20,
    color: "darkgreen",
    highLight: "Priority"
  },
  {
    id: "service-extra-legroom",
    name: "Extra Legroom Seat",
    description: "More space to stretch and relax",
    price: 40,
    color: "darkmagenta",
    highLight: "Legroom"
  },
  {
    id: "service-fast-track",
    name: "Fast Track Security",
    description: "Skip the queues at security",
    price: 30,
    color: "darkred",
    highLight: "Express"
  }
];

//over all Json
const bundleSections = [
  {
    key: "premium",
    title: "Inflight Bundles",
    description: "Enhanced comfort and convenience packages for your journey",
    data: InflightBundles,
    type: "bundle", // to decide rendering style
  },
  {
    key: "services",
    title: "Ala carte Ancillaries",
    description: "Individual services to customize your travel experience",
    data: servicesForm,
    type: "service",
  },
  {
    key: "standard",
    title: "Special Services",
    description: "Booking modifications and payment options",
    data: SpecialServicesBundles,
    type: "bundle",
  },
  {
    key: "standard",
    title: "Special Bundles",
    description: "Ultimate flexibility and peace of mind packages",
    data: SpecialBundles,
    type: "bundle",
  }
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
// selected bundles count and price
  const [overAllselectedBundles, setOverAllselectedBundles] = useState<any>([]);
//calculate total item
  const totalItems = overAllselectedBundles?.reduce(
    (sum: any, item: any) => sum + item.count,
    0
  );
  //calculate total price
  const totalPrice = overAllselectedBundles?.reduce(
    (sum: number, item: any) => sum + item.count * item.price,
    0
  );
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
    const selectedServices: { id: string; name: string; price: number; type: string; count?: number; }[] = [];

    // Combine all bundles
    const allBundles = bundleSections
      .filter(section => section.type === "bundle")
      .flatMap((section: any) => section.data);

    // Add selected bundles
    selectedBundles.forEach((bundleId) => {
      const bundle = allBundles.find((b) => b.id === bundleId);
      if (bundle) {
        selectedServices.push({
          id: bundle.id,
          name: bundle.name,
          price: bundle.discountedPrice?bundle.discountedPrice :bundle.originalPrice,
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
  const toggleBundle = (bundle: any) => {
    setSelectedBundles((prev) =>
      prev.includes(bundle.id)
        ? prev.filter((id) => id !== bundle.id)
        : [...prev, bundle.id]
    );

    setOverAllselectedBundles((prev: any) => {
      if (prev.some((item: string) => item.id === bundle.id)) {
        return prev.filter((item: string) => item.id !== bundle.id);
      }
      return [
        ...prev,
        {
          id: bundle.id,
          name: bundle.name,
          price: bundle.discountedPrice ? bundle.discountedPrice : bundle.originalPrice,
          count: 1,
        },
      ];
    });
  };


  const updateServiceCount = (service: any, count: number) => {
    console.log(service, count);
    setIndividualServiceCounts((prev) => ({
      ...prev,
      [service.id]: Math.max(0, count),
    }));
    setOverAllselectedBundles((prev: any) => {
      const existingIndex = prev.findIndex((item: any) => item.id === service.id);
      if (count === 0) {
        return prev.filter((item: any) => item.id !== service.id);
      }
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          count: count,
          price: service.price,
        };
        return updated;
      }
      return [
        ...prev,
        {
          id: service.id,
          name: service.name,
          price: service.price,
          count: count,
        },
      ];
    });
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
        <div className="absolute -top-3 left-4 z-[1]">
          <Badge
            color="purple"
            text="Best Value"
            className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium"
          />
        </div>
      )}
      <Card
        className={`h-full cursor-pointer transition-all border-2 ${isSelected
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
        {bundle.features.length > 0 && <div className="space-y-2 bg-gray-100 p-3 rounded-md">
          {bundle.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckOutlined className="text-green-500 text-xs" />
              <Text className="text-sm text-gray-700">{feature}</Text>
            </div>
          ))}
        </div>
        }

        <div className="my-4 py-2 border-t border-gray-200">
          <div className="flex items-baseline gap-2">
            <Text className="text-2xl font-bold">
              ${bundle.discountedPrice ? bundle.discountedPrice : bundle.originalPrice}
            </Text>
            <Text className="text-gray-500 line-through text-sm">
              {bundle.discountedPrice && `$${bundle.originalPrice}`}
            </Text>
            {bundle.discountedPrice && <div className="bg-green-200 rounded-lg py-1 px-2">
              <Text className="font-bold text  text-green-700 text-sm">{bundle.offerPercentage}% OFF</Text>
            </div>
            }
          </div>
          {bundle.savings &&
            <Text className="ont-bold  text-green-600 font-medium text-sm block">
              Save ${bundle.savings}
            </Text>
          }
        </div>
        <div className="rounded-lg py-1 px-2 absolute -top-2.5 -right-2.5" style={{ backgroundColor: bundle.color }}>
          <Text className="font-bold text-white text-sm">{bundle.highLight}</Text>
        </div>

      </Card>
    </div>
  );

const ServiceCard = ({
  service,
  count,
  onUpdate,
}: {
  service: ServiceOption;
  count: number;
  onUpdate: (service: ServiceOption, newCount: number) => void;
}) => (
  <Card
  className={`py-4 rounded-xl shadow-md relative h-full flex flex-col ${
    count > 0
      ? "border-blue-500 bg-blue-50"
      : "border-gray-200 bg-white hover:border-gray-300"
  }`}>

    <div className="flex-1">
      <Title level={5} className="!mb-1">
        {service.name}
      </Title>
      <Text className="text-gray-600 text-sm">{service.description}</Text>
    </div>

    {/* Price & Counter */}
    <div className="flex justify-between border-t pt-3 mt-3 items-center">
      <Text className="font-bold text-lg">${service.price}</Text>
      <div className="flex items-center gap-2">
        <Button
          icon={<MinusOutlined />}
          size="small"
          className="border"
          onClick={() => onUpdate(service, count - 1)}
          disabled={count === 0}
        />
        <span className="mx-3 min-w-[2rem] text-center">{count}</span>
        <Button
          icon={<PlusOutlined />}
          size="small"
          className="border"
          onClick={() => onUpdate(service, count + 1)}
        />
      </div>
    </div>

    {/* Highlight Badge */}
    <div
      className="rounded-lg py-1 px-2 absolute -top-2.5 -right-2.5"
      style={{ backgroundColor: service.color }}
    >
      <Text className="font-bold text-white text-sm">{service.highLight}</Text>
    </div>
  </Card>
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

      {/* Bundles and services */}
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
                            onToggle={() => toggleBundle(bundle)}
                          />
                        </Col>
                      ))
                      : section.data.map((service: any) => (
                       <Col xs={24} md={12} lg={6} key={service.id} className="items-stretch">
                        <ServiceCard
                          service={service}
                          count={individualServiceCounts[service.id] || 0}
                          onUpdate={updateServiceCount}
                        />
                      </Col>

                      ))}
                  </Row>
                ),
              },
            ]}
          />
        </div>
      ))}

      <div className="mb-8 sticky custom-sticky-bottom bottom-0 z-[2] mt-8">
        <Card className="bg-white rounded-xl border-1 border-gray-300">
          {totalItems > 0 &&
            <Row className="flex justify-between">
              <div>
                <Title level={4} className="!mb-1 text-black">Total Additional Services  </Title>
                <Text className="text-gray-600">{totalItems} items selected</Text>
              </div>
              <Title level={3}>${totalPrice}</Title>
            </Row>
          }
          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-800"
            >
              Back to Flight Search & Bundles
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
        </Card>
      </div>
    </div>
  );
}