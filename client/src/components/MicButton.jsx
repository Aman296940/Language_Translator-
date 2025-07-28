import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';

export default function MicButton({ listening, onClick }) {
  return (
    <button
      className={`w-28 h-28 rounded-full flex items-center justify-center text-4xl
        ${listening ? 'bg-red-600' : 'bg-emerald-500'} hover:scale-105 transition`}
      onClick={onClick}
    >
      {listening ? <FaMicrophoneSlash /> : <FaMicrophone />}
    </button>
  );
}
