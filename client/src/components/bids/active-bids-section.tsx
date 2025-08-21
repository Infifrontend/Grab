import { Card, Tag, Button } from "antd";
import { useQuery } from "@tanstack/react-query";
import { Plane, Users, Clock, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
interface ActiveBid {
  id?: number;
  bid_id?: number;
  bidAmount: string;
  validUntil?: string;
  valid_until?: string;
  notes: string;
  totalSeatsAvailable: number;
  minSeatsPerBid: number;
  maxSeatsPerBid: number;
  rStatus: number;
  display_status?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt: string;
  seatAvailability?: {
    paymentStatus: string;
  };
  retailBids?: Array<{
    id: number;
    rUserId: number;
    submittedAmount: string;
    seatBooked: number;
    rStatus: number;
  }>;
}

export default function ActiveBidsSection() {
  const navigate = useNavigate();

  const {
    data: activeBids,
    isLoading,
    error,
  } = useQuery<ActiveBid[]>({
    queryKey: ["/api/bids"],
    queryFn: async () => {
      const fetchBids = async () => {
        try {
          // Get userId from localStorage if available
          const storedUserId =
            localStorage.getItem("userId") ||
            localStorage.getItem("currentUserId");
          const userId =
            localStorage.getItem("isAuthenticated") === "true"
              ? storedUserId
              : null;
          console.log("User ID for fetching bids--------:", userId);
          // Build URL with userId if available
          const url = userId ? `/api/bids?userId=${userId}` : "/api/bids";
          console.log("Fetching bids from URL:", url);
          const response = await fetch(url);
          if (!response.ok) {
            const errorText = await response.text();
            console.error("API error:", errorText);
            throw new Error(`Failed to fetch bids: ${response.status}`);
          }
          const bids = await response.json();
          console.log("Fetched bids:", bids);

          // Since the server now filters for r_status = 4, all returned bids are active/open
          return Array.isArray(bids) ? bids.slice(0, 5) : []; // Show only the 5 most recent active/open bids
        } catch (error) {
          console.error("Error fetching bids:", error);
          throw error;
        }
      };
      return fetchBids();
    },
  });

  const calculateTimeLeft = (validUntil: string | undefined) => {
    if (!validUntil) return "No expiry date";
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
    // First priority: Use display_status from user-specific API response
    if (bid.display_status) {
      switch (bid.display_status.toLowerCase()) {
        case "under review":
          return { status: "Under Review", color: "blue" };
        case "approved":
        case "accepted":
          return { status: "Accepted", color: "green" };
        case "rejected":
          return { status: "Rejected", color: "red" };
        case "closed":
          return { status: "Closed", color: "gray" };
        case "completed":
          return { status: "Completed", color: "green" };
        case "open":
        default:
          return { status: "Open", color: "orange" };
      }
    }

    // Second priority: Check if there are retail bids with payments to determine user-specific status
    if (bid.retailBids && bid.retailBids.length > 0) {
      const currentUser = localStorage.getItem("userId");
      const userBid = bid.retailBids.find(rb => String(rb.rUserId) === currentUser);

      if (userBid) {
        switch (userBid.rStatus) {
          case 1: return { status: "Submitted", color: "blue" };
          case 2: return { status: "Under Review", color: "blue" };
          case 3: return { status: "Accepted", color: "green" };
          case 4: return { status: "Completed", color: "green" };
          case 5: return { status: "Rejected", color: "red" };
          default: return { status: "Open", color: "orange" };
        }
      }
    }

    // Third priority: Check seatAvailability for user-specific status
    if (bid.seatAvailability?.paymentStatus) {
      switch (bid.seatAvailability.paymentStatus) {
        case "under_review":
          return { status: "Under Review", color: "blue" };
        case "approved":
          return { status: "Accepted", color: "green" };
        case "rejected":
          return { status: "Rejected", color: "red" };
        case "closed":
          return { status: "Closed", color: "gray" };
        case "completed":
          return { status: "Completed", color: "green" };
        case "open":
          return { status: "Open", color: "orange" };
        default:
          return { status: "Open", color: "orange" };
      }
    }

    // Default fallback: Show as "Open" when no user-specific status is available
    return { status: "Open", color: "orange" };
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

  if (error) {
    return (
      <div className="deal-card">
        <div className="section-header relative">
          <Tag className="limited-time-badge">Live Bidding</Tag>
          <h2 className="text-xl font-semibold mb-1">Active Bids</h2>
          <p className="text-sm opacity-90">
            Track your current bidding activity
          </p>
        </div>
        <div className="p-6 text-center text-red-500">
          Error loading active bids. Please try again later.
          <div className="text-xs text-gray-500 mt-2">{error.message}</div>
        </div>
      </div>
    );
  }

  if (!activeBids || activeBids.length === 0) {
    return (
      <div className="deal-card">
        <div className="section-header relative flex gap-2 items-center">
          <Tag className="limited-time-badge">Live Bidding</Tag>
          <h2 className="text-xl font-semibold mb-1">Active Bids</h2>-
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
    <div
      className="deal-card"
      style={{ backgroundColor: "var(--infiniti-bg-container)" }}
    >
      {/* Header */}
      <div className="section-header flex gap-2 items-center relative">
        <Tag className="limited-time-badge top-3">Live Bidding</Tag>
        <h2 className="text-xl font-semibold mb-1">Active Bids</h2> -
        <p className="text-sm opacity-90">
          Current open and active group travel bids
        </p>
      </div>

      {/* Active Bids Content */}
      <div className="p-6 bg-gray-200">
        {activeBids.map((bid, index) => {
          const bidId = bid.id || bid.bid_id;
          const timeLeft = calculateTimeLeft(bid.validUntil || bid.valid_until);
          const bidTitle = getBidTitle(bid);
          const statusInfo = getBidStatusInfo(bid);
          const createdDate = new Date(bid.createdAt || bid.created_at).toLocaleDateString(
            "en-GB",
            { day: "2-digit", month: "short", year: "numeric" },
          );

          return (
            <div
              key={bidId}
              className={`p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-300 ${
                activeBids.length !== index + 1 ? "mb-4" : ""
              }`}
            >
              {/* Header Row */}
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h3
                    className="font-semibold text-gray-900"
                    style={{ fontSize: "1.15rem" }}
                  >
                    {bidTitle}
                  </h3>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                      <Plane className="w-4 h-4" />
                      <span>
                        {(() => {
                          try {
                            const configData = bid.notes ? JSON.parse(bid.notes) : {};
                            const origin =
                              configData.origin ||
                              bid.flight?.origin ||
                              "Unknown";
                            const destination =
                              configData.destination ||
                              bid.flight?.destination ||
                              "Unknown";
                            return `${origin} → ${destination}`;
                          } catch (e) {
                            return "Unknown → Unknown";
                          }
                        })()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                      <Users className="w-4 h-4" />
                      <span>
                        {bid.minSeatsPerBid}-{bid.maxSeatsPerBid} seats
                        available
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <Tag color={statusInfo.color} className="text-xs">
                    {statusInfo.status}
                  </Tag>
                  <div className="flex items-center gap-1 text-blue-600 text-sm">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs">{timeLeft}</span>
                  </div>
                </div>
              </div>

              {/* Bid Details Row */}
              <div className="grid grid-cols-4 gap-4 mb-3 items-center">
                <div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">Bid Amount</span>
                  </div>
                  <div className="font-bold text-lg text-green-600">
                    ${bid.bidAmount}
                  </div>
                  <div className="text-xs text-gray-500">Min: $750</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                    <span>💳</span>
                    <span className="text-sm">Payment</span>
                  </div>
                  <div className="font-semibold text-green-600">
                    Deposit Paid
                  </div>
                  <div className="text-xs text-gray-500">$2,125</div>
                </div>
                {/* Footer Row */}
                {/* <div className="flex justify-between items-center pt-3 border-t border-gray-100"> */}
                <div className="text-sm text-gray-500">{createdDate}</div>
                <div className="flex items-center gap-4">
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/bid-details/${bidId}`);
                    }}
                    type="default"
                  >
                    View Details
                  </Button>
                </div>
                {/* </div> */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}