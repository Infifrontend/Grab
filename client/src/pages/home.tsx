import Header from "@/components/layout/header";
import QuickBookingForm from "@/components/booking/quick-booking-form";
import HotDealsSection from "@/components/deals/hot-deals-section";
import MarketplaceSection from "@/components/marketplace/marketplace-section";
import RecentBookingsSection from "@/components/bookings/recent-bookings-section";
import { Alert } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Top Banner */}
        <Alert
          message={
            <span>
              <strong>Exclusive 60% Prices Offer:</strong> Submit your bid for your preferred dates and number of seats. 
              If accepted, enjoy a special discounted rate tailored just for you!
            </span>
          }
          type="warning"
          icon={<InfoCircleOutlined />}
          showIcon
          className="mb-6 border-l-4 border-orange-500"
          style={{ 
            backgroundColor: '#FFF4E6',
            borderColor: '#FFE7D1'
          }}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          <div className="lg:col-span-5">
            <QuickBookingForm />
          </div>
          <div className="lg:col-span-7">
            <HotDealsSection />
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
    </div>
  );
}
