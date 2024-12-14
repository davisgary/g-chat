import React, { useState, useRef, useEffect } from 'react';
import { parseMessage, renderMessage, Message } from './Messages';
import { AiOutlineLoading } from 'react-icons/ai';
import { FaArrowUp } from 'react-icons/fa';

interface ChatProps {
  onSendMessage?: (message: string) => Promise<string>;
}

const Chat: React.FC<ChatProps> = ({ 
  onSendMessage = async (message) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
    
    const data = await response.json();
    return data.message;
  }
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Thinking...');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { 
      role: 'user', 
      content: input, 
      type: 'text' 
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const assistantReply = await onSendMessage(input);
      const parsedMessage = parseMessage(assistantReply);
      
      setMessages((prev) => [...prev, parsedMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, something went wrong. Please try again.',
        type: 'text',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetLoading = () => {
    setLoadingMessage('Thinking...');
  
    const firstTimeout = setTimeout(() => {
      setLoadingMessage('Getting it together...');
    }, 4000);
  
    const secondTimeout = setTimeout(() => {
      setLoadingMessage('Hang tight, almost there...');
    }, 8000);
  
    return () => {
      clearTimeout(firstTimeout);
      clearTimeout(secondTimeout);
    };
  };
  
  useEffect(() => {
    if (isLoading) {
      const cleanup = handleSetLoading();
      return cleanup;
    }
  }, [isLoading]);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto">

      {/* Chat Messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === 'user' 
                ? 'justify-end' 
                : 'justify-start'
            }`}
          >
            {renderMessage(msg)}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="text-black px-4 py-2 flex items-center">
            <AiOutlineLoading
              className="w-6 h-6 mr-2 animate-spin"
              style={{
                fill: 'url(#gradient1)',
              }}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style={{ position: 'absolute', visibility: 'hidden' }}
            >
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#6366F1' }} />
                  <stop offset="50%" style={{ stopColor: '#3B82F6' }} />
                  <stop offset="100%" style={{ stopColor: '#14B8A6' }} />
                </linearGradient>
              </defs>
            </svg>
            <p className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-blue-500 to-teal-500 font-semibold">
              {loadingMessage}
            </p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 relative">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            placeholder="Message G Chat"
            className="w-full px-5 py-2 pr-16 bg-neutral-700 text-white placeholder-neutral-200 rounded-3xl shadow-[0_0_4px_rgba(255,255,255,0.8)] focus:outline-none resize-none overflow-hidden"
            disabled={isLoading}
            rows={1}
            style={{ minHeight: '60px', maxHeight: '200px', height: '60px', lineHeight: 'normal', paddingTop: '20px', paddingBottom: '20px' }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="absolute right-3 bg-gradient-to-r from-indigo-500 via-blue-500 to-teal-500 text-white w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-80 transition-colors duration-200"
            style={{ top: '47%', transform: 'translateY(-50%)' }}
          >
          <FaArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default Chat;