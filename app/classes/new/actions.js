'use server';

import { redirect } from 'next/navigation';
import { createClient } from '../../../lib/supabase/server';

export async function createClass(formData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data, error } = await supabase.from('classes').insert({
    user_id: user.id,
    name: formData.get('name'),
    level: formData.get('level') || null,
    size: parseInt(formData.get('size')) || null,
    class_type: formData.get('class_type') || null,
    time_of_day: formData.get('time_of_day') || null,
    vibe: formData.get('vibe') || null,
    recurring_notes: formData.get('recurring_notes') || null,
  }).select().single();

  if (error) {
    throw new Error(error.message);
  }

  redirect(`/classes/${data.id}`);
}
