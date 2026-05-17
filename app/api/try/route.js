import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a yoga sequence designer. Generate a 60-minute class sequence tailored to the provided context.
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
          "student_note": "optional note"
        }
      ]
    }
  ],
  "closing_note": "Why this sequence works and what to watch for"
}
Section names: ARRIVE & GROUND, WARM UP, BUILD, PEAK, COOL DOWN, SAVASANA
Set reps, modification, and student_note to null when not applicable.`;

export async function POST(request) {
  try {
    const { context } = await request.json();

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: `Generate a 60-minute yoga sequence. Context: ${context || 'A balanced, grounding class for a mixed-level group.'}` }],
    });

    const text = response.content[0].text;
    const jsonText = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    const data = JSON.parse(jsonText);

    return Response.json(data);
  } catch (err) {
    console.error('Try generate error:', err);
    return new Response('Generation failed', { status: 500 });
  }
}
