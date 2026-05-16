'use server';

import { createClient } from '../../../lib/supabase/server';
import { redirect } from 'next/navigation';

export async function deleteClass(classId) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  await supabase
    .from('classes')
    .delete()
    .eq('id', classId)
    .eq('user_id', user.id);

  redirect('/dashboard');
}
