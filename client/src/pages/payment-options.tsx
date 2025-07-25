
import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, Button, Typography, Radio, Form, Input, Row, Col, Space, Divider, message } from 'antd';
import { CreditCardOutlined, BankOutlined, DollarOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useAdminBookingContext } from '../context/AdminBookingContext';

const { Title, Text } = Typography;

export default function PaymentOptions() {
  const [, setLocation] = useLocation();
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [form] = Form.useForm();
  const { bookingType } = useAdminBookingContext();

  const handlePayment = async (values: any) => {
    try {
      // Simulate payment processing
      message.success('Payment processed successfully!');
      
      // Navigate based on booking type
      if (bookingType === 'group') {
        setLocation('/admin/bookings');
      } else {
        setLocation('/booking-confirmation');
      }
    } catch (error) {
      message.error('Payment failed. Please try again.');
    }
  };

  const handleBack = () => {
    if (bookingType === 'group') {
      setLocation('/review-confirmation');
    } else {
      setLocation('/review-confirmation');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack}
            className="mb-4"
          >
            Back to Review
          </Button>
          <Title level={2} className="!mb-2">
            Payment Options
          </Title>
          <Text className="text-gray-600">
            Choose your preferred payment method to complete your {bookingType || 'retail'} booking
          </Text>
        </div>

        <Row gutter={[24, 24]}>
          {/* Payment Methods */}
          <Col xs={24} lg={16}>
            <Card className="mb-6">
              <Title level={4} className="!mb-6">
                Select Payment Method
              </Title>

              <Form
                form={form}
                layout="vertical"
                onFinish={handlePayment}
                initialValues={{ paymentMethod: 'creditCard' }}
              >
                <Form.Item name="paymentMethod">
                  <Radio.Group
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full"
                  >
                    <Space direction="vertical" className="w-full" size={16}>
                      {/* Credit Card */}
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
                              <div className="mt-4 space-y-4">
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
                              </div>
                            )}
                          </div>
                        </Radio>
                      </div>

                      {/* Bank Transfer */}
                      <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                        <Radio value="bankTransfer" className="!flex !items-start">
                          <div className="flex-1 ml-2">
                            <div className="flex items-center gap-2 mb-2">
                              <BankOutlined className="text-green-600" />
                              <Text className="font-semibold text-gray-900">
                                Bank Transfer
                              </Text>
                            </div>
                            <Text className="text-gray-600 text-sm">
                              Transfer funds directly from your bank account.
                            </Text>
                          </div>
                        </Radio>
                      </div>

                      {/* PayPal */}
                      <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                        <Radio value="paypal" className="!flex !items-start">
                          <div className="flex-1 ml-2">
                            <div className="flex items-center gap-2 mb-2">
                              <DollarOutlined className="text-blue-500" />
                              <Text className="font-semibold text-gray-900">
                                PayPal
                              </Text>
                            </div>
                            <Text className="text-gray-600 text-sm">
                              Pay with your PayPal account.
                            </Text>
                          </div>
                        </Radio>
                      </div>
                    </Space>
                  </Radio.Group>
                </Form.Item>

                <Divider />

                <div className="flex justify-end gap-3">
                  <Button size="large" onClick={handleBack}>
                    Back
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                    className="px-8"
                    style={{
                      backgroundColor: "#2a0a22",
                      borderColor: "#2a0a22",
                    }}
                  >
                    Complete Payment
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>

          {/* Order Summary */}
          <Col xs={24} lg={8}>
            <Card>
              <Title level={4} className="!mb-4">
                Order Summary
              </Title>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Text>Base Fare</Text>
                  <Text>₹45,000</Text>
                </div>
                <div className="flex justify-between">
                  <Text>Taxes & Fees</Text>
                  <Text>₹5,000</Text>
                </div>
                <div className="flex justify-between">
                  <Text>Services</Text>
                  <Text>₹2,500</Text>
                </div>
                <Divider className="!my-3" />
                <div className="flex justify-between font-semibold text-lg">
                  <Text strong>Total</Text>
                  <Text strong>₹52,500</Text>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <Text className="text-blue-800 text-sm">
                  Your payment is protected by 256-bit SSL encryption
                </Text>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
