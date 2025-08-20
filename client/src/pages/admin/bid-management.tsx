import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  Tabs,
  Row,
  Col,
  Statistic,
  Button,
  Typography,
  Space,
  Badge,
  Timeline,
  Progress,
  Breadcrumb,
  Avatar,
  Dropdown,
  MenuProps,
  Table,
  Tag,
  Input,
  Select,
  DatePicker,
  Modal,
  Form,
  InputNumber,
  Switch,
  Steps,
  TimePicker,
  Radio,
  Checkbox,
  Divider,
  Spin,
  message,
} from "antd";
import {
  DashboardOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  HistoryOutlined,
  CreditCardOutlined,
  PlusOutlined,
  EyeOutlined,
  BarChartOutlined,
  RiseOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  BellOutlined,
  HomeOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  InfoCircleOutlined,
  DollarOutlined,
  AlertOutlined,
  EnvironmentOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import BreadcrumbNav from "@/components/breadcrumb/breadcrumb";
import dayjs from "dayjs";
const { Title, Text } = Typography;

export default function BidManagement() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("1");
  const [createBidModalVisible, setCreateBidModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [originOptions, setOriginOptions] = useState<string[]>([]);
  const [destinationOptions, setDestinationOptions] = useState<string[]>([]);
  const [bidConfigurations, setBidConfigurations] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  // Fetch unique flight locations for autocomplete
  const { data: locationsData } = useQuery({
    queryKey: ["flight-locations"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/flight-locations");
      return response.json();
    },
  });

  // Fetch bid configurations
  const { data: bidsData, refetch: refetchBids } = useQuery({
    queryKey: ["bid-configurations"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/bid-configurations-list");
      return response.json();
    },
  });

  // Fetch recent bids for activity display
  const { data: recentBidsData } = useQuery({
    queryKey: ["recent-bids"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/bids");
      return response.json();
    },
  });

  useEffect(() => {
    // Check if admin is logged in
    const isAdminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isAdminLoggedIn) {
      navigate("/admin/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (locationsData?.locations) {
      setOriginOptions(locationsData.locations);
      setDestinationOptions(locationsData.locations);
    }
  }, [locationsData]);

  useEffect(() => {
    if (bidsData) {
      setBidConfigurations(bidsData);
    }
  }, [bidsData]);

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminUsername");
    navigate("/admin/login");
  };

  // User dropdown menu
  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: "Profile",
      icon: <UserOutlined />,
    },
    {
      key: "settings",
      label: "Settings",
      icon: <SettingOutlined />,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  // Generate recent activities from actual bids data
  const recentActivities = (recentBidsData || [])
    .slice(0, 5)
    .map((bid, index) => {
      let configData = {};
      let isConfiguration = false;

      try {
        if (bid.notes) {
          configData = JSON.parse(bid.notes);
          isConfiguration = configData.configType === "bid_configuration";
        }
      } catch (e) {
        configData = {};
      }

      const timeAgo = bid.createdAt
        ? getTimeAgo(new Date(bid.createdAt))
        : "Recently";

      let title, route, activityType, color;

      if (isConfiguration) {
        title = configData.title || `Bid Configuration #${bid.id}`;
        route =
          configData.origin && configData.destination
            ? `${configData.origin} → ${configData.destination}`
            : "Route not specified";
        activityType = "Bid configuration created";
        color = "var(--infiniti-lighter-blue)";
      } else {
        // Regular bid activity
        title = `Bid #${bid.id}`;
        route = bid.flight
          ? `${bid.flight.origin} → ${bid.flight.destination}`
          : "Route not specified";
        activityType =
          bid.bidStatus === "active"
            ? "Active bid submitted"
            : bid.bidStatus === "accepted"
              ? "Bid accepted"
              : bid.bidStatus === "rejected"
                ? "Bid declined"
                : "Bid created";
        color =
          bid.bidStatus === "active"
            ? "var(--ant-color-success)"
            : bid.bidStatus === "accepted"
              ? "var(--infiniti-lighter-green)"
              : bid.bidStatus === "rejected"
                ? "var(--ant-color-error)"
                : "var(--infiniti-lighter-blue)";
      }

      return {
        type: bid.bidStatus,
        color: color,
        title: `${activityType}: ${title} (${route})`,
        time: timeAgo,
        amount: bid.bidAmount ? `$${bid.bidAmount}` : null,
      };
    });

  // Helper function to calculate time ago
  function getTimeAgo(date) {
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      return `${diffInDays} days ago`;
    }
  }

  // Helper function to calculate time left until bid expires
  function calculateTimeLeft(expiryDate) {
    const now = new Date();
    const diffInMs = expiryDate - now;

    if (diffInMs <= 0) {
      return "Expired";
    }

    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays > 0) {
      return `${diffInDays}d ${diffInHours % 24}h`;
    } else if (diffInHours > 0) {
      return `${diffInHours}h ${diffInMinutes % 60}m`;
    } else {
      return `${diffInMinutes}m`;
    }
  }

  const handleCreateBid = () => {
    setCreateBidModalVisible(true);
    setCurrentStep(0);
    form.resetFields();
  };

  const handleModalCancel = () => {
    setCreateBidModalVisible(false);
    setCurrentStep(0);
    form.resetFields();
  };

  const handleNext = async () => {
    // Validate current step before moving to next
    try {
      if (currentStep === 0) {
        // Validate step 1 fields
        await form.validateFields(["bidTitle", "origin", "destination"]);
      }
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.log("Validation failed:", error);
      // Form validation will show the error messages automatically
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      console.log("Form values from handleFinish:", values);

      // Get ALL current form values to ensure we have complete data
      const allFormValues = form.getFieldsValue(true); // Get all fields including empty ones
      console.log("All form values:", allFormValues);

      // Merge with current values, giving priority to handleFinish values
      const finalValues = { ...allFormValues, ...values };
      console.log("Final merged values:", finalValues);

      // Validate required fields with final values
      const errors = [];

      if (
        !finalValues.bidTitle ||
        (typeof finalValues.bidTitle === "string" &&
          finalValues.bidTitle.trim() === "")
      ) {
        errors.push("Bid title is required");
      }

      if (
        !finalValues.origin ||
        (typeof finalValues.origin === "string" &&
          finalValues.origin.trim() === "")
      ) {
        errors.push("Origin airport is required");
      }

      if (
        !finalValues.destination ||
        (typeof finalValues.destination === "string" &&
          finalValues.destination.trim() === "")
      ) {
        errors.push("Destination airport is required");
      }

      // Show all validation errors at once
      if (errors.length > 0) {
        errors.forEach((error) => message.error(error));
        setLoading(false);
        return;
      }

      // Format the data properly using final values
      const formattedData = {
        ...finalValues,
        bidTitle: finalValues.bidTitle ? finalValues.bidTitle.trim() : "",
        origin: finalValues.origin ? finalValues.origin.trim() : "",
        destination: finalValues.destination
          ? finalValues.destination.trim()
          : "",

        travelDate: finalValues.travelDate
          ? finalValues.travelDate.format("YYYY-MM-DD")
          : null,
        bidStartTime: finalValues.bidStartTime
          ? finalValues.bidStartTime.toISOString()
          : null,
        bidEndTime: finalValues.bidEndTime
          ? finalValues.bidEndTime.toISOString()
          : null,
        departureTimeRange: finalValues.departureTimeRange
          ? finalValues.departureTimeRange
              .map((time) => time.format("HH:mm"))
              .join(" - ")
          : null,
      };

      console.log("Formatted data for submission:", formattedData);

      const response = await apiRequest(
        "POST",
        "/api/bid-configurations",
        formattedData,
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API response error:", errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log("API response result:", result);

      if (result.success) {
        // Show success message
        message.success(
          result.message ||
            `Bid configuration "${
              finalValues.bidTitle || "New Bid"
            }" created successfully!`,
        );

        // Refetch bid configurations and recent bids to update the Recent Bid Activity
        refetchBids();

        // Also refetch recent bids data
        queryClient.invalidateQueries(["recent-bids"]);

        // Close modal and reset form
        setCreateBidModalVisible(false);
        setCurrentStep(0);
        form.resetFields();
      } else {
        console.error("API returned error:", result);
        message.error(result.message || "Failed to create bid configuration");
      }
    } catch (error) {
      console.error("Error creating bid configuration:", error);

      // Show more specific error message
      let errorMessage =
        "Failed to create bid configuration. Please try again.";
      if (error.message) {
        if (error.message.includes("fetch")) {
          errorMessage =
            "Network error. Please check your connection and try again.";
        } else if (error.message.includes("API Error")) {
          errorMessage = "Server error. Please try again or contact support.";
        } else {
          errorMessage = error.message;
        }
      }

      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "Flight & Route Details",
      content: "flight-details",
    },
    {
      title: "Seat Configurations & Limits",
      content: "seat-config",
    },
    {
      title: "Bid Pricing & Currency",
      content: "pricing",
    },
    {
      title: "Bidding Schedule & Rules",
      content: "schedule-rules",
    },
    {
      title: "Fare Terms & Ancillaries",
      content: "fare-terms",
    },
    {
      title: "Review & Confirm",
      content: "review-confirm",
    },
  ];

  const renderActiveBidsContent = () => {
    // Show all bids instead of filtering by active status
    const activeBids = (recentBidsData || []).map((bid, index) => {
      // Calculate time left until bid expires
      const timeLeft = bid.validUntil
        ? calculateTimeLeft(new Date(bid.validUntil))
        : "No expiry";

      // Parse configuration data if available
      let configData = {};
      try {
        configData = bid.notes ? JSON.parse(bid.notes) : {};
      } catch (e) {
        configData = {};
      }

      return {
        key: bid.id.toString(),
        bidId: `BID${bid.id.toString().padStart(3, "0")}`,
        passenger: {
          name:
            configData.groupLeaderName ||
            configData.contactName ||
            `User ${bid.userId}`,
          email:
            configData.groupLeaderEmail ||
            configData.email ||
            "user@example.com",
        },
        flight: {
          number:
            configData.flightNumber ||
            `GR-${Math.floor(Math.random() * 9000) + 1000}`,
          route:
            configData.origin && configData.destination
              ? `${configData.origin} → ${configData.destination}`
              : bid.flight
                ? `${bid.flight.origin} → ${bid.flight.destination}`
                : "Route not available",
          date: configData.travelDate
            ? new Date(configData.travelDate).toLocaleDateString()
            : bid.flight?.departureTime
              ? new Date(bid.flight.departureTime).toLocaleDateString()
              : "N/A",
        },
        upgrade: configData.fareType
          ? `Economy → ${configData.fareType}`
          : "Economy → Business",
        bidAmount: `$${bid.bidAmount}`,
        maxBid: `$${(parseFloat(bid.bidAmount) * 1.2).toFixed(0)}`,
        successRate: "75%", // This could be calculated based on historical data
        timeLeft: timeLeft,
        expiryDate: new Date(bid.validUntil).toLocaleDateString(),
        status: bid.bidStatus || bid.rStatus || "active", // Use bidStatus, fallback to rStatus, then default to active
        paymentStatus: (bid.bidStatus === "completed" || bid.rStatus === 3) ? "paid" : "pending", // Mock payment status
        passengerCount: bid.passengerCount || 1,
        createdAt: bid.createdAt,
      };
    });
    const filteredBids = useMemo(() => {
      const lowerSearch = searchText.toLowerCase();

      return activeBids.filter(
        (bid: {
          flight: { number: { toString: () => string }; route: string };
          upgrade: string;
          bidId: string;
          bidAmount: string;
          status: string;
        }) => {
          const flightNumber =
            bid.flight?.number?.toString().toLowerCase() || "";
          const route = bid.flight?.route?.toLowerCase() || "";
          const upgrade = bid.upgrade?.toLowerCase() || "";
          const bidId = bid.bidId?.toLowerCase() || "";
          const bidAmount = bid.bidAmount?.toLowerCase() || "";

          const matchesSearch =
            !searchText ||
            bidId.includes(lowerSearch) ||
            flightNumber.includes(lowerSearch) ||
            route.includes(lowerSearch) ||
            upgrade.includes(lowerSearch) ||
            bidAmount.includes(lowerSearch);

          const matchesStatus =
            !statusFilter ||
            statusFilter === "all" ||
            bid.status.toLowerCase() === statusFilter.toLowerCase();

          return matchesSearch && matchesStatus;
        },
      );
    }, [searchText, statusFilter, activeBids]);
    return (
      <div>
        {/* Active Bids Header */}
        <div className="mb-6">
          <Title level={4} className="!mb-1">
            All Bids Requiring Attention ({activeBids.length})
          </Title>
          <Text className="text-gray-500">
            Monitor and respond to all passenger upgrade bids
          </Text>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Input
              className="search-input"
              placeholder="Search by passenger name..."
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
            />
          </div>
          <Select
            placeholder="Filter by status"
            onChange={(value) => setStatusFilter(value)}
            style={{ width: 150 }}
          >
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="active">Open</Select.Option>
            <Select.Option value="completed">Under Review</Select.Option>
            <Select.Option value="approved">Accepted</Select.Option>
            <Select.Option value="rejected">Declined</Select.Option>
            <Select.Option value="expired">Expired</Select.Option>
            <Select.Option value="pending">Pending</Select.Option>
            <Select.Option value="completed">completed</Select.Option>
          </Select>
        </div>

        {/* Active Bids Table */}
        {activeBids.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <Text className="text-gray-500">
                No bids found. Bids will appear here when passengers submit
                upgrade requests.
              </Text>
            </div>
          </Card>
        ) : (
          <Table
            dataSource={filteredBids}
            expandable={{
              expandedRowRender: (record: any) => {
                // Extract numeric bid ID from record.bidId (e.g., "BID001" -> "1")
                let numericBidId = record.bidId.replace(/^BID0*/, "");
                if (!numericBidId) {
                  numericBidId = record.bidId.replace(/\D/g, "");
                }

                const retailData = retailUsersData[numericBidId];
                const isLoading = fetchingRetailUsers[numericBidId];

                console.log(`Rendering expandable row for bid ${record.bidId}, numericBidId: ${numericBidId}, retailData:`, retailData, 'isLoading:', isLoading);

                if (isLoading) {
                  return (
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <Spin size="small" />
                      <Text className="text-gray-500 ml-2">
                        Loading retail users...
                      </Text>
                    </div>
                  );
                }

                if (!retailData || !retailData.retailUsers || retailData.retailUsers.length === 0) {
                  return (
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <Text className="text-gray-500">
                        No retail users found for this bid (ID: {numericBidId})
                      </Text>
                      {!retailData && (
                        <div className="mt-2">
                          <Text className="text-gray-400 text-xs">
                            Debug: retailData is null/undefined
                          </Text>
                        </div>
                      )}
                    </div>
                  );
                }

                const {
                  baseBidAmount,
                  totalRetailUsers,
                  retailUsers,
                  highestBidAmount,
                } = retailData;

                return (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Title level={5} className="!mb-4 text-blue-600">
                      Retail Users for {retailData.bidId}
                    </Title>
                    <div className="mb-3">
                      <Text className="text-gray-600 text-sm">
                        Base Bid Amount:{" "}
                        <span className="font-semibold">${baseBidAmount}</span>{" "}
                        | Total Retail Users: {totalRetailUsers}
                      </Text>
                    </div>
                    <div className="space-y-3">
                      {retailUsers.length === 0 ? (
                        <div className="text-center py-4">
                          <Text className="text-gray-500">
                            No retail users found for this bid
                          </Text>
                        </div>
                      ) : (
                        retailUsers.map((user) => (
                          // Display each retail user in a card-like format
                          <div
                            key={user.id}
                            className={`p-4 rounded-md border transition-all shadow-sm grid grid-cols-1 sm:grid-cols-5 gap-4 items-center
                              ${
                                user.status === "approved"
                                  ? "border-green-500 bg-green-50"
                                  : user.isHighestBidder
                                    ? "border-yellow-500 bg-yellow-50"
                                    : "bg-white border"
                              }
                            `}
                          >
                            {/* Column 1: User Info */}
                            <div>
                              <Text strong>{user.name}</Text>
                              <Text className="block text-gray-500 text-sm">
                                {user.email}
                              </Text>
                            </div>

                            {/* Column 2: Booking Info */}
                            <div>
                              <Text className="text-gray-600 text-sm block">
                                Booking: {user.bookingRef}
                              </Text>
                              <Text className="text-gray-600 text-sm">
                                Seat: {user.seatNumber}
                              </Text>
                            </div>

                            {/* Column 3: Bid Info */}
                            <div>
                              <Text className="text-green-600 font-semibold text-sm block">
                                Bid: ${user.bidAmount}
                                {user.isHighestBidder && (
                                  <span className="inline-flex items-center gap-1 text-yellow-600 text-xs font-semibold bg-yellow-100 px-2 py-0.5 rounded-full ml-2">
                                    🏆 Top Bidder
                                  </span>
                                )}
                              </Text>
                              <Text className="text-gray-500 text-xs">
                                +${user.differenceFromBase.toFixed(0)} above
                                base
                              </Text>
                            </div>

                            {/* Column 4: Status */}
                            <div className="flex sm:justify-start">
                              <Tag
                                color={
                                  user.status === "approved"
                                    ? "green"
                                    : user.status === "rejected"
                                      ? "red"
                                      : "orange"
                                }
                              >
                                {user.status.replace("_", " ").toUpperCase()}
                              </Tag>
                            </div>

                            {/* Column 5: Buttons (only if pending) */}
                            <div className="flex gap-2">
                              {user.status === "pending_approval" && (
                                <>
                                  <Button
                                    type="primary"
                                    size="small"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => {
                                      // Get the actual retail user ID from the retail bid data
                                      // Priority: rUserId (from retail bids table) > userId > id
                                      const retailUserId = user.rUserId || user.userId || user.id;
                                      console.log(`Approving retail user with ID: ${retailUserId} for bid: ${record.bidId}`);
                                      console.log('User object:', user);
                                      handleRetailUserAction(
                                        retailUserId,
                                        "approve",
                                        record.bidId,
                                      );
                                    }}
                                    loading={loading}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    danger
                                    size="small"
                                    onClick={() => {
                                      // Get the actual retail user ID from the retail bid data
                                      // Priority: rUserId (from retail bids table) > userId > id
                                      const retailUserId = user.rUserId || user.userId || user.id;
                                      console.log(`Rejecting retail user with ID: ${retailUserId} for bid: ${record.bidId}`);
                                      console.log('User object:', user);
                                      handleRetailUserAction(
                                        retailUserId,
                                        "reject",
                                        record.bidId,
                                      );
                                    }}
                                    loading={loading}
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <Text className="text-gray-500 text-sm">
                        Total retail users: {totalRetailUsers} | Pending
                        approval:{" "}
                        {
                          retailUsers.filter(
                            (u) => u.status === "pending_approval",
                          ).length
                        }{" "}
                        | Approved:{" "}
                        {
                          retailUsers.filter((u) => u.status === "approved")
                            .length
                        }
                      </Text>
                    </div>
                  </div>
                );
              },
              rowExpandable: (record) => {
                // Allow expansion for all bids to see retail users
                return true;
              },
              onExpand: (expanded, record) => {
                if (expanded) {
                  // Extract numeric bid ID and fetch retail users data
                  let numericBidId = record.bidId.replace(/^BID0*/, "");
                  // If after removing BID and leading zeros we get empty string, extract all digits
                  if (!numericBidId) {
                    numericBidId = record.bidId.replace(/\D/g, "");
                  }
                  console.log(
                    `Expanding row for bid ${record.bidId}, numeric ID: ${numericBidId}`,
                  );
                  fetchRetailUsers(parseInt(numericBidId));
                }
              },
            }}
            columns={[
              {
                title: "Bid Details",
                dataIndex: "bidId",
                key: "bidDetails",
                render: (bidId, record) => (
                  <div>
                    <Text strong>{bidId}</Text>
                    <br />
                    <Text className="text-gray-500 text-sm">
                      {record.upgrade}
                    </Text>
                  </div>
                ),
              },

              {
                title: "Route",
                dataIndex: "flight",
                key: "route",
                render: (flight) => (
                  <div>
                    <Text strong>{flight.route}</Text>
                    <br />
                    <Text className="text-gray-500 text-sm">{flight.date}</Text>
                  </div>
                ),
              },
              {
                title: "Passengers",
                dataIndex: "passengerCount",
                key: "passengerCount",
                render: (count) => (
                  <Text>
                    {count} passenger{count > 1 ? "s" : ""}
                  </Text>
                ),
              },
              {
                title: "Bid Amount",
                dataIndex: "bidAmount",
                key: "bidAmount",
                render: (amount, record) => (
                  <div>
                    <Text strong>{amount}</Text>
                    <br />
                    <Text className="text-gray-500 text-sm">
                      Est. Max {record.maxBid}
                    </Text>
                  </div>
                ),
              },
              {
                title: "Expiry Date",
                dataIndex: "expiryDate",
                key: "expiryDate",
                render: (expiryDate) => (
                  <Text className="text-gray-500 text-sm">{expiryDate}</Text>
                ),
                width: 110,
              },
              {
                title: "Time Left",
                dataIndex: "timeLeft",
                key: "timeLeft",
                render: (time) => (
                  <Tag
                    color={
                      time.includes("hour") && parseInt(time) < 24
                        ? "red"
                        : "blue"
                    }
                  >
                    {time}
                  </Tag>
                ),
              },
              {
                title: "Status",
                dataIndex: "status",
                key: "status",
                render: (status, record) => {
                  console.log("Rendering status for record:", record, "status:", status);
                  
                  const getStatusDisplay = (status) => {
                    if (!status || status === null || status === undefined || status === "NaN") {
                      return "Open"; // Default status
                    }
                    
                    const statusStr = String(status);
                    switch (statusStr.toLowerCase()) {
                      case "active":
                        return "Open";
                      case "completed":
                        return "Under Review";
                      case "approved":
                        return "Accepted";
                      case "accepted":
                        return "Accepted";
                      case "rejected":
                        return "Declined";
                      case "expired":
                        return "Expired";
                      case "pending":
                        return "Pending";
                      default:
                        return statusStr.charAt(0)?.toUpperCase() + statusStr.slice(1) || "Open";
                    }
                  };

                  const getStatusColor = (status) => {
                    if (!status || status === null || status === undefined || status === "NaN") {
                      return "green"; // Default color for Open status
                    }
                    
                    const statusStr = String(status);
                    switch (statusStr.toLowerCase()) {
                      case "active":
                        return "green";
                      case "accepted":
                        return "blue";
                      case "approved":
                        return "cyan";
                      case "rejected":
                        return "red";
                      case "expired":
                        return "orange";
                      case "completed":
                        return "purple";
                      case "pending":
                        return "yellow";
                      default:
                        return "green";
                    }
                  };

                  const displayStatus = getStatusDisplay(status);
                  const statusColor = getStatusColor(status);

                  return (
                    <Tag color={statusColor}>
                      {displayStatus}
                    </Tag>
                  );
                },
              },
            ]}
            pagination={{ pageSize: 10 }}
            loading={!recentBidsData}
          />
        )}
      </div>
    );
  };

  const [viewBidModalVisible, setViewBidModalVisible] = useState(false);
  const [editBidModalVisible, setEditBidModalVisible] = useState(false);
  const [reviewBidModalVisible, setReviewBidModalVisible] = useState(false);
  const [selectedBid, setSelectedBid] = useState(null);
  const [selectedBidForReview, setSelectedBidForReview] = useState(null);
  const [editForm] = Form.useForm();
  const [reviewForm] = Form.useForm();
  const [retailUsersData, setRetailUsersData] = useState({});
  const [fetchingRetailUsers, setFetchingRetailUsers] = useState({});

  // Reset review modal state when recentBidsData changes
  useEffect(() => {
    if (!recentBidsData && reviewBidModalVisible) {
      setReviewBidModalVisible(false);
      setSelectedBidForReview(null);
    }
  }, [recentBidsData, reviewBidModalVisible]);

  // Function to fetch retail users for a specific bid
  const fetchRetailUsers = async (bidId) => {
    if (retailUsersData[bidId] || fetchingRetailUsers[bidId]) {
      return; // Already fetched or currently fetching
    }

    setFetchingRetailUsers((prev) => ({ ...prev, [bidId]: true }));

    try {
      console.log(`Fetching retail users for bid ID: ${bidId}`);
      const response = await apiRequest("GET", `/api/retail-bids/${bidId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(`Retail users data received for bid ${bidId}:`, result);

      if (result.success && result.data) {
        // Use the data from the API response directly
        const apiData = result.data;
        const retailUsers = apiData.retailUsers || [];

        const transformedData = {
          bidId: apiData.bidId || `BID${bidId.toString().padStart(3, "0")}`,
          baseBidAmount: apiData.baseBidAmount || 0,
          totalRetailUsers: apiData.totalRetailUsers || retailUsers.length,
          retailUsers: retailUsers.map((user, index) => {
            // Ensure we get the correct retail user ID from the API response
            const retailUserId = user.rUserId || user.userId || user.id || (index + 1);
            console.log(`Mapping retail user: rUserId=${user.rUserId}, userId=${user.userId}, id=${user.id}, final=${retailUserId}`);
            
            return {
              id: retailUserId, // Use retail user ID as the primary identifier
              userId: retailUserId, // Store as userId for consistency
              rUserId: retailUserId, // Store as rUserId for retail operations
              name: user.name || `User ${retailUserId}`,
              email: user.email || `user${retailUserId}@email.com`,
              bookingRef: user.bookingRef || `GR00${1230 + retailUserId}`,
              seatNumber: user.seatNumber || `1${2 + index}${String.fromCharCode(65 + (index % 26))}`,
              bidAmount: parseFloat(user.bidAmount) || 0,
              passengerCount: user.passengerCount || 1,
              status: "pending_approval", // Default status
              differenceFromBase: user.differenceFromBase || 0,
              isHighestBidder: user.isHighestBidder || false,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
            };
          }),
          highestBidAmount: apiData.highestBidAmount || 0,
        };

        console.log(`Transformed data for bid ${bidId}:`, transformedData);

        setRetailUsersData((prev) => ({
          ...prev,
          [bidId]: transformedData,
        }));
      } else {
        console.error(
          `Failed to fetch retail users for bid ${bidId}:`,
          result.message || "No data received",
        );
        // Still set empty data to prevent infinite loading
        setRetailUsersData((prev) => ({
          ...prev,
          [bidId]: {
            bidId: bidId,
            baseBidAmount: 0,
            totalRetailUsers: 0,
            retailUsers: [],
            highestBidAmount: 0,
          },
        }));
      }
    } catch (error) {
      console.error(`Error fetching retail users for bid ${bidId}:`, error);
      message.error("Failed to fetch retail users data");
      // Set empty data to prevent infinite loading
      setRetailUsersData((prev) => ({
        ...prev,
        [bidId]: {
          bidId: bidId,
          baseBidAmount: 0,
          totalRetailUsers: 0,
          retailUsers: [],
          highestBidAmount: 0,
        },
      }));
    } finally {
      setFetchingRetailUsers((prev) => ({ ...prev, [bidId]: false }));
    }
  };

  const handleViewBid = (bid) => {
    setSelectedBid(bid);
    setViewBidModalVisible(true);
  };

  const handleReviewBid = (bidRecord) => {
    console.log("handleReviewBid called with:", bidRecord);
    console.log("recentBidsData:", recentBidsData);

    // Find the actual bid data from recentBidsData
    const bidData = (recentBidsData || []).find(
      (bid) => `BID${bid.id.toString().padStart(3, "0")}` === bidRecord.bidId,
    );

    console.log("Found bidData:", bidData);

    if (bidData) {
      // Parse configuration data from notes to get flight information
      let configData = {};
      try {
        configData = bidData.notes ? JSON.parse(bidData.notes) : {};
      } catch (e) {
        console.error("Error parsing bid notes:", e);
        configData = {};
      }

      // Create comprehensive flight information from bid configuration
      const flightInfo = {
        flightNumber:
          configData.flightNumber ||
          `GR-${Math.floor(Math.random() * 9000) + 1000}`,
        airline: "Group Retail Airways",
        origin: configData.origin || bidRecord.flight?.origin || "Unknown",
        destination:
          configData.destination || bidRecord.flight?.destination || "Unknown",
        departureTime: configData.travelDate
          ? new Date(
              `${configData.travelDate}T${
                configData.departureTimeRange?.split(" - ")[0] || "09:00"
              }`,
            ).toISOString()
          : bidData.createdAt,
        arrivalTime: configData.travelDate
          ? new Date(
              `${configData.travelDate}T${
                configData.departureTimeRange?.split(" - ")[1] || "12:00"
              }`,
            ).toISOString()
          : null,
        price: bidData.bidAmount || 0,
        availableSeats: configData.totalSeatsAvailable || 50,
        cabin: configData.fareType || "Economy",
      };

      const reviewData = {
        ...bidData,
        record: bidRecord,
        flight: flightInfo,
        configData: configData,
      };

      console.log("Setting selectedBidForReview to:", reviewData);

      setSelectedBidForReview(reviewData);
      setReviewBidModalVisible(true);
      reviewForm.resetFields();
    } else {
      console.error("Bid data not found for bidId:", bidRecord.bidId);
      message.error("Unable to find bid data. Please try again.");
    }
  };

  const handleEditBid = (bid) => {
    setSelectedBid(bid);
    let configData = {};
    try {
      configData = bid.notes ? JSON.parse(bid.notes) : {};
    } catch (e) {
      configData = {};
    }

    // Populate the edit form with existing data
    editForm.setFieldsValue({
      bidTitle: configData.title || "",
      flightType: configData.flightType || "Domestic",
      origin: configData.origin || "",
      destination: configData.destination || "",
      totalSeatsAvailable: configData.totalSeatsAvailable || 50,
      minSeatsPerBid: configData.minSeatsPerBid || 1,
      maxSeatsPerBid: configData.maxSeatsPerBid || 10,
      maxSeatsPerUser: configData.maxSeatsPerUser || 5,
      fareType: configData.fareType || "Economy",
      baggageAllowance: configData.baggageAllowance || 20,
      cancellationTerms: configData.cancellationTerms || "Standard",
      mealIncluded: configData.mealIncluded || false,
      otherNotes: configData.otherNotes || "",
    });

    setEditBidModalVisible(true);
  };

  const handleToggleBidStatus = async (bid, checked) => {
    try {
      const newStatus = checked ? "active" : "inactive";
      const response = await apiRequest(
        "PUT",
        `/api/bid-configurations/${bid.id}/status`,
        {
          status: newStatus,
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update bid status");
      }

      const result = await response.json();

      if (result.success) {
        message.success(
          `Bid configuration ${
            checked ? "activated" : "deactivated"
          } successfully`,
        );
        // Refetch bid configurations to update the display
        refetchBids();
      } else {
        message.error(result.message || "Failed to update bid status");
      }
    } catch (error) {
      console.error("Error updating bid status:", error);
      message.error("Failed to update bid status. Please try again.");
    }
  };

  const handleBidAction = async (action, values = {}) => {
    if (!selectedBidForReview) return;

    setLoading(true);
    try {
      const bidId = selectedBidForReview.id;
      const newStatus = action === "accept" ? "accepted" : "rejected";

      const response = await apiRequest("PUT", `/api/bids/${bidId}/status`, {
        status: newStatus,
        adminNotes: values.adminNotes || "",
        counterOffer: values.counterOffer || null,
        rejectionReason: values.rejectionReason || null,
      });

      if (!response.ok) {
        throw new Error("Failed to update bid status");
      }

      const result = await response.json();

      if (result.success) {
        message.success(
          `Bid ${action === "accept" ? "accepted" : "rejected"} successfully`,
        );

        // Refresh data
        queryClient.invalidateQueries(["recent-bids"]);
        queryClient.invalidateQueries(["bid-configurations"]);

        // Close modal
        setReviewBidModalVisible(false);
        setSelectedBidForReview(null);
        reviewForm.resetFields();
      } else {
        message.error(result.message || `Failed to ${action} bid`);
      }
    } catch (error) {
      console.error(`Error ${action}ing bid:`, error);
      message.error(`Failed to ${action} bid. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleRetailUserAction = async (userId, action, bidId) => {
    setLoading(true);
    try {
      console.log(`${action}ing retail user ${userId} for bid ${bidId}`);

      // Extract numeric bid ID from bidId string (e.g., "BID001" -> 1, "BID014" -> 14, "014" -> 14)
      let numericBidId;
      if (typeof bidId === "string") {
        // First, remove any "BID" prefix
        let cleanId = bidId.replace(/^BID/i, "");
        // Then parse as integer (this will automatically remove leading zeros)
        numericBidId = parseInt(cleanId, 10);
      } else {
        numericBidId = parseInt(bidId, 10);
      }

      console.log(
        `Converting bid ID "${bidId}" to numeric ID "${numericBidId}"`,
      );

      // Validate that we have a valid numeric ID
      if (isNaN(numericBidId) || numericBidId <= 0) {
        message.error(`Invalid bid ID format: ${bidId}`);
        return;
      }

      const response = await apiRequest(
        "PUT",
        `/api/bids/retail-users/status`,
        { 
          bidId: numericBidId,
          userId: parseInt(userId, 10),
          action 
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API response error:", errorText);
        throw new Error(`Failed to update retail user status: ${errorText}`);
      }

      const result = await response.json();
      console.log("Action result:", result);

      if (result.success) {
        if (action === "approve") {
          message.success(
            result.message ||
              "Retail user approved successfully. All other users have been automatically rejected and bid status updated to 'Approved'.",
          );
        } else {
          message.success(
            result.message || "Retail user rejected successfully",
          );
        }

        // Clear retail users data for this bid to force refetch
        setRetailUsersData((prev) => {
          const updated = { ...prev };
          delete updated[numericBidId];
          return updated;
        });

        // Refresh the data to update the UI with new bid status and retail user statuses
        await Promise.all([
          queryClient.invalidateQueries(["recent-bids"]),
          queryClient.invalidateQueries(["bid-configurations"]),
          refetchBids()
        ]);

        // Small delay to ensure data is updated, then force re-expand if expanded
        setTimeout(() => {
          // Force refresh retail users data by fetching again
          fetchRetailUsers(numericBidId);
        }, 500);

      } else {
        throw new Error(result.message || `Failed to ${action} retail user`);
      }
    } catch (error) {
      console.error(`Error ${action}ing retail user:`, error);
      message.error(
        error.message || `Failed to ${action} retail user. Please try again.`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (values) => {
    if (!selectedBid) return;

    setLoading(true);
    try {
      console.log("Submitting edit form with values:", values);
      console.log("Selected bid ID:", selectedBid.id);

      // Prepare the update data with all fields
      const updateData = {
        bidTitle: values.bidTitle,
        flightType: values.flightType,
        origin: values.origin,
        destination: values.destination,
        totalSeatsAvailable: values.totalSeatsAvailable,
        minSeatsPerBid: values.minSeatsPerBid,
        maxSeatsPerBid: values.maxSeatsPerBid,
        maxSeatsPerUser: values.maxSeatsPerUser,
        fareType: values.fareType,
        baggageAllowance: values.baggageAllowance,
        cancellationTerms: values.cancellationTerms,
        mealIncluded: values.mealIncluded,
        otherNotes: values.otherNotes,
      };

      const response = await apiRequest(
        "PUT",
        `/api/bid-configurations/${selectedBid.id}`,
        updateData,
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API response error:", errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log("Update response:", result);

      if (result.success) {
        message.success("Bid configuration updated successfully");
        setEditBidModalVisible(false);
        setSelectedBid(null);
        editForm.resetFields();

        // Refetch bid configurations to update the display
        await refetchBids();

        // Also invalidate and refetch recent bids to update activity
        queryClient.invalidateQueries(["recent-bids"]);
        queryClient.invalidateQueries(["bid-configurations"]);

        // Update local state to reflect changes immediately
        setBidConfigurations((prev) =>
          prev.map((bid) =>
            bid.id === selectedBid.id
              ? {
                  ...bid,
                  notes: JSON.stringify({
                    ...JSON.parse(bid.notes || "{}"),
                    ...updateData,
                    updatedAt: new Date().toISOString(),
                  }),
                }
              : bid,
          ),
        );
      } else {
        message.error("Failed to update bid configuration");
      }
    } catch (error) {
      console.error("Error updating bid configuration:", error);

      let errorMessage =
        "Failed to update bid configuration. Please try again.";
      if (error.message) {
        if (error.message.includes("fetch")) {
          errorMessage =
            "Network error. Please check your connection and try again.";
        } else if (error.message.includes("API Error")) {
          errorMessage = "Server error. Please try again or contact support.";
        } else {
          errorMessage = error.message;
        }
      }

      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderBidSetupContent = () => (
    <div>
      {/* Bid Setup Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Title level={4} className="!mb-1">
            Bid Configurations
          </Title>
          <Text className="text-gray-500">
            Set up and manage different types of upgrade bids
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-blue-600 hover:bg-blue-700"
          onClick={handleCreateBid}
        >
          Create New Bid
        </Button>
      </div>

      {/* Bid Configuration Cards */}
      <div className="space-y-4">
        {bidConfigurations.length === 0 ? (
          <div className="text-center py-8">
            <Text className="text-gray-500">
              No bid configurations found. Create your first bid configuration
              to get started.
            </Text>
          </div>
        ) : (
          bidConfigurations.map((bid) => {
            let configData = {};
            try {
              configData = bid.notes ? JSON.parse(bid.notes) : {};
            } catch (e) {
              configData = {};
            }

            const title = configData.title || `Bid Configuration #${bid.id}`;
            const route =
              configData.origin && configData.destination
                ? `${configData.origin} → ${configData.destination}`
                : "Route not specified";
            const totalSeats = configData.totalSeatsAvailable || "N/A";
            const fareType = configData.fareType || "Economy";
            const createdDate = bid.createdAt
              ? new Date(bid.createdAt).toLocaleDateString()
              : "Unknown";

            const statusColor =
              bid.bidStatus === "active"
                ? "green"
                : bid.bidStatus === "pending"
                  ? "orange"
                  : "red";
            const statusText =
              bid.bidStatus === "active"
                ? "Active"
                : bid.bidStatus === "pending"
                  ? "Pending"
                  : "Inactive";

            return (
              <Card
                key={bid.id}
                className="hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <Title level={5} className="!mb-0 !mr-3">
                        {title}
                      </Title>
                      <Tag color={statusColor} className="text-xs">
                        {statusText}
                      </Tag>
                    </div>

                    <Row gutter={[32, 16]}>
                      <Col span={6}>
                        <div>
                          <Text className="text-gray-500 text-sm block mb-1">
                            Route:
                          </Text>
                          <Text className="font-medium">{route}</Text>
                        </div>
                      </Col>
                      <Col span={6}>
                        <div>
                          <Text className="text-gray-500 text-sm block mb-1">
                            Total Seats:
                          </Text>
                          <Text className="font-medium">{totalSeats}</Text>
                        </div>
                      </Col>
                      <Col span={6}>
                        <div>
                          <Text className="text-gray-500 text-sm block mb-1">
                            Fare Type:
                          </Text>
                          <Text className="font-medium">{fareType}</Text>
                        </div>
                      </Col>
                      <Col span={6}>
                        <div>
                          <Text className="text-gray-500 text-sm block mb-1">
                            Base Bid Amount:
                          </Text>
                          <Text className="font-medium">
                            ${bid.bidAmount || 0}
                          </Text>
                        </div>
                      </Col>
                    </Row>

                    <div className="mt-4">
                      <Text className="text-gray-400 text-xs">
                        Created: {createdDate}
                      </Text>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-6">
                    <Button
                      type="text"
                      icon={<EyeOutlined />}
                      size="small"
                      onClick={() => handleViewBid(bid)}
                    >
                      View
                    </Button>
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      size="small"
                      onClick={() => handleEditBid(bid)}
                    >
                      Edit
                    </Button>
                    <Switch
                      checked={bid.bidStatus === "active"}
                      size="small"
                      checkedChildren="ON"
                      unCheckedChildren="OFF"
                      onChange={(checked) =>
                        handleToggleBidStatus(bid, checked)
                      }
                    />
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* View Bid Modal */}
      <Modal
        title="View Bid Configuration"
        visible={viewBidModalVisible}
        onCancel={() => {
          setViewBidModalVisible(false);
          setSelectedBid(null);
        }}
        footer={[
          <Button key="close" onClick={() => setViewBidModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {selectedBid && (
          <div className="space-y-6">
            {(() => {
              let configData = {};
              try {
                configData = selectedBid.notes
                  ? JSON.parse(selectedBid.notes)
                  : {};
              } catch (e) {
                configData = {};
              }

              return (
                <>
                  <Row gutter={[24, 16]}>
                    <Col span={12}>
                      <div>
                        <Text className="text-gray-500 block mb-1">
                          Bid Title:
                        </Text>
                        <Text className="font-medium">
                          {configData.title || "N/A"}
                        </Text>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div>
                        <Text className="text-gray-500 block mb-1">
                          Flight Type:
                        </Text>
                        <Text className="font-medium">
                          {configData.flightType || "N/A"}
                        </Text>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div>
                        <Text className="text-gray-500 block mb-1">
                          Origin:
                        </Text>
                        <Text className="font-medium">
                          {configData.origin || "N/A"}
                        </Text>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div>
                        <Text className="text-gray-500 block mb-1">
                          Destination:
                        </Text>
                        <Text className="font-medium">
                          {configData.destination || "N/A"}
                        </Text>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div>
                        <Text className="text-gray-500 block mb-1">
                          Travel Date:
                        </Text>
                        <Text className="font-medium">
                          {configData.travelDate || "N/A"}
                        </Text>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div>
                        <Text className="text-gray-500 block mb-1">
                          Total Seats Available:
                        </Text>
                        <Text className="font-medium">
                          {configData.totalSeatsAvailable || "N/A"}
                        </Text>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div>
                        <Text className="text-gray-500 block mb-1">
                          Min Seats per Bid:
                        </Text>
                        <Text className="font-medium">
                          {configData.minSeatsPerBid || "N/A"}
                        </Text>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div>
                        <Text className="text-gray-500 block mb-1">
                          Max Seats per Bid:
                        </Text>
                        <Text className="font-medium">
                          {configData.maxSeatsPerBid || "N/A"}
                        </Text>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div>
                        <Text className="text-gray-500 block mb-1">
                          Max Seats per User:
                        </Text>
                        <Text className="font-medium">
                          {configData.maxSeatsPerUser || "N/A"}
                        </Text>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div>
                        <Text className="text-gray-500 block mb-1">
                          Fare Type:
                        </Text>
                        <Text className="font-medium">
                          {configData.fareType || "N/A"}
                        </Text>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div>
                        <Text className="text-gray-500 block mb-1">
                          Baggage Allowance:
                        </Text>
                        <Text className="font-medium">
                          {configData.baggageAllowance || "N/A"} kg
                        </Text>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div>
                        <Text className="text-gray-500 block mb-1">
                          Cancellation Terms:
                        </Text>
                        <Text className="font-medium">
                          {configData.cancellationTerms || "N/A"}
                        </Text>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div>
                        <Text className="text-gray-500 block mb-1">
                          Meal Included:
                        </Text>
                        <Text className="font-medium">
                          {configData.mealIncluded ? "Yes" : "No"}
                        </Text>
                      </div>
                    </Col>

                    <Col span={12}>
                      <div>
                        <Text className="text-gray-500 block mb-1">
                          Status:
                        </Text>
                        <Tag
                          color={
                            selectedBid.bidStatus === "active" ? "green" : "red"
                          }
                        >
                          {selectedBid.bidStatus === "active"
                            ? "Active"
                            : "Inactive"}
                        </Tag>
                      </div>
                    </Col>
                  </Row>

                  {configData.otherNotes && (
                    <div>
                      <Text className="text-gray-500 block mb-2">
                        Other Notes:
                      </Text>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <Text>{configData.otherNotes}</Text>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}
      </Modal>

      {/* Edit Bid Modal */}
      <Modal
        title="Edit Bid Configuration"
        visible={editBidModalVisible}
        onCancel={() => {
          setEditBidModalVisible(false);
          setSelectedBid(null);
          editForm.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditSubmit}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item label="Bid Title" name="bidTitle">
                <Input
                  placeholder="Enter bid title"
                  disabled
                  className="bg-gray-100"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Flight Type" name="flightType">
                <Select
                  placeholder="Select flight type"
                  disabled
                  className="bg-gray-100"
                >
                  <Select.Option value="Domestic">Domestic</Select.Option>
                  <Select.Option value="International">
                    International
                  </Select.Option>
                  <Select.Option value="Regional">Regional</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Origin" name="origin">
                <Select
                  mode="combobox"
                  placeholder="Search city / airport"
                  showSearch
                  disabled
                  className="bg-gray-100"
                  filterOption={(input, option) =>
                    (option?.value ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {originOptions.map((location) => (
                    <Select.Option key={location} value={location}>
                      {location}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Destination" name="destination">
                <Select
                  mode="combobox"
                  placeholder="Search city / airport"
                  showSearch
                  disabled
                  className="bg-gray-100"
                  filterOption={(input, option) =>
                    (option?.value ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {destinationOptions.map((location) => (
                    <Select.Option key={location} value={location}>
                      {location}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Total Seats Available"
                name="totalSeatsAvailable"
              >
                <InputNumber min={1} className="w-full" placeholder="50" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Min Seats per Bid" name="minSeatsPerBid">
                <InputNumber min={1} className="w-full" placeholder="1" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Max Seats per Bid" name="maxSeatsPerBid">
                <InputNumber min={1} className="w-full" placeholder="10" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Max Seats per User" name="maxSeatsPerUser">
                <InputNumber min={1} className="w-full" placeholder="5" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Fare Type" name="fareType">
                <Select placeholder="Select fare type">
                  <Select.Option value="Economy">Economy</Select.Option>
                  <Select.Option value="Premium Economy">
                    Premium Economy
                  </Select.Option>
                  <Select.Option value="Business Class">
                    Business Class
                  </Select.Option>
                  <Select.Option value="First Class">First Class</Select.Option>
                  <Select.Option value="Flexible Fare">
                    Flexible Fare
                  </Select.Option>
                  <Select.Option value="Restricted Fare">
                    Restricted Fare
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Baggage Allowance (kg)" name="baggageAllowance">
                <InputNumber
                  min={0}
                  max={100}
                  className="w-full"
                  placeholder="20"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Cancellation Terms" name="cancellationTerms">
                <Select placeholder="Select cancellation terms">
                  <Select.Option value="Flexible - Free cancellation">
                    Flexible - Free cancellation
                  </Select.Option>
                  <Select.Option value="Standard - 24h free cancellation">
                    Standard - 24h free cancellation
                  </Select.Option>
                  <Select.Option value="Restricted - Cancellation fee applies">
                    Restricted - Cancellation fee applies
                  </Select.Option>
                  <Select.Option value="Non-refundable">
                    Non-refundable
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="mealIncluded"
                valuePropName="checked"
                className="pt-8"
              >
                <Checkbox>Meal Included</Checkbox>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Special Requests / Notes"
                name="otherNotes"
                tooltip="Add any special requests, targeting information (weddings, students, events), fare conditions, or other relevant notes"
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Enter special requests, notes about targeting specific groups (weddings, students, corporate events), fare conditions, or any other relevant information..."
                  showCount
                  maxLength={1000}
                />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end space-x-2 mt-6">
            <Button
              onClick={() => {
                setEditBidModalVisible(false);
                setSelectedBid(null);
                editForm.resetFields();
              }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update Bid Configuration
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Review Bid Modal */}
      <Modal
        title="Review Bid Request"
        visible={reviewBidModalVisible}
        onCancel={() => {
          setReviewBidModalVisible(false);
          setSelectedBidForReview(null);
          reviewForm.resetFields();
        }}
        footer={null}
        width={900}
        destroyOnClose={true}
        maskClosable={false}
      >
        {selectedBidForReview && selectedBidForReview.id ? (
          <div className="space-y-6">
            {/* Bid Overview */}
            <Card className="bg-blue-50 border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <Title level={5} className="!mb-0 text-blue-800">
                  Bid Overview
                </Title>
                <Tag
                  color={
                    selectedBidForReview.bidStatus === "active"
                      ? "green"
                      : "blue"
                  }
                  className="text-sm"
                >
                  {selectedBidForReview.bidStatus
                    ? selectedBidForReview.bidStatus.toUpperCase()
                    : "UNKNOWN"}
                </Tag>
              </div>

              <Row gutter={[24, 16]}>
                <Col span={8}>
                  <div>
                    <Text className="text-gray-600 block text-sm">Bid ID</Text>
                    <Text className="font-semibold">
                      BID{selectedBidForReview.id.toString().padStart(3, "0")}
                    </Text>
                  </div>
                </Col>
                <Col span={8}>
                  <div>
                    <Text className="text-gray-600 block text-sm">
                      Bid Amount
                    </Text>
                    <Text className="font-semibold text-green-600 text-lg">
                      ${selectedBidForReview.bidAmount}
                    </Text>
                  </div>
                </Col>
                <Col span={8}>
                  <div>
                    <Text className="text-gray-600 block text-sm">
                      Passengers
                    </Text>
                    <Text className="font-semibold">
                      {selectedBidForReview.passengerCount} passenger
                      {selectedBidForReview.passengerCount > 1 ? "s" : ""}
                    </Text>
                  </div>
                </Col>
                <Col span={8}>
                  <div>
                    <Text className="text-gray-600 block text-sm">
                      Submitted
                    </Text>
                    <Text className="font-semibold">
                      {selectedBidForReview.createdAt
                        ? new Date(
                            selectedBidForReview.createdAt,
                          ).toLocaleDateString()
                        : "Unknown"}
                    </Text>
                  </div>
                </Col>
                <Col span={8}>
                  <div>
                    <Text className="text-gray-600 block text-sm">
                      Valid Until
                    </Text>
                    <Text className="font-semibold text-orange-600">
                      {selectedBidForReview.validUntil
                        ? new Date(
                            selectedBidForReview.validUntil,
                          ).toLocaleDateString()
                        : "No expiry"}
                    </Text>
                  </div>
                </Col>
                <Col span={8}>
                  <div>
                    <Text className="text-gray-600 block text-sm">
                      Total Value
                    </Text>
                    <Text className="font-semibold text-blue-600 text-lg">
                      $
                      {(
                        parseFloat(selectedBidForReview.bidAmount) *
                        selectedBidForReview.passengerCount
                      ).toLocaleString()}
                    </Text>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Flight Information */}
            <Card>
              <Title level={5} className="!mb-4">
                Flight Information
              </Title>
              <Row gutter={[24, 16]}>
                <Col span={12}>
                  <div>
                    <Text className="text-gray-600 block text-sm">
                      Flight Number
                    </Text>
                    <Text className="font-semibold">
                      {selectedBidForReview.flight?.flightNumber || "N/A"}
                    </Text>
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <Text className="text-gray-600 block text-sm">Airline</Text>
                    <Text className="font-semibold">
                      {selectedBidForReview.flight?.airline || "N/A"}
                    </Text>
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <Text className="text-gray-600 block text-sm">Route</Text>
                    <Text className="font-semibold">
                      {selectedBidForReview.flight
                        ? `${selectedBidForReview.flight.origin} → ${selectedBidForReview.flight.destination}`
                        : "N/A"}
                    </Text>
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <Text className="text-gray-600 block text-sm">
                      Travel Date
                    </Text>
                    <Text className="font-semibold">
                      {selectedBidForReview.configData?.travelDate
                        ? new Date(
                            selectedBidForReview.configData.travelDate,
                          ).toLocaleDateString()
                        : "N/A"}
                    </Text>
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <Text className="text-gray-600 block text-sm">
                      Departure Time Range
                    </Text>
                    <Text className="font-semibold">
                      {selectedBidForReview.configData?.departureTimeRange ||
                        "N/A"}
                    </Text>
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <Text className="text-gray-600 block text-sm">
                      Flight Type
                    </Text>
                    <Text className="font-semibold">
                      {selectedBidForReview.configData?.flightType || "N/A"}
                    </Text>
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <Text className="text-gray-600 block text-sm">
                      Cabin Class
                    </Text>
                    <Text className="font-semibold">
                      {selectedBidForReview.flight?.cabin ||
                        selectedBidForReview.configData?.fareType ||
                        "Economy"}
                    </Text>
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <Text className="text-gray-600 block text-sm">
                      Available Seats
                    </Text>
                    <Text className="font-semibold">
                      {selectedBidForReview.flight?.availableSeats ||
                        selectedBidForReview.configData?.totalSeatsAvailable ||
                        0}{" "}
                      seats
                    </Text>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Bid Configuration Information */}
            {selectedBidForReview.configData && (
              <Card>
                <Title level={5} className="!mb-4">
                  Bid Configuration Details
                </Title>
                <Row gutter={[24, 16]}>
                  <Col span={12}>
                    <div>
                      <Text className="text-gray-600 block text-sm">
                        Configuration Title
                      </Text>
                      <Text className="font-semibold">
                        {selectedBidForReview.configData.title ||
                          selectedBidForReview.configData.bidTitle ||
                          "N/A"}
                      </Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div>
                      <Text className="text-gray-600 block text-sm">
                        Baggage Allowance
                      </Text>
                      <Text className="font-semibold">
                        {selectedBidForReview.configData.baggageAllowance ||
                          "N/A"}{" "}
                        kg
                      </Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div>
                      <Text className="text-gray-600 block text-sm">
                        Meal Included
                      </Text>
                      <Text className="font-semibold">
                        {selectedBidForReview.configData.mealIncluded
                          ? "Yes"
                          : "No"}
                      </Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div>
                      <Text className="text-gray-600 block text-sm">
                        Cancellation Terms
                      </Text>
                      <Text className="font-semibold">
                        {selectedBidForReview.configData.cancellationTerms ||
                          "Standard"}
                      </Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div>
                      <Text className="text-gray-600 block text-sm">
                        Min Seats per Bid
                      </Text>
                      <Text className="font-semibold">
                        {selectedBidForReview.configData.minSeatsPerBid ||
                          "N/A"}
                      </Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div>
                      <Text className="text-gray-600 block text-sm">
                        Max Seats per Bid
                      </Text>
                      <Text className="font-semibold">
                        {selectedBidForReview.configData.maxSeatsPerBid ||
                          "N/A"}
                      </Text>
                    </div>
                  </Col>
                </Row>
              </Card>
            )}

            {/* Additional Notes */}
            {selectedBidForReview.notes && (
              <Card>
                <Title level={5} className="!mb-4">
                  Additional Information
                </Title>
                <div className="bg-gray-50 p-4 rounded-md">
                  <Text>{selectedBidForReview.notes}</Text>
                </div>
              </Card>
            )}

            {/* Action Form */}
            <Card>
              <Title level={5} className="!mb-4">
                Review & Decision
              </Title>
              <Form form={reviewForm} layout="vertical">
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Form.Item label="Admin Notes" name="adminNotes">
                      <Input.TextArea
                        rows={3}
                        placeholder="Add notes about your decision (optional)"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Counter Offer Amount ($)"
                      name="counterOffer"
                    >
                      <InputNumber
                        min={0}
                        className="w-full"
                        placeholder="Optional counter offer"
                        formatter={(value) =>
                          `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value.replace(/$\s?|(,*)/g, "")}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Rejection Reason" name="rejectionReason">
                      <Select placeholder="Select reason (if rejecting)">
                        <Select.Option value="insufficient_bid">
                          Bid amount too low
                        </Select.Option>
                        <Select.Option value="no_availability">
                          No seats available
                        </Select.Option>
                        <Select.Option value="policy_violation">
                          Policy violation
                        </Select.Option>
                        <Select.Option value="operational_reasons">
                          Operational reasons
                        </Select.Option>
                        <Select.Option value="other">Other</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t">
              <Button
                onClick={() => {
                  setReviewBidModalVisible(false);
                  setSelectedBidForReview(null);
                  reviewForm.resetFields();
                }}
              >
                Cancel
              </Button>

              <div className="flex space-x-3">
                <Button
                  danger
                  loading={loading}
                  onClick={() => {
                    reviewForm.validateFields().then((values) => {
                      if (!values.rejectionReason) {
                        message.warning("Please select a rejection reason");
                        return;
                      }
                      handleBidAction("reject", values);
                    });
                  }}
                >
                  Reject Bid
                </Button>
                <Button
                  type="primary"
                  loading={loading}
                  onClick={() => {
                    reviewForm.validateFields().then((values) => {
                      handleBidAction("accept", values);
                    });
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Accept Bid
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Text className="text-gray-500">
              {reviewBidModalVisible
                ? "Loading bid data..."
                : "No bid data available"}
            </Text>
          </div>
        )}
      </Modal>
    </div>
  );

  const renderPaymentsContent = () => (
    <div>
      {/* Payment Stats */}
      <Row gutter={[24, 24]} className="mb-6">
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Total Transactions"
              value={6}
              suffix="This month"
              valueStyle={{
                color: "var(--infiniti-lighter-blue)",
                fontSize: "1.5rem",
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={678.3}
              prefix="$"
              suffix="Net amount"
              valueStyle={{ color: "var(--ant-color-success)" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Pending Refunds"
              value={1}
              suffix="Require processing"
              valueStyle={{ color: "var(--ant-color-warning)" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Failed Payments"
              value={1}
              suffix="Need attention"
              valueStyle={{ color: "var(--ant-color-error)" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Payment Transactions Table */}
      <Card className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <Title level={4} className="!mb-1">
              Payment & Refund Transactions
            </Title>
            <Text className="text-gray-500">
              View and manage all payment transactions and refund requests
            </Text>
          </div>
          <div className="flex space-x-2">
            <Select placeholder="Filter by type" style={{ width: 120 }}>
              <Select.Option value="payment">Payment</Select.Option>
              <Select.Option value="refund">Refund</Select.Option>
            </Select>
            <Select placeholder="Status" style={{ width: 120 }}>
              <Select.Option value="completed">Completed</Select.Option>
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="failed">Failed</Select.Option>
            </Select>
          </div>
        </div>

        <Table
          dataSource={[
            {
              key: "1",
              transactionId: "TXN-001234567",
              passenger: { name: "John Smith", email: "john.smith@email.com" },
              flight: { number: "GR-4521", route: "LAX → JFK" },
              type: "Payment",
              amount: "$250 USD",
              method: "Credit Card ****4532",
              status: "Completed",
              date: "2024-06-23 16:30",
            },
            {
              key: "2",
              transactionId: "REF-001234566",
              passenger: {
                name: "Sarah Johnson",
                email: "sarah.johnson@email.com",
              },
              flight: { number: "GR-7834", route: "ORD → SFO" },
              type: "Refund",
              amount: "$120 USD",
              method: "Credit Card ****6876",
              status: "Pending",
              date: "2024-06-24 09:15",
            },
          ]}
          columns={[
            {
              title: "Transaction ID",
              dataIndex: "transactionId",
              key: "transactionId",
              render: (id, record) => (
                <div>
                  <Text strong>{id}</Text>
                  <br />
                  <Text className="text-gray-500 text-sm">
                    Bid {record.flight.number}
                  </Text>
                </div>
              ),
            },
            {
              title: "Passenger",
              dataIndex: "passenger",
              key: "passenger",
              render: (passenger) => (
                <div>
                  <Text>{passenger.name}</Text>
                  <br />
                  <Text className="text-gray-500 text-sm">
                    {passenger.email}
                  </Text>
                </div>
              ),
            },
            {
              title: "Flight Details",
              dataIndex: "flight",
              key: "flight",
              render: (flight) => (
                <div>
                  <Text>{flight.number}</Text>
                  <br />
                  <Text className="text-gray-500 text-sm">{flight.route}</Text>
                </div>
              ),
            },
            {
              title: "Type",
              dataIndex: "type",
              key: "type",
              render: (type) => (
                <Tag color={type === "Payment" ? "blue" : "orange"}>{type}</Tag>
              ),
            },
            {
              title: "Amount",
              dataIndex: "amount",
              key: "amount",
            },
            {
              title: "Payment Method",
              dataIndex: "method",
              key: "method",
            },
            {
              title: "Status",
              dataIndex: "status",
              key: "status",
              render: (status) => (
                <Tag
                  color={
                    status === "Completed"
                      ? "green"
                      : status === "Pending"
                        ? "orange"
                        : "red"
                  }
                >
                  {status}
                </Tag>
              ),
            },
            {
              title: "Date",
              dataIndex: "date",
              key: "date",
            },
            {
              title: "Actions",
              key: "actions",
              render: () => (
                <Button type="link" icon={<EyeOutlined />} size="small">
                  View
                </Button>
              ),
            },
          ]}
          pagination={false}
        />
      </Card>

      {/* Pending Refund Requests */}
      <Card>
        <div className="mb-4">
          <Title level={4} className="!mb-1">
            Pending Refund Requests
          </Title>
          <Text className="text-gray-500">
            Refund requests that require manual processing
          </Text>
        </div>

        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <Text strong>Sarah Johnson</Text>
                <br />
                <Text className="text-gray-500">GR-7834 • ORD → SFO</Text>
              </div>
              <Tag color="orange">Pending</Tag>
            </div>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Text className="text-gray-500 block">Refund Amount</Text>
                <Text strong>$120</Text>
              </Col>
              <Col span={8}>
                <Text className="text-gray-500 block">Payment Method</Text>
                <Text>Credit Card ****6876</Text>
              </Col>
              <Col span={8}>
                <Text className="text-gray-500 block">Request Date</Text>
                <Text>2024-06-24 09:15</Text>
              </Col>
            </Row>
            <div className="mt-3">
              <Text className="text-gray-500 block mb-1">Reason</Text>
              <Text>Refund for cancelled bid</Text>
            </div>
            <div className="mt-4 flex space-x-2">
              <Button type="primary" size="small">
                Approve Refund
              </Button>
              <Button size="small">Review Details</Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderHistoryContent = () => (
    <div>
      <div className="mb-6">
        <Title level={4} className="!mb-1">
          Bid History
        </Title>
        <Text className="text-gray-500">View completed and closed bids</Text>
      </div>

      <Table
        dataSource={[
          {
            key: "1",
            bidId: "BID004",
            passenger: "Emily Chen",
            flight: { number: "GR-9876", route: "SEA → BOS" },
            originalBid: "$200",
            finalAmount: "$200",
            status: "Accepted",
            completedDate: "2024-06-22",
            revenue: "$200",
          },
          {
            key: "2",
            bidId: "BID005",
            passenger: "Robert Wilson",
            flight: { number: "GR-5432", route: "ATL → PHX" },
            originalBid: "$75",
            finalAmount: "$0",
            status: "Rejected",
            completedDate: "2024-06-21",
            revenue: "$0",
          },
        ]}
        columns={[
          {
            title: "Bid ID",
            dataIndex: "bidId",
            key: "bidId",
          },
          {
            title: "Passenger",
            dataIndex: "passenger",
            key: "passenger",
          },
          {
            title: "Flight",
            dataIndex: "flight",
            key: "flight",
            render: (flight) => (
              <div>
                <Text>{flight.number}</Text>
                <br />
                <Text className="text-gray-500 text-sm">{flight.route}</Text>
              </div>
            ),
          },
          {
            title: "Original Bid",
            dataIndex: "originalBid",
            key: "originalBid",
          },
          {
            title: "Final Amount",
            dataIndex: "finalAmount",
            key: "finalAmount",
          },
          {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
              <Tag color={status === "Accepted" ? "green" : "red"}>
                {status}
              </Tag>
            ),
          },
          {
            title: "Completed Date",
            dataIndex: "completedDate",
            key: "completedDate",
          },
          {
            title: "Revenue",
            dataIndex: "revenue",
            key: "revenue",
          },
        ]}
        pagination={false}
      />
    </div>
  );

  const renderDashboardContent = () => (
    <div>
      {/* Overview and Insights Tabs */}
      <div className="mb-6">
        <Tabs
          defaultActiveKey="overview"
          items={[
            {
              key: "overview",
              label: (
                <span className="flex items-center">
                  <BarChartOutlined className="mr-2" />
                  Dashboard
                </span>
              ),
              children: (
                <div>
                  {/* Stats Cards Row */}
                  <Row gutter={[24, 24]} className="mb-6">
                    <Col xs={24} sm={12} lg={8}>
                      <Card className="h-full">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <Text className="text-gray-500 text-sm">
                              Active Bids
                            </Text>
                            <div className="flex items-center mt-1">
                              <Title
                                level={2}
                                className="!mb-0 !mt-0 text-2xl font-semibold"
                              >
                                3
                              </Title>
                              <InfoCircleOutlined className="text-blue-500 ml-2" />
                            </div>
                            <Text className="text-gray-500 text-xs">
                              Awaiting response
                            </Text>
                          </div>
                        </div>
                      </Card>
                    </Col>

                    <Col xs={24} sm={12} lg={8}>
                      <Card className="h-full">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <Text className="text-gray-500 text-sm">
                              Bid Types
                            </Text>
                            <div className="flex items-center mt-1">
                              <Title
                                level={2}
                                className="!mb-0 !mt-0 text-2xl font-semibold"
                              >
                                1
                              </Title>
                              <SettingOutlined className="text-blue-500 ml-2" />
                            </div>
                            <Text className="text-gray-500 text-xs">
                              Active configurations
                            </Text>
                          </div>
                        </div>
                      </Card>
                    </Col>

                    <Col xs={24} sm={12} lg={8}>
                      <Card className="h-full">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <Text className="text-gray-500 text-sm">
                              Monthly Revenue
                            </Text>
                            <div className="flex items-center mt-1">
                              <Title
                                level={2}
                                className="!mb-0 !mt-0 text-2xl font-semibold"
                              >
                                $47,250
                              </Title>
                              <DollarOutlined className="text-blue-500 ml-2" />
                            </div>
                            <Text className="text-green-500 text-xs">
                              +19.3% this month
                            </Text>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  </Row>

                  {/* Second Row Stats */}
                  <Row gutter={[24, 24]} className="mb-6">
                    <Col xs={24} sm={12} lg={8}>
                      <Card className="h-full">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <Text className="text-gray-500 text-sm">
                              Acceptance Rate
                            </Text>
                            <div className="flex items-center mt-1">
                              <Title
                                level={2}
                                className="!mb-0 !mt-0 text-2xl font-semibold"
                              >
                                72%
                              </Title>
                              <RiseOutlined className="text-blue-500 ml-2" />
                            </div>
                            <Text className="text-green-500 text-xs">
                              +2.1% this month
                            </Text>
                          </div>
                        </div>
                      </Card>
                    </Col>

                    <Col xs={24} sm={12} lg={8}>
                      <Card className="h-full">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <Text className="text-gray-500 text-sm">
                              Avg Bid Value
                            </Text>
                            <div className="flex items-center mt-1">
                              <Title
                                level={2}
                                className="!mb-0 !mt-0 text-2xl font-semibold"
                              >
                                $185
                              </Title>
                              <BarChartOutlined className="text-blue-500 ml-2" />
                            </div>
                            <Text className="text-green-500 text-xs">
                              +5.7% this month
                            </Text>
                          </div>
                        </div>
                      </Card>
                    </Col>

                    <Col xs={24} sm={12} lg={8}>
                      <Card className="h-full">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <Text className="text-gray-500 text-sm">
                              Pending Review
                            </Text>
                            <div className="flex items-center mt-1">
                              <Title
                                level={2}
                                className="!mb-0 !mt-0 text-2xl font-semibold text-red-500"
                              >
                                1
                              </Title>
                              <AlertOutlined className="text-red-500 ml-2" />
                            </div>
                            <Text className="text-gray-500 text-xs">
                              Require attention
                            </Text>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  </Row>

                  {/* Action Buttons Row */}
                  <Row gutter={[24, 24]} className="mb-6">
                    <Col xs={24}>
                      <Card>
                        <div className="mb-4">
                          <Title level={4} className="!mb-1">
                            Quick Actions
                          </Title>
                          <Text className="text-gray-500">
                            Frequently used bid management tasks
                          </Text>
                        </div>
                        <Row gutter={[16, 16]}>
                          <Col xs={24} sm={8}>
                            <Button
                              type="primary"
                              size="large"
                              icon={<PlusOutlined />}
                              className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                              onClick={handleCreateBid}
                            >
                              Create New Bid
                            </Button>
                          </Col>
                          <Col xs={24} sm={8}>
                            <Button
                              size="large"
                              icon={<EyeOutlined />}
                              className="w-full h-12"
                            >
                              Review Pending Bids
                            </Button>
                          </Col>
                          <Col xs={24} sm={8}>
                            <Button
                              size="large"
                              icon={<BarChartOutlined />}
                              className="w-full h-12"
                            >
                              Generate Report
                            </Button>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  </Row>

                  {/* Recent Activity */}
                  <Row gutter={[24, 24]}>
                    <Col xs={24}>
                      <Card>
                        <div className="mb-4">
                          <Title level={4} className="!mb-1">
                            Recent Bid Activity
                          </Title>
                          <Text className="text-gray-500">
                            Latest bid submissions and responses
                          </Text>
                        </div>
                        <div className="space-y-4">
                          {recentActivities.length === 0 ? (
                            <div className="text-center py-8">
                              <Text className="text-gray-500">
                                No recent bid activity found.
                              </Text>
                            </div>
                          ) : (
                            recentActivities.map((activity, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex items-center space-x-3 flex-1">
                                  <div
                                    className="w-3 h-3 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: activity.color }}
                                  />
                                  <div className="flex-1">
                                    <Text className="font-medium text-gray-800">
                                      {activity.title}
                                    </Text>
                                    {activity.amount && (
                                      <Text className="text-sm text-gray-600 mt-1">
                                        Amount: {activity.amount}
                                      </Text>
                                    )}
                                  </div>
                                </div>
                                <Text className="text-gray-500 text-sm whitespace-nowrap ml-3">
                                  {activity.time}
                                </Text>
                              </div>
                            ))
                          )}
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </div>
              ),
            },
            {
              key: "insights",
              label: (
                <span className="flex items-center">
                  <InfoCircleOutlined className="mr-2" />
                  Insights
                </span>
              ),
              children: (
                <div>
                  {/* Insights Alert Cards */}
                  <Row gutter={[24, 24]} className="mb-6">
                    <Col xs={24} lg={8}>
                      <Card className="border-l-4 border-l-green-500">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <Text strong className="text-green-700">
                                International Route Premium
                              </Text>
                              <Tag color="red" size="small" className="ml-2">
                                High
                              </Tag>
                            </div>
                            <Text className="text-gray-600 text-sm mb-3">
                              JFK-LHR route shows 85% bid acceptance rate with
                              avg bid of $420. Consider raising minimum
                              thresholds.
                            </Text>
                            <div className="mb-2">
                              <Text className="text-gray-500 text-xs">
                                Action:
                              </Text>
                              <br />
                              <Text className="text-sm">
                                Increase minimum bid by 15%
                              </Text>
                            </div>
                            <div>
                              <Text className="text-gray-500 text-xs">
                                Potential:
                              </Text>
                              <br />
                              <Text className="text-green-600 font-medium">
                                $16,000/month
                              </Text>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Col>

                    <Col xs={24} lg={8}>
                      <Card className="border-l-4 border-l-orange-500">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                              <Text strong className="text-orange-700">
                                Short-haul Bid Decline
                              </Text>
                              <Tag color="orange" size="small" className="ml-2">
                                Medium
                              </Tag>
                            </div>
                            <Text className="text-gray-600 text-sm mb-3">
                              Domestic routes under 3 hours show declining bid
                              participation (-12% this month).
                            </Text>
                            <div className="mb-2">
                              <Text className="text-gray-500 text-xs">
                                Action:
                              </Text>
                              <br />
                              <Text className="text-sm">
                                Reduce minimum bid amounts for short routes
                              </Text>
                            </div>
                            <div>
                              <Text className="text-gray-500 text-xs">
                                Potential:
                              </Text>
                              <br />
                              <Text className="text-orange-600 font-medium">
                                $8,500/month
                              </Text>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Col>

                    <Col xs={24} lg={8}>
                      <Card className="border-l-4 border-l-blue-500">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                              <Text strong className="text-blue-700">
                                Dynamic Bid Windows
                              </Text>
                              <Tag color="blue" size="small" className="ml-2">
                                Medium
                              </Tag>
                            </div>
                            <Text className="text-gray-600 text-sm mb-3">
                              High-demand flights could benefit from shorter bid
                              windows to create urgency.
                            </Text>
                            <div className="mb-2">
                              <Text className="text-gray-500 text-xs">
                                Action:
                              </Text>
                              <br />
                              <Text className="text-sm">
                                Implement 12-hour windows for 90%+ load factor
                              </Text>
                            </div>
                            <div>
                              <Text className="text-gray-500 text-xs">
                                Potential:
                              </Text>
                              <br />
                              <Text className="text-blue-600 font-medium">
                                $12,200/month
                              </Text>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  </Row>

                  {/* Route-Level Bid Performance */}
                  <Row gutter={[24, 24]} className="mb-6">
                    <Col xs={24}>
                      <Card>
                        <div className="mb-4">
                          <Title level={4} className="!mb-1 flex items-center">
                            <BarChartOutlined className="mr-2" />
                            Route-Level Bid Performance
                          </Title>
                          <Text className="text-gray-500">
                            Bidding success rates and revenue by route
                          </Text>
                        </div>

                        <Table
                          dataSource={[
                            {
                              key: "1",
                              route: "LAX-JFK",
                              totalBids: 145,
                              accepted: 89,
                              successRate: "61.4%",
                              avgBid: "$285",
                              revenue: "$25,365",
                              demand: "High",
                            },
                            {
                              key: "2",
                              route: "JFK-LHR",
                              totalBids: 89,
                              accepted: 76,
                              successRate: "85.4%",
                              avgBid: "$420",
                              revenue: "$31,920",
                              demand: "Very High",
                            },
                            {
                              key: "3",
                              route: "ORD-SFO",
                              totalBids: 124,
                              accepted: 78,
                              successRate: "62.9%",
                              avgBid: "$195",
                              revenue: "$15,210",
                              demand: "High",
                            },
                            {
                              key: "4",
                              route: "MIA-DEN",
                              totalBids: 76,
                              accepted: 42,
                              successRate: "55.3%",
                              avgBid: "$165",
                              revenue: "$6,930",
                              demand: "Medium",
                            },
                            {
                              key: "5",
                              route: "ATL-SEA",
                              totalBids: 98,
                              accepted: 67,
                              successRate: "68.4%",
                              avgBid: "$225",
                              revenue: "$15,075",
                              demand: "High",
                            },
                          ]}
                          columns={[
                            {
                              title: "Route",
                              dataIndex: "route",
                              key: "route",
                            },
                            {
                              title: "Total Bids",
                              dataIndex: "totalBids",
                              key: "totalBids",
                            },
                            {
                              title: "Accepted",
                              dataIndex: "accepted",
                              key: "accepted",
                            },
                            {
                              title: "Success Rate",
                              dataIndex: "successRate",
                              key: "successRate",
                            },
                            {
                              title: "Avg Bid",
                              dataIndex: "avgBid",
                              key: "avgBid",
                            },
                            {
                              title: "Revenue",
                              dataIndex: "revenue",
                              key: "revenue",
                            },
                            {
                              title: "Demand",
                              dataIndex: "demand",
                              key: "demand",
                              render: (demand) => (
                                <Tag
                                  color={
                                    demand === "Very High"
                                      ? "red"
                                      : demand === "High"
                                        ? "blue"
                                        : "orange"
                                  }
                                >
                                  {demand}
                                </Tag>
                              ),
                            },
                          ]}
                          pagination={false}
                        />
                      </Card>
                    </Col>
                  </Row>

                  {/* Demand & Supply Analysis */}
                  <Row gutter={[24, 24]}>
                    <Col xs={24}>
                      <Card>
                        <div className="mb-4">
                          <Title level={4} className="!mb-1 flex items-center">
                            <RiseOutlined className="mr-2" />
                            Demand & Supply Analysis
                          </Title>
                          <Text className="text-gray-500">
                            Upgrade class demand vs available inventory
                          </Text>
                        </div>

                        <div className="space-y-6">
                          {/* Economy to Premium */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Text strong>Economy to Premium</Text>
                              <Tag color="green">increasing</Tag>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex space-x-8">
                                <div className="text-center">
                                  <Text className="text-2xl font-bold text-blue-600">
                                    78
                                  </Text>
                                  <br />
                                  <Text className="text-xs text-gray-500">
                                    Demand
                                  </Text>
                                </div>
                                <div className="text-center">
                                  <Text className="text-2xl font-bold text-green-600">
                                    45
                                  </Text>
                                  <br />
                                  <Text className="text-xs text-gray-500">
                                    Supply
                                  </Text>
                                </div>
                                <div className="text-center">
                                  <Text className="text-2xl font-bold text-purple-600">
                                    1.73
                                  </Text>
                                  <br />
                                  <Text className="text-xs text-gray-500">
                                    D/S Ratio
                                  </Text>
                                </div>
                                <div className="text-center">
                                  <Text className="text-2xl font-bold text-red-600">
                                    $125
                                  </Text>
                                  <br />
                                  <Text className="text-xs text-gray-500">
                                    Avg Bid
                                  </Text>
                                </div>
                              </div>
                              <Text className="text-gray-500">63.4%</Text>
                            </div>
                            <Progress
                              percent={63.4}
                              strokeColor="var(--textBlue500)"
                            />
                            <Text className="text-gray-500 text-sm">
                              Demand Pressure
                            </Text>
                          </div>

                          {/* Economy to Business */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Text strong>Economy to Business</Text>
                              <Tag color="blue">stable</Tag>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex space-x-8">
                                <div className="text-center">
                                  <Text className="text-2xl font-bold text-blue-600">
                                    85
                                  </Text>
                                  <br />
                                  <Text className="text-xs text-gray-500">
                                    Demand
                                  </Text>
                                </div>
                                <div className="text-center">
                                  <Text className="text-2xl font-bold text-green-600">
                                    25
                                  </Text>
                                  <br />
                                  <Text className="text-xs text-gray-500">
                                    Supply
                                  </Text>
                                </div>
                                <div className="text-center">
                                  <Text className="text-2xl font-bold text-purple-600">
                                    2.6
                                  </Text>
                                  <br />
                                  <Text className="text-xs text-gray-500">
                                    D/S Ratio
                                  </Text>
                                </div>
                                <div className="text-center">
                                  <Text className="text-2xl font-bold text-red-600">
                                    $285
                                  </Text>
                                  <br />
                                  <Text className="text-xs text-gray-500">
                                    Avg Bid
                                  </Text>
                                </div>
                              </div>
                              <Text className="text-gray-500">72.2%</Text>
                            </div>
                            <Progress
                              percent={72.2}
                              strokeColor="var(--infiniti-lighter-blue)"
                            />
                            <Text className="text-gray-500 text-sm">
                              Demand Pressure
                            </Text>
                          </div>

                          {/* Premium to Business */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Text strong>Premium to Business</Text>
                              <Tag color="red">decreasing</Tag>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex space-x-8">
                                <div className="text-center">
                                  <Text className="text-2xl font-bold text-blue-600">
                                    45
                                  </Text>
                                  <br />
                                  <Text className="text-xs text-gray-500">
                                    Demand
                                  </Text>
                                </div>
                                <div className="text-center">
                                  <Text className="text-2xl font-bold text-green-600">
                                    35
                                  </Text>
                                  <br />
                                  <Text className="text-xs text-gray-500">
                                    Supply
                                  </Text>
                                </div>
                                <div className="text-center">
                                  <Text className="text-2xl font-bold text-purple-600">
                                    1.29
                                  </Text>
                                  <br />
                                  <Text className="text-xs text-gray-500">
                                    D/S Ratio
                                  </Text>
                                </div>
                                <div className="text-center">
                                  <Text className="text-2xl font-bold text-red-600">
                                    $180
                                  </Text>
                                  <br />
                                  <Text className="text-xs text-gray-500">
                                    Avg Bid
                                  </Text>
                                </div>
                              </div>
                              <Text className="text-gray-500">56.3%</Text>
                            </div>
                            <Progress
                              percent={56.3}
                              strokeColor="var(--textRed600)"
                            />
                            <Text className="text-gray-500 text-sm">
                              Demand Pressure
                            </Text>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );

  const tabItems = [
    {
      key: "1",
      label: (
        <span className="flex items-center">
          <BarChartOutlined className="mr-2" />
          Dashboard
        </span>
      ),
      children: renderDashboardContent(),
    },
    {
      key: "2",
      label: (
        <span className="flex items-center">
          <ClockCircleOutlined className="mr-2" />
          Active Bids
        </span>
      ),
      children: renderActiveBidsContent(),
    },
    {
      key: "3",
      label: (
        <span className="flex items-center">
          <SettingOutlined className="mr-2" />
          Bid Setup
        </span>
      ),
      children: renderBidSetupContent(),
    },
    {
      key: "4",
      label: (
        <span className="flex items-center">
          <CreditCardOutlined className="mr-2" />
          Payments
        </span>
      ),
      children: renderPaymentsContent(),
    },
    {
      key: "5",
      label: (
        <span className="flex items-center">
          <HistoryOutlined className="mr-2" />
          History
        </span>
      ),
      children: renderHistoryContent(),
    },
  ];

  const ReviewConfirm = ({ formData }) => {
    // Format values for display
    const formatValue = (key, value) => {
      if (value === undefined || value === null) return "-";

      switch (key) {
        case "travelDate":
          return dayjs(value).format("MMMM D, YYYY");
        case "bidStartTime":
        case "bidEndTime":
          return dayjs(value).format("MMMM D, YYYY h:mm A");
        case "mealIncluded":
          return value ? "Yes" : "No";
        case "bidAmount":
        case "suggestedMarketValue":
        case "bidIncrement":
          return `$${value}`;
        default:
          return value.toString();
      }
    };

    // Step groups configuration
    const stepGroups = {
      "Flight & Route Details": [
        "bidTitle",
        "flightType",
        "origin",
        "destination",
        "travelDate",
        "departureTimeRange",
      ],
      "Seat Configurations & Limits": [
        "totalSeatsAvailable",
        "minSeatsPerBid",
        "maxSeatsPerBid",
      ],
      "Bid Pricing & Currency": [
        "bidAmount",
        "suggestedMarketValue",
        "currency",
        "bidIncrement",
      ],
      "Bidding Schedule & Rules": ["bidStartTime", "bidEndTime"],
      "Fare Terms & Ancillaries": [
        "fareType",
        "baggageAllowance",
        "cancellationTerms",
        "mealIncluded",
        "otherNotes",
      ],
    };

    return (
      <div className="space-y-6">
        {Object.entries(stepGroups).map(([title, fields]) => (
          <>
            <Title
              level={5}
              className="text-gray-700 font-semibold mt-6"
              style={{ marginBlockEnd: 0 }}
            >
              {title}
            </Title>
            <Card key={title} className="shadow-sm">
              <Row gutter={[16, 16]}>
                {fields.map((field) => (
                  <Col span={8} key={field}>
                    <div className="mb-2">
                      <Text
                        type="secondary"
                        className="block text-xs uppercase"
                      >
                        {field.replace(/([A-Z])/g, " $1").trim()}
                      </Text>
                      <Text strong className="block">
                        {formatValue(field, formData[field])}
                      </Text>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card>
          </>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Breadcrumb */}
        <BreadcrumbNav currentMenu="Bid Management" />

        {/* Page Header */}
        <div className="mb-6">
          <Title level={2} className="!mb-1 text-gray-900">
            Bid Management
          </Title>
          <Text className="text-gray-600">
            Manage passenger upgrade bids and bidding configurations
          </Text>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Navigation Tabs */}
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            className="px-6"
            items={tabItems}
          />
        </div>
      </div>

      {/* Create New Bid Modal */}
      <Modal
        title={null}
        visible={createBidModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={900}
        centered
        destroyOnClose
        className="modern-modal"
      >
        {/* Custom Modal Header */}
        <div className="bg-white -m-6 mb-0 px-6 py-4 rounded-t-lg border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <PlusOutlined className="text-blue-600 text-lg" />
              </div>
              <div>
                <Title level={4} className="!mb-1 text-gray-800 font-bold">
                  Create New Bid Configuration
                </Title>
                <Text className="text-gray-600 text-sm">
                  Set up a new bidding configuration for your airline route
                </Text>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          <Form form={form} layout="vertical" onFinish={handleFinish}>
            {/* Simple Steps Display */}
            <div className="mb-6">
              <div className="relative">
                {/* Progress Bar Background */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0"></div>
                {/* Active Progress Bar */}
                <div
                  className="absolute top-5 left-0 h-0.5 bg-blue-500 z-10"
                  style={{
                    width: `${(currentStep / (steps.length - 1)) * 100}%`,
                  }}
                ></div>

                {/* Steps */}
                <div className="relative flex justify-between z-20">
                  {steps.map((step, index) => (
                    <div
                      key={step.title}
                      className="flex flex-col items-center"
                    >
                      {/* Step Circle */}
                      <div
                        className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-3
                        ${
                          index < currentStep
                            ? "bg-green-500 border-green-500 text-white"
                            : index === currentStep
                              ? "bg-blue-500 border-blue-500 text-white"
                              : "bg-white border-gray-300 text-gray-500"
                        }
                      `}
                      >
                        {index < currentStep ? (
                          <span className="text-sm">✓</span>
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>

                      {/* Step Title */}
                      <div className="mt-2 text-center max-w-[120px]">
                        <Text
                          className={`
                          text-xs font-medium
                          ${
                            index <= currentStep
                              ? "text-gray-800"
                              : "text-gray-500"
                          }
                        `}
                        >
                          {step.title}
                        </Text>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step Content */}
            <div className="min-h-[380px] bg-gray-50 rounded-lg p-4">
              {/* Step 1: Flight & Route Details */}
              {currentStep === 0 && (
                <div>
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-1 h-5 bg-blue-500 rounded"></div>
                      <Title level={5} className="!mb-0 text-blue-600">
                        Flight & Route Details
                      </Title>
                    </div>
                    <Text className="text-gray-500 text-sm">
                      Configure the basic flight information for bidding
                    </Text>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Form.Item
                          label={
                            <span className="font-semibold text-gray-700">
                              Bid Title *
                            </span>
                          }
                          name="bidTitle"
                          rules={[
                            {
                              required: true,
                              message: "Please enter bid title",
                            },
                            {
                              min: 3,
                              message:
                                "Bid title must be at least 3 characters",
                            },
                          ]}
                        >
                          <Input
                            placeholder="Enter bid configuration title"
                            size="large"
                            className="rounded-md"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={
                            <span className="font-semibold text-gray-700">
                              Flight Type
                            </span>
                          }
                          name="flightType"
                        >
                          <Select
                            placeholder="Select flight type"
                            size="large"
                            className="w-full"
                          >
                            <Select.Option value="Domestic">
                              Domestic
                            </Select.Option>
                            <Select.Option value="International">
                              International
                            </Select.Option>
                            <Select.Option value="Regional">
                              Regional
                            </Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={
                            <span className="font-semibold text-gray-700">
                              Origin Airport (IATA Code) *
                            </span>
                          }
                          name="origin"
                          rules={[
                            {
                              required: true,
                              message: "Please select origin airport",
                            },
                            {
                              min: 2,
                              message: "Please enter a valid airport code",
                            },
                          ]}
                        >
                          <Select
                            mode="combobox"
                            placeholder="Search city / airport"
                            size="large"
                            showSearch
                            allowClear
                            filterOption={(input, option) =>
                              (option?.value ?? "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            suffixIcon={
                              <EnvironmentOutlined className="text-gray-400" />
                            }
                            notFoundContent="No locations found"
                          >
                            {originOptions.map((location) => (
                              <Select.Option key={location} value={location}>
                                {location}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={
                            <span className="font-semibold text-gray-700">
                              Destination Airport (IATA Code) *
                            </span>
                          }
                          name="destination"
                          rules={[
                            {
                              required: true,
                              message: "Please select destination airport",
                            },
                            {
                              min: 2,
                              message: "Please enter a valid airport code",
                            },
                          ]}
                        >
                          <Select
                            mode="combobox"
                            placeholder="Search city / airport"
                            size="large"
                            showSearch
                            allowClear
                            filterOption={(input, option) =>
                              (option?.value ?? "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            suffixIcon={
                              <EnvironmentOutlined className="text-gray-400" />
                            }
                            notFoundContent="No locations found"
                          >
                            {destinationOptions.map((location) => (
                              <Select.Option key={location} value={location}>
                                {location}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={
                            <span className="font-semibold text-gray-700">
                              Travel Date *
                            </span>
                          }
                          name="travelDate"
                        >
                          <DatePicker
                            className="w-full"
                            size="large"
                            format="DD MMM YYYY"
                            disabledDate={(current) =>
                              current && current.isBefore(new Date(), "day")
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={
                            <span className="font-semibold text-gray-700">
                              Preferred Departure Time Range
                            </span>
                          }
                          name="departureTimeRange"
                        >
                          <TimePicker.RangePicker
                            className="w-full"
                            format="HH:mm"
                            size="large"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                </div>
              )}

              {/* Step 2: Seat Configurations & Limits */}
              {currentStep === 1 && (
                <div>
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-1 h-5 bg-green-500 rounded"></div>
                      <Title level={5} className="!mb-0 text-green-600">
                        Seat Configurations & Limits
                      </Title>
                    </div>
                    <Text className="text-gray-500 text-sm">
                      Set up seating classes and availability limits
                    </Text>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Form.Item
                          label={
                            <span className="font-semibold text-gray-700">
                              Total Seats Available
                            </span>
                          }
                          name="totalSeatsAvailable"
                        >
                          <InputNumber
                            min={1}
                            className="w-full"
                            placeholder="50"
                            size="large"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={
                            <span className="font-semibold text-gray-700">
                              Min Seats per Bid
                            </span>
                          }
                          name="minSeatsPerBid"
                        >
                          <InputNumber
                            min={1}
                            className="w-full"
                            placeholder="5"
                            size="large"
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Form.Item
                          label={
                            <span className="font-semibold text-gray-700">
                              Max Seats per Bid
                            </span>
                          }
                          name="maxSeatsPerBid"
                        >
                          <InputNumber
                            min={1}
                            className="w-full"
                            placeholder="20"
                            size="large"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                </div>
              )}

              {/* Step 3: Bid Pricing & Currency */}
              {currentStep === 2 && (
                <div>
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-1 h-5 bg-purple-500 rounded"></div>
                      <Title level={5} className="!mb-0 text-purple-600">
                        Bid Pricing & Currency
                      </Title>
                    </div>
                    <Text className="text-gray-500 text-sm">
                      Configure pricing parameters and currency settings
                    </Text>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Form.Item
                          label={
                            <span className="font-semibold text-gray-700">
                              Minimum Bid Price (per seat)
                            </span>
                          }
                          name="bidAmount"
                        >
                          <InputNumber
                            min={1}
                            max={999999}
                            className="w-full"
                            placeholder="100"
                            size="large"
                            controls={true}
                            keyboard={true}
                            formatter={(value) =>
                              value
                                ? `$ ${value}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ",",
                                  )
                                : ""
                            }
                            parser={(value) =>
                              value?.replace(/\$\s?|(,*)/g, "") || ""
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={
                            <span className="font-semibold text-gray-700">
                              Suggested Market Value
                            </span>
                          }
                          name="suggestedMarketValue"
                        >
                          <InputNumber
                            min={1}
                            max={999999}
                            className="w-full"
                            placeholder="200"
                            size="large"
                            controls={true}
                            keyboard={true}
                            formatter={(value) =>
                              value
                                ? `$ ${value}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ",",
                                  )
                                : ""
                            }
                            parser={(value) =>
                              value?.replace(/\$\s?|(,*)/g, "") || ""
                            }
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Form.Item
                          label={
                            <span className="font-semibold text-gray-700">
                              Currency
                            </span>
                          }
                          name="currency"
                        >
                          <Select
                            placeholder="Select currency"
                            size="large"
                            options={[
                              { value: "INR", label: "INR - Indian Rupee" },
                              { value: "USD", label: "USD - US Dollar" },
                              { value: "EUR", label: "EUR - Euro" },
                            ]}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={
                            <span className="font-semibold text-gray-700">
                              Bid Increment
                            </span>
                          }
                          name="bidIncrement"
                        >
                          <InputNumber
                            min={1}
                            max={10000}
                            className="w-full"
                            placeholder="5"
                            size="large"
                            controls={true}
                            keyboard={true}
                            formatter={(value) =>
                              value
                                ? `$ ${value}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ",",
                                  )
                                : ""
                            }
                            parser={(value) =>
                              value?.replace(/\$\s?|(,*)/g, "") || ""
                            }
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                </div>
              )}

              {/* Step 4: Bidding Schedule & Rules */}
              {currentStep === 3 && (
                <div>
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-1 h-5 bg-blue-500 rounded"></div>
                      <Title level={5} className="!mb-0 text-blue-600">
                        Bidding Schedule & Rules
                      </Title>
                    </div>
                    <Text className="text-gray-500 text-sm">
                      Configure bidding schedule and automation settings
                    </Text>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Form.Item
                          label={
                            <span className="font-semibold text-gray-700">
                              Bid Start Time *
                            </span>
                          }
                          name="bidStartTime"
                        >
                          <DatePicker
                            showTime={{ format: "HH:mm" }}
                            format="DD MMM YYYY HH:mm"
                            placeholder="Select start time"
                            className="w-full"
                            size="large"
                            disabledDate={(current) =>
                              current && current.isBefore(new Date(), "day")
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={
                            <span className="font-semibold text-gray-700">
                              Bid End Time *
                            </span>
                          }
                          name="bidEndTime"
                        >
                          <DatePicker
                            showTime={{ format: "HH:mm" }}
                            format="DD MMM YYYY HH:mm"
                            placeholder="Select end time"
                            className="w-full"
                            size="large"
                            disabledDate={(current) =>
                              current && current.isBefore(new Date(), "day")
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <div className="space-y-4">
                          <div className="p-4 border rounded-lg">
                            <Form.Item
                              label={
                                <span className="font-semibold text-gray-700">
                                  Auto-Award Top Bidder
                                </span>
                              }
                              name="autoAwardTopBidder"
                              valuePropName="checked"
                              className="!mb-2"
                            >
                              <Switch
                                size="default"
                                checkedChildren="ON"
                                unCheckedChildren="OFF"
                              />
                            </Form.Item>
                            <Text className="text-gray-500 text-sm">
                              Automatically accept the highest valid bid when
                              bidding ends
                            </Text>
                          </div>

                          <div className="p-4 border rounded-lg">
                            <Form.Item
                              label={
                                <span className="font-semibold text-gray-700">
                                  Manual Review Option
                                </span>
                              }
                              name="manualReviewOption"
                              valuePropName="checked"
                              className="!mb-2"
                            >
                              <Switch
                                size="default"
                                checkedChildren="ON"
                                unCheckedChildren="OFF"
                              />
                            </Form.Item>
                            <Text className="text-gray-500 text-sm">
                              Allow manual review and approval before awarding
                              bids
                            </Text>
                          </div>

                          <div className="p-4 border rounded-lg">
                            <Form.Item
                              label={
                                <span className="font-semibold text-gray-700">
                                  Auto Refund Non-Winners
                                </span>
                              }
                              name="autoRefundNonWinners"
                              valuePropName="checked"
                              className="!mb-2"
                            >
                              <Switch
                                size="default"
                                checkedChildren="ON"
                                unCheckedChildren="OFF"
                              />
                            </Form.Item>
                            <Text className="text-gray-500 text-sm">
                              Automatically refund unsuccessful bidders when
                              bids are awarded
                            </Text>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              )}

              {/* Step 5: Fare Terms & Ancillaries */}
              {currentStep === 4 && (
                <div>
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-1 h-5 bg-teal-500 rounded"></div>
                      <Title level={5} className="!mb-0 text-teal-600">
                        Fare Terms & Ancillaries
                      </Title>
                    </div>
                    <Text className="text-gray-500 text-sm">
                      Configure fare conditions and additional services
                    </Text>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <Row gutter={[16, 16]}>
                      <Col span={8}>
                        <Form.Item
                          label={
                            <span className="font-semibold text-gray-700">
                              Fare Type
                            </span>
                          }
                          name="fareType"
                        >
                          <Select
                            placeholder="Select fare type"
                            size="large"
                            options={[
                              { value: "Economy", label: "Economy" },
                              {
                                value: "Premium Economy",
                                label: "Premium Economy",
                              },
                              { value: "Business", label: "Business" },
                              { value: "First Class", label: "First Class" },
                            ]}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          label={
                            <span className="font-semibold text-gray-700">
                              Baggage Allowance (kg)
                            </span>
                          }
                          name="baggageAllowance"
                        >
                          <InputNumber
                            min={0}
                            max={50}
                            className="w-full"
                            placeholder="15"
                            size="large"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          label={
                            <span className="font-semibold text-gray-700">
                              Cancellation Terms
                            </span>
                          }
                          name="cancellationTerms"
                        >
                          <Select
                            placeholder="Select terms"
                            size="large"
                            options={[
                              { value: "Flexible", label: "Flexible" },
                              { value: "Standard", label: "Standard" },
                              { value: "Restrictive", label: "Restrictive" },
                              {
                                value: "Non-refundable",
                                label: "Non-refundable",
                              },
                            ]}
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={[16, 16]} className="mt-4">
                      <Col span={24}>
                        <Form.Item
                          name="mealIncluded"
                          valuePropName="checked"
                          className="!mb-4"
                        >
                          <Checkbox className="text-gray-700 font-semibold">
                            Meal Included
                          </Checkbox>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={[16, 16]}>
                      <Col span={24}>
                        <Form.Item
                          label={
                            <span className="font-semibold text-gray-700">
                              Other Notes
                            </span>
                          }
                          name="otherNotes"
                        >
                          <Input.TextArea
                            rows={3}
                            placeholder="Optional: targeting weddings, students, events, etc."
                            size="large"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                </div>
              )}

              {/* Step 6: Review & Confirm */}
              {currentStep === 5 && (
                <div>
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-1 h-5 bg-yellow-500 rounded"></div>
                      <Title level={5} className="!mb-0 text-yellow-600">
                        Review & Confirm
                      </Title>
                    </div>
                    <Text className="text-gray-500 text-sm">
                      Review all configurations before creating the bid
                    </Text>
                  </div>
                  <ReviewConfirm formData={form.getFieldsValue(true)} />
                </div>
              )}
            </div>

            {/* Navigation Footer */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <div>
                {currentStep > 0 && (
                  <Button onClick={handlePrev} className="px-4">
                    <span className="mr-1">←</span>
                    Previous
                  </Button>
                )}
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleModalCancel} className="px-4">
                  Cancel
                </Button>
                {currentStep < steps.length - 1 ? (
                  <Button
                    type="primary"
                    onClick={
                      () => handleNext()
                      // currentStep === steps.length - 2
                      //   ? (handleFormattedData(), handleNext())
                      //   : handleNext()
                    }
                    className="px-4 bg-blue-600 hover:bg-blue-700"
                  >
                    Next
                    <span className="ml-1">→</span>
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    onClick={() => form.submit()}
                    className="px-6 bg-green-600 hover:bg-green-700"
                    loading={loading}
                  >
                    <PlusOutlined className="mr-1" />
                    Create Bid
                  </Button>
                )}
              </div>
            </div>
          </Form>
        </div>
      </Modal>

      <style>{`
        .ant-tabs-nav {
          margin-bottom: 0;
        }

        .ant-tabs-tab {
          padding: 12px 20px;
          font-weight: 500;
        }

        .ant-tabs-tab-active {
          background-color: #f8fafc;
          border-bottom: 2px solid var(--textBlue500);
        }

        .ant-card {
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          border: 1px solid var(--ant-border-color);
        }

        .ant-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .ant-statistic-title {
          font-size: 14px;
          color: #6b7280;
        }

        .ant-statistic-content {
          color: #1f2937;
          font-weight:600;
          font-family: var(--ant-font-family) !important;
        }

        .ant-steps-item-process .ant-steps-item-icon {
          background-color: var(--textBlue500);
          border-color: var(--textBlue500);
        }

        .modern-modal .ant-modal-content {
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .modern-modal .ant-modal-body {
          padding: 0;
        }

        .modern-modal .ant-modal-close {
          top: 24px;
          right: 24px;
          color: #000000;
          font-size: 20px;
          width: 40px;
          height: 40px;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .modern-modal .ant-modal-close:hover {
          background: rgba(0, 0, 0, 0.1);
          color: #000000;
          transform: scale(1.1);
        }

        .modern-modal .ant-modal-close-x {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }

        .ant-radio-wrapper {
          border: 1px solid transparent;
          border-radius: 8px;
          padding: 12px;
          margin: 0;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .ant-radio-wrapper:hover {
          background-color: #f8fafc;
          border-color: #e2e8f0;
        }

        .ant-radio-wrapper-checked {
          background-color: #eff6ff;
          border-color: var(--textBlue500);
        }

        .ant-checkbox-wrapper {
          border: 1px solid transparent;
          border-radius: 8px;
          padding: 12px;
          margin: 0;
          display: flex;
          align-items: flex-start;
          width: 100%;
        }

        .ant-checkbox-wrapper:hover {
          background-color: #f8fafc;
          border-color: #e2e8f0;
        }

        .ant-checkbox-wrapper-checked {
          background-color: #eff6ff;
          border-color: var(--textBlue500);
        }

        .ant-form-item-label > label {
          font-weight: 600;
          color: #374151;
        }

        .ant-select-selector,
        .ant-picker,
        .ant-input-number,
        .ant-input {
          border-radius: 8px !important;
          border: 2px solid #e5e7eb !important;
        }

        .ant-select-selector:hover,
        .ant-picker:hover,
        .ant-input-number:hover,
        .ant-input:hover {
          border-color: var(--textBlue500) !important;
        }

        .ant-select-focused .ant-select-selector,
        .ant-picker-focused,
        .ant-input-number-focused,
        .ant-input-focused {
          border-color: var(--textBlue500) !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }
        .search-input {
          .ant-input {
            border: unset !important;
          }
        }
      `}</style>
    </>
  );
}