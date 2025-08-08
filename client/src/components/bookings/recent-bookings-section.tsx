import { Table, Tag, Button, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import type { Booking } from "@shared/schema";
import type { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";

const { Title, Text } = Typography;
export default function RecentBookingsSection() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const userToken = localStorage.getItem("userToken");
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      const userData = localStorage.getItem("userData");
      
      setIsAuthenticated(!!(userToken || isLoggedIn || userData));
    };
    
    checkAuth();
    
    const handleStorageChange = () => checkAuth();
    window.addEventListener("storage", handleStorageChange);
    
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const { data: flightBookings, isLoading } = useQuery({
    queryKey: ["/api/recent-flight-bookings"],
    enabled: isAuthenticated, // Only fetch if authenticated
  });

  // Sort and limit to last 3 bookings based on creation date
  const recentFlightBookings = flightBookings?.slice()
    .sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt || a.bookedAt || 0);
      const dateB = new Date(b.createdAt || b.bookedAt || 0);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 3) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "success";
      case "cancelled":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusClassName = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-green-600 font-semibold";
      case "cancelled":
        return "text-red-600 font-semibold";
      case "pending":
        return "text-orange-600 font-semibold";
      default:
        return "text-gray-600";
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: "PNR",
      dataIndex: "pnr",
      key: "pnr",
      className: "font-medium",
      render: (text) => (
        <span className="font-semibold text-[var(--infiniti-primary)]">
          {text}
        </span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => amount ? `$${parseFloat(amount).toLocaleString()}` : 'N/A',
    },
    {
      title: "Date",
      dataIndex: "bookedAt",
      key: "bookedAt",
      render: (date) => {
        if (!date) return 'N/A';
        try {
          const dateObj = new Date(date);
          if (isNaN(dateObj.getTime())) {
            return 'Invalid Date';
          }
          return format(dateObj, "MMM dd, yyyy");
        } catch (error) {
          console.error('Error formatting date:', date, error);
          return 'Invalid Date';
        }
      },
    },
    {
      title: "Passengers",
      dataIndex: "passengerCount",
      key: "passengerCount",
      render: (count) => `${count} passengers`,
    },
    {
      title: "Status",
      dataIndex: "bookingStatus",
      key: "bookingStatus",
      render: (status) => (
        <span className={`${getStatusClassName(status)} capitalize`}>
          {status}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <a
          className="text-[var(--infiniti-primary)] font-medium hover:underline"
          onClick={(e) => {
            e.preventDefault();
            navigate(`/booking-details/${record.pnr}`);
          }}
        >
          View Details
        </a>
      ),
    },
  ];

  // Don't render anything if user is not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="deal-card">
      {/* Header */}
      <div className="section-header">
        <h2 className="text-xl font-semibold mb-1">Recent Bookings</h2>
        <p className="text-sm opacity-90">
          View your latest group travel bookings
        </p>
      </div>

      <div className="p-6">
        <Table
          columns={columns}
          dataSource={recentFlightBookings}
          loading={isLoading}
          rowKey="id"
          pagination={false}
          size="middle"
          className="w-full"
        />
      </div>
    </div>
  );
}