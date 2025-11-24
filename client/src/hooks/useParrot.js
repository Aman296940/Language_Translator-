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
  const [localTranscript, setLocalTranscript] = useState('');
  const [localListening, setLocalListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  const {
    transcript: libTranscript,
    listening: libListening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  // Use library transcript if available, otherwise use local
  const transcript = libTranscript || localTranscript;
  const listening = libListening || localListening;

  // Check browser support
  const supported = checkBrowserSupport() || browserSupportsSpeechRecognition;

  // Debug logging and error handling
  useEffect(() => {
    console.log('Speech Recognition State:', {
      supported,
      browserSupportsSpeechRecognition,
      isMicrophoneAvailable,
      hasWebkit: !!window.webkitSpeechRecognition,
      hasSpeechRecognition: !!window.SpeechRecognition,
      listening,
      transcript,
      transcriptLength: transcript?.length || 0
    });
    
    // Log when transcript changes
    if (transcript) {
      console.log('Transcript updated:', transcript);
    }
  }, [supported, browserSupportsSpeechRecognition, isMicrophoneAvailable, listening, transcript]);

  // Initialize native Speech Recognition as fallback
  useEffect(() => {
    if (supported && !recognition) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionAPI) {
        const rec = new SpeechRecognitionAPI();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'en-US';

        rec.onresult = (event) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }

          const fullTranscript = finalTranscript || interimTranscript;
          if (fullTranscript) {
            console.log('Native recognition transcript:', fullTranscript);
            setLocalTranscript(fullTranscript.trim());
          }
        };

        rec.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setMicError(`Speech recognition error: ${event.error}`);
          setLocalListening(false);
        };

        rec.onend = () => {
          console.log('Speech recognition ended');
          setLocalListening(false);
        };

        rec.onstart = () => {
          console.log('Speech recognition started');
          setLocalListening(true);
        };

        setRecognition(rec);
      }
    }
  }, [supported, recognition]);

  // Request microphone permission on component mount
  useEffect(() => {
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
  }, [supported]);


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
      
      // Reset transcript before starting
      resetTranscript();
      setLocalTranscript('');
      
      // Try library first
      try {
        SpeechRecognition.startListening({
          continuous: true,
          language: language,
          interimResults: true
        });
        console.log('Library speech recognition started');
      } catch (libError) {
        console.warn('Library speech recognition failed, using native:', libError);
      }
      
      // Also try native as fallback
      if (recognition) {
        recognition.lang = language;
        recognition.start();
        console.log('Native speech recognition started');
      }
      
      setStatus('Listening…');
      console.log('Speech recognition started, waiting for audio...');
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setMicError(error.message || 'Failed to start microphone');
      setStatus('Error');
    }
  }, [supported, resetTranscript, recognition]);

  const stopListening = useCallback(() => {
    try {
      console.log('Stopping speech recognition');
      SpeechRecognition.stopListening();
      if (recognition) {
        recognition.stop();
      }
      setLocalListening(false);
      setStatus('Stopped');
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
      setStatus('Error');
    }
  }, [recognition]);

  // Enhanced clear function that clears both transcript and result
  const clearAll = useCallback(() => {
    console.log('Clearing transcript and result');
    resetTranscript();
    setLocalTranscript('');
    setResult('');
    setStatus('');
    setMicError(null);
  }, [resetTranscript]);

  return {
    listening,
    transcript,
    finalTranscript: transcript, // Alias for compatibility
    resetTranscript: clearAll, // Use enhanced clear function
    supported,
    translateAsync,
    result,
    status,
    micError,
    startListening,
    stopListening
  };
}