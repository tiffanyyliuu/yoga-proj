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
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="mb-8">
        <Link href="/dashboard" className="text-stone-400 text-sm hover:text-stone-600">← All classes</Link>
        <div className="flex items-start justify-between mt-3">
          <div>
            <h1 className="text-2xl font-light">{cls.name}</h1>
            <p className="text-stone-500 text-sm mt-1">{cls.level}</p>
          </div>
          <DeleteClassButton classId={cls.id} className={cls.name} />
        </div>
      </div>

      <Link
        href={`/classes/${cls.id}/generate`}
        className="flex items-center justify-center py-3 px-4 bg-stone-800 text-white text-sm rounded-md hover:bg-stone-700 transition-colors mb-8"
      >
        Generate new sequence
      </Link>

      <div className="bg-white border border-stone-200 rounded-lg p-5 mb-8 space-y-3">
        {cls.vibe && (
          <div>
            <span className="text-xs font-medium text-stone-400 uppercase tracking-wide">Vibe</span>
            <p className="text-sm text-stone-700 mt-1">{cls.vibe}</p>
          </div>
        )}
        {cls.recurring_notes && (
          <div>
            <span className="text-xs font-medium text-stone-400 uppercase tracking-wide">Recurring notes</span>
            <p className="text-sm text-stone-700 mt-1">{cls.recurring_notes}</p>
          </div>
        )}
        {cls.size && (
          <div>
            <span className="text-xs font-medium text-stone-400 uppercase tracking-wide">Size</span>
            <p className="text-sm text-stone-700 mt-1">{cls.size} students</p>
          </div>
        )}
      </div>

      <h2 className="text-lg font-light mb-4">Sequences</h2>

      {!sequences?.length && (
        <p className="text-stone-400 text-sm">No sequences generated yet.</p>
      )}

      <div className="space-y-3">
        {sequences?.map(seq => {
          const date = new Date(seq.generated_at).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
          });
          return (
            <Link
              key={seq.id}
              href={`/classes/${cls.id}/sequences/${seq.id}`}
              className="block p-4 bg-white border border-stone-200 rounded-lg hover:border-stone-400 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-sm">{seq.theme || 'Untitled sequence'}</p>
                  {seq.intention && <p className="text-stone-500 text-xs mt-0.5">{seq.intention}</p>}
                  {seq.after_class_notes && (
                    <p className="text-stone-400 text-xs mt-2 line-clamp-1">Notes: {seq.after_class_notes}</p>
                  )}
                </div>
                <span className="text-stone-400 text-xs shrink-0 ml-4">{date}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
