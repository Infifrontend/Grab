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
} from "@ant-design/icons";
import { Form, Radio, InputNumber } from "antd";
import dayjs from "dayjs";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import QuickBookingForm from "@/components/booking/quick-booking-form";
import BookingSteps from "@/components/booking/booking-steps";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Admin Booking Flow Component
function AdminBookingFlow({ onReturn }: { onReturn: () => void }) {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [bookingData, setBookingData] = useState<any>({});
  const [flightData, setFlightData] = useState<any>({});
  const [bundleData, setBundleData] = useState<any>({});
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [groupLeaderData, setGroupLeaderData] = useState<any>({});
  const [passengerData, setPassengerData] = useState<any[]>([]);
  const [bookingSummary, setBookingSummary] = useState<any>({});

  const steps = [
    "Trip Details",
    "Flight Search & Bundles", 
    "Add Services",
    "Group Leader Info",
    "Passenger Info",
    "Review & Confirmation",
    "Payment"
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepComplete = (stepData: any) => {
    switch (currentStep) {
      case 0:
        setBookingData(stepData);
        localStorage.setItem("bookingFormData", JSON.stringify(stepData));
        localStorage.setItem("isAdminBooking", "true");
        break;
      case 1:
        setFlightData(stepData);
        localStorage.setItem("selectedFlightData", JSON.stringify(stepData));
        break;
      case 2:
        setSelectedServices(stepData);
        localStorage.setItem("selectedServices", JSON.stringify(stepData));
        break;
      case 3:
        setGroupLeaderData(stepData);
        localStorage.setItem("groupLeaderData", JSON.stringify(stepData));
        break;
      case 4:
        setPassengerData(stepData);
        localStorage.setItem("passengerData", JSON.stringify(stepData));
        break;
      case 5:
        // Review step
        break;
      case 6:
        // Payment step - create booking
        handleCreateBooking(stepData);
        return;
    }
    handleNext();
  };

  const handleCreateBooking = async (paymentData: any) => {
    try {
      const comprehensiveBookingData = {
        bookingData,
        flightData,
        bundleData,
        selectedServices,
        groupLeaderData,
        passengerData,
        paymentData,
        bookingSummary,
        isAdminBooking: true
      };

      const response = await fetch("/api/group-bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
        
        // Return to dashboard
        onReturn();
      } else {
        throw new Error("Failed to create booking");
      }
    } catch (error) {
      console.error("Booking creation error:", error);
      message.error("Failed to create booking. Please try again.");
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <TripDetailsStep onComplete={handleStepComplete} initialData={bookingData} />;
      case 1:
        return <FlightSearchStep onComplete={handleStepComplete} bookingData={bookingData} />;
      case 2:
        return <AddServicesStep onComplete={handleStepComplete} initialData={selectedServices} />;
      case 3:
        return <GroupLeaderStep onComplete={handleStepComplete} initialData={groupLeaderData} />;
      case 4:
        return <PassengerInfoStep onComplete={handleStepComplete} bookingData={bookingData} initialData={passengerData} />;
      case 5:
        return <ReviewStep onComplete={handleStepComplete} allData={{ bookingData, flightData, selectedServices, groupLeaderData, passengerData }} />;
      case 6:
        return <PaymentStep onComplete={handleStepComplete} bookingSummary={bookingSummary} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Title level={3} className="!mb-2 text-gray-900">
            Create New Group Booking
          </Title>
          <Text className="text-gray-600">
            Complete the booking process step by step
          </Text>
        </div>
        <Button
          type="text"
          onClick={onReturn}
          className="text-gray-600 hover:text-gray-800"
        >
          ← Back to Dashboard
        </Button>
      </div>

      {/* Progress Steps */}
      <Card className="mb-6">
        <BookingSteps currentStep={currentStep} size="small" />
      </Card>

      {/* Step Content */}
      <Card>
        {renderStepContent()}
        
        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <Button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="text-gray-600"
          >
            Previous
          </Button>
          
          <div className="text-sm text-gray-500">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
      </Card>
    </div>
  );
}

// Step Components
function TripDetailsStep({ onComplete, initialData }: { onComplete: (data: any) => void; initialData: any }) {
  const [form] = Form.useForm();
  const [tripType, setTripType] = useState(initialData?.tripType || "roundTrip");

  const handleSubmit = (values: any) => {
    const totalPassengers = values.adults + values.kids + values.infants;
    const formData = {
      ...values,
      tripType,
      totalPassengers,
      isAdminBooking: true
    };
    onComplete(formData);
  };

  return (
    <div>
      <Title level={4} className="!mb-6">Trip Details</Title>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          tripType: tripType,
          adults: initialData?.adults || 1,
          kids: initialData?.kids || 0,
          infants: initialData?.infants || 0,
          cabin: initialData?.cabin || "economy",
          ...initialData
        }}
      >
        {/* Trip Type */}
        <div className="mb-6">
          <Text className="block mb-3 text-gray-700 font-medium">Trip Type</Text>
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
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Origin *"
              name="origin"
              rules={[{ required: true, message: "Please select origin" }]}
            >
              <Select placeholder="Select origin" showSearch>
                <Option value="New York">New York</Option>
                <Option value="Los Angeles">Los Angeles</Option>
                <Option value="London">London</Option>
                <Option value="Paris">Paris</Option>
                <Option value="Tokyo">Tokyo</Option>
                <Option value="Dubai">Dubai</Option>
                <Option value="Mumbai">Mumbai</Option>
                <Option value="Delhi">Delhi</Option>
                <Option value="Chennai">Chennai</Option>
                <Option value="Bangalore">Bangalore</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Destination *"
              name="destination"
              rules={[{ required: true, message: "Please select destination" }]}
            >
              <Select placeholder="Select destination" showSearch>
                <Option value="New York">New York</Option>
                <Option value="Los Angeles">Los Angeles</Option>
                <Option value="London">London</Option>
                <Option value="Paris">Paris</Option>
                <Option value="Tokyo">Tokyo</Option>
                <Option value="Dubai">Dubai</Option>
                <Option value="Mumbai">Mumbai</Option>
                <Option value="Delhi">Delhi</Option>
                <Option value="Chennai">Chennai</Option>
                <Option value="Bangalore">Bangalore</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Dates */}
        <Row gutter={24}>
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
            <Form.Item
              label="Return Date"
              name="returnDate"
              rules={tripType === "roundTrip" ? [{ required: true, message: "Please select return date" }] : []}
            >
              <DatePicker
                className="w-full"
                format="DD MMM YYYY"
                disabled={tripType === "oneWay"}
                disabledDate={(current) => current && current.isBefore(dayjs(), "day")}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Passengers */}
        <Row gutter={24}>
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

        {/* Cabin */}
        <Form.Item
          label="Cabin *"
          name="cabin"
          rules={[{ required: true, message: "Please select cabin class" }]}
        >
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
    </div>
  );
}

