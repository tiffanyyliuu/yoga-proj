import Link from 'next/link';
import { createClient } from '../../lib/supabase/server';
import { redirect } from 'next/navigation';
import ThemeToggle from '../components/ThemeToggle';

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
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <header className="bg-stone-950 text-stone-100 px-8 py-5 flex items-center justify-between">
        <span className="font-serif text-xl tracking-wide">Sequence</span>
        <div className="flex items-center gap-5">
          <ThemeToggle className="text-stone-500 hover:text-stone-300" />
          <span className="text-stone-500 text-xs hidden sm:block">{user.email}</span>
          <Link
            href="/classes/new"
            className="px-4 py-2 bg-stone-100 text-stone-900 text-sm rounded-full hover:bg-white transition-colors font-medium"
          >
            + New class
          </Link>
          <form action="/auth/signout" method="POST">
            <button type="submit" className="text-stone-500 hover:text-stone-300 text-sm transition-colors">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-14">
        <div className="mb-12">
          <h1 className="font-serif text-5xl font-light text-stone-900 dark:text-stone-100">Your classes</h1>
          <p className="text-stone-400 dark:text-stone-500 text-sm mt-2">{classes?.length ?? 0} class{classes?.length !== 1 ? 'es' : ''}</p>
        </div>

        {classes?.length === 0 && (
          <div className="text-center py-20 border border-dashed border-stone-300 dark:border-stone-700 rounded-2xl">
            <p className="font-serif text-2xl text-stone-400 dark:text-stone-500 mb-2">No classes yet</p>
            <p className="text-stone-400 dark:text-stone-500 text-sm mb-8">Add your first class to start generating sequences.</p>
            <Link
              href="/classes/new"
              className="px-6 py-2.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-sm rounded-full hover:bg-stone-700 dark:hover:bg-white transition-colors"
            >
              Add a class
            </Link>
          </div>
        )}

        <div className="space-y-3">
          {classes?.map(cls => (
            <Link
              key={cls.id}
              href={`/classes/${cls.id}`}
              className="group flex items-center justify-between p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl hover:border-stone-400 dark:hover:border-stone-500 hover:shadow-sm transition-all"
            >
              <div>
                <h2 className="font-serif text-xl font-light text-stone-900 dark:text-stone-100 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors">{cls.name}</h2>
                <p className="text-stone-400 dark:text-stone-500 text-sm mt-1">{cls.level}</p>
                {cls.recurring_notes && (
                  <p className="text-stone-300 dark:text-stone-600 text-xs mt-2 line-clamp-1">{cls.recurring_notes}</p>
                )}
              </div>
              <div className="text-right shrink-0 ml-6">
                {cls.size && <p className="text-stone-400 dark:text-stone-500 text-sm">{cls.size} students</p>}
                <p className="text-stone-300 dark:text-stone-600 text-xs mt-1 group-hover:text-stone-400 dark:group-hover:text-stone-400 transition-colors">View →</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
