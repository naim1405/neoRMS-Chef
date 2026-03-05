import React, { createContext, useContext, useState, useCallback } from "react";

const OrdersContext = createContext(null);

export function OrdersProvider({ children }) {
  const [orders, setOrdersState] = useState([]);

  const replaceOrders = useCallback((nextOrders) => {
    setOrdersState(Array.isArray(nextOrders) ? nextOrders : []);
  }, []);

  const updateOrderStatus = useCallback((orderId, newStatus) => {
    setOrdersState((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: newStatus } : o
      )
    );
  }, []);

  const setOrderInventoryError = useCallback((orderId, hasError) => {
    setOrdersState((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, inventoryError: hasError } : o
      )
    );
  }, []);

  const addOrder = useCallback((order) => {
    if (!order?.id) return;

    setOrdersState((prev) => {
      const existingIndex = prev.findIndex((o) => o.id === order.id);

      if (existingIndex === -1) {
        return [order, ...prev];
      }

      const next = [...prev];
      next[existingIndex] = { ...next[existingIndex], ...order };
      return next;
    });
  }, []);

  const clearManualAdjustment = useCallback((orderId) => {
    setOrdersState((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, inventoryError: false } : o
      )
    );
  }, []);

  const removeOrder = useCallback((orderId) => {
    setOrdersState((prev) => prev.filter((o) => o.id !== orderId));
  }, []);

  const value = {
    orders,
    replaceOrders,
    updateOrderStatus,
    setOrderInventoryError,
    addOrder,
    clearManualAdjustment,
    removeOrder,
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