function FlightSearchStep({ onComplete, bookingData }: { onComplete: (data: any) => void; bookingData: any }) {
  const [selectedFlight, setSelectedFlight] = useState<any>(null);
  const [flights] = useState([
    {
      id: 1,
      airline: "Qatar Airways",
      flightNumber: "QR729",
      origin: bookingData.origin,
      destination: bookingData.destination,
      departureTime: "10:30 AM",
      arrivalTime: "2:45 PM",
      price: 850,
      stops: "Non-stop"
    },
    {
      id: 2,
      airline: "Emirates",
      flightNumber: "EK203",
      origin: bookingData.origin,
      destination: bookingData.destination,
      departureTime: "6:15 PM",
      arrivalTime: "10:30 PM",
      price: 920,
      stops: "1 Stop"
    }
  ]);

  const handleFlightSelect = (flight: any) => {
    setSelectedFlight(flight);
  };

  const handleContinue = () => {
    if (selectedFlight) {
      onComplete({
        selectedFlightId: selectedFlight.id,
        outbound: selectedFlight,
        basePrice: selectedFlight.price
      });
    }
  };

  return (
    <div>
      <Title level={4} className="!mb-6">Flight Search & Bundle Selection</Title>
      
      <div className="mb-6">
        <Text className="text-gray-600">
          Route: {bookingData.origin} → {bookingData.destination} | 
          Passengers: {bookingData.totalPassengers} | 
          Cabin: {bookingData.cabin}
        </Text>
      </div>

      <div className="space-y-4 mb-6">
        {flights.map((flight) => (
          <Card
            key={flight.id}
            className={`cursor-pointer transition-all ${
              selectedFlight?.id === flight.id ? 'border-blue-500 bg-blue-50' : 'hover:shadow-md'
            }`}
            onClick={() => handleFlightSelect(flight)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <Text strong className="text-lg">{flight.airline}</Text>
                  <Text className="text-gray-500">{flight.flightNumber}</Text>
                </div>
                <div className="flex items-center gap-6">
                  <div>
                    <Text strong className="text-xl">{flight.departureTime}</Text>
                    <div className="text-sm text-gray-500">{flight.origin}</div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="text-sm text-gray-500">{flight.stops}</div>
                    <div className="border-t border-gray-300 my-1"></div>
                  </div>
                  <div>
                    <Text strong className="text-xl">{flight.arrivalTime}</Text>
                    <div className="text-sm text-gray-500">{flight.destination}</div>
                  </div>
                </div>
              </div>
              <div className="text-right ml-6">
                <Text strong className="text-2xl text-green-600">
                  ${flight.price}
                </Text>
                <div className="text-sm text-gray-500">per person</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          type="primary"
          size="large"
          disabled={!selectedFlight}
          onClick={handleContinue}
        >
          Continue to Services
        </Button>
      </div>
    </div>
  );
}

function AddServicesStep({ onComplete, initialData }: { onComplete: (data: any) => void; initialData: any[] }) {
  const [selectedServices, setSelectedServices] = useState(initialData || []);

  const services = [
    { id: 1, name: "Priority Boarding", price: 25, description: "Board the aircraft first" },
    { id: 2, name: "Extra Baggage", price: 50, description: "Additional 23kg checked baggage" },
    { id: 3, name: "Seat Selection", price: 15, description: "Choose your preferred seat" },
    { id: 4, name: "Travel Insurance", price: 35, description: "Comprehensive travel coverage" }
  ];

  const handleServiceToggle = (service: any) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleContinue = () => {
    onComplete(selectedServices);
  };

  return (
    <div>
      <Title level={4} className="!mb-6">Add Services</Title>
      
      <div className="space-y-4 mb-6">
        {services.map((service) => {
          const isSelected = selectedServices.some(s => s.id === service.id);
          return (
            <Card
              key={service.id}
              className={`cursor-pointer transition-all ${
                isSelected ? 'border-blue-500 bg-blue-50' : 'hover:shadow-md'
              }`}
              onClick={() => handleServiceToggle(service)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Title level={5} className="!mb-1">{service.name}</Title>
                  <Text className="text-gray-600">{service.description}</Text>
                </div>
                <div className="text-right">
                  <Text strong className="text-lg">${service.price}</Text>
                  <div className="text-sm text-gray-500">per person</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Button type="primary" size="large" onClick={handleContinue}>
          Continue to Group Leader Info
        </Button>
      </div>
    </div>
  );
}

function GroupLeaderStep({ onComplete, initialData }: { onComplete: (data: any) => void; initialData: any }) {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    onComplete(values);
  };

  return (
    <div>
      <Title level={4} className="!mb-6">Group Leader Information</Title>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={initialData}
      >
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              label="First Name *"
              name="firstName"
              rules={[{ required: true, message: "Please enter first name" }]}
            >
              <Input placeholder="Enter first name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Last Name *"
              name="lastName"
              rules={[{ required: true, message: "Please enter last name" }]}
            >
              <Input placeholder="Enter last name" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Email *"
              name="email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Please enter valid email" }
              ]}
            >
              <Input placeholder="Enter email address" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Phone *"
              name="phone"
              rules={[{ required: true, message: "Please enter phone number" }]}
            >
              <Input placeholder="Enter phone number" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Organization"
          name="organization"
        >
          <Input placeholder="Enter organization name" />
        </Form.Item>

        <Form.Item
          label="Group Type"
          name="groupType"
        >
          <Select placeholder="Select group type">
            <Option value="corporate">Corporate</Option>
            <Option value="leisure">Leisure</Option>
            <Option value="educational">Educational</Option>
            <Option value="sports">Sports</Option>
            <Option value="religious">Religious</Option>
          </Select>
        </Form.Item>

        <div className="flex justify-end">
          <Button type="primary" htmlType="submit" size="large">
            Continue to Passenger Info
          </Button>
        </div>
      </Form>
    </div>
  );
}

function PassengerInfoStep({ onComplete, bookingData, initialData }: { onComplete: (data: any) => void; bookingData: any; initialData: any[] }) {
  const [passengers, setPassengers] = useState(
    initialData.length > 0 ? initialData : 
    Array.from({ length: bookingData.totalPassengers }, (_, i) => ({
      id: i + 1,
      firstName: "",
      lastName: "",
      dateOfBirth: null,
      passportNumber: "",
      nationality: ""
    }))
  );

  const handlePassengerChange = (index: number, field: string, value: any) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
    setPassengers(updatedPassengers);
  };

  const handleContinue = () => {
    const isValid = passengers.every(p => 
      p.firstName && p.lastName && p.dateOfBirth && p.passportNumber && p.nationality
    );
    
    if (isValid) {
      onComplete(passengers);
    } else {
      message.error("Please fill in all passenger information");
    }
  };

  return (
    <div>
      <Title level={4} className="!mb-6">Passenger Information</Title>
      
      <div className="space-y-6 mb-6">
        {passengers.map((passenger, index) => (
          <Card key={index} title={`Passenger ${index + 1}`}>
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <div className="mb-4">
                  <Text className="block mb-2">First Name *</Text>
                  <Input
                    value={passenger.firstName}
                    onChange={(e) => handlePassengerChange(index, "firstName", e.target.value)}
                    placeholder="Enter first name"
                  />
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="mb-4">
                  <Text className="block mb-2">Last Name *</Text>
                  <Input
                    value={passenger.lastName}
                    onChange={(e) => handlePassengerChange(index, "lastName", e.target.value)}
                    placeholder="Enter last name"
                  />
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="mb-4">
                  <Text className="block mb-2">Date of Birth *</Text>
                  <DatePicker
                    className="w-full"
                    value={passenger.dateOfBirth}
                    onChange={(date) => handlePassengerChange(index, "dateOfBirth", date)}
                    format="DD MMM YYYY"
                  />
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <div className="mb-4">
                  <Text className="block mb-2">Passport Number *</Text>
                  <Input
                    value={passenger.passportNumber}
                    onChange={(e) => handlePassengerChange(index, "passportNumber", e.target.value)}
                    placeholder="Enter passport number"
                  />
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div className="mb-4">
                  <Text className="block mb-2">Nationality *</Text>
                  <Select
                    className="w-full"
                    value={passenger.nationality}
                    onChange={(value) => handlePassengerChange(index, "nationality", value)}
                    placeholder="Select nationality"
                  >
                    <Option value="US">United States</Option>
                    <Option value="UK">United Kingdom</Option>
                    <Option value="CA">Canada</Option>
                    <Option value="AU">Australia</Option>
                    <Option value="IN">India</Option>
                  </Select>
                </div>
              </Col>
            </Row>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button type="primary" size="large" onClick={handleContinue}>
          Continue to Review
        </Button>
      </div>
    </div>
  );
}

function ReviewStep({ onComplete, allData }: { onComplete: (data: any) => void; allData: any }) {
  const { bookingData, flightData, selectedServices, groupLeaderData, passengerData } = allData;
  
  const basePrice = flightData?.basePrice || 850;
  const servicesTotal = selectedServices.reduce((sum: number, service: any) => sum + service.price, 0);
  const subtotal = (basePrice + servicesTotal) * bookingData.totalPassengers;
  const taxes = subtotal * 0.08;
  const total = subtotal + taxes;

  const handleContinue = () => {
    const bookingSummary = {
      subtotal,
      taxes,
      totalAmount: total,
      passengerCount: bookingData.totalPassengers
    };
    onComplete(bookingSummary);
  };

  return (
    <div>
      <Title level={4} className="!mb-6">Review & Confirmation</Title>
      
      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <Space direction="vertical" size="large" className="w-full">
            {/* Trip Details */}
            <Card title="Trip Details">
              <Descriptions column={2}>
                <Descriptions.Item label="Route">
                  {bookingData.origin} → {bookingData.destination}
                </Descriptions.Item>
                <Descriptions.Item label="Trip Type">
                  {bookingData.tripType}
                </Descriptions.Item>
                <Descriptions.Item label="Departure">
                  {bookingData.departureDate?.format?.("DD MMM YYYY") || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Passengers">
                  {bookingData.totalPassengers}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Flight Details */}
            <Card title="Selected Flight">
              <Descriptions column={2}>
                <Descriptions.Item label="Airline">
                  {flightData?.outbound?.airline || "Qatar Airways"}
                </Descriptions.Item>
                <Descriptions.Item label="Flight Number">
                  {flightData?.outbound?.flightNumber || "QR729"}
                </Descriptions.Item>
                <Descriptions.Item label="Departure">
                  {flightData?.outbound?.departureTime || "10:30 AM"}
                </Descriptions.Item>
                <Descriptions.Item label="Arrival">
                  {flightData?.outbound?.arrivalTime || "2:45 PM"}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Group Leader */}
            <Card title="Group Leader">
              <Descriptions column={2}>
                <Descriptions.Item label="Name">
                  {groupLeaderData.firstName} {groupLeaderData.lastName}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {groupLeaderData.email}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  {groupLeaderData.phone}
                </Descriptions.Item>
                <Descriptions.Item label="Organization">
                  {groupLeaderData.organization || "N/A"}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Space>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Booking Summary">
            <div className="space-y-3">
              <div className="flex justify-between">
                <Text>Base Price ({bookingData.totalPassengers} passengers)</Text>
                <Text>${(basePrice * bookingData.totalPassengers).toLocaleString()}</Text>
              </div>
              
              {selectedServices.length > 0 && (
                <div className="flex justify-between">
                  <Text>Services ({bookingData.totalPassengers} passengers)</Text>
                  <Text>${(servicesTotal * bookingData.totalPassengers).toLocaleString()}</Text>
                </div>
              )}
              
              <div className="flex justify-between">
                <Text>Subtotal</Text>
                <Text>${subtotal.toLocaleString()}</Text>
              </div>
              
              <div className="flex justify-between">
                <Text>Taxes & Fees</Text>
                <Text>${taxes.toLocaleString()}</Text>
              </div>
              
              <hr />
              
              <div className="flex justify-between">
                <Text strong className="text-lg">Total</Text>
                <Text strong className="text-lg text-green-600">
                  ${total.toLocaleString()}
                </Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <div className="flex justify-end mt-6">
        <Button type="primary" size="large" onClick={handleContinue}>
          Continue to Payment
        </Button>
      </div>
    </div>
  );
}

function PaymentStep({ onComplete, bookingSummary }: { onComplete: (data: any) => void; bookingSummary: any }) {
  const [paymentMethod, setPaymentMethod] = useState("creditCard");

  const handleSubmit = () => {
    const paymentData = {
      paymentMethod,
      totalAmount: bookingSummary.totalAmount,
      paymentDate: new Date().toISOString()
    };
    onComplete(paymentData);
  };

  return (
    <div>
      <Title level={4} className="!mb-6">Payment</Title>
      
      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <Card title="Payment Method">
            <Radio.Group
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full"
            >
              <Space direction="vertical" size="middle" className="w-full">
                <Radio value="creditCard">
                  <div>
                    <Text strong>Credit Card</Text>
                    <div className="text-sm text-gray-500">Pay with credit/debit card</div>
                  </div>
                </Radio>
                <Radio value="bankTransfer">
                  <div>
                    <Text strong>Bank Transfer</Text>
                    <div className="text-sm text-gray-500">Direct bank transfer</div>
                  </div>
                </Radio>
                <Radio value="invoice">
                  <div>
                    <Text strong>Invoice</Text>
                    <div className="text-sm text-gray-500">Send invoice for payment</div>
                  </div>
                </Radio>
              </Space>
            </Radio.Group>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Payment Summary">
            <div className="space-y-3">
              <div className="flex justify-between">
                <Text>Total Amount</Text>
                <Text strong className="text-lg text-green-600">
                  ${bookingSummary.totalAmount?.toLocaleString() || "0"}
                </Text>
              </div>
              <div className="flex justify-between">
                <Text>Payment Method</Text>
                <Text>
                  {paymentMethod === "creditCard" && "Credit Card"}
                  {paymentMethod === "bankTransfer" && "Bank Transfer"}
                  {paymentMethod === "invoice" && "Invoice"}
                </Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <div className="flex justify-end mt-6">
        <Button type="primary" size="large" onClick={handleSubmit}>
          Complete Booking
        </Button>
      </div>
    </div>
  );
}

export default function Bookings() {
  const [, setLocation] = useLocation();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [airlineFilter, setAirlineFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("dashboard");

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
            <AdminBookingFlow onReturn={() => setActiveTab("dashboard")} />
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