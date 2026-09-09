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
  Ticket,
  CalendarCheck,
  TrendingUp,
  Volume2,
  VolumeX,
  Key,
  Check,
  ExternalLink
} from 'lucide-react';

export const GeminiAssistant: React.FC = () => {
  const {
    isAssistantOpen,
    setIsAssistantOpen,
    chatMessages,
    isAiThinking,
    sendChatMessage,
    bookSlot,
    currentUser,
    geminiApiKey,
    setGeminiApiKey
  } = useAgriStore();

  const { language, t } = useLanguage();

  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingEnabled, setIsSpeakingEnabled] = useState(true);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyInput, setKeyInput] = useState(geminiApiKey || '');
  const lastSpokenMessageIdRef = useRef<string | null>(null);

  // Text-to-Speech function for voice output
  const speakText = (text: string) => {
    if (!isSpeakingEnabled) return;
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Stop any ongoing speech

    // Remove any special formatting or markdown characters for cleaner audio
    const cleanText = text.replace(/[*_#`]/g, '').trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Map selected UI language to best standard BCP-47 locale
    const voiceLangMap: Record<string, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      te: 'te-IN',
      ta: 'ta-IN',
      mr: 'mr-IN',
      pa: 'pa-IN'
    };

    utterance.lang = voiceLangMap[language] || 'en-IN';
    utterance.rate = 0.95; // Clear and accessible pace for farmers
    utterance.pitch = 1.0;

    // Check if matching voice is available in browser
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
    sendChatMessage(input);
    setInput('');
  };

  const handleVoiceToggle = () => {
    if (!isListening) {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        try {
          const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
          const recognition = new SpeechRec();

          const recLangMap: Record<string, string> = {
            en: 'en-IN',
            hi: 'hi-IN',
            te: 'te-IN',
            ta: 'ta-IN',
            mr: 'mr-IN',
            pa: 'pa-IN'
          };

          recognition.lang = recLangMap[language] || 'en-IN';
          recognition.interimResults = false;
          recognition.maxAlternatives = 1;

          setIsListening(true);

          recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
            sendChatMessage(transcript);
            setIsListening(false);
          };

          recognition.onerror = () => {
            setIsListening(false);
          };

          recognition.onend = () => {
            setIsListening(false);
          };

          recognition.start();
          return;
        } catch (_) {}
      }

      // Fallback simulation if browser speech recognition is denied/unavailable
      setIsListening(true);
      setTimeout(() => {
        const demoQueries: Record<string, string> = {
          en: 'Compare Paddy MSP vs market price',
          hi: 'धान का एमएसपी और बाज़ार भाव बताएं',
          te: 'వరి మద్దతు ధర మరియు మార్కెట్ ధర పోల్చండి',
          ta: 'நெல் அரசு விலை மற்றும் சந்தை விலை விவரம்',
          mr: 'तांदूळ हमीभाव आणि बाजार भाव सांगा',
          pa: 'ਝੋਨੇ ਦਾ ਐਮਐਸਪੀ ਅਤੇ ਮੰਡੀ ਭਾਅ ਦੱਸੋ'
        };
        const selectedQuery = demoQueries[language] || demoQueries.en;
        setInput(selectedQuery);
        sendChatMessage(selectedQuery);
        setIsListening(false);
      }, 2000);
    } else {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsListening(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isAssistantOpen && (
        <button
          onClick={() => setIsAssistantOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-[#0D7377] hover:bg-[#095457] text-[#14FFEC] p-3.5 rounded-full shadow-2xl flex items-center gap-2.5 glow-btn transition-all group"
          title={t('ai_assistant_title')}
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-[#14FFEC]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#14FFEC] rounded-full pulse-beacon" />
          </div>
          <span className="text-xs font-bold text-white pr-1 group-hover:inline-block">
            {t('gemini_ai_button')}
          </span>
        </button>
      )}

      {/* Expanded Chat Drawer / Widget */}
      {isAssistantOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[540px] bg-white rounded-2xl border border-gray-200 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-[#0D7377] to-[#095457] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#14FFEC]/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-[#14FFEC]" />
              </div>
              <div>
                <h3 className="font-bold text-sm flex items-center gap-1.5">
                  <span>{t('ai_assistant_title')}</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#14FFEC]" />
                </h3>
                <p className="text-[10px] text-teal-200">
                  {t('ai_assistant_sub')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Gemini API Key Settings Toggle */}
              <button
                onClick={() => {
                  setShowKeyModal(!showKeyModal);
                  setKeyInput(geminiApiKey || '');
                }}
                className={`p-1.5 rounded-lg transition-colors relative ${
                  geminiApiKey ? 'text-[#14FFEC] bg-white/10' : 'text-amber-300 hover:text-white'
                }`}
                title={geminiApiKey ? 'Live Gemini API Connected' : 'Configure Google Gemini API Key'}
              >
                <Key className="w-4 h-4" />
                {geminiApiKey && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#14FFEC] rounded-full" />
                )}
              </button>

              {/* Audio Voice-Out Toggle */}
              <button
                onClick={() => {
                  if (isSpeakingEnabled && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                  }
                  setIsSpeakingEnabled(!isSpeakingEnabled);
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  isSpeakingEnabled ? 'text-[#14FFEC] bg-white/10' : 'text-white/60 hover:text-white'
                }`}
                title={isSpeakingEnabled ? t('voice_out_enabled') : t('voice_out_disabled')}
              >
                {isSpeakingEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={() => {
                  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                  setIsAssistantOpen(false);
                }}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Gemini API Key Configuration Drawer */}
          {showKeyModal && (
            <div className="p-3 bg-slate-900 text-white text-xs border-b border-slate-800 space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1 text-[#14FFEC]">
                  <Sparkles className="w-3.5 h-3.5" /> Google Gemini API Key
                </span>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-teal-300 hover:underline flex items-center gap-0.5"
                >
                  Get free key <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <p className="text-[11px] text-gray-300 leading-snug">
                Enter your free Gemini key to ask any farming, soil, pest, or crop question live.
              </p>
              <div className="flex gap-1.5">
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 bg-slate-800 rounded-lg text-white font-mono text-xs border border-slate-700 outline-none focus:border-[#14FFEC]"
                />
                <button
                  onClick={() => {
                    setGeminiApiKey(keyInput.trim() || null);
                    setShowKeyModal(false);
                  }}
                  className="px-3 py-1.5 bg-[#0D7377] hover:bg-[#095457] text-[#14FFEC] font-bold rounded-lg flex items-center gap-1 text-xs"
                >
                  <Check className="w-3.5 h-3.5" /> Save
                </button>
              </div>
            </div>
          )}

          {/* Messages Feed */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#FAFAFA]">
            {/* Farmer Identification Banner */}
            <div className="p-2.5 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 rounded-xl text-[11px] flex items-center justify-between text-[#0D7377]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Assisting: <strong>{currentUser.name}</strong></span>
              </div>
              <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-teal-200 font-semibold">
                {currentUser.aadhaarVerified ? 'Aadhaar eKYC ✓' : 'Kisan'}
              </span>
            </div>

            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#0D7377] text-white rounded-tr-xs shadow-xs'
                      : 'bg-white text-[#212121] border border-gray-200 rounded-tl-xs shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="flex-1">{msg.text}</p>
                    {msg.sender === 'gemini' && (
                      <button
                        onClick={() => speakText(msg.text)}
                        className="text-gray-400 hover:text-[#0D7377] p-0.5 rounded transition-colors"
                        title="Replay Voice Audio"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Rich Inline Card: Slot Suggestion */}
                  {msg.richCardType === 'slot' && msg.richData && (
                    <div className="mt-2.5 p-2.5 bg-teal-50 border border-teal-200 rounded-xl text-[11px] space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[#0D7377] font-bold">
                        <CalendarCheck className="w-4 h-4" />
                        <span>Recommended Slot</span>
                      </div>
                      <div className="text-gray-700">
                        <p><strong>Centre:</strong> {msg.richData.centreName}</p>
                        <p><strong>Window:</strong> {msg.richData.time}</p>
                        <p><strong>Est. Wait:</strong> <span className="text-emerald-700 font-bold">{msg.richData.waitEst}</span> (Bay #1)</p>
                      </div>
                      <button
                        onClick={() => bookSlot('slot-6', 'Paddy')}
                        className="w-full py-1.5 bg-[#0D7377] text-white rounded-lg font-bold text-[11px] hover:bg-[#095457] transition-all flex items-center justify-center gap-1 shadow-xs"
                      >
                        Confirm Tomorrow 07:00 AM Slot
                      </button>
                    </div>
                  )}

                  {/* Rich Inline Card: Grievance Ticket */}
                  {msg.richCardType === 'ticket' && msg.richData && (
                    <div className="mt-2.5 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] space-y-1.5">
                      <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                        <Ticket className="w-4 h-4 text-amber-700" />
                        <span>Mandi Escalation Ticket Created</span>
                      </div>
                      <div className="text-gray-700">
                        <p><strong>Ticket ID:</strong> <span className="font-mono font-bold text-amber-900">{msg.richData.ticketId}</span></p>
                        <p><strong>Category:</strong> {msg.richData.category}</p>
                        <p><strong>Assigned:</strong> {msg.richData.status}</p>
                        <p><strong>Resolution SLA:</strong> <span className="text-emerald-700 font-bold">{msg.richData.eta}</span></p>
                      </div>
                      <div className="text-[10px] text-amber-800 bg-amber-100/70 p-1.5 rounded font-medium">
                        SMS acknowledgment dispatched to +91 98480 23456.
                      </div>
                    </div>
                  )}
                </div>

                <span className="text-[9px] text-gray-400 mt-1 px-1">{msg.timestamp}</span>

                {/* Suggestions Pills */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5 max-w-[90%]">
                    {msg.suggestions.map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => sendChatMessage(sug)}
                        className="text-[10px] bg-white border border-[#0D7377]/30 hover:border-[#0D7377] text-[#0D7377] px-2 py-0.5 rounded-full transition-colors font-medium shadow-2xs"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isAiThinking && (
              <div className="flex items-center gap-2 p-2.5 bg-white border border-gray-200 rounded-xl w-fit text-xs text-gray-500 shadow-xs">
                <div className="w-3.5 h-3.5 border-2 border-[#0D7377] border-t-transparent rounded-full animate-spin" />
                <span>Gemini is analyzing mandi data...</span>
              </div>
            )}
          </div>

          {/* Voice Waveform Simulation Bar */}
          {isListening && (
            <div className="bg-[#14FFEC]/20 border-t border-[#14FFEC]/40 px-3 py-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="text-[11px] font-bold text-[#0D7377]">{t('ai_listening')}</span>
              </div>
              <div className="flex items-center gap-1 h-4">
                {[12, 24, 16, 28, 20, 14, 26, 10].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 bg-[#0D7377] rounded-full animate-pulse"
                    style={{ height: `${h}px`, animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="p-2.5 bg-white border-t border-gray-200 flex items-center gap-2">
            <button
              type="button"
              onClick={handleVoiceToggle}
              className={`p-2 rounded-xl transition-all ${
                isListening
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                  : 'bg-gray-100 hover:bg-gray-200 text-[#0D7377]'
              }`}
              title="Voice Input (Speech-to-Text)"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('ask_gemini_placeholder')}
              className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#0D7377] focus:bg-white text-[#212121]"
            />

            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2 rounded-xl bg-[#0D7377] text-[#14FFEC] disabled:opacity-40 hover:bg-[#095457] transition-all shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
