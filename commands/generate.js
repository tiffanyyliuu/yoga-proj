import readline from 'readline';
import { getClasses, getLastNSessions, saveSequence } from '../lib/storage.js';
import { generateSequence } from '../lib/claude.js';

function ask(rl, question) {
  return new Promise(resolve => rl.question(question, resolve));
}

export async function generateCommand(classId) {
  const { classes } = getClasses();
  const classProfile = classes.find(c => c.id === classId);

  if (!classProfile) {
    console.error(`\nNo class found with ID "${classId}".`);
    console.error('Add a class first: node index.js add-class');
    process.exit(1);
  }

  const recentSessions = getLastNSessions(classId, 3);

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  try {
    const todayContext = await ask(rl, `\nAny context for today's ${classProfile.name}? (press Enter to skip): `);

    console.log(`\n=== Generating sequence for ${classProfile.name} ===`);
    if (recentSessions.length > 0) {
      console.log(`Using last ${recentSessions.length} session(s) as context.\n`);
    } else {
      console.log('No past sessions yet — generating from class profile.\n');
    }

    const sequence = await generateSequence(classProfile, recentSessions, todayContext.trim());

    const save = await ask(rl, '\nSave to file? (y/n): ');
    if (save.trim().toLowerCase() === 'y') {
      const date = new Date().toISOString().split('T')[0];
      const filePath = saveSequence(date, classId, sequence);
      console.log(`Saved to: ${filePath}`);
    }
  } finally {
    rl.close();
  }
}
