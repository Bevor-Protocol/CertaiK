import { cn } from '@/lib/utils';
import React, { useEffect, useRef, useState } from 'react';

type Message = {
  type: 'system' | 'user' | 'assistant' | 'error';
  content: string;
};

type TerminalProps = {
  className?: string;
  onSubmit: (input: string) => Promise<void>;
};

export function Terminal({ className, onSubmit }: TerminalProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Message[]>([
    {
      type: 'system',
      content: 'Welcome to Smart Contract Auditor AI. Choose an option:\n\n1. Input contract address\n2. Upload file\n3. Paste code'
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userInput = input.trim();
    setInput('');
    setHistory(prev => [...prev, { type: 'user', content: userInput }]);
    setIsProcessing(true);

    try {
      await onSubmit(userInput);
    } catch (error) {
      console.log(error);
      setHistory(prev => [...prev, { type: 'error', content: 'An error occurred. Please try again.' }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={cn(
      "bg-black/90 border border-gray-800 rounded-lg p-4",
      "flex flex-col h-[600px] w-full max-w-[800px]",
      className
    )}>
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto font-mono text-sm"
      >
        {history.map((message, i) => (
          <div 
            key={i} 
            className={cn(
              "mb-2 leading-relaxed whitespace-pre-line",
              message.type === 'system' && "text-blue-400",
              message.type === 'user' && "text-green-400",
              message.type === 'assistant' && "text-white",
              message.type === 'error' && "text-red-400"
            )}
          >
            {message.type === 'user' && '> '}
            {message.content}
          </div>
        ))}
        
        {isProcessing && (
          <div className="text-yellow-400">Processing...</div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex items-center">
        <span className="text-green-400 mr-2">{'>'}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={cn(
            "flex-1 bg-transparent border-none outline-none",
            "text-white font-mono",
            "placeholder:text-gray-500"
          )}
          placeholder={isProcessing ? "Processing..." : "Type your command..."}
          disabled={isProcessing}
        />
      </form>
    </div>
  );
} 