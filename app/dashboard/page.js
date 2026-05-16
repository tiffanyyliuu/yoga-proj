import Link from 'next/link';
import { createClient } from '../../lib/supabase/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: classes } = await supabase
    .from('classes')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light">Your Classes</h1>
          <p className="text-stone-500 text-sm mt-1">{user.email}</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/classes/new"
            className="px-4 py-2 bg-stone-800 text-white text-sm rounded-md hover:bg-stone-700 transition-colors"
          >
            + New class
          </Link>
          <form action="/auth/signout" method="POST">
            <button
              type="submit"
              className="px-4 py-2 border border-stone-300 text-stone-600 text-sm rounded-md hover:bg-stone-100 transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>

      {classes?.length === 0 && (
        <div className="text-center py-16 text-stone-400">
          <p className="text-lg">No classes yet.</p>
          <p className="text-sm mt-2">Add your first class to get started.</p>
        </div>
      )}

      <div className="space-y-3">
        {classes?.map(cls => (
          <Link
            key={cls.id}
            href={`/classes/${cls.id}`}
            className="block p-5 bg-white border border-stone-200 rounded-lg hover:border-stone-400 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-medium">{cls.name}</h2>
                <p className="text-stone-500 text-sm mt-1">{cls.level}</p>
                {cls.recurring_notes && (
                  <p className="text-stone-400 text-xs mt-2 line-clamp-1">{cls.recurring_notes}</p>
                )}
              </div>
              <span className="text-stone-400 text-sm">{cls.size ? `${cls.size} students` : ''}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
