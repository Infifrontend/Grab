import { EditOutlined } from "@ant-design/icons";
import { Row, Col, Button, Typography } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
const { Text } = Typography;

interface BookingSummaryProps {
  setShowModifySearch?: (show: boolean) => void;
  showModifySearch?: boolean;
}

const BookingSummary = ({
  setShowModifySearch,
  showModifySearch,
}: BookingSummaryProps) => {
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [searchCriteria, setSearchCriteria] = useState<any>(null);
  const [tripType, setTripType] = useState<string>("roundTrip");
  const [departureDate, setDepartureDate] = useState(dayjs().add(1, "day"));
  const [returnDate, setReturnDate] = useState<any>(null);
  const [adults, setAdults] = useState(0);
  const [kids, setKids] = useState(0);
  const [infants, setInfants] = useState(0);
  const [cabin, setCabin] = useState("economy");

  useEffect(() => {
    const bookingFormData = localStorage.getItem("bookingFormData");
    if (bookingFormData) {
      const formData = JSON.parse(bookingFormData);
      setOrigin(formData.origin || "");
      setDestination(formData.destination || "");
      if (formData.tripType) {
        setTripType(formData.tripType);
      }

      if (formData.departureDate) {
        if (typeof formData.departureDate === "string") {
          setDepartureDate(dayjs(formData.departureDate));
        } else {
          setDepartureDate(formData.departureDate);
        }
      }

      if (formData.returnDate) {
        if (typeof formData.returnDate === "string") {
          setReturnDate(dayjs(formData.returnDate));
        } else {
          setReturnDate(formData.returnDate);
        }
      }
      setAdults(formData.adults || 0);
      setKids(formData.kids || 0);
      setInfants(formData.infants || 0);
      setCabin(formData.cabin || "Economy");
    }

    const searchCriteria:any = localStorage.getItem("searchCriteria");
    if (searchCriteria) {
        let data = JSON.parse(searchCriteria);
        setSearchCriteria(data);
        console.log(searchCriteria);
      
      if (data.tripType) {
        setTripType(data.tripType);
      }
    }
  }, []);

  return (
    /* Compact Search Summary */
    <div className="bg-white p-4 rounded-lg border">
      <Row align="middle" justify="space-between">
        <Col span={18}>
          <Row gutter={[24, 8]} align="middle" justify="space-between">
            <Col>
              <div>
                <Text className="text-gray-600 text-sm">Route</Text>
                <Text className="block font-medium">
                  {searchCriteria?.origin || origin} {searchCriteria?.tripType === "roundTrip" ? "↔" : "→"}{" "}
                  {searchCriteria?.destination || destination}
                </Text>
              </div>
            </Col>
            <Col>
              <div>
                <Text className="text-gray-600 text-sm">Trip Type</Text>
                <Text className="block font-medium">
                  {tripType === "oneWay"
                    ? "One Way"
                    : tripType === "roundTrip"
                    ? "Round Trip"
                    : "Multi City"}
                </Text>
              </div>
            </Col>
            <Col>
              <div>
                <Text className="text-gray-600 text-sm">Departure</Text>
                <Text className="block font-medium">
                  {searchCriteria?.departureDate
                    ? dayjs(searchCriteria.departureDate).format("DD MMM YYYY")
                    : typeof departureDate === "string"
                    ? dayjs(departureDate).format("DD MMM YYYY")
                    : departureDate?.format("DD MMM YYYY")}
                </Text>
              </div>
            </Col>
            {tripType === "roundTrip" && (
              <Col>
                <div>
                  <Text className="text-gray-600 text-sm">Return</Text>
                  <Text className="block font-medium">
                    {searchCriteria?.returnDate
                      ? dayjs(searchCriteria.returnDate).format("DD MMM YYYY")
                      : typeof returnDate === "string"
                      ? dayjs(returnDate).format("DD MMM YYYY")
                      : returnDate?.format("DD MMM YYYY")}
                  </Text>
                </div>
              </Col>
            )}
            <Col>
              <div>
                <Text className="text-gray-600 text-sm">Passengers</Text>
                <Text className="block font-medium">
                  {adults + kids + infants} passengers
                </Text>
              </div>
            </Col>
            <Col>
              <div>
                <Text className="text-gray-600 text-sm">Cabin</Text>
                <Text className="block font-medium">{cabin}</Text>
              </div>
            </Col>
          </Row>
        </Col>
        {(showModifySearch && setShowModifySearch) && (
          <Col>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => setShowModifySearch(true)}
              className="text-blue-600"
            >
              Modify Search
            </Button>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default BookingSummary;
