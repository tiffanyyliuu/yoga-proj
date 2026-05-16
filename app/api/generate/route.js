import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '../../../lib/supabase/server';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a yoga sequence designer who knows this teacher's specific classes and students deeply.
Generate sequences personalized to the actual people in the room — not generic templates.
Always account for recurring injuries, student preferences, and what has or hasn't worked in recent sessions.

Respond with ONLY valid JSON. No other text before or after. Use this exact structure:
{
  "theme": "theme name",
  "intention": "one-phrase intention",
  "sections": [
    {
      "name": "SECTION NAME",
      "duration_min": 5,
      "poses": [
        {
          "start": "0:00",
          "end": "2:00",
          "name": "Pose Name",
          "reps": "×3",
          "modification": "optional modification text",
          "student_note": "optional specific student note"
        }
      ]
    }
  ],
  "closing_note": "Why this sequence, what to watch for, what to try next time"
}

Section names: ARRIVE & GROUND, WARM UP, BUILD, PEAK, COOL DOWN, SAVASANA
Set reps, modification, and student_note to null when not applicable.`;

export async function POST(request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return new Response('Unauthorized', { status: 401 });

  const { classId, context } = await request.json();

  const { data: cls } = await supabase
    .from('classes').select('*').eq('id', classId).eq('user_id', user.id).single();

  if (!cls) return new Response('Class not found', { status: 404 });

  const { data: prevSequences } = await supabase
    .from('generated_sequences')
    .select('theme, intention, sequence_data, after_class_notes, generated_at')
    .eq('class_id', classId)
    .order('generated_at', { ascending: false })
    .limit(3);

  const history = prevSequences?.length > 0
    ? prevSequences.map(s => `Date: ${s.generated_at.split('T')[0]}
Theme: ${s.theme} — Intention: ${s.intention}
After-class notes: ${s.after_class_notes || 'None'}`).join('\n\n')
    : 'No previous sequences recorded yet.';

  const userMessage = `Class profile:
${JSON.stringify(cls, null, 2)}

Recent sequences (last ${prevSequences?.length ?? 0}):
${history}

Today's context from teacher: ${context || 'No specific context provided.'}

Generate a 60-minute sequence for this class.`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  });

  const text = response.content[0].text;
  const jsonText = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();

  let sequenceData;
  try {
    sequenceData = JSON.parse(jsonText);
  } catch (e) {
    console.error('JSON parse failed. Raw Claude output:\n', text);
    return new Response('Failed to parse sequence from Claude', { status: 500 });
  }

  const { data: saved, error } = await supabase
    .from('generated_sequences')
    .insert({
      class_id: classId,
      user_id: user.id,
      theme: sequenceData.theme,
      intention: sequenceData.intention,
      sequence_data: sequenceData,
    })
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    return new Response(`DB error: ${error.message}`, { status: 500 });
  }

  return Response.json({ id: saved.id, ...sequenceData });
}
