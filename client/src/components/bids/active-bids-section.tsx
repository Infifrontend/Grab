
import { useState } from 'react';
import { Card, Typography, Button, Tag, Space, Spin } from 'antd';
import { EyeOutlined, CalendarOutlined, UserOutlined, DollarOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { apiRequest } from "@/lib/queryClient";

const { Title, Text } = Typography;

interface BidData {
  id: number;
  bidAmount: string;
  passengerCount: number;
  bidStatus: string;
  validUntil: string;
  createdAt: string;
  notes?: string;
  flight?: {
    origin: string;
    destination: string;
  };
}

export default function ActiveBidsSection() {
  const [, setLocation] = useLocation();

  // Fetch active bids data
  const { data: activeBidsData = [], isLoading } = useQuery({
    queryKey: ['active-bids'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/bids');
      const allBids = await response.json();
      
      // Filter only active bids and format the data
      return allBids.filter((bid: BidData) => bid.bidStatus === 'active');
    },
  });

  const formatBidData = (bid: BidData) => {
    let configData: any = {};
    let title = 'Group Travel Bid';
    let route = 'Route not specified';
    
    try {
      if (bid.notes) {
        configData = JSON.parse(bid.notes);
        if (configData.title) {
          title = configData.title;
        }
        if (configData.origin && configData.destination) {
          route = `${configData.origin} → ${configData.destination}`;
        }
      }
    } catch (e) {
      // Use defaults if parsing fails
    }

    // If no config data, try to use flight data
    if (bid.flight && route === 'Route not specified') {
      route = `${bid.flight.origin} → ${bid.flight.destination}`;
    }

    return {
      ...bid,
      title,
      route,
      configData
    };
  };

  const getTimeRemaining = (validUntil: string) => {
    const now = new Date();
    const endDate = new Date(validUntil);
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'Expired';
    if (diffDays === 1) return '1 day left';
    return `${diffDays} days left`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'processing';
      case 'pending':
        return 'warning';
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleViewDetails = (bidId: number) => {
    setLocation(`/bid-details/${bidId}`);
  };

  if (isLoading) {
    return (
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <Spin size="large" />
            <Text className="block mt-4 text-gray-600">Loading active bids...</Text>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gradient-to-br from-blue-600 to-blue-800">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-8">
          <Title level={2} className="!text-white !mb-2">
            Active Bids
          </Title>
          <Text className="text-blue-100 text-lg">
            Track your current bidding activity
          </Text>
        </div>

        {activeBidsData.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
              <DollarOutlined className="text-4xl text-white/70 mb-4" />
              <Title level={4} className="!text-white !mb-2">
                No Active Bids
              </Title>
              <Text className="text-blue-100 mb-6">
                You don't have any active bids at the moment. Start bidding to see your activity here.
              </Text>
              <Button 
                type="primary" 
                size="large"
                className="bg-white text-blue-600 border-none hover:bg-gray-100"
                onClick={() => setLocation('/bids')}
              >
                Browse Available Bids
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeBidsData.slice(0, 6).map((bid) => {
              const formattedBid = formatBidData(bid);
              const timeRemaining = getTimeRemaining(bid.validUntil);
              const isExpiringSoon = timeRemaining.includes('1 day') || timeRemaining.includes('Expired');

              return (
                <Card 
                  key={bid.id}
                  className="bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  bodyStyle={{ padding: '20px' }}
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <Title level={5} className="!mb-1 text-gray-900">
                          {formattedBid.title}
                        </Title>
                        <Text className="text-gray-600 text-sm">
                          {formattedBid.route}
                        </Text>
                      </div>
                      <Tag color={getStatusColor(bid.bidStatus)} className="capitalize">
                        {bid.bidStatus}
                      </Tag>
                    </div>

                    {/* Passenger Count */}
                    <div className="flex items-center gap-2">
                      <UserOutlined className="text-gray-400" />
                      <Text className="text-gray-600 text-sm">
                        {bid.passengerCount} passenger{bid.passengerCount > 1 ? 's' : ''}
                      </Text>
                    </div>

                    {/* Bid Amount and Payment Status */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Text className="text-gray-500 text-xs block mb-1">💰 Bid Amount</Text>
                        <Title level={5} className="!mb-0 text-green-600">
                          ${bid.bidAmount}
                        </Title>
                        <Text className="text-gray-400 text-xs">
                          Min: ${Math.round(parseFloat(bid.bidAmount) * 0.75)}
                        </Text>
                      </div>
                      <div>
                        <Text className="text-gray-500 text-xs block mb-1">💳 Payment</Text>
                        <Text className="text-green-600 font-semibold">
                          Deposit Paid
                        </Text>
                        <Text className="text-gray-600 text-xs">
                          ${Math.round(parseFloat(bid.bidAmount) * 0.1 * bid.passengerCount)}
                        </Text>
                      </div>
                    </div>

                    {/* Date and Time Remaining */}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-1">
                        <CalendarOutlined className="text-gray-400 text-xs" />
                        <Text className="text-gray-500 text-xs">
                          {new Date(bid.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </Text>
                      </div>
                      <Text 
                        className={`text-xs font-medium ${
                          isExpiringSoon ? 'text-red-600' : 'text-blue-600'
                        }`}
                      >
                        {timeRemaining}
                      </Text>
                    </div>

                    {/* View Details Button */}
                    <Button 
                      type="link" 
                      block
                      className="text-blue-600 hover:text-blue-800 font-medium mt-4 p-0 h-auto"
                      onClick={() => handleViewDetails(bid.id)}
                    >
                      View Details
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* View All Bids Link */}
        {activeBidsData.length > 0 && (
          <div className="text-center mt-8">
            <Button 
              type="link" 
              size="large"
              className="text-white hover:text-blue-100 font-medium"
              onClick={() => setLocation('/bids')}
            >
              View All Bids →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
