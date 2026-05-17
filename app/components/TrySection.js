'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import YogaLoader from './YogaLoader';

const THEMES = [
  'Grounded Presence', 'Inner Compass', 'Root & Rise', 'Soft Strength', 'Gentle Power',
  'Open Awareness', 'Moving Intentionally', 'Sacred Pause', "Beginner's Mind", 'Fluid Balance',
  'Steady Breath', 'Quiet Courage', 'Deep Listening', 'Spaciousness', 'Tender Resilience',
  'Radiant Energy', 'Present Moment', 'Effortless Ease', 'Playful Flow', 'Soul Expansion',
  'Inner Stillness', 'Courageous Heart', 'Emotional Alchemy', 'Trust Yourself', 'Mindful Movement',
  'Rest & Restore', 'Flow State', 'Wild Softness', 'Openheartedness', 'Intentional Living',
];
const FOCUSES = [
  'Hip Opening', 'Heart Opening', 'Backbends', 'Twists', 'Forward Folds',
  'Core Strength', 'Balance & Stability', 'Inversions', 'Arm Balances', 'Standing Poses',
  'Seated Practice', 'Restorative / Floor', 'Shoulder Opening', 'Hamstrings', 'Hip Flexors',
  'Lower Back Care', 'Wrist-Free', 'Pranayama Focus',
];
const ENERGIES = ['Low — needs warming up', 'Medium — steady', 'High — ready to work'];
const SPECIALS = [
  'New student(s)', 'Injury mentioned today', 'Pregnancy in room', 'Senior students present',
  'Kids or teens in class', 'Post-holiday / long break', 'First class back after illness',
  'Shorter class', 'Longer class', 'Student-requested focus',
  'High stress / heavy energy', 'Low energy room', 'Post-event / tired bodies',
  'Mixed levels today', 'Outdoor class', 'Hot / heated room',
  'No props available', 'Virtual / online class', 'Corporate / office setting', 'Celebratory occasion',
];

