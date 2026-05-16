import Anthropic from '@anthropic-ai/sdk';
import fetch from 'node-fetch';

const client = new Anthropic({ fetch });

const SYSTEM_PROMPT = `You are a yoga sequence designer who knows this teacher's specific classes and students deeply.
You generate sequences that are personalized to the actual people in the room, not generic level/theme templates.
Always account for recurring injuries, student preferences, and what has or hasn't worked in recent sessions.
Output format: pose name, duration/reps, brief teacher cue, any modifications needed.`;

export async function generateSequence(classProfile, recentSessions, todayContext) {
  const sessionHistory = recentSessions.length > 0
    ? recentSessions.map(s => `Date: ${s.date}
Sequence taught: ${Array.isArray(s.sequence_taught) ? s.sequence_taught.join(', ') : s.sequence_taught}
Teacher notes: ${s.teacher_notes || 'None'}
Student feedback: ${s.student_feedback || 'None'}`).join('\n\n')
    : 'No previous sessions recorded yet.';

  const userMessage = `Class profile:
${JSON.stringify(classProfile, null, 2)}

Recent session history (last ${recentSessions.length} classes):
${sessionHistory}

Today's context from teacher: ${todayContext || 'No specific context provided.'}

Generate a 60-minute sequence for this class.`;

  let fullText = '';

  const stream = client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }]
  });

  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      process.stdout.write(event.delta.text);
      fullText += event.delta.text;
    }
  }

  process.stdout.write('\n');
  return fullText;
}
