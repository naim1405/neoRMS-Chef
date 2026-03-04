/**
 * Socket Service - For emitting events to the server
 * Use this to send chef actions (accepting orders, completing orders, etc.)
 */

export async function acceptOrder(socket, orderId) {
  if (!socket || !socket.connected) {
    console.error("[Socket Service] Socket not connected");
    return false;
  }

  try {
    socket.emit("acceptOrder", { orderId });
    console.log("[Socket Service] Emitted acceptOrder event for:", orderId);
    return true;
  } catch (error) {
    console.error("[Socket Service] Failed to emit acceptOrder:", error);
    return false;
  }
}

export async function completeOrder(socket, orderId) {
  if (!socket || !socket.connected) {
    console.error("[Socket Service] Socket not connected");
    return false;
  }

  try {
    socket.emit("completeOrder", { orderId });
    console.log("[Socket Service] Emitted completeOrder event for:", orderId);
    return true;
  } catch (error) {
    console.error("[Socket Service] Failed to emit completeOrder:", error);
    return false;
  }
}

export async function scanAttendance(socket, qrData) {
  if (!socket || !socket.connected) {
    console.error("[Socket Service] Socket not connected");
    return false;
  }

  try {
    socket.emit("scanAttendance", { qrData });
    console.log("[Socket Service] Emitted scanAttendance event with data:", qrData);
    return true;
  } catch (error) {
    console.error("[Socket Service] Failed to emit scanAttendance:", error);
    return false;
  }
}

export async function updateOrderProgress(socket, orderId, progress) {
  if (!socket || !socket.connected) {
    console.error("[Socket Service] Socket not connected");
    return false;
  }

  try {
    socket.emit("updateOrderProgress", { orderId, progress });
    console.log("[Socket Service] Emitted updateOrderProgress event:", { orderId, progress });
    return true;
  } catch (error) {
    console.error("[Socket Service] Failed to emit updateOrderProgress:", error);
    return false;
  }
}
