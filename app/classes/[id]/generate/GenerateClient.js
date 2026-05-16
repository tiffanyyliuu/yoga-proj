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
      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
        selected
          ? 'bg-stone-800 border-stone-800 text-white'
          : 'bg-white border-stone-300 text-stone-600 hover:border-stone-500'
      }`}
    >
      {label}
    </button>
  );
}

function SequencePreview({ data, className }) {
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  return (
    <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
      <div className="border-b-2 border-stone-800 px-6 py-5 bg-stone-50">
        <p className="font-mono text-xs font-bold tracking-widest text-stone-500 uppercase mb-3">
          {className} — {today}
        </p>
        <div className="space-y-1 text-sm">
          <div className="flex gap-3">
            <span className="text-stone-400 w-20 shrink-0">Theme</span>
            <span className="text-stone-800">→ {data.theme}</span>
          </div>
          <div className="flex gap-3">
            <span className="text-stone-400 w-20 shrink-0">Intention</span>
            <span className="text-stone-800">→ {data.intention}</span>
          </div>
        </div>
      </div>

      <div className="divide-y divide-stone-100">
        {data.sections?.map(section => (
          <div key={section.name} className="px-6 py-5">
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="font-mono text-xs font-bold tracking-widest text-stone-500 uppercase">{section.name}</h3>
              <span className="text-xs text-stone-400">{section.duration_min} min</span>
            </div>
            <div className="border-t border-stone-100 pt-3 space-y-3">
              {section.poses?.map((pose, i) => (
                <div key={i} className="flex gap-4 text-sm">
                  <span className="font-mono text-xs text-stone-400 w-24 shrink-0 pt-0.5">{pose.start}–{pose.end}</span>
                  <div>
                    <span className="text-stone-800 font-medium">{pose.name}</span>
                    {pose.reps && <span className="text-stone-500 ml-2 text-xs">{pose.reps}</span>}
                    {pose.modification && <p className="text-xs text-amber-700 mt-0.5">✦ Mod: {pose.modification}</p>}
                    {pose.student_note && <p className="text-xs text-blue-600 mt-0.5">✦ {pose.student_note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {data.closing_note && (
        <div className="border-t-2 border-stone-800 px-6 py-5 bg-stone-50">
          <p className="font-mono text-xs font-bold tracking-widest text-stone-400 uppercase mb-2">Why this sequence</p>
          <p className="text-sm text-stone-600 leading-relaxed">{data.closing_note}</p>
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
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="mb-8">
        <Link href={`/classes/${classId}`} className="text-stone-400 text-sm hover:text-stone-600">← Back to class</Link>
        <h1 className="text-2xl font-light mt-3">Generate Sequence</h1>
      </div>

      {!result && !loading && (
        <div className="space-y-7">
          <div>
            <p className="text-sm font-medium text-stone-700 mb-2">Theme for today</p>
            <div className="flex flex-wrap gap-2">
              {THEMES.map(t => <Tag key={t} label={t} selected={theme === t} onClick={() => setTheme(theme === t ? '' : t)} />)}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-stone-700 mb-2">Group energy today</p>
            <div className="flex flex-wrap gap-2">
              {ENERGIES.map(e => <Tag key={e} label={e} selected={energy === e} onClick={() => setEnergy(energy === e ? '' : e)} />)}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-stone-700 mb-2">Anything special today?</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {SPECIALS.map(s => <Tag key={s} label={s} selected={specials.includes(s)} onClick={() => toggleSpecial(s)} />)}
            </div>
            <input
              value={customNote}
              onChange={e => setCustomNote(e.target.value)}
              placeholder="Other notes..."
              className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>

          <button onClick={handleGenerate} className="px-6 py-2 bg-stone-800 text-white text-sm rounded-md hover:bg-stone-700 transition-colors">
            Generate sequence
          </button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-24 text-stone-400">
          <div className="w-7 h-7 border-2 border-stone-200 border-t-stone-600 rounded-full animate-spin mb-5" />
          <p className="text-sm">Crafting your sequence…</p>
        </div>
      )}

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">{error}</div>}

      {result && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-stone-500">Saved to your class.</p>
            <Link
              href={`/classes/${classId}/sequences/${result.id}`}
              className="px-4 py-1.5 border border-stone-300 text-stone-700 text-sm rounded-md hover:bg-stone-100 transition-colors"
            >
              Edit / add notes →
            </Link>
          </div>
          <SequencePreview data={result} className={className} />
          <button onClick={() => setResult(null)} className="mt-6 text-sm text-stone-400 hover:text-stone-600">
            ← Generate another
          </button>
        </>
      )}
    </div>
  );
}
