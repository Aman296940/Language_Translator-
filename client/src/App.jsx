import { useState, useEffect } from 'react';
import LanguageSelect from './components/LanguageSelect.jsx';
import MicButton from './components/MicButton.jsx';
import StatusBar from './components/StatusBar.jsx';
import useParrot from './hooks/useParrot.js';

export default function App() {
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
    history,
    clearHistory,
    startListening,
    stopListening,
  } = useParrot();

  const [fromLang, setFromLang] = useState('auto');
  const [toLang, setToLang] = useState('en');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!supported) {
    return (
      <div className="w-full max-w-3xl px-6 pb-20">
        <p className="text-red-600 text-center mt-8">
          Your browser does not support speech recognition.<br />
          Please use Chrome or Edge browsers.
        </p>
      </div>
    );
  }

  const onToggle = () => {
    if (listening) {
      stopListening();
    } else {
      startListening(fromLang);
    }
  };

  const onManualTranslate = () => {
    translateAsync(transcript, fromLang, toLang);
  };

  return (
    <div className="w-full max-w-3xl px-6 pb-20 mx-auto">
      <header className="flex flex-col items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-100">Language Translator</h1>
        {!isOnline && (
          <div className="bg-amber-900/50 border border-amber-500 rounded p-2 text-amber-200 text-sm">
            ⚠️ You're offline. App interface is available, but translation requires internet.
          </div>
        )}
      </header>

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

        {history.length > 0 && (
          <div className="w-full mt-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm text-gray-300">Translation History</label>
              <button
                onClick={clearHistory}
                className="text-xs text-amber-400 hover:text-amber-300 underline"
              >
                Clear History
              </button>
            </div>
            <div className="bg-slate-800/30 rounded p-3 max-h-48 overflow-y-auto">
              {history.slice(0, 5).map((item) => (
                <div key={item.id} className="mb-2 pb-2 border-b border-slate-700 last:border-0">
                  <div className="text-xs text-gray-400">{item.original}</div>
                  <div className="text-sm text-gray-200 mt-1">{item.translated}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <StatusBar status={status} reset={resetTranscript} />
    </div>
  );
}