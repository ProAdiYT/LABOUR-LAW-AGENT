"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSpeech } from "@/hooks/useSpeech";
import { api, ChatMessage } from "@/lib/api";
import { 
  Sparkles, 
  Send, 
  Mic, 
  MicOff, 
  Trash2, 
  Loader2, 
  AlertCircle, 
  Bot, 
  User, 
  Languages 
} from "lucide-react";

export default function ChatPage() {
  const { preferredLanguage } = useAuth();
  const isHi = preferredLanguage === "hi";

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from backend on startup
  useEffect(() => {
    async function loadHistory() {
      try {
        const history = await api.getChatHistory();
        setMessages(history);
      } catch (e) {
        console.error("Failed to load chat history:", e);
      }
    }
    loadHistory();
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Speech-to-Text handler
  const { isListening, startListening, stopListening, isSupported, error: speechError } = useSpeech(
    (transcript) => {
      setInputText((prev) => prev + (prev ? " " : "") + transcript);
    }
  );

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      // Choose recognition language based on active UI language
      const recognitionLang = isHi ? "hi-IN" : "en-IN";
      startListening(recognitionLang);
    }
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;
    
    setApiError(null);
    setIsLoading(true);
    setInputText(""); // Clear input box

    // Optimistically add user message to list (temporarily, until API returns complete interaction)
    const tempUserMessage: ChatMessage = {
      id: Date.now(),
      message: textToSend,
      response: "",
      timestamp: new Date().toISOString()
    };
    
    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      const chatInteraction = await api.sendChatMessage(textToSend);
      // Replace the last temporary message with the official full DB entry
      setMessages((prev) => prev.slice(0, -1).concat(chatInteraction));
    } catch (e: any) {
      setApiError(e.message || "Failed to get AI response. Please check backend connection.");
      // Remove the failed temporary message
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = async () => {
    if (!confirm(isHi ? "क्या आप पूरे चैट इतिहास को हटाना चाहते हैं?" : "Are you sure you want to clear your chat history?")) return;
    try {
      await api.clearChatHistory();
      setMessages([]);
    } catch (e) {
      console.error("Failed to clear chat history:", e);
    }
  };

  const suggestedPrompts = [
    {
      label: "Employer hasn't paid me",
      label_hi: "मालिक ने वेतन नहीं दिया",
      text: "My employer hasn't paid my salary for 2 months. What should I do under Delhi rules?"
    },
    {
      label: "What is Delhi Min Wage?",
      label_hi: "दिल्ली में न्यूनतम मजदूरी?",
      text: "What is the official minimum wage daily rate for unskilled construction work in Delhi?"
    },
    {
      label: "Working hours & breaks",
      label_hi: "काम के घंटे और ब्रेक नियम",
      text: "What are the legal limits on working hours and overtime breaks in Delhi?"
    },
    {
      label: "Accident compensation rules",
      label_hi: "दुर्घटना मुआवजे के नियम",
      text: "I had an accident at work site. Who covers the medical bills and disability compensation?"
    }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-4xl mx-auto border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-md">
      
      {/* Chat header */}
      <div className="flex h-14 items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 shrink-0 bg-slate-50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold">{isHi ? "श्रम अधिकारी - एआई साथी" : "ShramikMitra AI Chat"}</h3>
            <p className="text-[10px] text-slate-400">Gemini Powered Assistant</p>
          </div>
        </div>
        
        {messages.length > 0 && (
          <button
            onClick={handleClearChat}
            className="rounded-lg p-2 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Messages Pane */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto space-y-6">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Bot className="h-8 w-8" />
            </div>
            
            <div className="space-y-2">
              <h4 className="font-bold text-lg">{isHi ? "मुझसे अधिकारों के बारे में पूछें" : "Ask about your Labour Rights"}</h4>
              <p className="text-xs text-slate-500 leading-normal">
                {isHi 
                  ? "नमस्ते! मैं आपका श्रम सहायक हूँ। आप टाइप कर सकते हैं या माइक्रोफ़ोन का उपयोग करके पूछ सकते हैं। कुछ प्रश्न उदाहरण नीचे दिए गए हैं।" 
                  : "Hello! Ask me anything regarding minimum wages, working hours, unpaid salaries, or work injuries. Select a suggested prompt below to start immediately."
                }
              </p>
            </div>

            {/* Quick suggested prompts grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              {suggestedPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p.text)}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-left hover:border-primary hover:bg-primary/5 transition-all text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  {isHi ? p.label_hi : p.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Bubble list */}
        {messages.map((m) => (
          <div key={m.id} className="space-y-4">
            {/* User message */}
            <div className="flex items-start justify-end gap-3">
              <div className="max-w-[75%] rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-100 shadow-sm">
                {m.message}
              </div>
              <div className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] uppercase font-bold shrink-0">
                <User className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* AI Response message */}
            {m.response && (
              <div className="flex items-start gap-3">
                <div className="h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="max-w-[75%] rounded-2xl bg-primary/5 border border-primary/10 px-4 py-3 text-xs text-slate-700 dark:text-slate-300 shadow-inner space-y-2 leading-relaxed prose prose-sm dark:prose-invert">
                  {/* Process double newlines into paragraph blocks simple renderer */}
                  {m.response.split("\n\n").map((para, pIdx) => {
                    // Check if it is a heading
                    if (para.startsWith("###")) {
                      return <h4 key={pIdx} className="font-bold text-sm text-slate-900 dark:text-slate-100 pt-1">{para.replace("###", "").trim()}</h4>;
                    }
                    if (para.startsWith("##")) {
                      return <h3 key={pIdx} className="font-bold text-md text-slate-900 dark:text-slate-100 pt-1">{para.replace("##", "").trim()}</h3>;
                    }
                    
                    // Simple check for lists
                    if (para.includes("\n-") || para.includes("\n*")) {
                      const listItems = para.split("\n").filter(li => li.trim());
                      return (
                        <ul key={pIdx} className="list-disc pl-4 space-y-1 my-1">
                          {listItems.map((li, lIdx) => (
                            <li key={lIdx}>
                              {li.replace(/^-\s*/, "").replace(/^\*\s*/, "").trim()}
                            </li>
                          ))}
                        </ul>
                      );
                    }

                    return <p key={pIdx}>{para}</p>;
                  })}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* AI Typing Loading Animation */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
              <Bot className="h-3.5 w-3.5" />
            </div>
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-4 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" />
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        {/* Error Notification */}
        {apiError && (
          <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-xs text-destructive border border-destructive/20 max-w-md mx-auto">
            <AlertCircle className="h-4.5 w-4.5 shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        {/* Speech Error Notification */}
        {speechError && (
          <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 p-3 text-xs text-amber-600 border border-amber-500/20 max-w-md mx-auto">
            <AlertCircle className="h-4.5 w-4.5 shrink-0" />
            <span>Speech recognition error: {speechError}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input panel */}
      <div className="border-t border-slate-100 dark:border-slate-850 p-4 shrink-0 bg-slate-50 dark:bg-slate-900/50">
        
        {/* Helper suggestions shown inline during typing if text is empty */}
        {inputText.length === 0 && messages.length > 0 && (
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
            {suggestedPrompts.slice(0, 3).map((p, idx) => (
              <button
                key={idx}
                onClick={() => setInputText(p.text)}
                className="shrink-0 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-1 text-[10px] font-semibold text-slate-500 hover:border-primary hover:text-primary transition-all"
              >
                {isHi ? p.label_hi : p.label}
              </button>
            ))}
          </div>
        )}

        <form 
          className="flex items-center gap-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-3 py-2 shadow-sm"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputText);
          }}
        >
          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder={isHi ? "अपना सवाल यहाँ लिखें या बोलें..." : "Type or dictate your concern here..."}
            className="flex-1 bg-transparent px-2 py-1.5 text-xs font-semibold focus:outline-none disabled:opacity-50 text-slate-800 dark:text-slate-100"
          />

          {/* Microphone button (Speech API) */}
          {isSupported && (
            <button
              type="button"
              disabled={isLoading}
              onClick={handleVoiceToggle}
              className={`rounded-xl p-2.5 transition-colors shrink-0 ${
                isListening 
                  ? "bg-rose-500 text-white animate-pulse" 
                  : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
              title={isListening ? "Listening... click to stop" : "Speak (Hindi/English)"}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
          )}

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="rounded-xl bg-primary text-white p-2.5 hover:bg-primary-hover shadow-md shadow-primary/10 transition-colors disabled:opacity-30 disabled:shadow-none shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
