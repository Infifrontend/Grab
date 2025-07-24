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
  Avatar,
  Dropdown,
  Statistic,
  Modal,
  Descriptions,
  Badge,
  message,
  Tabs,
  Divider,
  Checkbox,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  MoreOutlined,
  ExportOutlined,
  CalendarOutlined,
  UserOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  LogoutOutlined,
  BellOutlined,
  PlusOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { Form, Radio, InputNumber } from "antd";
import dayjs from "dayjs";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import QuickBookingForm from "@/components/booking/quick-booking-form";
import BookingSteps from "@/components/booking/booking-steps";
import { apiRequest } from "@/lib/queryClient";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function Bookings() {
  const [, setLocation] = useLocation();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [airlineFilter, setAirlineFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [originOptions, setOriginOptions] = useState<string[]>([]);
  const [destinationOptions, setDestinationOptions] = useState<string[]>([]);

  // Fetch unique flight locations for autocomplete
  const { data: locationsData } = useQuery({
    queryKey: ["flight-locations"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/flight-locations");
      return response.json();
    },
  });

  useEffect(() => {
    if (locationsData?.locations) {
      setOriginOptions(locationsData.locations);
      setDestinationOptions(locationsData.locations);
    }
  }, [locationsData]);

  useEffect(() => {
    // Check if admin is logged in
    const isAdminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isAdminLoggedIn) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    setLocation("/admin/login");
  };

  // Fetch flight bookings from API
  const {
    data: flightBookings = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/flight-bookings"],
    queryFn: async () => {
      const response = await fetch("/api/flight-bookings");
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }
      return response.json();
    },
  });

  // Process bookings data for display
  const processedBookings = flightBookings.map((booking) => {
    // Parse comprehensive data if available
    let comprehensiveData = {};
    let groupLeaderName = "N/A";
    let groupLeaderEmail = "N/A";

    if (booking.specialRequests) {
      try {
        comprehensiveData = JSON.parse(booking.specialRequests);
        if (comprehensiveData.groupLeaderInfo) {
          groupLeaderName =
            comprehensiveData.groupLeaderInfo.name ||
            comprehensiveData.groupLeaderInfo.groupLeaderName ||
            "N/A";
          groupLeaderEmail =
            comprehensiveData.groupLeaderInfo.email ||
            comprehensiveData.groupLeaderInfo.groupLeaderEmail ||
            "N/A";
        }
      } catch (e) {
        // If parsing fails, use default values
      }
    }

    return {
      id: booking.id,
      bookingId: booking.bookingReference,
      groupLeader: groupLeaderName,
      email: groupLeaderEmail,
      route: booking.flight
        ? `${booking.flight.origin} → ${booking.flight.destination}`
        : "N/A",
      departureDate: booking.flight
        ? new Date(booking.flight.departureTime).toISOString().split("T")[0]
        : "N/A",
      passengers: booking.passengerCount || 0,
      totalAmount: parseFloat(booking.totalAmount || "0"),
      status: booking.bookingStatus || "pending",
      bookingDate: booking.bookedAt
        ? new Date(booking.bookedAt).toISOString().split("T")[0]
        : "N/A",
      airline: booking.flight ? booking.flight.airline : "N/A",
      paymentStatus: booking.paymentStatus || "pending",
      flightNumber: booking.flight ? booking.flight.flightNumber : "N/A",
      comprehensiveData,
    };
  });

  // Filter bookings based on search and filters
  const filteredBookings = processedBookings.filter((booking) => {
    const matchesSearch =
      searchText === "" ||
      booking.bookingId.toLowerCase().includes(searchText.toLowerCase()) ||
      booking.groupLeader.toLowerCase().includes(searchText.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;
    const matchesAirline =
      airlineFilter === "all" ||
      booking.airline.toLowerCase().includes(airlineFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesAirline;
  });

  // Calculate statistics
  const totalBookings = processedBookings.length;
  const totalPassengers = processedBookings.reduce(
    (sum, booking) => sum + booking.passengers,
    0,
  );
  const totalRevenue = processedBookings.reduce(
    (sum, booking) => sum + booking.totalAmount,
    0,
  );
  const confirmedBookings = processedBookings.filter(
    (booking) => booking.status === "confirmed",
  ).length;

  const columns = [
    {
      title: "Booking ID",
      dataIndex: "bookingId",
      key: "bookingId",
      sorter: (a, b) => a.bookingId.localeCompare(b.bookingId),
      render: (bookingId, record) => (
        <div>
          <Text strong className="text-blue-600">
            {bookingId}
          </Text>
          <br />
          <Text type="secondary" className="text-sm">
            {record.bookingDate !== "N/A"
              ? new Date(record.bookingDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "N/A"}
          </Text>
          <br />
          <Text type="secondary" className="text-xs">
            {record.flightNumber}
          </Text>
        </div>
      ),
    },
    {
      title: "Group Leader",
      key: "groupLeader",
      sorter: (a, b) => a.groupLeader.localeCompare(b.groupLeader),
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <div>
            <Text strong>{record.groupLeader}</Text>
            <br />
            <Text type="secondary" className="text-sm">
              {record.email}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Route & Date",
      key: "route",
      sorter: (a, b) => {
        if (a.departureDate === "N/A" && b.departureDate === "N/A") return 0;
        if (a.departureDate === "N/A") return 1;
        if (b.departureDate === "N/A") return -1;
        return (
          new Date(a.departureDate).getTime() -
          new Date(b.departureDate).getTime()
        );
      },
      render: (text, record) => {
        const origin = record?.comprehensiveData?.tripDetails?.origin;
        const destination = record?.comprehensiveData?.tripDetails?.destination;
        const departureDate =
          record?.comprehensiveData?.tripDetails?.departureDate;

        // Formatting departureDate in DD MMM YYYY format
        const formattedDate = departureDate
          ? new Date(departureDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "N/A";

        return (
          <>
            {origin} - {destination}
            <br />
            {formattedDate}
          </>
        );
      },
    },
    {
      title: "Passengers",
      dataIndex: "passengers",
      key: "passengers",
      sorter: (a, b) => a.passengers - b.passengers,
      render: (passengers) => (
        <div className="text-center">
          <Text strong className="text-lg">
            {passengers}
          </Text>
          <br />
          <Text type="secondary" className="text-sm">
            passengers
          </Text>
        </div>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      render: (amount) => (
        <div>
          <Text strong className="text-green-600 text-lg">
            ${amount.toLocaleString()}
          </Text>
          <br />
          <Text type="secondary" className="text-xs">
            Payment:{" "}
            {filteredBookings.find((b) => b.totalAmount === amount)
              ?.paymentStatus || "pending"}
          </Text>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      filters: [
        { text: "Confirmed", value: "confirmed" },
        { text: "Pending", value: "pending" },
        { text: "Cancelled", value: "cancelled" },
        { text: "Processing", value: "processing" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        const colors = {
          confirmed: "green",
          pending: "orange",
          cancelled: "red",
          processing: "blue",
        };
        return (
          <Tag color={colors[status] || "default"}>
            {status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown"}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewBooking(record)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditBooking(record)}
          />
          <Dropdown
            menu={{
              items: [
                {
                  key: "1",
                  label: "Send Confirmation",
                  icon: <CheckCircleOutlined />,
                  onClick: () => handleSendConfirmation(record),
                },
                {
                  key: "2",
                  label: "Cancel Booking",
                  icon: <MoreOutlined />,
                  onClick: () => handleCancelBooking(record),
                },
                {
                  key: "3",
                  label: "Download Invoice",
                  icon: <ExportOutlined />,
                  onClick: () => handleDownloadInvoice(record),
                },
              ],
            }}
            trigger={["click"]}
          >
            <Button type="text" icon={<MoreOutlined />} size="small" />
          </Dropdown>
        </Space>
      ),
    },
  ];

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setIsModalVisible(true);
  };

  const handleEditBooking = (booking) => {
    setLocation(`/booking-details/${booking.bookingId}`);
  };

  const handleSendConfirmation = (booking) => {
    message.success(`Confirmation email sent to ${booking.email}`);
  };

  const handleCancelBooking = (booking) => {
    Modal.confirm({
      title: "Cancel Booking",
      content: `Are you sure you want to cancel booking ${booking.bookingId}?`,
      onOk() {
        message.success(`Booking ${booking.bookingId} has been cancelled`);
        // Here you would typically call an API to update the booking status
      },
    });
  };

  const handleDownloadInvoice = (booking) => {
    message.success(
      `Invoice for booking ${booking.bookingId} is being prepared`,
    );
  };

  // Handle manage booking - navigate to existing manage booking flow
  const handleManageBooking = (bookingId) => {
    setLocation(`/manage-booking/${bookingId}`);
  };

  if (error) {
    message.error("Failed to fetch booking data");
  }

  // Tab items for the main content
  const tabItems = [
    {
      key: "dashboard",
      label: "Dashboard",
    },
    {
      key: "create-booking",
      label: "Create Group Booking",
    },
    {
      key: "manage-bookings",
      label: "Manage Bookings",
    },
  ];

  // AdminBookingFlow component that implements the complete booking process within admin layout
function AdminBookingFlow({ setLocation }: { setLocation: (path: string) => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [bookingData, setBookingData] = useState<any>(null);
  const [flightData, setFlightData] = useState<any>(null);
  const [bundleData, setBundleData] = useState<any>(null);
  const [servicesData, setServicesData] = useState<any[]>([]);
  const [groupLeaderData, setGroupLeaderData] = useState<any>(null);
  const [passengerData, setPassengerData] = useState<any[]>([]);
  const [paymentData, setPaymentData] = useState<any>(null);

  // Additional state for flight search functionality
  const [availableFlights, setAvailableFlights] = useState<any[]>([]);
  const [returnFlights, setReturnFlights] = useState<any[]>([]);
  const [selectedOutboundFlight, setSelectedOutboundFlight] = useState<any>(null);
  const [selectedReturnFlight, setSelectedReturnFlight] = useState<any>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  // Bundle selections
  const [selectedSeat, setSelectedSeat] = useState<string>("");
  const [selectedBaggage, setSelectedBaggage] = useState<string>("");
  const [selectedMeals, setSelectedMeals] = useState<string[]>(["standard-meal"]);

  // Bundle options (matching retail flow)
  const seatOptions = [
    {
      id: "standard-economy",
      name: "Standard Economy",
      price: 25,
      features: [
        "Assigned seat",
        "Shared legroom",
        "Carry-on included",
        "Overhead storage",
      ],
    },
    {
      id: "economy-plus",
      name: "Economy Plus",
      price: 89,
      features: [
        "Premium seat priority",
        "Extra legroom (5+ inches)",
        "Carry-on included",
        "Complimentary drinks",
      ],
    },
    {
      id: "premium-economy",
      name: "Premium Economy",
      price: 299,
      features: [
        "Premium comfort and service",
        "Premium seat",
        "Enhanced meal",
        "Priority check-in",
        "Extra baggage",
      ],
    },
  ];

  const baggageOptions = [
    {
      id: "basic-baggage",
      name: "Basic Baggage",
      price: 35,
      features: ["1 x 23kg checked bag", "Standard handling"],
    },
    {
      id: "baggage-plus",
      name: "Baggage Plus",
      price: 65,
      features: [
        "2 checked bags 15-23kg each",
        "Priority baggage",
        "Priority handling",
      ],
    },
    {
      id: "premium-baggage",
      name: "Premium Baggage",
      price: 125,
      features: [
        "2 checked bags 15-32kg each",
        "2 x 32kg checked bags",
        "Fragile item protection",
      ],
    },
  ];

  const mealOptions = [
    {
      id: "standard-meal",
      name: "Standard Meal",
      price: 0,
      included: true,
      features: [
        "Complimentary meal service",
        "Hot meal",
        "Soft drinks",
        "Tea/Coffee",
      ],
    },
    {
      id: "premium-meal",
      name: "Premium Meal",
      price: 45,
      features: [
        "Enhanced dining experience",
        "Chef-curated meal",
        "Wine selection",
        "Premium beverages",
        "Dessert",
      ],
    },
    {
      id: "special-dietary",
      name: "Special Dietary",
      price: 25,
      features: [
        "Special dietary meal options",
        "Vegetarian/vegan options",
        "Kosher/Halal/Hindu meals",
        "Gluten-free options",
      ],
    },
  ];

  // Step 1: Trip Details
  const TripDetailsStep = () => {
    const [form] = Form.useForm();
    const [tripType, setTripType] = useState("roundTrip");

    const handleNext = (values: any) => {
      const totalPassengers = values.adults + values.kids + values.infants;
      const tripData = {
        ...values,
        tripType,
        totalPassengers,
        isAdminBooking: true,
      };
      setBookingData(tripData);
      localStorage.setItem("bookingFormData", JSON.stringify(tripData));
      localStorage.setItem("isAdminBooking", "true");
      setCurrentStep(1);
    };

    return (
      <div className="max-w-4xl">
        <div className="mb-6">
          <Title level={3} className="!mb-2 text-gray-900">
            Trip Details
          </Title>
          <Text className="text-gray-600">
            Start by gathering basic information about the group trip
          </Text>
        </div>

        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleNext}
            initialValues={{
              tripType: "roundTrip",
              adults: 1,
              kids: 0,
              infants: 0,
              cabin: "economy",
            }}
          >
            <div className="mb-4">
              <Text className="text-gray-700 font-medium block mb-2">Trip Type</Text>
              <Radio.Group value={tripType} onChange={(e) => setTripType(e.target.value)}>
                <Radio value="oneWay">One way</Radio>
                <Radio value="roundTrip">Round trip</Radio>
              </Radio.Group>
            </div>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Origin *"
                  name="origin"
                  rules={[{ required: true, message: "Please select origin" }]}
                >
                  <Select
                    mode="combobox"
                    placeholder="Search city / airport"
                    showSearch
                    filterOption={(input, option) =>
                      (option?.value ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    suffixIcon={<EnvironmentOutlined className="text-gray-400" />}
                    notFoundContent="No locations found"
                  >
                    {originOptions.map((location) => (
                      <Select.Option key={location} value={location}>
                        {location}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Destination *"
                  name="destination"
                  rules={[{ required: true, message: "Please select destination" }]}
                >
                  <Select
                    mode="combobox"
                    placeholder="Search city / airport"
                    showSearch
                    filterOption={(input, option) =>
                      (option?.value ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    suffixIcon={<EnvironmentOutlined className="text-gray-400" />}
                    notFoundContent="No locations found"
                  >
                    {destinationOptions.map((location) => (
                      <Select.Option key={location} value={location}>
                        {location}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Departure Date *"
                  name="departureDate"
                  rules={[{ required: true, message: "Please select departure date" }]}
                >
                  <DatePicker
                    className="w-full"
                    format="DD MMM YYYY"
                    disabledDate={(current) => current && current.isBefore(dayjs(), "day")}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Return Date" name="returnDate">
                  <DatePicker
                    className="w-full"
                    format="DD MMM YYYY"
                    disabled={tripType === "oneWay"}
                    disabledDate={(current) => current && current.isBefore(dayjs(), "day")}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item
                  label="Adults *"
                  name="adults"
                  rules={[{ required: true, message: "At least 1 adult required" }]}
                >
                  <InputNumber min={1} max={50} className="w-full" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label="Kids (2-11)" name="kids">
                  <InputNumber min={0} max={50} className="w-full" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label="Infants (0-2)" name="infants">
                  <InputNumber min={0} max={50} className="w-full" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Cabin *" name="cabin">
              <Select placeholder="Select cabin class">
                <Option value="economy">Economy</Option>
                <Option value="business">Business</Option>
                <Option value="first">First Class</Option>
              </Select>
            </Form.Item>

            <div className="flex justify-end">
              <Button type="primary" htmlType="submit" size="large">
                Continue to Flight Search
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    );
  };

  // Step 2: Flight Search & Bundles (Full retail functionality)
  const FlightSearchStep = () => {
    useEffect(() => {
      if (bookingData) {
        searchFlights();
      }
    }, [bookingData]);

    const searchFlights = async () => {
      if (!bookingData) return;
      
      setSearchLoading(true);
      try {
        const response = await apiRequest("POST", "/api/search", {
          origin: bookingData.origin,
          destination: bookingData.destination,
          departureDate: bookingData.departureDate.format("YYYY-MM-DD"),
          returnDate: bookingData.returnDate?.format("YYYY-MM-DD"),
          passengers: bookingData.totalPassengers,
          cabin: bookingData.cabin,
          tripType: bookingData.tripType,
        });
        const result = await response.json();
        
        setAvailableFlights(result.flights || []);
        setReturnFlights(result.returnFlights || []);
        
        if (result.flights && result.flights.length > 0) {
          setSelectedOutboundFlight(result.flights[0]);
        }
        if (result.returnFlights && result.returnFlights.length > 0) {
          setSelectedReturnFlight(result.returnFlights[0]);
        }
      } catch (error) {
        console.error("Flight search error:", error);
        message.error("Failed to search flights");
      } finally {
        setSearchLoading(false);
      }
    };

    const handleNext = () => {
      if (selectedOutboundFlight) {
        const baseCost = (selectedOutboundFlight.price * bookingData.totalPassengers) + 
                        (bookingData.tripType === "roundTrip" && selectedReturnFlight ? 
                         (selectedReturnFlight.price * bookingData.totalPassengers) : 0);
        
        const flightInfo = {
          outbound: selectedOutboundFlight,
          return: selectedReturnFlight,
          baseCost,
          totalCost: baseCost,
        };
        setFlightData(flightInfo);
        localStorage.setItem("selectedFlightData", JSON.stringify(flightInfo));
        setCurrentStep(2);
      }
    };

    const FlightCard = ({ flight, isSelected, onSelect }: { flight: any; isSelected: boolean; onSelect: () => void }) => (
      <div
        className={`p-4 border rounded-lg cursor-pointer transition-all mb-3 ${
          isSelected
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200 hover:border-gray-300"
        }`}
        onClick={onSelect}
      >
        <Row align="middle" justify="space-between">
          <Col span={16}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-lg">✈</span>
              <div>
                <Text className="font-medium text-gray-900">
                  {flight.airline}
                </Text>
                <Text className="text-gray-600 text-sm ml-2">
                  {flight.flightNumber}
                </Text>
                {flight.stops === 0 ? (
                  <Badge color="blue" text="Non-stop" className="ml-2" />
                ) : (
                  <Badge
                    color="orange"
                    text={`${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
                    className="ml-2"
                  />
                )}
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <Text className="font-medium text-xs">
                  {new Date(flight.departureTime).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false
                  })}
                </Text>
                <Text className="text-xs text-gray-500">{flight.origin}</Text>
              </div>
              <div className="flex items-center mx-4">
                <div className="w-12 h-px bg-gray-300"></div>
                <span className="mx-2 text-gray-400">✈</span>
                <div className="w-12 h-px bg-gray-300"></div>
              </div>
              <div className="text-center">
                <Text className="font-medium text-xs">
                  {new Date(flight.arrivalTime).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false
                  })}
                </Text>
                <Text className="text-xs text-gray-500">{flight.destination}</Text>
              </div>
              <div className="ml-4">
                <Text className="text-gray-600 text-sm">({flight.duration})</Text>
                <br />
                <Text className="text-gray-500 text-xs">{flight.aircraft}</Text>
              </div>
            </div>
          </Col>
          <Col span={8} className="text-right">
            <Text className="text-xl font-bold text-gray-900">
              ${flight.price}
            </Text>
            <Text className="text-gray-600 text-sm block">per person</Text>
            <Text className="text-xs text-green-600">
              {flight.availableSeats} seats left
            </Text>
          </Col>
        </Row>
      </div>
    );

    return (
      <div className="max-w-6xl">
        <div className="mb-6">
          <Title level={3} className="!mb-2 text-gray-900">
            Flight Search & Bundle Selection
          </Title>
          <Text className="text-gray-600">
            {bookingData?.origin} → {bookingData?.destination} • {bookingData?.totalPassengers} passengers
          </Text>
        </div>

        <Row gutter={24}>
          <Col xs={24} lg={16}>
            <Card title="Available Flights" loading={searchLoading}>
              {bookingData?.tripType === "roundTrip" ? (
                <Tabs
                  defaultActiveKey="outbound"
                  items={[
                    {
                      key: "outbound",
                      label: "Outbound Flight",
                      children: (
                        <div className="space-y-4">
                          {availableFlights.map((flight) => (
                            <FlightCard
                              key={flight.id}
                              flight={flight}
                              isSelected={selectedOutboundFlight?.id === flight.id}
                              onSelect={() => setSelectedOutboundFlight(flight)}
                            />
                          ))}
                        </div>
                      ),
                    },
                    {
                      key: "return",
                      label: "Return Flight",
                      children: (
                        <div className="space-y-4">
                          {returnFlights.map((flight) => (
                            <FlightCard
                              key={flight.id}
                              flight={flight}
                              isSelected={selectedReturnFlight?.id === flight.id}
                              onSelect={() => setSelectedReturnFlight(flight)}
                            />
                          ))}
                        </div>
                      ),
                    },
                  ]}
                />
              ) : (
                <div className="space-y-4">
                  {availableFlights.map((flight) => (
                    <FlightCard
                      key={flight.id}
                      flight={flight}
                      isSelected={selectedOutboundFlight?.id === flight.id}
                      onSelect={() => setSelectedOutboundFlight(flight)}
                    />
                  ))}
                </div>
              )}
            </Card>

            {/* Bundle Selection */}
            <Card title="Bundle Selection" className="mt-6">
              <Tabs
                items={[
                  {
                    key: "seats",
                    label: "Seat Selection",
                    children: (
                      <Row gutter={[16, 16]}>
                        {seatOptions.map((option) => (
                          <Col xs={24} md={8} key={option.id}>
                            <div
                              className={`p-4 border rounded-lg cursor-pointer transition-all h-full ${
                                selectedSeat === option.id
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                              onClick={() => setSelectedSeat(option.id)}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <Checkbox checked={selectedSeat === option.id} />
                                  <Text className="font-medium">{option.name}</Text>
                                </div>
                                <Text className="font-bold text-blue-600">${option.price}</Text>
                              </div>
                              <Space direction="vertical" size="small" className="w-full">
                                {option.features.map((feature, index) => (
                                  <Text key={index} className="text-gray-600 text-sm flex items-center gap-1">
                                    <span className="text-green-500">•</span>
                                    {feature}
                                  </Text>
                                ))}
                              </Space>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    ),
                  },
                  {
                    key: "baggage",
                    label: "Baggage",
                    children: (
                      <Row gutter={[16, 16]}>
                        {baggageOptions.map((option) => (
                          <Col xs={24} md={8} key={option.id}>
                            <div
                              className={`p-4 border rounded-lg cursor-pointer transition-all h-full ${
                                selectedBaggage === option.id
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                              onClick={() => setSelectedBaggage(option.id)}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <Checkbox checked={selectedBaggage === option.id} />
                                  <Text className="font-medium">{option.name}</Text>
                                </div>
                                <Text className="font-bold text-blue-600">${option.price}</Text>
                              </div>
                              <Space direction="vertical" size="small" className="w-full">
                                {option.features.map((feature, index) => (
                                  <Text key={index} className="text-gray-600 text-sm flex items-center gap-1">
                                    <span className="text-green-500">•</span>
                                    {feature}
                                  </Text>
                                ))}
                              </Space>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    ),
                  },
                  {
                    key: "meals",
                    label: "Meals",
                    children: (
                      <Row gutter={[16, 16]}>
                        {mealOptions.map((option) => (
                          <Col xs={24} md={8} key={option.id}>
                            <div
                              className={`p-4 border rounded-lg cursor-pointer transition-all h-full ${
                                selectedMeals.includes(option.id)
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                              onClick={() => {
                                if (selectedMeals.includes(option.id)) {
                                  setSelectedMeals(selectedMeals.filter(id => id !== option.id));
                                } else {
                                  setSelectedMeals([...selectedMeals, option.id]);
                                }
                              }}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <Checkbox checked={selectedMeals.includes(option.id)} />
                                  <Text className="font-medium">{option.name}</Text>
                                </div>
                                <div className="text-right">
                                  {option.included ? (
                                    <Badge color="green" text="Included" />
                                  ) : (
                                    <Text className="font-bold text-blue-600">${option.price}</Text>
                                  )}
                                </div>
                              </div>
                              <Space direction="vertical" size="small" className="w-full">
                                {option.features.map((feature, index) => (
                                  <Text key={index} className="text-gray-600 text-sm flex items-center gap-1">
                                    <span className="text-green-500">•</span>
                                    {feature}
                                  </Text>
                                ))}
                              </Space>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    ),
                  },
                ]}
              />
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Selection Summary" className="sticky top-6">
              {selectedOutboundFlight && (
                <div className="space-y-3">
                  <div>
                    <Text className="text-gray-600">Outbound Flight:</Text>
                    <div className="font-medium">{selectedOutboundFlight.airline} {selectedOutboundFlight.flightNumber}</div>
                  </div>
                  {bookingData?.tripType === "roundTrip" && selectedReturnFlight && (
                    <div>
                      <Text className="text-gray-600">Return Flight:</Text>
                      <div className="font-medium">{selectedReturnFlight.airline} {selectedReturnFlight.flightNumber}</div>
                    </div>
                  )}
                  <Divider />
                  <div>
                    <Text className="text-gray-600">Flight Cost:</Text>
                    <div className="text-lg font-bold text-blue-600">
                      ${((selectedOutboundFlight.price * bookingData.totalPassengers) + 
                          (bookingData?.tripType === "roundTrip" && selectedReturnFlight ? 
                           (selectedReturnFlight.price * bookingData.totalPassengers) : 0)).toLocaleString()}
                    </div>
                  </div>
                  {(selectedSeat || selectedBaggage) && (
                    <div>
                      <Text className="text-gray-600">Bundle Cost:</Text>
                      <div className="font-medium">
                        ${((seatOptions.find(s => s.id === selectedSeat)?.price || 0) + 
                           (baggageOptions.find(b => b.id === selectedBaggage)?.price || 0)).toLocaleString()}
                      </div>
                    </div>
                  )}
                  <Divider />
                  <div>
                    <Text className="text-gray-600">Total:</Text>
                    <div className="text-xl font-bold text-blue-600">
                      ${((selectedOutboundFlight.price * bookingData.totalPassengers) + 
                          (bookingData?.tripType === "roundTrip" && selectedReturnFlight ? 
                           (selectedReturnFlight.price * bookingData.totalPassengers) : 0) +
                          (seatOptions.find(s => s.id === selectedSeat)?.price || 0) + 
                          (baggageOptions.find(b => b.id === selectedBaggage)?.price || 0)).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </Col>
        </Row>

        <div className="flex justify-between mt-6">
          <Button onClick={() => setCurrentStep(0)}>Back</Button>
          <Button 
            type="primary" 
            onClick={handleNext} 
            disabled={!selectedOutboundFlight}
            size="large"
          >
            Continue to Services
          </Button>
        </div>
      </div>
    );
  };

  // Step 3: Add Services
  const AddServicesStep = () => {
    const [selectedServices, setSelectedServices] = useState<string[]>([]);

    const services = [
      { id: 'insurance', name: 'Travel Insurance', price: 25, description: 'Comprehensive travel coverage' },
      { id: 'priority-boarding', name: 'Priority Boarding', price: 15, description: 'Board the plane first' },
      { id: 'extra-baggage', name: 'Extra Baggage', price: 45, description: 'Additional baggage allowance' },
      { id: 'seat-selection', name: 'Advanced Seat Selection', price: 20, description: 'Choose your preferred seats' },
      { id: 'meal-upgrade', name: 'Meal Upgrades', price: 30, description: 'Premium dining experience' },
      { id: 'lounge-access', name: 'Airport Lounge Access', price: 55, description: 'Relax in premium lounges' },
    ];

    const handleNext = () => {
      const selected = services.filter(s => selectedServices.includes(s.id));
      setServicesData(selected);
      localStorage.setItem("selectedServices", JSON.stringify(selected));
      setCurrentStep(3);
    };

    return (
      <div className="max-w-6xl">
        <div className="mb-6">
          <Title level={3} className="!mb-2 text-gray-900">
            Additional Services
          </Title>
          <Text className="text-gray-600">
            Enhance your group travel experience with these optional services
          </Text>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card title="Available Services">
              <Row gutter={[16, 16]}>
                {services.map((service) => (
                  <Col xs={24} md={12} key={service.id}>
                    <div
                      className={`p-4 border rounded-lg cursor-pointer transition-all h-full ${
                        selectedServices.includes(service.id)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => {
                        if (selectedServices.includes(service.id)) {
                          setSelectedServices(selectedServices.filter(id => id !== service.id));
                        } else {
                          setSelectedServices([...selectedServices, service.id]);
                        }
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Checkbox checked={selectedServices.includes(service.id)} />
                          <div>
                            <Text className="font-medium">{service.name}</Text>
                            <div className="text-sm text-gray-600">{service.description}</div>
                          </div>
                        </div>
                        <Text className="font-bold text-blue-600">${service.price} per person</Text>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Services Summary" className="sticky top-6">
              <div className="space-y-3">
                <div>
                  <Text className="text-gray-600">Selected Services:</Text>
                  <div className="mt-2">
                    {selectedServices.length === 0 ? (
                      <Text className="text-gray-500">No services selected</Text>
                    ) : (
                      selectedServices.map(serviceId => {
                        const service = services.find(s => s.id === serviceId);
                        return (
                          <div key={serviceId} className="flex justify-between items-center py-1">
                            <Text className="text-sm">{service?.name}</Text>
                            <Text className="text-sm font-medium">${service?.price}</Text>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
                {selectedServices.length > 0 && (
                  <>
                    <Divider />
                    <div>
                      <Text className="text-gray-600">Services Total:</Text>
                      <div className="text-lg font-bold text-blue-600">
                        ${selectedServices.reduce((total, serviceId) => {
                          const service = services.find(s => s.id === serviceId);
                          return total + (service?.price || 0);
                        }, 0) * (bookingData?.totalPassengers || 1)}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </Col>
        </Row>

        <div className="flex justify-between mt-6">
          <Button onClick={() => setCurrentStep(1)}>Back</Button>
          <Button type="primary" onClick={handleNext} size="large">
            Continue to Group Leader Info
          </Button>
        </div>
      </div>
    );
  };

  // Step 4: Group Leader Info
  const GroupLeaderStep = () => {
    const [form] = Form.useForm();

    const handleNext = (values: any) => {
      setGroupLeaderData(values);
      localStorage.setItem("groupLeaderData", JSON.stringify(values));
      setCurrentStep(4);
    };

    return (
      <div className="max-w-4xl">
        <div className="mb-6">
          <Title level={3} className="!mb-2 text-gray-900">
            Group Leader Information
          </Title>
          <Text className="text-gray-600">
            Provide details of the group leader who will be the main contact
          </Text>
        </div>

        <Card>
          <Form form={form} layout="vertical" onFinish={handleNext}>
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item label="Title" name="title" rules={[{ required: true }]}>
                  <Select placeholder="Select title">
                    <Option value="mr">Mr.</Option>
                    <Option value="mrs">Mrs.</Option>
                    <Option value="ms">Ms.</Option>
                    <Option value="dr">Dr.</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}>
                  <Input placeholder="First name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}>
                  <Input placeholder="Last name" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
                  <Input placeholder="Email address" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Phone" name="phoneNumber" rules={[{ required: true }]}>
                  <Input placeholder="Phone number" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item label="Date of Birth" name="dateOfBirth">
                  <DatePicker className="w-full" format="DD MMM YYYY" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Nationality" name="nationality">
                  <Select placeholder="Select nationality">
                    <Option value="us">United States</Option>
                    <Option value="uk">United Kingdom</Option>
                    <Option value="ca">Canada</Option>
                    <Option value="in">India</Option>
                    <Option value="other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <div className="flex justify-between mt-6">
              <Button onClick={() => setCurrentStep(2)}>Back</Button>
              <Button type="primary" htmlType="submit" size="large">
                Continue to Passenger Info
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    );
  };

  // Step 5: Passenger Info
  const PassengerInfoStep = () => {
    const [passengers, setPassengers] = useState<any[]>([]);

    useEffect(() => {
      if (bookingData?.totalPassengers) {
        const passengerList = Array.from({ length: bookingData.totalPassengers }, (_, index) => ({
          id: index + 1,
          firstName: '',
          lastName: '',
          dateOfBirth: null,
          nationality: '',
          passportNumber: '',
          passengerType: index < bookingData.adults ? 'adult' : 
                        index < (bookingData.adults + bookingData.kids) ? 'child' : 'infant'
        }));
        setPassengers(passengerList);
      }
    }, [bookingData]);

    const handleNext = () => {
      setPassengerData(passengers);
      localStorage.setItem("passengerData", JSON.stringify(passengers));
      setCurrentStep(5);
    };

    const updatePassenger = (index: number, field: string, value: any) => {
      const updatedPassengers = [...passengers];
      updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
      setPassengers(updatedPassengers);
    };

    return (
      <div className="max-w-6xl">
        <div className="mb-6">
          <Title level={3} className="!mb-2 text-gray-900">
            Passenger Information
          </Title>
          <Text className="text-gray-600">
            Provide details for all passengers ({bookingData?.totalPassengers} total)
          </Text>
        </div>

        <Card>
          <div className="space-y-6">
            {passengers.map((passenger, index) => (
              <Card key={passenger.id} type="inner" title={`Passenger ${index + 1} (${passenger.passengerType})`}>
                <Row gutter={16}>
                  <Col xs={24} md={8}>
                    <div className="mb-4">
                      <Text className="block mb-1">First Name *</Text>
                      <Input
                        placeholder="First name"
                        value={passenger.firstName}
                        onChange={(e) => updatePassenger(index, 'firstName', e.target.value)}
                      />
                    </div>
                  </Col>
                  <Col xs={24} md={8}>
                    <div className="mb-4">
                      <Text className="block mb-1">Last Name *</Text>
                      <Input
                        placeholder="Last name"
                        value={passenger.lastName}
                        onChange={(e) => updatePassenger(index, 'lastName', e.target.value)}
                      />
                    </div>
                  </Col>
                  <Col xs={24} md={8}>
                    <div className="mb-4">
                      <Text className="block mb-1">Date of Birth</Text>
                      <DatePicker
                        className="w-full"
                        format="DD MMM YYYY"
                        value={passenger.dateOfBirth}
                        onChange={(date) => updatePassenger(index, 'dateOfBirth', date)}
                      />
                    </div>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <div className="mb-4">
                      <Text className="block mb-1">Nationality</Text>
                      <Select
                        className="w-full"
                        placeholder="Select nationality"
                        value={passenger.nationality}
                        onChange={(value) => updatePassenger(index, 'nationality', value)}
                      >
                        <Option value="us">United States</Option>
                        <Option value="uk">United Kingdom</Option>
                        <Option value="ca">Canada</Option>
                        <Option value="in">India</Option>
                        <Option value="other">Other</Option>
                      </Select>
                    </div>
                  </Col>
                  <Col xs={24} md={12}>
                    <div className="mb-4">
                      <Text className="block mb-1">Passport Number</Text>
                      <Input
                        placeholder="Passport number"
                        value={passenger.passportNumber}
                        onChange={(e) => updatePassenger(index, 'passportNumber', e.target.value)}
                      />
                    </div>
                  </Col>
                </Row>
              </Card>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <Button onClick={() => setCurrentStep(3)}>Back</Button>
            <Button type="primary" onClick={handleNext} size="large">
              Continue to Review
            </Button>
          </div>
        </Card>
      </div>
    );
  };

  // Step 6: Review & Confirmation
  const ReviewStep = () => {
    const flightCost = flightData?.baseCost || 0;
    const bundleCost = (seatOptions.find(s => s.id === selectedSeat)?.price || 0) + 
                      (baggageOptions.find(b => b.id === selectedBaggage)?.price || 0);
    const servicesCost = servicesData.reduce((sum, service) => sum + service.price, 0) * (bookingData?.totalPassengers || 1);
    const totalCost = flightCost + bundleCost + servicesCost;

    const handleNext = () => {
      setCurrentStep(6);
    };

    return (
      <div className="max-w-6xl">
        <div className="mb-6">
          <Title level={3} className="!mb-2 text-gray-900">
            Review & Confirmation
          </Title>
          <Text className="text-gray-600">
            Review all booking details before proceeding to payment
          </Text>
        </div>

        <Row gutter={24}>
          <Col xs={24} lg={16}>
            <Card title="Trip Summary" className="mb-6">
              <Descriptions column={2} bordered>
                <Descriptions.Item label="Route">
                  {bookingData?.origin} → {bookingData?.destination}
                </Descriptions.Item>
                <Descriptions.Item label="Trip Type">
                  {bookingData?.tripType === 'oneWay' ? 'One Way' : 'Round Trip'}
                </Descriptions.Item>
                <Descriptions.Item label="Departure">
                  {bookingData?.departureDate?.format('DD MMM YYYY')}
                </Descriptions.Item>
                <Descriptions.Item label="Return">
                  {bookingData?.tripType === 'oneWay' ? 'N/A' : bookingData?.returnDate?.format('DD MMM YYYY')}
                </Descriptions.Item>
                <Descriptions.Item label="Passengers">
                  {bookingData?.totalPassengers} ({bookingData?.adults} adults, {bookingData?.kids} kids, {bookingData?.infants} infants)
                </Descriptions.Item>
                <Descriptions.Item label="Cabin">
                  {bookingData?.cabin}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="Flight Details" className="mb-6">
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Outbound Flight">
                  {flightData?.outbound?.airline} {flightData?.outbound?.flightNumber} - ${flightData?.outbound?.price} per person
                </Descriptions.Item>
                {bookingData?.tripType === 'roundTrip' && flightData?.return && (
                  <Descriptions.Item label="Return Flight">
                    {flightData.return.airline} {flightData.return.flightNumber} - ${flightData.return.price} per person
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>

            {groupLeaderData && (
              <Card title="Group Leader Information" className="mb-6">
                <Descriptions column={2} bordered>
                  <Descriptions.Item label="Name">
                    {groupLeaderData.title} {groupLeaderData.firstName} {groupLeaderData.lastName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {groupLeaderData.email}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone">
                    {groupLeaderData.phoneNumber}
                  </Descriptions.Item>
                  <Descriptions.Item label="Nationality">
                    {groupLeaderData.nationality}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            )}

            {servicesData.length > 0 && (
              <Card title="Additional Services">
                <Space direction="vertical" className="w-full">
                  {servicesData.map((service) => (
                    <div key={service.id} className="flex justify-between items-center">
                      <Text>{service.name}</Text>
                      <Text className="font-medium">${service.price} per person</Text>
                    </div>
                  ))}
                </Space>
              </Card>
            )}
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Pricing Summary" className="sticky top-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Text>Flight Cost:</Text>
                  <Text className="font-medium">${flightCost}</Text>
                </div>
                {bundleCost > 0 && (
                  <div className="flex justify-between">
                    <Text>Bundle Cost:</Text>
                    <Text className="font-medium">${bundleCost}</Text>
                  </div>
                )}
                {servicesCost > 0 && (
                  <div className="flex justify-between">
                    <Text>Services Cost:</Text>
                    <Text className="font-medium">${servicesCost}</Text>
                  </div>
                )}
                <Divider />
                <div className="flex justify-between text-lg font-bold">
                  <Text>Total:</Text>
                  <Text className="text-blue-600">${totalCost.toLocaleString()}</Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        <div className="flex justify-between mt-6">
          <Button onClick={() => setCurrentStep(4)}>Back</Button>
          <Button type="primary" onClick={handleNext} size="large">
            Continue to Payment
          </Button>
        </div>
      </div>
    );
  };

  // Step 7: Payment
  const PaymentStep = () => {
    const [form] = Form.useForm();
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: any) => {
      setLoading(true);
      try {
        const flightCost = flightData?.baseCost || 0;
        const bundleCost = (seatOptions.find(s => s.id === selectedSeat)?.price || 0) + 
                          (baggageOptions.find(b => b.id === selectedBaggage)?.price || 0);
        const servicesCost = servicesData.reduce((sum, service) => sum + service.price, 0) * (bookingData?.totalPassengers || 1);
        const totalAmount = flightCost + bundleCost + servicesCost;

        const comprehensiveBookingData = {
          bookingData,
          flightData,
          bundleData: {
            selectedSeat: seatOptions.find(s => s.id === selectedSeat),
            selectedBaggage: baggageOptions.find(b => b.id === selectedBaggage),
            selectedMeals: selectedMeals.map(mealId => mealOptions.find(m => m.id === mealId)).filter(Boolean),
          },
          selectedServices: servicesData,
          groupLeaderData,
          paymentData: { ...values, paymentMethod },
          passengerData: passengerData,
          bookingSummary: {
            totalAmount
          }
        };

        const response = await fetch("/api/group-bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(comprehensiveBookingData),
        });

        if (response.ok) {
          const result = await response.json();
          message.success("Group booking created successfully!");
          
          // Clear localStorage
          localStorage.removeItem("bookingFormData");
          localStorage.removeItem("selectedFlightData");
          localStorage.removeItem("selectedServices");
          localStorage.removeItem("groupLeaderData");
          localStorage.removeItem("passengerData");
          localStorage.removeItem("isAdminBooking");
          
          // Reset to dashboard tab
          setActiveTab("dashboard");
          setCurrentStep(0);
        } else {
          throw new Error("Failed to create booking");
        }
      } catch (error) {
        console.error("Booking error:", error);
        message.error("Failed to create booking");
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="max-w-4xl">
        <div className="mb-6">
          <Title level={3} className="!mb-2 text-gray-900">
            Payment Information
          </Title>
          <Text className="text-gray-600">
            Complete the booking by providing payment details
          </Text>
        </div>

        <Card>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <div className="mb-6">
              <Text className="font-medium block mb-3">Payment Method</Text>
              <Radio.Group value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <Space direction="vertical">
                  <Radio value="card">Credit/Debit Card</Radio>
                  <Radio value="bankTransfer">Bank Transfer</Radio>
                  <Radio value="corporate">Corporate Account</Radio>
                  <Radio value="invoice">Invoice (Pay Later)</Radio>
                </Space>
              </Radio.Group>
            </div>

            {paymentMethod === 'card' && (
              <>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item label="Card Number" name="cardNumber" rules={[{ required: true }]}>
                      <Input placeholder="1234 5678 9012 3456" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label="Cardholder Name" name="cardholderName" rules={[{ required: true }]}>
                      <Input placeholder="John Doe" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item label="Expiry Date" name="expiryDate" rules={[{ required: true }]}>
                      <Input placeholder="MM/YY" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label="CVV" name="cvv" rules={[{ required: true }]}>
                      <Input placeholder="123" />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}

            {paymentMethod === 'corporate' && (
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label="Company Name" name="companyName" rules={[{ required: true }]}>
                    <Input placeholder="Company name" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Corporate Account ID" name="corporateAccountId" rules={[{ required: true }]}>
                    <Input placeholder="Account ID" />
                  </Form.Item>
                </Col>
              </Row>
            )}

            <div className="flex justify-between mt-6">
              <Button onClick={() => setCurrentStep(5)}>Back</Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                size="large"
                className="bg-green-600 hover:bg-green-700"
              >
                Complete Booking - ${((flightData?.baseCost || 0) + 
                  (seatOptions.find(s => s.id === selectedSeat)?.price || 0) + 
                  (baggageOptions.find(b => b.id === selectedBaggage)?.price || 0) +
                  (servicesData.reduce((sum, service) => sum + service.price, 0) * (bookingData?.totalPassengers || 1))).toLocaleString()}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    );
  };

  const steps = [
    "Trip Details",
    "Flight Search & Bundles",
    "Add Services", 
    "Group Leader Info",
    "Passenger Info",
    "Review & Confirmation",
    "Payment"
  ];

  const stepComponents = [
    <TripDetailsStep key="trip" />,
    <FlightSearchStep key="flight" />,
    <AddServicesStep key="services" />,
    <GroupLeaderStep key="leader" />,
    <PassengerInfoStep key="passenger" />,
    <ReviewStep key="review" />,
    <PaymentStep key="payment" />
  ];

  return (
    <div>
      {/* Progress Steps */}
      <div className="mb-8">
        <BookingSteps currentStep={currentStep} size="small" className="mb-6" />
      </div>

      {/* Current Step Content */}
      {stepComponents[currentStep]}
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">GR</span>
                </div>
                <div>
                  <Text className="text-gray-600 text-sm font-medium">
                    GROUP RETAIL
                  </Text>
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
                <Text className="font-medium text-gray-900 block">
                  John Doe
                </Text>
                <Text className="text-gray-500 text-sm">System Admin</Text>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div
          className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 sticky top-[73px] shadow-xl"
          style={{ height: "calc(100vh - 73px)" }}
        >
          <div className="h-full overflow-y-auto">
            <div className="p-6">
              <nav className="space-y-2">
                <div
                  className="flex items-center space-x-3 text-slate-300 hover:text-white px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 cursor-pointer transition-all duration-200"
                  onClick={() => setLocation("/admin/dashboard")}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <span className="text-current text-xs">📊</span>
                  </div>
                  <Text className="text-current">Dashboard</Text>
                </div>
                <div
                  className="flex items-center space-x-3 text-slate-300 hover:text-white px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 cursor-pointer transition-all duration-200"
                  onClick={() => setLocation("/admin/offer-management")}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <span className="text-current text-xs">🎯</span>
                  </div>
                  <Text className="text-current">Offer Management</Text>
                </div>
                <div
                  className="flex items-center space-x-3 text-slate-300 hover:text-white px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 cursor-pointer transition-all duration-200"
                  onClick={() => setLocation("/admin/bid-management")}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <span className="text-current text-xs">🏆</span>
                  </div>
                  <Text className="text-current">Bid Management</Text>
                </div>
                <div className="flex items-center space-x-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg px-4 py-3 shadow-md">
                  <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                    <span className="text-blue-600 text-xs">📅</span>
                  </div>
                  <Text className="text-white font-medium">
                    Booking Management
                  </Text>
                </div>
                <div
                  className="flex items-center space-x-3 text-slate-300 hover:text-white px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 cursor-pointer transition-all duration-200"
                  onClick={() => setLocation("/admin/cms")}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <span className="text-current text-xs">📝</span>
                  </div>
                  <Text className="text-current">CMS Management</Text>
                </div>
                <div
                  className="flex items-center space-x-3 text-slate-300 hover:text-white px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 cursor-pointer transition-all duration-200"
                  onClick={() => setLocation("/admin/reports")}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <span className="text-current text-xs">📊</span>
                  </div>
                  <Text className="text-current">Reports & Analytics</Text>
                </div>
                <div
                  className="flex items-center space-x-3 text-slate-300 hover:text-white px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 cursor-pointer transition-all duration-200"
                  onClick={() => setLocation("/admin/admin-settings")}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <span className="text-current text-xs">🔧</span>
                  </div>
                  <Text className="text-current">System Settings</Text>
                </div>
              </nav>
            </div>

            {/* User Info Section at Bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-700">
              <div className="flex items-center space-x-3 bg-slate-800 rounded-lg p-3">
                <Avatar size="small" className="bg-blue-600 flex-shrink-0">
                  <span className="text-white font-medium">JD</span>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <Text className="text-white font-medium text-sm block truncate">
                        John Doe
                      </Text>
                      <Text className="text-slate-400 text-xs truncate">
                        System Admin
                      </Text>
                    </div>
                    <Button
                      type="text"
                      icon={<LogoutOutlined />}
                      size="small"
                      className="text-slate-400 hover:text-white flex-shrink-0"
                      onClick={handleLogout}
                      title="Logout"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <Title level={2} className="!mb-1 text-gray-900">
                Booking Management
              </Title>
              <Text className="text-gray-600">
                Manage and track all group travel bookings
              </Text>
            </div>
          </div>

          {/* Main Tabs */}
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            className="mb-6"
          />

          {/* Dashboard Tab Content */}
          {activeTab === "dashboard" && (
            <>
              {/* Stats Cards */}
              <Row gutter={[24, 24]} className="mb-8">
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="Total Bookings"
                      value={totalBookings}
                      prefix={<CalendarOutlined />}
                      valueStyle={{ color: "#1890ff" }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="Total Passengers"
                      value={totalPassengers}
                      prefix={<UserOutlined />}
                      valueStyle={{ color: "#52c41a" }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="Total Revenue"
                      value={totalRevenue}
                      prefix={<DollarOutlined />}
                      precision={0}
                      valueStyle={{ color: "#faad14" }}
                      formatter={(value) => `$${value.toLocaleString()}`}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="Confirmed Bookings"
                      value={confirmedBookings}
                      prefix={<CheckCircleOutlined />}
                      valueStyle={{ color: "#722ed1" }}
                    />
                  </Card>
                </Col>
              </Row>

              {/* Filters */}
              <Card className="mb-6">
                <Space className="w-full" direction="horizontal" wrap>
                  <Input
                    placeholder="Search bookings..."
                    prefix={<SearchOutlined />}
                    style={{ width: 250 }}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                  <Select
                    placeholder="Status"
                    style={{ width: 120 }}
                    value={statusFilter}
                    onChange={setStatusFilter}
                    options={[
                      { value: "all", label: "All Status" },
                      { value: "confirmed", label: "Confirmed" },
                      { value: "pending", label: "Pending" },
                      { value: "cancelled", label: "Cancelled" },
                    ]}
                  />
                  <Select
                    placeholder="Airline"
                    style={{ width: 150 }}
                    value={airlineFilter}
                    onChange={setAirlineFilter}
                    options={[
                      { value: "all", label: "All Airlines" },
                      ...Array.from(
                        new Set(processedBookings.map((b) => b.airline)),
                      )
                        .filter((airline) => airline !== "N/A")
                        .map((airline) => ({
                          value: airline,
                          label: airline,
                        })),
                    ]}
                  />
                  <RangePicker placeholder={["Start Date", "End Date"]} />
                  <Button icon={<ExportOutlined />}>Export Data</Button>
                </Space>
              </Card>

              {/* Bookings Table */}
              <Card>
                <Table
                  columns={columns}
                  dataSource={filteredBookings}
                  loading={isLoading}
                  rowKey="id"
                  pagination={{
                    total: filteredBookings.length,
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} of ${total} bookings`,
                  }}
                />
              </Card>
            </>
          )}

          {/* Create Group Booking Tab Content */}
          {activeTab === "create-booking" && (
            <AdminBookingFlow setLocation={setLocation} />
          )}

          {/* Manage Bookings Tab Content */}
          {activeTab === "manage-bookings" && (
            <>
              <div className="mb-6">
                <Title level={3} className="!mb-2 text-gray-900">
                  Manage Existing Bookings
                </Title>
                <Text className="text-gray-600">
                  Search and manage existing group bookings
                </Text>
              </div>

              <Row gutter={[24, 24]}>
                {/* Search Booking Form */}
                <Col xs={24} lg={14}>
                  <Card className="mb-6">
                    <div className="mb-6">
                      <Title level={4} className="!mb-2 text-gray-900">
                        Find Booking
                      </Title>
                      <Text className="text-gray-600">
                        Search for existing bookings by ID or customer details
                      </Text>
                    </div>

                    <Space direction="vertical" size="large" className="w-full">
                      <div>
                        <Text className="block mb-2 text-gray-700 font-medium">
                          Booking ID / Reference
                        </Text>
                        <Input
                          size="large"
                          placeholder="Enter booking ID or reference number"
                          className="w-full"
                        />
                      </div>

                      <div>
                        <Text className="block mb-2 text-gray-700 font-medium">
                          Customer Email
                        </Text>
                        <Input
                          size="large"
                          placeholder="Enter customer email address"
                          type="email"
                          className="w-full"
                        />
                      </div>

                      <div>
                        <Text className="block mb-2 text-gray-700 font-medium">
                          Group Leader Name
                        </Text>
                        <Input
                          size="large"
                          placeholder="Enter group leader name"
                          className="w-full"
                        />
                      </div>

                      <Button
                        type="primary"
                        size="large"
                        icon={<SearchOutlined />}
                        className="w-full infiniti-btn-primary"
                      >
                        Search Bookings
                      </Button>
                    </Space>
                  </Card>
                </Col>

                {/* Quick Actions */}
                <Col xs={24} lg={10}>
                  <Card>
                    <div className="mb-4">
                      <Title level={4} className="!mb-2 text-gray-900">
                        Quick Actions
                      </Title>
                      <Text className="text-gray-600">
                        Common booking management tasks
                      </Text>
                    </div>

                    <Space
                      direction="vertical"
                      size="middle"
                      className="w-full"
                    >
                      <Button
                        size="large"
                        icon={<UserOutlined />}
                        className="w-full text-left flex items-center justify-start"
                        style={{ height: "auto", padding: "12px 16px" }}
                      >
                        <div className="ml-2">
                          <div className="font-medium text-gray-900">
                            Add Passengers
                          </div>
                          <div className="text-sm text-gray-600">
                            Add passengers to existing booking
                          </div>
                        </div>
                      </Button>

                      <Button
                        size="large"
                        icon={<CalendarOutlined />}
                        className="w-full text-left flex items-center justify-start"
                        style={{ height: "auto", padding: "12px 16px" }}
                      >
                        <div className="ml-2">
                          <div className="font-medium text-gray-900">
                            Modify Dates
                          </div>
                          <div className="text-sm text-gray-600">
                            Change flight dates and times
                          </div>
                        </div>
                      </Button>

                      <Button
                        size="large"
                        icon={<DollarOutlined />}
                        className="w-full text-left flex items-center justify-start"
                        style={{ height: "auto", padding: "12px 16px" }}
                      >
                        <div className="ml-2">
                          <div className="font-medium text-gray-900">
                            Payment Management
                          </div>
                          <div className="text-sm text-gray-600">
                            Process payments and refunds
                          </div>
                        </div>
                      </Button>

                      <Button
                        size="large"
                        icon={<ExportOutlined />}
                        className="w-full text-left flex items-center justify-start"
                        style={{ height: "auto", padding: "12px 16px" }}
                      >
                        <div className="ml-2">
                          <div className="font-medium text-gray-900">
                            Generate Reports
                          </div>
                          <div className="text-sm text-gray-600">
                            Export booking details and manifests
                          </div>
                        </div>
                      </Button>
                    </Space>
                  </Card>
                </Col>

                {/* Recent Bookings for Management */}
                <Col span={24}>
                  <Card>
                    <div className="mb-4">
                      <Title level={4} className="!mb-2 text-gray-900">
                        Recent Bookings
                      </Title>
                      <Text className="text-gray-600">
                        Click on any booking to manage it
                      </Text>
                    </div>

                    <Row gutter={[16, 16]}>
                      {processedBookings.slice(0, 6).map((booking) => (
                        <Col xs={24} sm={12} lg={8} key={booking.id}>
                          <Card
                            className="h-full hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() =>
                              handleManageBooking(booking.bookingId)
                            }
                          >
                            <div className="mb-4">
                              <div className="flex justify-between items-start mb-2">
                                <Text className="font-bold text-lg text-blue-600">
                                  {booking.bookingId}
                                </Text>
                                <Tag
                                  color={
                                    booking.status === "confirmed"
                                      ? "green"
                                      : booking.status === "pending"
                                        ? "orange"
                                        : "red"
                                  }
                                >
                                  {booking.status?.charAt(0).toUpperCase() +
                                    booking.status?.slice(1)}
                                </Tag>
                              </div>
                            </div>

                            <Space
                              direction="vertical"
                              size="small"
                              className="w-full mb-4"
                            >
                              <div className="flex items-center gap-2 text-gray-600">
                                <UserOutlined className="text-sm" />
                                <Text className="text-sm">
                                  {booking.groupLeader}
                                </Text>
                              </div>

                              <div className="flex items-center gap-2 text-gray-600">
                                <CalendarOutlined className="text-sm" />
                                <Text className="text-sm">
                                  {booking.comprehensiveData?.tripDetails
                                    ?.origin || "N/A"}{" "}
                                  →{" "}
                                  {booking.comprehensiveData?.tripDetails
                                    ?.destination || "N/A"}
                                </Text>
                              </div>

                              <div className="flex items-center gap-2 text-gray-600">
                                <span className="text-sm">👥</span>
                                <Text className="text-sm">
                                  {booking.passengers} passengers
                                </Text>
                              </div>

                              <div className="flex items-center gap-2 text-gray-600">
                                <span className="text-sm">💰</span>
                                <Text className="text-sm font-semibold text-green-600">
                                  ${booking.totalAmount.toLocaleString()}
                                </Text>
                              </div>
                            </Space>

                            <Button
                              type="primary"
                              className="w-full infiniti-btn-primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleManageBooking(booking.bookingId);
                              }}
                            >
                              Manage Booking
                            </Button>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </Card>
                </Col>
              </Row>
            </>
          )}

          {/* Booking Details Modal */}
          <Modal
            title="Booking Details"
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={[
              <Button key="close" onClick={() => setIsModalVisible(false)}>
                Close
              </Button>,
              <Button
                key="edit"
                type="primary"
                onClick={() => {
                  setIsModalVisible(false);
                  handleEditBooking(selectedBooking);
                }}
              >
                Edit Booking
              </Button>,
            ]}
            width={800}
          >
            {selectedBooking && (
              <Descriptions bordered column={2}>
                <Descriptions.Item label="Booking ID">
                  {selectedBooking.bookingId}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag
                    color={
                      selectedBooking.status === "confirmed"
                        ? "green"
                        : selectedBooking.status === "pending"
                          ? "orange"
                          : "red"
                    }
                  >
                    {selectedBooking.status?.charAt(0).toUpperCase() +
                      selectedBooking.status?.slice(1)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Group Leader">
                  {selectedBooking.groupLeader}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {selectedBooking.email}
                </Descriptions.Item>
                <Descriptions.Item label="Route">
                  {selectedBooking.comprehensiveData?.tripDetails?.origin ||
                    "N/A"}{" "}
                  {" - "}
                  {selectedBooking.comprehensiveData?.tripDetails
                    ?.destination || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Departure Date">
                  {selectedBooking.comprehensiveData?.tripDetails
                    ?.departureDate !== "N/A"
                    ? new Date(
                        selectedBooking.comprehensiveData?.tripDetails?.departureDate,
                      ).toLocaleDateString()
                    : "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Passengers">
                  {selectedBooking.passengers}
                </Descriptions.Item>
                <Descriptions.Item label="Total Amount">
                  ${selectedBooking.totalAmount.toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Airline">
                  {selectedBooking.comprehensiveData?.flightDetails?.outbound
                    ?.airline || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Flight Number">
                  {selectedBooking.comprehensiveData?.flightDetails?.outbound
                    ?.flightNumber || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Payment Status">
                  <Tag
                    color={
                      selectedBooking.paymentStatus === "paid"
                        ? "green"
                        : "orange"
                    }
                  >
                    {selectedBooking.paymentStatus?.charAt(0).toUpperCase() +
                      selectedBooking.paymentStatus?.slice(1)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Booking Date">
                  {selectedBooking.bookingDate !== "N/A"
                    ? new Date(selectedBooking.bookingDate).toLocaleDateString()
                    : "N/A"}
                </Descriptions.Item>
              </Descriptions>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
}