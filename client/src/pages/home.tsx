import Header from "@/components/layout/header";
import QuickBookingForm from "@/components/booking/quick-booking-form";
import HotDealsSection from "@/components/deals/hot-deals-section";
import MarketplaceSection from "@/components/marketplace/marketplace-section";
import RecentBookingsSection from "@/components/bookings/recent-bookings-section";
import { Alert, Row, Col } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Header />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* Top Banner */}
        <Row style={{ marginBottom: '24px' }}>
          <Col span={24}>
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
              style={{ 
                backgroundColor: '#FFF4E6',
                borderColor: '#FFE7D1',
                borderLeft: '4px solid #ff7f40'
              }}
            />
          </Col>
        </Row>

        {/* Main Content Grid */}
        <Row gutter={24} style={{ marginBottom: '32px' }}>
          <Col xs={24} lg={10}>
            <QuickBookingForm />
          </Col>
          <Col xs={24} lg={14}>
            <HotDealsSection />
          </Col>
        </Row>

        {/* Marketplace Section */}
        <Row style={{ marginBottom: '32px' }}>
          <Col span={24}>
            <MarketplaceSection />
          </Col>
        </Row>

        {/* Recent Bookings Section */}
        <Row>
          <Col span={24}>
            <RecentBookingsSection />
          </Col>
        </Row>
      </div>
    </div>
  );
}