function Tag({ label, selected, onClick }) {
  return (
    <button type="button" onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm border transition-colors ${
        selected
          ? 'bg-stone-900 dark:bg-stone-100 border-stone-900 dark:border-stone-100 text-white dark:text-stone-900'
          : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-400 dark:hover:border-stone-500'
      }`}>
      {label}
    </button>
  );
}

function SequenceResult({ data }) {
  return (
    <div className="border border-stone-200 dark:border-stone-700 rounded-2xl overflow-hidden">
      <div className="bg-stone-950 text-stone-100 px-6 pt-7 pb-9">
        <h3 className="font-serif text-3xl font-light leading-snug mb-2">{data.theme}</h3>
        {data.intention && <p className="text-stone-400 text-sm">{data.intention}</p>}
      </div>

      <div className="divide-y divide-stone-100 dark:divide-stone-800 bg-white dark:bg-stone-900">
        {data.sections?.map(section => (
          <div key={section.name} className="px-5 sm:px-7 py-6">
            <div className="flex items-baseline justify-between mb-4">
              <h4 className="font-serif text-lg font-light text-stone-700 dark:text-stone-300">{section.name}</h4>
              <span className="text-stone-300 dark:text-stone-600 text-xs ml-4 shrink-0">{section.duration_min} min</span>
            </div>
            <div className="space-y-4">
              {section.poses?.map((pose, i) => (
                <div key={i} className="flex gap-4">
                  <span className="text-xs text-stone-300 dark:text-stone-600 shrink-0 pt-0.5 whitespace-nowrap">{pose.start}–{pose.end}</span>
                  <div className="min-w-0 overflow-hidden">
                    <p className="text-stone-800 dark:text-stone-200 text-sm font-medium break-words">
                      {pose.name}{pose.reps && <span className="text-stone-400 dark:text-stone-500 text-xs font-normal ml-2">{pose.reps}</span>}
                    </p>
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

export default function TrySection() {
  const sectionRef = useRef(null);
  const [themes, setThemes] = useState([]);
  const [focuses, setFocuses] = useState([]);
  const [energy, setEnergy] = useState('');
  const [specials, setSpecials] = useState([]);
  const [customNote, setCustomNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  function toggle(set) { return val => set(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]); }

  async function handleGenerate() {
    setLoading(true);
    setResult(null);
    setError('');
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const contextParts = [
      themes.length > 0 && `Theme: ${themes.join(', ')}`,
      focuses.length > 0 && `Focus areas: ${focuses.join(', ')}`,
      energy && `Group energy: ${energy}`,
      specials.length > 0 && `Special notes: ${specials.join(', ')}`,
      customNote.trim(),
    ].filter(Boolean);

    try {
      const res = await fetch('/api/try', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: contextParts.join('. ') || '' }),
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
    <section ref={sectionRef} id="try" className="px-8 sm:px-12 py-20 border-t border-stone-100 dark:border-stone-800">
      <div className="max-w-3xl">
        <p className="text-[11px] tracking-[0.2em] uppercase text-stone-400 dark:text-stone-500 mb-3">Try it yourself</p>
        <h2 className="font-serif text-4xl sm:text-5xl font-light mb-2">Generate a sequence</h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm mb-10">No account needed. Sign up to save it to a class.</p>

        {!result && !loading && (
          <div className="space-y-8">
            <div>
              <p className="text-[11px] font-semibold tracking-widest text-stone-400 dark:text-stone-500 uppercase mb-3">Theme for today</p>
              <div className="flex flex-wrap gap-2">
                {THEMES.map(t => <Tag key={t} label={t} selected={themes.includes(t)} onClick={() => toggle(setThemes)(t)} />)}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-widest text-stone-400 dark:text-stone-500 uppercase mb-3">Focus</p>
              <div className="flex flex-wrap gap-2">
                {FOCUSES.map(f => <Tag key={f} label={f} selected={focuses.includes(f)} onClick={() => toggle(setFocuses)(f)} />)}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-widest text-stone-400 dark:text-stone-500 uppercase mb-3">Group energy</p>
              <div className="flex flex-wrap gap-2">
                {ENERGIES.map(e => <Tag key={e} label={e} selected={energy === e} onClick={() => setEnergy(energy === e ? '' : e)} />)}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-widest text-stone-400 dark:text-stone-500 uppercase mb-3">Anything special?</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {SPECIALS.map(s => <Tag key={s} label={s} selected={specials.includes(s)} onClick={() => toggle(setSpecials)(s)} />)}
              </div>
              <input value={customNote} onChange={e => setCustomNote(e.target.value)} placeholder="Other notes..."
                className="w-full px-4 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-600 focus:outline-none focus:border-stone-400 dark:focus:border-stone-500 transition-colors" />
            </div>
            <button onClick={handleGenerate}
              className="px-8 py-3.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-sm rounded-full hover:bg-stone-700 dark:hover:bg-white transition-colors">
              Generate sequence
            </button>
          </div>
        )}

        {loading && <YogaLoader />}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {result && (
          <div>
            <SequenceResult data={result} />
            <div className="mt-8 p-5 border border-stone-100 dark:border-stone-800 rounded-2xl bg-stone-50 dark:bg-stone-900">
              <p className="text-sm text-stone-700 dark:text-stone-300 font-medium mb-1">Want to keep this?</p>
              <p className="text-sm text-stone-400 dark:text-stone-500 mb-4">
                Create a free account to set up your class profile — then every sequence you generate is saved, personalised to your students, and learns from your notes over time.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <Link href="/login"
                  className="px-7 py-3 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-sm rounded-full hover:bg-stone-700 dark:hover:bg-white transition-colors">
                  Create a free account →
                </Link>
                <button onClick={() => { setResult(null); setThemes([]); setFocuses([]); setEnergy(''); setSpecials([]); setCustomNote(''); }}
                  className="text-sm text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors">
                  ← Try different options
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
