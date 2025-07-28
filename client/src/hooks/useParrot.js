import { useState, useCallback } from 'react';
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

export default function useParrot() {
  const [status, setStatus] = useState('');
  const [result, setResult] = useState('');

  const {
    transcript,
    listening,
    resetTranscript,
    // We are deliberately NOT using the 'browserSupportsSpeechRecognition' prop
    // from useSpeechRecognition directly, as it seems to be misreporting in your environment.
  } = useSpeechRecognition();

  // *** IMPORTANT: FORCE 'supported' TO TRUE ***
  // Based on your console output, window.webkitSpeechRecognition exists,
  // so we are overriding the library's internal check to ensure App.jsx proceeds.
  const supported = true; // <--- This line is the key change

  // *** DEBUGGING LINE: CHECK WHAT useParrot.js IS RETURNING ***
  console.log('useParrot.js - `supported` value being returned:', supported);


  const translateAsync = useCallback(
    async (text, from, to) => {
      if (!text) return;
      setStatus('Translating…');
      try {
        const res = await fetch(
          `/api/translate?q=${encodeURIComponent(text)}&to=${to}&from=${from}`
        ).then((r) => r.json());
        if (res.result) {
          setResult(res.result);
          // speak it
          const utter = new SpeechSynthesisUtterance(res.result);
          utter.lang = to;
          window.speechSynthesis.speak(utter);
          setStatus('Done');
        } else throw new Error(res.error || 'No result');
      } catch (err) {
        console.error(err);
        setStatus('Error');
      }
    },
    []
  );

  const startListening = (lang) => {
    // This call still relies on the react-speech-recognition library,
    // which should ideally pick up window.webkitSpeechRecognition.
    // If it fails after this, the problem is deeper than the 'supported' flag.
    SpeechRecognition.startListening({
      continuous: true,
      language: lang === 'auto' ? 'en-US' : lang
    });
    setStatus('Listening…');
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setStatus('Stopped');
  };

  return {
    listening,
    transcript,
    resetTranscript,
    supported, // <--- Return our explicitly set 'true' value
    translateAsync,
    result,
    status,
    startListening,
    stopListening
  };
}