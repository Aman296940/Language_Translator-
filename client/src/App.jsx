import { useState } from 'react';
import LanguageSelect from './components/LanguageSelect.jsx';
import MicButton from './components/MicButton.jsx';
import StatusBar from './components/StatusBar.jsx';
import useParrot from './hooks/useParrot.js';
import logo from './assets/react.svg';

export default function App() {
  // Destructure all needed state and actions from your custom hook
  const {
    listening,
    transcript,
    finalTranscript,
    resetTranscript,
    supported,
    translateAsync,
    result,
    status,
    micError,
    startListening,
    stopListening,
  } = useParrot();

  // Local state for languages (defaulting to auto and English)
  const [fromLang, setFromLang] = useState('auto');
  const [toLang, setToLang] = useState('en');

  // *** DEBUGGING LINE: CHECK WHAT App.jsx RECEIVES ***
  console.log('App.jsx - `supported` value received from useParrot:', supported);

  // If browser support is missing, inform the user
  // This condition should now evaluate to false because we force `supported` to true in useParrot.js
  if (!supported) {
    return (
      <div className="w-full max-w-3xl px-6 pb-20">
        <p className="text-red-600 text-center mt-8">
          Your browser does not support speech recognition.<br />
          Please use Chrome or Edge browsers.<br/>
          **DEBUG INFO: `supported` value is: {String(supported)}** {/* Display the value directly */}
        </p>
      </div>
    );
  }

  // Toggle microphone on/off
  const onToggle = () => {
    if (listening) {
      stopListening();
    } else {
      startListening(fromLang);
    }
  };

  // Manual translation trigger (translates whatever's currently in transcript)
  const onManualTranslate = () => {
    translateAsync(transcript, fromLang, toLang);
  };

  // The rest of the App component (main UI)
  return (
    <div className="w-full max-w-3xl px-6 pb-20 mx-auto">
      <header className="flex flex-col items-center gap-4 mb-8">
        {/* <img src={logo} alt="Parrot logo" className="w-32" /> */}
        <h1 className="text-3xl font-bold text-gray-100">Language Translator</h1>
      </header>

      {/* Removed the duplicate !supported message block here */}

      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
        <LanguageSelect label="From" value={fromLang} onChange={setFromLang} />
        <LanguageSelect label="To" value={toLang} onChange={setToLang} />
      </div>

      <div className="flex flex-col items-center gap-6">
        <MicButton listening={listening} onClick={onToggle} aria-label="Start or stop microphone" />
        
        {micError && (
          <div className="w-full bg-red-900/50 border border-red-500 rounded p-3 text-red-200 text-sm">
            <strong>Microphone Error:</strong> {micError}
            <br />
            <span className="text-xs mt-1 block">
              Make sure you've granted microphone permissions and are using Chrome or Edge browser.
            </span>
          </div>
        )}

        <textarea
          className="w-full h-32 p-3 rounded text-black"
          value={transcript}
          readOnly
          placeholder={listening ? "Speak now... Your speech will appear here." : "Your speech will appear here... Or type text below to translate manually."}
          aria-label="Transcript text area"
        />

        <div className="w-full">
          <label className="block text-sm text-gray-300 mb-2">Or type text to translate:</label>
          <textarea
            id="manual-input"
            className="w-full h-24 p-3 rounded text-black"
            placeholder="Type text here to translate..."
            aria-label="Manual text input"
          />
          <button
            onClick={() => {
              const input = document.getElementById('manual-input');
              if (input && input.value.trim()) {
                translateAsync(input.value.trim(), fromLang, toLang);
              }
            }}
            className="mt-2 bg-blue-500 hover:bg-blue-600 font-semibold px-6 py-2 rounded transition"
          >
            Translate Text
          </button>
        </div>

        <button
          onClick={onManualTranslate}
          disabled={!transcript.trim()}
          className={`bg-amber-500 hover:bg-amber-600 font-semibold px-6 py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-disabled={!transcript.trim()}
        >
          Translate Speech
        </button>

        <div
          className="w-full min-h-20 mt-4 bg-slate-800/50 rounded p-4 whitespace-pre-wrap text-gray-100"
          aria-live="polite"
          aria-label="Translation result"
        >
          {result || 'Translation output will appear here.'}
        </div>
      </div>

      <StatusBar status={status} reset={resetTranscript} />
    </div>
  );
}