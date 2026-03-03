import React from "react";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "../ui-waiter/card";

const STATUS_COLORS = {
  confirmed: "bg-yellow-100 text-yellow-800 border-yellow-200",
  cooking: "bg-blue-100 text-blue-800 border-blue-200",
  ready: "bg-green-100 text-green-800 border-green-200",
};

export default function OrderCard({ order, onClick }) {
  const statusColor = STATUS_COLORS[order.status] || STATUS_COLORS.confirmed;

  return (
    <Card
      className="border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer group"
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
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-neutral-900">
            Order #{order.id}
          </span>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${statusColor}`}
            >
              {order.status}
            </span>
            <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:text-[#E6501B] transition-colors" />
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
            Items
          </p>
          <ul className="text-sm text-neutral-800 list-disc list-inside">
            {order.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        {order.instructions && (
          <p className="text-xs text-neutral-600 truncate">
            {order.instructions}
          </p>
        )}

        {order.allergies && (
          <p className="text-xs text-amber-600 font-medium truncate">
            {order.allergies}
          </p>
        )}

        {order.inventoryError && (
          <p className="text-xs text-red-600 font-medium">
            Inventory deduction failed
          </p>
        )}
      </CardContent>
    </Card>
  );
}
