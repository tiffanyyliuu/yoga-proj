'use client';

import { useState } from 'react';
import Link from 'next/link';
import { updateSequence, deleteSequence } from './actions';

function Field({ value, onChange, placeholder, multiline, className: cx = '' }) {
  const base = `w-full px-2 py-1 border border-transparent rounded hover:border-stone-200 focus:border-stone-400 focus:outline-none text-sm transition-colors bg-transparent focus:bg-white ${cx}`;
  return multiline
    ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={2} className={base} />
    : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={base} />;
}

function PoseRow({ pose, onChange, onRemove }) {
  function set(field, val) { onChange({ ...pose, [field]: val }); }
  return (
    <div className="flex gap-3 group">
      <div className="flex gap-1 shrink-0">
        <input value={pose.start || ''} onChange={e => set('start', e.target.value)} placeholder="0:00" className="w-12 px-1 py-1 border border-transparent rounded hover:border-stone-200 focus:border-stone-400 focus:outline-none text-xs font-mono text-stone-400 bg-transparent focus:bg-white" />
        <span className="text-stone-300 self-center text-xs">–</span>
        <input value={pose.end || ''} onChange={e => set('end', e.target.value)} placeholder="2:00" className="w-12 px-1 py-1 border border-transparent rounded hover:border-stone-200 focus:border-stone-400 focus:outline-none text-xs font-mono text-stone-400 bg-transparent focus:bg-white" />
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex gap-2 items-baseline">
          <input value={pose.name || ''} onChange={e => set('name', e.target.value)} placeholder="Pose name" className="flex-1 px-2 py-1 border border-transparent rounded hover:border-stone-200 focus:border-stone-400 focus:outline-none text-sm font-medium text-stone-800 bg-transparent focus:bg-white" />
          <input value={pose.reps || ''} onChange={e => set('reps', e.target.value)} placeholder="×3" className="w-12 px-1 py-1 border border-transparent rounded hover:border-stone-200 focus:border-stone-400 focus:outline-none text-xs text-stone-500 bg-transparent focus:bg-white" />
        </div>
        <input value={pose.modification || ''} onChange={e => set('modification', e.target.value || null)} placeholder="Modification (optional)" className="w-full px-2 py-0.5 border border-transparent rounded hover:border-stone-200 focus:border-stone-400 focus:outline-none text-xs text-amber-700 placeholder-stone-300 bg-transparent focus:bg-white" />
        <input value={pose.student_note || ''} onChange={e => set('student_note', e.target.value || null)} placeholder="Student note (optional)" className="w-full px-2 py-0.5 border border-transparent rounded hover:border-stone-200 focus:border-stone-400 focus:outline-none text-xs text-blue-600 placeholder-stone-300 bg-transparent focus:bg-white" />
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-400 text-lg leading-none shrink-0 transition-opacity"
        title="Remove pose"
      >×</button>
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
    setData(d => {
      const sections = [...d.sections];
      sections[i] = { ...sections[i], [field]: val };
      return { ...d, sections };
    });
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
      sections[si] = {
        ...sections[si],
        poses: [...sections[si].poses, { start: '', end: '', name: '', reps: null, modification: null, student_note: null }],
      };
      return { ...d, sections };
    });
    setSaved(false);
  }

  function removePose(si, pi) {
    setData(d => {
      const sections = [...d.sections];
      const poses = sections[si].poses.filter((_, i) => i !== pi);
      sections[si] = { ...sections[si], poses };
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
    if (!confirm('Delete this sequence? This can\'t be undone.')) return;
    setDeleting(true);
    await deleteSequence(sequence.id, classId);
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="flex items-start justify-between mb-8">
        <div>
          <Link href={`/classes/${classId}`} className="text-stone-400 text-sm hover:text-stone-600">← Back to class</Link>
          <h1 className="text-xl font-light mt-2 text-stone-500">{className} — {date}</h1>
          <p className="text-xs text-stone-400 mt-1">Click any field to edit</p>
        </div>
        <div className="flex gap-2 mt-1">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-1.5 bg-stone-800 text-white text-sm rounded-md hover:bg-stone-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save'}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-1.5 border border-red-200 text-red-500 text-sm rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-lg overflow-hidden mb-6">
        {/* Header */}
        <div className="border-b-2 border-stone-800 px-6 py-5 bg-stone-50">
          <div className="space-y-2">
            <div className="flex gap-3 items-center">
              <span className="text-stone-400 text-sm w-20 shrink-0">Theme</span>
              <Field value={data.theme || ''} onChange={v => { setData(d => ({ ...d, theme: v })); setSaved(false); }} placeholder="Theme" className="font-medium" />
            </div>
            <div className="flex gap-3 items-center">
              <span className="text-stone-400 text-sm w-20 shrink-0">Intention</span>
              <Field value={data.intention || ''} onChange={v => { setData(d => ({ ...d, intention: v })); setSaved(false); }} placeholder="Intention" />
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="divide-y divide-stone-100">
          {data.sections?.map((section, si) => (
            <div key={si} className="px-6 py-5">
              <div className="flex items-center justify-between mb-3 group">
                <div className="flex items-center gap-3 flex-1">
                  <input
                    value={section.name || ''}
                    onChange={e => updateSection(si, 'name', e.target.value)}
                    className="font-mono text-xs font-bold tracking-widest text-stone-500 uppercase bg-transparent border border-transparent rounded px-1 hover:border-stone-200 focus:border-stone-400 focus:outline-none"
                  />
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={section.duration_min || ''}
                      onChange={e => updateSection(si, 'duration_min', parseInt(e.target.value) || 0)}
                      className="w-10 text-xs text-stone-400 text-right bg-transparent border border-transparent rounded px-1 hover:border-stone-200 focus:border-stone-400 focus:outline-none"
                    />
                    <span className="text-xs text-stone-400">min</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeSection(si)}
                  className="opacity-0 group-hover:opacity-100 text-xs text-red-400 hover:text-red-600 transition-opacity"
                >
                  Remove section
                </button>
              </div>

              <div className="border-t border-stone-100 pt-3 space-y-3">
                {section.poses?.map((pose, pi) => (
                  <PoseRow
                    key={pi}
                    pose={pose}
                    onChange={newPose => updatePose(si, pi, newPose)}
                    onRemove={() => removePose(si, pi)}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => addPose(si)}
                  className="text-xs text-stone-400 hover:text-stone-600 mt-2"
                >
                  + Add pose
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 pb-4">
          <button
            type="button"
            onClick={addSection}
            className="text-sm text-stone-400 hover:text-stone-600 border border-dashed border-stone-300 rounded px-4 py-2 w-full hover:border-stone-400 transition-colors"
          >
            + Add section
          </button>
        </div>

        {/* Closing note */}
        <div className="border-t-2 border-stone-800 px-6 py-5 bg-stone-50">
          <p className="font-mono text-xs font-bold tracking-widest text-stone-400 uppercase mb-2">Why this sequence</p>
          <Field
            value={data.closing_note || ''}
            onChange={v => { setData(d => ({ ...d, closing_note: v })); setSaved(false); }}
            placeholder="Notes on why this sequence was chosen..."
            multiline
            className="text-stone-600 leading-relaxed"
          />
        </div>
      </div>

      {/* After class notes */}
      <div className="bg-white border border-stone-200 rounded-lg px-6 py-5">
        <p className="font-mono text-xs font-bold tracking-widest text-stone-400 uppercase mb-3">After class notes</p>
        <textarea
          value={notes}
          onChange={e => { setNotes(e.target.value); setSaved(false); }}
          rows={4}
          placeholder="How did it go? What worked, what to change next time, student feedback..."
          className="w-full text-sm text-stone-700 bg-transparent border border-transparent rounded hover:border-stone-200 focus:border-stone-400 focus:outline-none resize-none px-2 py-1"
        />
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-stone-800 text-white text-sm rounded-md hover:bg-stone-700 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}
