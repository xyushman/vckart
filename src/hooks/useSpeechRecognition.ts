'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export const useSpeechRecognition = (onCommand: (text: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported, setSupported] = useState(true);
  const [recognition, setRecognition] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const onCommandRef = useRef(onCommand);

  useEffect(() => {
    onCommandRef.current = onCommand;
  }, [onCommand]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US';

    recognitionInstance.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const finalTranscript = event.results[i][0].transcript;
          setTranscript(finalTranscript);
          onCommandRef.current(finalTranscript);
        } else {
          currentTranscript += event.results[i][0].transcript;
          setTranscript(currentTranscript);
        }
      }
    };

    recognitionInstance.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      if (event.error === 'network') {
        setError('Browser speech API network error. Please use standard Google Chrome or Edge.');
      } else {
        setError(`Speech error: ${event.error}`);
      }
      setIsListening(false);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    setRecognition(recognitionInstance);
  }, []);

  const startListening = useCallback(() => {
    if (recognition) {
      try {
        setTranscript('');
        setError('');
        recognition.start();
        setIsListening(true);
      } catch (e) {
        console.error("Recognition already started");
      }
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition]);

  return { isListening, transcript, startListening, stopListening, supported, error };
};
