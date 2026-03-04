/**
 * useSocketHandler Hook
 * Combines socket and orders context for convenient real-time operations
 * Usage: const { socket, connected, acceptOrder } = useSocketHandler();
 */

import { useSocket } from "../context/SocketContext";
import { useOrders } from "../context/OrdersContext";
import * as socketService from "../services/socket";

export function useSocketHandler() {
  const { socket, connected } = useSocket();
  const { addOrder, updateOrderStatus, removeOrder } = useOrders();

  return {
    socket,
    connected,
    
    // Order management
    addOrder,
    updateOrderStatus,
    removeOrder,
    
    // Socket event emitters
    acceptOrder: (orderId) => socketService.acceptOrder(socket, orderId),
    completeOrder: (orderId) => socketService.completeOrder(socket, orderId),
    scanAttendance: (qrData) => socketService.scanAttendance(socket, qrData),
    updateOrderProgress: (orderId, progress) => socketService.updateOrderProgress(socket, orderId, progress),
  };
}

export default useSocketHandler;
