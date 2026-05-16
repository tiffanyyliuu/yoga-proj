import readline from 'readline';
import { getClasses, saveClasses } from '../lib/storage.js';

function ask(rl, question) {
  return new Promise(resolve => rl.question(question, resolve));
}

function generateId(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export async function addClassCommand() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  try {
    console.log('\n=== Add New Class Profile ===\n');

    const name = await ask(rl, 'Class name (e.g., "Tuesday 6pm Vinyasa"): ');
    const level = await ask(rl, 'Level and mix (e.g., "mixed — mostly intermediate, one advanced"): ');
    const sizeStr = await ask(rl, 'Typical class size: ');
    const vibe = await ask(rl, 'Vibe/energy of this group: ');
    const recurring_notes = await ask(rl, 'Recurring student needs, injuries, or notes: ');

    const suggestedId = generateId(name.trim());
    const idInput = await ask(rl, `Class ID [${suggestedId}]: `);
    const id = idInput.trim() || suggestedId;

    const { classes } = getClasses();

    if (classes.find(c => c.id === id)) {
      console.log(`\nA class with ID "${id}" already exists. Edit data/classes.json to update it.`);
      return;
    }

    const newClass = {
      id,
      name: name.trim(),
      level: level.trim(),
      size: parseInt(sizeStr) || 0,
      vibe: vibe.trim(),
      recurring_notes: recurring_notes.trim(),
      last_updated: new Date().toISOString().split('T')[0]
    };

    classes.push(newClass);
    saveClasses({ classes });

    console.log(`\n✓ Class "${newClass.name}" saved.`);
    console.log(`  ID: ${id}`);
    console.log(`  Generate a sequence: node index.js generate --class ${id}`);
  } finally {
    rl.close();
  }
}
