export default function StatusBar({ status, reset }) {
  return (
    <div className="fixed bottom-4 inset-x-0 flex justify-center">
      <div className="bg-slate-800 px-4 py-2 rounded shadow">
        <span>{status || 'Ready'}</span>
        <button 
          onClick={reset} 
          className="ml-4 underline text-amber-400 hover:text-amber-300"
          type="button"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
