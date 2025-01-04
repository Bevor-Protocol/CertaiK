"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

type WebSocketContextType = {
  socket: WebSocket | null;
  isConnected: boolean;
  sendMessage: (message: any) => void;
  setOnMessageHandler: (data: any) => void;
};

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false,
  sendMessage: () => {},
  setOnMessageHandler: () => {},
});

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const onMessageHandler = useRef<(data: any) => void>(() => {});

  useEffect(() => {
    const fetchSigningSecretAndConnect = async () => {
      try {
        // Fetch the signing secret from your backend
        const response = await fetch("/api/signing");
        const { signature, timestamp } = await response.json();

        // Establish WebSocket connection with the signing secret as a query parameter
        const ws = new WebSocket(
          `http://localhost:8000/ws?signature=${signature}&timestamp=${timestamp}`,
        );

        ws.onopen = () => {
          console.log("WebSocket Connected");
          setIsConnected(true);
        };

        ws.onclose = () => {
          console.log("WebSocket Disconnected");
          setIsConnected(false);
          setTimeout(() => {
            setSocket(null);
          }, 5000);
        };

        ws.onerror = (error) => {
          console.log("Error connecting to WS");
          setIsConnected(false);
        };

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === "heartbeat") {
            ws.send("PONG");
          } else if (onMessageHandler.current) {
            onMessageHandler.current(data);
          }
        };

        setSocket(ws);
      } catch (error) {
        console.error("Failed to fetch signing secret:", error);
      }
    };

    fetchSigningSecretAndConnect();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  const sendMessage = (message: string) => {
    if (socket && isConnected) {
      socket.send(message);
    } else {
      console.warn("WebSocket is not connected");
    }
  };

  const setOnMessageHandler = (handler: (data: any) => void) => {
    onMessageHandler.current = handler;
  };

  return (
    <WebSocketContext.Provider value={{ socket, isConnected, sendMessage, setOnMessageHandler }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export const useWs = () => useContext(WebSocketContext);
