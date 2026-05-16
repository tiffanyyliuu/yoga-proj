'use server';

import { createClient } from '../../../../../lib/supabase/server';
import { redirect } from 'next/navigation';

export async function updateSequence(id, classId, sequenceData, afterClassNotes) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  await supabase
    .from('generated_sequences')
    .update({
      theme: sequenceData.theme,
      intention: sequenceData.intention,
      sequence_data: sequenceData,
      after_class_notes: afterClassNotes,
    })
    .eq('id', id)
    .eq('user_id', user.id);
}

export async function deleteSequence(id, classId) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  await supabase
    .from('generated_sequences')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  redirect(`/classes/${classId}`);
}
