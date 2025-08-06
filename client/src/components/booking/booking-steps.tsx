import React from "react";
import { Steps } from "antd";

interface BookingStepsProps {
  currentStep: number;
  size?: "default" | "small";
  className?: string;
}

const BookingSteps: React.FC<BookingStepsProps> = ({
  currentStep,
  size = "default",
  className = "",
}) => {
  const steps = [
    {
      title: "Trip Details",
    },
    {
      title: "Flight Search & Bundles",
    },
    {
      title: "Add Services",
    },
    {
      title: "Group Leader Review",
    },
    {
      title: "Payment",
    },
    {
      title: "Passenger Info",
    },
  ];

  return (
    <div className={`bg-white booking-steps ${className}`}>
      <Steps
        current={currentStep}
        size={size}
        items={steps?.map((step:any, index:number) => ({
          title: step.title,
          description: step.description,
          status:
            index < currentStep
              ? "finish"
              : index === currentStep
                ? "process"
                : "wait",
        }))}
        className="w-full"
      />

      <style jsx>{`
        .booking-steps {
          // background: var(--bgGray50);
          padding: 24px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }

        .booking-steps :global(.ant-steps) {
          padding: 0;
        }

        .booking-steps :global(.ant-steps-item) {
          padding-bottom: 0;
        }

        .booking-steps :global(.ant-steps-item-title) {
          font-weight: 600;
          color: #1f2937;
          font-size: 14px;
          line-height: 1.4;
          margin-bottom: 4px;
        }

        .booking-steps :global(.ant-steps-item-description) {
          color: #6b7280;
          font-size: 12px;
          line-height: 1.3;
          margin-top: 2px;
        }

        .booking-steps :global(.ant-steps-item-process .ant-steps-item-title) {
          color: #2a0a22;
          font-weight: 700;
        }

        .booking-steps
          :global(.ant-steps-item-process .ant-steps-item-description) {
          color: #2a0a22;
          opacity: 0.8;
        }

        .booking-steps :global(.ant-steps-item-finish .ant-steps-item-title) {
          color: #1f2937;
        }

        .booking-steps :global(.ant-steps-item-wait .ant-steps-item-title) {
          color: #9ca3af;
        }

        .booking-steps
          :global(.ant-steps-item-wait .ant-steps-item-description) {
          color: #d1d5db;
        }

        .booking-steps :global(.ant-steps-item-process .ant-steps-item-icon) {
          background-color: #2a0a22;
          border-color: #2a0a22;
          width: 32px;
          height: 32px;
          line-height: 30px;
          font-size: 14px;
          font-weight: 600;
        }

        .booking-steps :global(.ant-steps-item-finish .ant-steps-item-icon) {
          background-color: #2a0a22;
          border-color: #2a0a22;
          width: 32px;
          height: 32px;
          line-height: 30px;
        }

        .booking-steps :global(.ant-steps-item-wait .ant-steps-item-icon) {
          background-color: #f9fafb;
          border-color: #e5e7eb;
          color: #9ca3af;
          width: 32px;
          height: 32px;
          line-height: 30px;
          font-weight: 500;
        }

        .booking-steps :global(.ant-steps-item-tail) {
          top: 16px;
          padding: 0 24px;
        }

        .booking-steps :global(.ant-steps-item-tail)::after {
          background-color: #e5e7eb;
          height: 2px;
        }

        .booking-steps
          :global(.ant-steps-item-finish .ant-steps-item-tail)::after {
          background-color: #2a0a22;
          height: 2px;
        }

        .booking-steps
          :global(.ant-steps-item-process .ant-steps-item-tail)::after {
          background-color: #e5e7eb;
          height: 2px;
        }

        .booking-steps :global(.ant-steps-item-content) {
          margin-top: 8px;
          min-height: auto;
        }

        .booking-steps :global(.ant-steps-item-icon .ant-steps-icon) {
          font-size: 14px;
          font-weight: 600;
        }

        .booking-steps
          :global(.ant-steps-item-finish .ant-steps-item-icon .ant-steps-icon) {
          font-size: 16px;
        }

        /* Responsive design for smaller screens */
        @media (max-width: 768px) {
          .booking-steps {
            padding: 16px;
            border-radius: 8px;
          }

          .booking-steps :global(.ant-steps-item-title) {
            font-size: 13px;
          }

          .booking-steps :global(.ant-steps-item-description) {
            font-size: 11px;
          }

          .booking-steps :global(.ant-steps-item-icon) {
            width: 28px !important;
            height: 28px !important;
            line-height: 26px !important;
          }

          .booking-steps :global(.ant-steps-item-tail) {
            top: 14px;
            padding: 0 16px;
          }
        }

        /* Small size variant */
        .booking-steps :global(.ant-steps-small .ant-steps-item-icon) {
          width: 28px !important;
          height: 28px !important;
          line-height: 26px !important;
          font-size: 12px;
        }

        .booking-steps :global(.ant-steps-small .ant-steps-item-title) {
          font-size: 13px;
        }

        .booking-steps :global(.ant-steps-small .ant-steps-item-description) {
          font-size: 11px;
        }

        .booking-steps :global(.ant-steps-small .ant-steps-item-tail) {
          top: 14px;
        }
      `}</style>
    </div>
  );
};

export default BookingSteps;
