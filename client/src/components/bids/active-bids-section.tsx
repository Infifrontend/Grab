
import { Card, Tag, Button, Table, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import { Plane, Users, Clock, DollarSign, Eye } from "lucide-react";
import { useLocation } from "wouter";

const { Text } = Typography;

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

      // Filter for completed, expired, or historical bids and limit to recent ones
      return bids
        .filter((bid: ActiveBid) => 
          bid.bidStatus === "completed" || 
          bid.bidStatus === "expired" || 
          bid.bidStatus === "cancelled" ||
          new Date(bid.validUntil) < new Date()
        )
        .sort((a: ActiveBid, b: ActiveBid) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
        .slice(0, 5); // Show only the 5 most recent previous bids
    },
  });

  const calculateTimeLeft = (validUntil: string) => {
    const now = new Date();
    const expiry = new Date(validUntil);
    const diff = expiry.getTime() - now.getTime();

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    return "<1h";
  };

  const getBidTitle = (bid: ActiveBid) => {
    try {
      const notes = bid.notes ? JSON.parse(bid.notes) : {};
      return notes.title || notes.bidTitle || "Corporate Team Building";
    } catch (e) {
      return "Corporate Team Building";
    }
  };

  const getPaymentStatus = (bid: ActiveBid) => {
    try {
      const notes = bid.notes ? JSON.parse(bid.notes) : {};
      if (notes.paymentInfo?.paymentStatus === "Paid") {
        return { status: "Deposit Paid", color: "green" };
      }
      return { status: "Pending", color: "orange" };
    } catch (e) {
      return { status: "Pending", color: "orange" };
    }
  };

  // Transform data for Ant Design Table
  const tableData = activeBids?.map((bid) => {
    const timeLeft = calculateTimeLeft(bid.validUntil);
    const bidTitle = getBidTitle(bid);
    const paymentStatus = getPaymentStatus(bid);
    const createdDate = new Date(bid.createdAt).toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
    const completedDate = new Date(bid.updatedAt).toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });

    return {
      key: bid.id,
      id: bid.id,
      bidTitle,
      route: `${bid.flight?.origin || "NYC"} → ${bid.flight?.destination || "LAS"}`,
      passengers: bid.passengerCount,
      bidAmount: `$${bid.bidAmount}`,
      paymentStatus: paymentStatus.status,
      paymentColor: paymentStatus.color,
      timeLeft: bid.bidStatus === "completed" ? "Completed" : 
                bid.bidStatus === "expired" ? "Expired" : 
                bid.bidStatus === "cancelled" ? "Cancelled" : timeLeft,
      createdDate,
      completedDate,
      status: bid.bidStatus,
    };
  }) || [];

  const columns = [
    {
      title: 'Bid Details',
      dataIndex: 'bidTitle',
      key: 'bidTitle',
      render: (title: string, record: any) => (
        <div>
          <Text strong className="text-gray-900">{title}</Text>
          <br />
          <div className="flex items-center gap-1 text-gray-600 text-xs mt-1">
            <Plane className="w-3 h-3" />
            <span>{record.route}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Passengers',
      dataIndex: 'passengers',
      key: 'passengers',
      render: (passengers: number) => (
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4 text-gray-600" />
          <span>{passengers}</span>
        </div>
      ),
    },
    {
      title: 'Bid Amount',
      dataIndex: 'bidAmount',
      key: 'bidAmount',
      render: (amount: string) => (
        <div>
          <div className="font-bold text-green-600">{amount}</div>
          <div className="text-xs text-gray-500">Min: $750</div>
        </div>
      ),
    },
    {
      title: 'Payment',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status: string, record: any) => (
        <div>
          <Tag color={record.paymentColor} className="text-xs mb-1">
            {status}
          </Tag>
          <br />
          <div className="text-xs text-gray-500">$2,125</div>
        </div>
      ),
    },
    {
      title: 'Final Status',
      dataIndex: 'timeLeft',
      key: 'finalStatus',
      render: (timeLeft: string, record: any) => {
        const getStatusColor = (status: string) => {
          switch (status) {
            case "Completed": return "text-green-600";
            case "Expired": return "text-red-600";
            case "Cancelled": return "text-gray-600";
            default: return "text-blue-600";
          }
        };
        
        return (
          <div className={`flex items-center gap-1 text-sm ${getStatusColor(timeLeft)}`}>
            <Clock className="w-4 h-4" />
            <span>{timeLeft}</span>
          </div>
        );
      },
    },
    {
      title: 'Completed',
      dataIndex: 'completedDate',
      key: 'completedDate',
      render: (date: string) => (
        <Text className="text-gray-500 text-sm">{date}</Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Button
          type="link"
          size="small"
          icon={<Eye className="w-4 h-4" />}
          onClick={() => setLocation(`/bid-details/${record.id}`)}
          className="text-blue-600 hover:text-blue-800"
        >
          View Details
        </Button>
      ),
    },
  ];

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
          <Tag className="limited-time-badge">Recent History</Tag>
          <h2 className="text-xl font-semibold mb-1">Previous Bids</h2>
          <p className="text-sm opacity-90">
            Track your recent bidding activity
          </p>
        </div>
        <div className="p-6 text-center text-gray-500">
          No previous bids available at the moment
        </div>
      </div>
    );
  }

  return (
    <div className="deal-card">
      {/* Header */}
      <div className="section-header relative">
        <Tag className="limited-time-badge">Recent History</Tag>
        <h2 className="text-xl font-semibold mb-1">Previous Bids</h2>
        <p className="text-sm opacity-90">
          Recent bidding activity and completed requests
        </p>
      </div>

      {/* Active Bids Table */}
      <div className="p-6">
        <Table
          columns={columns}
          dataSource={tableData}
          pagination={false}
          size="small"
          className="custom-active-bids-table"
          scroll={{ x: 800 }}
        />
      </div>

      <style jsx>{`
        .custom-active-bids-table .ant-table {
          border-radius: 8px;
          overflow: hidden;
        }
        
        .custom-active-bids-table .ant-table-thead > tr > th {
          background-color: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          font-weight: 600;
          color: #374151;
          padding: 12px 16px;
        }
        
        .custom-active-bids-table .ant-table-tbody > tr > td {
          padding: 16px;
          border-bottom: 1px solid #f1f5f9;
        }
        
        .custom-active-bids-table .ant-table-tbody > tr:hover > td {
          background-color: #f8fafc;
        }
        
        .custom-active-bids-table .ant-table-tbody > tr:last-child > td {
          border-bottom: none;
        }
      `}</style>
    </div>
  );
}
