import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { assistantAPI } from '../services/api';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

interface ChatContextType {
    messages: Message[];
    isLoading: boolean;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    sendMessage: (text: string) => Promise<void>;
    addMessage: (text: string, sender: 'user' | 'ai') => void;
    clearChat: () => void;
    isListening: boolean;
    startListening: () => void;
    stopListening: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);

    // Ref to keep track of recognition instance
    const recognitionRef = React.useRef<any>(null);

    // Load chat history on mount
    useEffect(() => {
        const loadHistory = async () => {
            try {
                const response = await assistantAPI.getHistory();
                const history = response.data.map((msg: any) => ({
                    id: msg.id.toString(),
                    text: msg.content,
                    sender: msg.role === 'user' ? 'user' : 'ai',
                    timestamp: new Date(msg.createdAt),
                }));

                if (history.length === 0) {
                    setMessages([
                        {
                            id: 'default-welcome',
                            text: "Hello! I am your HR Assistant. How can I help you today?",
                            sender: 'ai',
                            timestamp: new Date(),
                        },
                    ]);
                } else {
                    setMessages(history);
                }
            } catch (error) {
                console.error('Failed to load history:', error);
                // Fallback to default message on error
                setMessages([
                    {
                        id: 'error-welcome',
                        text: "Hello! I am your HR Assistant. How can I help you today?",
                        sender: 'ai',
                        timestamp: new Date(),
                    },
                ]);
            }
        };
        loadHistory();
    }, []);

    const addMessage = useCallback((text: string, sender: 'user' | 'ai') => {
        const newMessage: Message = {
            id: Date.now().toString(),
            text,
            sender,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newMessage]);
    }, []);

    const sendMessage = async (text: string) => {
        addMessage(text, 'user');
        setIsLoading(true);

        try {
            const response = await assistantAPI.sendMessage(text);
            addMessage(response.data.message, 'ai');
        } catch (error: any) {
            console.error('Error sending message:', error);
            // Instead of toast, add error as AI message
            const errorMessage = error.response?.data?.message || 'Sorry, I encountered an error processing your request.';
            addMessage(`⚠️ Error: ${errorMessage}`, 'ai');
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = async () => {
        try {
            await assistantAPI.clearHistory();
            setMessages([]);
            addMessage('Chat history cleared.', 'ai');
        } catch (error) {
            console.error('Error clearing history:', error);
        }
    };

    // Continuous listening logic
    const startListening = useCallback(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            toast.error("Browser doesn't support speech recognition.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = true; // Keep listening
        recognition.interimResults = true;

        recognition.onstart = () => setIsListening(true);

        recognition.onresult = (event: any) => {
            // Handle interim results if needed, or just final
            // For simplicity in this context, we might want to just let users type or 
            // accumulate text. But typically continuous listening implies 
            // dictation.
            // Let's assume we want to fill the input in the UI, but the UI is separate.
            // Actually, better pattern for global chat:
            // We can't easily "fill input" in a child component from here without more state.
            // So for now, we'll keep the basic listening state here 
            // but the actual transcript handling might need to be in the UI 
            // OR we broadcast the transcript.

            // However, user asked: "make the audio stay till i stop it".
            // This implies the *recording* doesn't auto-stop on silence.
        };

        recognition.onerror = (event: any) => {
            console.error('Speech error:', event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            // If we want it to "stay till I stop it", we restart it here
            // unless explicitly stopped by user (we need a flag for that).
            if (isListening) {
                try {
                    recognition.start();
                } catch (e) {
                    // ignore
                }
            } else {
                setIsListening(false);
            }
        };

        recognitionRef.current = recognition;
        recognition.start();
        setIsListening(true);
    }, [isListening]);

    const stopListening = useCallback(() => {
        setIsListening(false);
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    }, []);


    return (
        <ChatContext.Provider
            value={{
                messages,
                isLoading,
                isOpen,
                setIsOpen,
                sendMessage,
                addMessage,
                clearChat,
                isListening,
                startListening,
                stopListening
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};
