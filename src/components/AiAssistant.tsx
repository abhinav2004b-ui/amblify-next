"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, X, Bot } from 'lucide-react';
import { generateResponse } from '../actions/chat';

export default function AiAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "System Online. How can I assist with your project today?", sender: 'ai' }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            // Sync logic with original: Filter out initial AI greeting
            const history = messages.slice(1).map(m => ({
                sender: m.sender,
                text: m.text
            }));

            const responseText = await generateResponse(history, userMessage.text);

            const aiMessage = { id: Date.now() + 1, text: responseText, sender: 'ai' };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage = { id: Date.now() + 1, text: "Critical Error: Uplink failed.", sender: 'ai' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[60]">
            <AnimatePresence mode="wait">
                {isOpen ? (
                    <motion.div
                        key="chat-window"
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="w-[90vw] md:w-[400px] h-[500px] bg-black/80 dark:bg-black/90 backdrop-blur-2xl border border-white/20 rounded-2xl flex flex-col shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-mantis-green/20 rounded-full">
                                    <Bot size={18} className="text-mantis-green" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white tracking-wider uppercase">Amplify AI</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] text-gray-400 font-mono">ONLINE</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`
                                        max-w-[80%] p-3 text-sm rounded-2xl whitespace-pre-wrap
                                        ${msg.sender === 'user'
                                            ? 'bg-white text-black font-medium rounded-tr-sm'
                                            : 'bg-white/10 text-gray-200 border border-white/10 rounded-tl-sm'
                                        }
                                    `}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="flex gap-1 p-3 bg-white/5 rounded-2xl rounded-tl-sm">
                                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-white/10 bg-white/5">
                            <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-4 py-2 focus-within:ring-1 focus-within:ring-mantis-green/50 transition-all">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask anything..."
                                    className="flex-1 bg-transparent text-white text-sm placeholder:text-gray-500 outline-none"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={isLoading || !input.trim()}
                                    className="p-2 bg-white text-black rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.button
                        key="trigger-btn"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(true)}
                        className="group flex items-center gap-3 bg-white dark:bg-white text-black px-6 py-4 rounded-full border-2 border-black shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all"
                    >
                        <span className="text-sm font-bold tracking-widest uppercase">
                            Amplify AI
                        </span>
                        <div className="relative">
                            <Sparkles size={18} strokeWidth={1} className="animate-pulse text-black" />
                            <div className="absolute inset-0 bg-black blur-lg opacity-20 -z-10" />
                        </div>
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
