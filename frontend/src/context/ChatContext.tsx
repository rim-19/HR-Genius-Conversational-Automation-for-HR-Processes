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

    // Update a single AI message (by id) as streamed tokens arrive.
    const upsertAiMessage = (id: string, text: string) => {
        setMessages((prev) => {
            const exists = prev.some((m) => m.id === id);
            if (exists) {
                return prev.map((m) => (m.id === id ? { ...m, text } : m));
            }
            return [...prev, { id, text, sender: 'ai', timestamp: new Date() }];
        });
    };

    const sendMessage = async (text: string) => {
        addMessage(text, 'user');
        setIsLoading(true);

        const apiBase = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';
        const token = localStorage.getItem('hr_genius_token');
        const aiId = `ai-${Date.now()}`;

        try {
            const resp = await fetch(`${apiBase}/ai/message/stream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ message: text }),
            });

            if (!resp.ok || !resp.body) {
                throw new Error(`stream request failed (${resp.status})`);
            }

            const reader = resp.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let aiText = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });

                // SSE frames are separated by a blank line.
                const frames = buffer.split('\n\n');
                buffer = frames.pop() || '';

                for (const frame of frames) {
                    const lines = frame.split('\n');
                    const eventType = (lines.find((l) => l.startsWith('event:')) || '').slice(6).trim();
                    const dataLine = (lines.find((l) => l.startsWith('data:')) || '').slice(5).trim();
                    if (!dataLine) continue;

                    let payload: any;
                    try { payload = JSON.parse(dataLine); } catch { continue; }

                    if (eventType === 'token') {
                        aiText += payload.token || '';
                        upsertAiMessage(aiId, aiText);
                    } else if (eventType === 'done') {
                        aiText = payload.message ?? aiText;
                        upsertAiMessage(aiId, aiText);
                    } else if (eventType === 'error') {
                        upsertAiMessage(aiId, `⚠️ ${payload.message || 'Something went wrong.'}`);
                    }
                }
            }
        } catch (error: any) {
            // Fallback to the buffered (non-streaming) endpoint.
            console.error('Streaming failed, falling back:', error);
            try {
                const response = await assistantAPI.sendMessage(text);
                upsertAiMessage(aiId, response.data.message);
            } catch (err: any) {
                const errorMessage = err.response?.data?.message || 'Sorry, I encountered an error processing your request.';
                upsertAiMessage(aiId, `⚠️ Error: ${errorMessage}`);
            }
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
