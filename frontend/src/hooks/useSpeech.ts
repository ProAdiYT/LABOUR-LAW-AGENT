"use client";

import { useState, useEffect, useRef } from "react";

export function useSpeech(onTranscript: (text: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        setIsSupported(true);
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;

        rec.onstart = () => {
          setIsListening(true);
          setError(null);
        };

        rec.onresult = (event: any) => {
          const resultText = event.results[0][0].transcript;
          onTranscript(resultText);
        };

        rec.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setError(event.error);
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, [onTranscript]);

  const startListening = (lang = "en-IN") => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = lang;
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Error starting speech recognition:", e);
      }
    } else {
      setError("Speech recognition not supported in this browser.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return {
    isListening,
    startListening,
    stopListening,
    error,
    isSupported,
  };
}
