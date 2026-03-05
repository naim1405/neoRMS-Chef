import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import socketio from "socket.io-client";
import { SOCKET_URL, ChefSocketEventEnum } from "../constants";
import { useAuth } from "./AuthContext";
import { useOrders } from "./OrdersContext";
import { getOrder } from "../services/order";

const SocketContext = createContext<{
  socket: ReturnType<typeof socketio> | null;
  connected: boolean;
}>({
  socket: null,
  connected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token, tenantId, user } = useAuth();
  const { addOrder, updateOrderStatus, removeOrder } = useOrders();
  const socketRef = useRef<ReturnType<typeof socketio> | null>(null);
  const [socket, setSocket] = useState<ReturnType<typeof socketio> | null>(
    null,
  );
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // No token — disconnect any existing socket and bail
    if (!token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setConnected(false);
      }
      return;
    }

    // Already have a live connection
    if (socketRef.current?.connected) return;

    const s = socketio(SOCKET_URL, {
      withCredentials: true,
      auth: { token },
      extraHeaders: {
        "x-tenant-id": tenantId ?? "",
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 10,
    });

    socketRef.current = s;

    // Connection established
    s.on("connect", () => {
      console.log("[Socket] Connected to server");
      setSocket(s);
      setConnected(true);
    });

    s.on("disconnect", () => {
      console.log("[Socket] Disconnected from server");
      setConnected(false);
    });

    s.on("connect_error", (err) => {
      console.error("[Socket] Connection error:", err.message);
    });

    // Socket error handler
    s.on(ChefSocketEventEnum.SOCKET_ERROR_EVENT, (data) => {
      console.error("[Socket] SOCKET_ERROR_EVENT:", data);
    });

    // ORDER CONFIRMED - Fetch full order and add to dashboard
    s.on(ChefSocketEventEnum.ORDER_CONFIRMED_EVENT, async (data) => {
      try {
        console.log("[Socket] ORDER_CONFIRMED_EVENT received:", data);
        
        const orderId = data?.orderId || data?.id;
        if (!orderId) {
          console.error("[Socket] No orderId in ORDER_CONFIRMED_EVENT");
          return;
        }

        // Fetch the full order from API
        const fullOrder = await getOrder(orderId);
        console.log("[Socket] Full order fetched:", fullOrder);

        // Add to orders dashboard
        addOrder(fullOrder);
      } catch (error) {
        console.error("[Socket] Failed to process ORDER_CONFIRMED_EVENT:", error);
      }
    });

    // ORDER IN PROGRESS - Check if current chef or another chef accepted it
    s.on(ChefSocketEventEnum.ORDER_IN_PROGRESS_EVENT, async (data) => {
      try {
        console.log("[Socket] ORDER_IN_PROGRESS_EVENT received:", data);
        
        const orderId = data?.orderId || data?.id;
        const chefWhoAcceptedId = data?.chefId;

        if (!orderId || !chefWhoAcceptedId) {
          console.error("[Socket] Missing orderId or chefId in ORDER_IN_PROGRESS_EVENT");
          return;
        }

        const currentChefId = user?.id || localStorage.getItem("chefId");

        // This chef accepted the order
        if (chefWhoAcceptedId === currentChefId) {
          console.log("[Socket] Current chef accepted the order:", orderId);
          updateOrderStatus(orderId, "cooking");
        } 
        // Another chef accepted the order
        else {
          console.log("[Socket] Another chef accepted this order, removing from dashboard:", orderId);
          removeOrder(orderId);
        }
      } catch (error) {
        console.error("[Socket] Failed to process ORDER_IN_PROGRESS_EVENT:", error);
      }
    });

    // ORDER DELIVERED - order moved to DELIVERED status
    s.on(ChefSocketEventEnum.ORDER_DELIVERED_EVENT, (data) => {
      console.log("[Socket] ORDER_DELIVERED_EVENT received:", data);
      alert(`[orderDelivered]\nOrder ID: ${data?.orderId ?? "unknown"}`);
    });

    // ORDER CANCELLED - Remove or update the order
    s.on(ChefSocketEventEnum.ORDER_CANCELLED_EVENT, (data) => {
      try {
        console.log("[Socket] ORDER_CANCELLED_EVENT received:", data);
        
        const orderId = data?.orderId || data?.id;
        if (!orderId) {
          console.error("[Socket] No orderId in ORDER_CANCELLED_EVENT");
          return;
        }

        // Update status to cancelled
        updateOrderStatus(orderId, "cancelled");
        console.log("[Socket] Order marked as cancelled:", orderId);
      } catch (error) {
        console.error("[Socket] Failed to process ORDER_CANCELLED_EVENT:", error);
      }
    });

    // Cleanup on unmount or token change
    return () => {
      s.disconnect();
      socketRef.current = null;
      setSocket(null);
      setConnected(false);
    };
  }, [token, tenantId, user, addOrder, updateOrderStatus, removeOrder]);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};

