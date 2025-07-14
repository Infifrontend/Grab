
export interface BookingFormData {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  tripType: 'oneWay' | 'roundTrip' | 'multiCity';
  adults: number;
  kids: number;
  infants: number;
  cabin: string;
  totalPassengers: number;
  searchData?: any;
}

export const getBookingData = (): BookingFormData | null => {
  try {
    const stored = localStorage.getItem('bookingFormData');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error parsing booking data:', error);
    return null;
  }
};

export const setBookingData = (data: BookingFormData): void => {
  try {
    localStorage.setItem('bookingFormData', JSON.stringify(data));
  } catch (error) {
    console.error('Error storing booking data:', error);
  }
};

export const updateBookingData = (updates: Partial<BookingFormData>): void => {
  const currentData = getBookingData();
  if (currentData) {
    setBookingData({ ...currentData, ...updates });
  }
};

export const clearBookingData = (): void => {
  localStorage.removeItem('bookingFormData');
  localStorage.removeItem('searchResults');
  localStorage.removeItem('searchCriteria');
  localStorage.removeItem('passengerCount');
};

export const getPassengerBreakdown = (data: BookingFormData): string => {
  const parts = [];
  if (data.adults > 0) parts.push(`${data.adults} adult${data.adults > 1 ? 's' : ''}`);
  if (data.kids > 0) parts.push(`${data.kids} kid${data.kids > 1 ? 's' : ''}`);
  if (data.infants > 0) parts.push(`${data.infants} infant${data.infants > 1 ? 's' : ''}`);
  return parts.join(', ');
};

export const formatTripType = (tripType: string): string => {
  switch (tripType) {
    case 'oneWay': return 'One-way';
    case 'roundTrip': return 'Round-trip';
    case 'multiCity': return 'Multi-city';
    default: return tripType;
  }
};
