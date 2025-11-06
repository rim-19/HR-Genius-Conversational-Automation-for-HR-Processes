import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ChatbotUI from '../components/ChatbotUI';
import { FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const Assistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your HR-Genius AI Assistant. How can I help you today? I can assist with:\n\n• Generating employee certificates\n• Updating salary information\n• Sending internal communications\n• Managing employee records\n• And much more!',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (text: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI response
    setIsLoading(true);

    // TODO: connect chat to /api/assistant
    // Example: await axios.post("/api/assistant", { prompt: text })

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `I understand you want to "${text}". This is a demo response. In production, I would connect to the backend API to process your request and provide real assistance with HR tasks.`,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: '1',
        text: 'Hello! I\'m your HR-Genius AI Assistant. How can I help you today?',
        sender: 'ai',
        timestamp: new Date(),
      },
    ]);
    toast.info('Chat history cleared');
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
          <p className="text-sm text-gray-600">
            Ask me anything about HR processes and I'll help you out!
          </p>
        </div>
        <button
          onClick={handleClearChat}
          className="btn btn-outline flex items-center space-x-2"
        >
          <FiTrash2 className="h-4 w-4" />
          <span>Clear Chat</span>
        </button>
      </motion.div>

      {/* Chat container with animated gradient background */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="relative flex-1 overflow-hidden rounded-xl bg-gradient-to-br from-primary-50 via-white to-secondary-50 shadow-lg"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-primary-200 opacity-20 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 20, 0],
              y: [0, 20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-secondary-200 opacity-20 blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -20, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        {/* Chat UI */}
        <div className="relative z-10 h-full">
          <ChatbotUI
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Assistant;