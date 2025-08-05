import { lazy } from "react";

// Layouts
const RetailLayout = lazy(() => import("@/layouts/retail-layout"));
const AdminLayout = lazy(() => import("@/layouts/admin-layout"));

// Public Pages
const Home = lazy(() => import("@/pages/home"));
const Login = lazy(() => import("@/pages/login"));
const NotFound = lazy(() => import("@/pages/not-found"));

// User Pages
const Dashboard = lazy(() => import("@/pages/dashboard"));
const BookingDetails = lazy(() => import("@/pages/booking-details"));
const Settings = lazy(() => import("@/pages/settings"));
const ManageBooking = lazy(() => import("@/pages/manage-booking"));
const ManageBookingDetail = lazy(() => import("@/pages/manage-booking-detail"));
const Payments = lazy(() => import("@/pages/payments"));
const PaymentDetails = lazy(() => import("@/pages/payment-details"));
const Bids = lazy(() => import("@/pages/bids"));
const BidDetails = lazy(() => import("@/pages/bid-details"));
const NewBooking = lazy(() => import("@/pages/new-booking"));
const FlightSearchResults = lazy(() => import("@/pages/flight-search-results"));
const FlightSearchBundle = lazy(() => import("@/pages/flight-search-bundle"));
const AddServicesBundles = lazy(() => import("@/pages/add-services-bundles"));
const GroupLeader = lazy(() => import("@/pages/group-leader"));
const PassengerInfo = lazy(() => import("@/pages/passenger-info"));
const PaymentOptions = lazy(() => import("@/pages/payment-options"));
const ReviewConfirmation = lazy(() => import("@/pages/review-confirmation"));
const DownloadItinerary = lazy(() => import("@/pages/download-itinerary"));

// Admin Pages
const AdminLogin = lazy(() => import("@/pages/admin/admin-login"));
const AdminDashboard = lazy(() => import("@/pages/admin/admin-dashboard"));
const BidManagement = lazy(() => import("@/pages/admin/bid-management"));
const OfferManagement = lazy(() => import("@/pages/admin/offer-management"));
const Bookings = lazy(() => import("@/pages/admin/bookings"));
const CMS = lazy(() => import("@/pages/admin/cms"));
const AdminSettings = lazy(() => import("@/pages/admin/admin-settings"));
const Reports = lazy(() => import("@/pages/admin/reports"));

// Create Maps for organization
const Layouts = new Map();
Layouts.set("RetailLayout", RetailLayout);
Layouts.set("AdminLayout", AdminLayout);

const Pages = new Map();
// Public Pages
Pages.set("Home", Home);
Pages.set("Login", Login);
Pages.set("NotFound", NotFound);

// User Pages
Pages.set("Dashboard", Dashboard);
Pages.set("BookingDetails", BookingDetails);
Pages.set("Settings", Settings);
Pages.set("ManageBooking", ManageBooking);
Pages.set("ManageBookingDetail", ManageBookingDetail);
Pages.set("Payments", Payments);
Pages.set("PaymentDetails", PaymentDetails);
Pages.set("Bids", Bids);
Pages.set("BidDetails", BidDetails);
Pages.set("NewBooking", NewBooking);
Pages.set("FlightSearchResults", FlightSearchResults);
Pages.set("FlightSearchBundle", FlightSearchBundle);
Pages.set("AddServicesBundles", AddServicesBundles);
Pages.set("GroupLeader", GroupLeader);
Pages.set("PassengerInfo", PassengerInfo);
Pages.set("PaymentOptions", PaymentOptions);
Pages.set("ReviewConfirmation", ReviewConfirmation);
Pages.set("DownloadItinerary", DownloadItinerary);

// Admin Pages
Pages.set("AdminLogin", AdminLogin);
Pages.set("AdminDashboard", AdminDashboard);
Pages.set("BidManagement", BidManagement);
Pages.set("OfferManagement", OfferManagement);
Pages.set("Bookings", Bookings);
Pages.set("CMS", CMS);
Pages.set("AdminSettings", AdminSettings);
Pages.set("Reports", Reports);

