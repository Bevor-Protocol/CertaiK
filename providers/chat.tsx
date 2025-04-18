"use client";

import { cn } from "@/lib/utils";
import { MessageSquare, Send, Settings, X } from "lucide-react";
import React, { createContext, ReactNode, useContext, useState } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type ChatSettings = {
  showTimestamps: boolean;
  darkMode: boolean;
  fontSize: "small" | "medium" | "large";
};

interface ChatContextType {
  isOpen: boolean;
  messages: Message[];
  settings: ChatSettings;
  openChat: () => void;
  closeChat: () => void;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  updateSettings: (newSettings: Partial<ChatSettings>) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [settings, setSettings] = useState<ChatSettings>({
    showTimestamps: true,
    darkMode: true,
    fontSize: "medium",
  });
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const openChat = (): void => setIsOpen(true);
  const closeChat = (): void => {
    setIsOpen(false);
    setShowSettings(false);
  };

  const clearChat = async (): Promise<void> => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "clearHistory",
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to clear chat history: ${response.statusText}`);
      }

      setMessages([]);
    } catch (error) {
      console.error("Error clearing chat history:", error);
    }
  };

  const updateSettings = (newSettings: Partial<ChatSettings>): void => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const sendMessage = async (content: string): Promise<void> => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No reader available");
      }

      let assistantMessage = "";
      const decoder = new TextDecoder();

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        assistantMessage += chunk;

        // Update the message in real-time as chunks arrive
        setMessages((prev) => {
          const lastMsg = prev.find((msg) => msg.id === "temp-assistant");
          if (lastMsg) {
            return prev.map((msg) =>
              msg.id === "temp-assistant" ? { ...msg, content: assistantMessage } : msg,
            );
          } else {
            return [
              ...prev,
              {
                id: "temp-assistant",
                role: "assistant",
                content: assistantMessage,
                timestamp: new Date(),
              },
            ];
          }
        });
      }

      // Replace the temporary message with a permanent one
      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg.id !== "temp-assistant");
        return [
          ...filtered,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: assistantMessage,
            timestamp: new Date(),
          },
        ];
      });
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "Sorry, there was an error processing your request. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(inputValue);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        messages,
        settings,
        openChat,
        closeChat,
        sendMessage,
        clearChat,
        updateSettings,
      }}
    >
      {children}

      {/* Chat Widget Button */}
      {!isOpen && (
        <button
          onClick={openChat}
          className={cn(
            "fixed bottom-4 right-4 bg-blue-600 text-white p-3",
            "rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50",
          )}
          aria-label="Open Chat"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div
          className={cn(
            "fixed bottom-4 right-4 w-80 md:w-96 h-[500px] bg-white",
            "rounded-lg shadow-xl flex flex-col z-50",
            settings.darkMode && "bg-gray-900 text-white",
          )}
        >
          {/* Header */}
          <div
            className={cn(
              "flex justify-between items-center p-3 border-b",
              settings.darkMode ? "border-gray-700" : "border-gray-200",
            )}
          >
            <h3 className="font-semibold">BevorAI Chat</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={cn(
                  "p-1 rounded-full hover:bg-gray-200",
                  settings.darkMode && "hover:bg-gray-700",
                )}
                aria-label="Settings"
              >
                <Settings size={18} />
              </button>
              <button
                onClick={closeChat}
                className={cn(
                  "p-1 rounded-full hover:bg-gray-200",
                  settings.darkMode && "hover:bg-gray-700",
                )}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div
              className={cn(
                "p-4 border-b",
                settings.darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50",
              )}
            >
              <h4 className="font-medium mb-3">Chat Settings</h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="showTimestamps">Show Timestamps</label>
                  <input
                    id="showTimestamps"
                    type="checkbox"
                    checked={settings.showTimestamps}
                    onChange={(e) => updateSettings({ showTimestamps: e.target.checked })}
                    className="toggle"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label htmlFor="darkMode">Dark Mode</label>
                  <input
                    id="darkMode"
                    type="checkbox"
                    checked={settings.darkMode}
                    onChange={(e) => updateSettings({ darkMode: e.target.checked })}
                    className="toggle"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label htmlFor="fontSize">Font Size</label>
                  <select
                    id="fontSize"
                    value={settings.fontSize}
                    onChange={(e) => updateSettings({ fontSize: e.target.value as any })}
                    className={cn(
                      "p-1 rounded border",
                      settings.darkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300",
                    )}
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>

                <button
                  onClick={clearChat}
                  className="w-full mt-2 py-1 px-3 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Clear Chat History
                </button>
              </div>
            </div>
          )}

          {/* Messages */}
          <div
            className={cn(
              "flex-1 overflow-y-auto p-3 space-y-3",
              settings.darkMode ? "bg-gray-800" : "bg-gray-50",
            )}
          >
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500">
                <p>Start a conversation...</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "max-w-[85%] p-3 rounded-lg",
                    message.role === "user"
                      ? "ml-auto bg-blue-600 text-white"
                      : settings.darkMode
                        ? "bg-gray-700 text-white"
                        : "bg-white text-gray-800 border border-gray-200",
                    settings.fontSize === "small" && "text-sm",
                    settings.fontSize === "large" && "text-lg",
                  )}
                >
                  <div>{message.content}</div>
                  {settings.showTimestamps && (
                    <div
                      className={cn(
                        "text-xs mt-1 opacity-70",
                        settings.fontSize === "small" && "text-[10px]",
                        settings.fontSize === "large" && "text-sm",
                      )}
                    >
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-center">
                <div className="loading-dots">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className={cn(
              "p-3 border-t flex gap-2",
              settings.darkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white",
            )}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..."
              className={cn(
                "flex-1 p-2 rounded border focus:outline-none focus:ring-2",
                settings.darkMode
                  ? "bg-gray-800 border-gray-700 text-white focus:ring-blue-500"
                  : "bg-white border-gray-300 focus:ring-blue-300",
                settings.fontSize === "small" && "text-sm",
                settings.fontSize === "large" && "text-lg",
              )}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className={cn(
                "p-2 rounded bg-blue-600 text-white",
                "hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500",
                "disabled:opacity-50 disabled:cursor-not-allowed",
              )}
              aria-label="Send"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      )}

      {/* CSS for loading animation */}
      <style jsx global>{`
        .loading-dots {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .dot {
          width: 8px;
          height: 8px;
          background-color: ${settings.darkMode ? "#9CA3AF" : "#6B7280"};
          border-radius: 50%;
          animation: pulse 1.5s infinite ease-in-out;
        }

        .dot:nth-child(2) {
          animation-delay: 0.3s;
        }

        .dot:nth-child(3) {
          animation-delay: 0.6s;
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(0.8);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }
      `}</style>
    </ChatContext.Provider>
  );
};

export default ChatProvider;
