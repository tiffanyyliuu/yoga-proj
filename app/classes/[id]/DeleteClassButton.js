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
      className="text-sm text-red-400 hover:text-red-600 transition-colors"
    >
      Delete class
    </button>
  );
}
