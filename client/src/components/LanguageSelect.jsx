import { LANGS } from '../hooks/useParrot';

export default function LanguageSelect({ label, value, onChange }) {
  return (
    <label className="flex flex-col text-sm">
      <span className="mb-1">{label}</span>
      <select
        className="bg-slate-800 p-2 rounded"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {Object.entries(LANGS).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </label>
  );
}
