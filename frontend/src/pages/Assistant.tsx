import React, { useEffect, useRef } from "react";
import { useChat } from "../context/ChatContext";
import ChatbotUI from "../components/ChatbotUI";
import { motion } from "framer-motion";

const Assistant: React.FC = () => {
  const { messages, isLoading, sendMessage } = useChat();

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">AI Assistant</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ask me anything about HR processes and I'll help you out!
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="relative flex-1 overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="absolute inset-0 overflow-hidden bg-gray-50/50 dark:bg-gray-900/50">
          {/* Background decoration if needed */}
        </div>

        <div className="relative z-10 h-full">
          <ChatbotUI
            messages={messages}
            onSendMessage={sendMessage}
            isLoading={isLoading}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Assistant;