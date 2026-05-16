import Link from 'next/link';
import { createClient } from '../../../lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import DeleteClassButton from './DeleteClassButton';

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
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-stone-950 text-stone-100 px-8 py-5 flex items-center justify-between">
        <Link href="/dashboard" className="font-serif text-xl tracking-wide">Sequence</Link>
        <Link href="/dashboard" className="text-stone-500 hover:text-stone-300 text-sm transition-colors">
          ← All classes
        </Link>
      </header>

      {/* Class hero */}
      <div className="bg-stone-900 text-stone-100 px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-stone-500 text-xs tracking-[0.15em] uppercase mb-3">{cls.level}</p>
              <h1 className="font-serif text-5xl font-light">{cls.name}</h1>
              {cls.size && <p className="text-stone-500 text-sm mt-3">{cls.size} students</p>}
            </div>
            <DeleteClassButton classId={cls.id} className={cls.name} />
          </div>

          {(cls.vibe || cls.recurring_notes) && (
            <div className="mt-8 pt-8 border-t border-stone-800 grid sm:grid-cols-2 gap-6">
              {cls.vibe && (
                <div>
                  <p className="text-stone-500 text-xs tracking-[0.15em] uppercase mb-1">Vibe</p>
                  <p className="text-stone-300 text-sm">{cls.vibe}</p>
                </div>
              )}
              {cls.recurring_notes && (
                <div>
                  <p className="text-stone-500 text-xs tracking-[0.15em] uppercase mb-1">Recurring notes</p>
                  <p className="text-stone-300 text-sm">{cls.recurring_notes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Generate CTA */}
        <Link
          href={`/classes/${cls.id}/generate`}
          className="flex items-center justify-between w-full px-6 py-5 bg-stone-950 text-stone-100 rounded-2xl hover:bg-stone-800 transition-colors mb-12 group"
        >
          <div>
            <p className="font-serif text-xl font-light">Generate new sequence</p>
            <p className="text-stone-500 text-sm mt-0.5">Tailored to today's class</p>
          </div>
          <span className="text-stone-500 group-hover:text-stone-300 text-xl transition-colors">→</span>
        </Link>

        {/* Sequences */}
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-serif text-3xl font-light">Sequences</h2>
          <span className="text-stone-400 text-sm">{sequences?.length ?? 0} total</span>
        </div>

        {!sequences?.length && (
          <div className="text-center py-16 border border-dashed border-stone-300 rounded-2xl">
            <p className="font-serif text-2xl text-stone-400 mb-2">No sequences yet</p>
            <p className="text-stone-400 text-sm">Generate your first sequence above.</p>
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
                className="group flex items-center justify-between p-6 bg-white border border-stone-200 rounded-2xl hover:border-stone-400 hover:shadow-sm transition-all"
              >
                <div>
                  <p className="font-serif text-xl font-light group-hover:text-stone-600 transition-colors">
                    {seq.theme || 'Untitled sequence'}
                  </p>
                  {seq.intention && <p className="text-stone-400 text-sm mt-0.5">{seq.intention}</p>}
                  {seq.after_class_notes && (
                    <p className="text-stone-300 text-xs mt-2 line-clamp-1">Notes: {seq.after_class_notes}</p>
                  )}
                </div>
                <div className="text-right shrink-0 ml-6">
                  <p className="text-stone-400 text-xs">{date}</p>
                  <p className="text-stone-300 text-xs mt-1 group-hover:text-stone-500 transition-colors">Edit →</p>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
