/**
 * Title       : AppRoute component
 * Description : It manages the routing and navigation logic for the application.
 *               It dynamically loads components based on authentication state and routes configuration.
 */
import { Suspense, useEffect, useState } from "react";
import { 
  useNavigate, 
  useLocation, 
  matchPath,
  Routes,
  Route,
  Outlet
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Layouts, Pages, MenuRoutes } from "@/routes/route";
import NoInternet from "@/pages/no-internet";
import PageNotFound from "@/pages/not-found";
import Loader from "@/pages/loader";

const MotionWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

const AppRoute = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [routes, setRoutes] = useState<any[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pageLoading, setPageLoading] = useState(true);

  // Check authentication state
  const isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
  const isUserLoggedIn = localStorage.getItem('userLoggedIn') === 'true';

  const getActiveRoutes = () => {
    if (isAdminLoggedIn) return MenuRoutes.admin;
    if (isUserLoggedIn) return MenuRoutes.retail;
    
    return {
      menu: [],
      routes: [
        ...MenuRoutes.retail.routes.filter(route => 
          ['/', '/login'].includes(route.path)
        ),
        ...MenuRoutes.admin.routes.filter(route => 
          route.path === '/admin/login'
        )
      ]
    };
  };

  // Network status
  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // Generate routes
  useEffect(() => {
    const activeRoutes = getActiveRoutes();
    const generatedRoutes = activeRoutes.routes.map(route => {
      const Layout = Layouts.get(route.layout);
      const Page = Pages.get(route.component);
      
      if (!Page) {
        console.error(`Missing components for route: ${route.path}`);
        return null;
      }

      return (
        <Route
          key={route.route_id}
          path={route.path}
          element={
            Layout ? (
              <Layout>
                <MotionWrapper>
                  <Page />
                </MotionWrapper>
              </Layout> 
              ) : (
              <MotionWrapper>
                <Page />
              </MotionWrapper>
            )
          }
        />
      );
    }).filter(Boolean);

    generatedRoutes.push(
      <Route key="not-found" path="*" element={<PageNotFound />} />
    );

    setRoutes(generatedRoutes);
    setPageLoading(false);
  }, [isAdminLoggedIn, isUserLoggedIn]);

  // Authentication redirect
  useEffect(() => {
    if (pageLoading) return;

    if(location.pathname === "/login" || location.pathname === "/admin/login") {
      localStorage.setItem("userLoggedIn", "false");
      localStorage.setItem('adminLoggedIn', 'false');
      localStorage.removeItem('adminUsername');
      localStorage.removeItem('username');
    }
    
    const activeRoutes = getActiveRoutes();
    const isPathValid = activeRoutes.routes.some(route => 
      matchPath(route.path, location.pathname)
    );

    if (!isPathValid) {
      navigate(location.pathname.startsWith('/admin') 
        ? '/admin/login' 
        : '/login');
    }
  }, [location.pathname, isAdminLoggedIn, isUserLoggedIn, navigate, pageLoading]);

  // if (pageLoading) return <Loader fallback={true} />;
  if (!isOnline) return <NoInternet />;

  return (
    <Suspense fallback={<Loader fallback={true} />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {routes}
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
};

export default AppRoute;