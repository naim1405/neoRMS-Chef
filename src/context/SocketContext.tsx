import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import socketio from "socket.io-client";
import { SOCKET_URL } from "../constants";
import { useAuth } from "./AuthContext";

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
  const { token, tenantId } = useAuth();
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
    });

    socketRef.current = s;

    // Fix #3: resolve connected state only once the handshake completes
    s.on("connect", () => {
      setSocket(s);
      setConnected(true);
    });

    s.on("disconnect", () => {
      setConnected(false);
    });

    s.on("connect_error", (err) => {
      console.error("[Socket] connection error:", err.message);
    });

    // Fix #2: disconnect and clean up when this effect re-runs or component unmounts
    return () => {
      s.disconnect();
      socketRef.current = null;
      setSocket(null);
      setConnected(false);
    };
  }, [token]); // Fix #5: re-runs automatically when token changes (login/logout)

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};
