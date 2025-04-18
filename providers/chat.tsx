"use client";

import { certaikApiAction } from "@/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChatContextType, ChatMessageI } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { Clock, MessageSquare, Send, X } from "lucide-react";
import { createContext, ReactNode, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

export const ChatContext = createContext<ChatContextType>({
  isOpen: false,
  messages: [],
  openChat: () => {},
  closeChat: () => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  sendMessage: (content: string) => Promise.resolve(),
  clearChat: () => {},
  currentAuditId: null,
  setCurrentAuditId: () => {},
});

export const ChatProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessageI[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showChatHistory, setShowChatHistory] = useState<boolean>(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [currentAuditId, setCurrentAuditId] = useState<string | null>(null);
  const [isInitiatingChat, setIsInitiatingChat] = useState<boolean>(false);
  const [streamedMessage, setStreamedMessage] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-scroll when messages change or when streaming
  useEffect(() => {
    scrollToBottom();
  }, [messages, streamedMessage]);

  const { data: chats, refetch: refetchChats } = useQuery({
    queryKey: ["chats"],
    queryFn: async () => certaikApiAction.getChats(),
  });

  const openChat = (): void => setIsOpen(true);
  const closeChat = (): void => {
    setIsOpen(false);
  };

  const initiateChat = async (): Promise<void> => {
    if (!currentAuditId) {
      console.error("Cannot initiate chat without an audit ID");
      return;
    }

    setIsInitiatingChat(true);
    try {
      const chatId = await certaikApiAction.initiateChat(currentAuditId);

      setCurrentChatId(chatId);
      setMessages([]);
      await refetchChats();
    } catch (error) {
      console.error("Error initiating chat:", error);
    } finally {
      setIsInitiatingChat(false);
    }
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
      setCurrentChatId(null);
    } catch (error) {
      console.error("Error clearing chat history:", error);
    }
  };

  const loadChatHistory = async (chatId: string): Promise<void> => {
    if (!chats) return;

    const messages = await certaikApiAction.getChatMessages(chatId);

    setMessages(messages);
    setCurrentChatId(chatId);
    setShowChatHistory(false);
  };

  const sendMessage = async (content: string): Promise<void> => {
    if (!content.trim() || !currentChatId) return;

    const userMessage: ChatMessageI = {
      id: Date.now().toString(),
      created_at: Date.now().toString(),
      role: "user",
      content,
      timestamp: Date().toString(),
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
          message: content.trim(),
          chatId: currentChatId,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      let assistantMessage = "";
      let buffered = "";
      const decoder = new TextDecoder();

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Accumulate text
        buffered += decoder.decode(value, { stream: true });

        // Split by newlines (you yield `... + b"\n"` in Python)
        const lines = buffered.split("\n");

        // Keep last line (incomplete?) in buffer
        buffered = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const parsed = JSON.parse(line);
            assistantMessage = parsed.content;
            setStreamedMessage(parsed.content);
          } catch (err) {
            console.warn("Failed to parse chunk:", line, err);
          }
        }
      }
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          created_at: Date.now().toString(),
          role: "system",
          content: assistantMessage,
          timestamp: Date().toString(),
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          created_at: Date.now().toString(),
          role: "system",
          content: "Sorry, there was an error processing your request. Please try again.",
          timestamp: Date().toString(),
        },
      ]);
    } finally {
      setStreamedMessage("");
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (inputValue.trim() && currentChatId) {
      sendMessage(inputValue);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        messages,
        openChat,
        closeChat,
        sendMessage,
        clearChat,
        currentAuditId,
        setCurrentAuditId,
      }}
    >
      {!isOpen && (
        <Button
          onClick={openChat}
          variant="bright"
          className={cn(
            "fixed bottom-4 right-4 p-3 w-fit h-fit min-w-fit",
            "z-50 rounded-full shadow-lg",
          )}
        >
          <MessageSquare size={24} />
        </Button>
      )}
      {isOpen && (
        <div
          className={cn(
            "fixed bottom-4 right-4 w-[800px] max-w-[80%] h-[800px] max-h-[80%] bg-gray-900 text-white",
            "rounded-lg shadow-xl flex flex-col z-50",
          )}
        >
          <div className={cn("flex justify-between items-center p-3 border-b", "border-gray-700")}>
            <h3 className="font-semibold">BevorAI Chat</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setShowChatHistory(!showChatHistory)}
                className={cn("p-1 rounded-full hover:bg-gray-700")}
                aria-label="Chat History"
              >
                <Clock size={18} />
              </button>
              <button
                onClick={closeChat}
                className={cn("p-1 rounded-full hover:bg-gray-700")}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {showChatHistory ? (
            <div className={cn("flex-1 overflow-y-auto p-3 space-y-3 bg-gray-800")}>
              <h4 className="font-medium text-sm mb-2">Chat History</h4>
              {!chats || chats.length === 0 ? (
                <div className="text-gray-500 text-center py-4">No previous chats found</div>
              ) : (
                <div className="space-y-2">
                  {chats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => loadChatHistory(chat.id)}
                      className={cn(
                        "p-2 rounded cursor-pointer hover:bg-gray-700 transition-colors",
                        currentChatId === chat.id ? "bg-gray-700" : "bg-gray-800",
                      )}
                    >
                      <div className="font-medium text-sm truncate">{chat.audit.introduction}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(chat.created_at || Date.now()).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-400">{chat.total_messages} messages</div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4">
                <Button
                  onClick={() => {
                    setMessages([]);
                    setCurrentChatId(null);
                    setShowChatHistory(false);
                  }}
                  variant="bright"
                  className="w-full"
                >
                  Start New Chat
                </Button>
              </div>
            </div>
          ) : (
            <div className={cn("flex-1 overflow-y-auto p-3 space-y-3 bg-gray-800")}>
              {messages.length === 0 && !currentChatId ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 p-4">
                  <p className="mb-4 text-center">
                    {currentAuditId
                      ? "Start a new chat about this audit"
                      : "Select an audit to start chatting"}
                  </p>
                  {currentAuditId && (
                    <Button
                      onClick={initiateChat}
                      variant="bright"
                      className="w-full"
                      disabled={isInitiatingChat}
                    >
                      {isInitiatingChat ? "Initiating..." : "Start New Chat"}
                    </Button>
                  )}
                </div>
              ) : messages.length === 0 && currentChatId ? (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <p>Start a conversation...</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "max-w-[85%] p-3 rounded-lg text-sm",
                      message.role === "user"
                        ? "ml-auto bg-blue-600 text-white"
                        : "bg-gray-700 text-white",
                    )}
                  >
                    <div>
                      <ReactMarkdown className="markdown">{message.content}</ReactMarkdown>
                    </div>
                    <div className={cn("text-xs mt-1 opacity-70 text-[10px]")}>
                      {message.timestamp}
                    </div>
                  </div>
                ))
              )}
              {streamedMessage && (
                <div className={cn("max-w-[85%] p-3 rounded-lg text-sm", "bg-gray-700 text-white")}>
                  <div>{streamedMessage}</div>
                </div>
              )}
              {isLoading && !streamedMessage && (
                <div className="flex justify-center">
                  <p>
                    Loading
                    <span className="animate-loading-dots inline-block overflow-x-hidden align-bottom">
                      ...
                    </span>
                  </p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className={cn("p-3 border-t flex gap-2 border-gray-700 bg-gray-900")}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..."
              className={cn(
                "flex-1 p-2 rounded border focus:outline-none focus:ring-2 text-sm",
                "bg-gray-800 border-gray-700 text-white focus:ring-blue-500",
              )}
              disabled={isLoading || showChatHistory || !currentChatId}
            />
            <Button
              type="submit"
              variant="bright"
              disabled={isLoading || !inputValue.trim() || showChatHistory || !currentChatId}
              className={cn("p-3 w-fit h-fit min-w-fit", "rounded-lg shadow-lg")}
            >
              <Send size={20} />
            </Button>
          </form>
        </div>
      )}
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
