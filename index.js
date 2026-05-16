#!/usr/bin/env node
import { Command } from 'commander';
import { addClassCommand } from './commands/add-class.js';
import { generateCommand } from './commands/generate.js';
import { logCommand } from './commands/log.js';

const program = new Command();

program
  .name('yoga-planner')
  .description('AI-powered yoga sequence planner that learns your classes and students')
  .version('1.0.0');

program
  .command('add-class')
  .description('Add a new recurring class profile')
  .action(addClassCommand);

program
  .command('generate')
  .description('Generate a sequence for a class using past session context')
  .requiredOption('--class <class-id>', 'Class ID (e.g., tuesday-6pm)')
  .action(cmd => generateCommand(cmd.class));

program
  .command('log')
  .description('Log a session you just taught')
  .requiredOption('--class <class-id>', 'Class ID (e.g., tuesday-6pm)')
  .action(cmd => logCommand(cmd.class));

program.parse();
