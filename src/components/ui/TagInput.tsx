import { useState, type KeyboardEvent } from 'react';
import { X, Plus } from 'lucide-react';

interface TagInputProps {
  label?: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  hint?: string;
}

export function TagInput({ label, values, onChange, placeholder = 'Ajouter et appuyer sur Entrée', hint }: TagInputProps) {
  const [input, setInput] = useState('');

  const add = () => {
    const v = input.trim();
    if (v && !values.includes(v)) {
      onChange([...values, v]);
    }
    setInput('');
  };

  const remove = (val: string) => {
    onChange(values.filter((v) => v !== val));
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      add();
    }
    if (e.key === 'Backspace' && !input && values.length > 0) {
      remove(values[values.length - 1]);
    }
  };

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-ink-700 mb-1.5">{label}</label>}
      <div className="flex flex-wrap gap-2 p-2.5 rounded-xl border border-ink-200 bg-white min-h-11 focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 transition-all">
        {values.map((val) => (
          <span key={val} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary-50 text-primary-700 text-sm font-medium">
            {val}
            <button type="button" onClick={() => remove(val)} className="hover:text-primary-900">
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
        <div className="flex items-center gap-1 flex-1 min-w-32">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            onBlur={add}
            placeholder={values.length === 0 ? placeholder : ''}
            className="flex-1 outline-none bg-transparent text-sm text-ink-900 placeholder:text-ink-400"
          />
          {input && (
            <button type="button" onClick={add} className="text-primary-600 hover:text-primary-800">
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      {hint && <p className="mt-1.5 text-sm text-ink-400">{hint}</p>}
    </div>
  );
}
