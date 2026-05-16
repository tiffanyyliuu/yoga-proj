'use client';

import { useState } from 'react';
import { createClass } from './actions';

const LEVEL_OPTIONS = ['All Levels', 'Beginner-friendly', 'Mixed', 'Intermediate', 'Advanced'];
const VIBE_OPTIONS = ['Social / Chatty', 'Focused & Quiet', 'Athletic', 'Spiritual', 'Relaxed Pace', 'High Energy'];
const INJURY_OPTIONS = ['Lower back', 'Wrists', 'Knees', 'Shoulders', 'Neck', 'Hips', 'Seniors / accessibility', 'Prenatal'];

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

export default function NewClassPage() {
  const [name, setName] = useState('');
  const [level, setLevel] = useState('');
  const [size, setSize] = useState('');
  const [vibes, setVibes] = useState([]);
  const [injuries, setInjuries] = useState([]);
  const [customNote, setCustomNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function toggleVibe(v) {
    setVibes(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  }

  function toggleInjury(i) {
    setInjuries(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  }

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
    <div className="max-w-xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-light mb-8">Add New Class</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Class name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            required
            placeholder='e.g. "Tuesday 6pm Vinyasa"'
            className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Level</label>
          <div className="flex flex-wrap gap-2">
            {LEVEL_OPTIONS.map(opt => (
              <Tag key={opt} label={opt} selected={level === opt} onClick={() => setLevel(level === opt ? '' : opt)} />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Typical class size</label>
          <input
            type="number"
            value={size}
            onChange={e => setSize(e.target.value)}
            min="1"
            placeholder="e.g. 12"
            className="w-32 px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Vibe of this group</label>
          <div className="flex flex-wrap gap-2">
            {VIBE_OPTIONS.map(opt => (
              <Tag key={opt} label={opt} selected={vibes.includes(opt)} onClick={() => toggleVibe(opt)} />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Recurring student needs / injuries</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {INJURY_OPTIONS.map(opt => (
              <Tag key={opt} label={opt} selected={injuries.includes(opt)} onClick={() => toggleInjury(opt)} />
            ))}
          </div>
          <input
            value={customNote}
            onChange={e => setCustomNote(e.target.value)}
            placeholder="Anything else..."
            className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!name || submitting}
            className="px-6 py-2 bg-stone-800 text-white text-sm rounded-md hover:bg-stone-700 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Saving…' : 'Save class'}
          </button>
          <a
            href="/dashboard"
            className="px-6 py-2 border border-stone-300 text-stone-600 text-sm rounded-md hover:bg-stone-100 transition-colors inline-block"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
