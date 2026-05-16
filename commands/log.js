import readline from 'readline';
import { getClasses, getSessions, saveSessions } from '../lib/storage.js';

function ask(rl, question) {
  return new Promise(resolve => rl.question(question, resolve));
}

export async function logCommand(classId) {
  const { classes } = getClasses();
  const classProfile = classes.find(c => c.id === classId);

  if (!classProfile) {
    console.error(`\nNo class found with ID "${classId}".`);
    console.error('Add a class first: node index.js add-class');
    process.exit(1);
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  try {
    console.log(`\n=== Log session for ${classProfile.name} ===\n`);

    const today = new Date().toISOString().split('T')[0];
    const dateInput = await ask(rl, `Date [${today}]: `);
    const date = dateInput.trim() || today;

    const sequenceInput = await ask(rl, 'Sequence taught (comma-separated poses, or paste from file): ');
    const notes = await ask(rl, 'Teacher notes (what worked, what didn\'t): ');
    const feedback = await ask(rl, 'Student feedback: ');

    const sequenceTaught = sequenceInput.includes(',')
      ? sequenceInput.split(',').map(s => s.trim()).filter(Boolean)
      : [sequenceInput.trim()];

    const { sessions } = getSessions();

    sessions.push({
      id: `session-${Date.now()}`,
      class_id: classId,
      date,
      sequence_taught: sequenceTaught,
      teacher_notes: notes.trim(),
      student_feedback: feedback.trim()
    });

    saveSessions({ sessions });

    console.log(`\n✓ Session logged for ${classProfile.name} on ${date}.`);
    console.log('  This will be used as context for your next generated sequence.');
  } finally {
    rl.close();
  }
}
