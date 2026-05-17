import Link from 'next/link';
import { createClient } from '../../../lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import DeleteClassButton from './DeleteClassButton';
import ThemeToggle from '../../components/ThemeToggle';

export const dynamic = 'force-dynamic';

export default async function ClassDetailPage({ params }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: cls } = await supabase
    .from('classes')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (!cls) notFound();

  const { data: sequences } = await supabase
    .from('generated_sequences')
    .select('id, theme, intention, after_class_notes, generated_at')
    .eq('class_id', cls.id)
    .order('generated_at', { ascending: false });

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <header className="bg-stone-950 text-stone-100 px-8 py-5 flex items-center justify-between">
        <Link href="/dashboard" className="font-serif text-xl tracking-wide">Sequence</Link>
        <div className="flex items-center gap-4">
          <ThemeToggle className="text-stone-500 hover:text-stone-300" />
          <Link href="/dashboard" className="text-stone-500 hover:text-stone-300 text-sm transition-colors">
            ← All classes
          </Link>
        </div>
      </header>

      <div className="bg-stone-900 text-stone-100 px-6 sm:px-8 py-10 sm:py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-stone-500 text-xs tracking-[0.15em] uppercase mb-3">{cls.level}</p>
              <h1 className="font-serif text-3xl sm:text-5xl font-light break-words">{cls.name}</h1>
              {cls.size && <p className="text-stone-500 text-sm mt-3">{cls.size} students</p>}
            </div>
            <div className="shrink-0 mt-1">
              <DeleteClassButton classId={cls.id} className={cls.name} />
            </div>
          </div>

          {(cls.class_type || cls.time_of_day || cls.vibe || cls.recurring_notes) && (
            <div className="mt-8 pt-8 border-t border-stone-800 grid sm:grid-cols-2 gap-6">
              {cls.class_type && (
                <div>
                  <p className="text-stone-500 text-xs tracking-[0.15em] uppercase mb-1">Class type</p>
                  <p className="text-stone-300 text-sm">{cls.class_type}</p>
                </div>
              )}
              {cls.time_of_day && (
                <div>
                  <p className="text-stone-500 text-xs tracking-[0.15em] uppercase mb-1">Time of day</p>
                  <p className="text-stone-300 text-sm">{cls.time_of_day}</p>
                </div>
              )}
              {cls.vibe && (
                <div>
                  <p className="text-stone-500 text-xs tracking-[0.15em] uppercase mb-1">Vibe</p>
                  <p className="text-stone-300 text-sm">{cls.vibe}</p>
                </div>
              )}
              {cls.recurring_notes && (
                <div>
                  <p className="text-stone-500 text-xs tracking-[0.15em] uppercase mb-1">Recurring needs</p>
                  <p className="text-stone-300 text-sm">{cls.recurring_notes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <Link
          href={`/classes/${cls.id}/generate`}
          className="flex items-center justify-between w-full px-6 py-5 bg-stone-950 text-stone-100 rounded-2xl hover:bg-stone-800 transition-colors mb-12 group"
        >
          <div>
            <p className="font-serif text-xl font-light">Generate new sequence</p>
            <p className="text-stone-500 text-sm mt-0.5">Tailored to today&apos;s class</p>
          </div>
          <span className="text-stone-500 group-hover:text-stone-300 text-xl transition-colors">→</span>
        </Link>

        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-serif text-3xl font-light text-stone-900 dark:text-stone-100">Sequences</h2>
          <span className="text-stone-400 dark:text-stone-500 text-sm">{sequences?.length ?? 0} total</span>
        </div>

        {!sequences?.length && (
          <div className="text-center py-16 border border-dashed border-stone-300 dark:border-stone-700 rounded-2xl">
            <p className="font-serif text-2xl text-stone-400 dark:text-stone-500 mb-2">No sequences yet</p>
            <p className="text-stone-400 dark:text-stone-500 text-sm">Generate your first sequence above.</p>
          </div>
        )}

        <div className="space-y-3">
          {sequences?.map(seq => {
            const date = new Date(seq.generated_at).toLocaleDateString('en-US', {
              month: 'long', day: 'numeric', year: 'numeric',
            });
            return (
              <Link
                key={seq.id}
                href={`/classes/${cls.id}/sequences/${seq.id}`}
                className="group block p-5 sm:p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl hover:border-stone-400 dark:hover:border-stone-500 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-serif text-xl font-light text-stone-900 dark:text-stone-100 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors truncate">
                      {seq.theme || 'Untitled sequence'}
                    </p>
                    {seq.intention && <p className="text-stone-400 dark:text-stone-500 text-sm mt-0.5 line-clamp-2">{seq.intention}</p>}
                    {seq.after_class_notes && (
                      <p className="text-stone-300 dark:text-stone-600 text-xs mt-2 line-clamp-1">Notes: {seq.after_class_notes}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-stone-400 dark:text-stone-500 text-xs">{date}</p>
                    <p className="text-stone-300 dark:text-stone-600 text-xs mt-1 group-hover:text-stone-500 transition-colors">Edit →</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
