import { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Radio,
  Input,
  Button,
  Checkbox,
  Row,
  Col,
  message,
  Spin,
  Alert,
} from "antd";
import {
  CreditCardOutlined,
  BankOutlined,
  PayCircleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useLocation, useRoute } from "wouter";
import Header from "@/components/layout/header";

const { Title, Text } = Typography;

export default function PaymentOptions() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/payment-options");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bidData, setBidData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "",
    nameOnCard: "",
    expiryDate: "",
    cvv: "",
  });

  // Extract URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const bidId = urlParams.get("bidId");
  const amount = urlParams.get("amount");
  const passengers = urlParams.get("passengers");

  // Fetch bid details
  useEffect(() => {
    const fetchBidDetails = async () => {
      if (!bidId) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/bids/${bidId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch bid details");
        }

        const data = await response.json();
        setBidData(data);
      } catch (error) {
        console.error("Error fetching bid details:", error);
        message.error("Failed to load bid details");
      } finally {
        setLoading(false);
      }
    };

    fetchBidDetails();
  }, [bidId]);

  const handleBack = () => {
    setLocation(`/bid-details/${bidId}`);
  };

  const handlePaymentFormChange = (field: string, value: string) => {
    setPaymentForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    // Add spaces every 4 digits
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const handleSubmitBidAndPayment = async () => {
    if (!agreedToTerms) {
      message.error("Please agree to the terms and conditions");
      return;
    }

    if (paymentMethod === "creditCard") {
      if (!paymentForm.cardNumber || !paymentForm.nameOnCard || !paymentForm.expiryDate || !paymentForm.cvv) {
        message.error("Please fill in all payment details");
        return;
      }
    }

    try {
      setSubmitting(true);

      // First, submit bid participation (update bid status to 'submitted')
      const bidResponse = await fetch(`/api/bids/${bidId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          passengerCount: parseInt(passengers) || bidData?.bid?.passengerCount,
          bidAmount: bidData?.bid?.bidAmount,
          bidStatus: 'submitted'
        }),
      });

      if (!bidResponse.ok) {
        throw new Error('Failed to submit bid participation');
      }

      // Create payment record
      const depositAmount = parseFloat(amount) * 0.1; // 10% deposit as shown in design
      const paymentData = {
        bidId: parseInt(bidId),
        bookingId: bidData?.bid?.id || 1, // Use bid ID as booking reference
        paymentReference: `PAY-${new Date().getFullYear()}-${Date.now()}`,
        amount: depositAmount.toString(),
        currency: 'USD',
        paymentMethod: paymentMethod === 'creditCard' ? 'credit_card' : 
                     paymentMethod === 'bankTransfer' ? 'bank_transfer' : 'paypal',
        paymentStatus: 'completed',
        transactionId: `txn_${Date.now()}`,
        paymentGateway: paymentMethod === 'creditCard' ? 'stripe' : 
                       paymentMethod === 'bankTransfer' ? 'bank' : 'paypal'
      };

      const paymentResponse = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!paymentResponse.ok) {
        throw new Error('Failed to process payment');
      }

      message.success('Bid submitted and deposit paid successfully!');

      // Navigate to bid details or success page
      setTimeout(() => {
        setLocation(`/bid-details/${bidId}`);
      }, 2000);

    } catch (error) {
      console.error('Error submitting bid and payment:', error);
      message.error('Failed to process bid submission and payment');
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate values
  const totalBidAmount = amount ? parseFloat(amount) : 0;
  const depositRequired = totalBidAmount * 0.1; // 10% deposit

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-6 flex justify-center items-center">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Back Button */}
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          className="mb-4 p-0 h-auto text-gray-600 hover:text-blue-600 font-medium"
        >
          Back to Bid
        </Button>

        {/* Payment Details Card */}
        <Card className="shadow-sm">
          <div className="mb-6">
            <Title level={3} className="!mb-2 text-gray-900">
              Payment Details
            </Title>
            <Text className="text-gray-600">
              Complete your bid by paying the required deposit. This amount will be refunded if your bid is not accepted.
            </Text>
          </div>

          {/* Payment Summary */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <Title level={5} className="!mb-4 text-gray-900">
              Payment Summary
            </Title>
            <Row gutter={[32, 16]}>
              <Col span={12}>
                <div>
                  <Text className="text-gray-600 block text-sm">Total Bid Amount:</Text>
                  <Text className="text-gray-900 font-semibold text-lg">
                    ${totalBidAmount.toLocaleString()}
                  </Text>
                </div>
              </Col>
              <Col span={12}>
                <div>
                  <Text className="text-gray-600 block text-sm">Deposit Required:</Text>
                  <Text className="text-blue-600 font-bold text-lg">
                    ${depositRequired.toLocaleString()}
                  </Text>
                </div>
              </Col>
            </Row>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <Title level={5} className="!mb-4 text-gray-900">
              Payment Method
            </Title>
            <Radio.Group
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full"
            >
              <div className="space-y-3">
                <Radio value="creditCard" className="w-full">
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-500 w-full ml-2">
                    <CreditCardOutlined className="text-blue-600 text-lg" />
                    <span className="font-medium">Credit Card</span>
                  </div>
                </Radio>
                <Radio value="bankTransfer" className="w-full">
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-500 w-full ml-2">
                    <BankOutlined className="text-green-600 text-lg" />
                    <span className="font-medium">Bank Transfer</span>
                  </div>
                </Radio>
                <Radio value="paypal" className="w-full">
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-500 w-full ml-2">
                    <PayCircleOutlined className="text-orange-600 text-lg" />
                    <span className="font-medium">PayPal</span>
                  </div>
                </Radio>
              </div>
            </Radio.Group>
          </div>

          {/* Credit Card Form */}
          {paymentMethod === "creditCard" && (
            <div className="mb-6">
              <div className="space-y-4">
                <div>
                  <Text className="text-gray-700 font-medium block mb-2">
                    Card Number
                  </Text>
                  <Input
                    placeholder="1234 5678 9012 3456"
                    value={paymentForm.cardNumber}
                    onChange={(e) => 
                      handlePaymentFormChange("cardNumber", formatCardNumber(e.target.value))
                    }
                    maxLength={19}
                    size="large"
                    className="rounded-md"
                  />
                </div>

                <div>
                  <Text className="text-gray-700 font-medium block mb-2">
                    Name on Card
                  </Text>
                  <Input
                    placeholder="John Doe"
                    value={paymentForm.nameOnCard}
                    onChange={(e) => handlePaymentFormChange("nameOnCard", e.target.value)}
                    size="large"
                    className="rounded-md"
                  />
                </div>

                <Row gutter={16}>
                  <Col span={12}>
                    <div>
                      <Text className="text-gray-700 font-medium block mb-2">
                        Expiry Date
                      </Text>
                      <Input
                        placeholder="MM/YY"
                        value={paymentForm.expiryDate}
                        onChange={(e) => 
                          handlePaymentFormChange("expiryDate", formatExpiryDate(e.target.value))
                        }
                        maxLength={5}
                        size="large"
                        className="rounded-md"
                      />
                    </div>
                  </Col>
                  <Col span={12}>
                    <div>
                      <Text className="text-gray-700 font-medium block mb-2">
                        CVV
                      </Text>
                      <Input
                        placeholder="123"
                        value={paymentForm.cvv}
                        onChange={(e) => handlePaymentFormChange("cvv", e.target.value.replace(/\D/g, ''))}
                        maxLength={4}
                        size="large"
                        className="rounded-md"
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          )}

          {/* Bank Transfer Info */}
          {paymentMethod === "bankTransfer" && (
            <Alert
              message="Bank Transfer Instructions"
              description="You will be redirected to complete the bank transfer after submitting your bid."
              type="info"
              className="mb-6"
            />
          )}

          {/* PayPal Info */}
          {paymentMethod === "paypal" && (
            <Alert
              message="PayPal Payment"
              description="You will be redirected to PayPal to complete your payment securely."
              type="info"
              className="mb-6"
            />
          )}

          {/* Terms and Conditions */}
          <div className="mb-6">
            <Checkbox
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
            >
              <Text className="text-gray-700">
                I agree to the{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Bidding Terms and Conditions
                </a>
                . I understand that the deposit will be refunded if my bid is not accepted by the airline.
              </Text>
            </Checkbox>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <Button size="large" onClick={handleBack} className="px-8">
              Back to Bid
            </Button>
            <Button
              type="primary"
              size="large"
              loading={submitting}
              onClick={handleSubmitBidAndPayment}
              className="bg-blue-600 hover:bg-blue-700 px-8 font-semibold"
            >
              Pay ${depositRequired.toFixed(2)} & Submit Bid
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}