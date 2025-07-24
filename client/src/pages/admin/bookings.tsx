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

  // Step 2: Flight Search & Bundles (Simplified for admin)
  const FlightSearchStep = () => {
    const [selectedFlight, setSelectedFlight] = useState<any>(null);
    const [flights, setFlights] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      searchFlights();
    }, []);

    const searchFlights = async () => {
      if (!bookingData) return;
      
      setLoading(true);
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
        setFlights(result.flights || []);
        if (result.flights && result.flights.length > 0) {
          setSelectedFlight(result.flights[0]);
        }
      } catch (error) {
        console.error("Flight search error:", error);
      } finally {
        setLoading(false);
      }
    };

    const handleNext = () => {
      if (selectedFlight) {
        const flightInfo = {
          outbound: selectedFlight,
          baseCost: selectedFlight.price * bookingData.totalPassengers,
          totalCost: selectedFlight.price * bookingData.totalPassengers,
        };
        setFlightData(flightInfo);
        localStorage.setItem("selectedFlightData", JSON.stringify(flightInfo));
        setCurrentStep(2);
      }
    };

    return (
      <div className="max-w-6xl">
        <div className="mb-6">
          <Title level={3} className="!mb-2 text-gray-900">
            Flight Search & Selection
          </Title>
          <Text className="text-gray-600">
            {bookingData?.origin} → {bookingData?.destination} • {bookingData?.totalPassengers} passengers
          </Text>
        </div>

        <Row gutter={24}>
          <Col xs={24} lg={16}>
            <Card title="Available Flights" loading={loading}>
              <div className="space-y-4">
                {flights.map((flight) => (
                  <div
                    key={flight.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedFlight?.id === flight.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedFlight(flight)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <Text className="font-medium">{flight.airline} {flight.flightNumber}</Text>
                        <div className="text-sm text-gray-600 mt-1">
                          {flight.origin} → {flight.destination}
                        </div>
                        <div className="text-sm text-gray-500">
                          Departure: {new Date(flight.departureTime).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <Text className="text-xl font-bold text-blue-600">
                          ${flight.price}
                        </Text>
                        <div className="text-sm text-gray-500">per person</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="Selection Summary">
              {selectedFlight && (
                <div className="space-y-3">
                  <div>
                    <Text className="text-gray-600">Selected Flight:</Text>
                    <div className="font-medium">{selectedFlight.airline} {selectedFlight.flightNumber}</div>
                  </div>
                  <div>
                    <Text className="text-gray-600">Total Cost:</Text>
                    <div className="text-xl font-bold text-blue-600">
                      ${(selectedFlight.price * bookingData.totalPassengers).toLocaleString()}
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
            disabled={!selectedFlight}
            size="large"
          >
            Continue to Services
          </Button>
        </div>
      </div>
    );
  };

  // Step 3: Add Services (Simplified)
  const AddServicesStep = () => {
    const [selectedServices, setSelectedServices] = useState<string[]>([]);

    const services = [
      { id: 'insurance', name: 'Travel Insurance', price: 25 },
      { id: 'priority-boarding', name: 'Priority Boarding', price: 15 },
      { id: 'extra-baggage', name: 'Extra Baggage', price: 45 },
      { id: 'seat-selection', name: 'Seat Selection', price: 20 },
      { id: 'meal-upgrade', name: 'Meal Upgrades', price: 30 },
    ];

    const handleNext = () => {
      const selected = services.filter(s => selectedServices.includes(s.id));
      setServicesData(selected);
      localStorage.setItem("selectedServices", JSON.stringify(selected));
      setCurrentStep(3);
    };

    return (
      <div className="max-w-4xl">
        <div className="mb-6">
          <Title level={3} className="!mb-2 text-gray-900">
            Additional Services
          </Title>
          <Text className="text-gray-600">
            Select additional services for your group booking
          </Text>
        </div>

        <Card>
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedServices.includes(service.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedServices([...selectedServices, service.id]);
                      } else {
                        setSelectedServices(selectedServices.filter(id => id !== service.id));
                      }
                    }}
                  />
                  <div>
                    <Text className="font-medium">{service.name}</Text>
                  </div>
                </div>
                <Text className="font-bold text-blue-600">${service.price} per person</Text>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <Button onClick={() => setCurrentStep(1)}>Back</Button>
            <Button type="primary" onClick={handleNext} size="large">
              Continue to Group Leader Info
            </Button>
          </div>
        </Card>
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

  // Step 5: Passenger Info (Simplified for admin)
  const PassengerInfoStep = () => {
    const handleNext = () => {
      // For admin, we can skip detailed passenger info or collect it later
      setCurrentStep(5);
    };

    return (
      <div className="max-w-4xl">
        <div className="mb-6">
          <Title level={3} className="!mb-2 text-gray-900">
            Passenger Information
          </Title>
          <Text className="text-gray-600">
            Passenger details can be added later. For now, we'll proceed with the group leader information.
          </Text>
        </div>

        <Card>
          <div className="text-center py-8">
            <div className="mb-4">
              <UserOutlined className="text-4xl text-gray-400" />
            </div>
            <Title level={4} className="text-gray-600">
              {bookingData?.totalPassengers} Passengers Required
            </Title>
            <Text className="text-gray-500">
              Detailed passenger information can be collected after booking confirmation
            </Text>
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
    const totalCost = (flightData?.baseCost || 0) + 
                     (servicesData.reduce((sum, service) => sum + service.price, 0) * (bookingData?.totalPassengers || 1));

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
            <Card title="Booking Summary" className="mb-6">
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
                <Descriptions.Item label="Passengers">
                  {bookingData?.totalPassengers}
                </Descriptions.Item>
                <Descriptions.Item label="Cabin">
                  {bookingData?.cabin}
                </Descriptions.Item>
                <Descriptions.Item label="Selected Flight">
                  {flightData?.outbound?.airline} {flightData?.outbound?.flightNumber}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {groupLeaderData && (
              <Card title="Group Leader Information">
                <Descriptions column={2} bordered>
                  <Descriptions.Item label="Name">
                    {groupLeaderData.firstName} {groupLeaderData.lastName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {groupLeaderData.email}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone">
                    {groupLeaderData.phoneNumber}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            )}
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Pricing Summary">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Text>Flight Cost:</Text>
                  <Text className="font-medium">${flightData?.baseCost || 0}</Text>
                </div>
                {servicesData.length > 0 && (
                  <div className="flex justify-between">
                    <Text>Services:</Text>
                    <Text className="font-medium">
                      ${servicesData.reduce((sum, service) => sum + service.price, 0) * (bookingData?.totalPassengers || 1)}
                    </Text>
                  </div>
                )}
                <Divider />
                <div className="flex justify-between text-lg font-bold">
                  <Text>Total:</Text>
                  <Text className="text-blue-600">${totalCost}</Text>
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
        const comprehensiveBookingData = {
          bookingData,
          flightData,
          bundleData: null,
          selectedServices: servicesData,
          groupLeaderData,
          paymentData: { ...values, paymentMethod },
          passengerData: [],
          bookingSummary: {
            totalAmount: (flightData?.baseCost || 0) + 
                        (servicesData.reduce((sum, service) => sum + service.price, 0) * (bookingData?.totalPassengers || 1))
          }
        };

        const response = await fetch("/api/group-bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(comprehensiveBookingData),
        });

        if (response.ok) {
          const result = await response.json();
          message.success("Booking created successfully!");
          
          // Clear localStorage
          localStorage.removeItem("bookingFormData");
          localStorage.removeItem("selectedFlightData");
          localStorage.removeItem("selectedServices");
          localStorage.removeItem("groupLeaderData");
          localStorage.removeItem("isAdminBooking");
          
          // Reset to tab view
          setCurrentStep(0);
          setLocation("/admin/bookings");
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
                  <Radio value="bank">Bank Transfer</Radio>
                  <Radio value="corporate">Corporate Account</Radio>
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
    "Flight Search",
    "Add Services", 
    "Group Leader",
    "Passenger Info",
    "Review",
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