import { Table, Tag } from "antd";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import type { Booking } from "@shared/schema";
import type { ColumnsType } from "antd/es/table";
import { useLocation } from "wouter";

export default function RecentBookingsSection() {
  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
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
        return "status-confirmed";
      case "cancelled":
        return "status-cancelled";
      case "pending":
        return "status-pending";
      default:
        return "";
    }
  };

  const columns: ColumnsType<Booking> = [
    {
      title: "Booking ID",
      dataIndex: "bookingId",
      key: "bookingId",
      render: (text) => (
        <span className="font-semibold text-[var(--infiniti-primary)]">
          {text}
        </span>
      ),
    },
    {
      title: "Route",
      dataIndex: "route",
      key: "route",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => format(new Date(date), "MMM dd, yyyy"),
    },
    {
      title: "Passengers",
      dataIndex: "passengers",
      key: "passengers",
      render: (passengers) => `${passengers} passengers`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
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
            setLocation(`/manage-booking/${2}`);
            console.log("Manage booking:", record.id);
          }}
        >
          Manage booking
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
          dataSource={bookings}
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
