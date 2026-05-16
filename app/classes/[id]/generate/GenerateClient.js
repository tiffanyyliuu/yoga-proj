'use client';

import { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from '../../../components/ThemeToggle';

const THEMES = ['Grounding', 'Heart Opening', 'Hip Focus', 'Backbends', 'Strength & Power', 'Balance & Focus', 'Twists', 'Restorative', 'Energy Boost'];
const ENERGIES = ['Low — needs warming up', 'Medium — steady', 'High — ready to work'];
const SPECIALS = ['New student(s)', 'Injury mentioned today', 'Post-holiday / long break', 'Shorter class', 'Student-requested focus'];

function Tag({ label, selected, onClick }) {
  return (
    <button type="button" onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm border transition-colors ${
        selected
          ? 'bg-stone-900 border-stone-900 text-white dark:bg-stone-100 dark:border-stone-100 dark:text-stone-900'
          : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-400 dark:hover:border-stone-500'
      }`}>
      {label}
    </button>
  );
}

function SequencePreview({ data, className }) {
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl overflow-hidden">
      <div className="bg-stone-950 text-stone-100 px-6 py-7">
        <p className="text-stone-500 text-xs tracking-[0.15em] uppercase mb-4">{className} — {today}</p>
        <h2 className="font-serif text-3xl font-light mb-1">{data.theme}</h2>
        {data.intention && <p className="text-stone-400 text-sm">{data.intention}</p>}
      </div>

      <div className="divide-y divide-stone-100 dark:divide-stone-800">
        {data.sections?.map(section => (
          <div key={section.name} className="px-5 sm:px-7 py-6">
            <div className="flex items-baseline justify-between mb-4">
              <h3 className="font-serif text-lg font-light text-stone-700 dark:text-stone-300">{section.name}</h3>
              <span className="text-stone-300 dark:text-stone-600 text-xs ml-4 shrink-0">{section.duration_min} min</span>
            </div>
            <div className="space-y-4">
              {section.poses?.map((pose, i) => (
                <div key={i} className="flex gap-4">
                  <span className="text-xs text-stone-300 dark:text-stone-600 shrink-0 pt-0.5 whitespace-nowrap">{pose.start}–{pose.end}</span>
                  <div className="min-w-0 overflow-hidden">
                    <p className="text-stone-800 dark:text-stone-200 text-sm font-medium break-words">{pose.name}{pose.reps && <span className="text-stone-400 dark:text-stone-500 text-xs font-normal ml-2">{pose.reps}</span>}</p>
                    {pose.modification && <p className="text-xs text-amber-600 dark:text-amber-500 mt-1 break-words">Mod — {pose.modification}</p>}
                    {pose.student_note && <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5 italic break-words">{pose.student_note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {data.closing_note && (
        <div className="border-t border-stone-100 dark:border-stone-800 px-5 sm:px-7 py-6 bg-stone-50 dark:bg-stone-800">
          <p className="text-xs text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-2">Why this sequence</p>
          <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">{data.closing_note}</p>
        </div>
      )}
    </div>
  );
}

export default function GenerateClient({ classId, className }) {
  const [theme, setTheme] = useState('');
  const [energy, setEnergy] = useState('');
  const [specials, setSpecials] = useState([]);
  const [customNote, setCustomNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  function toggleSpecial(s) {
    setSpecials(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }

  async function handleGenerate() {
    setLoading(true);
    setResult(null);
    setError('');
    const contextParts = [
      theme && `Theme: ${theme}`,
      energy && `Group energy: ${energy}`,
      specials.length > 0 && `Special notes: ${specials.join(', ')}`,
      customNote.trim(),
    ].filter(Boolean);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classId, context: contextParts.join('. ') }),
      });
      if (!res.ok) { setError('Something went wrong. Try again.'); setLoading(false); return; }
      const data = await res.json();
      setResult(data);
    } catch {
      setError('Something went wrong. Try again.');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <header className="bg-stone-950 text-stone-100 px-6 sm:px-8 py-5 flex items-center justify-between">
        <Link href="/dashboard" className="font-serif text-xl tracking-wide">Sequence</Link>
        <div className="flex items-center gap-4">
          <ThemeToggle className="text-stone-500 hover:text-stone-300" />
          <Link href={`/classes/${classId}`} className="text-stone-500 hover:text-stone-300 text-sm transition-colors">← Back</Link>
        </div>
      </header>

      <div className="bg-stone-900 text-stone-100 px-6 sm:px-8 py-10">
        <div className="max-w-3xl mx-auto">
          <p className="text-stone-500 text-xs tracking-[0.15em] uppercase mb-2">{className}</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-light">Generate sequence</h1>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        {!result && !loading && (
          <div className="space-y-10">
            <div>
              <p className="text-xs font-semibold tracking-widest text-stone-400 dark:text-stone-500 uppercase mb-4">Theme for today</p>
              <div className="flex flex-wrap gap-2">
                {THEMES.map(t => <Tag key={t} label={t} selected={theme === t} onClick={() => setTheme(theme === t ? '' : t)} />)}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest text-stone-400 dark:text-stone-500 uppercase mb-4">Group energy</p>
              <div className="flex flex-wrap gap-2">
                {ENERGIES.map(e => <Tag key={e} label={e} selected={energy === e} onClick={() => setEnergy(energy === e ? '' : e)} />)}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest text-stone-400 dark:text-stone-500 uppercase mb-4">Anything special today?</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {SPECIALS.map(s => <Tag key={s} label={s} selected={specials.includes(s)} onClick={() => toggleSpecial(s)} />)}
              </div>
              <input value={customNote} onChange={e => setCustomNote(e.target.value)} placeholder="Other notes..."
                className="w-full px-4 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-600 focus:outline-none focus:border-stone-400 dark:focus:border-stone-500 transition-colors" />
            </div>
            <button onClick={handleGenerate}
              className="px-8 py-3.5 bg-stone-950 text-white text-sm rounded-full hover:bg-stone-800 transition-colors font-medium">
              Generate sequence
            </button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-32 text-stone-400">
            <div className="w-8 h-8 border-2 border-stone-200 dark:border-stone-700 border-t-stone-600 rounded-full animate-spin mb-6" />
            <p className="font-serif text-xl font-light">Crafting your sequence…</p>
            <p className="text-stone-400 dark:text-stone-500 text-sm mt-2">This takes about 30 seconds</p>
          </div>
        )}

        {error && <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 px-4 py-3 rounded-xl text-sm">{error}</div>}

        {result && (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-stone-400 dark:text-stone-500 text-sm">Saved to your class.</p>
              <Link href={`/classes/${classId}/sequences/${result.id}`}
                className="px-5 py-2 border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 text-sm rounded-full hover:border-stone-500 dark:hover:border-stone-400 transition-colors">
                Edit / add notes →
              </Link>
            </div>
            <SequencePreview data={result} className={className} />
            <button onClick={() => setResult(null)} className="mt-8 text-sm text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors">
              ← Generate another
            </button>
          </>
        )}
      </main>
    </div>
  );
}
