import { useState } from 'react';
import { askSevaSyncAi } from '../utils/aiAssistant';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';
import { Sparkles, Send, Copy, Check, ShieldCheck, RefreshCw, HelpCircle, ExternalLink } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  source?: 'gemini' | 'verified_knowledge';
}

const QUICK_QUESTIONS = [
  'How to download 10th/12th marksheet from DigiLocker?',
  'How can I update my Aadhaar address online?',
  'How to check EPF passbook balance on mobile?',
  'How do I book a Tatkaal passport appointment?',
  'Can I take the Learner Driving License test from home?',
  'Who is eligible for Ayushman Bharat ₹5 Lakh health card?',
  'What should I do immediately after UPI cyber fraud (1930)?',
  'How to complete PM-KISAN mandatory e-KYC with face?'
];

export default function AiAssistant() {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Namaste! 🙏 I am **SevaSync AI**, your digital guide for Indian Government public services.\n\nAsk me about any scheme, portal, application procedure, required documents, or official helpline (DigiLocker, UMANG, Aadhaar, Passport, Driving License, EPFO, PM-KISAN, Ayushman Bharat, etc.).`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'verified_knowledge'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const response = await askSevaSyncAi(textToSend, language);
      const aiMsg: Message = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: response.source
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      const fallbackMsg: Message = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: "We encountered a temporary network delay. Please consult the verified government directory below or dial the National UMANG Helpline at 1800-11-5246.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'verified_knowledge'
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderFormattedContent = (content: string) => {
    return content.split('\n').map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="text-base font-bold text-orange-600 dark:text-orange-400 mt-2 mb-1">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={idx} className="font-semibold text-slate-900 dark:text-slate-100 my-1">{line.replace(/\*\*/g, '')}</p>;
      }
      if (line.startsWith('• ') || line.startsWith('- ')) {
        return <li key={idx} className="ml-4 list-disc text-sm text-slate-700 dark:text-slate-300">{line.substring(2)}</li>;
      }
      if (/^\d+\.\s/.test(line)) {
        return <li key={idx} className="ml-4 list-decimal text-sm text-slate-700 dark:text-slate-300 my-0.5">{line.replace(/^\d+\.\s/, '')}</li>;
      }
      if (line.includes('http://') || line.includes('https://')) {
        const urlMatch = line.match(/(https?:\/\/[^\s)]+)/);
        if (urlMatch) {
          const url = urlMatch[0];
          return (
            <p key={idx} className="my-1.5 flex items-center gap-1.5 text-sm">
              <span className="text-slate-700 dark:text-slate-300">{line.replace(url, '')}</span>
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded text-xs"
              >
                {url} <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          );
        }
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }
      return <p key={idx} className="text-sm text-slate-700 dark:text-slate-300 my-1 leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-600 to-emerald-600 p-4 sm:p-5 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg sm:text-xl text-white">{t('aiAssistant')}</h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-white/25 rounded-full text-white">
                Live & Verified
              </span>
            </div>
            <p className="text-xs sm:text-sm text-white/90 line-clamp-1">
              {t('aiAssistantDesc')}
            </p>
          </div>
        </div>
        <button
          onClick={() => setMessages(messages.slice(0, 1))}
          className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-xs flex items-center gap-1"
          title="Reset conversation"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
          <HelpCircle className="w-3.5 h-3.5 text-orange-500" />
          <span>{t('popularQuestions')}:</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          {QUICK_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              disabled={loading}
              className="shrink-0 px-3 py-1.5 bg-white dark:bg-slate-850 hover:bg-orange-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-300 rounded-full transition-all hover:border-orange-300 dark:hover:border-orange-500/50 hover:text-orange-600 dark:hover:text-orange-400"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Messages area */}
      <div className="p-4 sm:p-6 space-y-4 max-h-[460px] overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[90%] sm:max-w-[85%] rounded-2xl p-4 sm:p-5 relative ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-sm'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/60 dark:border-slate-750/60 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>SevaSync Official Guidance</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(msg.content, msg.id)}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded transition-colors flex items-center gap-1"
                    title="Copy response"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span className="text-[10px] text-emerald-500">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span className="text-[10px]">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              <div className="prose prose-sm dark:prose-invert max-w-none">
                {msg.role === 'user' ? (
                  <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                ) : (
                  renderFormattedContent(msg.content)
                )}
              </div>

              <div
                className={`text-[10px] mt-2 text-right ${
                  msg.role === 'user' ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start">
            <div className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 animate-pulse">
                {t('searching')}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex gap-2 items-center"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('askPlaceholder')}
          disabled={loading}
          className="flex-1 px-4 py-2.5 sm:py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 transition-all shadow-inner"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-sm"
        >
          <span className="hidden sm:inline">{t('askBtn')}</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
