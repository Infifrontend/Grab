import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Input,
  Radio,
  Space,
  Divider,
  Form,
  Alert,
  Modal,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  CreditCardOutlined,
  BankOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { localStorageAccessor } from "../utils/browserStorage";

const { Title, Text } = Typography;

export default function PaymentDetails() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const params = useParams<any>();

  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [bidParticipationData, setBidParticipationData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentReference, setPaymentReference] = useState("");

  useEffect(() => {
    const loadBidData = async () => {
      // Load bid participation data from localStorage
      const storedData = localStorageAccessor("bidParticipationData")?.[0]();

      if (storedData) {
        const parsedData = storedData;
        // Ensure configData exists with fallback values
        if (!parsedData.configData) {
          parsedData.configData = {
            title: "Bid Payment",
            route: "Route not specified",
            travelDate: "Date not specified",
          };
        }
        setBidParticipationData(parsedData);
      } else {
        // If no localStorage data, try to fetch from API and create participation data
        const bidId = params.bidId;
        console.log("Bid ID from params:", bidId, "Full params:", params);
        if (bidId) {
          try {
            console.log(
              `No localStorage data, fetching bid ${bidId} to create participation data`,
            );
            const response = await fetch(`/api/bids/${bidId}`);

            if (response.ok) {
              const bidData = await response.json();
              console.log("Received bid data for participation:", bidData);

              if (bidData.success && bidData.bid) {
                // Parse configuration data from notes
                let configData = {};
                try {
                  configData = bidData.bid.notes
                    ? JSON.parse(bidData.bid.notes)
                    : {};
                } catch (e) {
                  console.log("Could not parse bid notes:", e);
                }

                // Create participation data from bid
                const bidAmountValue = parseFloat(
                  bidData.bid.bidAmount?.toString() || "0",
                );
                const passengerCountValue = parseInt(
                  bidData.bid.passengerCount?.toString() || "1",
                );

                const participationData = {
                  totalBid: bidAmountValue * passengerCountValue,
                  bidAmount: bidAmountValue,
                  passengerCount: passengerCountValue,
                  configData: {
                    title:
                      configData.title || bidData.bid.notes || "Bid Payment",
                    route: `${configData.origin || bidData.flight?.origin || "Unknown"} → ${configData.destination || bidData.flight?.destination || "Unknown"}`,
                    travelDate:
                      configData.travelDate ||
                      (bidData.flight?.departureTime
                        ? new Date(bidData.flight.departureTime)
                            .toISOString()
                            .split("T")[0]
                        : "Unknown"),
                  },
                };

                console.log(
                  "Created participation data from bid:",
                  participationData,
                );
                setBidParticipationData(participationData);
                return;
              } else {
                console.error(
                  "Bid data response missing success or bid:",
                  bidData,
                );
              }
            }
          } catch (error) {
            console.error("Error fetching bid data for participation:", error);
          }
        }

        // If all else fails, redirect back to bids
        navigate("/bids");
      }
    };

    loadBidData();
  }, [navigate, params.bidId]);

  const handleBack = () => {
    navigate(`/bid-details/${params.bidId}`);
  };

  const handlePaymentSubmit = async () => {
    console.log(params);
    if (!paymentMethod) {
      message.error("Please select a payment method");
      return;
    }

    // Get the bid ID from the URL params
    const bidId = params?.bidId;
    console.log("Bid ID from params:", bidId, "Full params object:", params);
    if (!bidId) {
      console.error("Bid ID is undefined. Params:", params);
      message.error("Bid ID not found");
      // navigate("/bids");
      return;
    }

    // Validate form based on payment method
    if (paymentMethod === "creditCard") {
      try {
        await form.validateFields();
      } catch (error) {
        message.error("Please fill in all required card details");
        return;
      }
    }

    setLoading(true);

    try {
      console.log(`Processing payment for bid ID: ${bidId}`);

      // First, verify the bid exists and is in a valid state for payment
      let bidCheckResponse;
      let bidData;

      try {
        bidCheckResponse = await fetch(`/api/bids/${bidId}`);
        if (!bidCheckResponse.ok) {
          console.error(
            `Bid check failed with status: ${bidCheckResponse.status}`,
          );
          throw new Error(`Bid not found (ID: ${bidId})`);
        }
        bidData = await bidCheckResponse.json();
        console.log("Bid data for payment verification:", bidData);

        if (!bidData || !bidData.success || !bidData.bid) {
          console.error("Invalid bid data structure:", bidData);
          throw new Error(`Bid ID ${bidId} not found or invalid`);
        }
      } catch (fetchError) {
        console.error("Error fetching bid:", fetchError);
        throw new Error(
          `Unable to verify bid ${bidId}. Please check if the bid exists.`,
        );
      }
      console.log("Bid data for payment verification:", bidData);
      // Check if payment has already been completed
      if (bidData.bid?.bidStatus === "completed") {
        try {
          const notes = bidData.bid.notes ? JSON.parse(bidData.bid.notes) : {};
          if (notes.paymentInfo?.paymentCompleted === true) {
            message.error("Payment has already been completed for this bid");
            navigate("/bids");
            return;
          }
        } catch (noteError) {
          console.log("Could not parse bid notes:", noteError);
        }
      }

      const formValues =
        paymentMethod === "creditCard" ? form.getFieldsValue() : {};

      // First, submit the retail bid
      const [getUserId] = localStorageAccessor("userId");
      const [getUserEmail] = localStorageAccessor("userEmail");
      const [getUserName] = localStorageAccessor("userName");
      const [getUserRole] = localStorageAccessor("userRole");
      const [getUserLoggedIn] = localStorageAccessor("userLoggedIn");

      let userId = getUserId();
      let userEmail = getUserEmail();
      let userName = getUserName();
      let userRole = getUserRole();
      let userLoggedIn = getUserLoggedIn();

      // Fallback to direct localStorage access if accessor returns null
      if (!userId) {
        userId = localStorage.getItem("userId");
        userEmail = localStorage.getItem("userEmail");
        userName = localStorage.getItem("userName");
        userRole = localStorage.getItem("userRole");
        userLoggedIn = localStorage.getItem("userLoggedIn");
      }

      console.log("Retrieved user information from localStorage:", {
        userId,
        userEmail,
        userName,
        userRole,
        userLoggedIn,
      });

      if (!userId) {
        throw new Error("Please log in to submit a bid");
      }

      console.log(
        `Creating payment for user ${userId} (${userName}) and bid ${bidId}`,
      );

      if (bidId && userId) {
        console.log("Submitting retail bid before payment...");
        console.log("bidParticipationData:", bidParticipationData);

        // Validate bidParticipationData exists
        if (!bidParticipationData) {
          throw new Error(
            "Bid participation data is missing. Please go back and enter your bid details.",
          );
        }

        // Ensure bidId and userId are valid
        const validBidId = parseInt(bidId);
        const validUserId = parseInt(userId);

        if (isNaN(validBidId) || validBidId <= 0) {
          throw new Error("Invalid bid ID");
        }
        if (isNaN(validUserId) || validUserId <= 0) {
          throw new Error("Invalid user ID");
        }

        // Prepare retail bid data with exact field names expected by the API
        const submittedAmountValue =
          bidParticipationData.bidAmount ||
          bidParticipationData.totalBid / bidParticipationData.passengerCount ||
          0;

        const retailBidData = {
          bidId: validBidId,
          userId: validUserId,
          submittedAmount: parseFloat(submittedAmountValue.toString()),
          passengerCount: parseInt(
            bidParticipationData.passengerCount?.toString() || "1",
          ),
        };

        // Additional validation with detailed error messages
        if (
          !retailBidData.submittedAmount ||
          retailBidData.submittedAmount <= 0
        ) {
          throw new Error(
            `Invalid bid amount: ${retailBidData.submittedAmount}. Please check your bid details.`,
          );
        }
        if (
          !retailBidData.passengerCount ||
          retailBidData.passengerCount <= 0
        ) {
          throw new Error(
            `Invalid passenger count: ${retailBidData.passengerCount}. Must be at least 1.`,
          );
        }

        // Log the data being sent for debugging
        console.log("Retail bid data validation passed:", {
          bidId: retailBidData.bidId,
          userId: retailBidData.userId,
          submittedAmount: retailBidData.submittedAmount,
          passengerCount: retailBidData.passengerCount,
          originalBidParticipationData: bidParticipationData,
        });

        console.log("Retail bid data being sent:", retailBidData);

        const retailBidResponse = await fetch("/api/retail-bids", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(retailBidData),
        });

        if (!retailBidResponse.ok) {
          const retailBidError = await retailBidResponse
            .json()
            .catch(() => ({}));
          throw new Error(retailBidError.message || "Failed to submit bid");
        }

        const retailBidResult = await retailBidResponse.json();
        console.log("Retail bid submitted successfully:", retailBidResult);
console.log(userId,'userIdddddd')
        // Create payment record using bid ID
        const paymentResponse = await fetch("/api/payments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bidId: parseInt(bidId),
            userId: parseInt(userId), // Current user ID from localStorage
            userEmail: userEmail,
            userName: userName,
            userRole: userRole,
            userLoggedIn: userLoggedIn,
            bookingId: null, // Set to null for bid payments to avoid foreign key issues
            amount: (bidParticipationData?.totalBid || 0).toString(),
            currency: "USD",
            paymentMethod: paymentMethod,
            paymentStatus: "completed",
            paymentType: "full_payment",
            cardDetails: paymentMethod === "creditCard" ? formValues : null,
          }),
        });

        if (!paymentResponse.ok) {
          const errorData = await paymentResponse.json().catch(() => ({}));
          throw new Error(
            errorData.message ||
              `Payment processing failed: ${paymentResponse.status}`,
          );
        }

        const paymentResult = await paymentResponse.json();
        console.log("Payment created successfully:", paymentResult);

        // Update bid status to completed after successful payment
        const bidUpdateResponse = await fetch(
          `/api/bids/${bidId}/payment-status`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              bidStatus: "completed",
              paymentStatus: "Paid",
              passengerCount: bidParticipationData.passengerCount,
              bidAmount: bidParticipationData.bidAmount,
            }),
          },
        );

        if (!bidUpdateResponse.ok) {
          console.warn("Payment succeeded but bid status update failed");
          // Don't throw error here as payment was successful
        }

        // Store payment reference for display
        setPaymentReference(
          paymentResult.paymentReference || `PAY-${bidId}-${Date.now()}`,
        );

        // Clear localStorage
        localStorage.removeItem("bidParticipationData");

        message.success("Bid submitted and payment processed successfully!");

        // Show success modal
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      message.error(error.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessModalOk = () => {
    setShowSuccessModal(false);
    navigate("/bids");
  };

  if (!bidParticipationData) {
    return null;
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            className="mb-4 p-0 h-auto text-gray-600 hover:text-blue-600 font-medium"
          >
            Back to Bid Details
          </Button>

          <Title level={2} className="!mb-2 text-gray-900">
            Payment Details
          </Title>
          <Text className="text-gray-600">
            Complete your bid by paying the required deposit. This amount will
            be refunded if your bid is not accepted.
          </Text>
        </div>

        <Row gutter={24}>
          {/* Left Column - Payment Form */}
          <Col xs={24} lg={14}>
            <Card className="mb-6">
              <Title level={4} className="!mb-4 text-gray-800">
                Payment Summary
              </Title>

              <Alert
                message="Deposit Information"
                description="This deposit secures your participation in the bid. If your bid is not accepted by the airline, the full amount will be refunded within 5-7 business days."
                type="info"
                showIcon
                className="mb-6"
              />

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Text className="text-gray-500 text-sm block mb-1">
                      Total Bid Amount:
                    </Text>
                    <Text className="text-gray-900 font-semibold text-lg">
                      ${(bidParticipationData?.totalBid || 0).toLocaleString()}
                    </Text>
                  </Col>
                  <Col span={12}>
                    <Text className="text-gray-500 text-sm block mb-1">
                      Deposit Required:
                    </Text>
                    <Text className="text-blue-600 font-bold text-xl">
                      ${(bidParticipationData?.totalBid || 0).toLocaleString()}
                    </Text>
                  </Col>
                </Row>
              </div>
            </Card>

            {/* Payment Method */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <CreditCardOutlined className="text-blue-600" />
                <Title level={4} className="!mb-0 text-gray-800">
                  Payment Method
                </Title>
              </div>

              <Radio.Group
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full"
              >
                <Space direction="vertical" className="w-full" size={16}>
                  <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <Radio value="creditCard" className="!flex !items-start">
                      <div className="flex-1 ml-2">
                        <div className="flex items-center gap-2 mb-2">
                          <CreditCardOutlined className="text-blue-600" />
                          <Text className="font-semibold text-gray-900">
                            Credit/Debit Card
                          </Text>
                        </div>
                        <Text className="text-gray-600 text-sm block mb-3">
                          Pay securely with your credit or debit card.
                        </Text>

                        {paymentMethod === "creditCard" && (
                          <Form form={form} layout="vertical" className="mt-4">
                            <Row gutter={16}>
                              <Col xs={24} md={12}>
                                <Form.Item
                                  label="Card Number"
                                  name="cardNumber"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please enter card number",
                                    },
                                  ]}
                                >
                                  <Input
                                    placeholder="1234 5678 9012 3456"
                                    size="large"
                                  />
                                </Form.Item>
                              </Col>
                              <Col xs={24} md={12}>
                                <Form.Item
                                  label="Cardholder Name"
                                  name="cardholderName"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please enter cardholder name",
                                    },
                                  ]}
                                >
                                  <Input placeholder="John Doe" size="large" />
                                </Form.Item>
                              </Col>
                            </Row>
                            <Row gutter={16}>
                              <Col xs={24} md={12}>
                                <Form.Item
                                  label="Expiry Date"
                                  name="expiryDate"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please enter expiry date",
                                    },
                                  ]}
                                >
                                  <Input placeholder="MM/YY" size="large" />
                                </Form.Item>
                              </Col>
                              <Col xs={24} md={12}>
                                <Form.Item
                                  label="CVV"
                                  name="cvv"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please enter CVV",
                                    },
                                  ]}
                                >
                                  <Input placeholder="123" size="large" />
                                </Form.Item>
                              </Col>
                            </Row>
                          </Form>
                        )}
                      </div>
                    </Radio>
                  </div>

                  <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <Radio value="bankTransfer" className="!flex !items-start">
                      <div className="flex-1 ml-2">
                        <div className="flex items-center gap-2 mb-2">
                          <BankOutlined className="text-blue-600" />
                          <Text className="font-semibold text-gray-900">
                            Bank Transfer
                          </Text>
                        </div>
                        <Text className="text-gray-600 text-sm block">
                          Direct bank transfer. Payment confirmation may take
                          1-2 business days.
                        </Text>
                      </div>
                    </Radio>
                  </div>
                </Space>
              </Radio.Group>
            </Card>
          </Col>

          {/* Right Column - Bid Summary */}
          <Col xs={24} lg={10}>
            <Card className="sticky" style={{ top: "12%" }}>
              <Title level={4} className="!mb-4 text-gray-800">
                Bid Summary
              </Title>

              <Row className="mb-6 gap-x-9 gap-y-5">
                <Col xl={11}>
                  <Text className="text-gray-500 text-sm block mb-1">
                    Bid Configuration
                  </Text>
                  <Text className="text-gray-900 font-medium">
                    {bidParticipationData?.configData?.title || "Bid Payment"}
                  </Text>
                </Col>

                <Col xl={11}>
                  <Text className="text-gray-500 text-sm block mb-1">
                    Route
                  </Text>
                  <Text className="text-gray-900 font-medium">
                    {bidParticipationData?.configData?.route ||
                      "Route not specified"}
                  </Text>
                </Col>

                <Col xl={11}>
                  <Text className="text-gray-500 text-sm block mb-1">
                    Travel Date
                  </Text>
                  <Text className="text-gray-900 font-medium">
                    {bidParticipationData?.configData?.travelDate ||
                      "Date not specified"}
                  </Text>
                </Col>

                <Col xl={11}>
                  <Text className="text-gray-500 text-sm block mb-1">
                    Passengers
                  </Text>
                  <Text className="text-gray-900 font-medium">
                    {bidParticipationData.passengerCount} passenger
                    {bidParticipationData.passengerCount > 1 ? "s" : ""}
                  </Text>
                </Col>

                <Col xl={11}>
                  <Text className="text-gray-500 text-sm block mb-1">
                    Bid Amount (per person)
                  </Text>
                  <Text className="text-gray-900 font-medium">
                    ${(bidParticipationData.bidAmount || 0).toLocaleString()}
                  </Text>
                </Col>
              </Row>

              <Divider />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Text className="text-gray-600">Total Bid Amount</Text>
                  <Text className="text-gray-900 font-semibold">
                    ${(bidParticipationData?.totalBid || 0).toLocaleString()}
                  </Text>
                </div>

                {/* <div className="flex justify-between">
                  <Text className="text-gray-600">Deposit Required (10%)</Text>
                  <Text className="text-blue-600 font-bold text-lg">
                    ${bidParticipationData.depositRequired.toLocaleString()}
                  </Text>
                </div> */}
              </div>

              <Divider />

              <Button
                type="primary"
                size="large"
                block
                loading={loading}
                onClick={handlePaymentSubmit}
                className="bg-blue-600 hover:bg-blue-700 font-semibold"
              >
                Pay ${(bidParticipationData?.totalBid || 0).toLocaleString()} &
                Submit Bid
              </Button>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Success Modal */}
      <Modal
        title={null}
        open={showSuccessModal}
        onOk={handleSuccessModalOk}
        onCancel={handleSuccessModalOk}
        footer={[
          <Button
            key="ok"
            type="primary"
            onClick={handleSuccessModalOk}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Continue
          </Button>,
        ]}
        centered
        width={500}
      >
        <div className="text-center py-6">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleOutlined className="text-green-600 text-2xl" />
            </div>
            <Typography.Title level={3} className="!mb-2 text-gray-900">
              Bid Submitted Successfully!
            </Typography.Title>
            <Typography.Text className="text-gray-600 text-lg">
              Your bid has been submitted and payment processed successfully.
            </Typography.Text>
          </div>

          {paymentReference && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <Typography.Text className="text-blue-700 block mb-2">
                Payment Reference Number
              </Typography.Text>
              <Typography.Text className="text-blue-900 font-bold text-xl">
                {paymentReference}
              </Typography.Text>
            </div>
          )}

          <div className="space-y-3 text-left">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-xs font-medium">1</span>
              </div>
              <Typography.Text className="text-gray-700">
                Your bid is now active and will be reviewed by airlines
              </Typography.Text>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-xs font-medium">2</span>
              </div>
              <Typography.Text className="text-gray-700">
                You'll be notified of the bid result within 48 hours
              </Typography.Text>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-xs font-medium">3</span>
              </div>
              <Typography.Text className="text-gray-700">
                If not accepted, your deposit will be refunded automatically
              </Typography.Text>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
