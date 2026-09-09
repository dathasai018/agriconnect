import React, { useState, useEffect, useRef } from 'react';
import { useAgriStore } from '../../context/AgriStoreContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Bot,
  X,
  Send,
  Mic,
  MicOff,
  Sparkles,
  Volume2,
  VolumeX,
  Settings,
  Check,
  ChevronRight
} from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  '🌱 Which crop is suitable this season?',
  '🌧 Will it rain today?',
  '💰 What is today\'s market price?',
  '🐛 How can I identify crop problems?',
  '🏪 Find my nearest mandi'
];

export const GeminiAssistant: React.FC = () => {
  const {
    isAssistantOpen,
    setIsAssistantOpen,
    chatMessages,
    isAiThinking,
    sendChatMessage,
    currentUser,
    geminiApiKey,
    setGeminiApiKey
  } = useAgriStore();

  const { language, t } = useLanguage();

  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingEnabled, setIsSpeakingEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const lastSpokenMessageIdRef = useRef<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAssistantOpen) {
      scrollToBottom();
    }
  }, [chatMessages, isAssistantOpen]);

  // Text-to-Speech function for voice output
  const speakText = (text: string) => {
    if (!isSpeakingEnabled) return;
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`]/g, '').trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voiceLangMap: Record<string, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      te: 'te-IN',
      ta: 'ta-IN',
      mr: 'mr-IN',
      pa: 'pa-IN'
    };

    utterance.lang = voiceLangMap[language] || 'en-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(
      (v) => v.lang.startsWith(utterance.lang) || v.lang.replace('_', '-').startsWith(utterance.lang)
    );
    if (matchingVoice) utterance.voice = matchingVoice;

    window.speechSynthesis.speak(utterance);
  };

  // Automatically voice out new Gemini AI responses
  useEffect(() => {
    if (chatMessages.length === 0) return;
    const lastMsg = chatMessages[chatMessages.length - 1];

    if (
      lastMsg.sender === 'gemini' &&
      lastMsg.id !== lastSpokenMessageIdRef.current &&
      isSpeakingEnabled
    ) {
      lastSpokenMessageIdRef.current = lastMsg.id;
      speakText(lastMsg.text);
    }
  }, [chatMessages, isSpeakingEnabled, language]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendChatMessage(input.trim());
    setInput('');
  };

  const handleSuggestedClick = (q: string) => {
    // Strip leading emoji
    const cleanQ = q.replace(/^[\p{Emoji}\s]+/u, '').trim();
    sendChatMessage(cleanQ);
  };

  const handleVoiceToggle = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      const langMap: Record<string, string> = {
        en: 'en-IN',
        hi: 'hi-IN',
        te: 'te-IN',
        ta: 'ta-IN',
        mr: 'mr-IN',
        pa: 'pa-IN'
      };
      recognition.lang = langMap[language] || 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          sendChatMessage(transcript);
        }
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (_) {
      setIsListening(false);
    }
  };

  return (
    <>
      {/* Floating Assistant Launcher Button (Mobile & Desktop) */}
      {!isAssistantOpen && (
        <button
          onClick={() => setIsAssistantOpen(true)}
          className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 px-4 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full shadow-lg flex items-center gap-2.5 transition-all touch-target font-bold text-sm border-2 border-white"
          aria-label="Open AI Farmer Assistant"
        >
          <span className="text-lg">🤖</span>
          <span>AI Farmer Assistant</span>
        </button>
      )}

      {/* Expanded Friendly AI Assistant Drawer */}
      {isAssistantOpen && (
        <div className="fixed inset-x-0 bottom-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 w-full sm:w-[420px] h-[85vh] sm:h-[580px] bg-white rounded-t-3xl sm:rounded-3xl border border-gray-200 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="p-4 bg-emerald-800 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-white/15 flex items-center justify-center text-xl">
                🤖
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base leading-tight">
                  AI Farmer Assistant
                </h3>
                <p className="text-[11px] text-emerald-200 font-medium">
                  Ask anything about farming
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Voice Readout Toggle */}
              <button
                onClick={() => {
                  if (isSpeakingEnabled && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                  }
                  setIsSpeakingEnabled(!isSpeakingEnabled);
                }}
                className={`p-2 rounded-xl transition-colors ${
                  isSpeakingEnabled ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'
                }`}
                title={isSpeakingEnabled ? 'Voice Readout Active' : 'Voice Readout Off'}
              >
                {isSpeakingEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Discreet Settings Toggle */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-xl transition-colors ${
                  showSettings ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'
                }`}
                title="API Settings"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Close Button */}
              <button
                onClick={() => {
                  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                  setIsAssistantOpen(false);
                }}
                className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Discreet Settings Drawer (No Raw API Key Display) */}
          {showSettings && (
            <div className="p-3 bg-gray-900 text-white text-xs border-b border-gray-800 space-y-2">
              <p className="text-[11px] text-gray-300">
                Custom Gemini API Configuration (Optional)
              </p>
              <div className="flex gap-1.5">
                <input
                  type="password"
                  placeholder="Enter API key..."
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 bg-gray-800 rounded-lg text-white text-xs border border-gray-700 outline-none focus:border-emerald-500"
                />
                <button
                  onClick={() => {
                    if (keyInput.trim()) {
                      setGeminiApiKey(keyInput.trim());
                    }
                    setShowSettings(false);
                  }}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Messages & Suggestions Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F8FAF8]">
            {/* Greeting / Suggested Questions when chat is empty or starting */}
            {chatMessages.length <= 1 && (
              <div className="space-y-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-white border border-gray-200 shadow-2xs space-y-2">
                  <p className="font-bold text-gray-900 text-xs sm:text-sm">
                    Namaste! How can I help you with your farming today?
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Tap any question below or type your own question:
                  </p>
                </div>

                <div className="space-y-2">
                  {SUGGESTED_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestedClick(q)}
                      className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 text-xs font-semibold text-gray-800 transition-all flex items-center justify-between group shadow-2xs"
                    >
                      <span>{q}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-700 transition-colors shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Render Chat Messages */}
            {chatMessages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-emerald-700 text-white rounded-br-xs'
                        : 'bg-white text-gray-900 border border-gray-200 shadow-2xs rounded-bl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isAiThinking && (
              <div className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-2xl w-fit text-xs text-emerald-800 shadow-2xs">
                <div className="w-3.5 h-3.5 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin" />
                <span className="font-semibold">AI Assistant is thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
            <button
              type="button"
              onClick={handleVoiceToggle}
              className={`p-2.5 rounded-2xl transition-all touch-target ${
                isListening
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title="Voice Input (Speech-to-Text)"
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your farming question..."
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-emerald-600 focus:bg-white text-gray-900 transition-colors"
            />

            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white disabled:opacity-40 transition-all touch-target"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
