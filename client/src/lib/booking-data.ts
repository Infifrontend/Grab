import dayjs from 'dayjs';

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

export interface FlightData {
  outbound?: any;
  return?: any;
  baseCost: number;
  totalCost: number;
}

export interface BundleData {
  selectedSeat?: any;
  selectedBaggage?: any;
  selectedMeals?: any[];
  bundleCost: number;
}

export interface ServiceData {
  id: string;
  name: string;
  price: number;
  count?: number;
  type: 'bundle' | 'individual';
}

export interface BookingSummary {
  subtotal: number;
  taxes: number;
  groupDiscount: number;
  totalAmount: number;
  passengerCount: number;
  calculatedAt: string;
}

export interface PaymentData {
  paymentSchedule: string;
  paymentMethod: string;
  totalAmount: number;
  discountedTotal: number;
  paymentDiscount: number;
  dueNow: number;
  selectedPaymentOption?: any;
  formData?: any;
}

// Booking Form Data
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

// Flight Data
export const getFlightData = (): FlightData | null => {
  try {
    const stored = localStorage.getItem('selectedFlightData');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error parsing flight data:', error);
    return null;
  }
};

export const setFlightData = (data: FlightData): void => {
  try {
    localStorage.setItem('selectedFlightData', JSON.stringify(data));
  } catch (error) {
    console.error('Error storing flight data:', error);
  }
};

// Bundle Data
export const getBundleData = (): BundleData | null => {
  try {
    const stored = localStorage.getItem('selectedBundleData');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error parsing bundle data:', error);
    return null;
  }
};

export const setBundleData = (data: BundleData): void => {
  try {
    localStorage.setItem('selectedBundleData', JSON.stringify(data));
  } catch (error) {
    console.error('Error storing bundle data:', error);
  }
};

// Services Data
export const getServicesData = (): ServiceData[] => {
  try {
    const stored = localStorage.getItem('selectedServices');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error parsing services data:', error);
    return [];
  }
};

export const setServicesData = (data: ServiceData[]): void => {
  try {
    localStorage.setItem('selectedServices', JSON.stringify(data));
  } catch (error) {
    console.error('Error storing services data:', error);
  }
};

// Group Leader Data
export const getGroupLeaderData = (): any | null => {
  try {
    const stored = localStorage.getItem('groupLeaderData');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error parsing group leader data:', error);
    return null;
  }
};

export const setGroupLeaderData = (data: any): void => {
  try {
    localStorage.setItem('groupLeaderData', JSON.stringify(data));
  } catch (error) {
    console.error('Error storing group leader data:', error);
  }
};

// Booking Summary
export const getBookingSummary = (): BookingSummary | null => {
  try {
    const stored = localStorage.getItem('bookingSummary');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error parsing booking summary:', error);
    return null;
  }
};

export const setBookingSummary = (data: BookingSummary): void => {
  try {
    localStorage.setItem('bookingSummary', JSON.stringify(data));
  } catch (error) {
    console.error('Error storing booking summary:', error);
  }
};

// Payment Data
export const getPaymentData = (): PaymentData | null => {
  try {
    const stored = localStorage.getItem('paymentData');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error parsing payment data:', error);
    return null;
  }
};

export const setPaymentData = (data: PaymentData): void => {
  try {
    localStorage.setItem('paymentData', JSON.stringify(data));
  } catch (error) {
    console.error('Error storing payment data:', error);
  }
};

// Calculate total booking amount
export const calculateBookingTotal = (): BookingSummary => {
  const bookingData = getBookingData();
  const flightData = getFlightData();
  const bundleData = getBundleData();
  const servicesData = getServicesData();

  const passengerCount = bookingData?.totalPassengers || 1;
  let subtotal = 0;

  // Flight cost
  if (flightData) {
    subtotal += flightData.baseCost || 0;
  }

  // Bundle cost
  if (bundleData) {
    subtotal += (bundleData.bundleCost || 0) * passengerCount;
  }

  // Services cost
  const servicesCost = servicesData.reduce((total, service) => {
    return total + (service.price * passengerCount);
  }, 0);
  subtotal += servicesCost;

  // Calculate taxes and discounts
  const taxes = subtotal * 0.08; // 8% tax
  const groupDiscount = passengerCount >= 10 ? subtotal * 0.15 : 0; // 15% group discount for 10+ passengers
  const totalAmount = subtotal + taxes - groupDiscount;

  return {
    subtotal,
    taxes,
    groupDiscount,
    totalAmount,
    passengerCount,
    calculatedAt: new Date().toISOString()
  };
};

// Clear all booking data
export const clearBookingData = (): void => {
  const keysToRemove = [
    'bookingFormData',
    'selectedFlightData',
    'selectedBundleData',
    'selectedServices',
    'groupLeaderData',
    'bookingSummary',
    'paymentData',
    'passengerData',
    'selectedPaymentMethod',
    'selectedPaymentSchedule',
    'searchResults',
    'searchCriteria',
    'passengerCount'
  ];

  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });
};

// Passenger Data
export const getPassengerData = (): any[] => {
  try {
    const stored = localStorage.getItem('passengerData');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error parsing passenger data:', error);
    return [];
  }
};

export const setPassengerData = (data: any[]): void => {
  try {
    localStorage.setItem('passengerData', JSON.stringify(data));
  } catch (error) {
    console.error('Error storing passenger data:', error);
  }
};

// Get all booking data for debugging
export const getAllBookingData = () => {
  return {
    bookingData: getBookingData(),
    flightData: getFlightData(),
    bundleData: getBundleData(),
    servicesData: getServicesData(),
    groupLeaderData: getGroupLeaderData(),
    bookingSummary: getBookingSummary(),
    paymentData: getPaymentData(),
    passengerData: getPassengerData()
  };
};

export const updateBookingData = (updates: Partial<BookingFormData>): void => {
  const currentData = getBookingData();
  if (currentData) {
    setBookingData({ ...currentData, ...updates });
  }
};

// Get trip type from localStorage with consistency check
export function getTripType(): 'oneWay' | 'roundTrip' | 'multiCity' {
  // First check bookingFormData (from Quick Booking form) - this has priority
  const bookingData = localStorage.getItem('bookingFormData');
  if (bookingData) {
    const data = JSON.parse(bookingData);
    if (data.tripType) {
      // Update selectedTripType to match for consistency
      localStorage.setItem('selectedTripType', data.tripType);
      return data.tripType;
    }
  }

  // Fallback to selectedTripType
  const savedTripType = localStorage.getItem('selectedTripType');
  if (savedTripType) {
    return savedTripType as 'oneWay' | 'roundTrip' | 'multiCity';
  }

  return 'roundTrip';
}

// Store booking step data
export function storeBookingStepData(step: string, data: any) {
  localStorage.setItem(`bookingStep_${step}`, JSON.stringify(data));
}

// Format date consistently across the application
export function formatDate(date: string | Date | null): string {
  if (!date) return '';

  try {
    if (typeof date === 'string') {
      return dayjs(date).format('DD MMM YYYY');
    }
    return dayjs(date).format('DD MMM YYYY');
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}