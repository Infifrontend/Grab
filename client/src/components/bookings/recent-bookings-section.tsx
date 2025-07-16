import { Table, Tag } from "antd";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import type { Booking } from "@shared/schema";
import type { ColumnsType } from "antd/es/table";
import { useLocation } from "wouter";

export default function RecentBookingsSection() {
  const { data: flightBookings, isLoading } = useQuery({
    queryKey: ["/api/flight-bookings"],
  });
  const [, setLocation] = useLocation();

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
      title: "Booking Reference",
      dataIndex: "bookingReference",
      key: "bookingReference",
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
      render: (amount) => amount ? `₹${parseFloat(amount).toLocaleString()}` : 'N/A',
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => {
        if (!date) return 'N/A';
        try {
          return format(new Date(date), "MMM dd, yyyy");
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
          href="#"
          className="text-[var(--infiniti-primary)] font-medium hover:underline"
          onClick={(e) => {
            e.preventDefault();
            setLocation(`/booking-details/${record.bookingReference}`);
          }}
        >
          View Details
        </a>
      ),
    },
  ];

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
          dataSource={flightBookings?.slice(0, 5) || []}
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
