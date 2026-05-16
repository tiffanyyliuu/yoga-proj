import { logSession } from './actions';
import Link from 'next/link';

export default function LogSessionPage({ params }) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <div className="mb-8">
        <Link href={`/classes/${params.id}`} className="text-stone-400 text-sm hover:text-stone-600">
          ← Back to class
        </Link>
        <h1 className="text-2xl font-light mt-3">Log Session</h1>
      </div>

      <form action={logSession} className="space-y-5">
        <input type="hidden" name="classId" value={params.id} />

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Date
          </label>
          <input
            name="date"
            type="date"
            defaultValue={today}
            className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Sequence taught
          </label>
          <textarea
            name="sequence_taught"
            rows={4}
            placeholder="Comma-separated poses, or paste your sequence"
            className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Teacher notes
          </label>
          <textarea
            name="teacher_notes"
            rows={3}
            placeholder="What worked, what didn't, anything to remember"
            className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Student feedback
          </label>
          <textarea
            name="student_feedback"
            rows={2}
            placeholder="How did students respond?"
            className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-2 bg-stone-800 text-white text-sm rounded-md hover:bg-stone-700 transition-colors"
          >
            Save session
          </button>
          <Link
            href={`/classes/${params.id}`}
            className="px-6 py-2 border border-stone-300 text-stone-600 text-sm rounded-md hover:bg-stone-100 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
