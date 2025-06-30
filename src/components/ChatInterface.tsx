import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, AlertCircle, Trash2 } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { ChatMessage } from '../types/chat';

interface ChatInterfaceProps {
  isExpanded?: boolean;
  onSendMessage?: (message: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ isExpanded = false, onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const { messages, isLoading, error, sendMessage, clearChat } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const messageToSend = inputValue;
    setInputValue('');
    
    if (onSendMessage) {
      onSendMessage(messageToSend);
    }
    
    await sendMessage(messageToSend);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p className="text-lg mb-2">Start a conversation</p>
            <p className="text-sm">Ask me anything about your company policies, procedures, or get help with tasks.</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.role === 'user' ? 'text-orange-100' : 'text-gray-500'
              }`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2 flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-gray-600">Thinking...</span>
            </div>
          </div>
        )}
        
        {error && (
          <div className="flex justify-center">
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 flex items-center space-x-2 text-red-700">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="border-t border-gray-200 p-4">
        {messages.length > 0 && (
          <div className="flex justify-end mb-2">
            <button
              onClick={clearChat}
              className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear chat</span>
            </button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className={`flex-1 ${isExpanded ? 'py-3 px-4 text-lg' : 'py-2 px-3'} border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all`}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className={`${isExpanded ? 'px-6 py-3' : 'px-4 py-2'} bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2`}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {isExpanded && <span>Send</span>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;