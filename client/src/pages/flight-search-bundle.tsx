import { useState, useMemo, useEffect } from "react";
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
  Tabs,
  Radio,
  Input,
  InputNumber,
} from "antd";
import {
  ArrowRightOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
  EditOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import Header from "@/components/layout/header";
import { useLocation } from "wouter";
import BookingSteps from "@/components/booking/booking-steps";

const { Title, Text } = Typography;

interface Flight {
  id: number;
  flightNumber: string;
  airline: string;
  aircraft: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: string;
  availableSeats: number;
  totalSeats: number;
  cabin: string;
  stops: number;
  status: string;
  createdAt: string;
}

interface BundleOption {
  id: string;
  name: string;
  price: number;
  included?: boolean;
  features: string[];
}



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
  const [availableFlights, setAvailableFlights] = useState<Flight[]>([]);
  const [searchCriteria, setSearchCriteria] = useState<any>({});
  const [passengerCount, setPassengerCount] = useState<number>(1);
  const [selectedOutbound, setSelectedOutbound] = useState<string>("");
  const [selectedReturn, setSelectedReturn] = useState<string>("");
  const [selectedSeat, setSelectedSeat] = useState<string>("");
  const [selectedBaggage, setSelectedBaggage] = useState<string>("");
  const [selectedMeals, setSelectedMeals] = useState<string[]>([
    "standard-meal",
  ]);

  // Load flight data from localStorage on component mount
  useEffect(() => {
    const loadFlightData = () => {
      const storedFlights = localStorage.getItem('searchResults');
      const storedCriteria = localStorage.getItem('searchCriteria');
      const storedPassengerCount = localStorage.getItem('passengerCount');
      const storedBookingData = localStorage.getItem('bookingFormData');

      let loadedFlights: Flight[] = [];
      let loadedCriteria: any = {};

      if (storedFlights) {
        const flights = JSON.parse(storedFlights);
        // Convert price to string format if it's a number and format times
        loadedFlights = flights.map((flight: any) => ({
          ...flight,
          price: typeof flight.price === 'number' ? flight.price.toString() : flight.price,
          departureTime: typeof flight.departureTime === 'string' && flight.departureTime.includes('T') 
            ? new Date(flight.departureTime).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              })
            : flight.departureTime,
          arrivalTime: typeof flight.arrivalTime === 'string' && flight.arrivalTime.includes('T')
            ? new Date(flight.arrivalTime).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              })
            : flight.arrivalTime
        }));
        console.log('Loaded flights from localStorage:', loadedFlights);
      }

      if (storedCriteria) {
        loadedCriteria = JSON.parse(storedCriteria);
        setSearchCriteria(loadedCriteria);
        console.log('Loaded search criteria:', loadedCriteria);
      }

      if (storedPassengerCount) {
        setPassengerCount(parseInt(storedPassengerCount));
      }

      // Load complete booking form data to ensure consistency
      if (storedBookingData) {
        const bookingData = JSON.parse(storedBookingData);
        
        // Initialize modify search form with original data
        setOrigin(bookingData.origin || 'JFK');
        setDestination(bookingData.destination || 'LHR');
        setDepartureDate(bookingData.departureDate || '2024-06-22');
        setReturnDate(bookingData.returnDate || '2024-06-29');
        setAdults(bookingData.adults || 24);
        setKids(bookingData.kids || 8);
        setInfants(bookingData.infants || 0);
        setCabin(bookingData.cabin || 'Economy');
        setTripType(bookingData.tripType || 'roundTrip');
        
        // Update passenger count if needed
        if (bookingData.totalPassengers) {
          setPassengerCount(bookingData.totalPassengers);
        }

        // Use booking data for search criteria if not available
        if (!loadedCriteria.origin && !loadedCriteria.destination) {
          loadedCriteria = {
            origin: bookingData.origin,
            destination: bookingData.destination,
            departureDate: bookingData.departureDate,
            returnDate: bookingData.returnDate,
            tripType: bookingData.tripType,
            passengers: bookingData.totalPassengers,
            cabin: bookingData.cabin
          };
          setSearchCriteria(loadedCriteria);
        }
      }

      // Set flights directly without filtering initially - let user see all available flights
      setAvailableFlights(loadedFlights);
      
      // Set the first flight as selected by default
      if (loadedFlights.length > 0) {
        setSelectedOutbound(loadedFlights[0].id.toString());
      }

      console.log('Final available flights:', loadedFlights);
    };

    loadFlightData();
  }, []);

  // Filter states
  const [sortBy, setSortBy] = useState('price-low');
  const [priceRange, setPriceRange] = useState<[number, number]>([5000, 50000]);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [departureTime, setDepartureTime] = useState('any');
  const [maxStops, setMaxStops] = useState('any');
  const [maxDuration, setMaxDuration] = useState('any');

  // Get unique airlines from available flights
  const availableAirlines = useMemo(() => {
    return [...new Set(availableFlights.map(flight => flight.airline))];
  }, [availableFlights]);

  // Handle airline filter change
  const handleAirlineChange = (airline: string, checked: boolean) => {
    if (checked) {
      setSelectedAirlines([...selectedAirlines, airline]);
    } else {
      setSelectedAirlines(selectedAirlines.filter(a => a !== airline));
    }
  };

  // Filter and sort flights
  const filteredFlights = useMemo(() => {
    let filtered = [...availableFlights];

    // Filter by airlines
    if (selectedAirlines.length > 0) {
      filtered = filtered.filter(flight => selectedAirlines.includes(flight.airline));
    }

    // Filter by price range
    filtered = filtered.filter(flight => {
      const price = typeof flight.price === 'string' ? parseFloat(flight.price) : flight.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Filter by departure time
    if (departureTime !== 'any') {
      filtered = filtered.filter(flight => {
        const depTime = flight.departureTime;
        const hour = parseInt(depTime.split(':')[0]);
        
        switch (departureTime) {
          case 'early-morning':
            return hour >= 4 && hour < 8;
          case 'morning':
            return hour >= 8 && hour < 12;
          case 'afternoon':
            return hour >= 12 && hour < 16;
          case 'evening':
            return hour >= 16 && hour < 20;
          case 'night':
            return hour >= 20 && hour < 24;
          case 'late-night':
            return hour >= 0 && hour < 4;
          default:
            return true;
        }
      });
    }

    // Filter by stops
    if (maxStops !== 'any') {
      filtered = filtered.filter(flight => {
        switch (maxStops) {
          case 'nonstop':
            return flight.stops === 0;
          case '1stop':
            return flight.stops <= 1;
          case '2stops':
            return flight.stops <= 2;
          case '3+stops':
            return flight.stops >= 3;
          default:
            return true;
        }
      });
    }

    // Sort flights
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          const priceA = typeof a.price === 'string' ? parseFloat(a.price) : a.price;
          const priceB = typeof b.price === 'string' ? parseFloat(b.price) : b.price;
          return priceA - priceB;
        case 'price-high':
          const priceA2 = typeof a.price === 'string' ? parseFloat(a.price) : a.price;
          const priceB2 = typeof b.price === 'string' ? parseFloat(b.price) : b.price;
          return priceB2 - priceA2;
        case 'duration':
          return a.duration.localeCompare(b.duration);
        case 'departure':
          return a.departureTime.localeCompare(b.departureTime);
        default:
          return 0;
      }
    });

    return filtered;
  }, [availableFlights, selectedAirlines, priceRange, sortBy, departureTime, maxStops]);

  // Get trip type from URL params or localStorage (simulate getting from previous page)
  const [tripType, setTripType] = useState<string>(() => {
    // In a real application, this would come from navigation state or URL params
    // For now, we'll check localStorage or default to roundTrip
    return localStorage.getItem('selectedTripType') || "roundTrip";
  });

  // Modify search toggle state
  const [showModifySearch, setShowModifySearch] = useState(false);

  // Modify search form state - initialize from localStorage
  const [origin, setOrigin] = useState(() => localStorage.getItem('searchOrigin') || 'JFK');
  const [destination, setDestination] = useState(() => localStorage.getItem('searchDestination') || 'LHR');
  const [departureDate, setDepartureDate] = useState(() => localStorage.getItem('searchDepartureDate') || '2024-06-22');
  const [returnDate, setReturnDate] = useState(() => localStorage.getItem('searchReturnDate') || '2024-06-29');
  const [adults, setAdults] = useState(() => parseInt(localStorage.getItem('searchAdults') || '24'));
  const [kids, setKids] = useState(() => parseInt(localStorage.getItem('searchKids') || '8'));
  const [infants, setInfants] = useState(() => parseInt(localStorage.getItem('searchInfants') || '0'));
  const [cabin, setCabin] = useState(() => localStorage.getItem('searchCabin') || 'Economy');

  const handleBackToTripDetails = () => {
    setLocation("/new-booking");
  };

  const handleContinue = () => {
    console.log("Continue to Add Services & Bundles");
    setLocation("/add-services-bundles");
  };

  const handleSearchFlights = async () => {
    try {
      const totalPassengers = adults + kids + infants;
      
      const searchData = {
        origin,
        destination,
        departureDate,
        returnDate: tripType === "oneWay" ? null : returnDate,
        tripType,
        passengers: totalPassengers,
        adults,
        kids,
        infants,
        cabin,
      };

      console.log('Searching for flights with data:', searchData);

      // Make API call to search for flights
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin,
          destination,
          departureDate,
          returnDate: tripType === "oneWay" ? null : returnDate,
          passengers: totalPassengers,
          cabin,
          tripType,
        }),
      });

      const searchResult = await response.json();
      console.log('Search API response:', searchResult);
      
      if (searchResult.flights && searchResult.flights.length > 0) {
        // Convert price to string format and process flights
        const processedFlights = searchResult.flights.map((flight: any) => ({
          ...flight,
          price: typeof flight.price === 'number' ? flight.price.toString() : flight.price,
          departureTime: new Date(flight.departureTime).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }),
          arrivalTime: new Date(flight.arrivalTime).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          })
        }));

        console.log('Processed flights:', processedFlights);
        setAvailableFlights(processedFlights);
        
        // Set the first flight as selected by default
        if (processedFlights.length > 0) {
          setSelectedOutbound(processedFlights[0].id.toString());
        } else {
          setSelectedOutbound("");
        }

        // Update localStorage with new search results and criteria
        localStorage.setItem('searchResults', JSON.stringify(processedFlights));
        localStorage.setItem('searchCriteria', JSON.stringify(searchData));
        localStorage.setItem('passengerCount', totalPassengers.toString());
        
        // Update booking form data
        const updatedBookingData = {
          origin,
          destination,
          departureDate,
          returnDate,
          tripType,
          adults,
          kids,
          infants,
          cabin,
          totalPassengers,
          searchData
        };
        localStorage.setItem('bookingFormData', JSON.stringify(updatedBookingData));

        // Update component state
        setSearchCriteria(searchData);
        setPassengerCount(totalPassengers);
        setShowModifySearch(false);
        
        console.log(`Found ${processedFlights.length} flights for ${origin} to ${destination}`);
      } else {
        // No flights found
        setAvailableFlights([]);
        setSelectedOutbound("");
        console.log('No flights found for the selected route');
      }
      
    } catch (error) {
      console.error('Error searching flights:', error);
      // Keep existing flights if API call fails
    }
  };

  const handleCancelModify = () => {
    setShowModifySearch(false);
  };

  const getAirlineIcon = (airline: string) => {
    return "✈";
  };

  const selectedOutboundFlight = availableFlights.find(
    (f) => f.id.toString() === selectedOutbound,
  );
  const selectedReturnFlight = availableFlights.find(
    (f) => f.id.toString() === selectedReturn,
  );
  const selectedSeatOption = seatOptions.find((s) => s.id === selectedSeat);
  const selectedBaggageOption = baggageOptions.find(
    (b) => b.id === selectedBaggage,
  );

  const baseCost =
    (typeof selectedOutboundFlight?.price === 'string' ? parseFloat(selectedOutboundFlight.price) : (selectedOutboundFlight?.price || 0)) * passengerCount +
    (tripType === "roundTrip" ? (typeof selectedReturnFlight?.price === 'string' ? parseFloat(selectedReturnFlight.price) : (selectedReturnFlight?.price || 0)) * passengerCount : 0);
  const bundleCost =
    (selectedSeatOption?.price || 0) + (selectedBaggageOption?.price || 0);
  const totalCost = baseCost + bundleCost;

  // Clear all filters
  const handleClearFilters = () => {
    setSortBy('price-low');
    setPriceRange([1000, 10000]);
    setSelectedAirlines([]);
    setDepartureTime('any');
    setMaxStops('any');
    setMaxDuration('any');
  };

  const FlightCard = ({
    flight,
    isSelected,
    onSelect,
  }: {
    flight: Flight;
    isSelected: boolean;
    onSelect: () => void;
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
                  text={`${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
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
              <Text className="text-xs text-gray-500">{flight.origin}</Text>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-px bg-gray-300"></div>
              <ArrowRightOutlined className="mx-2 text-gray-400" />
              <div className="w-6 h-px bg-gray-300"></div>
            </div>
            <div className="text-center">
              <Text className="font-medium text-lg">{flight.arrivalTime}</Text>
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
            ₹{flight.price}
          </Text>
          <Text className="text-gray-600 text-sm block">per person</Text>
          <Text className="text-xs text-green-600">
            {flight.availableSeats} seats left
          </Text>
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
                        <Text className="block font-medium">{searchCriteria.origin || origin} → {searchCriteria.destination || destination}</Text>
                      </div>
                    </Col>
                    <Col>
                      <div>
                        <Text className="text-gray-600 text-sm">Trip Type</Text>
                        <Text className="block font-medium">
                          {tripType === 'oneWay' ? 'One Way' : tripType === 'roundTrip' ? 'Round Trip' : 'Multi City'}
                        </Text>
                      </div>
                    </Col>
                    <Col>
                      <div>
                        <Text className="text-gray-600 text-sm">Departure</Text>
                        <Text className="block font-medium">{departureDate}</Text>
                      </div>
                    </Col>
                    {tripType === 'roundTrip' && (
                      <Col>
                        <div>
                          <Text className="text-gray-600 text-sm">Return</Text>
                          <Text className="block font-medium">{returnDate}</Text>
                        </div>
                      </Col>
                    )}
                    <Col>
                      <div>
                        <Text className="text-gray-600 text-sm">Passengers</Text>
                        <Text className="block font-medium">{adults + kids + infants} passengers</Text>
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
                  onChange={(e) => {
                    setTripType(e.target.value);
                    localStorage.setItem('selectedTripType', e.target.value);
                  }}
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
                    <Text className="text-gray-600 text-sm block mb-1">Origin</Text>
                    <Input
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      prefix={<EnvironmentOutlined className="text-gray-400" />}
                      placeholder="City / Airport"
                    />
                  </div>
                </Col>
                <Col xs={24} md={6}>
                  <div>
                    <Text className="text-gray-600 text-sm block mb-1">Destination</Text>
                    <Input
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      prefix={<EnvironmentOutlined className="text-gray-400" />}
                      placeholder="City / Airport"
                    />
                  </div>
                </Col>
                <Col xs={24} md={6}>
                  <div>
                    <Text className="text-gray-600 text-sm block mb-1">Departure Date</Text>
                    <Input
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      placeholder="yyyy-mm-dd"
                    />
                  </div>
                </Col>
                <Col xs={24} md={6}>
                  <div>
                    <Text className="text-gray-600 text-sm block mb-1">Return Date</Text>
                    <Input
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      placeholder="yyyy-mm-dd"
                      disabled={tripType === 'oneWay'}
                    />
                  </div>
                </Col>
              </Row>

              {/* Passengers and Cabin Row */}
              <Row gutter={[16, 16]} className="mb-4">
                <Col xs={24} md={18}>
                  <Text className="text-gray-600 text-sm block mb-2">Passengers</Text>
                  <Row gutter={[16, 8]}>
                    <Col xs={8} md={6}>
                      <div>
                        <Text className="text-gray-700 text-sm block mb-1">Adults (12+ years)</Text>
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
                        <Text className="text-gray-700 text-sm block mb-1">Kids (2-11 years)</Text>
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
                        <Text className="text-gray-700 text-sm block mb-1">Infants (0-2 years)</Text>
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
                    <Text className="text-gray-600 text-sm block mb-1">Cabin</Text>
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
                  <Button onClick={handleCancelModify}>
                    Cancel
                  </Button>
                </Col>
              </Row>
            </div>
          )}
        </Card>

        <Row gutter={24}>
          {/* Filters Sidebar */}
          <Col xs={24} lg={6}>
            <div className="sticky top-6">
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
                    min={5000}
                    max={50000}
                    value={priceRange}
                    onChange={setPriceRange}
                    className="mb-2"
                    step={1000}
                  />
                  <div className="flex justify-between">
                    <Text className="text-gray-600 text-sm">₹{priceRange[0]}</Text>
                    <Text className="text-gray-600 text-sm">₹{priceRange[1]}</Text>
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
                      { value: 'early-morning', label: 'Early Morning (4AM - 8AM)' },
                      { value: 'morning', label: 'Morning (8AM - 12PM)' },
                      { value: 'afternoon', label: 'Afternoon (12PM - 4PM)' },
                      { value: 'evening', label: 'Evening (4PM - 8PM)' },
                      { value: 'night', label: 'Night (8PM - 12AM)' },
                      { value: 'late-night', label: 'Late Night (12AM - 4AM)' }
                    ]}
                  />
                </div>

                {/* Max Stops */}
                <div className="mb-6">
                  <Text className="text-gray-700 font-medium block mb-3">✈️ Stops</Text>
                  <Select 
                    value={maxStops}
                    onChange={setMaxStops}
                    className="w-full"
                    options={[
                      { value: 'any', label: 'Any number of stops' },
                      { value: 'nonstop', label: 'Non-stop only' },
                      { value: '1stop', label: 'Up to 1 stop' },
                      { value: '2stops', label: 'Up to 2 stops' },
                      { value: '3+stops', label: '3+ stops' }
                    ]}
                  />
                </div>

                {/* Max Duration */}
                <div className="mb-6">
                  <Text className="text-gray-700 font-medium block mb-3">⏱️ Flight Duration</Text>
                  <Select 
                    value={maxDuration}
                    onChange={setMaxDuration}
                    className="w-full"
                    options={[
                      { value: 'any', label: 'Any duration' },
                      { value: '3', label: 'Under 3 hours' },
                      { value: '6', label: 'Under 6 hours' },
                      { value: '12', label: 'Under 12 hours' },
                      { value: '24', label: 'Under 24 hours' },
                      { value: '36', label: 'Under 36 hours' }
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
            </div>
          </Col>

          {/* Flight Selection */}
          <Col xs={24} lg={18}>
            <Card>
              <div className="mb-6">
                <Title level={3} className="!mb-2 text-gray-900 flex items-center gap-2">
                  <span className="text-blue-600">✈️</span>
                  Available Flights
                  <Badge
                    count={`${filteredFlights.length} flights found`}
                    style={{ backgroundColor: "#52c41a" }}
                  />
                </Title>
                <Text className="text-gray-600">
                  {searchCriteria.origin || 'Origin'} → {searchCriteria.destination || 'Destination'}
                </Text>
              </div>

              {/* Flight Results */}
              <div className="space-y-4">
                {filteredFlights.length > 0 ? (
                  filteredFlights.map((flight) => (
                    <FlightCard
                      key={flight.id}
                      flight={flight}
                      isSelected={selectedOutbound === flight.id.toString()}
                      onSelect={() => setSelectedOutbound(flight.id.toString())}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Text className="text-gray-500">
                      {availableFlights.length === 0 
                        ? "No flights found for your search criteria" 
                        : "No flights match your current filters"
                      }
                    </Text>
                  </div>
                )}
              </div>
            </Card>

            {/* Bundle Selection - Only show if a flight is selected */}
            {selectedOutbound && (
              <Card className="mt-6">
                <Title level={4} className="!mb-6 text-gray-800">
                  Customize Your Journey
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
              </Card>
            )}

            {/* Booking Summary */}
            {selectedOutbound && (
              <Card className="mt-6">
                <Title level={4} className="!mb-4 text-gray-800">
                  Booking Summary
                </Title>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Text>Flight ({passengerCount} passenger{passengerCount > 1 ? 's' : ''})</Text>
                    <Text className="font-medium">₹{baseCost.toFixed(2)}</Text>
                  </div>
                  {bundleCost > 0 && (
                    <div className="flex justify-between">
                      <Text>Extras & Services</Text>
                      <Text className="font-medium">₹{bundleCost.toFixed(2)}</Text>
                    </div>
                  )}
                  <Divider />
                  <div className="flex justify-between text-lg font-bold">
                    <Text>Total</Text>
                    <Text className="text-blue-600">₹{totalCost.toFixed(2)}</Text>
                  </div>
                </div>
              </Card>
            )}
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

      <style jsx>{`
        :global(.flight-tabs .ant-tabs-tab) {
          padding: 16px 24px;
          border-radius: 8px 8px 0 0;
        }

        :global(.flight-tabs .ant-tabs-tab-btn) {
          font-weight: 600;
          font-size: 16px;
        }

        :global(.flight-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
          color: #2a0a22;
        }

        :global(.flight-tabs .ant-tabs-tab.ant-tabs-tab-disabled) {
          opacity: 0.5;
        }

        :global(.flight-tabs .ant-tabs-tab.ant-tabs-tab-disabled .ant-tabs-tab-btn) {
          color: #9ca3af;
          cursor: not-allowed;
        }

        :global(.flight-tabs .ant-tabs-ink-bar) {
          background: #2a0a22;
          height: 3px;
        }

        :global(.flight-tabs .ant-tabs-content-holder) {
          padding: 24px 0 0 0;
        }

        :global(.flight-tabs .ant-tabs-nav) {
          margin-bottom: 0;
        }

        :global(.flight-tabs .ant-badge) {
          margin-left: 8px;
        }
      `}</style>
    </div>
  );
}