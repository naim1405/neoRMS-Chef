export const BACKEND_URL = import.meta.env.VITE_API_URL;
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const ChefSocketEventEnum = Object.freeze({
  // once user is ready to go
  CONNECTED_EVENT: "connected",
  // when user gets disconnected
  DISCONNECT_EVENT: "disconnect",
  // when there is an error in socket
  SOCKET_ERROR_EVENT: "socketError",
  // when user places an order (waiter event — kept for reference)
  ORDER_PLACED_EVENT: "orderPlaced",
  // when order is confirmed by waiter
  ORDER_CONFIRMED_EVENT: "orderConfirmed",
  // when order moves to PREPARING
  ORDER_IN_PROGRESS_EVENT: "orderInProgress",
  // when order is delivered
  ORDER_DELIVERED_EVENT: "orderDelivered",
  // when order is cancelled
  ORDER_CANCELLED_EVENT: "orderCancelled",
});
