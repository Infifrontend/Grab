import { Card, Rate, Tag,Button } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { Plane, Users, CheckCircle } from 'lucide-react';
import type { Deal } from '@shared/schema';
import { SearchOutlined } from "@ant-design/icons";

export default function HotDealsSection() {
  const { data: deals, isLoading } = useQuery<Deal[]>({
    queryKey: ['/api/deals'],
  });

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

  return (
    <div className="deal-card">
      {/* Header */}
      <div className="section-header relative">
        <Tag className="limited-time-badge">Limited Time</Tag>
        <h2 className="text-xl font-semibold mb-1">Hot Deals & Offers</h2>
        <p className="text-sm opacity-90">Exclusive group travel deals for popular routes</p>
      </div>

      {/* Deal Content */}
      <div className="p-6">
        {deals?.map((deal, index) => (
      <div
        key={deal.id}
        className={`space-y-1 p-4 bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-shadow duration-300 ${
          deals?.length !== index + 1 ? "mb-6" : ""
        }`}
      >
        {/* Flash Sale Banner */}
        {deal.isFlashSale && (
          <div className="flash-sale-banner">{deal.title}</div>
        )}

        {/* Discount Badge */}
        <div className="discount-badge">
          🔥 {deal.discountPercentage}% OFF
        </div>

        {/* Route Display */}
        <div className="route-display">
          <Plane className="w-5 h-5 text-[var(--infiniti-primary)]" />
          <span>{deal.origin}</span>
          <span className="text-[var(--infiniti-primary)]">→</span>
          <span>{deal.destination}</span>
        </div>

        {/* Pricing and Rating */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="original-price">${deal.originalPrice}</div>
            <div className="discounted-price">${deal.discountedPrice}</div>
            <div className="text-xs text-gray-500">per person</div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <Rate
                disabled
                defaultValue={parseFloat(deal.rating)}
                className="text-sm"
              />
              <span className="font-semibold text-gray-800">
                {deal.rating}
              </span>
            </div>
            <div className="text-xs text-gray-500">Customer Rating</div>
          </div>
        </div>

        {/* Deal Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="group-size-item">
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
              <Users className="w-4 h-4" />
              <span>Group Size</span>
            </div>
            <div className="font-semibold text-gray-800">
              {deal.groupSizeMin}-{deal.groupSizeMax} pax
            </div>
          </div>

          <div className="availability-item">
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
              <CheckCircle className="w-4 h-4" />
              <span>Available</span>
            </div>
            <div className="font-semibold text-gray-800">
              {deal.availableSeats} seats
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button block size="large" className="mt-5">
            View Details
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SearchOutlined />}
            size="large"
            className="w-full infiniti-btn-primary mt-5"
          >
            Book now
          </Button>
        </div>
      </div>
        ))}
      </div>
    </div>
  );
}