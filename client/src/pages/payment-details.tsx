
import { Card, Row, Col, Typography, Button, Space, Badge, Divider } from 'antd';
import { ArrowLeftOutlined, DownloadOutlined, UserOutlined } from '@ant-design/icons';
import { useRoute, useLocation } from 'wouter';
import Header from "@/components/layout/header";

const { Title, Text } = Typography;

export default function PaymentDetails() {
  const [, params] = useRoute("/payment-details/:id");
  const [, setLocation] = useLocation();

  // Mock payment data - in real app, this would come from API
  const paymentData = {
    paymentId: params?.id || 'PAY-1234',
    status: 'Completed',
    amount: 2500.00,
    paymentDate: 'May 15, 2024',
    paymentMethod: 'Credit Card (**** 4242)',
    transactionId: 'txn_123456789',
    bookingId: 'GF-2024-1001',
    groupName: 'ABC Corporation Annual Meeting',
    route: 'New York → London',
    travelDate: 'Jun 15, 2024',
    passengers: 32,
    partialPayment: 2500.00,
    processingFee: 0.00,
    totalPaid: 2500.00,
    totalBookingAmount: 8500.00,
    amountPaid: 4000.00,
    remainingBalance: 4500.00,
    payerName: 'John Smith',
    payerEmail: 'john.smith@example.com',
    payerPhone: '+1 (555) 123-4567',
    paymentNote: 'Payment made on behalf of ABC Corporation'
  };

  const handleBackToPayments = () => {
    setLocation('/payments');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Page Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={handleBackToPayments}
              className="flex items-center"
            >
              Back to Payments
            </Button>
            <div>
              <Title level={2} className="!mb-0">Payment Details</Title>
            </div>
          </div>
          <Button 
            icon={<DownloadOutlined />} 
            className="flex items-center"
          >
            Download Receipt
          </Button>
        </div>

        <Row gutter={[24, 24]}>
          {/* Payment Information */}
          <Col xs={24} lg={12}>
            <Card>
              <Title level={4} className="!mb-2 text-gray-900">Payment Information</Title>
              <Text className="text-gray-600 block mb-6">Details about this payment transaction</Text>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Text className="text-gray-600">Payment ID</Text>
                  <Text className="font-medium text-gray-900">{paymentData.paymentId}</Text>
                </div>

                <div className="flex justify-between items-center">
                  <Text className="text-gray-600">Status</Text>
                  <Badge status="success" text="Completed" className="font-medium" />
                </div>

                <div className="flex justify-between items-center">
                  <Text className="text-gray-600">Amount</Text>
                  <Text className="font-semibold text-gray-900">${paymentData.amount.toFixed(2)}</Text>
                </div>

                <div className="flex justify-between items-center">
                  <Text className="text-gray-600">Payment Date</Text>
                  <Text className="text-gray-900">{paymentData.paymentDate}</Text>
                </div>

                <div className="flex justify-between items-center">
                  <Text className="text-gray-600">Payment Method</Text>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">💳</span>
                    <Text className="text-gray-900">{paymentData.paymentMethod}</Text>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Text className="text-gray-600">Transaction ID</Text>
                  <Text className="text-gray-900">{paymentData.transactionId}</Text>
                </div>
              </div>
            </Card>
          </Col>

          {/* Booking Information */}
          <Col xs={24} lg={12}>
            <Card>
              <Title level={4} className="!mb-2 text-gray-900">Booking Information</Title>
              <Text className="text-gray-600 block mb-6">Related booking details</Text>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Text className="text-gray-600">Booking ID</Text>
                  <Text className="font-medium text-gray-900">{paymentData.bookingId}</Text>
                </div>

                <div className="flex justify-between items-center">
                  <Text className="text-gray-600">Group Name</Text>
                  <Text className="text-gray-900">{paymentData.groupName}</Text>
                </div>

                <div className="flex justify-between items-center">
                  <Text className="text-gray-600">Route</Text>
                  <Text className="text-gray-900">{paymentData.route}</Text>
                </div>

                <div className="flex justify-between items-center">
                  <Text className="text-gray-600">Travel Date</Text>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">📅</span>
                    <Text className="text-gray-900">{paymentData.travelDate}</Text>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Text className="text-gray-600">Passengers</Text>
                  <Text className="text-gray-900">{paymentData.passengers} passengers</Text>
                </div>
              </div>
            </Card>
          </Col>

          {/* Payment Breakdown */}
          <Col xs={24}>
            <Card>
              <Title level={4} className="!mb-2 text-gray-900">Payment Breakdown</Title>
              <Text className="text-gray-600 block mb-6">Detailed breakdown of this payment</Text>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <Text className="text-gray-600">Partial Payment (Deposit)</Text>
                  <Text className="font-medium text-gray-900">${paymentData.partialPayment.toFixed(2)}</Text>
                </div>

                <div className="flex justify-between items-center">
                  <Text className="text-gray-600">Processing Fee</Text>
                  <Text className="text-gray-900">${paymentData.processingFee.toFixed(2)}</Text>
                </div>

                <Divider />

                <div className="flex justify-between items-center">
                  <Text className="font-semibold text-gray-900 text-lg">Total Paid</Text>
                  <Text className="font-bold text-gray-900 text-lg">${paymentData.totalPaid.toFixed(2)}</Text>
                </div>
              </div>

              {/* Remaining Balance Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <Title level={5} className="!mb-3 text-blue-700">Remaining Balance</Title>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Text className="text-blue-600">Total Booking Amount:</Text>
                    <Text className="font-semibold text-blue-900">${paymentData.totalBookingAmount.toFixed(2)}</Text>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Text className="text-blue-600">Amount Paid:</Text>
                    <Text className="font-semibold text-blue-900">${paymentData.amountPaid.toFixed(2)}</Text>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Text className="text-blue-600">Remaining Balance:</Text>
                    <Text className="font-bold text-blue-900">${paymentData.remainingBalance.toFixed(2)}</Text>
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          {/* Payer Information */}
          <Col xs={24}>
            <Card>
              <Title level={4} className="!mb-2 text-gray-900">Payer Information</Title>
              <Text className="text-gray-600 block mb-6">Details about who made this payment</Text>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <UserOutlined className="text-gray-500 text-xl" />
                </div>
                
                <div className="flex-1">
                  <Text className="font-semibold text-gray-900 block text-lg">{paymentData.payerName}</Text>
                  <Text className="text-gray-600 block">{paymentData.payerEmail}</Text>
                  <Text className="text-gray-600 block">{paymentData.payerPhone}</Text>
                  
                  <div className="mt-4">
                    <Text className="text-gray-600">{paymentData.paymentNote}</Text>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
