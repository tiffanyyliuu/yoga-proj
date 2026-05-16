'use client';

import { useState } from 'react';
import Link from 'next/link';

const THEMES = ['Grounding', 'Heart Opening', 'Hip Focus', 'Backbends', 'Strength & Power', 'Balance & Focus', 'Twists', 'Restorative', 'Energy Boost'];
const ENERGIES = ['Low — needs warming up', 'Medium — steady', 'High — ready to work'];
const SPECIALS = ['New student(s)', 'Injury mentioned today', 'Post-holiday / long break', 'Shorter class', 'Student-requested focus'];

function Tag({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm border transition-colors ${
        selected
          ? 'bg-stone-900 border-stone-900 text-white'
          : 'bg-white border-stone-200 text-stone-600 hover:border-stone-400'
      }`}
    >
      {label}
    </button>
  );
}

function SequencePreview({ data, className }) {
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  return (
    <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
      <div className="bg-stone-950 text-stone-100 px-6 py-6">
        <p className="text-stone-500 text-xs tracking-[0.15em] uppercase mb-3">{className} — {today}</p>
        <div className="space-y-1">
          <div className="flex gap-3 text-sm">
            <span className="text-stone-500 w-20 shrink-0">Theme</span>
            <span className="text-stone-200">→ {data.theme}</span>
          </div>
          <div className="flex gap-3 text-sm">
            <span className="text-stone-500 w-20 shrink-0">Intention</span>
            <span className="text-stone-200">→ {data.intention}</span>
          </div>
        </div>
      </div>

      <div className="divide-y divide-stone-100">
        {data.sections?.map(section => (
          <div key={section.name} className="px-6 py-5">
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="text-xs font-semibold tracking-widest text-stone-400 uppercase">{section.name}</h3>
              <span className="text-xs text-stone-300">{section.duration_min} min</span>
            </div>
            <div className="border-t border-stone-100 pt-3 space-y-3">
              {section.poses?.map((pose, i) => (
                <div key={i} className="flex gap-4 text-sm">
                  <span className="font-mono text-xs text-stone-300 w-24 shrink-0 pt-0.5">{pose.start}–{pose.end}</span>
                  <div>
                    <span className="text-stone-800 font-medium">{pose.name}</span>
                    {pose.reps && <span className="text-stone-400 ml-2 text-xs">{pose.reps}</span>}
                    {pose.modification && <p className="text-xs text-amber-600 mt-0.5">✦ Mod: {pose.modification}</p>}
                    {pose.student_note && <p className="text-xs text-blue-500 mt-0.5">✦ {pose.student_note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {data.closing_note && (
        <div className="border-t border-stone-200 bg-stone-50 px-6 py-5">
          <p className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-2">Why this sequence</p>
          <p className="text-sm text-stone-500 leading-relaxed">{data.closing_note}</p>
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
    <div className="min-h-screen bg-stone-50">
      <header className="bg-stone-950 text-stone-100 px-8 py-5 flex items-center justify-between">
        <Link href="/dashboard" className="font-serif text-xl tracking-wide">Sequence</Link>
        <Link href={`/classes/${classId}`} className="text-stone-500 hover:text-stone-300 text-sm transition-colors">
          ← Back to class
        </Link>
      </header>

      <div className="bg-stone-900 text-stone-100 px-8 py-10">
        <div className="max-w-3xl mx-auto">
          <p className="text-stone-500 text-xs tracking-[0.15em] uppercase mb-2">{className}</p>
          <h1 className="font-serif text-4xl font-light">Generate sequence</h1>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {!result && !loading && (
          <div className="space-y-10">
            <div>
              <p className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-4">Theme for today</p>
              <div className="flex flex-wrap gap-2">
                {THEMES.map(t => <Tag key={t} label={t} selected={theme === t} onClick={() => setTheme(theme === t ? '' : t)} />)}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-4">Group energy</p>
              <div className="flex flex-wrap gap-2">
                {ENERGIES.map(e => <Tag key={e} label={e} selected={energy === e} onClick={() => setEnergy(energy === e ? '' : e)} />)}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-4">Anything special today?</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {SPECIALS.map(s => <Tag key={s} label={s} selected={specials.includes(s)} onClick={() => toggleSpecial(s)} />)}
              </div>
              <input
                value={customNote}
                onChange={e => setCustomNote(e.target.value)}
                placeholder="Other notes..."
                className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400 transition-colors"
              />
            </div>

            <button
              onClick={handleGenerate}
              className="px-8 py-3.5 bg-stone-950 text-white text-sm rounded-full hover:bg-stone-800 transition-colors font-medium"
            >
              Generate sequence
            </button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-32 text-stone-400">
            <div className="w-8 h-8 border-2 border-stone-200 border-t-stone-600 rounded-full animate-spin mb-6" />
            <p className="font-serif text-xl font-light">Crafting your sequence…</p>
            <p className="text-stone-400 text-sm mt-2">This takes about 30 seconds</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>
        )}

        {result && (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-stone-400 text-sm">Saved to your class.</p>
              <Link
                href={`/classes/${classId}/sequences/${result.id}`}
                className="px-5 py-2 border border-stone-300 text-stone-700 text-sm rounded-full hover:border-stone-500 transition-colors"
              >
                Edit / add notes →
              </Link>
            </div>
            <SequencePreview data={result} className={className} />
            <button
              onClick={() => setResult(null)}
              className="mt-8 text-sm text-stone-400 hover:text-stone-600 transition-colors"
            >
              ← Generate another
            </button>
          </>
        )}
      </main>
    </div>
  );
}
