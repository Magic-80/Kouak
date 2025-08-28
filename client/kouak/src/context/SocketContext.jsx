import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const { token } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (token) {
      const newSocket = io(import.meta.env.VITE_SERVER_URL, {
        auth: { token },
        extraHeaders: { Authorization: `Bearer ${token}` },
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
        setSocket(null);
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [token]);

  const value = useMemo(() => ({ socket, token }), [socket, token]);

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
