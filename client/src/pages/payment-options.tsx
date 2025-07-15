import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Row,
  Col,
  Typography,
  Radio,
  Space,
  Badge,
  Divider,
} from "antd";
import {
  ArrowLeftOutlined,
  CreditCardOutlined,
  BankOutlined,
  CalendarOutlined,
  UserOutlined,
  DollarOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import BookingSteps from "@/components/booking/booking-steps";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export default function PaymentOptions() {
  const [form] = Form.useForm();
  const [, setLocation] = useLocation();
  const [paymentSchedule, setPaymentSchedule] = useState("full");
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [bookingData, setBookingData] = useState<any>(null);
  const [flightData, setFlightData] = useState<any>(null);
  const [groupLeaderData, setGroupLeaderData] = useState<any>(null);
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [passengerCount, setPassengerCount] = useState(1);

  // Load booking data on component mount
  useEffect(() => {
    const loadBookingData = () => {
      // Load booking form data
      const storedBookingData = localStorage.getItem("bookingFormData");
      if (storedBookingData) {
        const data = JSON.parse(storedBookingData);
        setBookingData(data);
        setPassengerCount(data.totalPassengers || data.adults + data.kids + data.infants || 1);
      }

      // Load selected flight data
      const storedFlightData = localStorage.getItem("selectedFlightData");
      if (storedFlightData) {
        setFlightData(JSON.parse(storedFlightData));
      }

      // Load group leader data
      const storedGroupLeaderData = localStorage.getItem("groupLeaderData");
      if (storedGroupLeaderData) {
        setGroupLeaderData(JSON.parse(storedGroupLeaderData));
      }

      // Load selected services
      const storedServices = localStorage.getItem("selectedServices");
      if (storedServices) {
        setSelectedServices(JSON.parse(storedServices));
      }
    };

    loadBookingData();
  }, []);

  // Calculate total amount based on selected flight and services
  useEffect(() => {
    let baseCost = 0;
    let servicesCost = 0;

    // Calculate base flight cost
    if (flightData && flightData.outbound) {
      const outboundPrice = typeof flightData.outbound.price === 'string' 
        ? parseFloat(flightData.outbound.price) 
        : flightData.outbound.price || 0;
      baseCost += outboundPrice * passengerCount;

      // Add return flight cost if round trip
      if (flightData.return && bookingData?.tripType === "roundTrip") {
        const returnPrice = typeof flightData.return.price === 'string'
          ? parseFloat(flightData.return.price)
          : flightData.return.price || 0;
        baseCost += returnPrice * passengerCount;
      }
    }

    // Calculate services cost from selected services
    if (selectedServices.length > 0) {
      servicesCost = selectedServices.reduce((total, service) => {
        const servicePrice = typeof service.price === 'string' 
          ? parseFloat(service.price) 
          : service.price || 0;
        return total + servicePrice * passengerCount;
      }, 0);
    }

    // Calculate bundle services cost (seat, baggage, meals)
    const bundleData = localStorage.getItem('selectedBundleData');
    if (bundleData) {
      const bundle = JSON.parse(bundleData);
      if (bundle.selectedSeat) {
        const seatPrice = bundle.selectedSeat.price || 0;
        servicesCost += seatPrice * passengerCount;
      }
      if (bundle.selectedBaggage) {
        const baggagePrice = bundle.selectedBaggage.price || 0;
        servicesCost += baggagePrice * passengerCount;
      }
      if (bundle.selectedMeals && bundle.selectedMeals.length > 0) {
        bundle.selectedMeals.forEach(meal => {
          const mealPrice = meal.price || 0;
          servicesCost += mealPrice * passengerCount;
        });
      }
    }

    const subtotal = baseCost + servicesCost;
    const taxes = subtotal * 0.08; // 8% tax
    const groupDiscount = passengerCount >= 10 ? subtotal * 0.15 : 0; // 15% group discount for 10+ passengers
    
    setTotalAmount(subtotal + taxes - groupDiscount);
  }, [flightData, selectedServices, passengerCount, bookingData]);

  // Get payment options based on amount and services
  const getAvailablePaymentOptions = () => {
    const options = [
      {
        id: "creditCard",
        name: "Credit/Debit Card",
        icon: <CreditCardOutlined className="text-blue-600" />,
        description: "Pay securely with your credit or debit card.",
        available: true,
        discount: 0,
      },
      {
        id: "bankTransfer",
        name: "Bank Transfer",
        icon: <BankOutlined className="text-blue-600" />,
        description: "Direct bank transfer with discount on total amount.",
        available: totalAmount > 1000,
        discount: 0.02, // 2% discount
        badge: "2% Discount",
      },
      {
        id: "corporate",
        name: "Corporate Account",
        icon: <CreditCardOutlined className="text-blue-600" />,
        description: "Charge to your company's corporate travel account.",
        available: groupLeaderData?.groupType === "Corporate",
        discount: 0,
      },
    ];

    return options.filter(option => option.available);
  };

  const availablePaymentOptions = getAvailablePaymentOptions();

  const handleBack = () => {
    setLocation("/group-leader");
  };

  const handleContinue = async () => {
    try {
      // Only validate form fields if credit card is selected
      if (paymentMethod === "creditCard") {
        await form.validateFields();
      }
      
      const selectedOption = availablePaymentOptions.find(opt => opt.id === paymentMethod);
      const discount = selectedOption?.discount || 0;
      const discountedTotal = totalAmount * (1 - discount);
      
      const paymentData = {
        paymentSchedule,
        paymentMethod,
        totalAmount,
        discountedTotal,
        paymentDiscount: discount,
        dueNow: paymentSchedule === "full" ? discountedTotal : 
                paymentSchedule === "deposit" ? discountedTotal * 0.3 : 
                discountedTotal / 3,
        selectedPaymentOption: selectedOption,
        formData: paymentMethod === "creditCard" ? form.getFieldsValue() : null,
        flightData,
        selectedServices,
        bundleData: localStorage.getItem('selectedBundleData') ? JSON.parse(localStorage.getItem('selectedBundleData')) : null,
        passengerCount,
      };

      // Save payment data to localStorage
      localStorage.setItem("paymentData", JSON.stringify(paymentData));
      
      console.log("Payment Information:", paymentData);
      setLocation("/passenger-info");
    } catch (errorInfo) {
      console.log("Validation Failed:", errorInfo);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Booking Steps */}
        <div className="mb-8">
          <div className="overflow-x-auto">
            <BookingSteps
              currentStep={4}
              size="small"
              className="mb-6 min-w-[800px]"
            />
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-6">
          <Title level={2} className="!mb-2 text-gray-900">
            Payment Options
          </Title>
          <Text className="text-gray-600">
            Choose your preferred payment schedule and method for your group
            booking.
          </Text>
        </div>

        <Row gutter={24}>
          {/* Left Column - Payment Form */}
          <Col xs={24} lg={14}>
            {/* Payment Schedule */}
            <Card className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <CalendarOutlined className="text-blue-600" />
                <Title level={4} className="!mb-0 text-gray-800">
                  Payment Schedule
                </Title>
              </div>

              <Radio.Group
                value={paymentSchedule}
                onChange={(e) => setPaymentSchedule(e.target.value)}
                className="w-full"
              >
                <Space direction="vertical" className="w-full" size={16}>
                  <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <Radio value="full" className="!flex !items-start">
                      <div className="flex-1 ml-2">
                        <div className="flex items-center gap-2 mb-1">
                          <Text className="font-semibold text-gray-900">
                            Full Payment
                          </Text>
                          <Badge color="blue" text="Recommended" />
                        </div>
                        <Text className="text-gray-600 text-sm block mb-2">
                          Pay the complete amount now and secure your booking
                          immediately.
                        </Text>
                        <Text className="font-bold text-xl text-gray-900">
                          ₹{(() => {
                            const selectedOption = availablePaymentOptions.find(opt => opt.id === paymentMethod);
                            const discount = selectedOption?.discount || 0;
                            return (totalAmount * (1 - discount)).toFixed(2);
                          })()}
                        </Text>
                      </div>
                    </Radio>
                  </div>

                  <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <Radio value="deposit" className="!flex !items-start">
                      <div className="flex-1 ml-2">
                        <Text className="font-semibold text-gray-900 block mb-1">
                          Deposit Payment
                        </Text>
                        <Text className="text-gray-600 text-sm block mb-2">
                          Pay a deposit now, remaining balance due 30 days
                          before departure.
                        </Text>
                        <div className="flex justify-between mt-2">
                          <Text className="text-sm text-gray-600">Deposit (30%):</Text>
                          <Text className="font-semibold">₹{(() => {
                            const selectedOption = availablePaymentOptions.find(opt => opt.id === paymentMethod);
                            const discount = selectedOption?.discount || 0;
                            const discountedTotal = totalAmount * (1 - discount);
                            return (discountedTotal * 0.3).toFixed(2);
                          })()}</Text>
                        </div>
                        <div className="flex justify-between">
                          <Text className="text-sm text-gray-600">Remaining:</Text>
                          <Text className="font-semibold">₹{(() => {
                            const selectedOption = availablePaymentOptions.find(opt => opt.id === paymentMethod);
                            const discount = selectedOption?.discount || 0;
                            const discountedTotal = totalAmount * (1 - discount);
                            return (discountedTotal * 0.7).toFixed(2);
                          })()}</Text>
                        </div>
                      </div>
                    </Radio>
                  </div>

                  <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <Radio value="split" className="!flex !items-start">
                      <div className="flex-1 ml-2">
                        <Text className="font-semibold text-gray-900 block mb-1">
                          Split Payment (3 installments)
                        </Text>
                        <Text className="text-gray-600 text-sm block mb-2">
                          Divide your payment into equal installments over time.
                        </Text>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <Text className="text-sm text-gray-600">Today:</Text>
                            <Text className="font-semibold">₹{(() => {
                              const selectedOption = availablePaymentOptions.find(opt => opt.id === paymentMethod);
                              const discount = selectedOption?.discount || 0;
                              const discountedTotal = totalAmount * (1 - discount);
                              return (discountedTotal / 3).toFixed(2);
                            })()}</Text>
                          </div>
                          <div className="flex justify-between">
                            <Text className="text-sm text-gray-600">In 30 days:</Text>
                            <Text className="font-semibold">₹{(() => {
                              const selectedOption = availablePaymentOptions.find(opt => opt.id === paymentMethod);
                              const discount = selectedOption?.discount || 0;
                              const discountedTotal = totalAmount * (1 - discount);
                              return (discountedTotal / 3).toFixed(2);
                            })()}</Text>
                          </div>
                          <div className="flex justify-between">
                            <Text className="text-sm text-gray-600">In 60 days:</Text>
                            <Text className="font-semibold">₹{(() => {
                              const selectedOption = availablePaymentOptions.find(opt => opt.id === paymentMethod);
                              const discount = selectedOption?.discount || 0;
                              const discountedTotal = totalAmount * (1 - discount);
                              return (discountedTotal / 3).toFixed(2);
                            })()}</Text>
                          </div>
                        </div>
                      </div>
                    </Radio>
                  </div>
                </Space>
              </Radio.Group>
            </Card>

            {/* Payment Method */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <CreditCardOutlined className="text-blue-600" />
                <Title level={4} className="!mb-0 text-gray-800">
                  Payment Method
                </Title>
              </div>

              <Radio.Group
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full"
              >
                <Space direction="vertical" className="w-full" size={16}>
                  {availablePaymentOptions.map((option) => (
                    <div key={option.id} className={`border rounded-lg p-4 hover:border-blue-300 transition-colors ${!option.available ? 'opacity-50' : ''}`}>
                      <Radio value={option.id} className="!flex !items-start" disabled={!option.available}>
                        <div className="flex-1 ml-2">
                          <div className="flex items-center gap-2 mb-2">
                            {option.icon}
                            <Text className="font-semibold text-gray-900">
                              {option.name}
                            </Text>
                            {option.badge && (
                              <Badge color="green" text={option.badge} />
                            )}
                          </div>
                          <Text className="text-gray-600 text-sm block mb-3">
                            {option.description}
                          </Text>
                          {option.discount > 0 && (
                            <Text className="text-green-600 text-sm font-medium">
                              Save ₹{(totalAmount * option.discount).toFixed(2)} with this method
                            </Text>
                          )}

                          {paymentMethod === "creditCard" && option.id === "creditCard" && (
                            <Form form={form} layout="vertical" className="mt-4">
                              <Row gutter={16}>
                                <Col xs={24} md={12}>
                                  <Form.Item
                                    label="Card Number"
                                    name="cardNumber"
                                    rules={[{ required: true, message: 'Please enter card number' }]}
                                  >
                                    <Input
                                      placeholder="1234 5678 9012 3456"
                                      size="large"
                                    />
                                  </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                  <Form.Item
                                    label="Cardholder Name"
                                    name="cardholderName"
                                    rules={[{ required: true, message: 'Please enter cardholder name' }]}
                                  >
                                    <Input placeholder="John Doe" size="large" />
                                  </Form.Item>
                                </Col>
                              </Row>
                              <Row gutter={16}>
                                <Col xs={24} md={12}>
                                  <Form.Item
                                    label="Expiry Date"
                                    name="expiryDate"
                                    rules={[{ required: true, message: 'Please enter expiry date' }]}
                                  >
                                    <Input placeholder="MM/YY" size="large" />
                                  </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                  <Form.Item 
                                    label="CVV" 
                                    name="cvv"
                                    rules={[{ required: true, message: 'Please enter CVV' }]}
                                  >
                                    <Input placeholder="123" size="large" />
                                  </Form.Item>
                                </Col>
                              </Row>
                            </Form>
                          )}
                        </div>
                      </Radio>
                    </div>
                  ))}
                </Space>
              </Radio.Group>
            </Card>
          </Col>

          {/* Right Column - Booking Summary */}
          <Col xs={24} lg={10}>
            <Card className="sticky top-6">
              <Title level={4} className="!mb-4 text-gray-800">
                Booking Summary
              </Title>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm">✈️</span>
                  </div>
                  <Text className="text-gray-900 font-medium">
                    {bookingData ? `${bookingData.origin} ${bookingData.tripType === "roundTrip" ? "⇄" : "→"} ${bookingData.destination}` : "Flight Route"}
                  </Text>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <CalendarOutlined className="text-blue-600 text-sm" />
                  </div>
                  <Text className="text-gray-900">
                    {bookingData ? (
                      bookingData.tripType === "roundTrip" ? 
                        `${dayjs(bookingData.departureDate).format('DD MMM YYYY')} - ${dayjs(bookingData.returnDate).format('DD MMM YYYY')}` :
                        dayjs(bookingData.departureDate).format('DD MMM YYYY')
                    ) : "Travel Dates"}
                  </Text>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserOutlined className="text-blue-600 text-sm" />
                  </div>
                  <Text className="text-gray-900">{passengerCount} passenger{passengerCount > 1 ? 's' : ''}</Text>
                </div>

                {groupLeaderData && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <EnvironmentOutlined className="text-blue-600 text-sm" />
                    </div>
                    <Text className="text-gray-900">{groupLeaderData.groupType} Group</Text>
                  </div>
                )}
              </div>

              {flightData && (
                <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                  <Text className="font-medium text-gray-700 block mb-2">Selected Flights</Text>
                  <div className="space-y-2 text-sm">
                    {flightData.outbound && (
                      <div>
                        <Text className="text-gray-600">Outbound: </Text>
                        <Text className="text-gray-900">{flightData.outbound.airline} {flightData.outbound.flightNumber}</Text>
                      </div>
                    )}
                    {flightData.return && bookingData?.tripType === "roundTrip" && (
                      <div>
                        <Text className="text-gray-600">Return: </Text>
                        <Text className="text-gray-900">{flightData.return.airline} {flightData.return.flightNumber}</Text>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="border-t pt-4 space-y-3">
                {flightData && (
                  <div className="flex justify-between">
                    <Text className="text-gray-600">Base Flight Cost</Text>
                    <Text className="text-gray-900">
                      ₹{(() => {
                        let baseCost = 0;
                        if (flightData.outbound) {
                          baseCost += (typeof flightData.outbound.price === 'string' ? parseFloat(flightData.outbound.price) : flightData.outbound.price || 0) * passengerCount;
                        }
                        if (flightData.return && bookingData?.tripType === "roundTrip") {
                          baseCost += (typeof flightData.return.price === 'string' ? parseFloat(flightData.return.price) : flightData.return.price || 0) * passengerCount;
                        }
                        return baseCost.toFixed(2);
                      })()}
                    </Text>
                  </div>
                )}

                {selectedServices.length > 0 && (
                  <div className="flex justify-between">
                    <Text className="text-gray-600">Additional Services</Text>
                    <Text className="text-gray-900">
                      ₹{(selectedServices.reduce((total, service) => {
                        const servicePrice = typeof service.price === 'string' ? parseFloat(service.price) : service.price || 0;
                        return total + servicePrice * passengerCount;
                      }, 0)).toFixed(2)}
                    </Text>
                  </div>
                )}

                {(() => {
                  const bundleData = localStorage.getItem('selectedBundleData');
                  if (bundleData) {
                    const bundle = JSON.parse(bundleData);
                    let bundleCost = 0;
                    if (bundle.selectedSeat) bundleCost += (bundle.selectedSeat.price || 0) * passengerCount;
                    if (bundle.selectedBaggage) bundleCost += (bundle.selectedBaggage.price || 0) * passengerCount;
                    if (bundle.selectedMeals && bundle.selectedMeals.length > 0) {
                      bundle.selectedMeals.forEach(meal => {
                        bundleCost += (meal.price || 0) * passengerCount;
                      });
                    }
                    if (bundleCost > 0) {
                      return (
                        <div className="flex justify-between">
                          <Text className="text-gray-600">Bundle Services</Text>
                          <Text className="text-gray-900">₹{bundleCost.toFixed(2)}</Text>
                        </div>
                      );
                    }
                  }
                  return null;
                })()}

                <div className="flex justify-between">
                  <Text className="text-gray-600">Taxes & Fees (8%)</Text>
                  <Text className="text-gray-900">₹{(() => {
                    const subtotal = totalAmount / 1.08;
                    const taxesOnly = subtotal * 0.08;
                    return taxesOnly.toFixed(2);
                  })()}</Text>
                </div>

                {passengerCount >= 10 && (
                  <div className="flex justify-between">
                    <Text className="text-green-600">Group Discount (15%)</Text>
                    <Text className="text-green-600">-₹{(() => {
                      const subtotal = totalAmount / 1.08;
                      const discount = subtotal * 0.15;
                      return discount.toFixed(2);
                    })()}</Text>
                  </div>
                )}

                {(() => {
                  const selectedOption = availablePaymentOptions.find(opt => opt.id === paymentMethod);
                  const discount = selectedOption?.discount || 0;
                  if (discount > 0) {
                    return (
                      <div className="flex justify-between">
                        <Text className="text-green-600">Payment Method Discount ({(discount * 100).toFixed(0)}%)</Text>
                        <Text className="text-green-600">-₹{(totalAmount * discount).toFixed(2)}</Text>
                      </div>
                    );
                  }
                  return null;
                })()}

                <Divider className="!my-3" />

                <div className="flex justify-between items-center">
                  <Text className="font-semibold text-lg text-gray-900">
                    Total Amount
                  </Text>
                  <Text className="font-bold text-xl text-gray-900">
                    ₹{(() => {
                      const selectedOption = availablePaymentOptions.find(opt => opt.id === paymentMethod);
                      const discount = selectedOption?.discount || 0;
                      return (totalAmount * (1 - discount)).toFixed(2);
                    })()}
                  </Text>
                </div>

                <div className="bg-blue-50 rounded-lg p-3 mt-4">
                  <div className="flex justify-between items-center">
                    <Text className="text-blue-700 font-medium">
                      Payment Schedule:
                    </Text>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <Text className="text-blue-600">Due now:</Text>
                    <Text className="font-semibold text-blue-700">
                      ₹{(() => {
                        const selectedOption = availablePaymentOptions.find(opt => opt.id === paymentMethod);
                        const discount = selectedOption?.discount || 0;
                        const discountedTotal = totalAmount * (1 - discount);
                        
                        if (paymentSchedule === "full") return discountedTotal.toFixed(2);
                        if (paymentSchedule === "deposit") return (discountedTotal * 0.3).toFixed(2);
                        if (paymentSchedule === "split") return (discountedTotal / 3).toFixed(2);
                        return discountedTotal.toFixed(2);
                      })()}
                    </Text>
                  </div>
                  {paymentSchedule === "deposit" && (
                    <div className="flex justify-between items-center mt-1">
                      <Text className="text-blue-600">Remaining (due in 30 days):</Text>
                      <Text className="font-semibold text-blue-700">
                        ₹{(() => {
                          const selectedOption = availablePaymentOptions.find(opt => opt.id === paymentMethod);
                          const discount = selectedOption?.discount || 0;
                          const discountedTotal = totalAmount * (1 - discount);
                          return (discountedTotal * 0.7).toFixed(2);
                        })()}
                      </Text>
                    </div>
                  )}
                  {paymentSchedule === "split" && (
                    <div className="space-y-1 mt-1">
                      <div className="flex justify-between items-center">
                        <Text className="text-blue-600">Next payment (30 days):</Text>
                        <Text className="font-semibold text-blue-700">
                          ₹{(() => {
                            const selectedOption = availablePaymentOptions.find(opt => opt.id === paymentMethod);
                            const discount = selectedOption?.discount || 0;
                            const discountedTotal = totalAmount * (1 - discount);
                            return (discountedTotal / 3).toFixed(2);
                          })()}
                        </Text>
                      </div>
                      <div className="flex justify-between items-center">
                        <Text className="text-blue-600">Final payment (60 days):</Text>
                        <Text className="font-semibold text-blue-700">
                          ₹{(() => {
                            const selectedOption = availablePaymentOptions.find(opt => opt.id === paymentMethod);
                            const discount = selectedOption?.discount || 0;
                            const discountedTotal = totalAmount * (1 - discount);
                            return (discountedTotal / 3).toFixed(2);
                          })()}
                        </Text>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-800 flex items-center"
            size="large"
          >
            Back to Group Leader
          </Button>

          <Button
            type="primary"
            size="large"
            onClick={handleContinue}
            className="px-8 flex items-center"
            style={{
              backgroundColor: "#2a0a22",
              borderColor: "#2a0a22",
            }}
          >
            Continue to Passenger Info
          </Button>
        </div>
      </div>

      <style jsx>{`
        .ant-form-item-label > label {
          font-weight: 600;
          color: #374151;
        }

        .ant-radio-wrapper {
          align-items: flex-start;
        }

        .ant-radio {
          margin-top: 2px;
        }

        .ant-input {
          border-color: #d1d5db;
        }

        .ant-input:focus,
        .ant-input-focused {
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
        }

        .ant-card {
          border-radius: 8px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }

        .ant-badge-status-text {
          color: #1e40af;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
