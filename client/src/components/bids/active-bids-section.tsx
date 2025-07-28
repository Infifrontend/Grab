import { Card, Tag, Button } from "antd";
import { useQuery } from "@tanstack/react-query";
import { Plane, Users, Clock, DollarSign } from "lucide-react";
import { useLocation } from "wouter";

interface ActiveBid {
  id: number;
  userId: number;
  flightId: number;
  bidAmount: string;
  passengerCount: number;
  bidStatus: string;
  validUntil: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  flight?: {
    id: number;
    flightNumber: string;
    airline: string;
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    price: string;
  };
}

export default function ActiveBidsSection() {
  const [, setLocation] = useLocation();

  const { data: activeBids, isLoading } = useQuery<ActiveBid[]>({
    queryKey: ["/api/bids"],
    queryFn: async () => {
      const response = await fetch("/api/bids");
      if (!response.ok) {
        throw new Error("Failed to fetch bids");
      }
      const bids = await response.json();

      // Show only active bids, limit to recent ones
      return bids
        .filter((bid: ActiveBid) => bid.bidStatus === "active")
        .slice(0, 5); // Show only the 5 most recent active bids
    },
  });

  const calculateTimeLeft = (validUntil: string) => {
    const now = new Date();
    const expiry = new Date(validUntil);
    const diff = expiry.getTime() - now.getTime();

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} left`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} left`;
    return "Less than 1 hour left";
  };

  const getBidTitle = (bid: ActiveBid) => {
    try {
      const notes = bid.notes ? JSON.parse(bid.notes) : {};
      return notes.title || notes.bidTitle || "Corporate Team Building";
    } catch (e) {
      return "Corporate Team Building";
    }
  };

  const getBidStatusInfo = (bid: ActiveBid) => {
    // Check bid status first for different states
    switch (bid.bidStatus) {
      case 'completed':
        // For completed bids, check if payment is actually completed
        try {
          const notes = bid.notes ? JSON.parse(bid.notes) : {};
          if (notes.paymentInfo?.paymentCompleted === true) {
            return { status: "Payment Completed", color: "green" };
          } else {
            return { status: "Awaiting Payment", color: "orange" };
          }
        } catch (e) {
          return { status: "Under Review", color: "orange" };
        }
      case 'accepted':
        return { status: "Accepted", color: "green" };
      case 'rejected':
        return { status: "Declined", color: "red" };
      case 'expired':
        return { status: "Expired", color: "default" };
      case 'pending':
        return { status: "Under Review", color: "blue" };
      case 'active':
        // For active bids, check payment status
        try {
          const notes = bid.notes ? JSON.parse(bid.notes) : {};
          if (notes.paymentInfo?.paymentCompleted === true) {
            return { status: "Payment Completed", color: "green" };
          } else if (notes.paymentInfo?.paymentStatus === "Paid") {
            return { status: "Deposit Paid", color: "blue" };
          }
          return { status: "Open", color: "orange" };
        } catch (e) {
          return { status: "Open", color: "orange" };
        }
      default:
        return { status: "Pending", color: "orange" };
    }
  };

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

  if (!activeBids || activeBids.length === 0) {
    return (
      <div className="deal-card">
        <div className="section-header relative">
          <Tag className="limited-time-badge">Live Bidding</Tag>
          <h2 className="text-xl font-semibold mb-1">Active Bids</h2>
          <p className="text-sm opacity-90">
            Track your current bidding activity
          </p>
        </div>
        <div className="p-6 text-center text-gray-500">
          No active bids available at the moment
        </div>
      </div>
    );
  }

  return (
    <div className="deal-card">
      {/* Header */}
      <div className="section-header relative">
        <Tag className="limited-time-badge">Live Bidding</Tag>
        <h2 className="text-xl font-semibold mb-1">Active Bids</h2>
        <p className="text-sm opacity-90">
          Current group travel bids awaiting acceptance
        </p>
      </div>

      {/* Active Bids Content */}
      <div className="p-6">
        {activeBids.map((bid, index) => {
          const timeLeft = calculateTimeLeft(bid.validUntil);
          const bidTitle = getBidTitle(bid);
          const statusInfo = getBidStatusInfo(bid);
          const createdDate = new Date(bid.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

          return (
            <div
              key={bid.id}
              className={`p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-300 ${
                activeBids.length !== index + 1 ? "mb-4" : ""
              }`}
            >
              {/* Header Row */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 text-base">
                    {bidTitle}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                    <Plane className="w-4 h-4" />
                    <span>
                      {bid.flight?.origin || "New York"} →{" "}
                      {bid.flight?.destination || "Las Vegas"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                    <Users className="w-4 h-4" />
                    <span>{bid.passengerCount} passengers</span>
                  </div>
                </div>
                <Tag color={statusInfo.color} className="text-xs">
                  {statusInfo.status}
                </Tag>
              </div>

              {/* Bid Details Row */}
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span>Bid Amount</span>
                  </div>
                  <div className="font-bold text-lg text-green-600">
                    ${bid.bidAmount}
                  </div>
                  <div className="text-xs text-gray-500">Min: $750</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                    <span>💳</span>
                    <span>Payment</span>
                  </div>
                  <div className="font-semibold text-green-600">
                    Deposit Paid
                  </div>
                  <div className="text-xs text-gray-500">$2,125</div>
                </div>
              </div>

              {/* Footer Row */}
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <div className="text-sm text-gray-500">{createdDate}</div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-blue-600 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{timeLeft}</span>
                  </div>
                  <a
                    href={`/bid-details/${bid.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setLocation(`/bid-details/${bid.id}`);
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium underline cursor-pointer"
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}