import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ConfigProvider } from "antd";
import { antdTheme } from "./lib/antd-theme";
import AppRoute from "./routes/index.route";
import { ErrorBoundary } from "react-error-boundary";
import ServerError from "./pages/server-error";
import ThemeManager from "./components/ThemeManager/ThemeManager";

function App() {
  return (
    <ThemeManager>
      <ErrorBoundary FallbackComponent={ServerError}>
        <QueryClientProvider client={queryClient}>
          <ConfigProvider theme={antdTheme}>
            <TooltipProvider>
              <Toaster />
              <AppRoute />
            </TooltipProvider>
          </ConfigProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </ThemeManager>
  );
}

export default App;