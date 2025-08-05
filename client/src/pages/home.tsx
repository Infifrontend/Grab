import QuickBookingForm from "@/components/booking/quick-booking-form";
import ActiveBidsSection from "@/components/bids/active-bids-section";
import MarketplaceSection from "@/components/marketplace/marketplace-section";
import RecentBookingsSection from "@/components/bookings/recent-bookings-section";
import { Alert, Button } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleBidsRedirect = () => {
    navigate("/bids");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      {/* Top Banner */}
      <Alert
        message={
          <div className="flex items-center justify-between w-full">
            <div className="relative overflow-hidden h-6 w-full marquee-wrapper">
              <div className="flex animate-marquee whitespace-nowrap">
                <span className="mr-12 font-semibold">
                  <strong>Exclusive Bid Prices Open!:</strong> Want to travel on
                  a specific route? Submit your bid for your preferred dates and
                  number of seats. If accepted, enjoy a special discounted rate
                  tailored just for you!
                </span>
                <span className="mr-20 font-semibold">
                  <strong>Exclusive Bid Prices Open!:</strong> Want to travel on
                  a specific route? Submit your bid for your preferred dates and
                  number of seats. If accepted, enjoy a special discounted rate
                  tailored just for you!
                </span>
              </div>
            </div>

            <Button
              type="link"
              size="small"
              onClick={handleBidsRedirect}
              className="ml-4 text-orange-600 font-semibold hover:text-orange-700 flex-shrink-0"
              style={{ padding: "0 8px", textDecoration: "underline" }}
            >
              Click here
            </Button>
          </div>
        }
        type="warning"
        icon={<InfoCircleOutlined />}
        showIcon
        className="mb-6 border-l-4 border-orange-500"
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-5">
          <QuickBookingForm />
        </div>
        <div className="lg:col-span-7">
          <ActiveBidsSection />
        </div>
      </div>

      {/* Marketplace Section */}
      <div className="mb-8">
        <MarketplaceSection />
      </div>

      {/* Recent Bookings Section */}
      <div>
        <RecentBookingsSection />
      </div>
    </div>
  );
}
