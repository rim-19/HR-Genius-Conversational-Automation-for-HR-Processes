import React, { useState, useEffect } from "react";
import { useChat } from "../context/ChatContext";
import ChatbotUI from "./ChatbotUI";
import { FiMessageSquare, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const GlobalChat: React.FC = () => {
    const {
        isOpen,
        setIsOpen,
        messages,
        isLoading,
        sendMessage
    } = useChat();

    return (
        <>
            {/* Floating Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    aria-label="Open Assistant"
                >
                    <FiMessageSquare className="h-6 w-6" />
                </button>
            )}

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[400px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5"
                    >
                        {/* Chat Header */}
                        <div className="flex items-center justify-between bg-primary-600 px-4 py-3 text-white">
                            <div className="flex items-center space-x-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                                    <span className="text-lg">🤖</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold">HR Assistant</h3>
                                    <p className="text-xs text-primary-100">Always here to help</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="rounded-lg p-1 transition-colors hover:bg-white/20"
                            >
                                <FiX className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Chat Body */}
                        <div className="flex-1 overflow-hidden bg-gray-50">
                            <ChatbotUI
                                messages={messages}
                                onSendMessage={sendMessage}
                                isLoading={isLoading}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default GlobalChat;
