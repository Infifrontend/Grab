import { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Radio,
  message,
  InputNumber,
  Row,
  Col,
} from "antd";
import { EnvironmentOutlined, CalendarOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useNavigate } from "react-router-dom";
const { Option } = Select;

interface SearchFormData {
  tripType: "oneWay" | "roundTrip" | "multiCity";
  origin: string;
  destination: string;
  departureDate: Date;
  returnDate?: Date;
  adults: number;
  kids: number;
  infants: number;
  cabin: string;
}

export default function QuickBookingForm() {
  const [form] = Form.useForm();
  const [tripType, setTripType] = useState<
    "oneWay" | "roundTrip" | "multiCity"
  >("oneWay");
  const navigate = useNavigate();
  const adminMode = JSON.parse(localStorage.getItem("adminLoggedIn") || "false");
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
          console.log(`Loaded ${data.locations.length} flight locations for quick booking`);
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

  const searchMutation = useMutation({
    mutationFn: async (searchData: SearchFormData) => {
      // Convert Date objects to ISO strings for API
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
      message.success(`Found ${data.flights?.length || 0} flights!`);
      navigate("/flight-search-results");
    },
    onError: (error) => {
      console.error("Search error:", error);
      message.error("Search failed. Please try again.");
    },
  });

  const quickBookMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      const response = await apiRequest(
        "POST",
        "/api/flight-bookings",
        bookingData,
      );
      return response.json();
    },
    onSuccess: (data) => {
      message.success(
        `Booking created! Reference: ${data.booking.bookingReference}`,
      );
      navigate(`/booking-details?ref=${data.booking.bookingReference}`);
    },
    onError: (error) => {
      console.error("Booking error:", error);
      message.error("Booking failed. Please try again.");
    },
  });

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

    try {
      // First search for available flights from database
      const totalPassengers =
        (values.adults || 1) + (values.kids || 0) + (values.infants || 0);
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
        searchData,
      );
      const searchResult = await searchResponse.json();

      if (!searchResult.flights || searchResult.flights.length === 0) {
        message.error("No flights found for your search criteria");
        return;
      }

      // Store search results and criteria for the flight search bundle page
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

      // Store all form data for consistent booking flow
      localStorage.setItem(
        "bookingFormData",
        JSON.stringify({
          origin: values.origin,
          destination: values.destination,
          departureDate: values.departureDate,
          returnDate: values.returnDate,
          tripType: tripType, // Use the tripType state instead of values.tripType
          adults: values.adults,
          kids: values.kids,
          infants: values.infants,
          cabin: values.cabin,
          totalPassengers,
        }),
      );

      message.success(
        `Found ${searchResult.flights.length} flights! Redirecting to flight selection...`,
      );

      // Navigate to flight search bundle page
      navigate(adminMode ? "/admin/flight-search-bundle" : "/flight-search-bundle");
    } catch (error) {
      console.error("Search and book error:", error);
      message.error("Flight search failed. Please try again.");
    }
  };

  return (
    <Card className="h-fit">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Quick Booking
        </h2>
        <p className="text-sm text-gray-600">
          Get started with your group travel booking
        </p>
      </div>

      {/* Trip Type Selection */}
      <div className="mb-6">
        <Radio.Group
          value={tripType}
          onChange={(e) => setTripType(e.target.value)}
          className="flex gap-6"
        >
          <Radio value="oneWay" className="text-sm">
            One way
          </Radio>
          <Radio value="roundTrip" className="text-sm">
            Round trip
          </Radio>
        </Radio.Group>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
      >
        {/* Origin and Destination */}
        <Row gutter={16} className="mb-4">
          <Col span={12}>
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
                  <Option key={location} value={location}>
                    {location}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
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
                  <Option key={location} value={location}>
                    {location}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Dates */}
        <Row gutter={16} className="mb-4">
          <Col span={12}>
            <Form.Item
              label="Departure date *"
              name="departureDate"
              rules={[
                { required: true, message: "Please select departure date" },
              ]}
            >
              <DatePicker
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
          <Col span={12}>
            <Form.Item label="Return date" name="returnDate">
              <DatePicker
                className="w-full"
                placeholder="DD MMM YYYY"
                format="DD MMM YYYY"
                disabled={tripType === "oneWay"}
                suffixIcon={<CalendarOutlined className="text-gray-400" />}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Passengers */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Passengers *
          </label>
          <Row gutter={16}>
            <Col span={8}>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Adults (12+ years)
                </label>
                <Form.Item name="adults" initialValue={0} className="mb-0">
                  <InputNumber min={0} className="w-full" placeholder="0" />
                </Form.Item>
              </div>
            </Col>
            <Col span={8}>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Kids (2-11 years)
                </label>
                <Form.Item name="kids" initialValue={0} className="mb-0">
                  <InputNumber min={0} className="w-full" placeholder="0" />
                </Form.Item>
              </div>
            </Col>
            <Col span={8}>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Infants (0-2 years)
                </label>
                <Form.Item name="infants" initialValue={0} className="mb-0">
                  <InputNumber min={0} className="w-full" placeholder="0" />
                </Form.Item>
              </div>
            </Col>
          </Row>
        </div>

        {/* Cabin */}
        <Form.Item
          label="Cabin *"
          name="cabin"
          initialValue="economy"
          className="mb-6"
        >
          <Select placeholder="Select cabin class">
            <Option value="economy">Economy</Option>
            <Option value="business">Business</Option>
            <Option value="first">First Class</Option>
          </Select>
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          loading={searchMutation.isPending || quickBookMutation.isPending}
          className="w-full infiniti-btn-primary"
        >
          {searchMutation.isPending
            ? "Searching Flights..."
            : quickBookMutation.isPending
              ? "Creating Booking..."
              : "Search Flight"}
        </Button>
      </Form>
    </Card>
  );
}