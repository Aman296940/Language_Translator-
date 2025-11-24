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
  // Prefer local transcript if it has content (native API is more reliable)
  const transcript = localTranscript || libTranscript;
  const listening = localListening || libListening;

  // Check browser support
  const supported = checkBrowserSupport() || browserSupportsSpeechRecognition;


  // Initialize native Speech Recognition - only once
  useEffect(() => {
    if (supported && !recognition) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionAPI) {
        const rec = new SpeechRecognitionAPI();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'en-US';
        rec.maxAlternatives = 1; // Only get the best result

        let accumulatedTranscript = '';
        let isActive = false;
        let shouldRestart = false;

        rec.onresult = (event) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            const transcript = result[0].transcript;
            const isFinal = result.isFinal;
            
            if (isFinal) {
              finalTranscript += transcript + ' ';
              accumulatedTranscript += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }

          const fullTranscript = accumulatedTranscript + interimTranscript;
          
          if (fullTranscript.trim()) {
            setLocalTranscript(fullTranscript.trim());
          }
        };

        rec.onerror = (event) => {
          if (event.error === 'no-speech') {
            // Normal when not speaking, ignore
            return;
          }
          
          if (event.error !== 'no-speech') {
            setMicError(`Speech recognition error: ${event.error}`);
          }
          
          if (event.error === 'aborted' || event.error === 'not-allowed' || event.error === 'network') {
            setLocalListening(false);
          }
        };

        rec.onend = () => {
          isActive = false;
          
          setTimeout(() => {
            if (shouldRestart) {
              try {
                rec.start();
                shouldRestart = false;
              } catch (e) {
                setLocalListening(false);
                shouldRestart = false;
              }
            } else if (localListening) {
              shouldRestart = true;
              setTimeout(() => {
                try {
                  rec.start();
                  shouldRestart = false;
                } catch (e) {
                  setLocalListening(false);
                  shouldRestart = false;
                }
              }, 100);
            }
          }, 50);
        };

        rec.onstart = () => {
          isActive = true;
          setLocalListening(true);
          accumulatedTranscript = '';
          setLocalTranscript('');
          setStatus('Listening…');
        };

        setRecognition(rec);
      }
    }
  }, [supported]);

  useEffect(() => {
    if (supported && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .catch((err) => {
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
        const response = await fetch(url);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}: ${response.statusText}` }));
          throw new Error(errorData.error || errorData.details || `HTTP ${response.status}`);
        }
        
        const res = await response.json();
        
        if (res.result) {
          setResult(res.result);
          const utter = new SpeechSynthesisUtterance(res.result);
          utter.lang = to;
          window.speechSynthesis.speak(utter);
          setStatus('Done');
        } else {
          throw new Error(res.error || res.details || 'No result from API');
        }
      } catch (err) {
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
    setLocalListening(true);
    
    try {
      const language = lang === 'auto' ? 'en-US' : lang;
      
      resetTranscript();
      setLocalTranscript('');
      
      if (recognition) {
        try {
          recognition.lang = language;
          
          try {
            recognition.stop();
          } catch (stopError) {
            // Ignore if not running
          }
          
          setTimeout(() => {
            try {
              recognition.start();
              setStatus('Listening…');
            } catch (startError) {
              setMicError(`Failed to start: ${startError.message}`);
              setLocalListening(false);
            }
          }, 100);
        } catch (nativeError) {
          setMicError(`Failed to setup: ${nativeError.message}`);
          setLocalListening(false);
        }
      } else {
        setMicError('Speech recognition not initialized. Please refresh the page.');
        setLocalListening(false);
        setStatus('Error');
        return;
      }
      
      try {
        SpeechRecognition.startListening({
          continuous: true,
          language: language,
          interimResults: true
        });
      } catch (libError) {
        // Library is fallback, continue without it
      }
    } catch (error) {
      setMicError(error.message || 'Failed to start microphone');
      setStatus('Error');
      setLocalListening(false);
    }
  }, [supported, resetTranscript, recognition]);

  const stopListening = useCallback(() => {
    try {
      SpeechRecognition.stopListening();
      if (recognition) {
        recognition.stop();
      }
      setLocalListening(false);
      setStatus('Stopped');
    } catch (error) {
      setStatus('Error');
    }
  }, [recognition]);

  const clearAll = useCallback(() => {
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