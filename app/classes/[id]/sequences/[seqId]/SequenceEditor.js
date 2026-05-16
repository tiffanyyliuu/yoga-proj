'use client';

import { useState } from 'react';
import Link from 'next/link';
import { updateSequence, deleteSequence } from './actions';

function Field({ value, onChange, placeholder, multiline, className: cx = '' }) {
  const base = `w-full px-2 py-1 rounded border border-transparent hover:border-stone-200 focus:border-stone-400 focus:outline-none text-sm transition-colors bg-transparent focus:bg-white ${cx}`;
  return multiline
    ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={2} className={base} />
    : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={base} />;
}

function PoseRow({ pose, onChange, onRemove }) {
  function set(field, val) { onChange({ ...pose, [field]: val }); }
  return (
    <div className="flex gap-3 group py-1">
      <div className="flex gap-1 shrink-0 items-center">
        <input value={pose.start || ''} onChange={e => set('start', e.target.value)} placeholder="0:00"
          className="w-12 px-1 py-1 rounded border border-transparent hover:border-stone-200 focus:border-stone-400 focus:outline-none text-xs font-mono text-stone-400 bg-transparent focus:bg-white" />
        <span className="text-stone-300 text-xs">–</span>
        <input value={pose.end || ''} onChange={e => set('end', e.target.value)} placeholder="2:00"
          className="w-12 px-1 py-1 rounded border border-transparent hover:border-stone-200 focus:border-stone-400 focus:outline-none text-xs font-mono text-stone-400 bg-transparent focus:bg-white" />
      </div>
      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="flex gap-2 items-baseline">
          <input value={pose.name || ''} onChange={e => set('name', e.target.value)} placeholder="Pose name"
            className="flex-1 px-2 py-1 rounded border border-transparent hover:border-stone-200 focus:border-stone-400 focus:outline-none text-sm font-medium text-stone-800 bg-transparent focus:bg-white" />
          <input value={pose.reps || ''} onChange={e => set('reps', e.target.value)} placeholder="×3"
            className="w-12 px-1 py-1 rounded border border-transparent hover:border-stone-200 focus:border-stone-400 focus:outline-none text-xs text-stone-400 bg-transparent focus:bg-white" />
        </div>
        <input value={pose.modification || ''} onChange={e => set('modification', e.target.value || null)} placeholder="Modification (optional)"
          className="w-full px-2 py-0.5 rounded border border-transparent hover:border-stone-200 focus:border-stone-400 focus:outline-none text-xs text-amber-600 placeholder-stone-300 bg-transparent focus:bg-white" />
        <input value={pose.student_note || ''} onChange={e => set('student_note', e.target.value || null)} placeholder="Student note (optional)"
          className="w-full px-2 py-0.5 rounded border border-transparent hover:border-stone-200 focus:border-stone-400 focus:outline-none text-xs text-blue-500 placeholder-stone-300 bg-transparent focus:bg-white" />
      </div>
      <button type="button" onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-400 text-lg leading-none shrink-0 transition-opacity self-start mt-1">
        ×
      </button>
    </div>
  );
}

