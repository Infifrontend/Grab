
import { Card, Rate, Tag, Button } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { Plane, Users, CheckCircle, Clock } from 'lucide-react';
import { SearchOutlined } from "@ant-design/icons";
import { useLocation } from 'wouter';

interface ActiveBid {
  id: number;
  title: string;
  origin: string;
  destination: string;
  bidAmount: number;
  originalPrice: number;
  passengers: number;
  departureDate: string;
  returnDate?: string;
  status: string;
  rating: string;
  availableSeats: number;
  isUrgent?: boolean;
  timeRemaining: string;
}

export default function ActiveBidsSection() {
  const [, setLocation] = useLocation();
  
  const { data: activeBids, isLoading } = useQuery<ActiveBid[]>({
    queryKey: ['/api/active-bids'],
    queryFn: async () => {
      // Mock data for now - replace with actual API call when endpoint is available
      return [
        {
          id: 1,
          title: "Urgent Bid",
          origin: "New York",
          destination: "Los Angeles",
          bidAmount: 299,
          originalPrice: 450,
          passengers: 8,
          departureDate: "2024-02-15",
          returnDate: "2024-02-22",
          status: "Active",
          rating: "4.8",
          availableSeats: 12,
          isUrgent: true,
          timeRemaining: "2 days left"
        },
        {
          id: 2,
          title: "Group Bid",
          origin: "Chicago",
          destination: "Miami",
          bidAmount: 189,
          originalPrice: 320,
          passengers: 15,
          departureDate: "2024-03-10",
          returnDate: "2024-03-17",
          status: "Active",
          rating: "4.6",
          availableSeats: 20,
          isUrgent: false,
          timeRemaining: "5 days left"
        }
      ];
    },
  });

  if (isLoading) {
    return (
      <Card className="h-fit">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="deal-card">
      {/* Header */}
      <div className="section-header relative">
        <Tag className="limited-time-badge">Live Bidding</Tag>
        <h2 className="text-xl font-semibold mb-1">Active Bids</h2>
        <p className="text-sm opacity-90">Current group travel bids awaiting acceptance</p>
      </div>

      {/* Active Bids Content */}
      <div className="p-6">
        {activeBids?.map((bid, index) => (
          <div
            key={bid.id}
            className={`space-y-1 p-4 bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-shadow duration-300 ${
              activeBids?.length !== index + 1 ? "mb-6" : ""
            }`}
          >
            {/* Urgent Banner */}
            {bid.isUrgent && (
              <div className="flash-sale-banner">{bid.title}</div>
            )}

            {/* Bid Status Badge */}
            <div className="discount-badge">
              🔥 ${bid.originalPrice - bid.bidAmount} SAVINGS
            </div>

            {/* Route Display */}
            <div className="route-display">
              <Plane className="w-5 h-5 text-[var(--infiniti-primary)]" />
              <span>{bid.origin}</span>
              <span className="text-[var(--infiniti-primary)]">→</span>
              <span>{bid.destination}</span>
            </div>

            {/* Pricing and Rating */}
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="original-price">${bid.originalPrice}</div>
                <div className="discounted-price">${bid.bidAmount}</div>
                <div className="text-xs text-gray-500">bid amount</div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <Rate
                    disabled
                    defaultValue={parseFloat(bid.rating)}
                    className="text-sm"
                  />
                  <span className="font-semibold text-gray-800">
                    {bid.rating}
                  </span>
                </div>
                <div className="text-xs text-gray-500">Bid Rating</div>
              </div>
            </div>

            {/* Bid Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group-size-item">
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                  <Users className="w-4 h-4" />
                  <span>Passengers</span>
                </div>
                <div className="font-semibold text-gray-800">
                  {bid.passengers} pax
                </div>
              </div>

              <div className="availability-item">
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                  <Clock className="w-4 h-4" />
                  <span>Time Remaining</span>
                </div>
                <div className="font-semibold text-gray-800">
                  {bid.timeRemaining}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button 
                block 
                size="large" 
                className="mt-5"
                onClick={() => setLocation(`/bid-details/${bid.id}`)}
              >
                View Bid Details
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SearchOutlined />}
                size="large"
                className="w-full infiniti-btn-primary mt-5"
              >
                Accept Bid
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
