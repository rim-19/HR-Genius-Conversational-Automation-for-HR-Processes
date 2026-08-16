import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiMic, FiVolume2, FiVolumeX } from "react-icons/fi";
import { toast } from "react-toastify";

/**
 * Interface définissant la structure d'un message dans le chat
 *
 * @property id - Identifiant unique du message
 * @property text - Contenu textuel du message
 * @property sender - Expéditeur du message: 'user' (utilisateur) ou 'ai' (assistant IA)
 * @property timestamp - Date et heure d'envoi du message
 */
interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

/**
 * Propriétés du composant ChatbotUI
 *
 * @property messages - Tableau des messages à afficher dans le chat
 * @property onSendMessage - Fonction callback appelée quand l'utilisateur envoie un message
 * @property isLoading - Indique si l'IA est en train de traiter/répondre (affiche l'indicateur de frappe)
 */
interface ChatbotUIProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

/**
 * Composant ChatbotUI - Interface utilisateur pour le chat avec l'IA
 *
 * Ce composant affiche une interface de chat complète avec:
 * - Zone d'affichage des messages avec scroll automatique
 * - Animation des messages à l'entrée/sortie
 * - Indicateur de frappe quand l'IA répond
 * - Zone de saisie avec bouton d'envoi
 * - Bouton pour l'entrée vocale (à implémenter)
 *
 * Les messages utilisateur s'affichent à droite, les messages IA à gauche.
 */
const ChatbotUI: React.FC<ChatbotUIProps> = ({
  messages,
  onSendMessage,
  isLoading = false,
}) => {
  // État pour stocker le texte saisi dans le champ de saisie
  const [input, setInput] = useState("");
  const [isVolumeOn, setIsVolumeOn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /**
   * Effet qui fait défiler vers le bas chaque fois qu'un nouveau message est ajouté
   */
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Text-to-Speech Effect
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender === "ai" && isVolumeOn) {
      // Small pause to allow UI update
      setTimeout(() => {
        const speech = new SpeechSynthesisUtterance(lastMessage.text);
        speech.lang = 'en-US';
        speech.rate = 1.0;
        speech.pitch = 1.0;
        window.speechSynthesis.speak(speech);
      }, 100);
    }

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [messages, isVolumeOn]);

  const toggleVolume = () => {
    if (isVolumeOn) {
      window.speechSynthesis.cancel();
    }
    setIsVolumeOn(!isVolumeOn);
    toast.info(`Voice response: ${!isVolumeOn ? "ON" : "OFF"}`);
  };

  /**
   * Gestionnaire de soumission du formulaire de saisie
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  /**
   * Logic for Voice Recognition (STT)
   */
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Your browser does not support voice input. Please use Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; // Set language
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      toast.info("Listening...");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev + (prev ? " " : "") + transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      toast.error(`Voice error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`chat-bubble ${message.sender === "user"
                  ? "chat-bubble-user"
                  : "chat-bubble-ai"
                  }`}
              >
                <p className="whitespace-pre-wrap">{message.text}</p>
                <span className="mt-1 block text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="chat-bubble chat-bubble-ai">
              <div className="animate-typing flex space-x-1">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "Listening..." : "Type your message..."}
            disabled={isLoading}
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 dark:disabled:bg-gray-800"
          />
          <button
            type="button"
            onClick={toggleVolume}
            className={`rounded-lg border p-2 transition-colors ${isVolumeOn
              ? "border-primary-500 bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300"
              : "border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
              }`}
            title="Toggle Voice Response"
          >
            {isVolumeOn ? <FiVolume2 className="h-5 w-5" /> : <FiVolumeX className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={startListening}
            className={`rounded-lg border p-2 transition-colors ${isListening
              ? "border-red-500 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 animate-pulse"
              : "border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
              }`}
            title="Voice input"
            disabled={isLoading}
          >
            <FiMic className="h-5 w-5" />
          </button>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="btn btn-primary rounded-lg px-4 py-2"
          >
            <FiSend className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatbotUI;
