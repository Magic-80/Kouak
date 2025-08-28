import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";

let socket = null;

export function getSocket() {
  const { token } = useAuth();
  if (!socket) {
    socket = io("http://localhost:3001", {
      auth: { token },
    });
  }
  return socket;
}
