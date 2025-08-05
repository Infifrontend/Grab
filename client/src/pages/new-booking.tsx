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
  const [tripType, setTripType] = useState<"oneWay" | "roundTrip">("roundTrip");
  const navigate = useNavigate();
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

      const searchResponse = await apiRequest(
        "POST",
        "/api/search",
        searchData
      );
      const searchResult = await searchResponse.json();

      if (!searchResult.flights || searchResult.flights.length === 0) {
        message.error("No flights found for your search criteria");
        return;
      }

      // Store search results and criteria for the flight search bundle page
      localStorage.setItem(
        "searchResults",
        JSON.stringify(searchResult?.flights)
      );
      localStorage.setItem(
        "returnFlights",
        JSON.stringify(searchResult?.returnFlights)
      );
      localStorage.setItem("searchCriteria", JSON.stringify(searchData));
      localStorage.setItem("passengerCount", totalPassengers.toString());

      // Store all form data for consistent booking flow
      localStorage.setItem(
        "bookingFormData",
        JSON.stringify({
          origin: values.origin,
          destination: values.destination,
          departureDate: values.departureDate,
          returnDate: values.returnDate,
          tripType: tripType,
          adults: values.adults,
          kids: values.kids,
          infants: values.infants,
          cabin: values.cabin,
          specialRequests: values.specialRequests,
          totalPassengers,
        })
      );

      message.success(
        `Found ${searchResult.flights.length} flights! Redirecting to flight selection...`
      );

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
      <div className="mb-8">
        <BookingSteps currentStep={0} size="small" className="mb-6" />
      </div>

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
            <Text className="block mb-3 text-gray-700 font-medium">
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

          {/* Origin and Destination */}
          <Row gutter={24} className="mb-6">
            <Col xs={24} md={12}>
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
            <Col xs={24} md={12}>
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
          </Row>

          {/* Dates */}
          <Row gutter={24} className="mb-6">
            <Col xs={24} md={12}>
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
            <Col xs={24} md={12}>
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

          {/* Passengers */}
          <div className="mb-6">
            <Text className="block mb-3 text-gray-700 font-medium">
              Passengers *
            </Text>
            <Row gutter={24}>
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
          </div>

          {/* Cabin */}
          <Row gutter={24} className="mb-6">
            <Col xs={24} md={12}>
              <Form.Item
                label="Cabin *"
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

          {/* Special Requests */}
          <Form.Item label="Special Requests" name="specialRequests">
            <TextArea
              rows={4}
              placeholder="Any special requirements or requests for your group..."
              className="resize-none"
            />
          </Form.Item>
        </Form>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={handleBackToHome}
          className="text-gray-600 hover:text-gray-800"
        >
          Back to Home
        </Button>

        <Button
          type="primary"
          size="large"
          loading={searchMutation.isPending}
          onClick={() => form.submit()}
          className="infiniti-btn-primary px-8"
        >
          {searchMutation.isPending
            ? "Searching Flights..."
            : "Continue to Flight Search"}
        </Button>
      </div>
    </div>
  );
}
