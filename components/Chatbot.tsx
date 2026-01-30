import React, { useState, useEffect, useRef } from 'react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';
import { useApp } from '../context/AppContext';

export const Chatbot: React.FC = () => {
  const { profile } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Set initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'model',
          text: `Hola ${profile.name.split(' ')[0]}. Soy Umbral AI. ¿En qué puedo ayudarte a optimizar tus finanzas hoy?`,
          timestamp: new Date()
        }
      ]);
    }
  }, [profile.name]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(userMsg.text, profile.name);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-24 right-6 z-50 bg-primary text-text-main p-4 rounded-full shadow-lg border border-primary-dark/20 hover:scale-110 transition-transform group"
        title="Ask Umbral AI"
      >
        <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">voice_chat</span>
        {/* Notification dot if needed */}
        {/* <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-primary"></span> */}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-44 right-6 z-40 w-96 max-w-[calc(100vw-3rem)] h-[500px] bg-white dark:bg-card-dark rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col animate-fade-in overflow-hidden">
          {/* Header */}
          <div className="bg-primary/10 dark:bg-primary/5 p-4 border-b border-primary/10 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-lg">smart_toy</span>
              </div>
              <div>
                <h3 className="font-bold text-text-main dark:text-white text-sm">Umbral AI</h3>
                <p className="text-[10px] text-text-muted dark:text-gray-400 uppercase tracking-wider">Gemini 3 Pro</p>
              </div>
            </div>
            <button onClick={toggleChat} className="text-text-muted hover:text-text-main">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-slate-50/50 dark:bg-background-dark/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                    ? 'self-end bg-primary text-text-main rounded-tr-sm'
                    : 'self-start bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-sm shadow-sm'
                  }`}
              >
                {msg.role === 'model' ? (
                  <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }} />
                ) : (
                  msg.text
                )}
              </div>
            ))}
            {isLoading && (
              <div className="self-start bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 p-3 rounded-2xl rounded-tl-sm shadow-sm">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-surface-dark border-t border-slate-200 dark:border-slate-700 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about your budget..."
              className="flex-1 bg-slate-100 dark:bg-background-dark border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 dark:text-white"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="w-10 h-10 rounded-full bg-primary text-text-main flex items-center justify-center hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-symbols-outlined text-xl">send</span>
            </button>
          </form>
        </div>
      )}
    </>
  );
};