export default function SequenceEditor({ sequence, classId, className }) {
  const [data, setData] = useState(sequence.sequence_data);
  const [notes, setNotes] = useState(sequence.after_class_notes || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const date = new Date(sequence.generated_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  function updateSection(i, field, val) {
    setData(d => { const s = [...d.sections]; s[i] = { ...s[i], [field]: val }; return { ...d, sections: s }; });
    setSaved(false);
  }

  function updatePose(si, pi, newPose) {
    setData(d => {
      const sections = [...d.sections];
      const poses = [...sections[si].poses];
      poses[pi] = newPose;
      sections[si] = { ...sections[si], poses };
      return { ...d, sections };
    });
    setSaved(false);
  }

  function addPose(si) {
    setData(d => {
      const sections = [...d.sections];
      sections[si] = { ...sections[si], poses: [...sections[si].poses, { start: '', end: '', name: '', reps: null, modification: null, student_note: null }] };
      return { ...d, sections };
    });
    setSaved(false);
  }

  function removePose(si, pi) {
    setData(d => {
      const sections = [...d.sections];
      sections[si] = { ...sections[si], poses: sections[si].poses.filter((_, i) => i !== pi) };
      return { ...d, sections };
    });
    setSaved(false);
  }

  function addSection() {
    setData(d => ({
      ...d,
      sections: [...d.sections, { name: 'NEW SECTION', duration_min: 5, poses: [{ start: '', end: '', name: '', reps: null, modification: null, student_note: null }] }],
    }));
    setSaved(false);
  }

  function removeSection(si) {
    setData(d => ({ ...d, sections: d.sections.filter((_, i) => i !== si) }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    await updateSequence(sequence.id, classId, data, notes);
    setSaving(false);
    setSaved(true);
  }

  async function handleDelete() {
    if (!confirm("Delete this sequence? This can't be undone.")) return;
    setDeleting(true);
    await deleteSequence(sequence.id, classId);
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
        <div className="max-w-3xl mx-auto flex items-start justify-between">
          <div>
            <p className="text-stone-500 text-xs tracking-[0.15em] uppercase mb-2">{className} — {date}</p>
            <h1 className="font-serif text-4xl font-light">{data.theme || 'Sequence'}</h1>
            {data.intention && <p className="text-stone-400 mt-2 text-sm">{data.intention}</p>}
            <p className="text-stone-600 text-xs mt-4">Click any field to edit</p>
          </div>
          <div className="flex gap-2 shrink-0 ml-6">
            <button onClick={handleSave} disabled={saving}
              className="px-5 py-2 bg-stone-100 text-stone-900 text-sm rounded-full hover:bg-white transition-colors disabled:opacity-50 font-medium">
              {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save'}
            </button>
            <button onClick={handleDelete} disabled={deleting}
              className="px-5 py-2 border border-stone-700 text-stone-400 text-sm rounded-full hover:border-red-500 hover:text-red-400 transition-colors disabled:opacity-50">
              Delete
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-4">
        {/* Sequence card */}
        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
          {/* Theme / Intention editable header */}
          <div className="bg-stone-50 border-b border-stone-200 px-6 py-5 space-y-2">
            <div className="flex gap-3 items-center">
              <span className="text-stone-400 text-sm w-20 shrink-0">Theme</span>
              <Field value={data.theme || ''} onChange={v => { setData(d => ({ ...d, theme: v })); setSaved(false); }} placeholder="Theme" className="font-medium text-stone-800" />
            </div>
            <div className="flex gap-3 items-center">
              <span className="text-stone-400 text-sm w-20 shrink-0">Intention</span>
              <Field value={data.intention || ''} onChange={v => { setData(d => ({ ...d, intention: v })); setSaved(false); }} placeholder="Intention" className="text-stone-600" />
            </div>
          </div>

          {/* Sections */}
          <div className="divide-y divide-stone-100">
            {data.sections?.map((section, si) => (
              <div key={si} className="px-6 py-5">
                <div className="flex items-center justify-between mb-4 group">
                  <div className="flex items-center gap-3">
                    <input value={section.name || ''} onChange={e => updateSection(si, 'name', e.target.value)}
                      className="text-xs font-semibold tracking-widest text-stone-400 uppercase bg-transparent border border-transparent rounded px-1 hover:border-stone-200 focus:border-stone-400 focus:outline-none" />
                    <div className="flex items-center gap-1">
                      <input type="number" value={section.duration_min || ''} onChange={e => updateSection(si, 'duration_min', parseInt(e.target.value) || 0)}
                        className="w-10 text-xs text-stone-300 text-right bg-transparent border border-transparent rounded px-1 hover:border-stone-200 focus:border-stone-400 focus:outline-none" />
                      <span className="text-xs text-stone-300">min</span>
                    </div>
                  </div>
                  <button type="button" onClick={() => removeSection(si)}
                    className="opacity-0 group-hover:opacity-100 text-xs text-red-400 hover:text-red-600 transition-opacity">
                    Remove
                  </button>
                </div>

                <div className="border-t border-stone-100 pt-3 space-y-1">
                  {section.poses?.map((pose, pi) => (
                    <PoseRow key={pi} pose={pose} onChange={p => updatePose(si, pi, p)} onRemove={() => removePose(si, pi)} />
                  ))}
                  <button type="button" onClick={() => addPose(si)}
                    className="text-xs text-stone-300 hover:text-stone-500 mt-2 transition-colors">
                    + Add pose
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 pb-5">
            <button type="button" onClick={addSection}
              className="w-full py-3 border border-dashed border-stone-200 rounded-xl text-sm text-stone-400 hover:border-stone-400 hover:text-stone-600 transition-colors">
              + Add section
            </button>
          </div>

          {/* Why this sequence */}
          <div className="border-t border-stone-200 bg-stone-50 px-6 py-5">
            <p className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-2">Why this sequence</p>
            <Field value={data.closing_note || ''} onChange={v => { setData(d => ({ ...d, closing_note: v })); setSaved(false); }}
              placeholder="Notes on why this sequence was chosen..." multiline className="text-stone-500 leading-relaxed" />
          </div>
        </div>

        {/* After class notes */}
        <div className="bg-white border border-stone-200 rounded-2xl px-6 py-6">
          <p className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-3">After class notes</p>
          <textarea value={notes} onChange={e => { setNotes(e.target.value); setSaved(false); }} rows={4}
            placeholder="How did it go? What worked, what to change next time, student feedback..."
            className="w-full text-sm text-stone-600 bg-transparent border border-transparent rounded-lg hover:border-stone-200 focus:border-stone-400 focus:outline-none resize-none px-2 py-1 transition-colors" />
        </div>

        <div className="flex justify-end pt-2">
          <button onClick={handleSave} disabled={saving}
            className="px-8 py-3 bg-stone-950 text-white text-sm rounded-full hover:bg-stone-800 transition-colors disabled:opacity-50 font-medium">
            {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save changes'}
          </button>
        </div>
      </main>
    </div>
  );
}
