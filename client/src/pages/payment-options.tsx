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
} from "antd";
import {
  ArrowLeftOutlined,
  CreditCardOutlined,
  BankOutlined,
  CalendarOutlined,
  UserOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import BookingSteps from "@/components/booking/booking-steps";

const { Title, Text } = Typography;

export default function PaymentOptions() {
  const [form] = Form.useForm();
  const [, setLocation] = useLocation();
  const [paymentSchedule, setPaymentSchedule] = useState("full");
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [bookingData, setBookingData] = useState<any>(null);

  // Load booking data from localStorage
  useEffect(() => {
    const storedBookingData = localStorage.getItem('bookingFormData');
    if (storedBookingData) {
      setBookingData(JSON.parse(storedBookingData));
    }
  }, []);

  const handleBack = () => {
    setLocation("/group-leader");
  };

  const handleContinue = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Payment Information:", {
          ...values,
          paymentSchedule,
          paymentMethod,
        });
        setLocation("/passenger-info");
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
      });
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
                          ₹{bookingData?.totalCost || '70,448'}
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
                      </div>
                    </Radio>
                  </div>

                  <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <Radio value="split" className="!flex !items-start">
                      <div className="flex-1 ml-2">
                        <Text className="font-semibold text-gray-900 block mb-1">
                          Split Payment
                        </Text>
                        <Text className="text-gray-600 text-sm block mb-2">
                          Divide your payment into equal installments over time.
                        </Text>
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
                  <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <Radio value="creditCard" className="!flex !items-start">
                      <div className="flex-1 ml-2">
                        <div className="flex items-center gap-2 mb-2">
                          <CreditCardOutlined className="text-blue-600" />
                          <Text className="font-semibold text-gray-900">
                            Credit/Debit Card
                          </Text>
                        </div>
                        <Text className="text-gray-600 text-sm block mb-3">
                          Pay securely with your credit or debit card.
                        </Text>

                        {paymentMethod === "creditCard" && (
                          <Form form={form} layout="vertical" className="mt-4">
                            <Row gutter={16}>
                              <Col xs={24} md={12}>
                                <Form.Item
                                  label="Card Number"
                                  name="cardNumber"
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
                                >
                                  <Input placeholder="MM/YY" size="large" />
                                </Form.Item>
                              </Col>
                              <Col xs={24} md={12}>
                                <Form.Item label="CVV" name="cvv">
                                  <Input placeholder="123" size="large" />
                                </Form.Item>
                              </Col>
                            </Row>
                          </Form>
                        )}
                      </div>
                    </Radio>
                  </div>

                  <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <Radio value="bankTransfer" className="!flex !items-start">
                      <div className="flex-1 ml-2">
                        <div className="flex items-center gap-2 mb-2">
                          <BankOutlined className="text-blue-600" />
                          <Text className="font-semibold text-gray-900">
                            Bank Transfer
                          </Text>
                          <Badge color="green" text="2% Discount" />
                        </div>
                        <Text className="text-gray-600 text-sm">
                          Direct bank transfer with 2% discount on total amount.
                        </Text>
                      </div>
                    </Radio>
                  </div>

                  <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <Radio value="corporate" className="!flex !items-start">
                      <div className="flex-1 ml-2">
                        <div className="flex items-center gap-2 mb-2">
                          <CreditCardOutlined className="text-blue-600" />
                          <Text className="font-semibold text-gray-900">
                            Corporate Account
                          </Text>
                        </div>
                        <Text className="text-gray-600 text-sm">
                          Charge to your company's corporate travel account.
                        </Text>
                      </div>
                    </Radio>
                  </div>
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
                    {bookingData ? `${bookingData.origin} ⇄ ${bookingData.destination}` : 'JFK ⇄ LHR'}
                  </Text>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <CalendarOutlined className="text-blue-600 text-sm" />
                  </div>
                  <Text className="text-gray-900">
                    {bookingData ? `${bookingData.departureDate}${bookingData.returnDate ? ` - ${bookingData.returnDate}` : ''}` : 'Jun 15 - Jun 22, 2024'}
                  </Text>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserOutlined className="text-blue-600 text-sm" />
                  </div>
                  <Text className="text-gray-900">
                    {bookingData ? `${bookingData.totalPassengers} passengers` : '32 passengers'}
                  </Text>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between">
                  <Text className="text-gray-600">Base Flight Cost</Text>
                  <Text className="text-gray-900">
                    ₹{bookingData?.selectedFlight?.price ? (parseFloat(bookingData.selectedFlight.price) * (bookingData.totalPassengers || 1)).toFixed(2) : '78,400'}
                  </Text>
                </div>

                {bookingData?.selectedBundles && bookingData.selectedBundles.length > 0 && (
                  <div className="flex justify-between">
                    <Text className="text-gray-600">Selected Bundles</Text>
                    <Text className="text-gray-900">₹{bookingData.bundleCost || '4,480'}</Text>
                  </div>
                )}

                {bookingData?.totalPassengers && bookingData.totalPassengers >= 10 && (
                  <div className="flex justify-between">
                    <Text className="text-green-600">Group Discount (15%)</Text>
                    <Text className="text-green-600">
                      -₹{bookingData.groupDiscount || '12,432'}
                    </Text>
                  </div>
                )}

                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <Text className="font-semibold text-lg text-gray-900">
                      Total Amount
                    </Text>
                    <Text className="font-bold text-xl text-gray-900">
                      ₹{bookingData?.totalCost || '70,448'}
                    </Text>
                  </div>
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
                      ₹{paymentSchedule === 'full' ? (bookingData?.totalCost || '70,448') : Math.round((bookingData?.totalCost || 70448) * 0.3)}
                    </Text>
                  </div>
                  {paymentSchedule === 'deposit' && (
                    <div className="flex justify-between items-center mt-1">
                      <Text className="text-blue-600">Due later:</Text>
                      <Text className="font-semibold text-blue-700">
                        ₹{Math.round((bookingData?.totalCost || 70448) * 0.7)}
                      </Text>
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
