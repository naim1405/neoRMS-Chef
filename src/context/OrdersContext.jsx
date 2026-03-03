import React, { createContext, useContext, useState, useCallback } from "react";

const OrdersContext = createContext(null);

const MOCK_ORDERS = [
  {
    id: "ORD-001",
    items: ["Grilled Salmon", "Caesar Salad", "Garlic Bread"],
    instructions: "Salmon medium-rare, dressing on the side",
    allergies: "Shellfish",
    status: "confirmed",
    inventoryError: false,
  },
  {
    id: "ORD-002",
    items: ["Margherita Pizza", "French Fries"],
    instructions: "Extra cheese",
    allergies: null,
    status: "cooking",
    inventoryError: false,
  },
  {
    id: "ORD-003",
    items: ["Beef Burger", "Onion Rings"],
    instructions: null,
    allergies: "Nuts",
    status: "ready",
    inventoryError: false,
  },
  {
    id: "ORD-004",
    items: ["Chicken Pasta", "Minestrone Soup"],
    instructions: "Pasta al dente",
    allergies: null,
    status: "confirmed",
    inventoryError: false,
  },
];

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(MOCK_ORDERS);

  const updateOrderStatus = useCallback((orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: newStatus } : o
      )
    );
  }, []);

  const setOrderInventoryError = useCallback((orderId, hasError) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, inventoryError: hasError } : o
      )
    );
  }, []);

  const addOrder = useCallback((order) => {
    setOrders((prev) => [order, ...prev]);
  }, []);

  const clearManualAdjustment = useCallback((orderId) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, inventoryError: false } : o
      )
    );
  }, []);

  const value = {
    orders,
    updateOrderStatus,
    setOrderInventoryError,
    addOrder,
    clearManualAdjustment,
  };

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
}
