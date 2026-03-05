import React from "react";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "../ui-waiter/card";

export default function OrderCard({ order = {}, onClick }) {
  // Normalize backend status (CONFIRMED → confirmed)
  const normalizedStatus = order.status?.toLowerCase() || "confirmed";

  const STATUS_COLORS = {
    confirmed: "bg-yellow-100 text-yellow-800 border-yellow-200",
    preparing: "bg-blue-100 text-blue-800 border-blue-200",
    ready: "bg-green-100 text-green-800 border-green-200",
    canceled: "bg-[#FFF5F5] text-[#FF4D4F] border-[#FFB3B3]",
    delivered: "bg-gray-200 text-gray-700 border-gray-300",
    pending: "bg-orange-100 text-orange-800 border-orange-200",
  };

  const statusColor =
    STATUS_COLORS[normalizedStatus] || STATUS_COLORS.confirmed;

  // Support multiple possible backend formats
  const items = order.items || order.orderItems || [];
  
  console.log("[OrderCard] Received order:", order);
  console.log("[OrderCard] Items found:", items);

  return (
    <Card
      className="border border-[#FFB3B3] bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#FF4D4F] cursor-pointer group"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-[#2C2C2C]">
            Order #{order.id ?? "N/A"}
          </span>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${statusColor}`}
            >
              {order.status || "CONFIRMED"}
            </span>

            <ChevronRight className="h-4 w-4 text-[#999] group-hover:text-[#FF7F7F] transition-colors" />
          </div>
        </div>

        {/* Instructions */}
        {order.instructions && (
          <p className="text-xs text-[#666] truncate">
            {order.instructions}
          </p>
        )}

        {/* Allergies */}
        {order.allergies && (
          <p className="text-xs text-amber-600 font-medium truncate">
            ⚠ {order.allergies}
          </p>
        )}

      </CardContent>
    </Card>
  );
}