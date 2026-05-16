'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClass } from './actions';
import ThemeToggle from '../../components/ThemeToggle';

const LEVEL_OPTIONS = ['All Levels', 'Beginner-friendly', 'Mixed', 'Intermediate', 'Advanced'];
const VIBE_OPTIONS = ['Social / Chatty', 'Focused & Quiet', 'Athletic', 'Spiritual', 'Relaxed Pace', 'High Energy'];
const INJURY_OPTIONS = ['Lower back', 'Wrists', 'Knees', 'Shoulders', 'Neck', 'Hips', 'Seniors / accessibility', 'Prenatal'];

function Tag({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm border transition-colors ${
        selected
          ? 'bg-stone-900 border-stone-900 text-white dark:bg-stone-100 dark:border-stone-100 dark:text-stone-900'
          : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-400 dark:hover:border-stone-500'
      }`}
    >
      {label}
    </button>
  );
}

export default function NewClassPage() {
  const [name, setName] = useState('');
  const [level, setLevel] = useState('');
  const [size, setSize] = useState('');
  const [vibes, setVibes] = useState([]);
  const [injuries, setInjuries] = useState([]);
  const [customNote, setCustomNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function toggleVibe(v) { setVibes(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]); }
  function toggleInjury(i) { setInjuries(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    const allNotes = [...injuries, ...(customNote.trim() ? [customNote.trim()] : [])];
    const formData = new FormData();
    formData.append('name', name);
    formData.append('level', level);
    formData.append('size', size);
    formData.append('vibe', vibes.join(', '));
    formData.append('recurring_notes', allNotes.join(', '));
    await createClass(formData);
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <header className="bg-stone-950 text-stone-100 px-8 py-5 flex items-center justify-between">
        <Link href="/dashboard" className="font-serif text-xl tracking-wide">Sequence</Link>
        <div className="flex items-center gap-4">
          <ThemeToggle className="text-stone-500 hover:text-stone-300" />
          <Link href="/dashboard" className="text-stone-500 hover:text-stone-300 text-sm transition-colors">
            ← Dashboard
          </Link>
        </div>
      </header>

      <div className="bg-stone-900 text-stone-100 px-8 py-10">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl font-light">Add new class</h1>
          <p className="text-stone-500 text-sm mt-2">Set this up once and it informs every sequence you generate.</p>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <form onSubmit={handleSubmit} className="space-y-10">
          <div>
            <label className="block text-xs font-semibold tracking-widest text-stone-400 dark:text-stone-500 uppercase mb-3">Class name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder='e.g. "Tuesday 6pm Vinyasa"'
              className="w-full px-4 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-600 focus:outline-none focus:border-stone-400 dark:focus:border-stone-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-widest text-stone-400 dark:text-stone-500 uppercase mb-3">Level</label>
            <div className="flex flex-wrap gap-2">
              {LEVEL_OPTIONS.map(opt => (
                <Tag key={opt} label={opt} selected={level === opt} onClick={() => setLevel(level === opt ? '' : opt)} />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-widest text-stone-400 dark:text-stone-500 uppercase mb-3">Typical class size</label>
            <input
              type="number"
              value={size}
              onChange={e => setSize(e.target.value)}
              min="1"
              placeholder="e.g. 12"
              className="w-32 px-4 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-600 focus:outline-none focus:border-stone-400 dark:focus:border-stone-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-widest text-stone-400 dark:text-stone-500 uppercase mb-3">Vibe of this group</label>
            <div className="flex flex-wrap gap-2">
              {VIBE_OPTIONS.map(opt => (
                <Tag key={opt} label={opt} selected={vibes.includes(opt)} onClick={() => toggleVibe(opt)} />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-widest text-stone-400 dark:text-stone-500 uppercase mb-3">Recurring student needs / injuries</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {INJURY_OPTIONS.map(opt => (
                <Tag key={opt} label={opt} selected={injuries.includes(opt)} onClick={() => toggleInjury(opt)} />
              ))}
            </div>
            <input
              value={customNote}
              onChange={e => setCustomNote(e.target.value)}
              placeholder="Anything else..."
              className="w-full px-4 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-600 focus:outline-none focus:border-stone-400 dark:focus:border-stone-500 transition-colors"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={!name || submitting}
              className="px-8 py-3 bg-stone-950 text-white text-sm rounded-full hover:bg-stone-800 transition-colors disabled:opacity-50 font-medium"
            >
              {submitting ? 'Saving…' : 'Save class'}
            </button>
            <Link
              href="/dashboard"
              className="px-8 py-3 border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 text-sm rounded-full hover:border-stone-500 dark:hover:border-stone-500 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
