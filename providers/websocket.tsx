"use client";

import { authAction } from "@/actions";
import { createContext, useEffect, useRef, useState } from "react";

export type WebSocketContextType = {
  socket: WebSocket | null;
  isConnected: boolean;
  reconnect: () => void;
  sendMessage: (message: any) => void;
  setOnMessageHandler: (data: any) => void;
};

export const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false,
  reconnect: () => {},
  sendMessage: () => {},
  setOnMessageHandler: () => {},
});

const WebSocketProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const onMessageHandler = useRef<(data: any) => void>(() => {});

  const fetchSigningSecretAndConnect = async (): Promise<void> => {
    try {
      const { signature, timestamp } = await authAction.getSecureSigning();
      const ws = new WebSocket(
        `http://localhost:8000/ws?signature=${signature}&timestamp=${timestamp}`,
      );

      ws.onopen = (): void => {
        console.log("WebSocket Connected");
        setIsConnected(true);
      };

      ws.onclose = (): void => {
        console.log("WebSocket Disconnected");
        setIsConnected(false);
        setTimeout(() => {
          setSocket(null);
        }, 5000);
      };

      ws.onerror = (error): void => {
        console.log("Error connecting to WS", error);
        setIsConnected(false);
      };

      ws.onmessage = (event): void => {
        const data = JSON.parse(event.data);
        if (data.type === "heartbeat") {
          ws.send("PONG");
        } else if (data.type === "eval") {
          if (onMessageHandler.current) {
            onMessageHandler.current(data);
          }
        }
      };

      setSocket(ws);
    } catch (error) {
      console.error("Failed to fetch signing secret:", error);
    }
  };

  const reconnect = (): void => {
    if (!isConnected) {
      fetchSigningSecretAndConnect();
    }
  };

  useEffect(() => {
    fetchSigningSecretAndConnect();

    return (): void => {
      if (socket) {
        socket.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = (message: string): void => {
    if (socket && isConnected) {
      socket.send(message);
    } else {
      console.warn("WebSocket is not connected");
    }
  };

  const setOnMessageHandler = (handler: (data: any) => void): void => {
    onMessageHandler.current = handler;
  };

  return (
    <WebSocketContext.Provider
      value={{ socket, isConnected, reconnect, sendMessage, setOnMessageHandler }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
