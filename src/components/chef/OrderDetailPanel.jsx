import React, { useState } from "react";
import { RightPanel } from "../ui/RightPanel";
import { Button } from "../ui-waiter/button";
import { Input } from "../ui-waiter/input";
import { useOrders } from "../../context/OrdersContext";

const STATUS_COLORS = {
  confirmed: "bg-yellow-100 text-yellow-800 border-yellow-200",
  cooking: "bg-blue-100 text-blue-800 border-blue-200",
  ready: "bg-green-100 text-green-800 border-green-200",
};

function simulateInventoryDeduction() {
  return Math.random() > 0.7;
}

export default function OrderDetailPanel({ order: orderProp, open, onClose }) {
  const {
    orders,
    updateOrderStatus,
    setOrderInventoryError,
    clearManualAdjustment,
  } = useOrders();
  const [ingredient, setIngredient] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleStartCooking = () => {
    updateOrderStatus(order.id, "cooking");
  };

  const handleMarkReady = () => {
    const success = simulateInventoryDeduction();
    if (success) {
      updateOrderStatus(order.id, "ready");
    } else {
      updateOrderStatus(order.id, "ready");
      setOrderInventoryError(order.id, true);
    }
  };

  const handleManualAdjustment = (e) => {
    e.preventDefault();
    if (ingredient.trim() && quantity.trim()) {
      clearManualAdjustment(order.id);
      setIngredient("");
      setQuantity("");
    }
  };

  const order = orderProp?.id
    ? orders.find((o) => o.id === orderProp.id) ?? orderProp
    : orderProp;

  if (!order) return null;

  const statusColor = STATUS_COLORS[order.status] || STATUS_COLORS.confirmed;

  return (
    <RightPanel
      open={open}
      onClose={onClose}
      title={`Order #${order.id}`}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wider ${statusColor}`}
          >
            {order.status}
          </span>
        </div>

        <section>
          <h3 className="text-sm font-semibold text-neutral-900 mb-2">
            Menu Items
          </h3>
          <ul className="space-y-2">
            {order.items.map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-2 rounded-lg bg-neutral-50 px-4 py-2 text-sm text-neutral-800"
              >
                <span className="text-neutral-500">{i + 1}.</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {order.instructions && (
          <section>
            <h3 className="text-sm font-semibold text-neutral-900 mb-2">
              Special Instructions
            </h3>
            <p className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-900">
              {order.instructions}
            </p>
          </section>
        )}

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

        {order.inventoryError && (
          <section className="rounded-lg border border-red-200 bg-red-50 p-4 space-y-3">
            <p className="text-sm font-medium text-red-700">
              Inventory deduction failed.
            </p>
            <form onSubmit={handleManualAdjustment} className="space-y-2">
              <Input
                placeholder="Ingredient name"
                value={ingredient}
                onChange={(e) => setIngredient(e.target.value)}
                className="text-sm"
              />
              <Input
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="text-sm"
              />
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="w-full"
              >
                Submit Manual Adjustment
              </Button>
            </form>
          </section>
        )}

        <div className="pt-4 border-t border-neutral-200 space-y-2">
          {order.status === "confirmed" && (
            <Button
              onClick={handleStartCooking}
              className="w-full rounded-lg"
            >
              Start Cooking
            </Button>
          )}

          {order.status === "cooking" && (
            <Button
              onClick={handleMarkReady}
              className="w-full rounded-lg"
            >
              Mark Ready
            </Button>
          )}

          {order.status === "ready" && (
            <p className="text-sm text-neutral-500 text-center py-2">
              Order is ready for pickup.
            </p>
          )}
        </div>
      </div>
    </RightPanel>
  );
}
