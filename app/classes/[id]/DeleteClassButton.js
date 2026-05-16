'use client';

import { deleteClass } from './actions';

export default function DeleteClassButton({ classId, className }) {
  async function handleDelete() {
    if (!confirm(`Delete "${className}" and all its sequences? This can't be undone.`)) return;
    await deleteClass(classId);
  }

  return (
    <button
      onClick={handleDelete}
      className="text-xs text-stone-600 border border-stone-700 px-4 py-2 rounded-full hover:border-red-500 hover:text-red-400 transition-colors"
    >
      Delete class
    </button>
  );
}
