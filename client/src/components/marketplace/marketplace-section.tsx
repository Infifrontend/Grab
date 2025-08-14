import { useState } from "react";
import { Card, Form, Input, DatePicker, Select, Button, Row, Col } from "antd";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle } from "lucide-react";
import type { Package } from "@shared/schema";

const { Option } = Select;

export default function MarketplaceSection() {
  const [searchDestination, setSearchDestination] = useState<string>("");

  const { data: packages, isLoading } = useQuery<Package[]>({
    queryKey: ["/api/packages", searchDestination],
    queryFn: async () => {
      const response = await fetch(
        `/api/packages${searchDestination ? `?destination=${encodeURIComponent(searchDestination)}` : ""}`,
      );
      if (!response.ok) throw new Error("Failed to fetch packages");
      return response.json();
    },
  });

  const handleSearch = () => {
    // Search functionality is handled by the query parameter change
  };

  console.log(packages, 'aaa');


  const handleBookPackage = (packageId: number) => {
    window.open("https://demo-packages.infinitisoftware.net/", "_blank");
  };

  return (
    <div className="deal-card">
      {/* Header */}
      <div className="section-header flex gap-2 items-center">
        <h2 className="text-xl font-semibold mb-1">Your Marketplace</h2> -
        <p className="text-sm opacity-90">
          Discover exclusive travel packages and deals
        </p>
      </div>

      <div className="p-6 bg-gray-200">
        {/* Search Section */}
        <div className="mb-6">
          <Row gutter={16} align="bottom">
            <Col xs={24} sm={6}>
              <Form.Item label="Destination" className="mb-0">
                <Input
                  placeholder="Search destination"
                  value={searchDestination}
                  onChange={(e) => setSearchDestination(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={5}>
              <Form.Item label="Travel Date" className="mb-0">
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={5}>
              <Form.Item label="Passengers" className="mb-0">
                <Select placeholder="How many?" defaultValue="">
                  <Option value="">How many?</Option>
                  <Option value="2-5">2-5 people</Option>
                  <Option value="6-15">6-15 people</Option>
                  <Option value="16-30">16-30 people</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={5}>
              <Form.Item label="Package Type" className="mb-0">
                <Select placeholder="All packages" defaultValue="">
                  <Option value="">All packages</Option>
                  <Option value="business">Business</Option>
                  <Option value="leisure">Leisure</Option>
                  <Option value="adventure">Adventure</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={3}>
              <Button
                type="primary"
                onClick={handleSearch}
                className="infiniti-btn-primary w-full"
              >
                Search
              </Button>
            </Col>
          </Row>
        </div>

        {/* Packages Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages?.map((pkg) => (
              <Card key={pkg.id} className="package-card">
                {/* Package Header */}
                <div style={{
                  height: 170
                  }}>
                  <img style={{
                    height: "100%",
                    width: "100%",
                    objectFit: "cover",
                    borderRadius: "8px"

                  }}
                    src={`../src/images/packages/${pkg.location.split("—")[1].trim().toLowerCase()}.jpg`}></img>
                </div>
                <div className="pt-4">
                  <div className="text-xs" style={{color:'var(--infiniti-primary)'}}>
                    {pkg.location}
                  </div>
                  <div
                    className="text-base font-semibold text-gray-800 my-2 truncate w-full max-w-[200px]"
                    title={pkg.title}
                  >
                    {" "}
                    {pkg.title}{" "}
                  </div>
                  <div className="text-base font-semibold package-price mb-0">${pkg.price}</div>
                  {pkg.originalPrice && (
                    <div className="text-sm text-gray-400 line-through" style={{color:'var(--infiniti-primary)'}}>
                      ${pkg.originalPrice}
                    </div>
                  )}
                </div>

                {/* Package Features */}
                <div className="p-4">
                  <ul className="space-y-1" style={{ listStyle: 'disc' }} >
                    {pkg.features?.map((feature, index) => (
                      <li
                        key={index}
                        className="text-xs"
                      >
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Package Footer */}
                <div>
                  <Button
                    type="primary"
                    className="w-full infiniti-btn-primary"
                    onClick={() => handleBookPackage(pkg.id)}
                  >
                    Book now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