const MenuRoutes = {
  "admin": {
    "menu": [
      {
        "menu_code": "Dashboard",
        "path": "/admin/dashboard",
        "icon_name": "📊",
        "subMenu": []
      },
      {
        "menu_code": "Offer Management",
        "path": "/admin/offer-management",
        "icon_name": "🎯",
        "subMenu": []
      },
      {
        "menu_code": "Bid Management",
        "path": "/admin/bid-management",
        "icon_name": "🏆",
        "subMenu": []
      },
      {
        "menu_code": "Booking Management",
        "path": "/admin/bookings",
        "icon_name": "📅",
        "subMenu": []
      },
      {
        "menu_code": "CMS Management",
        "path": "/admin/cms",
        "icon_name": "📝",
        "subMenu": []
      },
      {
        "menu_code": "Reports & Analytics",
        "path": "/admin/reports",
        "icon_name": "📊",
        "subMenu": []
      },
      {
        "menu_code": "System Settings",
        "path": "/admin/admin-settings",
        "icon_name": "🔧",
        "subMenu": []
      }
    ],
    "routes": [
      {
        "route_id": 101,
        "path": "/admin/dashboard",
        "layout": "AdminLayout",
        "component": "AdminDashboard",
        "permission": [],
        "default": true
      },
      {
        "route_id": 102,
        "path": "/admin/offer-management",
        "layout": "AdminLayout",
        "component": "OfferManagement",
        "permission": []
      },
      {
        "route_id": 103,
        "path": "/admin/bid-management",
        "layout": "AdminLayout",
        "component": "BidManagement",
        "permission": []
      },
      {
        "route_id": 104,
        "path": "/admin/bookings",
        "layout": "AdminLayout",
        "component": "Bookings",
        "permission": []
      },
      {
        "route_id": 105,
        "path": "/admin/cms",
        "layout": "AdminLayout",
        "component": "CMS",
        "permission": []
      },
      {
        "route_id": 106,
        "path": "/admin/reports",
        "layout": "AdminLayout",
        "component": "Reports",
        "permission": []
      },
      {
        "route_id": 107,
        "path": "/admin/admin-settings",
        "layout": "AdminLayout",
        "component": "AdminSettings",
        "permission": []
      },
      {
        "route_id": 108,
        "path": "/admin/login",
        "layout": "",
        "component": "AdminLogin",
        "permission": []
      },
      {
        "route_id": 109,
        "path": "/admin/booking-details/:id",
        "layout": "AdminLayout",
        "component": "BookingDetails",
        "permission": []
      },
      {
        "route_id": 110,
        "path": "/admin/flight-search-results",
        "layout": "AdminLayout",
        "component": "FlightSearchResults",
        "permission": []
      },
      {
        "route_id": 111,
        "path": "/admin/flight-search-bundle",
        "layout": "AdminLayout",
        "component": "FlightSearchBundle",
        "permission": []
      },
      {
        "route_id": 112,
        "path": "/admin/add-services-bundles",
        "layout": "AdminLayout",
        "component": "AddServicesBundles",
        "permission": []
      },
      {
        "route_id": 113,
        "path": "/admin/group-leader",
        "layout": "AdminLayout",
        "component": "GroupLeader",
        "permission": []
      },
      {
        "route_id": 114,
        "path": "/admin/passenger-info",
        "layout": "AdminLayout",
        "component": "PassengerInfo",
        "permission": []
      },
      {
        "route_id": 115,
        "path": "/admin/payment-options",
        "layout": "AdminLayout",
        "component": "PaymentOptions",
        "permission": []
      },
      {
        "route_id": 116,
        "path": "/admin/review-confirmation",
        "layout": "AdminLayout",
        "component": "ReviewConfirmation",
        "permission": []
      },
      {
        "route_id": 117,
        "path": "/admin/download-itinerary/:id",
        "layout": "AdminLayout",
        "component": "DownloadItinerary",
        "permission": []
      },
      {
        "route_id": 118,
        "path": "/admin/manage-booking/:id",
        "layout": "AdminLayout",
        "component": "ManageBookingDetail",
        "permission": []
      }
    ]
  },
  "retail": {
    "menu": [
      {
        "menu_code": "Home",
        "path": "/",
        "key": "home",
        "subMenu": []
      },
      {
        "menu_code": "Dashboard",
        "path": "/dashboard",
        "key": "dashboard",
        "subMenu": []
      },
      {
        "menu_code": "Manage Booking",
        "path": "/manage-booking",
        "key": "manage-booking",
        "subMenu": []
      },
      {
        "menu_code": "New Booking",
        "path": "/new-booking",
        "key": "new-booking",
        "subMenu": []
      },
      {
        "menu_code": "Payments",
        "path": "/payments",
        "key": "payments",
        "subMenu": []
      },
      {
        "menu_code": "Bids",
        "path": "/bids",
        "key": "bids",
        "subMenu": []
      },
      {
        "menu_code": "Settings",
        "path": "/settings",
        "key": "settings",
        "subMenu": []
      },
      {
        "menu_code": "Admin",
        "path": "/admin/login",
        "key": "admin",
        "subMenu": []
      }
    ],
    "routes": [
      {
        "route_id": 201,
        "path": "/",
        "layout": "RetailLayout",
        "component": "Home",
        "permission": [],
        "default": true
      },
      {
        "route_id": 202,
        "path": "/dashboard",
        "layout": "RetailLayout",
        "component": "Dashboard",
        "permission": []
      },
      {
        "route_id": 203,
        "path": "/booking-details/:id",
        "layout": "RetailLayout",
        "component": "BookingDetails",
        "permission": []
      },
      {
        "route_id": 204,
        "path": "/manage-booking",
        "layout": "RetailLayout",
        "component": "ManageBooking",
        "permission": []
      },
      {
        "route_id": 205,
        "path": "/manage-booking/:id",
        "layout": "RetailLayout",
        "component": "ManageBookingDetail",
        "permission": []
      },
      {
        "route_id": 206,
        "path": "/payments",
        "layout": "RetailLayout",
        "component": "Payments",
        "permission": []
      },
      {
        "route_id": 207,
        "path": "/payment-details/:bidId",
        "layout": "RetailLayout",
        "component": "PaymentDetails",
        "permission": []
      },
      {
        "route_id": 208,
        "path": "/bids",
        "layout": "RetailLayout",
        "component": "Bids",
        "permission": []
      },
      {
        "route_id": 209,
        "path": "/bid-details/:id",
        "layout": "RetailLayout",
        "component": "BidDetails",
        "permission": []
      },
      {
        "route_id": 210,
        "path": "/settings",
        "layout": "RetailLayout",
        "component": "Settings",
        "permission": []
      },
      {
        "route_id": 211,
        "path": "/login",
        "layout": "",
        "component": "Login",
        "permission": []
      },
      {
        "route_id": 212,
        "path": "/new-booking",
        "layout": "RetailLayout",
        "component": "NewBooking",
        "permission": []
      },
      {
        "route_id": 213,
        "path": "/flight-search-results",
        "layout": "RetailLayout",
        "component": "FlightSearchResults",
        "permission": []
      },
      {
        "route_id": 214,
        "path": "/flight-search-bundle",
        "layout": "RetailLayout",
        "component": "FlightSearchBundle",
        "permission": []
      },
      {
        "route_id": 215,
        "path": "/add-services-bundles",
        "layout": "RetailLayout",
        "component": "AddServicesBundles",
        "permission": []
      },
      {
        "route_id": 216,
        "path": "/group-leader",
        "layout": "RetailLayout",
        "component": "GroupLeader",
        "permission": []
      },
      {
        "route_id": 217,
        "path": "/passenger-info",
        "layout": "RetailLayout",
        "component": "PassengerInfo",
        "permission": []
      },
      {
        "route_id": 218,
        "path": "/payment-options",
        "layout": "RetailLayout",
        "component": "PaymentOptions",
        "permission": []
      },
      {
        "route_id": 219,
        "path": "/review-confirmation",
        "layout": "RetailLayout",
        "component": "ReviewConfirmation",
        "permission": []
      },
      {
        "route_id": 220,
        "path": "/download-itinerary/:id",
        "layout": "RetailLayout",
        "component": "DownloadItinerary",
        "permission": []
      },
      {
        "route_id": 221,
        "path": "/admin/login",
        "layout": "",
        "component": "AdminLogin",
        "permission": []
      },
      {
        "route_id": 222,
        "path": "*",
        "layout": "RetailLayout",
        "component": "NotFound",
        "permission": []
      }
    ]
  }
}   

export { Pages, Layouts, MenuRoutes };
