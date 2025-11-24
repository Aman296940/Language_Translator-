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
        console.log('Creating new SpeechRecognition instance');
        const rec = new SpeechRecognitionAPI();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'en-US';

        let accumulatedTranscript = '';

        rec.onresult = (event) => {
          console.log('=== NATIVE RECOGNITION RESULT EVENT ===');
          console.log('Event:', event);
          console.log('Results length:', event.results.length);
          console.log('Result index:', event.resultIndex);
          
          let interimTranscript = '';
          let finalTranscript = '';

          // Process all results from the last resultIndex
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            const transcript = result[0].transcript;
            const isFinal = result.isFinal;
            
            console.log(`Result ${i}: "${transcript}" (isFinal: ${isFinal})`);
            
            if (isFinal) {
              finalTranscript += transcript + ' ';
              accumulatedTranscript += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }

          // Combine accumulated final transcript with current interim
          const fullTranscript = accumulatedTranscript + interimTranscript;
          
          console.log('Final transcript:', accumulatedTranscript);
          console.log('Interim transcript:', interimTranscript);
          console.log('Full transcript:', fullTranscript);
          
          if (fullTranscript.trim()) {
            console.log('✅ Setting transcript:', fullTranscript.trim());
            setLocalTranscript(fullTranscript.trim());
          } else {
            console.warn('⚠️ Empty transcript, not setting');
          }
        };

        rec.onerror = (event) => {
          console.error('=== SPEECH RECOGNITION ERROR ===');
          console.error('Error:', event.error);
          console.error('Event:', event);
          
          if (event.error === 'no-speech') {
            console.log('No speech detected (this is normal when not speaking)');
          } else if (event.error !== 'no-speech') {
            setMicError(`Speech recognition error: ${event.error}`);
          }
          
          // Don't stop on 'no-speech' errors, just log them
          if (event.error === 'aborted' || event.error === 'not-allowed' || event.error === 'network') {
            setLocalListening(false);
          }
        };

        rec.onend = () => {
          console.log('=== SPEECH RECOGNITION ENDED ===');
          console.log('localListening state:', localListening);
          
          // If still supposed to be listening, restart
          if (localListening) {
            console.log('🔄 Restarting recognition...');
            setTimeout(() => {
              try {
                rec.start();
                console.log('✅ Recognition restarted');
              } catch (e) {
                console.warn('❌ Could not restart recognition:', e);
                setLocalListening(false);
              }
            }, 100);
          }
        };

        rec.onstart = () => {
          console.log('=== NATIVE SPEECH RECOGNITION STARTED ===');
          setLocalListening(true);
          accumulatedTranscript = ''; // Reset on start
          setLocalTranscript(''); // Clear previous transcript
        };

        rec.onaudiostart = () => {
          console.log('🎤 Audio capture started');
        };

        rec.onaudioend = () => {
          console.log('🎤 Audio capture ended');
        };

        rec.onsoundstart = () => {
          console.log('🔊 Sound detected');
        };

        rec.onsoundend = () => {
          console.log('🔇 Sound ended');
        };

        rec.onspeechstart = () => {
          console.log('🗣️ Speech detected');
        };

        rec.onspeechend = () => {
          console.log('🗣️ Speech ended');
        };

        setRecognition(rec);
        console.log('✅ Recognition object created and stored');
      } else {
        console.error('❌ SpeechRecognition API not available');
      }
    }
  }, [supported, recognition, localListening]);

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
      console.log('=== STARTING SPEECH RECOGNITION ===');
      console.log('Language:', language);
      console.log('Recognition object exists:', !!recognition);
      
      // Reset transcript before starting
      resetTranscript();
      setLocalTranscript('');
      
      // Try native first (more reliable)
      if (recognition) {
        try {
          recognition.lang = language;
          console.log('Recognition state before start:', recognition.state || 'unknown');
          
          // Stop if already running
          if (recognition.state === 'running' || recognition.state === 'listening') {
            console.log('Stopping existing recognition...');
            recognition.stop();
            // Wait a bit before restarting
            setTimeout(() => {
              console.log('Starting recognition after stop...');
              recognition.start();
              console.log('✅ Native recognition started');
            }, 200);
          } else {
            console.log('Starting recognition...');
            recognition.start();
            console.log('✅ Native recognition started');
          }
        } catch (nativeError) {
          console.error('❌ Native recognition start error:', nativeError);
          setMicError(`Failed to start: ${nativeError.message}`);
        }
      } else {
        console.warn('⚠️ Recognition object not available yet');
      }
      
      // Also try library
      try {
        SpeechRecognition.startListening({
          continuous: true,
          language: language,
          interimResults: true
        });
        console.log('✅ Library speech recognition started');
      } catch (libError) {
        console.warn('⚠️ Library speech recognition failed:', libError);
      }
      
      setStatus('Listening…');
      console.log('🎤 Speech recognition started, speak now...');
    } catch (error) {
      console.error('❌ Error starting speech recognition:', error);
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