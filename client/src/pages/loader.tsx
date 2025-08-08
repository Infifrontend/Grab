import { memo } from "react";
import CFG from "@/config/config.json";

interface LoaderProps {
  fallback?: boolean;
}

const Loader = memo(({ fallback }: LoaderProps) => {
  const LoaderContent = memo(() => {
    return (
      <div
        data-testid="loader"
        className="w-full h-[100vh] flex items-center justify-center bg-white bg-opacity-90 z-[9999]"
      >
        <div className="flex flex-col items-center justify-center">
          <span className="block w-full text-center">
            <img
              src={`/src/plugins/${CFG?.default?.airline_code || "RM"}/assets/images/Logo.png`}
              width={210}
              alt="Volaris"
              title="Volaris"
              className="cursor-pointer mx-auto"
            />
            <span className="block mt-2 text-lg font-medium text-gray-600 mt-2">
              Please wait...
            </span>
          </span>
        </div>
      </div>
    );
  });

  return fallback ? <LoaderContent /> : null;
});

export default Loader;
