import React, { useEffect, useState } from "react";
import OrderCard from "../../components/chef/OrderCard";
import OrderDetailPanel from "../../components/chef/OrderDetailPanel";
import { fetchOrders } from "../../services/order"; // adjust path if needed
import { useOrders } from "../../context/OrdersContext";

const COLUMNS = [
  { key: "CONFIRMED", title: "CONFIRMED" },
  { key: "PREPARING", title: "PREPARING" },
  { key: "READY", title: "READY" },
];

export default function OrdersBoard() {
  const { orders, replaceOrders } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔥 Fetch orders from API
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const data = await fetchOrders(); // no status filter = all orders
        replaceOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [replaceOrders]);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setPanelOpen(true);
  };

  const handleClosePanel = () => {
    setPanelOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen bg-[#FFF5F5] px-4 py-8 text-[#2C2C2C]">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#2C2C2C]">
            Orders Board
          </h1>
          <p className="text-sm text-[#999]">
            Manage cooking state of orders
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-sm text-[#999]">Loading orders...</p>
        )}

        {/* Error */}
        {error && (
          <p className="text-sm text-[#FF4D4F]">{error}</p>
        )}

        {/* Columns */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {COLUMNS.map((col) => {
              // Filter orders by status (case-insensitive)
              const filteredOrders = orders.filter(
                (order) => order.status?.toUpperCase() === col.key
              );

              return (
                <div
                  key={col.key}
                  className="flex flex-col rounded-xl border border-[#FFB3B3] bg-white shadow-sm overflow-hidden"
                >
                  {/* Column Header */}
                  <div className="px-4 py-3 border-b border-[#FFB3B3] bg-[#FFF5F5]">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-[#2C2C2C]">
                      {col.title}
                    </h2>
                    <p className="text-xs text-[#999] mt-0.5">
                      {filteredOrders.length} orders
                    </p>
                  </div>

                  {/* Orders List - Filtered by Status */}
                  <div className="flex-1 overflow-y-auto max-h-[calc(100vh-280px)] p-4 space-y-4">
                    {filteredOrders.length === 0 ? (
                      <p className="text-sm text-[#999] text-center py-6">
                        No orders
                      </p>
                    ) : (
                      filteredOrders.map((order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          onClick={() => handleOrderClick(order)}
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Detail Side Panel */}
      <OrderDetailPanel
        order={selectedOrder}
        open={panelOpen}
        onClose={handleClosePanel}
      />
    </div>
  );
}