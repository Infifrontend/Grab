import { useState, useMemo } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Badge,
  Checkbox,
  Divider,
  Space,
  Select,
  Slider,
} from "antd";
import {
  ArrowRightOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Header from "@/components/layout/header";
import { useLocation } from "wouter";
import BookingSteps from "@/components/booking/booking-steps";

const { Title, Text } = Typography;

interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  aircraft: string;
  price: number;
  stops: number;
  route: string;
}

interface BundleOption {
  id: string;
  name: string;
  price: number;
  included?: boolean;
  features: string[];
}

const outboundFlights: Flight[] = [
  {
    id: "BA178",
    airline: "British Airways",
    flightNumber: "BA178",
    departureTime: "10:30 AM",
    arrivalTime: "10:15 PM",
    duration: "7h 45m",
    aircraft: "Boeing 777-300ER",
    price: 1252,
    stops: 0,
    route: "JFK to LHR",
  },
  {
    id: "VS45",
    airline: "Virgin Atlantic",
    flightNumber: "VS45",
    departureTime: "08:15 AM",
    arrivalTime: "07:30 PM",
    duration: "8h 15m",
    aircraft: "Airbus A350-1000",
    price: 1470,
    stops: 0,
    route: "JFK to LHR",
  },
  {
    id: "AA100",
    airline: "American Airlines",
    flightNumber: "AA100",
    departureTime: "06:05 PM",
    arrivalTime: "06:20 AM+1",
    duration: "7h 15m",
    aircraft: "Boeing 777-300ER",
    price: 1180,
    stops: 0,
    route: "JFK to LHR",
  },
  {
    id: "LH401",
    airline: "Lufthansa",
    flightNumber: "LH401",
    departureTime: "02:45 PM",
    arrivalTime: "01:30 PM+1",
    duration: "8h 45m",
    aircraft: "Airbus A340-600",
    price: 1350,
    stops: 1,
    route: "JFK to LHR",
  },
  {
    id: "AF007",
    airline: "Air France",
    flightNumber: "AF007",
    departureTime: "11:20 AM",
    arrivalTime: "10:45 PM",
    duration: "7h 25m",
    aircraft: "Boeing 777-200ER",
    price: 1290,
    stops: 0,
    route: "JFK to LHR",
  },
];

const returnFlights: Flight[] = [
  {
    id: "BA179",
    airline: "British Airways",
    flightNumber: "BA179",
    departureTime: "12:45 PM",
    arrivalTime: "03:30 PM",
    duration: "8h 45m",
    aircraft: "Boeing 777-300ER",
    price: 1252,
    stops: 0,
    route: "LHR to JFK",
  },
  {
    id: "VS46",
    airline: "Virgin Atlantic",
    flightNumber: "VS46",
    departureTime: "02:15 PM",
    arrivalTime: "05:30 PM",
    duration: "8h 15m",
    aircraft: "Airbus A350-1000",
    price: 1470,
    stops: 0,
    route: "LHR to JFK",
  },
  {
    id: "AA101",
    airline: "American Airlines",
    flightNumber: "AA101",
    departureTime: "11:20 AM",
    arrivalTime: "02:45 PM",
    duration: "8h 25m",
    aircraft: "Boeing 777-300ER",
    price: 2054,
    stops: 0,
    route: "LHR to JFK",
  },
  {
    id: "LH402",
    airline: "Lufthansa",
    flightNumber: "LH402",
    departureTime: "09:30 AM",
    arrivalTime: "12:15 PM",
    duration: "8h 45m",
    aircraft: "Airbus A340-600",
    price: 1350,
    stops: 1,
    route: "LHR to JFK",
  },
  {
    id: "AF008",
    airline: "Air France",
    flightNumber: "AF008",
    departureTime: "04:20 PM",
    arrivalTime: "07:35 PM",
    duration: "8h 15m",
    aircraft: "Boeing 777-200ER",
    price: 1290,
    stops: 0,
    route: "LHR to JFK",
  },
];

