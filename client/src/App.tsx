import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ConfigProvider } from 'antd';
import { antdTheme } from "./lib/antd-theme";
import Dashboard from "@/pages/dashboard";
import Home from "@/pages/home";
import ManageBooking from "@/pages/manage-booking";
import ManageBookingDetail from "@/pages/manage-booking-detail";
import Payments from "@/pages/payments";
import PaymentDetails from "@/pages/payment-details";
import Settings from "@/pages/settings";
import Bids from "@/pages/bids";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/manage-booking" component={ManageBooking} />
      <Route path="/manage-booking/:id" component={ManageBookingDetail} />
      <Route path="/payments" component={Payments} />
      <Route path="/payment-details/:id" component={PaymentDetails} />
      <Route path="/bids" component={Bids} />
      <Route path="/settings" component={Settings} />
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