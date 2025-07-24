import { useState, useMemo } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Select,
  Slider,
  Checkbox,
  Divider,
  Badge,
  Space,
  Radio,
  Input,
  DatePicker,
  InputNumber,
} from "antd";
import {
  EditOutlined,
  WifiOutlined,
  PlayCircleOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import Header from "@/components/layout/header";
import { useLocation } from "wouter";

const { Title, Text } = Typography;
const { Option } = Select;

interface FlightResult {
  id: number;
  airline: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  aircraft: string;
  price: number;
  badges: string[];
  amenities: string[];
}

const mockFlights: FlightResult[] = [
  {
    id: 1,
    airline: "American Airlines",
    flightNumber: "AA100",
    departureTime: "06:05 PM",
    arrivalTime: "06:20 AM+1",
    duration: "7h 15m",
    aircraft: "Boeing 777-300ER",
    price: 1180,
    badges: ["Non-stop"],
    amenities: ["WiFi", "Meals"],
  },
  {
    id: 2,
    airline: "British Airways",
    flightNumber: "BA178",
    departureTime: "10:30 AM",
    arrivalTime: "10:15 PM",
    duration: "7h 45m",
    aircraft: "Boeing 777-300ER",
    price: 1252,
    badges: ["Non-stop"],
    amenities: ["WiFi", "Meals", "Entertainment"],
  },
  {
    id: 3,
    airline: "Air France",
    flightNumber: "AF007",
    departureTime: "11:20 AM",
    arrivalTime: "10:45 PM",
    duration: "7h 25m",
    aircraft: "Boeing 777-200ER",
    price: 1290,
    badges: ["Non-stop"],
    amenities: ["WiFi", "Meals", "Entertainment"],
  },
  {
    id: 4,
    airline: "Lufthansa",
    flightNumber: "LH401",
    departureTime: "02:45 PM",
    arrivalTime: "01:30 PM+1",
    duration: "8h 45m",
    aircraft: "Airbus A340-600",
    price: 1350,
    badges: ["1 stop"],
    amenities: ["WiFi", "Meals"],
  },
  {
    id: 5,
    airline: "Virgin Atlantic",
    flightNumber: "VS45",
    departureTime: "08:15 AM",
    arrivalTime: "07:30 PM",
    duration: "8h 15m",
    aircraft: "Airbus A350-1000",
    price: 1470,
    badges: ["Non-stop"],
    amenities: ["WiFi", "Meals", "Entertainment"],
  },
];

export default function FlightSearchResults() {
  const [, setLocation] = useLocation();

  // Filter states
  const [sortBy, setSortBy] = useState("price-low");
  const [priceRange, setPriceRange] = useState<[number, number]>([1000, 3000]);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [departureTime, setDepartureTime] = useState("any");
  const [maxStops, setMaxStops] = useState("any");
  const [maxDuration, setMaxDuration] = useState("any");

  // Modify search toggle state
  const [showModifySearch, setShowModifySearch] = useState(false);

  // Modify search form state
  const [tripType, setTripType] = useState<
    "oneWay" | "roundTrip" | "multiCity"
  >("oneWay");
  const [origin, setOrigin] = useState("Chennai");
  const [destination, setDestination] = useState("Mumbai");
  const [departureDate, setDepartureDate] = useState("17 / 07 / 2025");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState(12);
  const [kids, setKids] = useState(12);
  const [infants, setInfants] = useState(0);
  const [cabin, setCabin] = useState("Economy");

  const handleSelectFlight = (flightId: number) => {
    console.log("Selected flight:", flightId);
    // Navigate to booking details or next step
  };

  const handleModifySearch = () => {
    // Save current search criteria before navigating back
    const searchCriteria = {
      origin,
      destination,
      departureDate,
      returnDate,
      adults,
      kids,
      infants,
      cabin,
      tripType
    };
    localStorage.setItem("searchCriteria", JSON.stringify(searchCriteria));
    setLocation("/");
  };

  const handleSearchFlights = () => {
    console.log("Searching flights with modified criteria");
    // Add search logic here
  };

  const handleCancelModify = () => {
    setShowModifySearch(false);
  };

  const getAirlineIcon = (airline: string) => {
    return "✈";
  };

  // Filter and sort flights
  const filteredAndSortedFlights = useMemo(() => {
    let filtered = mockFlights.filter((flight) => {
      // Price range filter
      if (flight.price < priceRange[0] || flight.price > priceRange[1]) {
        return false;
      }

      // Airlines filter
      if (
        selectedAirlines.length > 0 &&
        !selectedAirlines.includes(flight.airline)
      ) {
        return false;
      }

      // Departure time filter
      if (departureTime !== "any") {
        const depTime = parseInt(flight.departureTime.split(":")[0]);
        const isAM = flight.departureTime.includes("AM");
        const hour24 = isAM
          ? depTime === 12
            ? 0
            : depTime
          : depTime === 12
            ? 12
            : depTime + 12;

        switch (departureTime) {
          case "morning":
            if (hour24 < 6 || hour24 >= 12) return false;
            break;
          case "afternoon":
            if (hour24 < 12 || hour24 >= 18) return false;
            break;
          case "evening":
            if (hour24 < 18 || hour24 >= 24) return false;
            break;
        }
      }

      // Max stops filter
      if (maxStops !== "any") {
        const isNonStop = flight.badges.includes("Non-stop");
        const isOneStop = flight.badges.includes("1 stop");

        switch (maxStops) {
          case "nonstop":
            if (!isNonStop) return false;
            break;
          case "1stop":
            if (!isOneStop) return false;
            break;
          case "2stops":
            if (isNonStop || isOneStop) return false;
            break;
        }
      }

      // Max duration filter
      if (maxDuration !== "any") {
        const durationHours = parseInt(flight.duration.split("h")[0]);
        const maxHours = parseInt(maxDuration);
        if (durationHours > maxHours) return false;
      }

      return true;
    });

    // Sort flights
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "duration":
        filtered.sort((a, b) => {
          const aDuration =
            parseInt(a.duration.split("h")[0]) * 60 +
            parseInt(a.duration.split("h")[1].split("m")[0]);
          const bDuration =
            parseInt(b.duration.split("h")[0]) * 60 +
            parseInt(b.duration.split("h")[1].split("m")[0]);
          return aDuration - bDuration;
        });
        break;
      case "departure":
        filtered.sort((a, b) => {
          const aTime = parseInt(a.departureTime.replace(/[^\d]/g, ""));
          const bTime = parseInt(b.departureTime.replace(/[^\d]/g, ""));
          return aTime - bTime;
        });
        break;
    }

    return filtered;
  }, [
    mockFlights,
    sortBy,
    priceRange,
    selectedAirlines,
    departureTime,
    maxStops,
    maxDuration,
  ]);

  // Handle airline selection
  const handleAirlineChange = (airline: string, checked: boolean) => {
    if (checked) {
      setSelectedAirlines([...selectedAirlines, airline]);
    } else {
      setSelectedAirlines(selectedAirlines.filter((a) => a !== airline));
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSortBy("price-low");
    setPriceRange([1000, 3000]);
    setSelectedAirlines([]);
    setDepartureTime("any");
    setMaxStops("any");
    setMaxDuration("any");
  };

  // Get unique airlines for filter
  const availableAirlines = Array.from(
    new Set(mockFlights.map((flight) => flight.airline)),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <Title level={2} className="!mb-4 text-gray-900">
            Flight Search Results
          </Title>

          {/* Search Summary / Modify Search Section */}
          <Card className="mb-6">
            {!showModifySearch ? (
              /* Compact Search Summary */
              <div className="bg-gray-50 p-4 rounded-lg border">
                <Row align="middle" justify="space-between">
                  <Col>
                    <Row gutter={[24, 8]} align="middle">
                      <Col>
                        <div>
                          <Text className="text-gray-600 text-sm">Route</Text>
                          <Text className="block font-medium">
                            {origin} → {destination}
                          </Text>
                        </div>
                      </Col>
                      <Col>
                        <div>
                          <Text className="text-gray-600 text-sm">
                            Trip Type
                          </Text>
                          <Text className="block font-medium">
                            {tripType === "oneWay"
                              ? "One Way"
                              : tripType === "roundTrip"
                                ? "Round Trip"
                                : "Multi City"}
                          </Text>
                        </div>
                      </Col>
                      <Col>
                        <div>
                          <Text className="text-gray-600 text-sm">
                            Departure
                          </Text>
                          <Text className="block font-medium">
                            {departureDate}
                          </Text>
                        </div>
                      </Col>
                      <Col>
                        <div>
                          <Text className="text-gray-600 text-sm">
                            Passengers
                          </Text>
                          <Text className="block font-medium">
                            {adults + kids + infants} passengers
                          </Text>
                        </div>
                      </Col>
                      <Col>
                        <div>
                          <Text className="text-gray-600 text-sm">Cabin</Text>
                          <Text className="block font-medium">{cabin}</Text>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col>
                    <Button
                      type="link"
                      icon={<EditOutlined />}
                      onClick={() => setShowModifySearch(true)}
                      className="text-blue-600"
                    >
                      Modify Search
                    </Button>
                  </Col>
                </Row>
              </div>
            ) : (
              /* Full Modify Search Form */
              <div>
                {/* Trip Type Selection */}
                <div className="mb-4">
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
                    <Radio value="multiCity" className="text-sm">
                      Multi city
                    </Radio>
                  </Radio.Group>
                </div>

                {/* Origin and Destination Row */}
                <Row gutter={[16, 16]} className="mb-4">
                  <Col xs={24} md={6}>
                    <div>
                      <Text className="text-gray-600 text-sm block mb-1">
                        Origin
                      </Text>
                      <Input
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        prefix={
                          <EnvironmentOutlined className="text-gray-400" />
                        }
                        placeholder="City / Airport"
                      />
                    </div>
                  </Col>
                  <Col xs={24} md={6}>
                    <div>
                      <Text className="text-gray-600 text-sm block mb-1">
                        Destination
                      </Text>
                      <Input
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        prefix={
                          <EnvironmentOutlined className="text-gray-400" />
                        }
                        placeholder="City / Airport"
                      />
                    </div>
                  </Col>
                  <Col xs={24} md={6}>
                    <div>
                      <Text className="text-gray-600 text-sm block mb-1">
                        Departure Date
                      </Text>
                      <Input
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                        placeholder="DD MMM YYYY"
                      />
                    </div>
                  </Col>
                  <Col xs={24} md={6}>
                    <div>
                      <Text className="text-gray-600 text-sm block mb-1">
                        Return Date
                      </Text>
                      <Input
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        placeholder="DD MMM YYYY"
                        disabled={tripType === "oneWay"}
                      />
                    </div>
                  </Col>
                </Row>

                {/* Passengers and Cabin Row */}
                <Row gutter={[16, 16]} className="mb-4">
                  <Col xs={24} md={18}>
                    <Text className="text-gray-600 text-sm block mb-2">
                      Passengers
                    </Text>
                    <Row gutter={[16, 8]}>
                      <Col xs={8} md={6}>
                        <div>
                          <Text className="text-gray-700 text-sm block mb-1">
                            Adults (12+ years)
                          </Text>
                          <InputNumber
                            min={0}
                            value={adults}
                            onChange={(value) => setAdults(value || 0)}
                            className="w-full"
                          />
                        </div>
                      </Col>
                      <Col xs={8} md={6}>
                        <div>
                          <Text className="text-gray-700 text-sm block mb-1">
                            Kids (2-11 years)
                          </Text>
                          <InputNumber
                            min={0}
                            value={kids}
                            onChange={(value) => setKids(value || 0)}
                            className="w-full"
                          />
                        </div>
                      </Col>
                      <Col xs={8} md={6}>
                        <div>
                          <Text className="text-gray-700 text-sm block mb-1">
                            Infants (0-2 years)
                          </Text>
                          <InputNumber
                            min={0}
                            value={infants}
                            onChange={(value) => setInfants(value || 0)}
                            className="w-full"
                          />
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={24} md={6}>
                    <div>
                      <Text className="text-gray-600 text-sm block mb-1">
                        Cabin
                      </Text>
                      <Select
                        value={cabin}
                        onChange={setCabin}
                        className="w-full"
                        suffixIcon={<span className="text-gray-400">▼</span>}
                      >
                        <Select.Option value="Economy">Economy</Select.Option>
                        <Select.Option value="Business">Business</Select.Option>
                        <Select.Option value="First">First Class</Select.Option>
                      </Select>
                    </div>
                  </Col>
                </Row>

                {/* Action Buttons */}
                <Row gutter={16}>
                  <Col>
                    <Button
                      type="primary"
                      onClick={handleSearchFlights}
                      className="infiniti-btn-primary"
                    >
                      Search Flights
                    </Button>
                  </Col>
                  <Col>
                    <Button onClick={handleCancelModify}>Cancel</Button>
                  </Col>
                </Row>
              </div>
            )}
          </Card>
        </div>

        <Row gutter={24}>
          {/* Filters Sidebar */}
          <Col xs={24} lg={6}>
            <Card>
              <div className="mb-6">
                <Title level={4} className="!mb-4 text-gray-800">
                  🔍 Search & Filters
                </Title>

                {/* Sort By */}
                <div className="mb-6">
                  <Text className="text-gray-700 font-medium block mb-2">
                    Sort By
                  </Text>
                  <Select
                    value={sortBy}
                    onChange={setSortBy}
                    className="w-full"
                    options={[
                      { value: "price-low", label: "Price (Low to High)" },
                      { value: "price-high", label: "Price (High to Low)" },
                      { value: "duration", label: "Duration" },
                      { value: "departure", label: "Departure Time" },
                    ]}
                  />
                </div>

                <Divider />

                {/* Price Range */}
                <div className="mb-6">
                  <Text className="text-gray-700 font-medium block mb-3">
                    💰 Price Range
                  </Text>
                  <Slider
                    range
                    min={0}
                    max={3000}
                    value={priceRange}
                    onChange={setPriceRange}
                    className="mb-2"
                  />
                  <div className="flex justify-between">
                    <Text className="text-gray-600 text-sm">
                      ₹{priceRange[0]}
                    </Text>
                    <Text className="text-gray-600 text-sm">
                      ₹{priceRange[1]}
                    </Text>
                  </div>
                </div>

                <Divider />

                {/* Airlines Filter */}
                <div className="mb-6">
                  <Text className="text-gray-700 font-medium block mb-3">
                    Airlines
                  </Text>
                  <Space direction="vertical" className="w-full">
                    {availableAirlines.map((airline) => (
                      <Checkbox
                        key={airline}
                        checked={selectedAirlines.includes(airline)}
                        onChange={(e) =>
                          handleAirlineChange(airline, e.target.checked)
                        }
                      >
                        <Text className="text-sm">{airline}</Text>
                      </Checkbox>
                    ))}
                  </Space>
                </div>

                <Divider />

                {/* Departure Time */}
                <div className="mb-6">
                  <Text className="text-gray-700 font-medium block mb-3">
                    🕐 Departure Time
                  </Text>
                  <Select
                    value={departureTime}
                    onChange={setDepartureTime}
                    className="w-full"
                    options={[
                      { value: "any", label: "Any time" },
                      { value: "morning", label: "Morning (6AM - 12PM)" },
                      { value: "afternoon", label: "Afternoon (12PM - 6PM)" },
                      { value: "evening", label: "Evening (6PM - 12AM)" },
                    ]}
                  />
                </div>

                {/* Max Stops */}
                <div className="mb-6">
                  <Text className="text-gray-700 font-medium block mb-3">
                    Max Stops
                  </Text>
                  <Select
                    value={maxStops}
                    onChange={setMaxStops}
                    className="w-full"
                    options={[
                      { value: "any", label: "Any" },
                      { value: "nonstop", label: "Non-stop" },
                      { value: "1stop", label: "1 Stop" },
                      { value: "2stops", label: "2+ Stops" },
                    ]}
                  />
                </div>

                {/* Max Duration */}
                <div className="mb-6">
                  <Text className="text-gray-700 font-medium block mb-3">
                    Max Duration (hours)
                  </Text>
                  <Select
                    value={maxDuration}
                    onChange={setMaxDuration}
                    className="w-full"
                    options={[
                      { value: "any", label: "Any" },
                      { value: "8", label: "Under 8 hours" },
                      { value: "12", label: "Under 12 hours" },
                      { value: "24", label: "Under 24 hours" },
                    ]}
                  />
                </div>

                <Button
                  type="link"
                  className="p-0 text-blue-600"
                  onClick={handleClearFilters}
                >
                  Clear All Filters
                </Button>
              </div>
            </Card>
          </Col>

          {/* Flight Results */}
          <Col xs={24} lg={18}>
            <div className="mb-4">
              <Title level={4} className="!mb-0 text-gray-800">
                🔵 Available Flights
              </Title>
              <Text className="text-gray-600">
                {filteredAndSortedFlights.length} flights found
              </Text>
            </div>

            {filteredAndSortedFlights.length > 0 ? (
              <Space direction="vertical" size="large" className="w-full">
                {filteredAndSortedFlights.map((flight) => (
                  <Card key={flight.id} className="flight-result-card">
                    <Row align="middle" gutter={[16, 16]}>
                      {/* Airline Info */}
                      <Col xs={24} sm={8}>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {getAirlineIcon(flight.airline)}
                          </span>
                          <div>
                            <Text className="font-medium text-gray-900 block">
                              {flight.airline}
                            </Text>
                            <Text className="text-gray-600 text-sm">
                              {flight.flightNumber}
                            </Text>
                            {flight.badges.map((badge) => (
                              <Badge
                                key={badge}
                                color={badge === "Non-stop" ? "blue" : "orange"}
                                text={badge}
                                className="ml-2"
                              />
                            ))}
                          </div>
                        </div>
                      </Col>

                      {/* Flight Times */}
                      <Col xs={24} sm={8}>
                        <div className="text-center">
                          <Row align="middle" justify="center" className="mb-2">
                            <Col>
                              <Text className="font-medium text-lg">
                                {flight.departureTime}
                              </Text>
                            </Col>
                            <Col className="mx-4">
                              <div className="flex items-center">
                                <div className="w-8 h-px bg-gray-300"></div>
                                <span className="mx-2 text-gray-400">✈</span>
                                <div className="w-8 h-px bg-gray-300"></div>
                              </div>
                            </Col>
                            <Col>
                              <Text className="font-medium text-lg">
                                {flight.arrivalTime}
                              </Text>
                            </Col>
                          </Row>
                          <Text className="text-gray-600 text-sm">
                            ({flight.duration})
                          </Text>
                          <br />
                          <Text className="text-gray-500 text-xs">
                            {flight.aircraft}
                          </Text>
                        </div>
                      </Col>

                      {/* Price and Actions */}
                      <Col xs={24} sm={8}>
                        <div className="text-right">
                          <div className="mb-3">
                            <Text className="text-2xl font-bold text-gray-900">
                              ${flight.price}
                            </Text>
                            <Text className="text-gray-600 text-sm block">
                              per person
                            </Text>
                          </div>
                          <Button
                            type="primary"
                            size="large"
                            className="w-full mb-2 infiniti-btn-primary"
                            onClick={() => handleSelectFlight(flight.id)}
                          >
                            Select Flight
                          </Button>

                          {/* Amenities */}
                          <div className="flex justify-center gap-2 text-gray-500">
                            {flight.amenities.includes("WiFi") && (
                              <WifiOutlined />
                            )}
                            {flight.amenities.includes("Meals") && (
                              <span>🍽</span>
                            )}
                            {flight.amenities.includes("Entertainment") && (
                              <PlayCircleOutlined />
                            )}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </Space>
            ) : (
              /* Empty State */
              <Card className="text-center py-12">
                <div className="flex flex-col items-center justify-center">
                  <div className="text-6xl mb-4">✈️</div>
                  <Title level={3} className="!mb-2 text-gray-700">
                    No Flights Found
                  </Title>
                  <Text className="text-gray-500 mb-6 max-w-md">
                    We couldn't find any flights matching your search criteria.
                    Try adjusting your filters or modifying your search
                    parameters.
                  </Text>
                  <Space direction="vertical" size="middle">
                    <Button
                      type="primary"
                      size="large"
                      onClick={handleClearFilters}
                      className="infiniti-btn-primary"
                    >
                      Clear All Filters
                    </Button>
                    <Button
                      type="default"
                      size="large"
                      onClick={() => setShowModifySearch(true)}
                      icon={<EditOutlined />}
                    >
                      Modify Search
                    </Button>
                  </Space>
                </div>
              </Card>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
}