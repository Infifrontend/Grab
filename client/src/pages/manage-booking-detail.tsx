import React, { useState } from 'react';
import { Card, Row, Col, Typography, Space, Tabs, Input, Button, InputNumber, Upload, message, DatePicker, Select, Badge, Divider, Spin, Alert } from 'antd';
import { DownloadOutlined, PlusOutlined, UploadOutlined, MinusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRoute, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Header from "@/components/layout/header";
import type { Booking } from '@shared/schema';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

export default function ManageBookingDetail() {
  const [, params] = useRoute("/manage-booking/:id");
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("basic-info");
  const [paymentAmount, setPaymentAmount] = useState('4500.00');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  // Get booking ID from URL params
  const bookingId = params?.id;

  // Fetch booking details from API
  const { data: bookingDetails, isLoading, error } = useQuery({
    queryKey: ["/api/booking-details", bookingId],
    queryFn: async () => {
      if (!bookingId) throw new Error("No booking ID provided");
      const response = await fetch(`/api/booking-details/${bookingId}`);
      if (!response.ok) throw new Error("Failed to fetch booking details");
      return response.json();
    },
    enabled: !!bookingId,
  });

  // Initialize passengers state with fetched data
  const [passengers, setPassengers] = useState([
    { firstName: '', lastName: '' },
  ]);

  // State for group leader information
  const [groupLeaderInfo, setGroupLeaderInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Update passengers when booking data is loaded
  React.useEffect(() => {
    if (bookingDetails?.passengers && bookingDetails.passengers.length > 0) {
      setPassengers(bookingDetails.passengers.map(p => ({
        firstName: p.firstName || '',
        lastName: p.lastName || ''
      })));
    } else if (bookingDetails?.booking?.passengerCount) {
      // Create empty passenger slots based on passenger count
      const emptyPassengers = Array.from({ length: bookingDetails.booking.passengerCount }, () => ({
        firstName: '',
        lastName: ''
      }));
      setPassengers(emptyPassengers);
    }
  }, [bookingDetails]);

  // Update group leader info when booking data is loaded
  React.useEffect(() => {
    if (bookingDetails?.comprehensiveData?.groupLeaderInfo) {
      const groupLeaderData = bookingDetails.comprehensiveData.groupLeaderInfo;
      setGroupLeaderInfo({
        name: groupLeaderData.name || groupLeaderData.firstName || '',
        email: groupLeaderData.email || '',
        phone: groupLeaderData.phone || groupLeaderData.phoneNumber || ''
      });
    } else if (bookingDetails?.booking) {
      // Set default empty values if no comprehensive data exists
      setGroupLeaderInfo({
        name: '',
        email: '',
        phone: ''
      });
    }
  }, [bookingDetails]);

  // Get group size from booking data
  const groupSize = bookingDetails?.booking?.passengerCount || 1;
  const [currentGroupSize, setCurrentGroupSize] = useState(1);

  React.useEffect(() => {
    if (bookingDetails?.booking?.passengerCount) {
      setCurrentGroupSize(bookingDetails.booking.passengerCount);
    }
  }, [bookingDetails]);

  // Update passenger list when group size changes
  React.useEffect(() => {
    if (currentGroupSize > 0 && currentGroupSize !== passengers.length) {
      if (currentGroupSize > passengers.length) {
        // Add empty passenger slots
        const newPassengers = [...passengers];
        const passengersToAdd = currentGroupSize - passengers.length;
        for (let i = 0; i < passengersToAdd; i++) {
          newPassengers.push({ firstName: '', lastName: '' });
        }
        setPassengers(newPassengers);
      } else if (currentGroupSize < passengers.length) {
        // Remove excess passengers
        setPassengers(passengers.slice(0, currentGroupSize));
      }
    }
  }, [currentGroupSize, passengers.length]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-center items-center">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (error || !bookingDetails) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Alert
            message="Booking Not Found"
            description="The booking you're looking for could not be found."
            type="error"
            showIcon
          />
        </div>
      </div>
    );
  }

  const { booking, passengers: fetchedPassengers, flightData, comprehensiveData } = bookingDetails;

  // Parse comprehensive data for detailed information
  const groupLeaderData = comprehensiveData?.groupLeaderInfo;
  const selectedServices = comprehensiveData?.selectedServices || [];

  const handleAddPassenger = () => {
    setPassengers([...passengers, { firstName: '', lastName: '' }]);
  };

  const handlePassengerChange = (index: number, field: string, value: string) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const handleCancelChanges = () => {
    message.info('Changes cancelled');
    setLocation('/manage-booking');
  };

  const handleSaveChanges = async () => {
    try {
      // Save group leader information
      const groupLeaderResponse = await fetch(`/api/booking-details/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          groupLeaderName: groupLeaderInfo.name,
          groupLeaderEmail: groupLeaderInfo.email,
          groupLeaderPhone: groupLeaderInfo.phone,
        }),
      });

      if (!groupLeaderResponse.ok) {
        throw new Error('Failed to update group leader information');
      }

      // Save passenger information
      const passengersResponse = await fetch(`/api/booking-passengers/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          passengers: passengers.filter(p => p.firstName.trim() || p.lastName.trim())
        }),
      });

      if (!passengersResponse.ok) {
        throw new Error('Failed to update passenger information');
      }

      // Update group size if it has changed
      const originalGroupSize = bookingDetails?.booking?.passengerCount || 1;
      if (currentGroupSize !== originalGroupSize) {
        const groupSizeResponse = await fetch(`/api/booking-group-size/${bookingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            groupSize: currentGroupSize
          }),
        });

        if (!groupSizeResponse.ok) {
          throw new Error('Failed to update group size');
        }
      }

      message.success('Changes saved successfully');

      // Refresh the booking details to reflect the changes
      window.location.reload();
    } catch (error) {
      console.error('Error saving changes:', error);
      message.error('Failed to save changes. Please try again.');
    }
  };

  const handleMakePayment = () => {
    message.success('Payment processed successfully');
  };

  const handleSetupPaymentPlan = () => {
    message.info('Payment plan setup initiated');
  };

  const handleDownloadCSVTemplate = () => {
    // Create CSV header with the required fields
    let csvContent = 'First Name,Last Name,Date of Birth,Passport Number,Nationality,Gender,Special Requirements\n';

    // Add current passenger data if available
    if (passengers && passengers.length > 0) {
      passengers.forEach((passenger, index) => {
        const firstName = passenger.firstName || `Passenger${index + 1}`;
        const lastName = passenger.lastName || '';
        const dateOfBirth = passenger.dateOfBirth || '';
        const passportNumber = passenger.passportNumber || '';
        const nationality = passenger.nationality || '';
        const gender = passenger.gender || '';
        const specialRequirements = passenger.specialRequirements || passenger.specialRequests || '';

        csvContent += `${firstName},${lastName},${dateOfBirth},${passportNumber},${nationality},${gender},"${specialRequirements}"\n`;
      });
    } else {
      // Add template rows with sample data for all required fields
      csvContent += `John,Smith,1985-06-15,A12345678,US,Male,Vegetarian meal
Jane,Doe,1990-03-22,B87654321,US,Female,Wheelchair assistance
Mike,Johnson,1978-11-08,C11223344,US,Male,None
Sarah,Williams,1992-07-30,D55667788,US,Female,Kosher meal
David,Brown,1983-12-05,E99887766,US,Male,Extra legroom`;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `passenger_list_${bookingId || 'template'}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    message.success('Passenger list downloaded successfully');
  };

  const tabItems = [
    {
      key: "basic-info",
      label: "Basic Info",
    },
    {
      key: "services",
      label: "Services",
    },
    {
      key: "changes",
      label: "Changes",
    },
    {
      key: "payment",
      label: "Payment",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <Title level={2} className="!mb-0 text-gray-900">Manage Booking</Title>
        </div>

        {/* Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          className="mb-6"
        />

        {/* Basic Info Tab */}
        {activeTab === "basic-info" && (
          <Row gutter={[24, 24]}>
            {/* Booking Information */}
            <Col xs={24} lg={12}>
              <Card>
                <div className="mb-6">
                  <Title level={4} className="!mb-2 text-gray-900">Booking Information</Title>
                  <Text className="text-gray-600">Update basic booking details</Text>
                </div>

                <Space direction="vertical" size="large" className="w-full">
                  <div>
                    <Text className="block mb-2 text-gray-700 font-medium">Booking ID</Text>
                    <Input
                      value={booking.bookingReference || booking.bookingId || bookingId}
                      disabled
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Text className="block mb-2 text-gray-700 font-medium">Group Leader Name</Text>
                    <Input
                      placeholder="Enter group leader name"
                      value={groupLeaderInfo.name}
                      onChange={(e) => setGroupLeaderInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Text className="block mb-2 text-gray-700 font-medium">Group Leader Contact Email</Text>
                    <Input
                      type="email"
                      placeholder="Enter group leader contact email"
                      value={groupLeaderInfo.email}
                      onChange={(e) => setGroupLeaderInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Text className="block mb-2 text-gray-700 font-medium">Group Leader Contact Phone</Text>
                    <Input
                      placeholder="Enter group leader contact phone"
                      value={groupLeaderInfo.phone}
                      onChange={(e) => setGroupLeaderInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                </Space>
              </Card>
            </Col>

            {/* Group Size Management */}
            <Col xs={24} lg={12}>
              <Card>
                <div className="mb-6">
                  <Title level={4} className="!mb-2 text-gray-900">Group Size Management</Title>
                  <Text className="text-gray-600">Adjust the number of passengers in your group</Text>
                </div>

                <Space direction="vertical" size="large" className="w-full">
                  {/* Current Group Size */}
                  <div>
                    <Text className="block mb-2 text-gray-700 font-medium">Current Group Size</Text>
                    <Text className="text-gray-600 text-sm block mb-2">Confirmed passengers</Text>
                    <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                      <Text className="text-green-700 font-semibold text-lg">{currentGroupSize} passengers</Text>
                    </div>
                  </div>

                  {/* Adjust Group Size */}
                  <div>
                    <Text className="block mb-2 text-gray-700 font-medium">Adjust Group Size</Text>
                    <Text className="text-gray-600 text-sm block mb-3">Add or remove passengers</Text>
                    <div className="flex items-center gap-3">
                      <Button 
                        onClick={() => setCurrentGroupSize(Math.max(1, currentGroupSize - 1))}
                        className="w-10 h-10 flex items-center justify-center"
                      >
                        -
                      </Button>
                      <InputNumber
                        value={currentGroupSize}
                        onChange={(value) => setCurrentGroupSize(value || 1)}
                        min={1}
                        className="text-center"
                        style={{ width: '80px' }}
                      />
                      <Button 
                        onClick={() => setCurrentGroupSize(currentGroupSize + 1)}
                        className="w-10 h-10 flex items-center justify-center"
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Passenger Information Management */}
                  <div>
                    <Text className="block mb-2 text-gray-700 font-medium">Passenger Information Management</Text>
                    <Text className="text-gray-600 text-sm block mb-3">Upload passenger details via CSV file or enter manually</Text>

                    <div className="mb-4">
                      <Button 
                        icon={<DownloadOutlined />}
                        className="mb-3"
                        onClick={handleDownloadCSVTemplate}
                      >
                        Download CSV Template
                      </Button>
                      <Text className="text-gray-500 text-sm block mb-2">Download template with required passenger information format</Text>

                      <div className="flex items-center gap-3">
                        <Upload
                          accept=".csv,.xlsx,.xls"
                          showUploadList={false}
                          beforeUpload={() => false}
                        >
                          <Button>Choose file</Button>
                        </Upload>
                        <Text className="text-gray-500 text-sm">No file chosen</Text>
                        <Button type="primary" size="small">Browse</Button>
                      </div>
                      <Text className="text-gray-500 text-xs block mt-1">Supported formats: CSV, Excel (.xlsx, .xls)</Text>
                    </div>

                    {/* Manual Entry */}
                    <div>
                      <Text className="block mb-3 text-gray-700 font-medium">Manual Entry</Text>
                      <Text className="text-gray-600 text-sm block mb-3">Add or update passenger names manually</Text>

                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {passengers.map((passenger, index) => (
                          <div key={index} className="flex gap-3">
                            <Input
                              placeholder={`Passenger ${index + 1} - First Name`}
                              value={passenger.firstName}
                              onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                              className="flex-1"
                            />
                            <Input
                              placeholder={`Passenger ${index + 1} - Last Name`}
                              value={passenger.lastName}
                              onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                              className="flex-1"
                            />
                          </div>
                        ))}
                      </div>

                      <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={handleAddPassenger}
                        className="w-full mt-3"
                      >
                        Add More Passengers
                      </Button>
                    </div>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <div className="space-y-6">
            {/* Special Bundles */}
            <Card>
              <div className="mb-6">
                <Title level={4} className="!mb-2 text-gray-900">Special Bundles</Title>
                <Text className="text-gray-600">Add flexible booking and payment options</Text>
              </div>

              <div className="space-y-4">
                {/* FlexPay Plus */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Title level={5} className="!mb-1">FlexPay Plus</Title>
                      <Text className="text-gray-600 block mb-2">Pay your way with flexible payment options</Text>
                      <Text className="text-xl font-bold text-gray-900 block mb-2">₹29</Text>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Pay 50% now, 50% later</li>
                        <li>• No interest charges</li>
                        <li>• Automatic payment reminders</li>
                      </ul>
                    </div>
                    <Button type="primary">Add Bundle</Button>
                  </div>
                </div>

                {/* Schedule Shield */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Title level={5} className="!mb-1">Schedule Shield</Title>
                      <Text className="text-gray-600 block mb-2">Change your travel dates with confidence</Text>
                      <Text className="text-xl font-bold text-gray-900 block mb-2">₹45</Text>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• One free date change per booking</li>
                        <li>• Waived change fees</li>
                      </ul>
                    </div>
                    <Button type="primary">Add Bundle</Button>
                  </div>
                </div>

                {/* Worry-Free Cancellation */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Title level={5} className="!mb-1">Worry-Free Cancellation</Title>
                      <Text className="text-gray-600 block mb-2">Get refund protection for unexpected changes</Text>
                      <Text className="text-xl font-bold text-gray-900 block mb-2">₹65</Text>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• 100% refund if cancelled 48+ hours before</li>
                        <li>• No questions asked policy</li>
                      </ul>
                    </div>
                    <Button type="primary">Add Bundle</Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Current Services & Bundles */}
            <Card>
              <div className="mb-6">
                <Title level={4} className="!mb-2 text-gray-900">Current Services & Bundles</Title>
                <Text className="text-gray-600">Manage your existing ancillary services</Text>
              </div>

              <div className="space-y-4">
                {/* Comfort Plus Bundle */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Title level={5} className="!mb-1">Comfort Plus Bundle</Title>
                      <Text className="text-gray-600 block mb-2">Enhanced comfort for your journey</Text>
                      <Text className="text-xl font-bold text-gray-900 block mb-2">₹89</Text>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Priority boarding</li>
                        <li>• Extra legroom seat</li>
                        <li>• Premium meal</li>
                        <li>• Expedited checked bag</li>
                      </ul>
                    </div>
                    <Button danger icon={<DeleteOutlined />}>Remove</Button>
                  </div>
                </div>

                {/* Extra Checked Bag */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Title level={5} className="!mb-1">Extra Checked Bag</Title>
                      <Text className="text-gray-600 block mb-2">Additional 23kg checked baggage</Text>
                      <Text className="text-xl font-bold text-gray-900 block mb-2">₹45</Text>
                      <Text className="text-sm text-gray-600">Quantity: 2</Text>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button icon={<MinusOutlined />} size="small"></Button>
                      <span className="mx-2">2</span>
                      <Button icon={<PlusOutlined />} size="small"></Button>
                      <Button danger icon={<DeleteOutlined />} className="ml-2">Remove</Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Add More Services */}
            <Card>
              <div className="mb-6">
                <Title level={4} className="!mb-2 text-gray-900">Add More Services</Title>
                <Text className="text-gray-600">Enhance your journey with additional services</Text>
              </div>

              <div className="space-y-4">
                {/* Business Essentials */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Title level={5} className="!mb-1">Business Essentials</Title>
                      <Text className="text-gray-600 block mb-2">Everything you need for business travel</Text>
                      <Text className="text-xl font-bold text-gray-900 block mb-2">₹149</Text>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Lounge access</li>
                        <li>• Fast track security</li>
                        <li>• Premium seat selection</li>
                        <li>• Wi-Fi access</li>
                      </ul>
                    </div>
                    <Button type="primary">Add Service</Button>
                  </div>
                </div>

                {/* Premium Meal */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Title level={5} className="!mb-1">Premium Meal</Title>
                      <Text className="text-gray-600 block mb-2">Upgrade to premium dining experience</Text>
                      <Text className="text-xl font-bold text-gray-900 block mb-2">₹35</Text>
                    </div>
                    <Button type="primary">Add Service</Button>
                  </div>
                </div>

                {/* Airport Lounge Access */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Title level={5} className="!mb-1">Airport Lounge Access</Title>
                      <Text className="text-gray-600 block mb-2">Access to premium airport lounges</Text>
                      <Text className="text-xl font-bold text-gray-900 block mb-2">₹55</Text>
                    </div>
                    <Button type="primary">Add Service</Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Changes Tab */}
        {activeTab === "changes" && (
          <Card>
            <div className="mb-6">
              <Title level={4} className="!mb-2 text-gray-900">Flight Modifications</Title>
              <Text className="text-gray-600">Request changes to your flight details</Text>
            </div>

            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <div>
                  <Text className="block mb-2 text-gray-700 font-medium">Departure Date</Text>
                  <DatePicker 
                    defaultValue={dayjs('15/06/2024', 'DD/MM/YYYY')}
                    format="DD/MM/YYYY"
                    className="w-full"
                    placeholder="15/06/2024"
                  />
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <Text className="block mb-2 text-gray-700 font-medium">Return Date</Text>
                  <DatePicker 
                    defaultValue={dayjs('22/06/2024', 'DD/MM/YYYY')}
                    format="DD/MM/YYYY"
                    className="w-full"
                    placeholder="22/06/2024"
                  />
                </div>
              </Col>
            </Row>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <Text className="text-blue-700">
                <strong>Note:</strong> Date changes are subject to availability and may incur additional fees. We'll check availability and provide you with options.
              </Text>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button size="large" onClick={handleCancelChanges}>
                Cancel Changes
              </Button>
              <Button 
                type="primary" 
                size="large"
                className="infiniti-btn-primary"
                onClick={handleSaveChanges}
              >
                Save Changes
              </Button>
            </div>
          </Card>
        )}

        {/* Payment Tab */}
        {activeTab === "payment" && (
          <div className="space-y-6">
            {/* Payment Status */}
            <Card>
              <div className="mb-6">
                <Title level={4} className="!mb-2 text-gray-900">Payment Status</Title>
                <Text className="text-gray-600">Current payment status and transaction history</Text>
              </div>

              <Row gutter={[24, 16]}>
                <Col xs={24} md={8}>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <Text className="text-blue-600 font-medium block mb-1">Total Booking Amount</Text>
                    <Text className="text-2xl font-bold text-blue-600">
                      ₹{parseFloat(booking.totalAmount || '0').toLocaleString()}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <Text className="text-green-600 font-medium block mb-1">Amount Paid</Text>
                    <Text className="text-2xl font-bold text-green-600">
                      ₹{(parseFloat(booking.totalAmount || '0') * (booking.paymentStatus === 'completed' ? 1 : 0.5)).toLocaleString()}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                    <Text className="text-orange-600 font-medium block mb-1">Remaining Balance</Text>
                    <Text className="text-2xl font-bold text-orange-600">
                      ₹{(parseFloat(booking.totalAmount || '0') * (booking.paymentStatus === 'completed' ? 0 : 0.5)).toLocaleString()}
                    </Text>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Payment History */}
            <Card>
              <div className="mb-6">
                <Title level={4} className="!mb-2 text-gray-900">Payment History</Title>
                <Text className="text-gray-600">All payments made for this booking</Text>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div>
                        <Text className="font-semibold text-gray-900 block">₹2,500.00</Text>
                        <Text className="text-gray-600 text-sm">May 15, 2024</Text>
                      </div>
                      <div>
                        <Text className="text-gray-900">Credit Card</Text>
                        <Text className="text-gray-600 text-sm">ID: PAY-1234</Text>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge status="success" text="Completed" />
                    <Button type="link">View Details</Button>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div>
                        <Text className="font-semibold text-gray-900 block">₹1,500.00</Text>
                        <Text className="text-gray-600 text-sm">May 20, 2024</Text>
                      </div>
                      <div>
                        <Text className="text-gray-900">Bank Transfer</Text>
                        <Text className="text-gray-600 text-sm">ID: PAY-1235</Text>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge status="success" text="Completed" />
                    <Button type="link">View Details</Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Make Payment */}
            <Card>
              <div className="mb-6">
                <Title level={4} className="!mb-2 text-gray-900">Make Payment</Title>
                <Text className="text-gray-600">Pay your remaining balance or make a partial payment</Text>
              </div>

              <Row gutter={[24, 16]}>
                <Col xs={24} md={12}>
                  <div>
                    <Text className="block mb-2 text-gray-700 font-medium">Payment Amount</Text>
                    <Input
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      prefix="₹"
                      className="w-full"
                    />
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div>
                    <Text className="block mb-2 text-gray-700 font-medium">Payment Method</Text>
                    <Select
                      value={paymentMethod}
                      onChange={setPaymentMethod}
                      className="w-full"
                    >
                      <Option value="Credit Card">Credit Card</Option                      <Option value="Bank Transfer">Bank Transfer</Option>
                      <Option value="PayPal">PayPal</Option>
                    </Select>
                  </div>
                </Col>
              </Row>

              <Row gutter={[16, 16]} className="mt-6">
                <Col xs={24} md={12}>
                  <Button 
                    type="primary" 
                    size="large" 
                    className="w-full infiniti-btn-primary"
                    onClick={handleMakePayment}
                  >
                    Make Payment
                  </Button>
                </Col>
                <Col xs={24} md={12}>
                  <Button 
                    size="large" 
                    className="w-full"
                    onClick={handleSetupPaymentPlan}
                  >
                    Set Up Payment Plan
                  </Button>
                </Col>
              </Row>
            </Card>
          </div>
        )}

        {/* Action Buttons - Only show for non-payment tabs */}
        {activeTab !== "payment" && (
          <div className="flex justify-end gap-3 mt-8">
            <Button size="large" onClick={handleCancelChanges}>
              Cancel Changes
            </Button>
            <Button 
              type="primary" 
              size="large"
              className="infiniti-btn-primary"
              onClick={handleSaveChanges}
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}