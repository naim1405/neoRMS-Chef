import React, { useState } from "react";
import OrderCard from "../../components/chef/OrderCard";
import OrderDetailPanel from "../../components/chef/OrderDetailPanel";
import { useOrders } from "../../context/OrdersContext";

const COLUMNS = [
  { key: "confirmed", title: "Confirmed" },
  { key: "cooking", title: "Cooking" },
  { key: "ready", title: "Ready" },
];

export default function OrdersBoard() {
  const { orders } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setPanelOpen(true);
  };

  const handleClosePanel = () => {
    setPanelOpen(false);
    setSelectedOrder(null);
  };

  const ordersByColumn = COLUMNS.reduce((acc, col) => {
    acc[col.key] = orders.filter((o) => o.status === col.key);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-8 text-neutral-900">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Orders Board
          </h1>
          <p className="text-sm text-neutral-500">
            Manage cooking state of confirmed orders
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {COLUMNS.map((col) => (
            <div
              key={col.key}
              className="flex flex-col rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-700">
                  {col.title}
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {ordersByColumn[col.key]?.length ?? 0} orders
                </p>
              </div>
              <div className="flex-1 overflow-y-auto max-h-[calc(100vh-280px)] p-4 space-y-4">
                {(ordersByColumn[col.key] || []).map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onClick={() => handleOrderClick(order)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <OrderDetailPanel
        order={selectedOrder}
        open={panelOpen}
        onClose={handleClosePanel}
      />
    </div>
  );
}
