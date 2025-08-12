import { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Radio,
  Typography,
  Row,
  Col,
  InputNumber,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import BookingSteps from "@/components/booking/booking-steps";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface SearchFormData {
  tripType: "oneWay" | "roundTrip";
  origin: string;
  destination: string;
  departureDate: Date;
  returnDate?: Date;
  adults: number;
  kids: number;
  infants: number;
  cabin: string;
  specialRequests?: string;
}

export default function NewBooking() {
  const [form] = Form.useForm();
  const userMode = JSON.parse(localStorage.getItem("userLoggedIn") || "false");
  const [tripType, setTripType] = useState<"oneWay" | "roundTrip">("oneWay");
  const navigate = useNavigate();
  // State for dynamic location options
  const [originOptions, setOriginOptions] = useState<string[]>([]);
  const [destinationOptions, setDestinationOptions] = useState<string[]>([]);

  // Fetch flight locations on component mount
  useEffect(() => {
    const fetchFlightLocations = async () => {
      try {
        const response = await fetch("/api/flight-locations");
        const data = await response.json();

        if (data.locations) {
          setOriginOptions(data.locations);
          setDestinationOptions(data.locations);
          console.log(`Loaded ${data.locations.length} flight locations for new booking`);
        }
      } catch (error) {
        console.error("Error fetching flight locations:", error);
        // Fallback to default locations if API fails
        const fallbackLocations = [
          "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata",
          "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Kochi"
        ];
        setOriginOptions(fallbackLocations);
        setDestinationOptions(fallbackLocations);
      }
    };

    fetchFlightLocations();
  }, []);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const searchMutation = useMutation({
    mutationFn: async (searchData: SearchFormData) => {
      const totalPassengers =
        searchData.adults + searchData.kids + searchData.infants;
      const apiData = {
        origin: searchData.origin,
        destination: searchData.destination,
        departureDate: searchData.departureDate.toISOString(),
        returnDate: searchData.returnDate?.toISOString(),
        passengers: totalPassengers,
        cabin: searchData.cabin,
        tripType: searchData.tripType,
      };
      const response = await apiRequest("POST", "/api/search", apiData);
      return response.json();
    },
    onSuccess: (data) => {
      console.log("Search results:", data);
      // Store search results in localStorage for the results page
      localStorage.setItem("searchResults", JSON.stringify(data.flights || []));
      localStorage.setItem(
        "returnFlights",
        JSON.stringify(data.returnFlights || [])
      );
      message.success(`Found ${data.flights?.length || 0} flights!`);
      navigate("/flight-search-bundle");
    },
    onError: (error) => {
      console.error("Search error:", error);
      message.error("Search failed. Please try again.");
    },
  });

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleSubmit = async (values: any) => {
    if (!values.origin || !values.destination || !values.departureDate) {
      message.error("Please fill in origin, destination, and departure date");
      return;
    }

    // Validate at least one adult passenger is required
    const totalPassengers =
      (values.adults || 0) + (values.kids || 0) + (values.infants || 0);
    if (totalPassengers === 0 || (values.adults || 0) === 0) {
      message.error("At least one adult passenger is required");
      return;
    }

    // Validate return date for round trip
    if (tripType === "roundTrip" && !values.returnDate) {
      message.error("Return date is required for round trip bookings");
      return;
    }

    try {
      // First search for available flights from database
      const searchData = {
        origin: values.origin,
        destination: values.destination,
        departureDate: values.departureDate.format("YYYY-MM-DD"),
        returnDate: values.returnDate?.format("YYYY-MM-DD") || null,
        passengers: totalPassengers,
        cabin: values.cabin || "economy",
        tripType: tripType,
      };

      console.log("Sending search request:", searchData);

      const searchResponse = await apiRequest(
        "POST",
        "/api/search",
        searchData
      );

      if (!searchResponse.ok) {
        const errorData = await searchResponse.json();
        console.error("Search API error:", errorData);
        message.error(errorData.details || errorData.message || "Search failed");
        return;
      }

      const searchResult = await searchResponse.json();
      console.log("Search result received:", searchResult);

      if (!searchResult.flights || searchResult.flights.length === 0) {
        message.error("No flights found for your search criteria. Please try different dates or destinations.");
        return;
      }

      // Store search results and criteria for the flight search results page
      localStorage.setItem(
        "searchResults",
        JSON.stringify(searchResult?.flights),
      );
      localStorage.setItem(
        "returnFlights",
        JSON.stringify(searchResult?.returnFlights),
      );
      localStorage.setItem("searchCriteria", JSON.stringify(searchData));
      localStorage.setItem("passengerCount", totalPassengers.toString());

      console.log("Search completed successfully, navigating to flight search results");
      message.success(`Found ${searchResult.flights.length} flights`);

      // Navigate to flight search bundle page
      navigate("/flight-search-bundle");
    } catch (error) {
      console.error("Search and book error:", error);
      message.error("Flight search failed. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      {/* Multi-step Progress */}
      { userMode &&
        <div className="mb-8">
          <BookingSteps currentStep={0} size="small" className="mb-6" />
        </div>
      }

      {/* Page Header */}
      <div className="mb-6">
        <Title level={2} className="!mb-2 text-gray-900">
          New Group Booking
        </Title>
        <Text className="text-gray-600">
          Let's start by gathering some basic information about your trip.
        </Text>
      </div>

      {/* Trip Details Form */}
      <Card className="mb-6">
        <Title level={4} className="!mb-6 text-gray-800">
          Trip Details
        </Title>

        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={handleSubmit}
          initialValues={{
            adults: 1,
            kids: 0,
            infants: 0,
            cabin: "economy",
          }}
        >
          {/* Trip Type */}
          <div className="mb-6">
            <Text className="block mb-3 text-gray-700 font-bold">
              Trip Type
            </Text>
            <Radio.Group
              value={tripType}
              onChange={(e) => setTripType(e.target.value)}
              className="flex gap-8"
            >
              <Radio value="oneWay">One way</Radio>
              <Radio value="roundTrip">Round trip</Radio>
            </Radio.Group>
          </div>

          <Row gutter={24} className="mb-2">
            {/* Origin and Destination */}
            <Col xs={24} md={userMode ? 12 : 6}>
              <Form.Item
                label="Origin *"
                name="origin"
                rules={[{ required: true, message: "Please select origin" }]}
              >
                <Select
                  mode="combobox"
                  size="large"
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
                    <Option key={location} value={location}>
                      {location}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={userMode ? 12 : 6}>
              <Form.Item
                label="Destination *"
                name="destination"
                rules={[
                  { required: true, message: "Please select destination" },
                ]}
              >
                <Select
                  mode="combobox"
                  size="large"
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
                    <Option key={location} value={location}>
                      {location}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            {/* Dates */}
            <Col xs={24} md={userMode ? 12 : 6}>
              <Form.Item
                label="Departure date *"
                name="departureDate"
                rules={[
                  { required: true, message: "Please select departure date" },
                ]}
              >
                <DatePicker
                  size="large"
                  className="w-full"
                  placeholder="DD MMM YYYY"
                  format="DD MMM YYYY"
                  suffixIcon={<CalendarOutlined className="text-gray-400" />}
                  disabledDate={(current) =>
                    current && current.isBefore(new Date(), "day")
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={userMode ? 12 : 6}>
              <Form.Item
                label="Return date"
                name="returnDate"
                rules={
                  tripType !== "oneWay"
                    ? [
                        {
                          required: true,
                          message: "Please select return date",
                        },
                      ]
                    : []
                }
              >
                <DatePicker
                  size="large"
                  className="w-full"
                  placeholder="DD MMM YYYY"
                  format="DD MMM YYYY"
                  disabled={tripType === "oneWay"}
                  suffixIcon={<CalendarOutlined className="text-gray-400" />}
                  disabledDate={(current) =>
                    current && current.isBefore(new Date(), "day")
                  }
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            {/* Passengers */}
            <Col xs={24} md={userMode ? 24 : 18}>
              <Row gutter={[24, 0]}>
                <Col span={24} className="mb-2">
                  <Text className="block text-gray-700 font-bold">
                    Passengers *
                  </Text>
                </Col>
                <Col xs={24} md={8}>
                  <div>
                    <Text className="block mb-2 text-gray-600 text-sm">
                      Adults (12+ years)
                    </Text>
                    <Form.Item
                      name="adults"
                      rules={[
                        { required: true, message: "At least 1 adult required" },
                        {
                          validator: (_, value) => {
                            if (value && value > 0) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error("At least 1 adult is required")
                            );
                          },
                        },
                      ]}
                    >
                      <InputNumber
                        size="large"
                        min={1}
                        className="w-full"
                        placeholder="1"
                      />
                    </Form.Item>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div>
                    <Text className="block mb-2 text-gray-600 text-sm">
                      Kids (2-11 years)
                    </Text>
                    <Form.Item name="kids">
                      <InputNumber
                        size="large"
                        min={0}
                        className="w-full"
                        placeholder="0"
                      />
                    </Form.Item>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div>
                    <Text className="block mb-2 text-gray-600 text-sm">
                      Infants (0-2 years)
                    </Text>
                    <Form.Item name="infants">
                      <InputNumber
                        size="large"
                        min={0}
                        className="w-full"
                        placeholder="0"
                      />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
            </Col>
            {/* Cabin */}
            <Col xs={24} md={userMode ? 24 : 6}>
              <Row gutter={[24, 0]} className="mb-2">
                <Col span={24} className="mb-2">
                  <Text className="block text-gray-700 font-bold">
                    Cabin *
                  </Text>
                </Col>
                <Col span={userMode ? 12 : 24}>
                  <Text className="block mb-2 text-gray-600 text-sm">
                    Cabin Class
                  </Text>
                  <Form.Item
                    name="cabin"
                    rules={[
                      { required: true, message: "Please select cabin class" },
                    ]}
                  >
                    <Select size="large" placeholder="Select cabin class">
                      <Option value="economy">Economy</Option>
                      <Option value="business">Business</Option>
                      <Option value="first">First Class</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            {/* Special Requests */}
            <Col xs={24} md={userMode ? 24 : 15}>
              <Form.Item label="Special Requests" name="specialRequests">
                <TextArea
                  rows={4}
                  placeholder="Any special requirements or requests for your group..."
                  className="resize-none"
                />
              </Form.Item>
            </Col>
          </Row>

        </Form>
      </Card>

      {/* Navigation Buttons */}
        <div className={`flex ${userMode ? "justify-between" : "justify-center"} items-center`}>
        { userMode &&
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleBackToHome}
            className="text-gray-600 hover:text-gray-800"
          >
            Back to Home
          </Button>
        }
          <Button
            type="primary"
            size="large"
            loading={searchMutation.isPending}
            onClick={() => form.submit()}
            className="infiniti-btn-primary px-8"
          >
            { !userMode
              ? "Search Flights"
              : searchMutation.isPending
                ? "Searching Flights..."
                : "Continue to Flight Search"
            }
          </Button>
        </div>
    </div>
  );
}