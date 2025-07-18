
import { useState } from 'react';
import { Card, Row, Col, Typography, Button, Badge, Spin, message } from 'antd';
import { ArrowLeftOutlined, DownloadOutlined, UserOutlined } from '@ant-design/icons';
import { useRoute, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import Header from "@/components/layout/header";

const { Title, Text } = Typography;

export default function PaymentDetails() {
  const [, params] = useRoute("/payment-details/:id");
  const [, setLocation] = useLocation();

  // Fetch payment details from database
  const { data: paymentData, isLoading, error } = useQuery({
    queryKey: ['payment-details', params?.id],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/payments`);
      const payments = await response.json();
      
      // Find the payment by reference
      const payment = payments.find((p: any) => 
        p.paymentReference === params?.id || 
        p.id.toString() === params?.id
      );
      
      if (!payment) {
        throw new Error('Payment not found');
      }

      // Fetch related booking details
      let bookingData = null;
      if (payment.bookingId) {
        try {
          const bookingResponse = await apiRequest('GET', `/api/booking-details/${payment.bookingId}`);
          bookingData = await bookingResponse.json();
        } catch (e) {
          console.warn('Could not fetch booking details:', e);
        }
      }

      return {
        payment,
        booking: bookingData?.booking,
        flight: bookingData?.flightData,
        passengers: bookingData?.passengers || []
      };
    },
    enabled: !!params?.id,
  });

  const handleBackToPayments = () => {
    setLocation('/payments');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-center items-center py-12">
            <Spin size="large" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !paymentData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="text-center py-12">
            <Title level={3}>Payment Not Found</Title>
            <Text>The requested payment could not be found.</Text>
            <div className="mt-4">
              <Button type="primary" onClick={handleBackToPayments}>
                Back to Payments
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { payment, booking, flight, passengers } = paymentData;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: string | number) => {
    return parseFloat(amount.toString()).toFixed(2);
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <Badge status="success" text="Completed" className="font-medium" />;
      case 'pending':
        return <Badge status="processing" text="Pending" className="font-medium" />;
      case 'failed':
        return <Badge status="error" text="Failed" className="font-medium" />;
      default:
        return <Badge status="default" text={status || 'Unknown'} className="font-medium" />;
    }
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
              Back
            </Button>
            <div>
              <Title level={2} className="!mb-0">Payment Details</Title>
              <Text className="text-gray-600">{payment.paymentReference}</Text>
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
                  <Text className="font-medium text-gray-900">{payment.paymentReference}</Text>
                </div>

                <div className="flex justify-between items-center">
                  <Text className="text-gray-600">Status</Text>
                  {getStatusBadge(payment.paymentStatus)}
                </div>

                <div className="flex justify-between items-center">
                  <Text className="text-gray-600">Amount</Text>
                  <Text className="font-semibold text-gray-900">${formatAmount(payment.amount)}</Text>
                </div>

                <div className="flex justify-between items-center">
                  <Text className="text-gray-600">Payment Date</Text>
                  <Text className="text-gray-900">{formatDate(payment.createdAt)}</Text>
                </div>

                <div className="flex justify-between items-center">
                  <Text className="text-gray-600">Payment Method</Text>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">💳</span>
                    <Text className="text-gray-900">
                      {payment.paymentMethod?.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'N/A'}
                    </Text>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Text className="text-gray-600">Transaction ID</Text>
                  <Text className="text-gray-900">{payment.transactionId || 'N/A'}</Text>
                </div>

                <div className="flex justify-between items-center">
                  <Text className="text-gray-600">Currency</Text>
                  <Text className="text-gray-900">{payment.currency || 'USD'}</Text>
                </div>

                {payment.processedAt && (
                  <div className="flex justify-between items-center">
                    <Text className="text-gray-600">Processed At</Text>
                    <Text className="text-gray-900">{formatDate(payment.processedAt)}</Text>
                  </div>
                )}
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
                  <Text className="font-medium text-gray-900">#{payment.bookingId}</Text>
                </div>

                {booking && (
                  <>
                    <div className="flex justify-between items-center">
                      <Text className="text-gray-600">Booking Reference</Text>
                      <Text className="text-gray-900">{booking.bookingReference}</Text>
                    </div>

                    <div className="flex justify-between items-center">
                      <Text className="text-gray-600">Booking Status</Text>
                      <Badge 
                        color={booking.bookingStatus === 'confirmed' ? 'green' : 'orange'} 
                        text={booking.bookingStatus?.charAt(0).toUpperCase() + booking.bookingStatus?.slice(1)} 
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <Text className="text-gray-600">Passengers</Text>
                      <Text className="text-gray-900">{booking.passengerCount} passengers</Text>
                    </div>

                    <div className="flex justify-between items-center">
                      <Text className="text-gray-600">Total Amount</Text>
                      <Text className="text-gray-900">${formatAmount(booking.totalAmount)}</Text>
                    </div>
                  </>
                )}

                {flight && (
                  <>
                    <div className="flex justify-between items-center">
                      <Text className="text-gray-600">Flight</Text>
                      <Text className="text-gray-900">{flight.flightNumber}</Text>
                    </div>

                    <div className="flex justify-between items-center">
                      <Text className="text-gray-600">Route</Text>
                      <Text className="text-gray-900">{flight.origin} → {flight.destination}</Text>
                    </div>

                    <div className="flex justify-between items-center">
                      <Text className="text-gray-600">Departure</Text>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600">📅</span>
                        <Text className="text-gray-900">{formatDate(flight.departureTime)}</Text>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <Text className="text-gray-600">Airline</Text>
                      <Text className="text-gray-900">{flight.airline}</Text>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </Col>
        </Row>

        {/* Payment Breakdown */}
        <Row gutter={[24, 24]} className="mt-6">
          <Col span={24}>
            <Card>
              <Title level={4} className="!mb-2 text-gray-900">Payment Breakdown</Title>
              <Text className="text-gray-600 block mb-6">Detailed payment information</Text>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Text className="text-gray-600">Payment Amount</Text>
                    <Text className="font-semibold text-gray-900">${formatAmount(payment.amount)}</Text>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Text className="text-gray-600">Processing Fee</Text>
                    <Text className="text-gray-900">$0.00</Text>
                  </div>
                  
                  <hr className="border-gray-200" />
                  
                  <div className="flex justify-between items-center">
                    <Text className="font-semibold text-gray-900">Total Paid</Text>
                    <Text className="font-bold text-lg text-gray-900">${formatAmount(payment.amount)}</Text>
                  </div>

                  {booking && (
                    <>
                      <div className="flex justify-between items-center">
                        <Text className="text-gray-600">Total Booking Amount</Text>
                        <Text className="text-gray-900">${formatAmount(booking.totalAmount)}</Text>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <Text className="text-gray-600">Remaining Balance</Text>
                        <Text className="font-semibold text-red-600">
                          ${formatAmount(parseFloat(booking.totalAmount) - parseFloat(payment.amount))}
                        </Text>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Passenger Information */}
        {passengers && passengers.length > 0 && (
          <Row gutter={[24, 24]} className="mt-6">
            <Col span={24}>
              <Card>
                <Title level={4} className="!mb-2 text-gray-900">Passenger Information</Title>
                <Text className="text-gray-600 block mb-6">Details about passengers on this booking</Text>

                <div className="space-y-4">
                  {passengers.map((passenger: any, index: number) => (
                    <div key={passenger.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <UserOutlined className="text-gray-500" />
                      </div>
                      
                      <div className="flex-1">
                        <Text className="font-semibold text-gray-900 block">
                          {passenger.title} {passenger.firstName} {passenger.lastName}
                        </Text>
                        <Text className="text-gray-600 text-sm block">
                          {passenger.nationality} • Born {formatDate(passenger.dateOfBirth)}
                        </Text>
                        {passenger.passportNumber && (
                          <Text className="text-gray-600 text-sm block">
                            Passport: {passenger.passportNumber}
                          </Text>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
}
