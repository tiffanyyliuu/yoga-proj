'use server';

import { redirect } from 'next/navigation';
import { createClient } from '../../../../lib/supabase/server';

export async function logSession(formData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const classId = formData.get('classId');
  const sequenceRaw = formData.get('sequence_taught') || '';
  const sequenceTaught = sequenceRaw.includes(',')
    ? sequenceRaw.split(',').map(s => s.trim()).filter(Boolean)
    : [sequenceRaw.trim()].filter(Boolean);

  const { error } = await supabase.from('sessions').insert({
    class_id: classId,
    user_id: user.id,
    date: formData.get('date'),
    sequence_taught: sequenceTaught,
    teacher_notes: formData.get('teacher_notes') || null,
    student_feedback: formData.get('student_feedback') || null,
  });

  if (error) throw new Error(error.message);

  redirect(`/classes/${classId}`);
}
