import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ReportLanguage } from '../types';
import { translations } from '../translations';
import { generateAssistantResponse } from '../services/geminiService';
import Markdown from 'react-markdown';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface AIAssistantProps {
  language: ReportLanguage;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const t = translations[language];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await generateAssistantResponse(userMessage, messages, language);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      console.error('Assistant Error:', error);
      setMessages(prev => [...prev, { role: 'model', text: t.chatError }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    if (!isOpen) {
      setIsOpen(true);
      setIsMinimized(false);
      if (messages.length === 0) {
        setMessages([{ role: 'model', text: t.chatWelcome }]);
      }
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? '60px' : '500px'
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-cosmic-800/95 backdrop-blur-2xl border border-cosmic-gold/30 rounded-2xl shadow-2xl w-[350px] overflow-hidden flex flex-col mb-4"
          >
            {/* Header */}
            <div className="p-4 border-b border-cosmic-gold/20 flex items-center justify-between bg-cosmic-900/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-cosmic-gold/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cosmic-gold" />
                </div>
                <span className="text-white font-cinzel text-sm tracking-widest">{t.chatTitle}</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-cosmic-silver hover:text-white transition-colors p-1"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-cosmic-silver hover:text-white transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-cosmic-gold/20">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                          msg.role === 'user'
                            ? 'bg-cosmic-gold text-cosmic-900 rounded-tr-none'
                            : 'bg-cosmic-900/50 text-cosmic-silver border border-cosmic-gold/10 rounded-tl-none'
                        }`}
                      >
                        <div className="markdown-body prose prose-invert prose-sm max-w-none">
                          <Markdown>{msg.text}</Markdown>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-cosmic-900/50 p-3 rounded-2xl rounded-tl-none border border-cosmic-gold/10">
                        <Loader2 className="w-4 h-4 text-cosmic-gold animate-spin" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-4 border-t border-cosmic-gold/20 bg-cosmic-900/30">
                  <div className="relative">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={t.chatPlaceholder}
                      className="w-full bg-cosmic-900/50 border border-cosmic-gold/20 rounded-xl py-3 pl-4 pr-12 text-white text-sm focus:border-cosmic-gold outline-none transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-cosmic-gold hover:text-white disabled:opacity-50 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChat}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
          isOpen ? 'bg-cosmic-900 border border-cosmic-gold/50' : 'bg-cosmic-gold text-cosmic-900'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </div>
  );
};

export default AIAssistant;
