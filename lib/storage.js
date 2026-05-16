import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');
const SEQUENCES_DIR = join(DATA_DIR, 'sequences');
const CLASSES_FILE = join(DATA_DIR, 'classes.json');
const SESSIONS_FILE = join(DATA_DIR, 'sessions.json');

function ensureDirectories() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  if (!existsSync(SEQUENCES_DIR)) mkdirSync(SEQUENCES_DIR, { recursive: true });
}

function readJSON(filePath, defaultValue) {
  ensureDirectories();
  if (!existsSync(filePath)) return defaultValue;
  return JSON.parse(readFileSync(filePath, 'utf-8'));
}

function writeJSON(filePath, data) {
  ensureDirectories();
  writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export function getClasses() {
  return readJSON(CLASSES_FILE, { classes: [] });
}

export function saveClasses(data) {
  writeJSON(CLASSES_FILE, data);
}

export function getSessions() {
  return readJSON(SESSIONS_FILE, { sessions: [] });
}

export function saveSessions(data) {
  writeJSON(SESSIONS_FILE, data);
}

export function getLastNSessions(classId, n = 3) {
  const { sessions } = getSessions();
  return sessions
    .filter(s => s.class_id === classId)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, n);
}

export function saveSequence(date, classId, content) {
  ensureDirectories();
  const filename = `${date}-${classId}.txt`;
  const filePath = join(SEQUENCES_DIR, filename);
  writeFileSync(filePath, content, 'utf-8');
  return filePath;
}