const seatOptions: BundleOption[] = [
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

const baggageOptions: BundleOption[] = [
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

const mealOptions: BundleOption[] = [
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

export default function FlightSearchBundle() {
  const [, setLocation] = useLocation();
  const [selectedOutbound, setSelectedOutbound] = useState<string>("BA178");
  const [selectedReturn, setSelectedReturn] = useState<string>("BA179");
  const [selectedSeat, setSelectedSeat] = useState<string>("");
  const [selectedBaggage, setSelectedBaggage] = useState<string>("");
  const [selectedMeals, setSelectedMeals] = useState<string[]>([
    "standard-meal",
  ]);

  // Filter states
  const [sortBy, setSortBy] = useState('price-low');
  const [priceRange, setPriceRange] = useState<[number, number]>([1000, 3000]);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [departureTime, setDepartureTime] = useState('any');
  const [maxStops, setMaxStops] = useState('any');
  const [maxDuration, setMaxDuration] = useState('any');

  // Get trip type from URL params or localStorage (simulate getting from previous page)
  const [tripType] = useState<string>("roundTrip"); // This would normally come from navigation state

  const handleBackToTripDetails = () => {
    setLocation("/new-booking");
  };

  const handleContinue = () => {
    console.log("Continue to Add Services & Bundles");
    setLocation("/add-services-bundles");
  };

  const getAirlineIcon = (airline: string) => {
    return "✈";
  };

  const selectedOutboundFlight = outboundFlights.find(
    (f) => f.id === selectedOutbound,
  );
  const selectedReturnFlight = returnFlights.find(
    (f) => f.id === selectedReturn,
  );
  const selectedSeatOption = seatOptions.find((s) => s.id === selectedSeat);
  const selectedBaggageOption = baggageOptions.find(
    (b) => b.id === selectedBaggage,
  );

  const baseCost =
    (selectedOutboundFlight?.price || 0) +
    (tripType === "roundTrip" ? selectedReturnFlight?.price || 0 : 0);
  const bundleCost =
    (selectedSeatOption?.price || 0) + (selectedBaggageOption?.price || 0);
  const totalCost = baseCost + bundleCost;

  // Handle airline selection
  const handleAirlineChange = (airline: string, checked: boolean) => {
    if (checked) {
      setSelectedAirlines([...selectedAirlines, airline]);
    } else {
      setSelectedAirlines(selectedAirlines.filter(a => a !== airline));
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSortBy('price-low');
    setPriceRange([1000, 3000]);
    setSelectedAirlines([]);
    setDepartureTime('any');
    setMaxStops('any');
    setMaxDuration('any');
  };

  // Get unique airlines for filter
  const availableAirlines = Array.from(new Set(outboundFlights.map(flight => flight.airline)));

  // Filter and sort flights
  const filteredOutboundFlights = useMemo(() => {
    let filtered = outboundFlights.filter(flight => {
      // Price range filter
      if (flight.price < priceRange[0] || flight.price > priceRange[1]) {
        return false;
      }

      // Airlines filter
      if (selectedAirlines.length > 0 && !selectedAirlines.includes(flight.airline)) {
        return false;
      }

      // Departure time filter
      if (departureTime !== 'any') {
        const depTime = parseInt(flight.departureTime.split(':')[0]);
        const isAM = flight.departureTime.includes('AM');
        const hour24 = isAM ? (depTime === 12 ? 0 : depTime) : (depTime === 12 ? 12 : depTime + 12);

        switch (departureTime) {
          case 'morning':
            if (hour24 < 6 || hour24 >= 12) return false;
            break;
          case 'afternoon':
            if (hour24 < 12 || hour24 >= 18) return false;
            break;
          case 'evening':
            if (hour24 < 18 || hour24 >= 24) return false;
            break;
        }
      }

      // Max stops filter
      if (maxStops !== 'any') {
        switch (maxStops) {
          case 'nonstop':
            if (flight.stops !== 0) return false;
            break;
          case '1stop':
            if (flight.stops !== 1) return false;
            break;
          case '2stops':
            if (flight.stops < 2) return false;
            break;
        }
      }

      // Max duration filter
      if (maxDuration !== 'any') {
        const durationHours = parseInt(flight.duration.split('h')[0]);
        const maxHours = parseInt(maxDuration);
        if (durationHours > maxHours) return false;
      }

      return true;
    });

    // Sort flights
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'duration':
        filtered.sort((a, b) => {
          const aDuration = parseInt(a.duration.split('h')[0]) * 60 + parseInt(a.duration.split('h')[1].split('m')[0]);
          const bDuration = parseInt(b.duration.split('h')[0]) * 60 + parseInt(b.duration.split('h')[1].split('m')[0]);
          return aDuration - bDuration;
        });
        break;
      case 'departure':
        filtered.sort((a, b) => {
          const aTime = parseInt(a.departureTime.replace(/[^\d]/g, ''));
          const bTime = parseInt(b.departureTime.replace(/[^\d]/g, ''));
          return aTime - bTime;
        });
        break;
    }

    return filtered;
  }, [outboundFlights, sortBy, priceRange, selectedAirlines, departureTime, maxStops, maxDuration]);

  const FlightCard = ({
    flight,
    isSelected,
    onSelect,
    type,
  }: {
    flight: Flight;
    isSelected: boolean;
    onSelect: () => void;
    type: "outbound" | "return";
  }) => (
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
            <span className="text-lg">{getAirlineIcon(flight.airline)}</span>
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
                  text={`${flight.stops} stop`}
                  className="ml-2"
                />
              )}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <Text className="font-medium text-lg">
                {flight.departureTime}
              </Text>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-px bg-gray-300"></div>
              <ArrowRightOutlined className="mx-2 text-gray-400" />
              <div className="w-6 h-px bg-gray-300"></div>
            </div>
            <div className="text-center">
              <Text className="font-medium text-lg">{flight.arrivalTime}</Text>
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
        </Col>
      </Row>
    </div>
  );

  const BundleSection = ({
    title,
    options,
    selectedValue,
    onSelect,
    allowMultiple = false,
  }: {
    title: string;
    options: BundleOption[];
    selectedValue: string | string[];
    onSelect: (value: string) => void;
    allowMultiple?: boolean;
  }) => (
    <div className="mb-8">
      <Title level={4} className="!mb-4 text-gray-800 flex items-center gap-2">
        <span className="text-blue-600">📋</span>
        {title}
      </Title>
      <Row gutter={[16, 16]}>
        {options.map((option) => {
          const isSelected = allowMultiple
            ? (selectedValue as string[]).includes(option.id)
            : selectedValue === option.id;

          return (
            <Col xs={24} md={8} key={option.id}>
              <div
                className={`p-4 border rounded-lg cursor-pointer transition-all h-full ${
                  isSelected
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => onSelect(option.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Checkbox checked={isSelected} />
                    <Text className="font-medium">{option.name}</Text>
                  </div>
                  <div className="text-right">
                    {option.included ? (
                      <Badge color="green" text="Included" />
                    ) : (
                      <Text className="font-bold text-blue-600">
                        ${option.price}
                      </Text>
                    )}
                  </div>
                </div>
                <Space direction="vertical" size="small" className="w-full">
                  {option.features.map((feature, index) => (
                    <Text
                      key={index}
                      className="text-gray-600 text-sm flex items-center gap-1"
                    >
                      <span className="text-green-500">•</span>
                      {feature}
                    </Text>
                  ))}
                </Space>
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Booking Steps */}
        <div className="mb-8">
          <BookingSteps currentStep={1} size="small" className="mb-6" />
        </div>

        <Title level={2} className="!mb-6 text-gray-900">
          Flight Search & Bundle Selection
        </Title>

        {/* Search Summary */}
        <Card className="mb-6">
          <Row gutter={24}>
            <Col span={6}>
              <div>
                <Text className="text-gray-600 text-sm">Route</Text>
                <Text className="block font-medium">JFK → LHR</Text>
              </div>
            </Col>
            <Col span={6}>
              <div>
                <Text className="text-gray-600 text-sm">Departure</Text>
                <Text className="block font-medium">2024-06-22</Text>
              </div>
            </Col>
            <Col span={6}>
              <div>
                <Text className="text-gray-600 text-sm">Passengers</Text>
                <Text className="block font-medium">32 passengers</Text>
              </div>
            </Col>
          </Row>
        </Card>

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
                  <Text className="text-gray-700 font-medium block mb-2">Sort By</Text>
                  <Select 
                    value={sortBy}
                    onChange={setSortBy}
                    className="w-full"
                    options={[
                      { value: 'price-low', label: 'Price (Low to High)' },
                      { value: 'price-high', label: 'Price (High to Low)' },
                      { value: 'duration', label: 'Duration' },
                      { value: 'departure', label: 'Departure Time' }
                    ]}
                  />
                </div>

                <Divider />

                {/* Price Range */}
                <div className="mb-6">
                  <Text className="text-gray-700 font-medium block mb-3">💰 Price Range</Text>
                  <Slider
                    range
                    min={1000}
                    max={3000}
                    value={priceRange}
                    onChange={setPriceRange}
                    className="mb-2"
                  />
                  <div className="flex justify-between">
                    <Text className="text-gray-600 text-sm">${priceRange[0]}</Text>
                    <Text className="text-gray-600 text-sm">${priceRange[1]}</Text>
                  </div>
                </div>

                <Divider />

                {/* Airlines Filter */}
                <div className="mb-6">
                  <Text className="text-gray-700 font-medium block mb-3">Airlines</Text>
                  <Space direction="vertical" className="w-full">
                    {availableAirlines.map(airline => (
                      <Checkbox 
                        key={airline}
                        checked={selectedAirlines.includes(airline)}
                        onChange={(e) => handleAirlineChange(airline, e.target.checked)}
                      >
                        <Text className="text-sm">{airline}</Text>
                      </Checkbox>
                    ))}
                  </Space>
                </div>

                <Divider />

                {/* Departure Time */}
                <div className="mb-6">
                  <Text className="text-gray-700 font-medium block mb-3">🕐 Departure Time</Text>
                  <Select 
                    value={departureTime}
                    onChange={setDepartureTime}
                    className="w-full"
                    options={[
                      { value: 'any', label: 'Any time' },
                      { value: 'morning', label: 'Morning (6AM - 12PM)' },
                      { value: 'afternoon', label: 'Afternoon (12PM - 6PM)' },
                      { value: 'evening', label: 'Evening (6PM - 12AM)' }
                    ]}
                  />
                </div>

                {/* Max Stops */}
                <div className="mb-6">
                  <Text className="text-gray-700 font-medium block mb-3">Max Stops</Text>
                  <Select 
                    value={maxStops}
                    onChange={setMaxStops}
                    className="w-full"
                    options={[
                      { value: 'any', label: 'Any' },
                      { value: 'nonstop', label: 'Non-stop' },
                      { value: '1stop', label: '1 Stop' },
                      { value: '2stops', label: '2+ Stops' }
                    ]}
                  />
                </div>

                {/* Max Duration */}
                <div className="mb-6">
                  <Text className="text-gray-700 font-medium block mb-3">Max Duration (hours)</Text>
                  <Select 
                    value={maxDuration}
                    onChange={setMaxDuration}
                    className="w-full"
                    options={[
                      { value: 'any', label: 'Any' },
                      { value: '8', label: 'Under 8 hours' },
                      { value: '12', label: 'Under 12 hours' },
                      { value: '24', label: 'Under 24 hours' }
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

          {/* Flight Selection */}
          <Col xs={24} lg={18}>
            <div className="mb-8">
              <Title
                level={3}
                className="!mb-4 text-gray-800 flex items-center gap-2"
              >
                <span className="text-blue-600">🛫</span>
                Outbound Flights - JFK to LHR
                <Badge
                  count={`${filteredOutboundFlights.length} flights`}
                  style={{ backgroundColor: "#52c41a" }}
                />
              </Title>

              {filteredOutboundFlights.map((flight) => (
                <FlightCard
                  key={flight.id}
                  flight={flight}
                  isSelected={selectedOutbound === flight.id}
                  onSelect={() => setSelectedOutbound(flight.id)}
                  type="outbound"
                />
              ))}
            </div>

            {/* Bundle Options */}
            <div className="mb-8">
              <Title level={3} className="!mb-6 text-gray-800">
                Hard Bundles - Essential Add-ons
              </Title>

              <BundleSection
                title="Seat Selection"
                options={seatOptions}
                selectedValue={selectedSeat}
                onSelect={setSelectedSeat}
              />

              <BundleSection
                title="Baggage"
                options={baggageOptions}
                selectedValue={selectedBaggage}
                onSelect={setSelectedBaggage}
              />

              <BundleSection
                title="Meals"
                options={mealOptions}
                selectedValue={selectedMeals}
                onSelect={(value) => {
                  if (selectedMeals.includes(value)) {
                    setSelectedMeals(selectedMeals.filter((m) => m !== value));
                  } else {
                    setSelectedMeals([...selectedMeals, value]);
                  }
                }}
                allowMultiple={true}
              />
            </div>
          </Col>

          
        </Row>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleBackToTripDetails}
            className="text-gray-600 hover:text-gray-800"
          >
            Back to Trip Details
          </Button>

          <Button
            type="primary"
            size="large"
            onClick={handleContinue}
            className="infiniti-btn-primary px-8"
          >
            Continue to Services
          </Button>
        </div>
      </div>
    </div>
  );
}