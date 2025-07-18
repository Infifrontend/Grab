import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ConfigProvider } from "antd";
import { antdTheme } from "./lib/antd-theme";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import BookingDetails from "@/pages/booking-details";
import Settings from "@/pages/settings";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import ManageBooking from "@/pages/manage-booking";
import ManageBookingDetail from "@/pages/manage-booking-detail";
import Payments from "@/pages/payments";
import PaymentDetails from "@/pages/payment-details";
import bids from "@/pages/bids";
import BidDetails from "@/pages/bid-details";
import FlightSearchResults from "@/pages/flight-search-results";
import FlightSearchBundle from "@/pages/flight-search-bundle";
import AddServicesBundles from "./pages/add-services-bundles";
import NewBooking from "./pages/new-booking";
import GroupLeader from "./pages/group-leader";
import PassengerInfo from "./pages/passenger-info";
import PaymentOptions from "./pages/payment-options";
import ReviewConfirmation from "./pages/review-confirmation";
import DownloadItinerary from "./pages/download-itinerary";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/booking-details/:id" component={BookingDetails} />
      <Route path="/manage-booking" component={ManageBooking} />
      <Route path="/manage-booking/:id" component={ManageBookingDetail} />
      <Route path="/payments" component={Payments} />
      <Route path="/payment-details/:id" component={PaymentDetails} />
      <Route path="/settings" component={Settings} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/admin-dashboard" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={antdTheme}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;