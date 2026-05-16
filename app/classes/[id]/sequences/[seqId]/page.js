import { createClient } from '../../../../../lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import SequenceEditor from './SequenceEditor';

export default async function SequencePage({ params }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: seq } = await supabase
    .from('generated_sequences')
    .select('*')
    .eq('id', params.seqId)
    .eq('user_id', user.id)
    .single();

  if (!seq) notFound();

  const { data: cls } = await supabase
    .from('classes')
    .select('name')
    .eq('id', params.id)
    .single();

  return (
    <SequenceEditor
      sequence={seq}
      classId={params.id}
      className={cls?.name || ''}
    />
  );
}
