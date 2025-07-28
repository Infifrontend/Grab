import { queryClient } from "./lib/queryClient";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ConfigProvider } from "antd";
import { antdTheme } from "./lib/antd-theme";

// Pages
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import BookingDetails from "@/pages/booking-details";
import Settings from "@/pages/settings";
import AdminLogin from "@/pages/admin/admin-login";
import AdminDashboard from "@/pages/admin/admin-dashboard";
import AdminBookingDetails from "@/pages/admin/bookings";
import AdminFlightSearchResults from "@/pages/admin/flight-search-results";
import AdminFlightSearchBundle from "@/pages/admin/flight-search-bundle";
import AdminAddServicesBundles from "./pages/admin/add-services-bundles";
import AdminGroupLeader from "./pages/admin/group-leader";
import AdminPassengerInfo from "./pages/admin/passenger-info";
import AdminPaymentOptions from "@/pages/admin/payment-options";
import AdminReviewConfirmation from "@/pages/admin/review-confirmation";
import AdminDownloadItinerary from "./pages/admin/download-itinerary";

import BidManagement from "@/pages/admin/bid-management";
import OfferManagement from "@/pages/admin/offer-management";
import Bookings from "@/pages/admin/bookings";
import CMS from "@/pages/admin/cms";
import AdminSettings from "@/pages/admin/admin-settings";
import Reports from "@/pages/admin/reports";
import ManageBooking from "@/pages/manage-booking";
import ManageBookingDetail from "@/pages/manage-booking-detail";
import Payments from "@/pages/payments";
import PaymentDetails from "@/pages/payment-details";
import Bids from "@/pages/bids";
import BidDetails from "@/pages/bid-details";
import FlightSearchResults from "@/pages/flight-search-results";
import FlightSearchBundle from "@/pages/flight-search-bundle";
import AddServicesBundles from "./pages/add-services-bundles";
import NewBooking from "./pages/new-booking";
import GroupLeader from "./pages/group-leader";
import PassengerInfo from "./pages/passenger-info";
import PaymentOptions from "@/pages/payment-options";
import ReviewConfirmation from "@/pages/review-confirmation";
import DownloadItinerary from "./pages/download-itinerary";
import Login from "@/pages/login";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={antdTheme}>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/booking-details/:id" element={<AdminBookingDetails />} />
              <Route path="/admin/flight-search-results" element={<AdminFlightSearchResults />} />
              <Route path="/admin/flight-search-bundle" element={<AdminFlightSearchBundle />} />
              <Route path="/admin/add-services-bundles" element={<AdminAddServicesBundles />} />
              <Route path="/admin/group-leader" element={<AdminGroupLeader />} />
              <Route path="/admin/passenger-info" element={<AdminPassengerInfo />} />
              <Route path="/admin/payment-options" element={<AdminPaymentOptions />} />
              <Route path="/admin/review-confirmation" element={<AdminReviewConfirmation />} />
              <Route path="/admin/download-itinerary/:id" element={<AdminDownloadItinerary />} />
              <Route path="/admin/bid-management" element={<BidManagement />} />
              <Route path="/admin/offer-management" element={<OfferManagement />} />
              <Route path="/admin/bookings" element={<Bookings />} />
              <Route path="/admin/cms" element={<CMS />} />
              <Route path="/admin/admin-settings" element={<AdminSettings />} />
              <Route path="/admin/reports" element={<Reports />} />

              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/booking-details/:id" element={<BookingDetails />} />
              <Route path="/manage-booking" element={<ManageBooking />} />
              <Route path="/manage-booking/:id" element={<ManageBookingDetail />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/payment-details/:bidId" element={<PaymentDetails />} />
              <Route path="/bids" element={<Bids />} />
              <Route path="/bid-details/:id" element={<BidDetails />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/bid-management" element={<BidManagement />} />
              <Route path="/admin/offer-management" element={<OfferManagement />} />
              <Route path="/admin/bookings" element={<Bookings />} />
              <Route path="/admin/cms" element={<CMS />} />
              <Route path="/admin/admin-settings" element={<AdminSettings />} />
              <Route path="/admin/reports" element={<Reports />} />
              <Route path="/new-booking" element={<NewBooking />} />
              <Route path="/flight-search-results" element={<FlightSearchResults />} />
              <Route path="/flight-search-bundle" element={<FlightSearchBundle />} />
              <Route path="/add-services-bundles" element={<AddServicesBundles />} />
              <Route path="/group-leader" element={<GroupLeader />} />
              <Route path="/passenger-info" element={<PassengerInfo />} />
              <Route path="/payment-options" element={<PaymentOptions />} />
              <Route path="/review-confirmation" element={<ReviewConfirmation />} />
              <Route path="/download-itinerary/:id" element={<DownloadItinerary />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
