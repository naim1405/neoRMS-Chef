import React, { useEffect, useState } from "react";
import { RightPanel } from "../ui/RightPanel";
import { Button } from "../ui-waiter/button";
import { getOrder, updateOrderStatus } from "../../services/order";
import { useOrders } from "../../context/OrdersContext";

export default function OrderDetailPanel({ order: orderProp, open, onClose }) {
  const { updateOrderStatus: updateBoardOrderStatus, addOrder } = useOrders();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch individual order when panel opens
  useEffect(() => {
    if (!orderProp?.id || !open) return;

    const fetchSingleOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getOrder(orderProp.id);
        console.log("Order fetched successfully:", data);
        setOrder(data);
      } catch (error) {
        console.error("Failed to fetch order:", error);
        setError(error?.response?.data?.message || error.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchSingleOrder();
  }, [orderProp, open]);

  const normalizedStatus = order?.status?.toLowerCase();

  const STATUS_COLORS = {
    confirmed: "bg-yellow-100 text-yellow-800 border-yellow-200",
    preparing: "bg-blue-100 text-blue-800 border-blue-200",
    ready: "bg-green-100 text-green-800 border-green-200",
    canceled: "bg-[#FFF5F5] text-[#FF4D4F] border-[#FFB3B3]",
    delivered: "bg-gray-200 text-gray-700 border-gray-300",
  };

  const statusColor =
    STATUS_COLORS[normalizedStatus] || STATUS_COLORS.confirmed;

  const items = order?.items || order?.orderItems || [];

  // Update status via API
  const handleStartCooking = async () => {
    if (!order) return;
    await updateOrderStatus(order.id, "PREPARING");
    updateBoardOrderStatus(order.id, "PREPARING");
    setOrder({ ...order, status: "PREPARING" });
  };

  const handleMarkReady = async () => {
    if (!order) return;

    await updateOrderStatus(order.id, "READY");

    addOrder({
      ...order,
      status: "READY",
    });

    setOrder({
      ...order,
      status: "READY",
    });
  };

  return (
    <RightPanel open={open} onClose={onClose} title={`Order #${order?.id || "Loading"}`}>
      <div className="space-y-6">
        {loading && (
          <p className="text-sm text-[#999]">Loading order details...</p>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        {!loading && order && (
          <>
            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wider ${statusColor}`}
              >
                {order.status}
              </span>
            </div>

            {/* Order Information */}
            <section className="grid grid-cols-2 gap-3">
              {order.orderType && (
                <div className="rounded-lg bg-[#FFF5F5] p-3">
                  <p className="text-xs text-[#999] uppercase tracking-wider font-medium">Order Type</p>
                  <p className="text-sm text-[#2C2C2C] font-semibold mt-1">{order.orderType}</p>
                </div>
              )}
              
              {order.createdAt && (
                <div className="rounded-lg bg-[#FFF5F5] p-3">
                  <p className="text-xs text-[#999] uppercase tracking-wider font-medium">Created At</p>
                  <p className="text-sm text-[#2C2C2C] font-semibold mt-1">
                    {new Date(order.createdAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
              )}
              
              {items.length > 0 && items[0]?.variantType && (
                <div className="rounded-lg bg-[#FFF5F5] p-3">
                  <p className="text-xs text-[#999] uppercase tracking-wider font-medium">Variant</p>
                  <p className="text-sm text-[#2C2C2C] font-semibold mt-1">{items[0].variantType}</p>
                </div>
              )}
            </section>

            {/* Add-ons */}
            {order.addOns && order.addOns.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold text-[#2C2C2C] mb-2">
                  Add-ons
                </h3>
                <ul className="space-y-2">
                  {order.addOns.map((addon, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 rounded-lg bg-[#FFF5F5] px-4 py-2 text-sm text-[#2C2C2C]"
                    >
                      <span className="text-[#999]">•</span>
                      {typeof addon === "string" ? addon : `${addon.name || "Add-on"} ${addon.price ? `(+₹${addon.price})` : ""}`}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Notes */}
            {order.notes && (
              <section>
                <h3 className="text-sm font-semibold text-[#2C2C2C] mb-2">
                  Notes
                </h3>
                <p className="rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-900">
                  {order.notes}
                </p>
              </section>
            )}

            {/* Items */}
            <section>
              <h3 className="text-sm font-semibold text-[#2C2C2C] mb-2">
                Menu Items
              </h3>

              {items.length === 0 ? (
                <p className="text-sm text-[#999]">No items</p>
              ) : (
                <ul className="space-y-2">
                  {items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 rounded-lg bg-[#FFF5F5] px-4 py-2 text-sm text-[#2C2C2C]"
                    >
                      <span className="text-[#999]">{i + 1}.</span>
                      {typeof item === "string"
                        ? item
                        : `${
                            item.name ||
                            item.menuItemName ||
                            item.menuItem?.name ||
                            "Item"
                          } x${item.quantity || 1}`}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Instructions */}
            {order.instructions && (
              <section>
                <h3 className="text-sm font-semibold text-[#2C2C2C] mb-2">
                  Special Instructions
                </h3>
                <p className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-900">
                  {order.instructions}
                </p>
              </section>
            )}

            {/* Allergies */}
            {order.allergies && (
              <section>
                <h3 className="text-sm font-semibold text-amber-700 mb-2">
                  Allergy Notes
                </h3>
                <p className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800 font-medium">
                  {order.allergies}
                </p>
              </section>
            )}

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#FFB3B3] space-y-2">
              {order.status === "CONFIRMED" && (
                <Button
                  onClick={handleStartCooking}
                  className="w-full rounded-lg"
                >
                  Start Cooking
                </Button>
              )}

              {order.status === "PREPARING" && (
                <Button
                  onClick={handleMarkReady}
                  className="w-full rounded-lg"
                >
                  Mark Ready
                </Button>
              )}

              {order.status === "READY" && (
                <p className="text-sm text-[#999] text-center py-2">
                  Order is ready for pickup.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </RightPanel>
  );
}