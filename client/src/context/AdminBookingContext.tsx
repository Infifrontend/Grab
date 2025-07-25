
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AdminBookingContextType {
  bookingType: 'retail' | 'group' | null;
  setBookingType: (type: 'retail' | 'group' | null) => void;
  bookingData: any;
  setBookingData: (data: any) => void;
}

const AdminBookingContext = createContext<AdminBookingContextType | undefined>(undefined);

export const AdminBookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookingType, setBookingType] = useState<'retail' | 'group' | null>(null);
  const [bookingData, setBookingData] = useState<any>(null);

  return (
    <AdminBookingContext.Provider 
      value={{ 
        bookingType, 
        setBookingType, 
        bookingData, 
        setBookingData 
      }}
    >
      {children}
    </AdminBookingContext.Provider>
  );
};

export const useAdminBookingContext = () => {
  const context = useContext(AdminBookingContext);
  if (context === undefined) {
    throw new Error('useAdminBookingContext must be used within an AdminBookingProvider');
  }
  return context;
};
