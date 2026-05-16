import { createClient } from '../../../../lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import GenerateClient from './GenerateClient';

export default async function GeneratePage({ params }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: cls } = await supabase
    .from('classes')
    .select('name')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (!cls) notFound();

  return <GenerateClient classId={params.id} className={cls.name} />;
}
