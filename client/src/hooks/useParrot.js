import { useState, useCallback, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

/* simple ISO-639 list */
export const LANGS = {
  auto: 'Auto',
  en: 'English',
  es: 'Spanish',
  de: 'German',
  fr: 'French',
  hi: 'Hindi',
  ja: 'Japanese',
  ko: 'Korean',
  zh: 'Chinese',
  ru: 'Russian',
  vi: 'Vietnamese'
};

// Check if browser supports speech recognition
const checkBrowserSupport = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  return !!SpeechRecognition;
};

export default function useParrot() {
  const [status, setStatus] = useState('');
  const [result, setResult] = useState('');
  const [micError, setMicError] = useState(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Check browser support
  const supported = checkBrowserSupport() || browserSupportsSpeechRecognition;

  // Debug logging and error handling
  useEffect(() => {
    console.log('Speech Recognition Support:', {
      supported,
      browserSupportsSpeechRecognition,
      hasWebkit: !!window.webkitSpeechRecognition,
      hasSpeechRecognition: !!window.SpeechRecognition,
      listening,
      transcript
    });

    // Request microphone permission on component mount
    if (supported && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          console.log('Microphone permission granted');
        })
        .catch((err) => {
          console.warn('Microphone permission denied or error:', err);
          setMicError('Microphone access is required for speech recognition. Please allow microphone access and refresh the page.');
        });
    }
  }, [supported, browserSupportsSpeechRecognition, listening, transcript]);


  const translateAsync = useCallback(
    async (text, from, to) => {
      if (!text) return;
      setStatus('Translating…');
      try {
        const url = `/api/translate?q=${encodeURIComponent(text)}&to=${to}&from=${from}`;
        console.log('Fetching translation from:', url);
        
        const response = await fetch(url);
        console.log('Response status:', response.status, response.statusText);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}: ${response.statusText}` }));
          throw new Error(errorData.error || errorData.details || `HTTP ${response.status}`);
        }
        
        const res = await response.json();
        console.log('Translation response:', res);
        
        if (res.result) {
          setResult(res.result);
          // speak it
          const utter = new SpeechSynthesisUtterance(res.result);
          utter.lang = to;
          window.speechSynthesis.speak(utter);
          setStatus('Done');
        } else {
          throw new Error(res.error || res.details || 'No result from API');
        }
      } catch (err) {
        console.error('Translation error:', err);
        const errorMessage = err.message || 'Translation failed';
        setResult(`Error: ${errorMessage}`);
        setStatus('Error');
      }
    },
    []
  );

  const startListening = useCallback((lang) => {
    if (!supported) {
      setMicError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      setStatus('Not Supported');
      return;
    }

    setMicError(null);
    setStatus('Requesting microphone access...');
    
    try {
      const language = lang === 'auto' ? 'en-US' : lang;
      console.log('Starting speech recognition with language:', language);
      
      SpeechRecognition.startListening({
        continuous: true,
        language: language,
        interimResults: true
      });
      
      setStatus('Listening…');
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setMicError(error.message || 'Failed to start microphone');
      setStatus('Error');
    }
  }, [supported]);

  const stopListening = useCallback(() => {
    try {
      console.log('Stopping speech recognition');
      SpeechRecognition.stopListening();
      setStatus('Stopped');
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
      setStatus('Error');
    }
  }, []);

  return {
    listening,
    transcript,
    finalTranscript: transcript, // Alias for compatibility
    resetTranscript,
    supported,
    translateAsync,
    result,
    status,
    micError,
    startListening,
    stopListening
  };
}